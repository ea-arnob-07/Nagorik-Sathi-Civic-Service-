import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCases } from '../../context/CaseContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpen, Camera, CheckCircle2,
  FileSearch, MapPin, UserRound, ShieldCheck, Search, Clock,
  Sparkles, CheckCheck, AlertCircle
} from 'lucide-react';
import { toBanglaNumber, formatBanglaDate } from '../../utils/formatters';

export const CitizenHomePage: React.FC = () => {
  const { cases } = useCases();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [trackSearch, setTrackSearch] = useState('');

  const shortcuts = [
    { label: t('নতুন অভিযোগ', 'New Report'), detail: t('ছবি ও অবস্থানসহ রিপোর্ট', 'Photo & Location Report'), path: '/report', icon: Camera, tone: 'teal' },
    { label: t('আমার অভিযোগ', 'My Cases'), detail: t('স্ট্যাটাস ও টাইমলাইন', 'Live Status & Timeline'), path: '/cases', icon: FileSearch, tone: 'blue' },
    { label: t('নগর মানচিত্র', 'City GIS Map'), detail: t('এলাকাভিত্তিক সেবা ও ম্যাপ', 'Live Dhaka & Ward GIS'), path: '/map', icon: MapPin, tone: 'violet' },
    { label: t('সেবা নির্দেশিকা', 'Services Charter'), detail: t('নাগরিক চার্টার ও নিয়ম', 'Citizen Rules & Fees'), path: '/services', icon: BookOpen, tone: 'amber' },
    { label: t('নোটিফিকেশন', 'Alerts & Messages'), detail: t('আপডেট ও এসএলএ বার্তা', 'SLA Timers & Notices'), path: '/notifications', icon: Bell, tone: 'green' },
    { label: t('আমার প্রোফাইল', 'My Account'), detail: t('অ্যাকাউন্ট ও সেটিংস', 'Ward & Personal Profile'), path: '/profile', icon: UserRound, tone: 'slate' }
  ];

  const citizenCases = cases.filter(
    (c) => c.citizenId === currentUser.id || ['NS-2026-000184', 'NS-2026-000170', 'NS-2026-W03-1001'].includes(c.id)
  );
  const activeCasesCount = citizenCases.filter((c) => c.status !== 'closed').length;
  const resolvedCasesCount = citizenCases.filter(
    (c) => c.status === 'resolved_pending_citizen' || c.status === 'closed'
  ).length;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackSearch.trim()) {
      navigate(`/cases/${trackSearch.trim()}`);
    }
  };

  const getProgressPct = (status: string) => {
    switch (status) {
      case 'closed':
      case 'resolved_pending_citizen':
        return 100;
      case 'in_progress':
        return 70;
      case 'department_assigned':
      case 'ward_verified':
        return 45;
      case 'under_ward_review':
        return 25;
      default:
        return 15;
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* ======================= HERO DASHBOARD ======================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#092237] via-[#0d3148] to-[#072033] p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-white/5 pointer-events-none" />
        <div className="absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              NAGORIK SATHI / CITIZEN PORTAL
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-4xl text-white">
              {t('স্বাগতম', 'Welcome')}, {currentUser.name}
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/75 sm:text-sm">
              {t(
                'আপনার এলাকার সমস্যা জানান, সমাধান অগ্রগতি রিয়েল-টাইমে পর্যবেক্ষণ করুন এবং সমাধান কাজের প্রমাণ যাচাই করুন।',
                'Report local civic problems, monitor real-time department resolution progress, and verify photographic evidence.'
              )}
            </p>

            {/* Quick Track Input in Citizen Dashboard */}
            <form onSubmit={handleTrackSubmit} className="mt-5 flex max-w-md items-center rounded-xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md">
              <Search className="ml-2 h-4 w-4 text-white/60" />
              <input
                type="text"
                value={trackSearch}
                onChange={(e) => setTrackSearch(e.target.value)}
                placeholder={t('কেস নম্বর খুঁজুন (যেমন: NS-2026-000184)', 'Search case ID (e.g. NS-2026-000184)')}
                className="w-full bg-transparent px-3 py-1 text-xs text-white placeholder-white/50 outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-emerald-300 cursor-pointer"
              >
                {t('খুঁজুন', 'Search')}
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/report"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-200 px-5 text-xs font-bold text-[#06332c] shadow-lg transition hover:-translate-y-0.5 hover:from-emerald-200 hover:to-teal-100"
            >
              <Camera className="h-4 w-4" />
              <span>{t('নতুন অভিযোগ জানান', 'File Civic Grievance')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Counter Stats */}
        <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 border-t border-white/15 pt-5 sm:max-w-xl sm:gap-6">
          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs">
            <p className="text-[11px] text-white/60">{t('মোট অভিযোগ', 'Total Ingested')}</p>
            <strong className="mt-1 block font-mono text-xl text-white sm:text-2xl">
              {language === 'en' ? citizenCases.length : toBanglaNumber(citizenCases.length)}
            </strong>
          </div>
          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs">
            <p className="text-[11px] text-white/60">{t('চলমান কার্যক্রম', 'In Progress')}</p>
            <strong className="mt-1 block font-mono text-xl text-amber-200 sm:text-2xl">
              {language === 'en' ? activeCasesCount : toBanglaNumber(activeCasesCount)}
            </strong>
          </div>
          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs">
            <p className="text-[11px] text-white/60">{t('সফল সমাধান', 'Resolved')}</p>
            <strong className="mt-1 block font-mono text-xl text-emerald-300 sm:text-2xl">
              {language === 'en' ? resolvedCasesCount : toBanglaNumber(resolvedCasesCount)}
            </strong>
          </div>
        </div>
      </section>

      {/* ======================= QUICK SERVICES ======================= */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3 border-b border-[var(--line)] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--accent)]">
              DIRECT ACCESS
            </span>
            <h2 className="mt-1 text-lg font-bold text-[var(--ink)]">{t('আপনার প্রয়োজনীয় নাগরিক সেবা', 'Essential Civic Portals')}</h2>
          </div>
          <span className="text-xs text-[var(--muted)]">{t('এক ক্লিকে প্রবেশ করুন', 'One-Click Instant Access')}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {shortcuts.map(({ label, detail, path, icon: Icon, tone }) => (
            <Link key={path} to={path} className={`citizen-shortcut tone-${tone} group`}>
              <span className="citizen-shortcut-icon">
                <Icon className="h-5 w-5" />
              </span>
              <strong>{label}</strong>
              <small>{detail}</small>
              <ArrowUpRight className="citizen-shortcut-arrow h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* ======================= RECENT CASES WITH PROGRESS BARS ======================= */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3 border-b border-[var(--line)] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--accent)]">
              MY CASES & RESOLUTIONS
            </span>
            <h2 className="mt-1 text-lg font-bold text-[var(--ink)]">{t('আমার সাম্প্রতিক অভিযোগসমূহ', 'My Recent Grievances')}</h2>
          </div>
          <Link
            to="/cases"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline"
          >
            <span>{t('সবগুলো দেখুন', 'View All')} ({language === 'en' ? citizenCases.length : toBanglaNumber(citizenCases.length)})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {citizenCases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)] p-12 text-center">
            <FileSearch className="mx-auto h-10 w-10 text-[var(--muted-light)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{t('এখনো কোনো অভিযোগ জমা হয়নি', 'No grievances lodged yet')}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {t('আপনার এলাকার রাস্তা, বর্জ্য বা ড্রেনেজের যেকোনো সমস্যা ছবিসহ সহজে জানান।', 'Report road potholes, waste accumulation, or drainage overflows with instant GPS & photos.')}
            </p>
            <Link
              to="/report"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <Camera className="h-4 w-4" />
              <span>{t('প্রথম অভিযোগ জানান', 'Submit First Complaint')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {citizenCases.slice(0, 4).map((item) => {
              const progress = getProgressPct(item.status);
              return (
                <Link
                  key={item.id}
                  to={`/cases/${item.id}`}
                  className="group rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Case ID + Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-lg bg-[var(--paper-elevated)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--ink)] border border-[var(--line)]">
                        #{item.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={item.priority} />
                        <StatusBadge status={item.status} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-sm font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Meta info */}
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                        {item.location.wardName || item.location.address}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {language === 'en'
                          ? new Date(item.submittedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                          : formatBanglaDate(item.submittedAt)}
                      </span>
                    </div>

                    {/* Progress Visualizer */}
                    <div className="mt-4 pt-3 border-t border-[var(--line-subtle)]">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--muted)] mb-1">
                        <span>{t('কার্যক্রম অগ্রগতি', 'Work Progress')}</span>
                        <span className="font-mono font-bold text-[var(--ink)]">
                          {language === 'en' ? progress : toBanglaNumber(progress)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--paper-elevated)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer CTA */}
                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-[var(--accent)] pt-2 border-t border-[var(--line-subtle)]">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t('টাইমলাইন ও সমাধান প্রমাণক', 'Timeline & resolution evidence')}
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
