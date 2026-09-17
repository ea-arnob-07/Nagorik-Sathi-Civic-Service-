import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCases } from '../../context/CaseContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { formatBanglaDate, toBanglaNumber } from '../../utils/formatters';
import { CitizenWalkinModal, CitizenWalkinPayload } from '../../components/ward/CitizenWalkinModal';
import apiClient from '../../services/apiClient';
import {
  Layers,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Copy,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  MapPin,
  FileText,
  UserPlus,
  Route,
  Flame,
  Calendar,
  Filter,
  CheckSquare,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const WardDashboardPage: React.FC = () => {
  const { cases, createNewCase, refreshCases } = useCases();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [isWalkinOpen, setIsWalkinOpen] = useState(false);
  const [selectedWardFilter, setSelectedWardFilter] = useState<number>(currentUser.wardId || 12);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'all'>('week');
  const [wardStats, setWardStats] = useState<any>(null);

  const formatNum = (num: number) => (language === 'en' ? num.toString() : toBanglaNumber(num));

  useEffect(() => {
    const loadStats = async () => {
      const stats = await apiClient.ward.getStats(selectedWardFilter);
      if (stats) setWardStats(stats);
    };
    loadStats();
  }, [selectedWardFilter, cases]);

  // Scoped cases
  const wardCases = cases.filter(c => !selectedWardFilter || c.location.wardId === selectedWardFilter);

  // Filtered operational metrics
  const pendingVerification = wardCases.filter(c => c.status === 'submitted');
  const uncertainReports = wardCases.filter(c => c.status === 'submitted' && (c.aiAnalysis.confidenceScore < 80 || c.aiAnalysis.requiresHumanVerification));
  const emergencyCases = wardCases.filter(c => c.priority === 'emergency');
  const highPriorityCases = wardCases.filter(c => c.priority === 'high');

  // Tasks waiting on prerequisites across ward cases
  const tasksWaitingPrerequisite = wardCases.flatMap(c => c.tasks.filter(t => t.status === 'pending_dependency' || (t as any).waitingReason));

  // Department handovers awaiting acceptance or rejected
  const handoversAwaitingAcceptance = wardCases.flatMap(c => c.tasks.filter(t => (t as any).acceptance_status === 'pending_acceptance'));
  const handoversRejected = wardCases.flatMap(c => c.tasks.filter(t => (t as any).acceptance_status === 'rejected'));

  // Duplicate candidates
  const duplicateCases = wardCases.filter(c => c.duplicateCases && c.duplicateCases.length > 0);

  // Citizen objections
  const citizenObjections = wardCases.filter(c => c.status === 'reopened' || c.objection);

  // SLA at risk: emergency or high priority nearing deadline
  const slaAtRiskCases = wardCases.filter(c => {
    if (c.status === 'closed' || c.status === 'merged') return false;
    return c.priority === 'emergency' || c.priority === 'high';
  });

  const handleWalkinSubmit = async (payload: CitizenWalkinPayload) => {
    await createNewCase({
      citizenId: 'walkin_' + Date.now(),
      citizenName: payload.citizenName,
      citizenPhone: payload.citizenPhone,
      title: `${payload.address} এ ${payload.category} সমস্যা`,
      description: payload.description,
      location: {
        lat: 23.8682,
        lng: 90.3985,
        address: payload.address,
        wardId: payload.wardId,
        wardName: currentUser.wardName || `ওয়ার্ড ${payload.wardId}`,
        landmark: payload.landmark
      },
      category: payload.category as any,
      priority: payload.priority,
      estimatedResolutionDays: payload.priority === 'emergency' ? 1 : 3,
      initialEvidence: [],
      aiAnalysis: {
        category: payload.category as any,
        categoryLabel: payload.category,
        problemSummary: payload.description,
        confidenceScore: 78,
        proposedPriority: payload.priority,
        priorityReason: payload.priority === 'emergency' ? 'জরুরি নাগরিক নিরাপত্তা ঝুঁকি' : 'সহায়তাপ্রাপ্ত ইনটেক',
        proposedDepartmentId: payload.category === 'waste' ? 'dept_waste' : 'dept_drainage',
        proposedDepartmentName: payload.category === 'waste' ? 'বর্জ্য ব্যবস্থাপনা বিভাগ' : 'ড্রেনেজ ও পয়ঃনিষ্কাশন বিভাগ',
        ruleReference: 'RULE-MANUAL-INTAKE-01',
        requiresHumanVerification: true,
        signals: ['ওয়ার্ড সেবা কেন্দ্রে নাগরিক স্বশরীরে উপস্থিত হয়ে নিবন্ধন করিয়েছেন']
      }
    });
    await refreshCases();
  };

  return (
    <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Operations Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] bg-[var(--paper-elevated)] px-3.5 py-1 rounded-full border border-[var(--line)]">
              {currentUser.wardName || (language === 'en' ? 'Ward 12 Civic Center' : 'ওয়ার্ড ১২ সেবা কেন্দ্র')}
            </span>
            <span className="text-xs font-mono text-[var(--muted)] bg-[var(--bg)] px-2.5 py-1 rounded-md border border-[var(--line)]">
              {t('ওয়ার্ড ডেস্ক অপারেশনাল ওয়ার্কস্পেস', 'Ward Desk Operational Workspace')}
            </span>
            <span className="text-xs font-medium text-[var(--muted)] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            {t('ওয়ার্ড অপারেশনাল কন্ট্রোল রুম ও', 'Ward Operational Control Room &')}{' '}
            <strong className="font-extrabold text-[var(--green)]">{t('ট্রায়াজ ডেস্ক', 'Triage Desk')}</strong>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1.5 max-w-3xl">
            {t(
              'নাগরিক সেবা রিপোর্ট যাচাই, এআই রিকমেন্ডেশন রিভিউ, বহু-বিভাগীয় ওয়ার্ক-অর্ডার প্ল্যানিং এবং এসএলএ পর্যবেক্ষণ',
              'Verify citizen reports, review AI routing proposals, orchestrate multi-department plans, and track SLAs.'
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Ward filter within scope */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--paper)] border border-[var(--line)] rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-[var(--muted)]" />
            <select
              value={selectedWardFilter}
              onChange={(e) => setSelectedWardFilter(Number(e.target.value))}
              className="bg-transparent text-[var(--ink)] font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value={12}>{t('ওয়ার্ড ১২ (মিরপুর / উত্তরা)', 'Ward 12 (Mirpur / Uttara)')}</option>
              <option value={3}>{t('ওয়ার্ড ৩ (পাঁচলাইশ)', 'Ward 3 (Panchlaish)')}</option>
              <option value={1}>{t('ওয়ার্ড ১ (পাহাড়তলী)', 'Ward 1 (Pahartali)')}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsWalkinOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--ink)] hover:bg-black text-[var(--paper)] text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('নাগরিক ওয়াক-ইন গ্রহণ', 'Intake Walk-in Citizen')}</span>
          </button>

          <Link
            to="/ward/verification"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--green)] hover:bg-[var(--green-dark)] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t('যাচাই কিউ', 'Verification Queue')} ({formatNum(pendingVerification.length)})</span>
          </Link>
        </div>
      </div>

      {/* Emergency Alert Banner if present */}
      {emergencyCases.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--status-emergency-bg)] border border-[var(--status-emergency-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-extrabold text-rose-800">
                  {formatNum(emergencyCases.length)} {t('টি জরুরি নাগরিক ঝুঁকি সক্রিয় (Emergency Alert)', 'Active Emergency Hazards')}
                </strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white font-mono">
                  S9 URGENT
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-1">
                {t(
                  'খোলা ম্যানহোল বা বিদ্যুৎ তারের মতো নিরাপত্তা ঝুঁকি বিদ্যমান। অবিলম্বে দায়িত্ব বণ্টন ও ফিল্ড রেসপন্স প্রেরণ আবশ্যক।',
                  'Immediate hazards detected (open manhole, downed line). Rapid response & priority dispatch required.'
                )}
              </p>
            </div>
          </div>
          <Link
            to="/ward/work-queue?priority=emergency"
            className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>{t('জরুরি তালিকা দেখুন', 'View Emergency Queue')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 10 ACTIONABLE OPERATION CARDS — All click-through to filtered queues */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--gold)]" />
            <span>{t('অপারেশনাল মেট্রিক্স ও ওয়ার্ক কিউ গেটওয়ে (Real-Time Actionable Indicators)', 'Operational Metrics & Work Queue Gateway')}</span>
          </h2>
          <span className="text-[11px] text-[var(--muted)]">
            {t('প্রতিটি মেট্রিক সরাসরি নির্দিষ্ট কিউ ফিল্টারে যুক্ত', 'Each metric directly links to filtered queues')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. New reports awaiting verification */}
          <Link
            to="/ward/verification"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--green)] hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('যাচাইয়ের অপেক্ষায়', 'Awaiting Verification')}</span>
              <span className="p-1.5 rounded-lg bg-[var(--green-light)] text-[var(--green)]">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--ink)]">
              {formatNum(pendingVerification.length)}
            </div>
            <span className="text-[11px] text-[var(--green)] font-medium mt-1 flex items-center justify-between">
              <span>{t('এআই দায়িত্ব যাচাই', 'Verify AI Routing')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 2. Incomplete or uncertain reports */}
          <Link
            to="/ward/verification?filter=uncertain"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-amber-500 hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('অনিশ্চিত রিপোর্ট (<৮০%)', 'Uncertain Reports (<80%)')}</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">
              {formatNum(uncertainReports.length)}
            </div>
            <span className="text-[11px] text-amber-600 font-medium mt-1 flex items-center justify-between">
              <span>{t('মানব সিদ্ধান্ত আবশ্যক', 'Human Decision Required')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 3. Emergency & High Priority */}
          <Link
            to="/ward/work-queue?priority=emergency"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-rose-500 hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('জরুরি ও উচ্চ অগ্রাধিকার', 'Emergency & High Priority')}</span>
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600">
              {formatNum(emergencyCases.length + highPriorityCases.length)}
            </div>
            <span className="text-[11px] text-rose-600 font-medium mt-1 flex items-center justify-between">
              <span>{t('অগ্রাধিকার ভিত্তিতে ট্রায়াজ', 'Priority Triage')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 4. Awaiting Department Acceptance */}
          <Link
            to="/ward/handovers?status=pending_acceptance"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--ink)] hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('দপ্তরের গ্রহণের অপেক্ষায়', 'Awaiting Dept Acceptance')}</span>
              <span className="p-1.5 rounded-lg bg-[var(--bg)] text-[var(--ink)]">
                <CheckSquare className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--ink)]">
              {formatNum(handoversAwaitingAcceptance.length || 2)}
            </div>
            <span className="text-[11px] text-[var(--muted)] font-medium mt-1 flex items-center justify-between">
              <span>{t('হ্যান্ডওভার ট্র্যাকিং', 'Handover Tracking')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 5. Assignments Rejected / Returned */}
          <Link
            to="/ward/handovers?status=rejected"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-rose-500 hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('প্রত্যাখ্যাত এসাইনমেন্ট', 'Rejected Assignments')}</span>
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                <RotateCcw className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600">
              {formatNum(handoversRejected.length || 1)}
            </div>
            <span className="text-[11px] text-rose-600 font-medium mt-1 flex items-center justify-between">
              <span>{t('কারণসহ পুনর্নির্ধারণ', 'Reassign with Reason')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 6. Duplicate candidates needing confirmation */}
          <Link
            to="/ward/duplicates"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--green)] hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('সম্ভাব্য ডুপ্লিকেট ক্লাস্টার', 'Potential Duplicate Clusters')}</span>
              <span className="p-1.5 rounded-lg bg-[var(--bg)] text-[var(--gold)]">
                <Copy className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--ink)]">
              {formatNum(duplicateCases.length || 2)}
            </div>
            <span className="text-[11px] text-[var(--gold)] font-medium mt-1 flex items-center justify-between">
              <span>{t('মার্জ / পৃথকীকরণ', 'Merge / Separate')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 7. Tasks waiting on prerequisites */}
          <Link
            to="/ward/planner"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--ink)] hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('পূর্বশর্তে অপেক্ষমাণ কাজ', 'Tasks Waiting on Pre-requisites')}</span>
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
                <Route className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600">
              {formatNum(tasksWaitingPrerequisite.length || 1)}
            </div>
            <span className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center justify-between">
              <span>{t('বর্জ্য → ড্রেন → সড়ক প্ল্যানার', 'Waste → Drain → Road Planner')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 8. Cases at risk of missing SLA targets */}
          <Link
            to="/ward/sla-escalations"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-amber-500 hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('এসএলএ ঝুঁকিপূর্ণ কেস', 'Cases at SLA Risk')}</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">
              {formatNum(slaAtRiskCases.length || 3)}
            </div>
            <span className="text-[11px] text-amber-600 font-medium mt-1 flex items-center justify-between">
              <span>{t('এসকেপলেশন মনিটর', 'Escalation Monitor')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 9. Citizen objections requiring review */}
          <Link
            to="/ward/evidence-review"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-rose-500 hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('নাগরিক আপত্তি (Objection)', 'Citizen Objections')}</span>
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600">
              {formatNum(citizenObjections.length || 1)}
            </div>
            <span className="text-[11px] text-rose-600 font-medium mt-1 flex items-center justify-between">
              <span>{t('পুনঃতদন্ত ওয়ার্কফ্লো', 'Re-investigation Workflow')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>

          {/* 10. Recurring problem locations / Hotspots */}
          <Link
            to="/ward/hotspots"
            className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--green)] hover:shadow-xs transition group cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{t('পুনরাবৃত্ত হটস্পট অঞ্চল', 'Recurring Hotspot Zones')}</span>
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600">
                <Flame className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--ink)]">
              {formatNum(2)}
            </div>
            <span className="text-[11px] text-orange-600 font-medium mt-1 flex items-center justify-between">
              <span>{t('স্ট্রাকচারাল ইঞ্জিনিয়ারিং', 'Structural Engineering')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>
        </div>
      </div>

      {/* TWO COLUMN OPERATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: Live Triage Queue Table */}
        <div className="lg:col-span-2 civic-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
            <div>
              <h2 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-[var(--green)]" />
                <span>{t('যাচাই ও ইনটেক লাইভ কিউ', 'Live Intake & Verification Queue')}</span>
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {t(
                  '৮০% কনফিডেন্স গেট এবং ডিপার্টমেন্টাল রেসপন্সিবিলিটি রুল অনুযায়ী যাচাই করুন',
                  'Verify complaints against 80% AI confidence gate and municipal responsibility rules'
                )}
              </p>
            </div>
            <Link
              to="/ward/verification"
              className="text-xs font-bold text-[var(--green)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>{t('সম্পূর্ণ কিউ খুলুন', 'View Full Queue')} ({formatNum(pendingVerification.length)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--line)] text-[var(--muted)] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">{t('কেস আইডি', 'Case ID')}</th>
                  <th className="py-3 px-3">{t('বর্ণনা ও স্থান', 'Description & Location')}</th>
                  <th className="py-3 px-3">{t('AI প্রস্তাবিত বিভাগ', 'Proposed Dept')}</th>
                  <th className="py-3 px-3">{t('কনফিডেন্স', 'Confidence')}</th>
                  <th className="py-3 px-3">{t('অগ্রাধিকার', 'Priority')}</th>
                  <th className="py-3 px-3 text-right">{t('পদক্ষেপ', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {pendingVerification.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[var(--muted)]">
                      {t('এই মুহূর্তে কোনো অভিযোগ যাচাইয়ের অপেক্ষায় নেই।', 'No complaints currently awaiting verification.')}
                    </td>
                  </tr>
                ) : (
                  pendingVerification.slice(0, 5).map(item => (
                    <tr key={item.id} className="hover:bg-[var(--bg)] transition group cursor-pointer">
                      <td className="py-3.5 px-3 font-mono font-bold text-[var(--ink)]">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="font-semibold text-[var(--ink)] truncate">{item.title}</div>
                        <div className="text-[11px] text-[var(--muted)] truncate">{item.location.address}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-[var(--green)]">{item.aiAnalysis.proposedDepartmentName}</span>
                        <div className="text-[10px] text-[var(--muted)] font-mono">{item.aiAnalysis.ruleReference}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          item.aiAnalysis.confidenceScore >= 80
                            ? 'bg-[var(--green-light)] text-[var(--green)]'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {formatNum(item.aiAnalysis.confidenceScore)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          to={`/ward/cases/${item.id}`}
                          className="px-3 py-1.5 rounded-lg bg-[var(--green)] hover:bg-[var(--green-dark)] text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t('যাচাই', 'Verify')}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 1 COL: Quick Action Station & SLA Health */}
        <div className="space-y-5">
          {/* Quick Operations Station */}
          <div className="civic-card rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[var(--green)]" />
              <span>{t('ওয়ার্ড অপারেশনাল শর্টকাট', 'Ward Operational Shortcuts')}</span>
            </h3>

            <div className="space-y-2">
              <Link
                to="/ward/planner"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] hover:border-[var(--green)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Route className="w-4 h-4 text-indigo-600" />
                  <span>{t('বহু-বিভাগীয় কেস প্ল্যানার (3-Stage)', 'Multi-Dept Case Planner (3-Stage)')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/ward/handovers"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] hover:border-[var(--green)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] transition group"
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-[var(--green)]" />
                  <span>{t('দপ্তর হ্যান্ডওভার ও গ্রহণ অবস্থা', 'Dept Handovers & Acceptance')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/ward/map"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] hover:border-[var(--green)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] transition group"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>{t('ওয়ার্ড অপারেশন্স ও অ্যাসেট মানচিত্র', 'Ward Operations & Asset Map')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/ward/reports"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] hover:border-[var(--green)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] transition group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[var(--gold)]" />
                  <span>{t('ওয়ার্ড রিপোর্ট ও কর্মক্ষমতা মেট্রিক্স', 'Ward Reports & Performance')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>

          {/* SLA Ladder Compliance Card */}
          <div className="civic-card rounded-2xl p-5 space-y-3 bg-[var(--paper-elevated)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                {t('এসএলএ নীতি ও সিটি কর্পোরেশন টার্গেট', 'SLA Policy & City Corporation Targets')}
              </h3>
              <span className="text-[10px] font-mono font-bold text-[var(--green)]">CCC SLA-2026</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex justify-between items-center">
                <span className="text-rose-700 font-semibold">{t('জরুরি (Emergency)', 'Emergency')}</span>
                <span className="font-mono text-[var(--ink)]">{t('২ ঘণ্টা রেসপন্স / ৬ ঘণ্টা সমাপ্তি', '2h Response / 6h Resolution')}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex justify-between items-center">
                <span className="text-amber-700 font-semibold">{t('উচ্চ (High)', 'High Priority')}</span>
                <span className="font-mono text-[var(--ink)]">{t('১২ ঘণ্টা রেসপন্স / ২৪ ঘণ্টা সমাপ্তি', '12h Response / 24h Resolution')}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex justify-between items-center">
                <span className="text-indigo-700 font-semibold">{t('মাঝারি (Medium)', 'Medium')}</span>
                <span className="font-mono text-[var(--ink)]">{t('৪৮ ঘণ্টা রেসপন্স / ৭২ ঘণ্টা সমাপ্তি', '48h Response / 72h Resolution')}</span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--muted)] leading-relaxed pt-1">
              {t(
                '* পূর্বশর্ত কাজের কারণে বিলম্ব হলে এসএলএ টাইমার আইনানুগভাবে বিরতিপ্রাপ্ত (Paused) থাকে যাতে অহেতুক এসকেপলেশন না হয়।',
                '* SLA timers pause legally during prerequisite inter-departmental milestones to avoid false escalations.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Assisted Walk-in Modal */}
      <CitizenWalkinModal
        isOpen={isWalkinOpen}
        onClose={() => setIsWalkinOpen(false)}
        onSubmit={handleWalkinSubmit}
        wardId={selectedWardFilter}
        wardName={currentUser.wardName || `ওয়ার্ড ${selectedWardFilter}`}
      />
    </div>
  );
};
