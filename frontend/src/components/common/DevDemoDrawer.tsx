import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CaseContext';
import { DEMO_ROLES } from '../../constants';
import { UserRole } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Code, X, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DevDemoDrawer: React.FC = () => {
  const { isDevDemoDrawerOpen, setDevDemoDrawerOpen, activeRole, loginAsRole } = useAuth();
  const { resetDemoData } = useCases();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!import.meta.env.DEV || !isDevDemoDrawerOpen) return null;

  const roleCopy: Record<UserRole, { title: string; subtitle: string }> = {
    citizen: {
      title: t('নাগরিক (Citizen)', 'Citizen'),
      subtitle: t('সমস্যা জানানো, ট্র্যাকিং ও মতামত প্রদান', 'Submit, track, and provide feedback on civic issues')
    },
    ward_desk: {
      title: t('ওয়ার্ড ডেস্ক (Ward Desk Staff)', 'Ward Desk Staff'),
      subtitle: t('রিপোর্ট ট্রায়াজ ও এআই দায়িত্ব যাচাই', 'Triage reports and verify AI-assigned responsibility')
    },
    field_officer: {
      title: t('মাঠ পর্যায়ের কর্মকর্তা (Field Staff)', 'Field Officer'),
      subtitle: t('পরিদর্শন ও সমাধান প্রমাণ আপলোড', 'Inspect issues and upload resolution evidence')
    },
    coordinator: {
      title: t('সমন্বয়ক (Case Coordinator)', 'Case Coordinator'),
      subtitle: t('বহু-বিভাগীয় অনুক্রম ও এসএলএ তদারকি', 'Oversee multi-department workflows and SLAs')
    },
    admin: {
      title: t('সিস্টেম অ্যাডমিন (System Administrator)', 'System Administrator'),
      subtitle: t('টেকনিক্যাল প্ল্যাটফর্ম, আইএএম ও অডিট ইন্টিগ্রিটি', 'Manage platform operations, access control, and audit integrity')
    },
    governance_head: {
      title: t('সিটি গভর্নেন্স প্রধান (City Governance Head)', 'City Governance Head'),
      subtitle: t('পৌর নীতিমালা, দ্বৈত অনুমোদন ও সেবা প্রশাসন', 'Oversee municipal policy, dual approvals, and service administration')
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    loginAsRole(role);
    setDevDemoDrawerOpen(false);

    if (role === 'citizen') navigate('/');
    else if (role === 'ward_desk') navigate('/ward');
    else if (role === 'field_officer') navigate('/officer');
    else if (role === 'coordinator') navigate('/coordinator');
    else if (role === 'governance_head') navigate('/governance');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[var(--paper)] text-[var(--ink)] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-[var(--line)]">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center">
                <Code className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">Developer Demo Mode</h3>
                <span className="text-[11px] text-[var(--muted)]">{t('অভ্যন্তরীণ রোল ও টেস্ট সুইচার', 'Internal role and test switcher')}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDevDemoDrawerOpen(false)}
              className="p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-elevated)] transition cursor-pointer"
              aria-label={t('ড্রয়ার বন্ধ করুন', 'Close drawer')}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="p-3 bg-[var(--paper-elevated)] border border-[var(--line)] rounded-lg my-4 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-[var(--ink)]">
              <ShieldAlert className="w-3.5 h-3.5 text-[var(--status-high)]" aria-hidden="true" />
              <span>{t('ডেভেলপমেন্ট টেস্ট নোটিশ', 'Development testing notice')}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {t(
                'এই সুইচারটি লোকাল ডেমো ও আরএন্ডডি টেস্টিংয়ের জন্য। সাধারণ নাগরিক ও দাপ্তরিক ব্যবহারকারীরা লগইন ফ্লো ব্যবহার করবেন।',
                'This switcher is for local demos and research testing. Citizens and staff should use the sign-in flow.'
              )}
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <span className="text-xs font-semibold text-[var(--muted)] block mb-1">
              {t('সরাসরি রোল টেস্টে প্রবেশ করুন:', 'Select a role to test:')}
            </span>
            {DEMO_ROLES.map(r => {
              const isActive = activeRole === r.role;
              const copy = roleCopy[r.role];
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRoleSelect(r.role)}
                  className={`w-full flex items-start justify-between p-3 rounded-lg border text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-[var(--paper-elevated)] border-[var(--ink)] text-[var(--ink)] shadow-xs'
                      : 'bg-[var(--paper)] border-[var(--line)] text-[var(--muted)] hover:bg-[var(--paper-elevated)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div>
                    <strong className="text-xs font-bold block text-[var(--ink)]">{copy.title}</strong>
                    <span className="text-[11px] text-[var(--muted)] mt-0.5 block">{copy.subtitle}</span>
                  </div>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-[var(--ink)] shrink-0 mt-0.5" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => resetDemoData()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--paper-elevated)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition cursor-pointer text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t('ডেমো ডেটা রিসেট', 'Reset demo data')}</span>
          </button>

          <button
            type="button"
            onClick={() => setDevDemoDrawerOpen(false)}
            className="civic-btn-secondary text-xs py-1.5 px-3"
          >
            {t('বন্ধ করুন', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
