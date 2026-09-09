import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { toBanglaNumber, formatBanglaDate } from '../../utils/formatters';
import {
  Printer,
  X,
  Building2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, activeRole } = useAuth();
  const { cases } = useCases();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('report-print-mode');
    return () => document.body.classList.remove('report-print-mode');
  }, [isOpen]);

  if (!isOpen) return null;

  const now = new Date();
  const reportRef = `NAGORIK-REP-${activeRole?.toUpperCase() || 'CITIZEN'}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const formatNum = (num: number) => (language === 'en' ? num.toString() : toBanglaNumber(num));

  // Role title
  const getRoleTitle = () => {
    switch (activeRole) {
      case 'ward_desk':
        return t('ওয়ার্ড ডেস্ক কমান্ড ও ট্রায়াজ কার্যবিবরণী', 'Ward Desk Triage & Operational Executive Report');
      case 'field_officer':
        return t('মাঠ পর্যায়ের বিভাগীয় টাস্ক ও সমাধান রিপোর্ট', 'Field Officer Departmental Task & Resolution Audit');
      case 'coordinator':
        return t('বহু-বিভাগীয় কেস সমন্বয় ও সিকোয়েন্সিং রিপোর্ট', 'Multi-Department Coordination & Dependency Audit');
      case 'governance_head':
        return t('সিটি গভর্নেন্স ও পৌরনীতি বাস্তবায়ন রিপোর্ট', 'Municipal Governance & Policy Implementation Report');
      case 'admin':
        return t('সিস্টেম প্রশাসন, আইএএম ও অডিট রিপোর্ট', 'System Administration, IAM & Security Audit Report');
      default:
        return t('নাগরিক সমস্যা ও সমাধান ট্র্যাক প্রতিবেদন', 'Citizen Grievance & Resolution Official Record');
    }
  };

  const getRoleLabel = () => {
    switch (activeRole) {
      case 'ward_desk':
        return t('ওয়ার্ড ডেস্ক', 'Ward Desk');
      case 'field_officer':
        return t('দপ্তর কর্মকর্তা', 'Field Officer');
      case 'coordinator':
        return t('কেস সমন্বয়ক', 'Case Coordinator');
      case 'governance_head':
        return t('সিটি গভর্নেন্স প্রধান', 'Governance Head');
      case 'admin':
        return t('সিস্টেম অ্যাডমিন', 'System Administrator');
      default:
        return t('নাগরিক', 'Citizen');
    }
  };

  // Filter records based on role
  const relevantCases = cases.filter(c => {
    if (activeRole === 'citizen') {
      return c.citizenId === currentUser.id || c.id.startsWith('NS-2026');
    }
    if (activeRole === 'ward_desk') {
      return !currentUser.wardId || c.location.wardId === currentUser.wardId;
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers = ['Case ID', 'Title', 'Ward', 'Category', 'Priority', 'Status', 'Submitted At'];
    let rows = relevantCases.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.location.wardName}"`,
      c.category,
      c.priority,
      c.status,
      c.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportRef}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto report-modal-backdrop">
      <div className="bg-[var(--paper)] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[var(--line)] text-[var(--ink)] p-6 sm:p-8 space-y-6 report-printable-area font-sans">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)]">
                {t('অফিসিয়াল পিডিএফ ও ডেটা এক্সপোর্ট কনসোল', 'Official PDF & Data Export Console')}
              </h3>
              <p className="text-[11px] text-[var(--muted)]">
                {t('স্বাক্ষরিত অফিশিয়াল প্রতিবেদন প্রিন্ট বা ডাউনলোড করুন', 'Print or save authenticated civic governance report')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('প্রিন্ট / PDF সংরক্ষণ', 'Print / Save PDF')}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--paper-elevated)] text-[var(--ink)] text-xs font-semibold transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>{t('CSV ডাউনলোড', 'Export CSV')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Header */}
        <div className="text-center space-y-2 border-b-2 border-emerald-600/30 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('গণপ্রজাতন্ত্রী বাংলাদেশ · সিটি কর্পোরেশন পৌর সেবা', 'Government of the People\'s Republic of Bangladesh · City Municipal Services')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
            NAGORIK SATHI · {t('নাগরিক সাথী প্ল্যাটফর্ম', 'CIVIC OPERATIONS PLATFORM')}
          </h1>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {getRoleTitle()}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[var(--muted)] pt-1">
            <span>{t('প্রতিবেদন নং:', 'Report Ref:')} <strong className="text-[var(--ink)]">{reportRef}</strong></span>
            <span>•</span>
            <span>{t('তারিখ ও সময়:', 'Generated:')} <strong>{now.toLocaleString(language === 'en' ? 'en-US' : 'bn-BD')}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">{t('সিস্টেম-তৈরি প্রতিবেদন', 'System-generated report')}</span>
          </div>
        </div>

        {/* Official User Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg)] p-4 rounded-xl border border-[var(--line)] text-xs report-meta-grid">
          <div>
            <span className="text-[10px] text-[var(--muted)] block uppercase">{t('ইউজারের নাম:', 'Officer / User:')}</span>
            <strong className="text-[var(--ink)] text-sm">{currentUser?.name || t('নাগরিক ইউজার', 'Citizen')}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[var(--muted)] block uppercase">{t('ভূমিকা / পদবি:', 'Role / Designation:')}</span>
            <strong className="text-[var(--ink)]">{currentUser?.designation || getRoleLabel()}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[var(--muted)] block uppercase">{t('ওয়ার্ড / দপ্তর:', 'Ward / Dept:')}</span>
            <strong className="text-[var(--ink)]">{currentUser?.wardName || currentUser?.departmentName || t('ঢাকা সিটি কর্পোরেশন', 'Dhaka City Corporation')}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[var(--muted)] block uppercase">{t('প্রতিবেদনের পরিধি:', 'Report Scope:')}</span>
            <strong className="text-[var(--ink)]">{t('প্রাসঙ্গিক কেস রেকর্ড', 'Role-relevant case records')}</strong>
          </div>
        </div>

        {/* Operational Executive KPIs */}
        <div className="grid grid-cols-3 gap-3 text-center report-kpi-grid">
          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--paper)]">
            <span className="text-[11px] text-[var(--muted)] block font-semibold">{t('মোট সংশ্লিষ্ট রেকর্ড', 'Total Relevant Cases')}</span>
            <span className="text-2xl font-black font-mono text-[var(--ink)]">{formatNum(relevantCases.length)}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--paper)]">
            <span className="text-[11px] text-[var(--muted)] block font-semibold">{t('চলমান ও পর্যালোচনাধীন', 'In-Progress / Review')}</span>
            <span className="text-2xl font-black font-mono text-amber-500">
              {formatNum(relevantCases.filter(c => c.status !== 'closed').length)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--paper)]">
            <span className="text-[11px] text-[var(--muted)] block font-semibold">{t('যাচাইকৃত সমাধান', 'Resolved & Verified')}</span>
            <span className="text-2xl font-black font-mono text-emerald-500">
              {formatNum(relevantCases.filter(c => c.status === 'closed' || c.status === 'resolved_pending_citizen').length)}
            </span>
          </div>
        </div>

        {/* Main Table of Current Cases / Records */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            {t('বিস্তারিত কার্যবিবরণী ও কেস ট্র্যাকিং তালিকা', 'Detailed Operational Ledger & Case Timeline')}
          </h4>
          <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--line)] text-[var(--muted)] font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">{t('# কেস আইডি', '# Case ID')}</th>
                  <th className="py-2.5 px-3">{t('সমস্যার শিরোনাম', 'Problem Title')}</th>
                  <th className="py-2.5 px-3">{t('স্থান ও ওয়ার্ড', 'Location & Ward')}</th>
                  <th className="py-2.5 px-3">{t('অগ্রাধিকার', 'Priority')}</th>
                  <th className="py-2.5 px-3">{t('বর্তমান অবস্থা', 'Status')}</th>
                  <th className="py-2.5 px-3">{t('দাখিলের তারিখ', 'Date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {relevantCases.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="hover:bg-[var(--bg)] transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--ink)]">{item.id}</td>
                    <td className="py-2.5 px-3 font-medium text-[var(--ink)] max-w-xs truncate">{item.title}</td>
                    <td className="py-2.5 px-3 text-[var(--muted)]">{item.location.wardName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'emergency' ? 'bg-red-500/20 text-red-500' :
                        item.priority === 'high' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.status.replace(/_/g, ' ').toUpperCase()}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--muted)] text-[11px]">
                      {language === 'en' ? new Date(item.submittedAt).toLocaleDateString('en-US') : formatBanglaDate(item.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-start justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[var(--muted)] uppercase block">{t('প্রতিবেদন প্রস্তুতকারী', 'Prepared by')}</span>
            <strong className="text-[var(--ink)]">{currentUser?.name || t('নাগরিক ইউজার', 'Citizen')}</strong>
          </div>
          <p className="max-w-xl text-[10px] leading-relaxed text-[var(--muted)] sm:text-right">
            {t(
              'এটি সিস্টেম-তৈরি সারসংক্ষেপ। দাপ্তরিক ব্যবহারের আগে মূল কেস রেকর্ড যাচাই করুন।',
              'This is a system-generated summary. Verify the source case records before official use.'
            )}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
