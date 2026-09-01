import { AiExtractedDetail, GeoLocation, MediaAttachment, ProblemCategory, PriorityLevel } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ModelVote {
  model_id: string;
  model_name: string;
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface EnsembleTaskResult {
  label: string;
  confidence: number;
  agreement: number;
  probabilities: Record<string, number>;
  votes: ModelVote[];
  weights: Record<string, number>;
  review_required: boolean;
}

export interface VisionAdvisory {
  status: 'ready' | 'not_configured' | 'unavailable';
  label?: string;
  confidence?: number;
  probabilities?: Record<string, number>;
  human_review_required?: boolean;
  confidence_is_calibrated?: boolean;
  department_code?: string;
  department_name_bn?: string;
  category?: string;
  model_type?: string;
  dataset_type?: string;
  disclaimer?: string;
  message?: string;
  message_bn?: string;
  message_en?: string;
}

export interface EnsembleAdvisory {
  category: EnsembleTaskResult;
  severity: EnsembleTaskResult;
  review_required: boolean;
  validation_passed: boolean;
  model_version: string;
  trained_from: string;
  training_rows: number;
  validation: {
    category_macro_f1: number;
    severity_macro_f1: number;
  };
  review_reason_bn: string;
  review_reason_en?: string;
  disclaimer?: string;
}

interface CivicAnalysisResponse {
  normalized_text_bn: string;
  detected_categories: string[];
  primary_category: string;
  proposed_priority: PriorityLevel;
  recommended_department_code: string;
  recommended_department_name_bn: string;
  responsibility_rule_code?: string | null;
  responsibility_reason_bn: string;
  nearest_asset_id?: string | null;
  nearest_asset_name_bn?: string | null;
  confidence_score: number;
  requires_staff_verification: boolean;
  is_hazard: boolean;
  hazard_reasons: string[];
}

const categoryMap: Record<string, { category: ProblemCategory; label: string; departmentId: string; departmentName: string }> = {
  water: { category: 'water', label: 'পানি সরবরাহ ও পাইপলাইন', departmentId: 'dept_water', departmentName: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন বিভাগ (ওয়াসা)' },
  road_transport: { category: 'road_transport', label: 'সড়ক ও পরিবহন', departmentId: 'dept_road', departmentName: 'সড়ক পরিবহন ও অবকাঠামো বিভাগ' },
  waste: { category: 'waste', label: 'বর্জ্য ব্যবস্থাপনা', departmentId: 'dept_waste', departmentName: 'বর্জ্য ব্যবস্থাপনা বিভাগ' },
  electricity: { category: 'electricity', label: 'বিদ্যুৎ ও জ্বালানি', departmentId: 'dept_lighting', departmentName: 'বিদ্যুৎ ও সড়ক বাতি বিভাগ' },
  healthcare: { category: 'healthcare', label: 'জনস্বাস্থ্য ও চিকিৎসা', departmentId: 'dept_health', departmentName: 'জনস্বাস্থ্য ও রোগ নিয়ন্ত্রণ বিভাগ' },
  food: { category: 'food', label: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার', departmentId: 'dept_food', departmentName: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার শাখা' },
  drain: { category: 'drainage', label: 'ড্রেনেজ ও পয়ঃনিষ্কাশন', departmentId: 'dept_drainage', departmentName: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ' },
  drainage: { category: 'drainage', label: 'ড্রেনেজ ও পয়ঃনিষ্কাশন', departmentId: 'dept_drainage', departmentName: 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ' },
  road: { category: 'road_transport', label: 'সড়ক ও পরিবহন', departmentId: 'dept_road', departmentName: 'সড়ক ও অবকাঠামো প্রকৌশল বিভাগ' },
  street_light: { category: 'electricity', label: 'বিদ্যুৎ ও সড়কবাতি', departmentId: 'dept_lighting', departmentName: 'বিদ্যুৎ ও সড়ক বাতি বিভাগ' }
};

function fallbackAnalysis(text: string): AiExtractedDetail {
  const value = text.toLowerCase();
  const selected = /খাবার|খাদ্য|রেস্তোরাঁ|হোটেল|ভেজাল|পচা মাংস|মেয়াদোত্তীর্ণ|ফরমালিন|রাসায়নিক|chemical|food|restaurant|expired food/.test(value)
    ? categoryMap.food
    : /হাসপাতাল|ক্লিনিক|ডাক্তার|ওষুধ|টিকা|মশক|মশা|ডেঙ্গু|মেডিকেল বর্জ্য|অ্যাম্বুলেন্স|স্বাস্থ্য|hospital|clinic|health|mosquito|dengue/.test(value)
      ? categoryMap.healthcare
      : /ড্রেন|নর্দমা|জলাবদ্ধ|পানি জমে|নিষ্কাশন|ম্যানহোল|drain|drainage|sewer|sewage|waterlogging|stormwater|open manhole/.test(value)
        ? categoryMap.drainage
        : /ওয়াসা|পানির লাইন|লিক|পাইপলাইন|পানির সংকট|নোংরা পানি|পানি পড়ছে|সুপেয় পানি|নলকূপ|পানি সরবরাহ|water supply|tap water|water pipeline|wasa/.test(value)
          ? categoryMap.water
          : /বিদ্যুৎ|কারেন্ট|তার|সড়কবাতি|লাইট|বাতি|ট্রান্সফরমার|স্পার্ক|লোডশেডিং|electricity|power|transformer|live wire|streetlight/.test(value)
            ? categoryMap.electricity
            : /রাস্তা|সড়ক|গর্ত|ফুটপাত|খানাখন্দ|যানজট|ট্রাফিক|ফুটওভারব্রিজ|পার্কিং|হাইওয়ে|road|pothole|traffic|footpath/.test(value)
              ? categoryMap.road_transport
              : /ময়লা|ময়লা|আবর্জনা|বর্জ্য|ডাস্টবিন|ভাগাড়|dumping|waste|garbage|trash/.test(value)
                ? categoryMap.waste
                : null;
  const hazard = /কারেন্ট|ছেঁড়া তার|ছেঁড়া তার|আগুন|স্পার্ক|খোলা ম্যানহোল|ধস|দুর্ঘটনা|বিপদ|বিষাক্ত|অক্সিজেন সংকট|জরুরি রোগী/.test(value);
  const priority: PriorityLevel = hazard ? 'emergency' : /অনেক দিন|এক সপ্তাহ|উপচে|বড় গর্ত|বড় গর্ত|ভেজাল|পচা/.test(value) ? 'high' : 'medium';
  const item = selected ?? categoryMap.waste;

  return {
    category: item.category,
    categoryLabel: selected ? item.label : 'অনির্ধারিত সমস্যা — ওয়ার্ড ডেস্ক যাচাই প্রয়োজন',
    problemSummary: text,
    confidenceScore: selected ? 68 : 55,
    proposedPriority: priority,
    priorityReason: hazard ? 'সম্ভাব্য জননিরাপত্তা ঝুঁকি শনাক্ত হয়েছে; দ্রুত মানব যাচাই প্রয়োজন।' : 'বিবরণের ভিত্তিতে প্রাথমিক অগ্রাধিকার নির্ধারণ করা হয়েছে।',
    proposedDepartmentId: item.departmentId,
    proposedDepartmentName: selected ? item.departmentName : 'ওয়ার্ড ডেস্কের মাধ্যমে বিভাগ নির্ধারণ প্রয়োজন',
    ruleReference: 'LOCAL-RULE-FALLBACK',
    requiresHumanVerification: true,
    uncertaintyReason: 'সার্ভার-সাইড বিশ্লেষণ পাওয়া যায়নি; এটি স্থানীয় নিয়মভিত্তিক প্রাথমিক প্রস্তাব।',
    signals: selected ? [selected.category, ...(hazard ? ['সম্ভাব্য নিরাপত্তা ঝুঁকি'] : [])] : ['ক্যাটাগরি অনির্ধারিত', 'মানব যাচাই প্রয়োজন']
  };
}

function mapCivicResult(result: CivicAnalysisResponse, text: string): AiExtractedDetail {
  const selected = categoryMap[result.primary_category] ?? categoryMap.waste;
  return {
    category: selected.category,
    categoryLabel: selected.label,
    problemSummary: result.normalized_text_bn || text,
    confidenceScore: Math.round(result.confidence_score * 100),
    proposedPriority: result.proposed_priority,
    priorityReason: result.is_hazard
      ? result.hazard_reasons.join(' · ')
      : result.responsibility_reason_bn || 'অভিযোগের বিবরণ ও অবস্থানের ভিত্তিতে প্রাথমিক অগ্রাধিকার নির্ধারণ।',
    proposedDepartmentId: selected.departmentId,
    proposedDepartmentName: result.recommended_department_name_bn || selected.departmentName,
    ruleReference: result.responsibility_rule_code || 'CIVIC-RULE-ENGINE',
    assetId: result.nearest_asset_id || undefined,
    assetName: result.nearest_asset_name_bn || undefined,
    requiresHumanVerification: result.requires_staff_verification,
    uncertaintyReason: result.requires_staff_verification ? 'নিরাপত্তা গেট অনুযায়ী ওয়ার্ড ডেস্কের যাচাই প্রয়োজন।' : undefined,
    signals: [...result.detected_categories, ...result.hazard_reasons]
  };
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

async function analyseImage(url: string): Promise<VisionAdvisory> {
  try {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) return { status: 'unavailable', message: 'ছবির ফাইল পড়া যায়নি।' };
    const blob = await imageResponse.blob();
    const formData = new FormData();
    formData.append('file', new File([blob], 'civic-evidence.jpg', { type: blob.type || 'image/jpeg' }));
    const response = await fetch(`${API_BASE_URL}/ai/vision-predict`, { method: 'POST', body: formData });
    if (response.status === 503) return { status: 'not_configured', message: 'Vision model এখনো train/configure করা হয়নি।' };
    if (!response.ok) return { status: 'unavailable', message: 'Image inference service পাওয়া যায়নি।' };
    return { status: 'ready', ...(await response.json()) };
  } catch {
    return { status: 'unavailable', message: 'Image inference service-এর সঙ্গে সংযোগ করা যায়নি।' };
  }
}

export async function analyseCivicIntake(
  text: string,
  location: GeoLocation,
  attachments: MediaAttachment[]
): Promise<{ proposal: AiExtractedDetail; source: 'server' | 'local'; ensemble: EnsembleAdvisory | null; vision: VisionAdvisory | null }> {
  const firstPhoto = attachments.find(item => item.type === 'photo');
  const [civicResult, ensembleResult, visionResult] = await Promise.allSettled([
    postJson<CivicAnalysisResponse>('/ai/analyze-intake', {
      raw_text_bn: text,
      latitude: location.lat,
      longitude: location.lng,
      photo_urls: attachments.filter(item => item.type === 'photo').map(item => item.url)
    }),
    postJson<EnsembleAdvisory>('/ai/ensemble-predict', { text }),
    firstPhoto ? analyseImage(firstPhoto.url) : Promise.resolve(null)
  ]);

  const baseProposal = civicResult.status === 'fulfilled'
    ? mapCivicResult(civicResult.value, text)
    : fallbackAnalysis(text);
  let proposal = ensembleResult.status === 'fulfilled' && ensembleResult.value.review_required
    ? {
        ...baseProposal,
        requiresHumanVerification: true,
        uncertaintyReason: ensembleResult.value.review_reason_bn
      }
    : baseProposal;

  if (visionResult.status === 'fulfilled' && visionResult.value?.status === 'ready' && (visionResult.value.confidence || 0) >= 0.35) {
    const visionCategory = categoryMap[visionResult.value.category || visionResult.value.label || ''];
    if (visionCategory) {
      const textImageDisagreement = proposal.category !== visionCategory.category;
      proposal = {
        ...proposal,
        category: visionCategory.category,
        categoryLabel: visionCategory.label,
        proposedDepartmentId: visionCategory.departmentId,
        proposedDepartmentName: visionResult.value.department_name_bn || visionCategory.departmentName,
        confidenceScore: Math.round((visionResult.value.confidence || 0) * 100),
        requiresHumanVerification: true,
        uncertaintyReason: textImageDisagreement
          ? 'Text and image model suggestions differ. The image model is demo-only, so staff verification is mandatory.'
          : 'The image model uses synthetic showcase samples. Staff verification is mandatory.',
        signals: [...proposal.signals, `Image model: ${visionCategory.label}`]
      };
    }
  }

  return {
    proposal,
    source: civicResult.status === 'fulfilled' ? 'server' : 'local',
    ensemble: ensembleResult.status === 'fulfilled' ? ensembleResult.value : null,
    vision: visionResult.status === 'fulfilled' ? visionResult.value : null
  };
}

export async function getModelStatus() {
  const response = await fetch(`${API_BASE_URL}/ai/model-status`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}
