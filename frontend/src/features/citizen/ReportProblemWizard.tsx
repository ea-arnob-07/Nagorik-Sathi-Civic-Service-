import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../../context/CaseContext';
import { useAuth } from '../../context/AuthContext';
import { MediaUploader } from '../../components/media/MediaUploader';
import { VoiceRecorder } from '../../components/media/VoiceRecorder';
import { LocationPickerMap } from '../../components/maps/LocationPickerMap';
import { AiProposalCard } from '../../components/ai/AiProposalCard';
import { EnsembleInsightCard } from '../../components/ai/EnsembleInsightCard';
import { VisionInsightCard } from '../../components/ai/VisionInsightCard';
import { analyseCivicIntake, EnsembleAdvisory, VisionAdvisory } from '../../services/aiIntakeService';
import { PRIORITY_CONFIG } from '../../constants';
import { MediaAttachment, GeoLocation, AiExtractedDetail } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera
} from 'lucide-react';

export const ReportProblemWizard: React.FC = () => {
  const navigate = useNavigate();
  const { createNewCase } = useCases();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [description, setDescription] = useState('');
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [location, setLocation] = useState<GeoLocation>({
    lat: 23.8103,
    lng: 90.4125,
    address: 'মানচিত্রে অবস্থান নির্বাচন করুন',
    wardId: 0,
    wardName: 'ওয়ার্ড নির্বাচন প্রয়োজন',
    landmark: ''
  });
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiProposal, setAiProposal] = useState<AiExtractedDetail | null>(null);
  const [ensembleAdvisory, setEnsembleAdvisory] = useState<EnsembleAdvisory | null>(null);
  const [visionAdvisory, setVisionAdvisory] = useState<VisionAdvisory | null>(null);
  const [analysisSource, setAnalysisSource] = useState<'server' | 'local'>('local');

  const [createdCaseId, setCreatedCaseId] = useState<string>('');
  const [showInlineMap, setShowInlineMap] = useState<boolean>(false);
  const [gpsDetectedFromCamera, setGpsDetectedFromCamera] = useState<boolean>(false);

  const handleStep1Next = () => {
    if (description.trim().length < 8) {
      alert('ML বিশ্লেষণের জন্য কমপক্ষে ৮ অক্ষরের সমস্যার বিবরণ লিখুন। ছবি ও ভিডিও প্রমাণ হিসেবে যুক্ত করতে পারবেন।');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Next = async () => {
    if (!locationConfirmed) {
      alert('মানচিত্রে সমস্যার সঠিক অবস্থান পিন করে নিশ্চিত করুন।');
      return;
    }
    setCurrentStep(3);
    setIsAiAnalyzing(true);
    setAiProposal(null);
    setEnsembleAdvisory(null);
    setVisionAdvisory(null);

    try {
      const result = await analyseCivicIntake(description.trim(), location, attachments);
      setAiProposal(result.proposal);
      setAnalysisSource(result.source);
      setEnsembleAdvisory(result.ensemble);
      setVisionAdvisory(result.vision);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!aiProposal) return;
    const created = await createNewCase({
      citizenId: currentUser.id,
      title: description.slice(0, 50) || 'নাগরিক সেবা রিপোর্ট',
      description: description || 'ভয়েস ও ছবির মাধ্যমে দায়েরকৃত নাগরিক অভিযোগ',
      audioRecordingUrl: voiceAudioUrl || undefined,
      category: aiProposal.category,
      priority: aiProposal.proposedPriority,
      estimatedResolutionDays: 3,
      location: location,
      initialEvidence: attachments,
      aiAnalysis: aiProposal
    });

    setCreatedCaseId(created.id);
    setCurrentStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Wizard Progress Stepper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
          <span className={currentStep >= 1 ? 'text-emerald-500 font-bold' : ''}>{t('১. সমস্যার বিবরণ ও প্রমাণ', '1. Problem Details & Proof')}</span>
          <span className={currentStep >= 2 ? 'text-emerald-500 font-bold' : ''}>{t('২. মানচিত্রে অবস্থান', '2. Map Location')}</span>
          <span className={currentStep >= 3 ? 'text-emerald-500 font-bold' : ''}>{t('৩. ML বিশ্লেষণ', '3. AI NLP Analysis')}</span>
          <span className={currentStep >= 4 ? 'text-emerald-500 font-bold' : ''}>{t('৪. নিশ্চিতকরণ ও ট্র্যাকিং', '4. Confirmation & SLA')}</span>
        </div>
        <div className="w-full bg-[var(--bg)] border border-[var(--line)] h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Multimodal Intake */}
      {currentStep === 1 && (
        <div className="rounded-2xl bg-[var(--paper)] border border-[var(--line)] p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-light text-[var(--ink)]">
              {t('কী সমস্যা হয়েছে?', 'What is the civic issue?')}{' '}
              <strong className="font-semibold text-emerald-500">(Multimodal Intake)</strong>
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              {t(
                'সমস্যার বিবরণ লিখুন এবং প্রমাণ হিসেবে ছবি বা ভিডিও যুক্ত করুন। ক্যামেরা অনুমতি দিলে ছবির সঙ্গে GPS অবস্থান যুক্ত হবে।',
                'Describe the civic grievance and attach genuine photo or video evidence. Browser GPS location will be captured automatically.'
              )}
            </p>
          </div>

          {/* Text Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
              {t('সমস্যার বিবরণ (Text Description):', 'Problem Description (Bangla or English):')}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('যেমন: রাস্তার পাশের ড্রেনটি কয়েকদিন ধরে বন্ধ। বৃষ্টির পানি জমে যাচ্ছে...', 'e.g. Broken drainage pipe on the main street causing dirty water overflow for 3 days...')}
              className="w-full p-3.5 text-sm bg-[var(--bg)] text-[var(--ink)] placeholder-[var(--muted)] rounded-xl border border-[var(--line)] focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] p-3 text-[11px] leading-relaxed text-[var(--muted)]">
            <Camera className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <span>ছবি বর্তমানে প্রমাণ হিসেবে সংরক্ষিত হয়। বর্তমান ML ensemble লিখিত বিবরণ বিশ্লেষণ করে; ছবির ভেতরের বস্তু বা সমস্যা শনাক্ত করার vision model এখনো যুক্ত নেই।</span>
          </div>

          {/* Voice Note Recorder */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
              ভয়েস রেকর্ডার (মুখে বলুন):
            </label>
            <VoiceRecorder onRecordingComplete={url => setVoiceAudioUrl(url)} />
          </div>

          {/* Photo/Video Upload */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
              ছবি বা ভিডিও প্রমাণ সংযুক্ত করুন (ক্যামেরা ও লাইভ লোকেশন):
            </label>
            <MediaUploader
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              uploaderRole="citizen"
              currentLocation={location}
              onLocationDetected={loc => {
                setLocation(prev => ({
                  ...prev,
                  lat: loc.lat ?? prev.lat,
                  lng: loc.lng ?? prev.lng,
                  address: loc.address ?? prev.address
                }));
                setGpsDetectedFromCamera(true);
                setLocationConfirmed(true);
              }}
              onOpenMapPicker={() => setShowInlineMap(!showInlineMap)}
            />
          </div>

          {/* Live GPS Detected Banner / Quick Map Access */}
          {gpsDetectedFromCamera && (
            <div className="p-3.5 bg-[var(--green-light)] border border-[var(--line)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-[var(--ink)]">
                <MapPin className="w-4 h-4 text-[var(--green)] shrink-0" />
                <span>
                  ছবি যুক্ত করার সময় ডিভাইস GPS পাওয়া গেছে: <strong>{location.address}</strong> (অক্ষাংশ: {location.lat}, দ্রাঘিমাংশ: {location.lng})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowInlineMap(!showInlineMap)}
                className="px-3 py-1.5 rounded-lg bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] hover:text-[var(--green)] font-semibold text-xs transition cursor-pointer shadow-xs shrink-0"
              >
                {showInlineMap ? 'মানচিত্র লুকান' : 'মানচিত্রে অবস্থান যাচাই/পরিবর্তন'}
              </button>
            </div>
          )}

          {/* Inline Map Picker (if toggled in Step 1) */}
          {showInlineMap && (
            <div className="p-4 bg-[var(--bg)] border border-[var(--line)] rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[var(--green)]" />
                  মানচিত্রে অবস্থান পিন করুন
                </span>
                <button
                  type="button"
                  onClick={() => setShowInlineMap(false)}
                  className="text-[11px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  বন্ধ করুন ✕
                </button>
              </div>
              <LocationPickerMap
                location={location}
                onChangeLocation={nextLocation => {
                  setLocation(nextLocation);
                  setLocationConfirmed(true);
                }}
                height="320px"
              />
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-between items-center pt-4 border-t border-[var(--line)]">
            <span className="text-xs text-[var(--muted)]">
              {attachments.length > 0 ? `সংযুক্ত ফাইল: ${attachments.length} টি` : 'ফাইল বা বিবরণ যোগ করুন'}
            </span>
            <button
              type="button"
              onClick={handleStep1Next}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition cursor-pointer"
            >
              <span>{t('পরবর্তী: অবস্থান নিশ্চিতকরণ', 'Next: Location Pin')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location Confirmation */}
      {currentStep === 2 && (
        <div className="rounded-2xl bg-[var(--paper)] border border-[var(--line)] p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-light text-[var(--ink)]">
              {t('সমস্যাটি কি এই জায়গায়?', 'Confirm Problem Location')}{' '}
              <strong className="font-semibold text-emerald-500">(GIS Coordinates)</strong>
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              {t(
                'মানচিত্রে পিন টেনে সঠিক জায়গা চিহ্নিত করুন অথবা "বর্তমান GPS অবস্থান" বাটন চাপুন।',
                'Drag pin to exact street or tap "Current GPS" button to locate automatically.'
              )}
            </p>
          </div>

          <LocationPickerMap
            location={location}
            onChangeLocation={nextLocation => {
              setLocation(nextLocation);
              setLocationConfirmed(true);
            }}
            height="380px"
          />

          <div className="bg-[var(--bg)] p-4 rounded-xl border border-[var(--line)] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">{t('নির্দিষ্ট ঠিকানা:', 'Address:')}</span>
              <strong className="text-[var(--ink)]">{location.address}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">{t('ওয়ার্ড নম্বর:', 'Ward:')}</span>
              <strong className="text-emerald-500">{location.wardName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">{t('কোঅর্ডিনেট (GPS):', 'GPS Coordinates:')}</span>
              <span className="font-mono text-[var(--ink)]">{location.lat}, {location.lng}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('আগের ধাপ', 'Back')}</span>
            </button>

            <button
              type="button"
              onClick={handleStep2Next}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition cursor-pointer"
            >
              <span>{t('অবস্থান নিশ্চিত ও ML বিশ্লেষণ দেখুন', 'Confirm & Run AI Analysis')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI Analysis Proposal Review */}
      {currentStep === 3 && (
        <div className="rounded-2xl bg-[var(--paper)] border border-[var(--line)] p-6 space-y-6 shadow-sm">
      <div>
        <h2 className="text-xl font-light text-[var(--ink)]">
          {t('বিশ্লেষণ প্রস্তাবিত', 'AI Machine Learning')}{' '}
          <strong className="font-semibold text-emerald-500">{t('তথ্য পর্যালোচনা', 'Proposal Review')}</strong>
        </h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          {t(
            'লিখিত বিবরণ ও অবস্থানের ভিত্তিতে Civic rules এবং ছয়টি ML model-এর ফলাফল দেখুন। ছবি প্রমাণ হিসেবে সংযুক্ত থাকবে; চূড়ান্ত সিদ্ধান্ত কর্মকর্তা যাচাই করবেন।',
            'Synthesized results from 6-model Bangla NLP ensemble & GIS rules. Final routing remains verified by ward officials.'
          )}
        </p>
      </div>

      {isAiAnalyzing ? (
        <div className="p-8 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[var(--ink)]">
            {t('লিখিত অভিযোগ বিশ্লেষণ চলছে...', 'Analyzing complaint with 6-model AI ensemble...')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {aiProposal && <AiProposalCard proposal={aiProposal} sourceLabel={analysisSource === 'server' ? 'Server-side civic analysis' : 'Local rule-based fallback'} />}
          {ensembleAdvisory && <EnsembleInsightCard result={ensembleAdvisory} />}
          {visionAdvisory && <VisionInsightCard result={visionAdvisory} />}
          {!aiProposal && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">{t('বিশ্লেষণের ফল পাওয়া যায়নি। আগের ধাপে ফিরে গিয়ে আবার চেষ্টা করুন।', 'No analysis returned. Go back to step 1 and retry.')}</div>}
        </div>
      )}

      <div className="bg-[var(--bg)] p-4 rounded-xl border border-[var(--line)] text-xs flex items-center justify-between">
        <span className="text-[var(--muted)]">{t('এই তথ্যগুলো কি ঠিক আছে?', 'Are these details accurate?')}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="px-3 py-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--paper)] text-xs transition cursor-pointer"
          >
            {t('তথ্য পরিবর্তন করুন', 'Edit Information')}
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('পেছনে', 'Back')}</span>
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={!aiProposal || isAiAnalyzing}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t('সব ঠিক আছে, অভিযোগ জমা দিন', 'Submit Grievance to Ward')}</span>
        </button>
      </div>
    </div>
  )}

  {/* STEP 4: Submission Confirmation */}
  {currentStep === 4 && (
    <div className="rounded-2xl bg-[var(--paper)] border border-[var(--line)] p-8 text-center space-y-6 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-light text-[var(--ink)]">
          {t('অভিযোগ', 'Grievance')}{' '}
          <strong className="font-semibold text-emerald-500">{t('সফলভাবে জমা হয়েছে', 'Successfully Ingested')}</strong>
        </h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          {t(
            'আপনার অভিযোগটি সংশ্লিষ্ট ওয়ার্ড সেবা কেন্দ্র ও দায়িত্বপ্রাপ্ত বিভাগে পৌঁছানো হয়েছে।',
            'Your complaint has been submitted to the responsible ward desk and dispatched for departmental action.'
          )}
        </p>
      </div>

      <div className="max-w-md mx-auto bg-[var(--bg)] rounded-2xl p-5 border border-[var(--line)] text-left space-y-2.5 text-xs">
        <div className="flex justify-between pb-2 border-b border-[var(--line-subtle)]">
          <span className="text-[var(--muted)]">{t('কেস ট্র্যাকিং আইডি (Case ID):', 'Tracking Case ID:')}</span>
          <strong className="font-mono text-emerald-500 font-bold text-sm">{createdCaseId}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t('সমস্যার ধরন:', 'Category:')}</span>
          <span className="font-semibold text-[var(--ink)]">{aiProposal?.categoryLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t('স্থান:', 'Location:')}</span>
          <span className="text-[var(--ink)]">{location.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t('অগ্রাধিকার:', 'Priority:')}</span>
          <span className="font-semibold text-amber-500">{aiProposal ? (language === 'en' ? PRIORITY_CONFIG[aiProposal.proposedPriority].labelEn : PRIORITY_CONFIG[aiProposal.proposedPriority].label) : 'Pending'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t('বর্তমান অবস্থা:', 'Status:')}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
            {t('ওয়ার্ড ডেস্ক যাচাইয়ের অপেক্ষায়', 'Pending Ward Verification')}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(`/cases/${createdCaseId}`)}
          className="civic-btn-primary w-full sm:w-auto px-6 py-3 text-xs font-bold shadow-xs cursor-pointer"
        >
          {t('অভিযোগের অগ্রগতি দেখুন (Live Tracking)', 'View Live Case Timeline')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="civic-btn-secondary w-full sm:w-auto px-6 py-3 text-xs font-semibold cursor-pointer"
        >
          {t('হোমে ফিরুন', 'Return to Home')}
        </button>
      </div>
    </div>
  )}
</div>
  );
};
