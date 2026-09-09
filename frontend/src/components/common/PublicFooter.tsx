import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, Building2, FileSearch, MapPin, ShieldCheck,
  PhoneCall, HeartHandshake, CheckCircle2, Award, Landmark
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PublicFooter: React.FC = () => {
  const { t } = useLanguage();

  const serviceLinks = [
    { label: t('নাগরিক অভিযোগ দাখিল', 'File Civic Complaint'), path: '/report', icon: FileSearch },
    { label: t('কেস লাইভ ট্র্যাকিং', 'Live Case Tracking'), path: '/cases', icon: FileSearch },
    { label: t('নগর ওয়ার্ড মানচিত্র', 'Ward GIS Map'), path: '/map', icon: MapPin },
    { label: t('নাগরিক সেবা সনদ', 'Citizen Charter'), path: '/services', icon: Building2 },
    { label: t('পাবলিক স্বচ্ছতা ড্যাশবোর্ড', 'Transparency Dashboard'), path: '/transparency', icon: ShieldCheck }
  ];

  const workspaceLinks = [
    { label: t('নাগরিক পোর্টাল', 'Citizen Portal'), path: '/login/citizen' },
    { label: t('ওয়ার্ড ডেস্ক ওয়ার্কস্পেস', 'Ward Desk Workspace'), path: '/login/ward' },
    { label: t('দপ্তর প্রকৌশলী পোর্টাল', 'Department Engineers'), path: '/login/dept' },
    { label: t('প্রধান সমন্বয়ক হাব', 'Case Coordinator Hub'), path: '/login/coord' },
    { label: t('সিটি গভর্নেন্স ও সচিব', 'City Governance & Secretary'), path: '/login/governance' },
    { label: t('সিস্টেম অ্যাডমিন কনসোল', 'System Admin Console'), path: '/login/admin' }
  ];

  return (
    <footer className="nagar-footer border-t border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]">
      <div className="section-shell py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--line-subtle)]">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/images/nagorik-sathi-logo-dark.png"
                alt="নাগরিক সাথী"
                className="h-14 w-auto max-w-[300px] object-contain"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-md">
              {t(
                'নাগরিক সমস্যা নিরসনে এআই সহায়তা, ৬-মডেল বাংলা এনএলপি এনসেম্বল, ওয়ার্ড কাউন্সিলর ডেস্ক এবং সিটি কর্পোরেশনের প্রকৌশল বিভাগসমূহের ডিজিটাল মেলবন্ধন।',
                'Bridging citizens with ward councillor desks, AI NLP ensemble routing, and municipal engineering departments for accountable resolutions.'
              )}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> {t('শতভাগ অডিট ট্রেইল', '100% Audit Chaining')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1 text-[10px] font-semibold text-cyan-700 dark:text-cyan-300">
                <Award className="h-3 w-3" /> {t('এসএলএ গ্যারান্টি', 'Strict SLA Guarantee')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                <HeartHandshake className="h-3 w-3" /> {t('নাগরিক সন্তুষ্টি অধিকার', 'Citizen Statutory Rights')}
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
              {t('নাগরিক সুবিধাসমূহ', 'Civic Services')}
            </h4>
            <ul className="space-y-2 text-xs">
              {serviceLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[var(--muted)] hover:text-[var(--accent)] transition inline-flex items-center gap-1.5"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Role Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
              {t('দাপ্তরিক ওয়ার্কস্পেস', 'Official Portals')}
            </h4>
            <ul className="space-y-2 text-xs">
              {workspaceLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[var(--muted)] hover:text-[var(--accent)] transition inline-flex items-center gap-1.5"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Strip inside Footer */}
        <div className="py-4 border-b border-[var(--line-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-red-500" />
            <span className="font-bold text-[var(--ink)]">{t('জরুরি সহায়তা হটলাইন:', 'Emergency Hotlines:')}</span>
            <span className="text-[var(--muted)]">{t('জাতীয় জরুরি সেবা', 'National Emergency')} <strong className="text-red-600 font-mono">৯৯৯</strong></span>
            <span className="text-[var(--line)]">|</span>
            <span className="text-[var(--muted)]">{t('নাগরিক সেবা বাতায়ন', 'Citizen Helpline')} <strong className="text-emerald-600 font-mono">৩৩৩</strong></span>
            <span className="text-[var(--line)]">|</span>
            <span className="text-[var(--muted)]">{t('চসিক কেন্দ্রীয় নিয়ন্ত্রণ কক্ষ', 'CCC Control Room')} <strong className="text-[var(--accent)] font-mono">০৩১-৬২০১১১</strong></span>
          </div>
          <div className="text-[11px] text-[var(--muted)]">
            <span className="inline-flex items-center gap-1 font-mono">
              <Landmark className="h-3.5 w-3.5" /> CCC PILOT 2026
            </span>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <div>
            © {new Date().getFullYear()} Nagorik Sathi ({t('নাগরিক সাথী', 'Nagorik Sathi')}) · {t('সর্বস্বত্ব সংরক্ষিত।', 'All rights reserved.')}
          </div>
          <div className="flex items-center gap-4">
            <span className="nagar-developed flex items-center gap-1.5">
              <span>Developed by</span>
              <a
                href="https://ea-arnob-07.github.io/Arnob-Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold underline decoration-emerald-500/60 hover:decoration-emerald-300 transition cursor-pointer"
                title="Estiuk Arafat Arnob - Portfolio"
              >
                Estiuk Arafat Arnob
              </a>
            </span>
            <span className="text-[var(--line)]">·</span>
            <span>{t('নাগরিক ডেটা সুরক্ষা ও নিরাপত্তা নিশ্চিত', 'Citizen Data Privacy & Security Protected')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
