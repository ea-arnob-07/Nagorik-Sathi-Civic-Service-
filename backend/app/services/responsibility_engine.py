import math
from typing import Any, Dict, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.geography import Ward, Asset
from app.models.department import Department, Officer
from app.models.service import ResponsibilityRule
from app.config import settings


class ResponsibilityEngineService:
    """Explainable ward, asset and department responsibility lookup."""

    CATEGORY_ROUTING = {
        "water": ("water", "water"),
        "road_transport": ("road", "road"),
        "road": ("road", "road"),
        "waste": ("waste", "waste"),
        "electricity": ("street_light", "street_light"),
        "street_light": ("street_light", "street_light"),
        "healthcare": ("healthcare", "healthcare"),
        "food": ("food", "food"),
        "drainage": ("drain", "drain"),
        "drain": ("drain", "drain"),
    }

    @staticmethod
    def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        radius = 6371000
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        value = (
            math.sin(delta_phi / 2) ** 2
            + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
        )
        return radius * 2 * math.atan2(math.sqrt(value), math.sqrt(1 - value))

    @classmethod
    async def match_responsibility(
        cls,
        db: AsyncSession,
        latitude: float,
        longitude: float,
        primary_category: str,
        secondary_categories: List[str] | None = None,
    ) -> Dict[str, Any]:
        secondary_categories = secondary_categories or []
        department_code, rule_category = cls.CATEGORY_ROUTING.get(
            primary_category, ("unassigned", primary_category)
        )

        wards_result = await db.execute(select(Ward))
        wards = wards_result.scalars().all()
        matched_ward = min(
            wards,
            key=lambda ward: cls.calculate_haversine_distance(
                latitude, longitude, ward.center_latitude, ward.center_longitude
            ),
            default=None,
        )

        matched_asset = None
        if matched_ward:
            assets_result = await db.execute(select(Asset).where(Asset.ward_id == matched_ward.id))
            assets = assets_result.scalars().all()
            nearby_assets = [
                (
                    cls.calculate_haversine_distance(latitude, longitude, asset.latitude, asset.longitude),
                    asset,
                )
                for asset in assets
            ]
            nearby_assets = [item for item in nearby_assets if item[0] <= 500]
            if nearby_assets:
                matched_asset = min(nearby_assets, key=lambda item: item[0])[1]

        rule_result = await db.execute(
            select(ResponsibilityRule).where(
                ResponsibilityRule.problem_category == rule_category,
                ResponsibilityRule.is_active.is_(True),
            )
        )
        matched_rule = rule_result.scalars().first()

        department = None
        if matched_rule:
            department_result = await db.execute(
                select(Department).where(Department.id == matched_rule.department_id)
            )
            department = department_result.scalar_one_or_none()
        if department is None and department_code != "unassigned":
            department_result = await db.execute(
                select(Department).where(Department.code == department_code, Department.is_active.is_(True))
            )
            department = department_result.scalar_one_or_none()

        if department:
            department_code = department.code
            department_name_bn = department.name_bn
            department_id = department.id
        else:
            department_code = "unassigned"
            department_name_bn = "ওয়ার্ড ডেস্কের মাধ্যমে বিভাগ নির্ধারণ প্রয়োজন"
            department_id = None

        matched_officer = None
        if department_id:
            officer_query = select(Officer).where(
                Officer.department_id == department_id,
                Officer.is_active.is_(True),
            )
            if matched_ward:
                officer_query = officer_query.where(Officer.ward_id == matched_ward.id)
            officer_result = await db.execute(officer_query)
            matched_officer = officer_result.scalars().first()
            if not matched_officer:
                fallback_result = await db.execute(
                    select(Officer).where(
                        Officer.department_id == department_id,
                        Officer.is_active.is_(True),
                    )
                )
                matched_officer = fallback_result.scalars().first()

        reasons = []
        if matched_ward:
            reasons.append(
                f"• ঘটনাটি {matched_ward.ward_name_bn} ({matched_ward.ward_number} নং ওয়ার্ড) এর অন্তর্গত।"
            )
        if matched_asset:
            reasons.append(
                f"• অবস্থানটি {matched_asset.name_bn} (কোড: {matched_asset.asset_code}) এর সন্নিকটে।"
            )
        if matched_rule:
            reasons.append(
                f"• '{matched_rule.name_bn}' বিধিমালা অনুযায়ী {department_name_bn} প্রধান দায়িত্বপ্রাপ্ত।"
            )
        elif department:
            reasons.append(
                f"• '{primary_category}' ক্যাটাগরির দায়িত্ব তালিকা অনুযায়ী {department_name_bn} নির্বাচন করা হয়েছে।"
            )
        else:
            reasons.append("• নির্ভরযোগ্য বিভাগীয় দায়িত্ব পাওয়া যায়নি; ওয়ার্ড ডেস্কের যাচাই প্রয়োজন।")
        if secondary_categories:
            reasons.append("• একাধিক সমস্যা শনাক্ত হয়েছে; প্রয়োজন হলে সহযোগী বিভাগ যুক্ত করা যাবে।")

        if not department:
            confidence = 0.42
        else:
            confidence = 0.76
            if matched_ward:
                confidence += 0.06
            if matched_rule:
                confidence += 0.08
            if matched_asset:
                confidence += 0.04
            confidence = min(confidence, 0.94)

        threshold = settings.ROUTING_CONFIDENCE_GATE_DEFAULT
        passed_gate = confidence >= threshold

        return {
            "department_id": department_id,
            "department_code": department_code,
            "department_name_bn": department_name_bn,
            "matched_ward_id": matched_ward.id if matched_ward else None,
            "matched_ward_name_bn": matched_ward.ward_name_bn if matched_ward else "অনির্ধারিত ওয়ার্ড",
            "matched_ward_number": matched_ward.ward_number if matched_ward else 0,
            "matched_asset_id": matched_asset.id if matched_asset else None,
            "matched_asset_code": matched_asset.asset_code if matched_asset else None,
            "matched_asset_name_bn": matched_asset.name_bn if matched_asset else None,
            "responsibility_rule_id": matched_rule.id if matched_rule else None,
            "responsibility_rule_code": matched_rule.rule_code if matched_rule else None,
            "responsibility_reason_bn": "\\n".join(reasons),
            "assigned_officer_id": matched_officer.id if matched_officer else None,
            "assigned_officer_name_bn": matched_officer.name_bn if matched_officer else "দায়িত্বপ্রাপ্ত কর্মকর্তা",
            "assigned_officer_designation": matched_officer.designation if matched_officer else "দায়িত্বপ্রাপ্ত কর্মকর্তা",
            "assigned_officer_phone": matched_officer.official_phone if matched_officer else "যোগাযোগ ওয়ার্ড ডেস্কের মাধ্যমে",
            "assigned_officer_email": matched_officer.official_email if matched_officer else None,
            "confidence_score": round(confidence, 2),
            "passed_gate": passed_gate,
            "requires_staff_verification": not passed_gate,
        }

# Refined module integration
