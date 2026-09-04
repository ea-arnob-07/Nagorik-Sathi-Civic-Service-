import React from 'react';
import { Activity, AlertTriangle, BrainCircuit, CheckCircle2, Layers3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { EnsembleAdvisory } from '../../services/aiIntakeService';

const categoryLabels: Record<string, { bn: string; en: string }> = {
  road_transport: { bn: 'সড়ক ও পরিবহন', en: 'Road Transport' },
  water: { bn: 'পানি সরবরাহ ও পাইপলাইন', en: 'Water Supply & Pipelines' },
  waste: { bn: 'বর্জ্য ব্যবস্থাপনা', en: 'Waste Management' },
  electricity: { bn: 'বিদ্যুৎ ও সড়কবাতি', en: 'Electricity & Street Lighting' },
  healthcare: { bn: 'জনস্বাস্থ্য ও চিকিৎসা', en: 'Public Health & Healthcare' },
  food: { bn: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার', en: 'Food Safety & Consumer Rights' },
  drainage: { bn: 'ড্রেনেজ ও পয়ঃনিষ্কাশন', en: 'Drainage & Sewerage' }
};

const severityLabels: Record<string, { bn: string; en: string }> = {
  low: { bn: 'নিম্ন', en: 'Low' },
  medium: { bn: 'মাঝারি', en: 'Medium' },
  high: { bn: 'উচ্চ', en: 'High' }
};
const percent = (value: number) => `${Math.round(value * 100)}%`;

export const EnsembleInsightCard: React.FC<{ result: EnsembleAdvisory }> = ({ result }) => {
  const { t } = useLanguage();
  const category = categoryLabels[result.category.label];
  const severity = severityLabels[result.severity.label];

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)]">{t('৬-মডেল ML বিশ্লেষণ', '6-Model ML Analysis')}</h3>
            <p className="text-[11px] text-[var(--muted)]">{t('বাংলা, Banglish ও English text ensemble', 'Bangla, Banglish & English text ensemble')} · v{result.model_version}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
          <AlertTriangle className="h-3.5 w-3.5" /> {t('মানব যাচাই প্রয়োজন', 'Human verification required')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3.5">
          <p className="text-[11px] text-[var(--muted)]">{t('সম্ভাব্য ক্যাটাগরি', 'Predicted category')}</p>
          <p className="mt-1 text-base font-bold text-[var(--ink)]">{category ? t(category.bn, category.en) : result.category.label}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[var(--muted)]">{t('মডেল আস্থা', 'Model confidence')}</span>
            <strong className="font-mono text-[var(--accent)]">{percent(result.category.confidence)}</strong>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: percent(result.category.confidence) }} />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3.5">
          <p className="text-[11px] text-[var(--muted)]">{t('সম্ভাব্য অগ্রাধিকার', 'Predicted severity')}</p>
          <p className="mt-1 text-base font-bold text-[var(--ink)]">{severity ? t(severity.bn, severity.en) : result.severity.label}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[var(--muted)]">{t('মডেল আস্থা', 'Model confidence')}</span>
            <strong className="font-mono text-[var(--accent)]">{percent(result.severity.confidence)}</strong>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: percent(result.severity.confidence) }} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-[var(--muted)]">
        <span className="inline-flex items-center gap-1"><Layers3 className="h-3.5 w-3.5" /> {t('মডেল সম্মতি:', 'Model agreement:')} {percent(result.category.agreement)}</span>
        <span className="inline-flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> {t('Training rows:', 'Training rows:')} {result.training_rows}</span>
        <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {t('৬টি মডেলের vote', 'Six model votes')}</span>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--ink)]">{t('প্রতিটি মডেলের মতামত', 'Individual model votes')}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {result.category.votes.map(vote => {
            const voteCategory = categoryLabels[vote.label];
            return (
              <div key={vote.model_id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] px-3 py-2 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--ink)]">{vote.model_name}</p>
                  <p className="text-[10px] text-[var(--muted)]">{voteCategory ? t(voteCategory.bn, voteCategory.en) : vote.label}</p>
                </div>
                <strong className="shrink-0 font-mono text-[var(--accent)]">{percent(vote.confidence)}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
        {t(result.review_reason_bn, result.review_reason_en || 'Human verification is required.')} {t('পরীক্ষিত ডেটাসেট:', 'Dataset:')} {result.trained_from}. {t('Category Macro-F1:', 'Category Macro-F1:')} {percent(result.validation.category_macro_f1)} · {t('Severity Macro-F1:', 'Severity Macro-F1:')} {percent(result.validation.severity_macro_f1)}.
      </p>
    </section>
  );
};
