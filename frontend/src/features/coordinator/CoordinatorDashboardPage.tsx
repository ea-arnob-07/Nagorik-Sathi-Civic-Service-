import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCases } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { formatBanglaDate, toBanglaNumber } from '../../utils/formatters';
import apiClient from '../../services/apiClient';
import {
  Layers,
  GitMerge,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
  MapPin,
  Sparkles,
  Flame,
  FileCheck,
  RotateCcw,
  UserX,
  Share2,
  ExternalLink,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const CoordinatorDashboardPage: React.FC = () => {
  const { cases } = useCases();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [serverStats, setServerStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      const data = await apiClient.coordinator.getStats();
      if (data) {
        setServerStats(data);
      }
      setLoadingStats(false);
    };
    fetchStats();
  }, []);

  // Compute metrics from context as real-time fallback
  const multiDeptCases = cases.filter(c => c.tasks && c.tasks.length > 1);
  const stalledCases = cases.filter(c => c.tasks && c.tasks.some(t => t.waitingReason));
  const pendingClosureCases = cases.filter(c => c.status === 'resolved_pending_citizen');
  const reopenedCases = cases.filter(c => c.status === 'reopened');
  const emergencyCases = cases.filter(c => c.priority === 'emergency' || c.priority === 'high');
  const awaitingApprovalCases = cases.filter(c => c.status === 'submitted' || c.status === 'verified');
  const objectionCases = cases.filter(c => c.objection || c.status === 'reopened');

  // Stats merging server + local
  const stats = {
    awaiting_approval: serverStats?.awaiting_approval ?? awaitingApprovalCases.length,
    emergency_incidents: serverStats?.emergency_incidents ?? emergencyCases.length,
    overdue_tasks: serverStats?.overdue_tasks ?? 2,
    department_rejections: serverStats?.department_rejections ?? 1,
    pending_evidence_reviews: serverStats?.pending_evidence_reviews ?? pendingClosureCases.length,
    citizen_objections: serverStats?.citizen_objections ?? objectionCases.length,
    stalled_cases: serverStats?.stalled_cases ?? stalledCases.length,
    multi_dept_cases: serverStats?.multi_dept_cases ?? multiDeptCases.length,
    reopened_cases: serverStats?.reopened_cases ?? reopenedCases.length,
    total_active_cases: serverStats?.total_active_cases ?? cases.filter(c => c.status !== 'closed').length
  };

  const formatNum = (num: number) => (language === 'en' ? num.toString() : toBanglaNumber(num));

  const kpiCards = [
    {
      title: t('প্ল্যান ও সিকোয়েন্স অনুমোদন', 'Plan & Sequence Approval'),
      count: stats.awaiting_approval,
      desc: t('অনুমোদনহীন বহু-বিভাগীয় কেস', 'Unapproved Multi-Dept Cases'),
      link: '/coordinator/sequence-planner',
      icon: <GitMerge className="w-5 h-5 text-[var(--gold)]" />,
      colorClass: 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30'
    },
    {
      title: t('জরুরি ও উচ্চ অগ্রাধিকার', 'Emergency & High Priority'),
      count: stats.emergency_incidents,
      desc: t('জরুরি নিরাপত্তা ও বিপদ সংকেত', 'Urgent Safety & Hazard Alerts'),
      link: '/coordinator/cases?priority=critical',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      colorClass: 'bg-red-50 dark:bg-red-950/30 text-red-600 border-red-200 dark:border-red-900/40'
    },
    {
      title: t('এসএলএ মেয়াদোত্তীর্ণ / ঝুঁকিপূর্ণ', 'SLA Overdue / At Risk'),
      count: stats.overdue_tasks,
      desc: t('এসএলএ টার্গেট অতিক্রম করেছে', 'Exceeded SLA Target Limits'),
      link: '/coordinator/escalations',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      colorClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-200 dark:border-amber-900/40'
    },
    {
      title: t('দাপ্তরিক প্রত্যাখ্যান ও রিভিউ', 'Dept Rejections & Reviews'),
      count: stats.department_rejections,
      desc: t('দপ্তর থেকে কারণসহ ফেরত কেস', 'Cases Returned with Department Reasons'),
      link: '/coordinator/handovers?tab=rejected',
      icon: <UserX className="w-5 h-5 text-purple-600" />,
      colorClass: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 border-purple-200 dark:border-purple-900/40'
    },
    {
      title: t('প্রমাণক পর্যালোচনা অপেক্ষমাণ', 'Pending Evidence Reviews'),
      count: stats.pending_evidence_reviews,
      desc: t('সম্পন্ন কাজের প্রমাণ যাচাই প্রয়োজন', 'Resolution Proof Pending Verification'),
      link: '/coordinator/evidence-review',
      icon: <FileCheck className="w-5 h-5 text-[var(--green)]" />,
      colorClass: 'bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/30'
    },
    {
      title: t('নাগরিক আপত্তি (Objections)', 'Citizen Objections'),
      count: stats.citizen_objections,
      desc: t('সমাধানে অসন্তোষ বা ত্রুটির অভিযোগ', 'Disputed Resolutions or Quality Issues'),
      link: '/coordinator/objections',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      colorClass: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 border-rose-200 dark:border-rose-900/40'
    },
    {
      title: t('পুনরায় তদন্তাধীন (Reopened)', 'Reopened Cases'),
      count: stats.reopened_cases,
      desc: t('আপত্তির পর কাজ পুনরায় সক্রিয়', 'Reactivated Following Objection'),
      link: '/coordinator/reopened-cases',
      icon: <RotateCcw className="w-5 h-5 text-indigo-600" />,
      colorClass: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border-indigo-200 dark:border-indigo-900/40'
    },
    {
      title: t('চূড়ান্ত সমাপ্তি রিভিউ (Closure)', 'Final Closure Reviews'),
      count: stats.pending_evidence_reviews,
      desc: t('প্রমাণিত সন্তোষজনক সমাপ্তির রায়', 'Verified Satisfactory Resolutions'),
      link: '/coordinator/closure-review',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      colorClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-900/40'
    },
    {
      title: t('পূর্বশর্তে স্থবির (Stalled)', 'Prerequisite Stalled'),
      count: stats.stalled_cases,
      desc: t('পূর্ববর্তী কাজের সমাপ্তির অপেক্ষায়', 'Waiting on Prerequisite Stage'),
      link: '/coordinator/multi-dept?filter=stalled',
      icon: <Sliders className="w-5 h-5 text-orange-600" />,
      colorClass: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 border-orange-200 dark:border-orange-900/40'
    },
    {
      title: t('সক্রিয় সমন্বিত কেস', 'Active Coordinated Cases'),
      count: stats.multi_dept_cases,
      desc: t('একাধিক বিভাগের যৌথ কার্যক্রম', 'Joint Inter-Department Operations'),
      link: '/coordinator/multi-dept',
      icon: <Layers className="w-5 h-5 text-[var(--ink)]" />,
      colorClass: 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
    }
  ];

  return (
    <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] bg-[var(--paper-elevated)] px-3.5 py-1 rounded-full border border-[var(--line)]">
              {t('সেন্ট্রাল কেস কোঅর্ডিনেশন কমান্ড', 'Central Case Coordination Command')}
            </span>
            <span className="text-xs text-[var(--muted)]">
              {t('আন্তঃবিভাগীয় কাজের প্রবাহ ও ডিপেন্ডেন্সি নিয়ন্ত্রণ', 'Inter-Departmental Workflow & Dependency Control')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            {t('বহু-বিভাগীয় কেস সমন্বয়ক ড্যাশবোর্ড', 'Multi-Department Case Coordinator Dashboard')}{' '}
            <span className="font-light text-[var(--muted)]">({t('কমান্ড কন্ট্রোল', 'Command Console')})</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/coordinator/sequence-planner"
            className="civic-btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <GitMerge className="w-4 h-4" />
            <span>{t('সিকোয়েন্স প্ল্যানার', 'Sequence Planner')}</span>
          </Link>
          <Link
            to="/coordinator/closure-review"
            className="civic-btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('সমাপ্তি রিভিউ', 'Closure Review')}</span>
          </Link>
          <Link
            to="/coordinator/cases"
            className="civic-btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>{t('ইউনিফাইড বোর্ড', 'Unified Board')}</span>
          </Link>
          <Link
            to="/coordinator/hotspots"
            className="civic-btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4" />
            <span>{t('হটস্পট অ্যানালিটিক্স', 'Hotspot Analytics')}</span>
          </Link>
        </div>
      </div>

      {/* 10 Actionable KPI Cards linking to filtered views */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
            {t('অপারেশনাল ইন্ডিকেটর ও ফিল্টার কিউ', 'Operational Indicators & Filter Queues')} ({formatNum(10)} {t('টি কোর কিউ', 'Core Queues')})
          </h2>
          <span className="text-xs text-[var(--muted)]">
            {t('যেকোনো কার্ডে ক্লিক করে সরাসরি সংশ্লিষ্ট কিউতে প্রবেশ করুন', 'Click any metric card to directly inspect its queue')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {kpiCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="p-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-sm cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                  {card.icon}
                </span>
                <span className="text-2xl font-black font-mono text-[var(--ink)]">
                  {loadingStats ? '...' : formatNum(card.count)}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--ink)] truncate">{card.title}</h3>
                <p className="text-[10px] text-[var(--muted)] truncate mt-0.5">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Multi-Department Cases Table with Direct Actions */}
      <div className="p-6 rounded-2xl civic-card shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line)]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--ink)] flex items-center gap-2.5">
              <GitMerge className="w-5 h-5 text-[var(--ink)]" />
              <span>{t('বহু-বিভাগীয় কেস ট্র্যাকিং ও ডিপেন্ডেন্সি নিয়ন্ত্রণ', 'Multi-Department Case Tracking & Dependency Management')}</span>
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              {t(
                'বর্জ্য → ড্রেনেজ → সড়ক প্রকৌশল বিভাগের ধারাবাহিক কাজের সমন্বয় নিয়ন্ত্রণ করুন',
                'Orchestrate sequence across Waste → Drainage → Roads & Engineering divisions'
              )}
            </p>
          </div>
          <Link
            to="/coordinator/cases"
            className="text-xs font-bold text-[var(--ink)] hover:underline inline-flex items-center gap-1"
          >
            <span>{t('সকল কেস দেখুন', 'View All Cases')} ({formatNum(cases.length)})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--line)] text-[var(--muted)] font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">{t('কেস ট্র্যাকিং', 'Case ID')}</th>
                <th className="py-3 px-3">{t('সমস্যার সারসংক্ষেপ', 'Summary')}</th>
                <th className="py-3 px-3">{t('ওয়ার্ড', 'Ward')}</th>
                <th className="py-3 px-3">{t('বিভাগসমূহের সিকোয়েন্স', 'Dept Sequence')}</th>
                <th className="py-3 px-3">{t('অগ্রাধিকার', 'Priority')}</th>
                <th className="py-3 px-3">{t('বর্তমান অবস্থা', 'Status')}</th>
                <th className="py-3 px-3 text-right">{t('পদক্ষেপ', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {cases.slice(0, 8).map(item => (
                <tr key={item.id} className="hover:bg-[var(--bg)] transition">
                  <td className="py-3 px-3 font-mono font-bold text-[var(--ink)]">
                    {item.trackingNumber || item.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-[var(--ink)] max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="py-3 px-3 text-[var(--muted)]">{item.location.wardName}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tasks && item.tasks.length > 0 ? (
                        item.tasks.map((taskItem, i) => (
                          <span
                            key={taskItem.id}
                            className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                              taskItem.status === 'resolved'
                                ? 'bg-[var(--status-low-bg)] text-[var(--status-low)] border-[var(--status-low-line)]'
                                : taskItem.status === 'in_progress'
                                ? 'bg-[var(--status-high-bg)] text-[var(--status-high)] border-[var(--status-high-line)]'
                                : 'bg-[var(--bg)] text-[var(--muted)] border-[var(--line)]'
                            }`}
                          >
                            {formatNum(i + 1)}. {taskItem.departmentName.split(' ')[0]}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-[var(--status-medium)] font-semibold">
                          {t('সিকোয়েন্স নির্ধারিত হয়নি', 'Sequence Unassigned')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/coordinator/cases/${item.id}`}
                      className="civic-btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1"
                    >
                      <span>{t('সমন্বয় ভিউ', 'Coordinate')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
