import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Case } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatBanglaDate, toBanglaNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import { FileText, Printer, X } from 'lucide-react';

interface CaseReportPackageModalProps {
  caseData: Case;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseReportPackageModal: React.FC<CaseReportPackageModalProps> = ({
  caseData,
  isOpen,
  onClose
}) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('report-print-mode');
    return () => document.body.classList.remove('report-print-mode');
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 report-modal-backdrop">
      <div className="bg-[var(--paper)] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--line)] text-[var(--ink)] p-6 sm:p-8 space-y-6 report-printable-area report-print-case">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--gold)] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)]">
                {t('অফিসিয়াল কেস রিপোর্ট প্যাকেজ (M7 Case Report Package)', 'Official Case Report Package')}
              </h3>
              <span className="text-[10px] text-[var(--muted)]">
                {t('বিভাগীয় কার্যসম্পাদন ও অডিট নথির জন্য প্রস্তুতকৃত', 'Prepared for departmental operations and audit records')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg)] hover:bg-[var(--paper-elevated)] text-xs font-semibold text-[var(--gold)] border border-[var(--line)] transition cursor-pointer print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('প্রিন্ট / PDF', 'Print / Save PDF')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Header Template */}
        <div className="text-center space-y-1 pb-4 border-b border-[var(--line)]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--gold)]">
            {t('সিটি কর্পোরেশন পৌর সেবা ও সমন্বয় উইং', 'City Corporation Municipal Services & Coordination Wing')}
          </span>
          <h2 className="text-lg font-light text-[var(--ink)] report-case-title">
            {t('নাগরিক সমস্যা ও', 'Civic Issue &')} <strong className="font-semibold text-[var(--gold)]">{t('বহু-বিভাগীয় কার্য-আদেশ নথি', 'Multi-Department Work Order Record')}</strong>
          </h2>
          <p className="text-xs text-[var(--muted)] font-mono">
            {t('ট্র্যাকিং নম্বর:', 'Case ID:')} <strong className="text-[var(--gold)] font-bold">{caseData.id}</strong> • {t('ওপেন৩১১ জিও-রিপোর্ট ভি২', 'Open311 Geospatial Report v2')}
          </p>
        </div>

        {/* Case Meta & Priority */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg)] p-4 rounded-2xl border border-[var(--line)] text-xs report-meta-grid">
          <div>
            <span className="text-[10px] text-[var(--muted)] block">{t('দাখিলের তারিখ:', 'Submitted:')}</span>
            <strong className="text-[var(--ink)]">{language === 'en' ? new Date(caseData.submittedAt).toLocaleDateString('en-US') : formatBanglaDate(caseData.submittedAt)}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[var(--muted)] block">{t('বর্তমান অগ্রাধিকার:', 'Priority:')}</span>
            <PriorityBadge priority={caseData.priority} />
          </div>
          <div>
            <span className="text-[10px] text-[var(--muted)] block">{t('বর্তমান স্থিতি:', 'Status:')}</span>
            <StatusBadge status={caseData.status} />
          </div>
          <div>
            <span className="text-[10px] text-[var(--muted)] block">{t('ওয়ার্ড এলাকা:', 'Ward:')}</span>
            <strong className="text-[var(--green)]">{caseData.location.wardName}</strong>
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-1.5 text-xs print-keep-together">
          <h4 className="font-semibold text-[var(--gold)] uppercase text-[11px]">{t('১. নাগরিক সমস্যা ও বিবরণ:', '1. Issue Description')}</h4>
          <div className="bg-[var(--bg)] p-4 rounded-2xl border border-[var(--line)] space-y-1">
            <h5 className="font-semibold text-sm text-[var(--ink)]">{caseData.title}</h5>
            <p className="text-xs text-[var(--muted)] leading-relaxed">{caseData.description}</p>
          </div>
        </div>

        {/* Multi-Department Dispatch Tasks */}
        <div className="space-y-2 text-xs print-keep-together">
          <h4 className="font-semibold text-[var(--gold)] uppercase text-[11px]">{t('২. বিভাগীয় কার্যসম্পাদন ক্রম ও অবস্থা:', '2. Department Work Sequence & Status')}</h4>
          <div className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden">
            {caseData.tasks.map((task) => (
              <div key={task.id} className="p-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[10px] bg-[var(--paper)] text-[var(--gold)] px-2 py-0.5 rounded border border-[var(--line)]">
                      {t('ধাপ', 'Step')} #{language === 'en' ? task.sequenceOrder : toBanglaNumber(task.sequenceOrder)}
                    </span>
                    <strong className="text-[var(--ink)]">{task.departmentName}</strong>
                  </div>
                  <p className="text-[11px] text-[var(--muted)]">{task.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
