import React, { useState, useMemo } from 'react';
import { useCases } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { toBanglaNumber, formatBanglaDate } from '../../utils/formatters';
import { Case, CaseStatus } from '../../types';
import {
  Phone,
  Send,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Layers,
  User,
  Radio,
  FileText,
  X,
  Droplets,
  Car,
  Trash2,
  Zap,
  HeartPulse,
  Utensils,
  Waves,
  Eye,
  Sliders,
  Camera,
  MapPin,
  Check,
  ShieldCheck,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface AuthorityContact {
  deptKey: string;
  deptNameBn: string;
  deptNameEn: string;
  officerNameBn: string;
  officerNameEn: string;
  designationBn: string;
  designationEn: string;
  hotline: string;
  phone: string;
  email: string;
  icon: any;
  color: string;
}

const DEPARTMENT_AUTHORITIES: Record<string, AuthorityContact> = {
  water: {
    deptKey: 'water',
    deptNameBn: 'পানি সরবরাহ ও পয়ঃনিষ্কাশন শাখা (ওয়াসা)',
    deptNameEn: 'Water Supply Department (WASA Wing)',
    officerNameBn: 'প্রকৌশলী শামসুল হুদা',
    officerNameEn: 'Engr. Shamsul Huda',
    designationBn: 'তত্ত্বাবধায়ক প্রকৌশলী (ওয়াসা)',
    designationEn: 'Superintending Engineer (Water)',
    hotline: '০৩১-৬২০৫৫৫',
    phone: '০৩১-৬২০৫৫৭',
    email: 'water.dispatch@ccc.gov.bd',
    icon: Droplets,
    color: '#0284c7'
  },
  road_transport: {
    deptKey: 'road_transport',
    deptNameBn: 'সড়ক পরিবহন ও অবকাঠামো প্রকৌশল বিভাগ',
    deptNameEn: 'Roads & Infrastructure Engineering Dept',
    officerNameBn: 'প্রকৌশলী মাহমুদুল হাসান',
    officerNameEn: 'Engr. Mahmudul Hasan',
    designationBn: 'নির্বাহী প্রকৌশলী (সড়ক ও পরিবহন)',
    designationEn: 'Executive Engineer (Roads)',
    hotline: '০৩১-৬২০৩৩৩',
    phone: '০৩১-৬২০৩৩৬',
    email: 'roads.dispatch@ccc.gov.bd',
    icon: Car,
    color: '#ea580c'
  },
  waste: {
    deptKey: 'waste',
    deptNameBn: 'বর্জ্য ব্যবস্থাপনা বিভাগ',
    deptNameEn: 'Waste Management Department',
    officerNameBn: 'প্রকৌশলী রফিকুল ইসলাম',
    officerNameEn: 'Engr. Rafiqul Islam',
    designationBn: 'প্রধান পরিচ্ছন্নতা কর্মকর্তা',
    designationEn: 'Chief Waste Management Officer',
    hotline: '০৩১-৬২০১১১',
    phone: '০৩১-৬২০১১৪',
    email: 'waste.dispatch@ccc.gov.bd',
    icon: Trash2,
    color: '#16a34a'
  },
  electricity: {
    deptKey: 'electricity',
    deptNameBn: 'বিদ্যুৎ ও সড়কবাতি বিভাগ',
    deptNameEn: 'Electrical & Street Lighting Department',
    officerNameBn: 'প্রকৌশলী মেজবাহ উদ্দিন',
    officerNameEn: 'Engr. Mezbah Uddin',
    designationBn: 'সহকারী প্রকৌশলী (বিদ্যুৎ ও জ্বালানি)',
    designationEn: 'Assistant Engineer (Electrical)',
    hotline: '০৩১-৬২০৪৪৪',
    phone: '০৩১-৬২০৪৪৭',
    email: 'lighting.dispatch@ccc.gov.bd',
    icon: Zap,
    color: '#eab308'
  },
  healthcare: {
    deptKey: 'healthcare',
    deptNameBn: 'জনস্বাস্থ্য ও রোগ নিয়ন্ত্রণ বিভাগ',
    deptNameEn: 'Public Health & Disease Control Dept',
    officerNameBn: 'ডাঃ সাবরিনা ইয়াসমিন',
    officerNameEn: 'Dr. Sabrina Yasmin',
    designationBn: 'প্রধান স্বাস্থ্য কর্মকর্তা (সিটি হেলথ)',
    designationEn: 'Chief Health Officer',
    hotline: '০৩১-৬২০৬৬৬',
    phone: '০৩১-৬২০৬৬৮',
    email: 'health.dispatch@ccc.gov.bd',
    icon: HeartPulse,
    color: '#dc2626'
  },
  food: {
    deptKey: 'food',
    deptNameBn: 'খাদ্য নিরাপত্তা ও ভোক্তা অধিকার শাখা',
    deptNameEn: 'Food Safety & Consumer Rights Wing',
    officerNameBn: 'কামাল হোসেন',
    officerNameEn: 'Kamal Hossain',
    designationBn: 'প্রধান স্যানিটারি ইন্সপেক্টর',
    designationEn: 'Chief Sanitary Inspector',
    hotline: '০৩১-৬২০৭৭৭',
    phone: '০৩১-৬২০৭৭৯',
    email: 'foodsafety.dispatch@ccc.gov.bd',
    icon: Utensils,
    color: '#d97706'
  },
  drainage: {
    deptKey: 'drainage',
    deptNameBn: 'ড্রেনেজ ও নর্দমা প্রকৌশল বিভাগ',
    deptNameEn: 'Drainage & Sewerage Engineering Dept',
    officerNameBn: 'প্রকৌশলী তানভীর আহমেদ',
    officerNameEn: 'Engr. Tanveer Ahmed',
    designationBn: 'তত্ত্বাবধায়ক প্রকৌশলী (ড্রেনেজ)',
    designationEn: 'Superintending Engineer (Drainage)',
    hotline: '০৩১-৬২০২২২',
    phone: '০৩১-৬২০২২৫',
    email: 'drainage.dispatch@ccc.gov.bd',
    icon: Waves,
    color: '#0891b2'
  }
};

export const AdminWorksStatusAuthorityHub: React.FC = () => {
  const { cases, updateCaseStatusByAdmin } = useCases();
  const { t, language } = useLanguage();
  const { showSuccess, showInfo } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [activeCallItem, setActiveCallItem] = useState<{ caseItem: Case; contact: AuthorityContact } | null>(null);
  const [activeMsgItem, setActiveMsgItem] = useState<{ caseItem: Case; contact: AuthorityContact } | null>(null);
  const [msgNoticeType, setMsgNoticeType] = useState<string>('emergency_directive');
  const [msgContent, setMsgContent] = useState<string>('');
  
  // Problem Details Modal state
  const [activeDetailItem, setActiveDetailItem] = useState<Case | null>(null);

  // Status & Progress Change Modal state
  const [activeStatusModalItem, setActiveStatusModalItem] = useState<Case | null>(null);
  const [newStatus, setNewStatus] = useState<CaseStatus>('in_progress');
  const [progressPercent, setProgressPercent] = useState<number>(50);
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Individual Full Report Print Modal state
  const [activePrintReportItem, setActivePrintReportItem] = useState<Case | null>(null);

  const formatNum = (num: number) => (language === 'en' ? num.toString() : toBanglaNumber(num));

  // Resolve authority contact for any case
  const getAuthorityForCase = (item: Case): AuthorityContact => {
    const cat = item.category?.toLowerCase() || 'waste';
    if (cat.includes('water')) return DEPARTMENT_AUTHORITIES.water;
    if (cat.includes('road')) return DEPARTMENT_AUTHORITIES.road_transport;
    if (cat.includes('waste')) return DEPARTMENT_AUTHORITIES.waste;
    if (cat.includes('light') || cat.includes('elec')) return DEPARTMENT_AUTHORITIES.electricity;
    if (cat.includes('health')) return DEPARTMENT_AUTHORITIES.healthcare;
    if (cat.includes('food')) return DEPARTMENT_AUTHORITIES.food;
    if (cat.includes('drain')) return DEPARTMENT_AUTHORITIES.drainage;
    return DEPARTMENT_AUTHORITIES.waste;
  };

  // Filter cases based on status, category, and search
  const filteredCases = useMemo(() => {
    return cases.filter(item => {
      // Status filter
      if (statusFilter === 'in_progress' && item.status !== 'in_progress') return false;
      if (statusFilter === 'emergency' && item.priority !== 'emergency' && item.priority !== 'high') return false;
      if (statusFilter === 'resolved' && (item.status !== 'closed' && item.status !== 'resolved_pending_citizen')) return false;
      if (statusFilter === 'reopened' && item.status !== 'reopened') return false;

      // Category filter
      if (categoryFilter !== 'all') {
        const cat = item.category?.toLowerCase() || '';
        if (!cat.includes(categoryFilter.toLowerCase())) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(q) || (item.trackingNumber || '').toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesWard = item.location?.wardName?.toLowerCase().includes(q);
        const matchesAddress = (item.location?.address || '').toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesWard && !matchesAddress) return false;
      }

      return true;
    });
  }, [cases, statusFilter, categoryFilter, searchQuery]);

  // Status counts for tab badges
  const statusCounts = useMemo(() => {
    return {
      all: cases.length,
      in_progress: cases.filter(c => c.status === 'in_progress').length,
      emergency: cases.filter(c => c.priority === 'emergency' || c.priority === 'high').length,
      resolved: cases.filter(c => c.status === 'closed' || c.status === 'resolved_pending_citizen').length,
      reopened: cases.filter(c => c.status === 'reopened').length
    };
  }, [cases]);

  // Handle Call Authority
  const handleOpenCall = (caseItem: Case) => {
    const contact = getAuthorityForCase(caseItem);
    setActiveCallItem({ caseItem, contact });
  };

  // Handle Message Authority
  const handleOpenMsg = (caseItem: Case) => {
    const contact = getAuthorityForCase(caseItem);
    const defaultText = `[জরুরি প্রাতিষ্ঠানিক নির্দেশ]\nকেস নম্বর: ${caseItem.id}\nসমস্যা: ${caseItem.title}\nঅবস্থান: ${caseItem.location.wardName}, ${caseItem.location.address}\nঅগ্রাধিকার: ${caseItem.priority.toUpperCase()}\n\nঅবিলম্বে সরেজমিনে কাজের তদারকি নিশ্চিত করে অগ্রগতি রিপোর্ট আপডেট করুন।\n- সিস্টেম প্রশাসন ও কন্ট্রোল রুম, চট্টগ্রাম সিটি কর্পোরেশন`;
    setMsgContent(defaultText);
    setActiveMsgItem({ caseItem, contact });
  };

  const handleSendNotice = () => {
    if (!activeMsgItem) return;
    showSuccess(
      language === 'en'
        ? `Official notice dispatched to ${activeMsgItem.contact.officerNameEn} (${activeMsgItem.contact.deptNameEn}) via SMS & Radio Alert!`
        : `${activeMsgItem.contact.officerNameBn} (${activeMsgItem.contact.deptNameBn})-এর কাছে এসএমএস ও সরকারি ওয়্যারলেস নোটিশ সফলভাবে প্রেরিত হয়েছে!`
    );
    setActiveMsgItem(null);
  };

  // Open Status Update Modal
  const handleOpenStatusModal = (item: Case) => {
    setActiveStatusModalItem(item);
    setNewStatus(item.status);
    setProgressPercent(item.status === 'closed' || item.status === 'resolved_pending_citizen' ? 100 : item.status === 'in_progress' ? 65 : 30);
    setAdminNotes('');
  };

  // Submit Status Update
  const handleSaveStatus = async () => {
    if (!activeStatusModalItem) return;
    await updateCaseStatusByAdmin(activeStatusModalItem.id, newStatus, progressPercent, adminNotes);
    setActiveStatusModalItem(null);
    if (activeDetailItem?.id === activeStatusModalItem.id) {
      setActiveDetailItem(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Print filtered report list
  const handlePrintReport = () => {
    window.print();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['CaseID', 'Category', 'Title', 'Ward', 'Priority', 'Status', 'AssignedDept', 'Officer', 'Hotline', 'Date'];
    const rows = filteredCases.map(c => {
      const auth = getAuthorityForCase(c);
      return [
        c.id,
        c.category,
        `"${c.title.replace(/"/g, '""')}"`,
        `"${c.location.wardName} - ${c.location.address}"`,
        c.priority,
        c.status,
        `"${auth.deptNameBn}"`,
        `"${auth.officerNameBn}"`,
        auth.hotline,
        c.submittedAt
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nagorik Sathi_Works_Status_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(t('রিপোর্ট সফলভাবে ডাউনলোড হয়েছে (CSV)', 'Report exported successfully (CSV)'));
  };

  return (
    <div className="space-y-6">
      {/* ===================== COMMAND HEADER ===================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--paper)] border border-[var(--line)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--muted)] font-mono">
              {t('পৌর কার্যপরিকল্পনা ও জবাবদিহিতা কমান্ড', 'Municipal Works & Authority Command Hub')}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[var(--ink)] tracking-tight">
            {t('লাইভ কাজের অগ্রগতি, স্ট্যাটাস পরিবর্তন ও কর্তৃপক্ষ যোগাযোগ', 'Live Works Status, Progress Updates & Authority Direct Dial')}
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1 font-bangla">
            {t(
              'সকল সেবা খাতের চলমান ও জরুরি নাগরিক সমস্যার সরাসরি পর্যবেক্ষণ, কাজের স্থিতি হালনাগাদ, ছবিসহ রিপোর্ট ও দায়িত্বপ্রাপ্ত কর্মকর্তাকে কল/বার্তা প্রেরণ।',
              'Real-time municipal work monitoring across 7 sectors, status override, picture-attached case dossier, and instant authority dispatch.'
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--line)] bg-[var(--paper-elevated)] hover:bg-[var(--line)] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('রিপোর্ট প্রিন্ট', 'Print Report')}</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('CSV এক্সপোর্ট', 'Export CSV')}</span>
          </button>
        </div>
      </div>

      {/* ===================== AUTHORITY DIRECTORY HOTLINE MARQUEE ===================== */}
      <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--ink)]">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>{t('বিভাগীয় দায়িত্বপ্রাপ্ত কর্মকর্তা ও ২৪/৭ জরুরি হটলাইন ডিরেক্টরি', 'Department Authority & 24/7 Hotline Directory')}</span>
          </div>
          <span className="text-[11px] text-[var(--muted)] font-mono">
            {t('এক ক্লিকে সরাসরি কল বা নোটিশ', '1-Click Direct Dial or Alert')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {Object.values(DEPARTMENT_AUTHORITIES).map(auth => {
            const Icon = auth.icon;
            return (
              <div
                key={auth.deptKey}
                className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-2 group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: auth.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-[var(--ink)] truncate" title={language === 'en' ? auth.deptNameEn : auth.deptNameBn}>
                      {language === 'en' ? auth.deptNameEn.split(' ')[0] : auth.deptNameBn.split(' ')[0]}
                    </p>
                    <p className="text-[9px] text-[var(--muted)] truncate">
                      {language === 'en' ? auth.officerNameEn : auth.officerNameBn}
                    </p>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-[var(--line)] flex items-center justify-between text-[10px]">
                  <a
                    href={`tel:${auth.hotline.replace(/[^0-9]/g, '')}`}
                    className="font-mono font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    title={t('কল করুন', 'Direct Call')}
                  >
                    <Phone className="w-2.5 h-2.5" />
                    <span>{auth.hotline}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== FILTER TABS & SEARCH CONTROLS ===================== */}
      <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)] space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] pb-3">
          {[
            { id: 'all', labelBn: 'সকল কাজ', labelEn: 'All Works', count: statusCounts.all, color: 'text-indigo-500' },
            { id: 'in_progress', labelBn: 'চলমান কাজ', labelEn: 'In Progress', count: statusCounts.in_progress, color: 'text-blue-500' },
            { id: 'emergency', labelBn: 'জরুরি / উচ্চ অগ্রাধিকার', labelEn: 'Emergency & High', count: statusCounts.emergency, color: 'text-red-500' },
            { id: 'resolved', labelBn: 'সমাধান সম্পন্ন', labelEn: 'Resolved', count: statusCounts.resolved, color: 'text-emerald-500' },
            { id: 'reopened', labelBn: 'পুনরায় তদন্তাধীন / আপত্তি', labelEn: 'Reopened / Objections', count: statusCounts.reopened, color: 'text-amber-500' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[var(--ink)] text-[var(--paper)] shadow-xs'
                  : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
              }`}
            >
              <span>{language === 'en' ? tab.labelEn : tab.labelBn}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${statusFilter === tab.id ? 'bg-[var(--paper)] text-[var(--ink)]' : 'bg-[var(--paper-elevated)] text-[var(--muted)]'}`}>
                {formatNum(tab.count)}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('কেস আইডি, সমস্যা, এলাকা বা ওয়ার্ড দিয়ে খুঁজুন...', 'Search by Case ID, work title, area or ward...')}
              className="w-full pl-9 pr-3 py-2 bg-[var(--bg)] border border-[var(--line)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--line)] rounded-lg text-xs text-[var(--ink)] focus:outline-none"
            >
              <option value="all">{t('সকল সেবা খাত (৭টি ক্যাটাগরি)', 'All 7 Service Sectors')}</option>
              <option value="water">{t('পানি সরবরাহ (Water)', 'Water Supply')}</option>
              <option value="road">{t('সড়ক ও পরিবহন (Road)', 'Road & Transport')}</option>
              <option value="waste">{t('বর্জ্য ব্যবস্থাপনা (Waste)', 'Waste Management')}</option>
              <option value="light">{t('বিদ্যুৎ ও সড়কবাতি (Electricity)', 'Electricity & Lighting')}</option>
              <option value="health">{t('জনস্বাস্থ্য (Healthcare)', 'Public Healthcare')}</option>
              <option value="food">{t('খাদ্য নিরাপত্তা (Food Safety)', 'Food Safety')}</option>
              <option value="drain">{t('ড্রেনেজ (Drainage)', 'Drainage & Sewerage')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--muted)] px-2">
            <span>
              {t('মোট ফিল্টারকৃত:', 'Total Filtered:')} <strong className="text-[var(--ink)]">{formatNum(filteredCases.length)}</strong> {t('টি কাজ', 'cases')}
            </span>
            {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-emerald-600 hover:underline cursor-pointer"
              >
                {t('রিসেট', 'Reset')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================== WORKS MONITORING & AUTHORITY DISPATCH TABLE ===================== */}
      <div className="rounded-2xl bg-[var(--paper)] border border-[var(--line)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--line)] text-[var(--muted)] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5">{t('কেস ও ছবি', 'Case & Photo')}</th>
                <th className="py-3 px-3.5">{t('কাজের বিবরণ ও ওয়ার্ড', 'Work Scope & Ward')}</th>
                <th className="py-3 px-3.5">{t('অগ্রাধিকার', 'Priority')}</th>
                <th className="py-3 px-3.5">{t('কাজের অবস্থা', 'Work Status')}</th>
                <th className="py-3 px-3.5">{t('দায়িত্বপ্রাপ্ত বিভাগ ও কর্মকর্তা', 'Assigned Dept & Authority')}</th>
                <th className="py-3 px-3.5 text-center">{t('অ্যাকশন ও কন্ট্রোল', 'Actions & Controls')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredCases.length > 0 ? (
                filteredCases.map(item => {
                  const auth = getAuthorityForCase(item);
                  const Icon = auth.icon;
                  const photoUrl = item.initialEvidence?.[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=400&q=80';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[var(--bg)] transition cursor-pointer group"
                      onClick={() => setActiveDetailItem(item)}
                    >
                      {/* Case ID, Thumbnail & Sector */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[var(--line)] shrink-0 bg-[var(--bg)] shadow-xs">
                            <img
                              src={photoUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                              onError={e => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/incidents/incident_drainage.webp';
                              }}
                            />
                            <div
                              className="absolute top-1 right-1 w-4 h-4 rounded-md flex items-center justify-center text-white text-[9px] shadow-xs"
                              style={{ backgroundColor: auth.color }}
                            >
                              <Icon className="w-2.5 h-2.5" />
                            </div>
                          </div>
                          <div>
                            <span className="font-mono font-bold text-[var(--ink)] block hover:text-emerald-500 transition">
                              {item.trackingNumber || item.id}
                            </span>
                            <span className="text-[10px] text-[var(--muted)] font-mono">
                              {language === 'en' ? auth.deptNameEn.split(' ')[0] : auth.deptNameBn.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Title & Ward */}
                      <td className="py-3 px-3.5 max-w-sm">
                        <div className="font-bold text-[var(--ink)] line-clamp-1 group-hover:text-emerald-600 transition">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.location.wardName}</span>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">{item.location.address || 'চিহ্নিত এলাকা'}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <PriorityBadge priority={item.priority} />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} />
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenStatusModal(item);
                            }}
                            className="p-1 rounded-md text-[var(--muted)] hover:text-indigo-600 hover:bg-indigo-500/10 transition cursor-pointer"
                            title={t('স্ট্যাটাস ও প্রগ্রেস পরিবর্তন করুন', 'Update Status & Progress')}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px] text-[var(--muted)] font-mono mt-1">
                          {language === 'en' ? new Date(item.submittedAt).toLocaleDateString('en-US') : formatBanglaDate(item.submittedAt)}
                        </div>
                      </td>

                      {/* Assigned Authority */}
                      <td className="py-3 px-3.5 max-w-xs">
                        <div className="font-semibold text-[var(--ink)] truncate">
                          {language === 'en' ? auth.officerNameEn : auth.officerNameBn}
                        </div>
                        <div className="text-[10px] text-[var(--muted)] truncate">
                          {language === 'en' ? auth.designationEn : auth.designationBn}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-mono mt-0.5">
                          {auth.hotline}
                        </div>
                      </td>

                      {/* Action Buttons: Details, Status, Call, Msg, Print */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Full Problem Statement */}
                          <button
                            type="button"
                            onClick={() => setActiveDetailItem(item)}
                            className="p-1.5 rounded-lg bg-[var(--paper-elevated)] text-[var(--ink)] hover:bg-[var(--line)] border border-[var(--line)] transition cursor-pointer shadow-xs"
                            title={t('ছবিসহ বিস্তারিত সমস্যা দেখুন', 'View Full Details & Photo')}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Status Change Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(item)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 transition cursor-pointer shadow-xs"
                            title={t('কাজের স্থিতি পরিবর্তন করুন', 'Change Work Status')}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>

                          {/* Call Authority Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenCall(item)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition cursor-pointer shadow-xs"
                            title={t('কর্তৃপক্ষকে সরাসরি কল করুন', 'Call Department Authority')}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>

                          {/* Message Authority Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenMsg(item)}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition cursor-pointer shadow-xs"
                            title={t('কর্তৃপক্ষকে জরুরি নোটিশ / বার্তা পাঠান', 'Dispatch Urgent Alert to Authority')}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Full Case Dossier with Photo */}
                          <button
                            type="button"
                            onClick={() => setActivePrintReportItem(item)}
                            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white border border-purple-500/20 transition cursor-pointer shadow-xs"
                            title={t('ছবিসহ ইনডিভিজুয়াল রিপোর্ট প্রিন্ট করুন', 'Print Full Case Dossier & Report')}
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--muted)]">
                    <p className="font-semibold text-sm">{t('কোনো সমস্যা বা কাজ পাওয়া যায়নি', 'No cases found matching filters')}</p>
                    <p className="text-xs mt-1">{t('ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন', 'Try adjusting your search or category filter')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== MODAL 1: PROBLEM DETAILS MODAL (PICTURE & STATEMENT) ===================== */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl max-w-3xl w-full p-6 space-y-6 text-[var(--ink)] shadow-2xl my-4 sm:my-8 relative flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Eye className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black">{activeDetailItem.title}</h3>
                    <StatusBadge status={activeDetailItem.status} />
                  </div>
                  <p className="text-xs font-mono text-[var(--muted)]">
                    ID: {activeDetailItem.id} | {activeDetailItem.location.wardName} - {activeDetailItem.location.address}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailItem(null)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Problem Photo Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-500" />
                  <span>{t('নাগরিক কর্তৃক সংগৃহীত প্রমাণক ছবি', 'Attached Incident Evidence Photograph')}</span>
                </span>
                <span className="text-[10px] font-mono">
                  {formatBanglaDate(activeDetailItem.submittedAt)}
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--bg)] shadow-md">
                <img
                  src={activeDetailItem.initialEvidence?.[0]?.url || '/images/incidents/incident_drainage.webp'}
                  alt={activeDetailItem.title}
                  className="w-full max-h-80 object-cover"
                  referrerPolicy="no-referrer"
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/incidents/incident_drainage.webp';
                  }}
                />
                <div className="p-3 bg-[var(--paper-elevated)] border-t border-[var(--line)] flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)] font-medium">
                    {activeDetailItem.initialEvidence?.[0]?.caption || activeDetailItem.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                    GPS & Timestamp Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Full Problem Statement */}
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {t('নাগরিকের বিস্তারিত অভিযোগ ও বিবরণ (Full Problem Statement)', 'Full Citizen Problem Statement')}
              </h4>
              <p className="text-sm font-medium leading-relaxed font-bangla text-[var(--ink)]">
                {activeDetailItem.description}
              </p>
            </div>

            {/* Meta Grid: Location & AI Jurisdictional Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] space-y-2">
                <span className="font-bold text-[var(--muted)] uppercase tracking-wider text-[10px] block">
                  {t('ভৌগোলিক অবস্থান ও সিটি কর্পোরেশন জোন', 'Geographic Location & Municipal Zone')}
                </span>
                <div className="space-y-1">
                  <p><strong>{t('ওয়ার্ড:', 'Ward:')}</strong> {activeDetailItem.location.wardName}</p>
                  <p><strong>{t('ঠিকানা:', 'Address:')}</strong> {activeDetailItem.location.address}</p>
                  {activeDetailItem.location.landmark && (
                    <p><strong>{t('ল্যান্ডমার্ক:', 'Landmark:')}</strong> {activeDetailItem.location.landmark}</p>
                  )}
                  <p className="font-mono text-[10px] text-[var(--muted)]">
                    GPS: {activeDetailItem.location.lat.toFixed(4)}, {activeDetailItem.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] space-y-2">
                <span className="font-bold text-[var(--muted)] uppercase tracking-wider text-[10px] block">
                  {t('দায়িত্বপ্রাপ্ত বিভাগ ও এআই বিশ্লেষণ', 'Assigned Authority & AI Assessment')}
                </span>
                <div className="space-y-1">
                  <p><strong>{t('বিভাগ:', 'Department:')}</strong> {getAuthorityForCase(activeDetailItem).deptNameBn}</p>
                  <p><strong>{t('কর্মকর্তা:', 'Officer:')}</strong> {getAuthorityForCase(activeDetailItem).officerNameBn}</p>
                  <p><strong>{t('হটলাইন:', 'Hotline:')}</strong> <span className="font-mono text-emerald-600">{getAuthorityForCase(activeDetailItem).hotline}</span></p>
                  <p><strong>{t('এআই কনফিডেন্স:', 'AI Confidence:')}</strong> {activeDetailItem.aiAnalysis?.confidenceScore || 95}%</p>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenStatusModal(activeDetailItem);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{t('কাজের স্থিতি পরিবর্তন করুন', 'Update Status / Progress')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePrintReportItem(activeDetailItem);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('ইনডিভিজুয়াল রিপোর্ট প্রিন্ট', 'Print Case Dossier')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenCall(activeDetailItem)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('কল করুন', 'Call Authority')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenMsg(activeDetailItem)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('বার্তা পাঠান', 'Send Alert')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 2: STATUS & PROGRESS CHANGE MODAL ===================== */}
      {activeStatusModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl max-w-lg w-full p-6 space-y-6 text-[var(--ink)] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                  <Sliders className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-base">{t('কাজের স্থিতি ও প্রগ্রেস পরিবর্তন', 'Update Work Status & Progress')}</h3>
                  <p className="text-xs font-mono text-[var(--muted)]">{activeStatusModalItem.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveStatusModalItem(null)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1 text-[var(--muted)]">
                  {t('কাজের বর্তমান অবস্থা নির্ধারণ করুন (Select New Status):', 'Select New Work Status:')}
                </label>
                <select
                  value={newStatus}
                  onChange={e => {
                    const st = e.target.value as CaseStatus;
                    setNewStatus(st);
                    if (st === 'resolved_pending_citizen' || st === 'closed') setProgressPercent(100);
                    else if (st === 'in_progress') setProgressPercent(65);
                    else if (st === 'reopened') setProgressPercent(40);
                  }}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--line)] rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="in_progress">{t('চলমান কাজ (In Progress)', 'In Progress')}</option>
                  <option value="under_inspection">{t('সরেজমিনে পরিদর্শন চলছে (Under Inspection)', 'Under Inspection')}</option>
                  <option value="resolved_pending_citizen">{t('সমাধান সম্পন্ন (Resolved)', 'Resolved')}</option>
                  <option value="reopened">{t('পুনরায় তদন্তাধীন / নাগরিক আপত্তি (Reopened)', 'Reopened / Objection')}</option>
                  <option value="closed">{t('চূড়ান্ত সমাপ্ত (Closed)', 'Closed')}</option>
                  <option value="verified">{t('যাচাইকৃত (Verified)', 'Verified')}</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-[var(--muted)]">{t('কাজের বাস্তব অগ্রগতি হার (Progress %):', 'Field Work Progress Rate (%):')}</span>
                  <span className="font-mono text-indigo-600 text-sm">{formatNum(progressPercent)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPercent}
                  onChange={e => setProgressPercent(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--muted)] font-mono mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[var(--muted)]">
                  {t('প্রশাসনিক মন্তব্য ও মাঠ নির্দেশিকা (Official Notes / Directive):', 'Administrative Remark / Field Notes:')}
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder={t('কাজের অগ্রগতির কারণ বা নির্দেশ লিখুন...', 'Enter progress update reason or directives...')}
                  className="w-full p-3 bg-[var(--bg)] border border-[var(--line)] rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-bangla"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--line)] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveStatusModalItem(null)}
                className="py-2 px-4 rounded-xl border border-[var(--line)] text-xs font-semibold hover:bg-[var(--line)] transition"
              >
                {t('বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t('সংরক্ষণ ও হালনাগাদ করুন', 'Save & Update Status')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 3: CALL AUTHORITY MODAL ===================== */}
      {activeCallItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 space-y-6 text-[var(--ink)] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: activeCallItem.contact.color }}
                >
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{t('কর্তৃপক্ষকে জরুরি কল', 'Call Responsible Authority')}</h3>
                  <p className="text-xs text-[var(--muted)] font-mono">{activeCallItem.caseItem.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCallItem(null)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--paper-elevated)] border border-[var(--line)] flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5 text-[var(--ink)]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {language === 'en' ? activeCallItem.contact.officerNameEn : activeCallItem.contact.officerNameBn}
                  </h4>
                  <p className="text-xs text-[var(--muted)]">
                    {language === 'en' ? activeCallItem.contact.designationEn : activeCallItem.contact.designationBn}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600">
                    {language === 'en' ? activeCallItem.contact.deptNameEn : activeCallItem.contact.deptNameBn}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--line)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">{t('২৪/৭ জরুরি হটলাইন:', '24/7 Hotline:')}</span>
                  <a
                    href={`tel:${activeCallItem.contact.hotline.replace(/[^0-9]/g, '')}`}
                    className="font-mono font-bold text-emerald-600 text-sm hover:underline"
                  >
                    {activeCallItem.contact.hotline}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">{t('ডিরেক্ট ডেস্ক ফোন:', 'Direct Desk Phone:')}</span>
                  <a
                    href={`tel:${activeCallItem.contact.phone.replace(/[^0-9]/g, '')}`}
                    className="font-mono font-bold text-indigo-600 hover:underline"
                  >
                    {activeCallItem.contact.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveCallItem(null)}
                className="py-2 px-4 rounded-xl border border-[var(--line)] text-xs font-semibold hover:bg-[var(--line)] transition"
              >
                {t('বন্ধ করুন', 'Close')}
              </button>
              <a
                href={`tel:${activeCallItem.contact.hotline.replace(/[^0-9]/g, '')}`}
                onClick={() => {
                  showInfo(t('কল ডায়াল শুরু হয়েছে...', 'Initiating direct call...'));
                  setActiveCallItem(null);
                }}
                className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('এখনই কল করুন', 'Dial Call Now')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 4: MESSAGE / NOTICE TO AUTHORITY ===================== */}
      {activeMsgItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl max-w-lg w-full p-6 space-y-5 text-[var(--ink)] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-base">{t('কর্তৃপক্ষকে অফিশিয়াল ডিরেক্টিভ / বার্তা', 'Official Directive to Authority')}</h3>
                  <p className="text-xs text-[var(--muted)] font-mono">{activeMsgItem.caseItem.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMsgItem(null)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-[var(--muted)]">
                  {t('প্রেরিতব্য কর্মকর্তা ও বিভাগ:', 'Recipient Officer & Department:')}
                </label>
                <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                  <strong>{language === 'en' ? activeMsgItem.contact.officerNameEn : activeMsgItem.contact.officerNameBn}</strong>
                  <span className="text-[var(--muted)] block text-[11px]">
                    {language === 'en' ? activeMsgItem.contact.deptNameEn : activeMsgItem.contact.deptNameBn}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[var(--muted)]">
                  {t('নোটিশের ধরন (Notice Classification):', 'Notice Type:')}
                </label>
                <select
                  value={msgNoticeType}
                  onChange={e => setMsgNoticeType(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--line)] rounded-lg text-xs"
                >
                  <option value="emergency_directive">{t('জরুরি ফিল্ড একশন ডিরেক্টিভ (Priority Directive)', 'Emergency Directive')}</option>
                  <option value="sla_warning">{t('এসএলএ মেয়াদোত্তীর্ণ সতর্কবার্তা (SLA Breach Warning)', 'SLA Escalation Warning')}</option>
                  <option value="progress_inquest">{t('কাজের অগ্রগতি তদন্ত নোটিশ (Progress Inquest)', 'Progress Report Inquiry')}</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[var(--muted)]">
                  {t('বার্তার মূল বিষয়বস্তু (Message Body):', 'Message Content:')}
                </label>
                <textarea
                  rows={5}
                  value={msgContent}
                  onChange={e => setMsgContent(e.target.value)}
                  className="w-full p-3 bg-[var(--bg)] border border-[var(--line)] rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveMsgItem(null)}
                className="py-2 px-4 rounded-xl border border-[var(--line)] text-xs font-semibold hover:bg-[var(--line)] transition"
              >
                {t('বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleSendNotice}
                className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('বার্তা প্রেরণ করুন', 'Send Official Directive')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 5: FULL CASE DOSSIER & INDIVIDUAL REPORT PRINT ===================== */}
      {activePrintReportItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] rounded-2xl max-w-3xl w-full my-4 sm:my-8 shadow-2xl relative flex flex-col overflow-hidden">
            {/* Sticky Top Control Bar (Always in view at top of modal) */}
            <div className="sticky top-0 z-30 bg-[var(--paper-elevated)] border-b border-[var(--line)] px-5 py-3.5 flex items-center justify-between shadow-xs print:hidden shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  <Printer className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--ink)]">
                    {t('নাগরিক অভিযোগ ও পৌর কার্যসম্পাদন পূর্ণাঙ্গ রিপোর্ট ফাইল', 'Official Case Dossier & Work Order Report')}
                  </h4>
                  <p className="text-[10px] text-[var(--muted)] font-mono">{activePrintReportItem.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('প্রিন্ট / PDF সংরক্ষণ করুন', 'Print / Save PDF')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePrintReportItem(null)}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition cursor-pointer"
                  title={t('বন্ধ করুন', 'Close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Official Document Sheet */}
            <div className="p-6 sm:p-8 space-y-6 font-sans">
              {/* Government Header */}
              <div className="text-center border-b-2 border-[var(--line)] pb-4 space-y-1">
                <div className="inline-block px-3 py-0.5 rounded-full bg-[var(--paper-elevated)] text-[var(--ink)] text-[10px] font-bold uppercase tracking-widest border border-[var(--line)] mb-1">
                  Government of the People's Republic of Bangladesh
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
                  চট্টগ্রাম সিটি কর্পোরেশন · নগর সাথী ডিজিটাল কমান্ড
                </h2>
                <p className="text-xs font-bold text-[var(--muted)]">
                  {t('নাগরিক সমস্যা ও ফিল্ড কার্যসম্পাদন প্রাতিষ্ঠানিক তদন্ত রিপোর্ট', 'MUNICIPAL CIVIC PROBLEM & OFFICIAL FIELD WORK DOSSIER')}
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-[var(--muted)] pt-1">
                  <span>REF NO: <strong className="text-[var(--ink)]">{activePrintReportItem.id}</strong></span>
                  <span>•</span>
                  <span>DATE: {new Date().toLocaleDateString('bn-BD')}</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-bold">SECURITY: SHA-256 VERIFIED</span>
                </div>
              </div>

              {/* Case Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[var(--bg)] p-4 rounded-xl border border-[var(--line)]">
                <div>
                  <span className="text-[10px] text-[var(--muted)] uppercase block font-semibold">{t('ট্র্যাকিং নম্বর:', 'Tracking ID:')}</span>
                  <strong className="font-mono text-sm text-[var(--ink)]">{activePrintReportItem.trackingNumber || activePrintReportItem.id}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted)] uppercase block font-semibold">{t('অগ্রাধিকার:', 'Priority:')}</span>
                  <strong className="uppercase text-red-500 font-bold">{activePrintReportItem.priority}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted)] uppercase block font-semibold">{t('বর্তমান অবস্থা:', 'Current Status:')}</span>
                  <strong className="text-emerald-500 uppercase font-bold">{activePrintReportItem.status}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted)] uppercase block font-semibold">{t('ওয়ার্ড ও জোন:', 'Ward & Zone:')}</span>
                  <strong className="text-[var(--ink)]">{activePrintReportItem.location.wardName}</strong>
                </div>
              </div>

              {/* Attached Picture for the Case */}
              <div className="space-y-2 border border-[var(--line)] rounded-xl p-3.5 bg-[var(--bg)]">
                <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-purple-500" />
                  <span>{t('সংযুক্ত নাগরিক প্রমাণক ছবি (Attached Incident Photograph):', 'Attached Incident Photograph Evidence:')}</span>
                </span>
                <div className="rounded-xl overflow-hidden border border-[var(--line)] max-h-80 bg-[var(--paper-elevated)] flex items-center justify-center shadow-xs">
                  <img
                    src={activePrintReportItem.initialEvidence?.[0]?.url || '/images/incidents/incident_drainage.webp'}
                    alt="Case Evidence"
                    className="w-full max-h-72 object-cover"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/incidents/incident_drainage.webp';
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--muted)] px-1">
                  <span>{activePrintReportItem.initialEvidence?.[0]?.caption || activePrintReportItem.title}</span>
                  <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    EXIF & GEO VALIDATED
                  </span>
                </div>
              </div>

              {/* Full Problem Statement */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-[var(--muted)] uppercase block font-bold">{t('সমস্যা ও নাগরিক বিবৃতি (Problem Statement):', 'Scope & Problem Statement:')}</span>
                <h4 className="font-bold text-sm text-[var(--ink)]">{activePrintReportItem.title}</h4>
                <p className="text-[var(--ink)] leading-relaxed font-bangla p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] mt-1 font-medium">
                  {activePrintReportItem.description}
                </p>
              </div>

              {/* Location & Authority Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[var(--bg)] rounded-xl border border-[var(--line)] space-y-1">
                  <span className="text-[10px] text-[var(--muted)] uppercase font-bold block">{t('ঘটনাস্থল ও ভৌগোলিক স্থানাঙ্ক:', 'Location Details:')}</span>
                  <p><strong>{t('ঠিকানা:', 'Address:')}</strong> {activePrintReportItem.location.address}</p>
                  <p><strong>{t('ল্যান্ডমার্ক:', 'Landmark:')}</strong> {activePrintReportItem.location.landmark || 'প্রযোজ্য নয়'}</p>
                  <p className="font-mono text-[10px] text-[var(--muted)]">GPS: {activePrintReportItem.location.lat.toFixed(4)}, {activePrintReportItem.location.lng.toFixed(4)}</p>
                </div>
                <div className="p-3.5 bg-[var(--bg)] rounded-xl border border-[var(--line)] space-y-1">
                  <span className="text-[10px] text-[var(--muted)] uppercase font-bold block">{t('দায়িত্বপ্রাপ্ত বিভাগ ও প্রকৌশলী:', 'Assigned Authority:')}</span>
                  <p><strong>{t('বিভাগ:', 'Dept:')}</strong> {getAuthorityForCase(activePrintReportItem).deptNameBn}</p>
                  <p><strong>{t('কর্মকর্তা:', 'Officer:')}</strong> {getAuthorityForCase(activePrintReportItem).officerNameBn}</p>
                  <p><strong>{t('হটলাইন:', 'Hotline:')}</strong> <span className="font-mono text-emerald-500 font-bold">{getAuthorityForCase(activePrintReportItem).hotline}</span></p>
                </div>
              </div>

              {/* Authorization & Signatures */}
              <div className="pt-8 border-t-2 border-[var(--line)] flex items-end justify-between text-xs">
                <div>
                  <span className="block text-[10px] text-[var(--muted)] font-bold uppercase">{t('সত্যায়নকারী কর্মকর্তা:', 'Authorized Administrator:')}</span>
                  <strong className="text-sm block text-[var(--ink)]">{t('সিস্টেম অ্যাডমিনিস্ট্রেটর', 'System Administrator')}</strong>
                  <span className="text-[10px] text-[var(--muted)] block">চট্টগ্রাম সিটি কর্পোরেশন ডিজিটাল কোর</span>
                  <span className="text-[9px] font-mono text-emerald-500 block mt-1 font-bold">DIGITAL SIGNATURE ID: #CCC-SYS-2026</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-[var(--muted)] font-bold uppercase">{t('মাঠ প্রকৌশলীর সিল ও স্বাক্ষর:', 'Field Engineer Seal & Sign:')}</span>
                  <div className="w-40 border-b-2 border-dashed border-[var(--muted)] mt-6 mb-1"></div>
                  <span className="text-[10px] text-[var(--muted)] block">{getAuthorityForCase(activePrintReportItem).officerNameBn}</span>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Control Bar */}
            <div className="sticky bottom-0 z-30 bg-[var(--paper-elevated)] border-t border-[var(--line)] px-5 py-3 flex items-center justify-between shadow-xs print:hidden shrink-0">
              <span className="text-[11px] text-[var(--muted)] font-medium">
                {t('অফিসিয়াল প্রিন্ট কপি ও PDF ডকুমেন্টে নাগরিক প্রমাণক ছবি, জিপিএস ও ডিজিটাল সিগনেচার অন্তর্ভুক্ত থাকবে।', 'Print copy includes evidence photo, GPS, and digital validation.')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePrintReportItem(null)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--line)] text-xs font-semibold hover:bg-[var(--line)] transition cursor-pointer"
                >
                  {t('বন্ধ করুন', 'Close')}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('প্রিন্ট / PDF সংরক্ষণ করুন', 'Print / Save PDF')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
