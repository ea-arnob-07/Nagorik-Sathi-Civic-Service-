import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { toBanglaNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import {
  Shield,
  Sliders,
  Users,
  FileText,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Building2,
  Clock,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminWingsPage: React.FC = () => {
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const { t, language } = useLanguage();

  const formatNum = (num: number) => (language === 'en' ? num.toString() : toBanglaNumber(num));

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const pData = await apiClient.admin.getPendingApprovals();
        setPendingApprovals(pData || []);
      } catch (err) {
        console.error('Failed to load pending approvals', err);
      }
    };
    fetchPending();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header and Breadcrumb */}
      <div className="space-y-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('সিস্টেম ওভারভিউতে ফিরে যান', 'Back to System Overview')}</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[var(--paper-elevated)] border border-[var(--line)] text-[var(--ink)]">
                <Building2 className="w-5 h-5 text-indigo-500" />
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
                {t('প্রশাসনিক ও পরিচালন উইং (৮ টি উইং)', 'Administrative & Operational Wings (8 Wings)')}
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[var(--muted)] mt-1.5 font-bangla">
              {t(
                'সিটি কর্পোরেশন গভর্নেন্স, এআই পলিসি, আইডেন্টিটি, সেবা সনদ ও অডিট কন্ট্রোল সমন্বয় মডিউল।',
                'Municipal governance, AI policy gates, IAM security, service charters, and immutable audit controls.'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {t('৮টি কোর উইং সক্রিয়', '8 Core Wings Active')}
            </span>
          </div>
        </div>
      </div>

      {/* 8 Governance Groups Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Governance */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('১. গভর্ন্যান্স ও স্বাস্থ্য', '1. Governance & Health')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('সিস্টেম ডায়াগনস্টিকস, লাইভ সার্ভিস কম্পোনেন্ট এবং দ্বৈত অনুমোদনের অপেক্ষমাণ কিউ।', 'System diagnostics, live service components, and pending dual approvals.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/health" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('সিস্টেম হেলথ ডায়াগনস্টিকস', 'System Health Diagnostics')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/pending-approvals" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('দ্বৈত অনুমোদন কিউ', 'Dual Approval Queue')} ({formatNum(pendingApprovals.length)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Identity & Access */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('২. ইউজার ও এক্সেস (RBAC)', '2. IAM & Roles (RBAC)')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('ব্যবহারকারী প্রশাসন, ৫ টি রোলের অনুমতি ম্যাট্রিক্স ও একাউন্ট সিকিউরিটি স্ট্যাটাস।', 'User management, 5-role permission matrix, and account security.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/users" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('ব্যবহারকারী পরিচালনা', 'User Directory')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/roles" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('RBAC পারমিশন ম্যাট্রিক্স', 'RBAC Permission Matrix')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/accounts" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('একাউন্ট স্ট্যাটাস ও MFA', 'Account Status & MFA')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. Civic Data Registry */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('৩. নাগরিক ডেটা রেজিস্ট্রি', '3. Civic Data Registry')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('সিটি কর্পোরেশনের বিভাগ ডিরেক্টরি, দায়িত্বপ্রাপ্ত কর্মকর্তা এবং ওয়ার্ড ও সম্পদ রেজিস্ট্রি।', 'Department directory, officer rosters, and municipal asset registries.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/departments" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('বিভাগ ডিরেক্টরি', 'Department Directory')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/officers" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('কর্মকর্তা রোস্টার', 'Officer Roster')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/registry" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('ওয়ার্ড ও সম্পদ রেজিস্ট্রি', 'Ward & Asset Registry')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4. Rules & AI Governance */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('৪. বিধি ও এআই গভর্ন্যান্স', '4. Rules & AI Governance')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('দায়িত্ব বণ্টন বিধি, মাল্টি-ডিপার্টমেন্ট সিকোয়েন্স ও ৮০% এআই সেফটি গেট কন্ট্রোল।', 'Responsibility rules, sequencing pipelines, and 80% AI confidence gates.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/rules" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('দায়িত্ব বণ্টন নীতিমালা', 'Responsibility Rules')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/sequencing-rules" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('টাস্ক-সিকোয়েন্সিং বিধি', 'Task Sequencing Rules')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/ai-gate" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('এআই কনফিডেন্স গেট', 'AI Confidence Gate')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/ai-safety" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('জরুরি সেফটি কনফিগারেশন', 'AI Safety Config')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5. Service Knowledge */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('৫. সেবা নলেজবেস (RAG)', '5. Service Knowledge (RAG)')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('অনুমোদিত নাগরিক সনদ, সরকারি গেজেট ও সেবা তথ্য হালনাগাদের অডিট লগ।', 'Verified citizen charters, gazette knowledge sources, and update logs.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/services" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('যাচাইকৃত সেবা সনদপত্র', 'Verified Service Charters')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/service-sources" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('দাপ্তরিক তথ্যসূত্র ও গেজেট', 'Official Gazette Sources')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/knowledge-history" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('ইনজেশন ও আপডেট হিস্ট্রি', 'Knowledge Ingestion History')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6. SLA & Operations */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('৬. এসএলএ ও অপারেশনস', '6. SLA & Operations')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('সিটি কর্পোরেশনের নিজস্ব সমাধান টার্গেট, এস্কেলেশন ট্রিগার ও পাবলিক ড্যাশবোর্ড ফিল্টার।', 'Municipal resolution benchmarks, escalation triggers, and transparency filters.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/sla-policies" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('এসএলএ নীতিমালা পরিচালনা', 'SLA Policy Engine')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/escalation-config" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('এস্কেলেশন ও অ্যালার্ট কনফিগ', 'Escalation & Alert Config')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/public-dashboard-settings" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('পাবলিক ড্যাশবোর্ড সেটিংস', 'Public Dashboard Settings')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 7. Audit & Security */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('৭. অডিট ও নিরাপত্তা', '7. Audit & Security')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('অপরিবর্তনীয় SHA-256 চেইন অডিট লগ, সিকিউরিটি ইভেন্ট ও সিস্টেম প্যারামিটার ভার্সনিং।', 'Immutable SHA-256 audit log, security telemetry, and config change history.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/audit" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('অপরিবর্তনীয় অডিট ট্রেইল', 'Immutable Audit Trail')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/security-events" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('নিরাপত্তা ও অথরাইজেশন ইভেন্ট', 'Security & Auth Events')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/config-history" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('কনফিগারেশন চেঞ্জ হিস্ট্রি', 'Configuration Change History')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 8. Analytics & Transparency */}
        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:shadow-lux transition-all duration-200 group flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">
                {t('৮. অ্যানালিটিক্স ও স্বচ্ছতা', '8. Analytics & Transparency')}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed font-bangla">
                {t('PII-মুক্ত সমন্বিত টেলিমেট্রি, পুনরাবৃত্ত হটস্পট প্রবণতা ও পাবলিক সিটিজেনশিপ ইনডেক্স।', 'Aggregated telemetry, recurring cluster trends, and transparency indices.')}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-xs font-medium">
            <Link to="/admin/analytics" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('অ্যাগ্রিগেটেড সার্ভিস মেট্রিক্স', 'Aggregated Service Metrics')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/repeat-issues" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('রিপিট-ইস্যু ও হটস্পট ডেটা', 'Repeat-Issue & Hotspot Telemetry')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/admin/transparency-metrics" className="flex items-center justify-between py-1 text-[var(--ink)] hover:underline">
              <span>{t('স্বচ্ছতা ও জনসেবা সূচক', 'Transparency & Civic Index')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
