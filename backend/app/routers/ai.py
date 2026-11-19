import time
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.ai import AIJob, AIPrediction, AIJobStatusEnum
from app.models.case import PriorityEnum
from app.services.ai_engine import AIEngineService
from app.services.responsibility_engine import ResponsibilityEngineService
from app.services.routing_gate import RoutingGateService
from app.schemas.ai import AIIntakeAnalysisRequest, AIIntakeAnalysisResponse, EnsemblePredictionRequest

router = APIR@router.post("/analyze-intake", response_model=AIIntakeAnalysisResponse)
async def analyze_intake_async_endpoint(
    req: AIIntakeAnalysisRequest,
    db: AsyncSession = Depends(get_db)
):
    start_time = time.time()
    analysis = AIEngineService.analyze_intake_text(req.raw_text_bn)

    ml_advisory = None
    try:
        from app.services.ensemble_service import predict_text
        ml_advisory = predict_text(req.raw_text_bn)
        predicted_category = ml_advisory["category"]["label"]
        if predicted_category in {
            "water", "road_transport", "waste", "electricity",
            "healthcare", "food", "drainage"
        } and ml_advisory["category"]["confidence"] >= 0.45:
            analysis["primary_category"] = predicted_category
            analysis["detected_categories"] = list(dict.fromkeys(
                [predicted_category, *analysis["detected_categories"]]
            ))
            analysis["secondary_categories"] = [
                category for category in analysis["detected_categories"]
                if category != predicted_category
            ]
        severity_label = ml_advisory["severity"]["label"]
        if not analysis["is_hazard"]:
            analysis["proposed_priority"] = {
                "low": PriorityEnum.LOW,
                "medium": PriorityEnum.MEDIUM,
                "high": PriorityEnum.HIGH,
            }.get(severity_label, analysis["proposed_priority"])
    except FileNotFoundError:
        pass

    lat = req.latitude if req.latitude is not None else 22.3569
    lon = req.longitude if req.longitude is not None else 91.7832
    responsibility = await ResponsibilityEngineService.match_responsibility(
        db=db,
        latitude=lat,
        longitude=lon,
        primary_category=analysis["primary_category"],
        secondary_categories=analysis["secondary_categories"],
    )

    model_confidence = (
        float(ml_advisory["category"]["confidence"])
        if ml_advisory else float(analysis["confidence_score"])
    )
    routing_confidence = min(float(responsibility["confidence_score"]), model_confidence)
    gate = await RoutingGateService.evaluate_safety_gate(
        db=db,
        confidence_score=routing_confidence,
        is_hazard=analysis["is_hazard"],
    )

    latency_ms = int((time.time() - start_time) * 1000)
    model_version = ml_advisory["model_version"] if ml_advisory else "keyword-fallback-2.0"
    ai_job = AIJob(
        job_type="intake_analysis",
        status=AIJobStatusEnum.COMPLETED,
        input_payload={"text": req.raw_text_bn, "lat": lat, "lon": lon},
        result_payload={
            "analysis": analysis,
            "text_model": ml_advisory,
            "responsibility": responsibility,
            "gate": gate,
        },
        provider_name="nagarik_sathi_six_model_text_ensemble" if ml_advisory else "nagarik_sathi_keyword_fallback",
        model_version=model_version,
        latency_ms=latency_ms,
    )
    db.add(ai_job)
    await db.flush()

    prediction = AIPrediction(
        job_id=ai_job.id,
        task_name="responsibility_routing",
        predicted_label=responsibility["department_code"],
        confidence_score=routing_confidence,
        passed_confidence_gate=gate["can_propose"],
        explanation_bn=responsibility["responsibility_reason_bn"],
    )
    db.add(prediction)
    await db.commit()

    category_result = ml_advisory["category"] if ml_advisory else {}
    return AIIntakeAnalysisResponse(
        job_id=ai_job.id,
        normalized_text_bn=analysis["normalized_text"],
        detected_categories=analysis["detected_categories"],
        primary_category=analysis["primary_category"],
        secondary_categories=analysis["secondary_categories"],
        proposed_priority=analysis["proposed_priority"],
        is_hazard=analysis["is_hazard"],
        hazard_reasons=analysis["hazard_reasons"],
        extracted_entities=analysis["extracted_entities"],
        recommended_department_code=responsibility["department_code"],
        recommended_department_name_bn=responsibility["department_name_bn"],
        responsibility_rule_code=responsibility["responsibility_rule_code"],
        responsibility_reason_bn=responsibility["responsibility_reason_bn"],
        nearest_asset_id=responsibility["matched_asset_id"],
        nearest_asset_code=responsibility["matched_asset_code"],
        nearest_asset_name_bn=responsibility["matched_asset_name_bn"],
        matched_ward_number=responsibility["matched_ward_number"],
        matched_ward_name_bn=responsibility["matched_ward_name_bn"],
        assigned_officer_name_bn=responsibility["assigned_officer_name_bn"],
        assigned_officer_designation=responsibility["assigned_officer_designation"],
        assigned_officer_phone=responsibility["assigned_officer_phone"],
        confidence_score=round(routing_confidence, 4),
        passed_confidence_gate=gate["can_propose"],
        requires_staff_verification=not gate["can_propose"],
        text_model_category=category_result.get("label"),
        text_model_confidence=category_result.get("confidence"),
        text_model_agreement=category_result.get("agreement"),
        text_model_review_required=ml_advisory["review_required"] if ml_advisory else True,
        latency_ms=latency_ms,
    )

@router.get("/model-status")
async def get_text_model_status():
    from app.services.ensemble_service import model_status

    return model_status()


@router.post("/ensemble-predict")
async def predict_with_text_ensemble(req: EnsemblePredictionRequest):
    from app.services.ensemble_service import predict_text

    text_value = req.text.strip()
    if len(text_value) < 8 or len(text_value) > 2000:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="অভিযোগের বিবরণ ৮ থেকে ২০০০ অক্ষরের মধ্যে হতে হবে।"
        )
    try:
        return predict_text(text_value)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/vision-predict")
async def predict_image_category(file: UploadFile = File(...)):
    from app.services.vision_service import predict_image

    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=415, detail="শুধু ছবি আপলোড করুন।")
    content = await file.read(10 * 1024 * 1024 + 1)
    if not content or len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="ছবির আকার ১০ MB-এর মধ্যে হতে হবে।")
    try:
        return predict_image(content)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail="Trained vision model এখনো configure করা হয়নি।") from exc
    except ImportError as exc:
        raise HTTPException(status_code=503, detail="Vision model চালাতে Pillow ও scikit-learn install করতে হবে।") from exc
    except (OSError, ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=422, detail="ছবিটি পড়া যায়নি বা model artifact-এর সঙ্গে মেলেনি।") from exc
