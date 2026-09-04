import React from 'react';
import { AlertTriangle, Camera, CheckCircle2, ImageOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { VisionAdvisory } from '../../services/aiIntakeService';

const categoryLabels: Record<string, { bn: string; en: string }> = {
  water: { bn: 'পানি সরবরাহ ও পাইপলাইন', en: 'Water Supply & Pipelines' },
  road_transport: { bn: 'সড়ক ও পরিবহন', en: 'Road Transport' },
  waste: { bn: 'বর্জ্য ব্যবস্থাপনা', en: 'Waste Management' },
  electricity: { bn: 'বিদ্যুৎ ও সড়কবাতি', en: 'Electricity & Street Lighting' },
  healthcare: { bn: 'জনস্বাস্থ্য ও চিকিৎসা', en: 'Public Health & Healthcare' },
  food: { bn: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার', en: 'Food Safety & Consumer Rights' },
  drainage: { bn: 'ড্রেনেজ ও পয়ঃনিষ্কাশন', en: 'Drainage & Sewerage' }
};

const departmentLabels: Record<string, { bn: string; en: string }> = {
  water: { bn: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন কর্তৃপক্ষ (ওয়াসা উইং)', en: 'Water Supply & WASA Wing' },
  road: { bn: 'সড়ক পরিবহন ও অবকাঠামো প্রকৌশল বিভাগ', en: 'Road Transport & Infrastructure Engineering' },
  waste: { bn: 'বর্জ্য ব্যবস্থাপনা বিভাগ', en: 'Waste Management Department' },
  street_light: { bn: 'বিদ্যুৎ ও সড়কবাতি বিভাগ', en: 'Electricity & Street Lighting Department' },
  healthcare: { bn: 'জনস্বাস্থ্য ও রোগ নিয়ন্ত্রণ বিভাগ', en: 'Public Health & Disease Control Department' },
  food: { bn: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার শাখা', en: 'Food Safety & Consumer Rights Unit' },
  drain: { bn: 'ড্রেনেজ ও নর্দমা প্রকৌশল বিভাগ', en: 'Drainage & Sewerage Engineering Department' }
};

export const VisionInsightCard: React.FC<{ result: VisionAdvisory }> = ({ result }) => {
  const { t } = useLanguage();
  const category = categoryLabels[result.category || result.label || ''];
  const department = departmentLabels[result.department_code || ''];

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Camera className="h-5 w-5" /></span>
        <div>
          <h3 className="text-sm font-bold text-[var(--ink)]">{t('ছবির মাধ্যমে সমস্যা শনাক্তকরণ', 'Image Classification')}</h3>
          <p className="text-[11px] text-[var(--muted)]">{t('সংযুক্ত ছবির AI/ML বিশ্লেষণ', 'AI/ML analysis of the attached image')}</p>
        </div>
      </div>
      {result.status === 'ready' ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /><strong className="text-sm">{category ? t(category.bn, category.en) : result.label}</strong></div>
          {department && <p className="mt-1 text-xs font-semibold">{t('প্রস্তাবিত বিভাগ:', 'Suggested department:')} {t(department.bn, department.en)}</p>}
          <p className="mt-1 text-xs">{t('মডেল স্কোর:', 'Model score:')} {Math.round((result.confidence || 0) * 100)}% ({t('ক্যালিব্রেটেড সম্ভাবনা নয়', 'not a calibrated probability')})</p>
          <p className="mt-2 text-[11px]">{t('এটি synthetic showcase dataset-এ প্রশিক্ষিত সহায়ক মডেল; বাস্তব ছবিতে নির্ভুলতা প্রমাণিত নয়। কর্মকর্তা অবশ্যই ফলাফল যাচাই করবেন।', 'This advisory model was trained on a synthetic showcase dataset; accuracy on real photos is not established. Staff verification is mandatory.')}</p>
        </div>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
          {result.status === 'not_configured' ? <ImageOff className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
          <div>
            <strong className="text-xs">{result.status === 'not_configured' ? t('Vision model এখনো প্রস্তুত নয়', 'Vision model is not configured') : t('Image analysis পাওয়া যায়নি', 'Image analysis is unavailable')}</strong>
            <p className="mt-1 text-[11px] leading-relaxed">{t(result.message_bn || '', result.message_en || result.message || result.message_bn || '')}</p>
            <p className="mt-1 text-[10px]">{t('Admin → ML Model Lab থেকে image model status দেখুন।', 'Check the image model status in Admin → ML Model Lab.')}</p>
          </div>
        </div>
      )}
    </section>
  );
};
