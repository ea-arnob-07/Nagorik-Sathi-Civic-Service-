import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCases } from '../../context/CaseContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { CaseStatus } from '../../types';
import { formatBanglaDate, toBanglaNumber } from '../../utils/formatters';
import { FileText, PlusCircle, Search, Filter, MapPin, ArrowRight } from 'lucide-react';

export const CitizenCasesListPage: React.FC = () => {
  const { cases } = useCases();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const citizenCases = cases.filter(
    c => c.citizenId === currentUser.id || c.id === 'NS-2026-000184' || c.id === 'NS-2026-000170' || c.id === 'NS-2026-000192'
  );

  const filteredCases = citizenCases.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? c.status !== 'closed'
        : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCount = citizenCases.filter(c => c.status !== 'closed').length;
  const resolvedCount = citizenCases.filter(c => c.status === 'resolved_pending_citizen' || c.status === 'closed').length;

  const countDisplay = (n: number) => (language === 'en' ? n.toString() : toBanglaNumber(n));

  return (
    <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header & New Report Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            {t('আমার অভিযোগ ও', 'My Complaints &')}{' '}
            <strong className="font-extrabold text-[#166534]">{t('আবেদনের তালিকা', 'Application Ledger')}</strong>
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1.5">
            {t(
              'আপনার দাখিলকৃত সকল নাগরিক সমস্যা, সমাধান অগ্রগতি ও দাপ্তরিক রিপোর্ট ট্র্যাক করুন',
              'Track all your submitted civic grievances, real-time progress, and departmental verification reports.'
            )}
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-sm font-bold shadow-md transition cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-5 h-5 text-white" />
          <span>{t('নতুন সমস্যা জানান', 'Report New Problem')}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 bg-[var(--paper)] border border-[var(--line)] shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4.5 h-4.5 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t(
              'কেস আইডি (যেমন NS-2026-000184), সমস্যার নাম বা এলাকা দিয়ে খুঁজুন...',
              'Search by Case ID (e.g. NS-2026-000184), title, or location...'
            )}
            className="w-full pl-11 pr-4 py-3 text-sm bg-[var(--bg)] text-[var(--ink)] placeholder-[var(--muted)] rounded-xl border border-[var(--line)] focus:outline-none focus:border-[var(--green)] transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4.5 h-4.5 text-[var(--green)] shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 text-sm bg-[var(--bg)] text-[var(--ink)] rounded-xl border border-[var(--line)] font-semibold focus:outline-none focus:border-[var(--green)] cursor-pointer"
          >
            <option value="all">{t('সকল অভিযোগ', 'All Complaints')} ({countDisplay(citizenCases.length)})</option>
            <option value="active">{t('চলমান অভিযোগ', 'Active Complaints')} ({countDisplay(activeCount)})</option>
            <option value="in_progress">{t('কাজ চলমান', 'In Progress')}</option>
            <option value="resolved_pending_citizen">{t('সমাধানের প্রমাণ আপলোডকৃত', 'Resolution Uploaded')}</option>
            <option value="closed">{t('চূড়ান্ত বন্ধ', 'Closed')} ({countDisplay(resolvedCount)})</option>
            <option value="reopened">{t('পুনরায় তদন্তাধীন', 'Reopened')}</option>
          </select>
        </div>
      </div>

      {/* Wide Dashboard Layout: 8 cols cases + 4 cols status radar & assist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cases Cards List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {filteredCases.length === 0 ? (
            <div className="rounded-2xl p-12 text-center text-[var(--muted)] bg-[var(--paper)] border border-[var(--line)] space-y-3">
              <FileText className="w-12 h-12 mx-auto text-[var(--muted)] opacity-50" />
              <h3 className="text-base font-bold text-[var(--ink)]">{t('কোনো অভিযোগ পাওয়া যায়নি', 'No complaints found')}</h3>
              <p className="text-sm text-[var(--muted)]">{t('অনুসন্ধান ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন', 'Try adjusting your search or status filter')}</p>
            </div>
          ) : (
            filteredCases.map(item => (
              <Link
                key={item.id}
                to={`/cases/${item.id}`}
                className="rounded-2xl p-6 block group bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--green)] hover:bg-[var(--green-light)] hover:shadow-xs transition duration-200 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[var(--ink)] bg-[var(--bg)] px-3 py-1 rounded-lg border border-[var(--line)]">
                      #{item.id}
                    </span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <h3 className="text-lg font-bold text-[var(--ink)] group-hover:text-[var(--green)] transition">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="pt-3.5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
                      <MapPin className="w-4 h-4 text-[var(--green)]" />
                      <span>{item.location.address}</span>
                    </span>
                    <span>•</span>
                    <span>{t('দাখিল:', 'Submitted:')} <strong className="text-[var(--ink)] font-normal">{language === 'en' ? new Date(item.submittedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : formatBanglaDate(item.submittedAt)}</strong></span>
                    <span>•</span>
                    <span>{t('বিভাগ:', 'Dept:')} <strong className="text-[var(--ink)] font-semibold">{item.aiAnalysis.proposedDepartmentName}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-[var(--green)] group-hover:translate-x-1 transition-transform text-sm">
                    <span>{t('টাইমলাইন ও প্রমাণ দেখুন', 'View Timeline & Proof')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right Column: Civic Overview & Support Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-[var(--paper)] rounded-2xl p-6 border border-[var(--line)] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider">
              {t('নাগরিক অভিযোগ স্থিতি', 'Complaint Status Overview')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-center">
                <span className="text-xs text-[var(--muted)] block">{t('মোট দাখিলকৃত', 'Total Ingested')}</span>
                <span className="text-2xl font-bold font-mono text-[var(--ink)]">{countDisplay(citizenCases.length)}</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-xs text-amber-700 dark:text-amber-400 block">{t('চলমান কাজ', 'Active Tasks')}</span>
                <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">{countDisplay(activeCount)}</span>
              </div>
              <div className="p-4 rounded-xl bg-[var(--green-light)] border border-[var(--line)] text-center col-span-2">
                <span className="text-xs text-[var(--green)] block">{t('সমাধান সম্পন্ন (যাচাইকৃত)', 'Resolved & Verified')}</span>
                <span className="text-2xl font-bold font-mono text-[var(--green)]">{countDisplay(resolvedCount)}</span>
              </div>
            </div>
          </div>

          {/* Citizen Rights & Verification Card */}
          <div className="bg-[var(--paper)] rounded-2xl p-6 border border-[var(--line)] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--green)] bg-[var(--green-light)] px-3 py-1 rounded-full border border-[var(--line)]">
              {t('নাগরিক যাচাই অধিকার', 'Citizen Verification Rights')}
            </div>
            <h4 className="text-base font-bold text-[var(--ink)]">
              {t('“সমাধান হোক প্রমাণসহ”', '“Resolution Backed by Evidence”')}
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              {t(
                'মাঠ পর্যায়ের কাজ সম্পন্ন হলে কর্মকর্তা সমাধানের ছবি আপলোড করবেন। সমাধান সঠিক না হলে আপনি একই কেসে আপত্তি দাখিল করে পুনরায় কাজ করাতে পারবেন।',
                'Upon completion, field officers submit tamper-proof geotagged photos. If unsatisfied, citizens can reopen the case with one click.'
              )}
            </p>
          </div>

          {/* Emergency Helpline Card */}
          <div className="bg-[var(--green-light)] rounded-2xl p-6 border border-[var(--line)] shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-[var(--green)]">
              {t('জরুরি হেল্পলাইন ও কন্ট্রোল রুম', 'Emergency Helpline & Control Room')}
            </h4>
            <p className="text-xs text-[var(--muted)]">
              {t(
                'অতি জরুরি ড্রেনেজ ওভারফ্লো, তার ছেঁড়া বা বিপজ্জনক সড়ক ধসের ক্ষেত্রে সরাসরি কল করুন:',
                'For urgent hazards like live wire collapse, hazardous road caves, or toxic drainage spills:'
              )}
            </p>
            <div className="p-3 bg-[var(--paper)] rounded-xl border border-[var(--line)] flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--muted)] block">{t('সিটি কর্পোরেশন হটলাইন', 'City Hotline')}</span>
                <span className="text-lg font-bold text-[var(--ink)]">{t('১৬১০৬', '16106')}</span>
              </div>
              <span className="text-xs font-semibold text-[var(--green)] bg-[var(--green-light)] px-2.5 py-1 rounded-lg">
                {t('২৪/৭ সেবা', '24/7 Service')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
