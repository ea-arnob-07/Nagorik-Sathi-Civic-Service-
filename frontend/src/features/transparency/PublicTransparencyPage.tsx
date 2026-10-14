import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Layers,
  Award,
  Flame,
  FileCheck2,
  ArrowUpRight
} from 'lucide-react';
import { toBanglaNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export const PublicTransparencyPage: React.FC = () => {
  const { t, language } = useLanguage();

  const TRANSPARENCY_KPIS = [
    {
      title: t('মোট দাখিলকৃত অভিযোগ', 'Total Complaints Ingested'),
      value: language === 'en' ? '3,248' : '৩,২৪৮',
      sub: t('সর্বমোট নাগরিক ইনটেক', 'Total Citizen Intake'),
      change: t('+১২% বিগত মাস হতে', '+12% from previous month'),
      colorClass: 'text-[#eeeee6]'
    },
    {
      title: t('সফলভাবে সমাধানকৃত', 'Successfully Resolved'),
      value: language === 'en' ? '3,060' : '৩,০৬০',
      sub: t('৯৪.২% সফল সমাধান হার', '94.2% Resolution Rate'),
      change: t('নাগরিক যাচাইকৃত', 'Citizen Verified Proof'),
      colorClass: 'text-emerald-800 dark:text-emerald-300'
    },
    {
      title: t('গড় সমাধান সময়', 'Average Resolution Time'),
      value: language === 'en' ? '6.4 Hours' : '৬.৪ ঘণ্টা',
      sub: t('জরুরি ক্ষেত্রে ২.১ ঘণ্টা', '2.1h for Emergency Hazard'),
      change: t('এসএলএ অনুবর্তন ৯৬.৫%', 'SLA Adherence 96.5%'),
      colorClass: 'text-amber-800 dark:text-amber-300'
    },
    {
      title: t('সক্রিয় দীর্ঘস্থায়ী হটস্পট', 'Active Chronic Hotspots'),
      value: language === 'en' ? '4 Zones' : '৪ টি',
      sub: t('পুনরাবৃত্তিমূলক ক্লাস্টার', 'Recurring Cluster Alerts'),
      change: t('বিশেষ নজরদারি চলমান', 'Escalated Vigilance Active'),
      colorClass: 'text-rose-800 dark:text-rose-300'
    }
  ];

  const DEPARTMENT_PERFORMANCE = [
    {
      name: t('বর্জ্য ব্যবস্থাপনা বিভাগ', 'Waste Management Dept'),
      cases: 1420,
      resolved: 1365,
      rate: language === 'en' ? '96.1%' : '৯৬.১%',
      avgHours: language === 'en' ? '4.2h' : '৪.২ ঘণ্টা'
    },
    {
      name: t('ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ', 'Drainage & Sanitation Dept'),
      cases: 980,
      resolved: 912,
      rate: language === 'en' ? '93.1%' : '৯৩.১%',
      avgHours: language === 'en' ? '5.8h' : '৫.৮ ঘণ্টা'
    },
    {
      name: t('সিভিল ও সড়ক সংস্কার বিভাগ', 'Civil & Road Infrastructure Dept'),
      cases: 540,
      resolved: 498,
      rate: language === 'en' ? '92.2%' : '৯২.২%',
      avgHours: language === 'en' ? '12.4h' : '১২.৪ ঘণ্টা'
    },
    {
      name: t('বিদ্যুৎ ও আলোকায়ন বিভাগ', 'Electrical & Street Lighting Dept'),
      cases: 308,
      resolved: 285,
      rate: language === 'en' ? '92.5%' : '৯২.৫%',
      avgHours: language === 'en' ? '6.1h' : '৬.১ ঘণ্টা'
    }
  ];

  const WARD_LEADERBOARD = [
    {
      ward: t('ওয়ার্ড ৩ (মিরপুর)', 'Ward 03 (Mirpur)'),
      total: 840,
      rate: language === 'en' ? '95.2%' : '৯৫.২%',
      rating: language === 'en' ? '4.8 / 5.0' : '৪.৮ / ৫.০',
      status: t('সেরা পারফর্মিং', 'Top Performing')
    },
    {
      ward: t('ওয়ার্ড ১২ (ধানমন্ডি)', 'Ward 12 (Dhanmondi)'),
      total: 720,
      rate: language === 'en' ? '94.8%' : '৯৪.৮%',
      rating: language === 'en' ? '4.7 / 5.0' : '৪.৭ / ৫.০',
      status: t('উন্নত সেবা', 'Excellence')
    },
    {
      ward: t('ওয়ার্ড ৮ (গুলশান)', 'Ward 08 (Gulshan)'),
      total: 610,
      rate: language === 'en' ? '93.6%' : '৯৩.৬%',
      rating: language === 'en' ? '4.6 / 5.0' : '৪.৬ / ৫.০',
      status: t('ধারাবাহিক', 'Consistent')
    },
    {
      ward: t('ওয়ার্ড ১৯ (বনানী)', 'Ward 19 (Banani)'),
      total: 520,
      rate: language === 'en' ? '92.9%' : '৯২.৯%',
      rating: language === 'en' ? '4.5 / 5.0' : '৪.৫ / ৫.০',
      status: t('সন্তোষজনক', 'Satisfactory')
    }
  ];

  return (
    <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono tracking-widest text-[var(--muted)] uppercase font-semibold">
              OPEN CIVIC GOVERNANCE & ACCOUNTABILITY
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
            {t('নাগরিক সেবা স্বচ্ছতা ও', 'Civic Service Transparency &')}{' '}
            <span className="font-light text-[var(--muted)]">
              {t('পৌর কর্মক্ষমতা ড্যাশবোর্ড', 'Municipal Performance Dashboard')}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2 max-w-3xl leading-relaxed">
            {t(
              'সিটি কর্পোরেশনের সকল নাগরিক অভিযোগের সার্বিক অগ্রগতি, বিভাগীয় কর্মক্ষমতা, এসএলএ লক্ষ্যমাত্রা এবং ওয়ার্ডভিত্তিক পারফরম্যান্স পরিসংখ্যান সবার জন্য উন্মুক্ত।',
              'Real-time municipal grievance resolution progress, department SLA performance, and ward rankings made fully public and transparent.'
            )}
          </p>
        </div>

        {/* PII Shield Compliance Badge */}
        <div className="bg-[var(--paper)] border border-[var(--line)] px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xs shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-left text-xs">
            <strong className="text-[var(--ink)] block font-bold">
              {t('PII প্রাইভেসি শিল্ড সক্রিয়', 'PII Privacy Shield Active')}
            </strong>
            <span className="text-xs text-[var(--muted)]">
              {t('ব্যক্তিগত পরিচয় ও ফোন নম্বর স্বয়ংক্রিয়ভাবে গোপন', 'Citizen identity and phone numbers automatically redacted')}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Core KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TRANSPARENCY_KPIS.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 border border-[var(--line)] bg-[var(--paper)] space-y-3 hover:border-[var(--line-strong)] transition shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--muted)]">{kpi.title}</span>
              <BarChart3 className="w-4.5 h-4.5 text-[var(--muted)]" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[var(--ink)]">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--line)]">
              <span className="text-[var(--muted)] font-mono">{kpi.sub}</span>
              <span className="text-[var(--ink)] font-medium">{kpi.change}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 2. Department Performance & SLA Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Table */}
        <div className="lg:col-span-8 rounded-2xl p-6 sm:p-7 border border-[var(--line)] bg-[var(--paper)] space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[var(--ink)]" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--ink)]">
                {t('বিভাগভিত্তিক অভিযোগ ও সমাধান কর্মক্ষমতা', 'Department Grievance & SLA Performance')}
              </h2>
            </div>
            <span className="text-xs font-mono text-[var(--muted)] bg-[var(--bg)] px-2.5 py-1 rounded-md border border-[var(--line)]">
              {t('বিগত ৩০ দিন', 'Last 30 Days')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-3">{t('পৌর বিভাগ', 'Municipal Department')}</th>
                  <th className="py-3.5 px-3 text-right">{t('মোট অভিযোগ', 'Complaints')}</th>
                  <th className="py-3.5 px-3 text-right">{t('নিষ্পত্তি', 'Resolved')}</th>
                  <th className="py-3.5 px-3 text-right">{t('সমাধান হার', 'Resolution Rate')}</th>
                  <th className="py-3.5 px-3 text-right">{t('গড় সময়', 'Avg SLA')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {DEPARTMENT_PERFORMANCE.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-[var(--paper-elevated)] transition cursor-pointer">
                    <td className="py-4 px-3 font-semibold text-[var(--ink)]">{dept.name}</td>
                    <td className="py-4 px-3 text-right font-mono text-[var(--muted)]">
                      {language === 'en' ? dept.cases : toBanglaNumber(dept.cases)}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-[var(--muted)]">
                      {language === 'en' ? dept.resolved : toBanglaNumber(dept.resolved)}
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {dept.rate}
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-[var(--ink)] font-mono">
                      {dept.avgHours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SLA Compliance Ladder Overview */}
        <div className="lg:col-span-4 rounded-2xl p-6 sm:p-7 border border-[var(--line)] bg-[var(--paper)] space-y-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--line)]">
            <Clock className="w-5 h-5 text-[var(--ink)]" />
            <h3 className="text-base font-bold text-[var(--ink)]">
              {t('এসএলএ (SLA) অনুবর্তন স্তর', 'SLA Adherence Targets')}
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>{t('জরুরি হ্যাজার্ড (৬ ঘণ্টা)', 'Emergency Hazard (6h)')}</span>
                </span>
                <span className="font-bold text-[var(--ink)] font-mono">98.4%</span>
              </div>
              <div className="w-full bg-[var(--line)] h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '98.4%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{t('উচ্চ অগ্রাধিকার (২৪ ঘণ্টা)', 'High Priority (24h)')}</span>
                </span>
                <span className="font-bold text-[var(--ink)] font-mono">95.1%</span>
              </div>
              <div className="w-full bg-[var(--line)] h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '95.1%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{t('সাধারণ সংস্কার (৭২ ঘণ্টা)', 'Standard Repairs (72h)')}</span>
                </span>
                <span className="font-bold text-[var(--ink)] font-mono">91.8%</span>
              </div>
              <div className="w-full bg-[var(--line)] h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '91.8%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ward Leaderboard */}
      <section className="rounded-2xl p-6 sm:p-7 border border-[var(--line)] bg-[var(--paper)] space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[var(--ink)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--ink)]">
              {t('ওয়ার্ডভিত্তিক নাগরিক সেবা রেটিং ও পারফরম্যান্স', 'Ward Rankings & Citizen Satisfaction Ratings')}
            </h2>
          </div>
          <span className="text-xs text-[var(--muted)]">
            {t('সিটি কর্পোরেশন সমন্বিত মূল্যায়ন', 'CCC Composite Municipal Evaluation')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WARD_LEADERBOARD.map((ward, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-3 hover:border-[var(--line-strong)] hover:bg-[var(--paper-elevated)] transition shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--ink)]">{ward.ward}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-[var(--paper)] text-[var(--ink)] font-mono border border-[var(--line)]">
                  {ward.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-[var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>{t('অভিযোগ নিষ্পত্তি:', 'Resolution Rate:')}</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{ward.rate}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('নাগরিক রেটিং:', 'Citizen Rating:')}</span>
                  <strong className="text-[var(--ink)] font-mono">{ward.rating}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('মোট অভিযোগ:', 'Total Ingested:')}</span>
                  <span className="font-mono text-[var(--ink)]">
                    {language === 'en' ? ward.total : toBanglaNumber(ward.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Tamper-Proof Cryptographic Verification Seal */}
      <section className="p-5 rounded-2xl bg-[var(--paper)] border border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <FileCheck2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <strong className="text-[var(--ink)] block text-sm">
              {t('ক্রিপ্টোগ্রাফিক অপরিবর্তনীয় অডিট হ্যাশ চেইন নিশ্চিতকরণ', 'Cryptographic Immutable Audit Hash Chaining')}
            </strong>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              {t(
                'উপরোক্ত সকল তথ্য ও সমাপ্তি প্রমাণ SHA-256 ব্লকহ্যাশ ভ্যালিডেশন চেইনে সংরক্ষিত। কোনো তথ্য মুছে ফেলা বা পরিবর্তন করা যায় না।',
                'All operational records, resolution timestamps, and inspection proofs are sealed with SHA-256 tamper-evident hash chaining.'
              )}
            </p>
          </div>
        </div>
        <div className="font-mono text-[11px] px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] font-bold">
          HASH: e9f8...2a1c · VERIFIED
        </div>
      </section>
    </div>
  );
};
