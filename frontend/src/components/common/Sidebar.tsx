import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Layers,
  Shield,
  FileText,
  MapPin,
  Users,
  Sparkles,
  Sliders,
  Settings,
  AlertTriangle,
  GitBranch,
  BookOpen,
  Inbox,
  Clock,
  UserCheck,
  BarChart2,
  ListTodo,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Share2,
  ArrowRightLeft,
  CheckSquare,
  Flame,
  UserPlus,
  ShieldAlert,
  RotateCcw,
  Activity,
  BrainCircuit,
  Building2,
  History,
  Lock,
  X
} from 'lucide-react';

interface NavGroup {
  id: string;
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activeRole, currentUser, isSidebarOpen, setSidebarOpen } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  // Collapsible sections for Ward Desk, Coordinator, and Admin
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    overview: false,
    operations: false,
    intelligence: false,
    reports: false,
    coord_overview: false,
    coord_operations: false,
    coord_resolution: false,
    coord_monitoring: false,
    coord_governance: false,
    admin_gov: false,
    admin_identity: false,
    admin_civic_data: false,
    admin_rules_ai: false,
    admin_service_knowledge: false,
    admin_sla_ops: false,
    admin_audit_sec: false,
    admin_analytics_transparency: false
  });

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  if (activeRole === 'citizen') {
    return null;
  }

  // Ward Desk Groups
  const wardGroups: NavGroup[] = [
    {
      id: 'overview',
      title: t('ওভারভিউ', 'Overview'),
      items: [
        { label: t('ওয়ার্ড ওভারভিউ', 'Ward Overview'), path: '/ward', icon: <Layers className="w-4 h-4" /> },
        { label: t('ওয়ার্ক কিউ', 'Work Queue'), path: '/ward/work-queue', icon: <ListTodo className="w-4 h-4" /> }
      ]
    },
    {
      id: 'operations',
      title: t('কেস অপারেশনস', 'Case Operations'),
      items: [
        { label: t('ইনটেক ও যাচাইকরণ', 'Intake & Verification'), path: '/ward/verification', icon: <Shield className="w-4 h-4" /> },
        { label: t('AI সুপারিশ রিভিউ (৮০%)', 'AI Review (80%)'), path: '/ward/ai-review', icon: <Sparkles className="w-4 h-4" /> },
        { label: t('বিভাগীয় রাউটিং', 'Department Routing'), path: '/ward/routing', icon: <Share2 className="w-4 h-4" /> },
        { label: t('মাল্টি-ডিপার্টমেন্ট প্ল্যানার', 'Multi-Dept Planner'), path: '/ward/planner', icon: <GitBranch className="w-4 h-4" /> },
        { label: t('ডুপ্লিকেট ম্যানেজার', 'Duplicate Manager'), path: '/ward/duplicates', icon: <FileText className="w-4 h-4" /> },
        { label: t('ডিপার্টমেন্ট হ্যান্ডওভার', 'Dept Handover'), path: '/ward/handovers', icon: <ArrowRightLeft className="w-4 h-4" /> },
        { label: t('প্রমাণপত্র রিভিউ ও আপত্তি', 'Evidence & Objections'), path: '/ward/evidence-review', icon: <CheckSquare className="w-4 h-4" /> }
      ]
    },
    {
      id: 'intelligence',
      title: t('ওয়ার্ড ইন্টেলিজেন্স', 'Ward Intelligence'),
      items: [
        { label: t('ওয়ার্ড অপারেশনস ম্যাপ', 'Operations Map'), path: '/ward/map', icon: <MapPin className="w-4 h-4" /> },
        { label: t('রিপিট হটস্পট ও সম্পদ', 'Hotspots & Assets'), path: '/ward/hotspots', icon: <Flame className="w-4 h-4" /> },
        { label: t('এসএলএ ও এস্কেলেশন', 'SLA & Escalations'), path: '/ward/sla-escalations', icon: <AlertTriangle className="w-4 h-4" /> }
      ]
    },
    {
      id: 'reports',
      title: t('রিপোর্টস ও হিস্ট্রি', 'Reports & History'),
      items: [
        { label: t('ওয়ার্ড রিপোর্টস ও ইনসাইট', 'Ward Reports'), path: '/ward/reports', icon: <BarChart2 className="w-4 h-4" /> },
        { label: t('সহায়তাপ্রাপ্ত ইনটেক অডিট', 'Assisted Intake Audit'), path: '/ward/assisted-history', icon: <UserPlus className="w-4 h-4" /> }
      ]
    }
  ];

  // Coordinator Navigation Groups (R&D Section 2)
  const coordinatorGroups: NavGroup[] = [
    {
      id: 'coord_overview',
      title: t('সারসংক্ষেপ ও বোর্ড', 'Overview & Board'),
      items: [
        { label: t('সমন্বয়ক ড্যাশবোর্ড', 'Coordinator Dashboard'), path: '/coordinator', icon: <Layers className="w-4 h-4" /> },
        { label: t('ইউনিফাইড কেস বোর্ড', 'Unified Case Board'), path: '/coordinator/cases', icon: <Inbox className="w-4 h-4" /> }
      ]
    },
    {
      id: 'coord_operations',
      title: t('কেস অপারেশন ও সমন্বয়', 'Operations & Coordination'),
      items: [
        { label: t('মাল্টি-ডিপার্টমেন্ট সমন্বয়', 'Multi-Dept Coordination'), path: '/coordinator/multi-dept', icon: <GitBranch className="w-4 h-4" /> },
        { label: t('টাস্ক সিকোয়েন্স প্ল্যানার', 'Task Sequence Planner'), path: '/coordinator/sequence-planner', icon: <ListTodo className="w-4 h-4" /> },
        { label: t('ডিপার্টমেন্ট হ্যান্ডওভার', 'Dept Handover'), path: '/coordinator/handovers', icon: <ArrowRightLeft className="w-4 h-4" /> },
        { label: t('অ্যাসাইনমেন্ট কিউ ও ওয়ার্কলোড', 'Assignment & Workload'), path: '/coordinator/workload', icon: <UserCheck className="w-4 h-4" /> },
        { label: t('ডুপ্লিকেট ইনসিডেন্ট রিভিউ', 'Duplicate Review'), path: '/coordinator/duplicates', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      id: 'coord_resolution',
      title: t('সমাধান যাচাই ও পর্যালোচনা', 'Resolution Review'),
      items: [
        { label: t('প্রমাণপত্র রিভিউ', 'Evidence Review'), path: '/coordinator/evidence-review', icon: <CheckSquare className="w-4 h-4" /> },
        { label: t('নাগরিক আপত্তি', 'Citizen Objections'), path: '/coordinator/objections', icon: <ShieldAlert className="w-4 h-4" /> },
        { label: t('পুনঃউন্মুক্ত কেস', 'Reopened Cases'), path: '/coordinator/reopened-cases', icon: <RotateCcw className="w-4 h-4" /> },
        { label: t('ক্লোজার রিভিউ', 'Closure Review'), path: '/coordinator/closure-review', icon: <ShieldCheck className="w-4 h-4" /> }
      ]
    },
    {
      id: 'coord_monitoring',
      title: t('নজরদারি ও গোয়েন্দা তথ্য', 'Monitoring & Intelligence'),
      items: [
        { label: t('এসএলএ ও এস্কেলেশন', 'SLA & Escalations'), path: '/coordinator/escalations', icon: <AlertTriangle className="w-4 h-4" /> },
        { label: t('নগর ঘটনা মানচিত্র', 'Civic Map'), path: '/coordinator/map', icon: <MapPin className="w-4 h-4" /> },
        { label: t('হটস্পট অ্যানালিটিক্স', 'Hotspot Analytics'), path: '/coordinator/hotspots', icon: <Flame className="w-4 h-4" /> }
      ]
    },
    {
      id: 'coord_governance',
      title: t('প্রতিবেদন ও সুশাসন', 'Reports & Governance'),
      items: [
        { label: t('বিভাগীয় কর্মদক্ষতা', 'Department Performance'), path: '/coordinator/department-performance', icon: <BarChart2 className="w-4 h-4" /> },
        { label: t('কেস অডিট হিস্ট্রি', 'Case Audit History'), path: '/coordinator/case-audit', icon: <FileText className="w-4 h-4" /> },
        { label: t('সেবা স্তর লক্ষ্যমাত্রা (SLA)', 'SLA Targets'), path: '/coordinator/sla-targets', icon: <Sliders className="w-4 h-4" /> }
      ]
    }
  ];

  // City Governance Head Groups (Municipal Policy & Service Governance)
  const governanceGroups: NavGroup[] = [
    {
      id: 'gov_overview',
      title: t('ওভারভিউ ও অনুমোদন', 'Governance & Approvals'),
      items: [
        { label: t('গভর্ন্যান্স ওভারভিউ', 'Governance Overview'), path: '/governance', icon: <Layers className="w-4 h-4" /> },
        { label: t('পেন্ডিং পলিসি অনুমোদন', 'Pending Approvals'), path: '/governance/approvals', icon: <ShieldAlert className="w-4 h-4" /> }
      ]
    },
    {
      id: 'gov_rules',
      title: t('পৌর নীতিমালা ও গেট', 'Municipal Policies & Gates'),
      items: [
        { label: t('দপ্তর দায়িত্ব নীতিমালা', 'Responsibility Rules'), path: '/governance/responsibility-rules', icon: <Sliders className="w-4 h-4" /> },
        { label: t('টাস্ক-সিকোয়েন্সিং রুলস', 'Task-Sequencing Rules'), path: '/governance/task-sequencing', icon: <GitBranch className="w-4 h-4" /> },
        { label: t('এআই কনফিডেন্স গেট অনুমোদন', 'AI Confidence Gate'), path: '/governance/ai-gate', icon: <Sparkles className="w-4 h-4" /> },
        { label: t('এসএলএ ও এস্কেলেশন লক্ষ্যমাত্রা', 'SLA & Escalation Policy'), path: '/governance/sla-policy', icon: <Clock className="w-4 h-4" /> }
      ]
    },
    {
      id: 'gov_performance',
      title: t('পারফরম্যান্স ও স্বচ্ছতা', 'Performance & Transparency'),
      items: [
        { label: t('সার্ভিস পারফরম্যান্স অ্যানালিটিক্স', 'Performance Analytics'), path: '/governance/service-performance', icon: <BarChart2 className="w-4 h-4" /> },
        { label: t('হটস্পট ও পুনরাবৃত্ত সমস্যা', 'Hotspot & Repeat Issues'), path: '/governance/recurring-issues', icon: <Flame className="w-4 h-4" /> },
        { label: t('পাবলিক ট্রান্সপারেন্সি নীতিমালা', 'Public Transparency Policy'), path: '/governance/transparency-policy', icon: <CheckSquare className="w-4 h-4" /> },
        { label: t('পলিসি ও অনুমোদন ইতিহাস', 'Policy History'), path: '/governance/history', icon: <History className="w-4 h-4" /> }
      ]
    }
  ];

  // System Administrator Groups (Technical Platform Operations)
  const adminGroups: NavGroup[] = [
    {
      id: 'admin_ops',
      title: t('প্ল্যাটফর্ম অপারেশনস ও হেলথ', 'Platform Ops & Health'),
      items: [
        { label: t('সিস্টেম ওভারভিউ', 'System Overview'), path: '/admin', icon: <Layers className="w-4 h-4" /> },
        { label: t('পরিচালন উইং ও মডিউল (৮টি)', 'Governance Wings (8)'), path: '/admin/wings', icon: <Building2 className="w-4 h-4" /> },
        { label: t('সিস্টেম হেলথ ড্যাশবোর্ড', 'System Health Dashboard'), path: '/admin/health', icon: <Activity className="w-4 h-4" /> },
        { label: t('ML Model Lab', 'ML Model Lab'), path: '/admin/model-lab', icon: <BrainCircuit className="w-4 h-4" /> },
        { label: t('ইনফ্রাস্ট্রাকচার ও ইন্টিগ্রেশন', 'Infrastructure & Integrations'), path: '/admin/infrastructure', icon: <Sliders className="w-4 h-4" /> },
        { label: t('কারিগরি কনফিগারেশন', 'Technical Config'), path: '/admin/technical-config', icon: <Settings className="w-4 h-4" /> },
        { label: t('পলিসি বাস্তবায়ন স্থিতি', 'Policy Implementations'), path: '/admin/policy-implementations', icon: <ShieldAlert className="w-4 h-4" /> }
      ]
    },
    {
      id: 'admin_identity',
      title: t('আইডেন্টিটি ও এক্সেস কন্ট্রোল', 'Identity & Access (IAM)'),
      items: [
        { label: t('ইউজার ম্যানেজমেন্ট', 'User Management'), path: '/admin/users', icon: <Users className="w-4 h-4" /> },
        { label: t('রোল ও RBAC ম্যাট্রিক্স', 'Roles & RBAC Matrix'), path: '/admin/roles', icon: <ShieldCheck className="w-4 h-4" /> },
        { label: t('অ্যাকাউন্ট স্ট্যাটাস ও সুরক্ষা', 'Account Security'), path: '/admin/accounts', icon: <Lock className="w-4 h-4" /> }
      ]
    },
    {
      id: 'admin_civic_data',
      title: t('নাগরিক ডেটা রেজিস্ট্রি', 'Civic Data Registry'),
      items: [
        { label: t('ডিপার্টমেন্ট ডিরেক্টরি', 'Department Directory'), path: '/admin/departments', icon: <Building2 className="w-4 h-4" /> },
        { label: t('অফিসার ডিরেক্টরি', 'Officer Directory'), path: '/admin/officers', icon: <UserCheck className="w-4 h-4" /> },
        { label: t('ওয়ার্ড ও অ্যাসেট রেজিস্ট্রি', 'Ward & Asset Registry'), path: '/admin/registry', icon: <MapPin className="w-4 h-4" /> }
      ]
    },
    {
      id: 'admin_audit_sec',
      title: t('অডিট ও সিকিউরিটি ইন্টিগ্রিটি', 'Audit & Security'),
      items: [
        { label: t('ইমিউটেবল অডিট লগ', 'Immutable Audit Log'), path: '/admin/audit', icon: <FileText className="w-4 h-4" /> },
        { label: t('সিকিউরিটি ইভেন্টস মনিটরিং', 'Security Events'), path: '/admin/security-events', icon: <ShieldAlert className="w-4 h-4" /> },
        { label: t('কনফিগারেশন চেঞ্জ হিস্ট্রি', 'Config Change History'), path: '/admin/config-history', icon: <History className="w-4 h-4" /> }
      ]
    }
  ];

  // Auto-expand group if active path is inside it
  useEffect(() => {
    const groupsToCheck =
      activeRole === 'ward_desk'
        ? wardGroups
        : activeRole === 'coordinator'
        ? coordinatorGroups
        : activeRole === 'admin'
        ? adminGroups
        : activeRole === 'governance_head'
        ? governanceGroups
        : [];
    groupsToCheck.forEach(group => {
      if (group.items.some(it => location.pathname === it.path)) {
        setCollapsedGroups(prev => ({ ...prev, [group.id]: false }));
      }
    });
  }, [location.pathname, activeRole]);

  const officerItems = [
    { label: t('আমার নির্ধারিত কাজ', 'My Assigned Tasks'), path: '/officer', icon: <Layers className="w-4 h-4" /> },
    { label: t('দাপ্তরিক অনুরোধ গ্রহণ/প্রত্যাখ্যান', 'Inbox & Requests'), path: '/officer/requests', icon: <Inbox className="w-4 h-4" /> },
    { label: t('অ্যাসাইনমেন্ট কিউ ও রিকমেন্ডার', 'Assignment Recommender'), path: '/officer/assignment-queue', icon: <ListTodo className="w-4 h-4" /> },
    { label: t('উপস্থিতি ও ক্যাপাসিটি', 'Availability & Capacity'), path: '/officer/availability', icon: <UserCheck className="w-4 h-4" /> },
    { label: t('বিভাগীয় ওয়ার্কলোড', 'Department Workload'), path: '/officer/workload', icon: <BarChart2 className="w-4 h-4" /> },
    { label: t('ঘটনাস্থল মানচিত্র', 'Incident Map'), path: '/map', icon: <MapPin className="w-4 h-4" /> }
  ];

  const activeGroupedNav =
    activeRole === 'ward_desk'
      ? wardGroups
      : activeRole === 'coordinator'
      ? coordinatorGroups
      : activeRole === 'governance_head'
      ? governanceGroups
      : activeRole === 'admin'
      ? adminGroups
      : null;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[var(--paper)] text-[var(--muted)] border-r border-[var(--line)] shadow-2xl flex flex-col md:sticky md:top-[57px] md:z-20 md:shadow-none md:h-[calc(100vh-57px)] shrink-0 select-none overflow-hidden transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isSidebarOpen && 'hidden md:flex'}
      `}>
        {/* Workspace Header Strip */}
        <div className="p-3 border-b border-[var(--line)] bg-[var(--paper-elevated)] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--ink)]">
                {activeRole === 'ward_desk' && t('ওয়ার্ড ডেস্ক কমান্ড', 'Ward Desk Command')}
                {activeRole === 'field_officer' && t('দপ্তর কর্মকর্তা ওয়ার্কস্পেস', 'Field Officer Workspace')}
                {activeRole === 'coordinator' && t('সেন্ট্রাল কেস কোঅর্ডিনেশন', 'Central Coordination')}
                {activeRole === 'governance_head' && t('সিটি গভর্নেন্স ও পলিসি', 'City Governance & Policy')}
                {activeRole === 'admin' && t('সিস্টেম অ্যাডমিন প্ল্যাটফর্ম', 'System Admin Platform')}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" aria-hidden="true" />
            </div>
            <p className="text-[10px] text-[var(--muted)] font-medium">
              {t('অপারেশনাল কন্ট্রোল মেন্যু', 'Operational Control Menu')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)] md:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav List */}
        <nav className="p-2 space-y-2 flex-1 overflow-y-auto min-h-0" aria-label="Sidebar Navigation">
          {activeGroupedNav ? (
            activeGroupedNav.map(group => {
              const isCollapsed = !!collapsedGroups[group.id];
              return (
                <div key={group.id} className="space-y-0.5">
                  {/* Collapsible Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <span>{group.title}</span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 opacity-60" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-3 h-3 opacity-60" aria-hidden="true" />
                    )}
                  </button>

                  {/* Items in group */}
                  {!isCollapsed && (
                    <div className="space-y-0.5 pl-0.5">
                      {group.items.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer group ${
                              isActive
                                ? 'bg-[var(--paper-elevated)] text-[var(--ink)] border border-[var(--line)] font-bold shadow-xs'
                                : 'text-[var(--muted)] hover:bg-[var(--paper-elevated)] hover:text-[var(--ink)]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`p-1 rounded-sm border transition ${
                                isActive
                                  ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                                  : 'bg-[var(--paper)] text-[var(--muted)] border-[var(--line)] group-hover:text-[var(--ink)] group-hover:border-[var(--ink)]'
                              }`}>
                                {item.icon}
                              </span>
                              <span className="truncate">{item.label}</span>
                            </div>
                            <ChevronRight className={`w-3 h-3 transition-transform ${
                              isActive ? 'text-[var(--ink)] translate-x-0.5' : 'text-transparent group-hover:text-[var(--muted)]'
                            }`} aria-hidden="true" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            officerItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition cursor-pointer group ${
                    isActive
                      ? 'bg-[var(--paper-elevated)] text-[var(--ink)] border border-[var(--line)] shadow-xs font-bold'
                      : 'text-[var(--muted)] hover:bg-[var(--paper-elevated)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`p-1 rounded-sm border transition ${
                      isActive
                        ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                        : 'bg-[var(--paper)] text-[var(--muted)] border-[var(--line)] group-hover:text-[var(--ink)]'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 transition-transform ${
                    isActive ? 'text-[var(--ink)] translate-x-0.5' : 'text-transparent group-hover:text-[var(--muted)]'
                  }`} aria-hidden="true" />
                </Link>
              );
            })
          )}
        </nav>

        {/* Official Identity & Audit Stamp Card */}
        <div className="p-2.5 m-2 bg-[var(--paper-elevated)] rounded-lg border border-[var(--line)] shrink-0 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
              {currentUser?.name ? currentUser.name.slice(0, 1) : 'ন'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-[var(--ink)] truncate">{currentUser?.name || t('অফিসিয়াল ইউজার', 'Official User')}</h4>
              <p className="text-[10px] text-[var(--muted)] truncate">{currentUser?.designation || currentUser?.departmentName || t('সমন্বয়ক কার্যালয়', 'Coordination Office')}</p>
            </div>
          </div>

          <div className="pt-1.5 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--muted)]">
            <span className="flex items-center gap-1 font-medium text-[var(--ink)]">
              <ShieldCheck className="w-3 h-3 text-[var(--status-low)]" aria-hidden="true" />
              <span>{t('অডিট ভেরিফায়েড', 'Audit Verified')}</span>
            </span>
            <span className="font-mono text-[var(--muted)] text-[9px]">SHA-256</span>
          </div>
        </div>
      </aside>
    </>
  );
};
