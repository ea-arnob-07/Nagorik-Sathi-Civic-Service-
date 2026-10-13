import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Building2, ClipboardList, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import { DEMO_ROLES } from '../../constants';

const icons = [UserRound, ClipboardList, BriefcaseBusiness, UsersRound, ShieldCheck, Building2];
const paths: Record<string, string> = {
  citizen: '/login/citizen',
  ward_desk: '/login/ward',
  field_officer: '/login/officer',
  coordinator: '/login/coordinator',
  admin: '/login/admin',
  governance_head: '/login/governance'
};
const copy: Record<string, { title: string; description: string; badge: string }> = {
  citizen: { title: 'নাগরিক', description: 'অভিযোগ ও সেবা', badge: 'CITIZEN' },
  ward_desk: { title: 'ওয়ার্ড ডেস্ক', description: 'যাচাই ও দায়িত্ব বণ্টন', badge: 'WARD' },
  field_officer: { title: 'দপ্তর কর্মকর্তা', description: 'কাজ ও মাঠপর্যায়ের প্রমাণ', badge: 'OFFICER' },
  coordinator: { title: 'কেস সমন্বয়ক', description: 'বিভাগীয় সমন্বয় ও SLA', badge: 'COORDINATOR' },
  admin: { title: 'সিস্টেম অ্যাডমিন', description: 'ব্যবহারকারী ও প্ল্যাটফর্ম', badge: 'ADMIN' },
  governance_head: { title: 'গভর্ন্যান্স প্রধান', description: 'নীতিমালা ও অনুমোদন', badge: 'GOVERNANCE' }
};

export const RoleSelectionPage: React.FC = () => (
  <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
    <Link to="/" className="mb-7 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--accent)]"><ArrowLeft size={16} /> মূল পাতায় ফিরুন</Link>
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--accent)]">NAGARSETU / WORKSPACE ACCESS</span><h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">আপনার workspace নির্বাচন করুন</h1><p className="mt-1 text-xs text-[var(--muted)]">নিজ নিজ দায়িত্ব অনুযায়ী প্রবেশ করুন।</p></div>
      <span className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-[10px] font-semibold text-[var(--muted)]">৬টি পৃথক workspace</span>
    </header>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DEMO_ROLES.map((role, index) => {
        const Icon = icons[index] || Building2;
        const info = copy[role.role] || { title: role.title, description: role.subtitle, badge: role.role };
        return <Link key={role.role} to={paths[role.role] || `/login/${role.role}`} className="group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xs transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] transition group-hover:scale-105"><Icon className="h-5 w-5" /></span><span className="font-mono text-[9px] font-bold tracking-widest text-[var(--muted-light)]">{info.badge}</span></div><div><h2 className="text-base font-bold text-[var(--ink)]">{info.title}</h2><p className="mt-1 text-xs text-[var(--muted)]">{info.description}</p></div><ArrowUpRight className="absolute bottom-5 right-5 h-4 w-4 text-[var(--accent)] transition group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>;
      })}
    </div>
  </main>
);
export default RoleSelectionPage;
