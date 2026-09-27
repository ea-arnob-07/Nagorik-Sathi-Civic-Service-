import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { toBanglaNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import {
  Landmark, CheckSquare, ShieldCheck, GitFork, Sliders,
  Clock, BarChart3, AlertOctagon, Eye, History, ArrowRight,
  RefreshCw, CheckCircle2, AlertTriangle
} from 'lucide-react';

export const GovernanceOverviewPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t, language } = useLanguage();

  const formatNum = (num: number) => (language === 'en' ? num.toString() : toBanglaNumber(num));

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await apiClient.governance.getOverview();
      setData(res?.overview || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-editorial">
      {/* Title & Authority Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[var(--line)] gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-[var(--paper-elevated)] text-[var(--ink)] border border-[var(--line)] shadow-xs">
              <Landmark className="w-3.5 h-3.5 text-[var(--ink)]" aria-hidden="true" />
              {t('ষষ্ঠ প্রাতিষ্ঠানিক ভূমিকা', 'Sixth Institutional Authority')} (Municipal Governance)
            </span>
            <span className="text-xs text-[var(--muted)] font-mono font-medium">R&D v1.2 Approved Extension</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)] font-bangla flex items-center gap-3">
            {t('সিটি গভর্নেন্স ওভারভিউ', 'City Governance Overview')}
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
            {t(
              'পৌরনীতি নির্ধারণ, সেবা মান নিয়ন্ত্রণ, দ্বৈত অনুমোদন ও ক্রস-ডিপার্টমেন্টাল সিদ্ধান্ত ব্যবস্থাপনা',
              'Municipal policy orchestration, SLA compliance standards, dual approval gates, and cross-departmental decisions.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={fetchOverview}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--paper-elevated)] text-[var(--ink)] hover:border-[var(--ink)] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            {t('রিফ্রেশ ডেটা', 'Refresh Telemetry')}
          </button>
        </div>
      </div>

      {/* Municipal Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-xs space-y-2 hover:border-[var(--ink)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold">
            <span>{t('মোট পরিচালিত কেস', 'Total Handled Cases')}</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shadow-xs">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-[var(--ink)] tracking-tight">
            {loading ? '...' : formatNum(data?.total_cases_handled || 0)}
          </div>
          <div className="pt-1 border-t border-[var(--line)]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              {loading ? '...' : formatNum(data?.resolved_cases || 0)} {t('টি সমাধানকৃত', 'Resolved')}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-xs space-y-2 hover:border-[var(--ink)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold">
            <span>{t('এসএলএ কমপ্লায়েন্স হার', 'SLA Adherence Rate')}</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-[var(--ink)] tracking-tight">
            {loading ? '...' : `${formatNum(data?.sla_compliance_rate || 96.5)}%`}
          </div>
          <div className="pt-1 border-t border-[var(--line)]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700">
              <AlertTriangle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              {loading ? '...' : formatNum(data?.overdue_cases || 0)} {t('টি সময়সীমা অতিক্রম', 'Overdue')}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-xs space-y-2 hover:border-[var(--ink)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold">
            <span>{t('বিচারাধীন পলিসি অনুমোদন', 'Pending Approvals')}</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shadow-xs">
              <CheckSquare className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-[var(--ink)] tracking-tight">
            {loading ? '...' : formatNum(data?.pending_policy_approvals || 0)}
          </div>
          <div className="pt-1 border-t border-[var(--line)]">
            <span className="text-[11px] text-[var(--muted)] font-medium">
              {t('দ্বৈত অনুমোদন প্রক্রিয়ার অপেক্ষায়', 'Awaiting dual-sign authorization')}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-xs space-y-2 hover:border-[var(--ink)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold">
            <span>{t('এআই কনফিডেন্স গেট', 'AI Confidence Gate')}</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-[var(--ink)] tracking-tight">
            {loading ? '...' : `${formatNum(Math.round((data?.ai_confidence_gate || 0.80) * 100))}%`}
          </div>
          <div className="pt-1 border-t border-[var(--line)]">
            <span className="text-[11px] text-[var(--muted)] font-medium">
              {t('বেসলাইন ৮০% (কমাতে দ্বৈত স্বাক্ষর আবশ্যক)', 'Baseline 80% (Dual authorization to lower)')}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Approval Governance Notice Card */}
      <div className="p-5 rounded-2xl border-2 border-[var(--ink)] bg-[var(--paper-elevated)] shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-extrabold text-[var(--ink)] tracking-tight font-bangla">
              {t('স্বতন্ত্র ক্ষমতার বিভাজন ও দ্বৈত অনুমোদন নীতিমালা', 'Separation of Powers & Dual Approval Policy')}
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-bangla">
              {t(
                'সিটি গভর্নেন্স প্রধান হিসেবে আপনি পৌরনীতি, আন্তঃবিভাগীয় টাস্ক ক্রমধারা, সেবা মান (SLA) এবং এআই রাউটিং নীতিমালার চূড়ান্ত অভিভাবক। সিস্টেম অ্যাডমিনিস্ট্রেটর কারিগরি বাস্তবায়ন পরিচালনা করেন কিন্তু সুরক্ষিত পৌরনীতি একতরফাভাবে কার্যকর করতে পারেন না।',
                'As City Governance Head, you are the municipal policy authority over responsibility rules, inter-departmental sequencing, SLA benchmarks, and AI confidence thresholds. Technical administrators cannot unilaterally enact protected municipal policies without your dual approval.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 9 Wing Quick Navigation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[var(--muted)] font-mono">
            {t('গভর্নেন্স ও পলিসি ব্যবস্থাপনা উইং (৯ টি উইং)', 'Governance & Policy Wings (9 Wings)')}
          </h2>
          <span className="text-xs text-[var(--muted)] font-medium">
            {t('নিরাপদ পৌর প্রবিধান নিয়ন্ত্রণ', 'Secure Municipal Regulation & Audit')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Wing 1 */}
          <Link
            to="/governance/approvals"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('১. বিচারাধীন পলিসি অনুমোদন', '1. Pending Policy Approvals')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('দ্বৈত অনুমোদনের অপেক্ষমাণ প্রস্তাবনা পর্যালোচনা ও সিদ্ধান্ত গ্রহণ', 'Review & decide on proposals awaiting dual-sign authorization')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('অনুমোদন ডেস্কে যান', 'Open Approval Desk')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 2 */}
          <Link
            to="/governance/responsibility-rules"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('২. বিভাগীয় দায়িত্ব নির্ধারণ বিধি', '2. Department Responsibility Rules')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('বিভিন্ন নাগরিক সমস্যায় কোন বিভাগ দায়িত্বপ্রাপ্ত তা সুনির্দিষ্টকরণ', 'Codify legal jurisdiction rules for civic grievance categories')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('বিধিমালা দেখুন', 'Inspect Rules')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 3 */}
          <Link
            to="/governance/task-sequencing"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('৩. টাস্ক সিকোয়েন্সিং পাইপলাইন', '3. Task Sequencing Pipelines')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('বহু-বিভাগীয় কেসে পূর্বশর্ত ব্যবস্থাপনা (বর্জ্য → ড্রেন → সড়ক)', 'Dependency sequencing policies across waste, drainage, and roads')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('সিকোয়েন্স নীতি দেখুন', 'Manage Sequencing')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 4 */}
          <Link
            to="/governance/ai-gate"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('৪. এআই কনফিডেন্স গেট গভর্ন্যান্স', '4. AI Confidence Gate Policy')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('রাউটিং নির্ভুলতা সীমা পর্যবেক্ষণ ও রি-ভ্যালিডেশন শর্ত নিশ্চিতকরণ', 'Monitor AI accuracy threshold & enforce human review conditions')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('গেট ম্যানেজমেন্ট', 'Configure Gate')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 5 */}
          <Link
            to="/governance/sla-policy"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('৫. পৌর এসএলএ ও এস্কেলেশন', '5. Municipal SLA & Escalations')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('জরুরি ও সাধারণ সেবা নিষ্পত্তির সময়সীমা নির্ধারণ ও সংশোধন', 'Define resolution SLA tiers and automatic escalation triggers')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('এসএলএ পলিসি পরিচালনা', 'Manage SLAs')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 6 */}
          <Link
            to="/governance/service-performance"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('৬. সার্বিক সেবা কর্মক্ষমতা', '6. Municipal Performance')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('বিভাগীয় নিষ্পত্তি অনুপাত ও গোপনীয়তা-সুরক্ষিত সংক্ষেপণ', 'Cross-departmental resolution ratios and macro trend insights')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('অ্যানালিটিক্স দেখুন', 'View Analytics')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 7 */}
          <Link
            to="/governance/recurring-issues"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('৭. বারংবার সমস্যা ও হটস্পট', '7. Recurring Issues & Hotspots')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('দীর্ঘস্থায়ী অবকাঠামোগত ব্যর্থতা ও বাজেট বরাদ্দের অগ্রাধিকার বিশ্লেষণ', 'Detect structural chronic infrastructure failures and prioritize capital works')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('হটস্পট পর্যালোচনা', 'Inspect Hotspots')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 8 */}
          <Link
            to="/governance/transparency-policy"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('৮. পাবলিক ট্রান্সপারেন্সি পলিসি', '8. Transparency Policies')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('নাগরিক পোর্টালের কে-অ্যানোনিমিটি সীমা (k=5) ও তথ্য প্রকাশ নীতি', 'Public privacy protections, k-anonymity clustering, and disclosure boundaries')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('স্বচ্ছতা সেটিংস', 'Transparency Settings')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 9 */}
          <Link
            to="/governance/history"
            className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-base group-hover:text-[var(--ink)]">
                  {t('৯. পলিসি পরিবর্তন ইতিহাস', '9. Policy Change Audit')}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                  {t('অপরিবর্তনীয় ক্রিপ্টোগ্রাফিক টাইমস্ট্যাম্প ও নীতি পরিবর্তনের ইতিহাস', 'Immutable SHA-256 historical ledger of all governance enactments')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--ink)]">
              <span>{t('ইতিহাস অডিট করুন', 'Audit History')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

