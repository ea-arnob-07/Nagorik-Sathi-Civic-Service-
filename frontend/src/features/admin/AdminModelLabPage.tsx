import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, BrainCircuit, Camera, CheckCircle2, Copy, Database, RefreshCw, ShieldCheck } from 'lucide-react';
import { getModelStatus } from '../../services/aiIntakeService';
import { useLanguage } from '../../context/LanguageContext';

interface ModelStatus {
  status: string;
  model_version: string | null;
  trained_from: string | null;
  training_rows: number;
  dataset_profile?: string;
  category_labels?: string[];
  models: { id: string; name: string; weight: number; validation_macro_f1: number }[];
  validation: { category_macro_f1: number; severity_macro_f1: number; warning?: string };
  vision: {
    status: string;
    message_bn: string;
    message_en?: string;
    model?: string;
    training_images?: number;
    validation_accuracy?: number;
    validation_macro_f1?: number;
    warning?: string;
  };
}

const percent = (value?: number) => `${Math.round((value || 0) * 100)}%`;

export const AdminModelLabPage: React.FC = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<ModelStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    setError('');
    try {
      setStatus(await getModelStatus());
    } catch {
      setError(t('Model service পাওয়া যায়নি। Backend চালু করে আবার চেষ্টা করুন।', 'Model service is unavailable. Start the backend and try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadStatus(); }, []);

  const copyCommand = async () => {
    await navigator.clipboard.writeText('cd backend/ml && python -m nagarai_ml.train --data data/showcase_complaints.csv --output artifacts');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--accent)]">MODEL OPERATIONS / GOVERNANCE</span>
          <h1 className="mt-1 text-2xl font-bold text-[var(--ink)] sm:text-3xl">ML Model Lab</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t('টেক্সট মডেল, training data, validation এবং image-model readiness এক জায়গায়।', 'Review text models, training data, validation and image-model readiness in one place.')}</p>
        </div>
        <button type="button" onClick={() => void loadStatus()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3.5 py-2.5 text-xs font-semibold text-[var(--ink)] shadow-xs hover:border-[var(--accent)] disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> {t('স্ট্যাটাস রিফ্রেশ', 'Refresh status')}
        </button>
      </header>

      {error && <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="h-4 w-4" />{error}</div>}
      {loading && !status && <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-8 text-center text-sm text-[var(--muted)]">{t('Model status লোড হচ্ছে…', 'Loading model status…')}</div>}

      {status && <>
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]"><span>{t('Ensemble status', 'Ensemble status')}</span><BrainCircuit className="h-4 w-4 text-[var(--accent)]" /></div>
            <p className="mt-3 text-xl font-bold text-[var(--ink)]">{status.status === 'ready' ? 'Ready' : t('Training required', 'Training required')}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">Model version: {status.model_version || '—'}</p>
          </article>
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]"><span>{t('Training samples', 'Training samples')}</span><Database className="h-4 w-4 text-blue-600" /></div>
            <p className="mt-3 text-2xl font-bold text-[var(--ink)]">{status.training_rows}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">{status.trained_from || 'Dataset not loaded'}</p>
          </article>
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]"><span>Category Macro-F1</span><Activity className="h-4 w-4 text-amber-600" /></div>
            <p className="mt-3 text-2xl font-bold text-[var(--ink)]">{percent(status.validation?.category_macro_f1)}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">{t('Template-grouped test split', 'Template-grouped test split')}</p>
          </article>
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]"><span>Severity Macro-F1</span><ShieldCheck className="h-4 w-4 text-emerald-600" /></div>
            <p className="mt-3 text-2xl font-bold text-[var(--ink)]">{percent(status.validation?.severity_macro_f1)}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">{t('Template-grouped test split', 'Template-grouped test split')}</p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_.85fr]">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><h2 className="text-base font-bold text-[var(--ink)]">{t('Six-model text ensemble', 'Six-model text ensemble')}</h2><p className="text-xs text-[var(--muted)]">{t('Validation-weighted probability voting', 'Validation-weighted probability voting')}</p></div>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-bold text-[var(--accent)]">6 MODELS</span>
            </div>
            <div className="space-y-3">
              {status.models.map((model, index) => (
                <div key={model.id} className="rounded-xl border border-[var(--line)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--paper-elevated)] text-xs font-bold text-[var(--accent)]">M{index + 1}</span>
                      <div className="min-w-0"><p className="truncate text-xs font-bold text-[var(--ink)]">{model.name}</p><p className="text-[10px] text-[var(--muted)]">Ensemble weight: {percent(model.weight)}</p></div>
                    </div>
                    <strong className="font-mono text-xs text-[var(--ink)]">{percent(model.validation_macro_f1)}</strong>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--line)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: percent(model.validation_macro_f1) }} /></div>
                </div>
              ))}
            </div>
          </article>

          <div className="space-y-5">
            <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-amber-900"><AlertTriangle className="h-5 w-5" /><h2 className="text-sm font-bold">{t('Validation সতর্কতা', 'Validation notice')}</h2></div>
              <p className="mt-2 text-xs leading-relaxed text-amber-900">
                {t(
                  `বর্তমান synthetic showcase dataset-এ ${status.training_rows}টি complaint এবং ${status.category_labels?.length || 7}টি category রয়েছে। Category Macro-F1 ${percent(status.validation?.category_macro_f1)}। এটি real-world accuracy নয়; মানব যাচাই বাধ্যতামূলক।`,
                  `The synthetic showcase dataset contains ${status.training_rows} complaints across ${status.category_labels?.length || 7} categories. Category Macro-F1 is ${percent(status.validation?.category_macro_f1)}. This is not real-world accuracy; human review remains mandatory.`
                )}
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-amber-800">{status.validation?.warning}</p>
              <p className="mt-2 text-[10px] font-semibold text-amber-900">{t('Categories:', 'Categories:')} {(status.category_labels || []).join(' · ')}</p>
            </article>

            <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs">
              <div className="flex items-center gap-2"><Camera className="h-5 w-5 text-[var(--accent)]" /><h2 className="text-sm font-bold text-[var(--ink)]">{t('Image intelligence readiness', 'Image intelligence readiness')}</h2></div>
              <div className="mt-3 flex items-center gap-2">
                {status.vision?.status === 'ready' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                <span className="text-xs font-bold text-[var(--ink)]">{status.vision?.status === 'ready' ? t('Vision model trained (showcase)', 'Vision model trained (showcase)') : t('Vision model not configured', 'Vision model not configured')}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{t(status.vision?.message_bn || '', status.vision?.message_en || status.vision?.message_bn || '')}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-[var(--bg)] p-2"><p className="text-[9px] text-[var(--muted)]">{t('Images', 'Images')}</p><strong className="text-sm text-[var(--ink)]">{status.vision?.training_images || 0}</strong></div>
                <div className="rounded-lg bg-[var(--bg)] p-2"><p className="text-[9px] text-[var(--muted)]">{t('CV Accuracy', 'CV Accuracy')}</p><strong className="text-sm text-[var(--ink)]">{percent(status.vision?.validation_accuracy)}</strong></div>
                <div className="rounded-lg bg-[var(--bg)] p-2"><p className="text-[9px] text-[var(--muted)]">Macro-F1</p><strong className="text-sm text-[var(--ink)]">{percent(status.vision?.validation_macro_f1)}</strong></div>
              </div>
              <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 text-[11px] text-[var(--muted)]">
                <strong className="text-[var(--ink)]">{t('যা এখন কাজ করছে:', 'Working now:')}</strong> {t('ছবি upload, HOG + SVM image classification এবং বিভাগ প্রস্তাব।', 'Image upload, HOG + SVM classification and department suggestions.')}<br />
                <strong className="text-[var(--ink)]">{t('সীমাবদ্ধতা:', 'Limitation:')}</strong> {t('২১টি generated/augmented ছবি; বাস্তব নাগরিক ছবির accuracy প্রমাণিত নয়। সব ফলাফল staff review-তে যাবে।', 'Only 21 generated/augmented images; accuracy on real citizen photos is not established. Every result requires staff review.')}
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-sm font-bold text-[var(--ink)]">{t('Text model retraining', 'Text model retraining')}</h2><p className="mt-1 text-xs text-[var(--muted)]">{t('Labelled complaint dataset আপডেট করে local training run করুন।', 'Update the labelled complaint dataset and run local training.')}</p></div>
            <button type="button" onClick={() => void copyCommand()} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-3.5 py-2.5 text-xs font-bold text-white hover:bg-[var(--accent-hover)]"><Copy className="h-3.5 w-3.5" />{copied ? 'Copied' : t('কমান্ড কপি', 'Copy command')}</button>
          </div>
          <code className="mt-4 block overflow-x-auto rounded-xl bg-[#10253b] p-3 text-[11px] text-emerald-100">cd backend/ml && python -m nagarai_ml.train --data data/showcase_complaints.csv --output artifacts</code>
          <p className="mt-2 text-[10px] text-[var(--muted)]">{t('Training-এর পর backend restart করুন। বাস্তব ব্যবহারের আগে manually verified Bangladesh civic dataset দিয়ে নতুন validation করুন।', 'Restart the backend after training. Before real deployment, validate with a manually verified Bangladesh civic dataset.')}</p>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs">
          <div className="flex items-center gap-2"><Camera className="h-5 w-5 text-[var(--accent)]" /><h2 className="text-sm font-bold text-[var(--ink)]">{t('Image model training pipeline', 'Image model training pipeline')}</h2></div>
          <p className="mt-1 text-xs text-[var(--muted)]">{t('Showcase classifier HOG feature extraction ও RBF SVM ব্যবহার করে।', 'The showcase classifier uses HOG feature extraction and an RBF SVM.')}</p>
          <code className="mt-3 block overflow-x-auto rounded-xl bg-[#10253b] p-3 text-[11px] leading-relaxed text-emerald-100">cd backend/ml<br />pip install -r vision-requirements.txt<br />python vision_train.py --dataset-dir vision_dataset/demo_samples --output vision</code>
          <p className="mt-2 text-[10px] text-[var(--muted)]">{t('Test images: backend/ml/vision_dataset/demo_samples/ — প্রতিটি সাতটি category-তে ৩টি করে image আছে।', 'Test images: backend/ml/vision_dataset/demo_samples/ — three images are included for each of the seven categories.')}</p>
        </section>
      </>}
    </div>
  );
};
