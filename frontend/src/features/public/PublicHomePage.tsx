import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight, ArrowUpRight, BookOpen, Building2, Camera, CheckCircle2,
  FileSearch, Landmark, MapPin, ShieldCheck, Users, Workflow,
  Sparkles, Clock, Activity, CheckCheck, Search, TrendingUp,
  Layers, PhoneCall, Award, Compass, Eye, BadgeCheck, Zap,
  AlertTriangle, RotateCcw
} from 'lucide-react';

export const PublicHomePage: React.FC = () => {
  const { isAuthenticated, setDevDemoDrawerOpen } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [trackQuery, setTrackQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState<'ai' | 'multidept' | 'gps' | 'evidence' | 'objection' | 'sla'>('ai');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim();
    if (query) {
      navigate(`/cases/${query}`);
    } else {
      navigate('/cases');
    }
  };

  const handleQuickChip = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  // Feature Options for the Hero Panel
  const featureOptions = [
    { id: 'ai' as const, label: t('এআই ইনটেক', 'AI Intake'), icon: Sparkles },
    { id: 'multidept' as const, label: t('বহু-বিভাগীয়', 'Multi-Dept'), icon: Workflow },
    { id: 'gps' as const, label: t('জিপিএস ম্যাপ', 'GPS Map'), icon: MapPin },
    { id: 'evidence' as const, label: t('প্রমাণক অডিট', 'Evidence'), icon: ShieldCheck },
    { id: 'objection' as const, label: t('নাগরিক আপত্তি', 'Objection'), icon: Award },
    { id: 'sla' as const, label: t('এসএলএ মনিটর', 'SLA Target'), icon: Clock },
  ];

  const featureDetails = {
    ai: {
      title: t('বাংলা এনএলপি ৬-মডেল এআই এনসেম্বল', 'Bangla NLP 6-Model AI Ensemble'),
      tag: t('ইনফারেন্স ও রাউটিং', 'NLP Inference & Gate'),
      icon: Sparkles,
      color: '#34d399',
      desc: t(
        'নাগরিকের বাংলা বা বাংলিশ অভিযোগের টেক্সট বিশ্লেষণ করে ৬টি মেশিন লার্নিং মডেল ভোট প্রদান করে স্বয়ংক্রিয় বিভাগ ও অগ্রাধিকার নির্ধারণ করে।',
        'Analyzes complaint text across Bangla and Banglish with 6 ML models voting on category routing and priority level with 80%+ confidence gate.'
      ),
      points: [
        t('৬টি মডেল: Word LR, Linear SVC, MNB, CNB, SGD, SVD Forest', '6 Models: Word LR, Linear SVC, MNB, CNB, SGD, SVD Forest'),
        t('৮০% কনফিডেন্স গেট — সন্দেহজনক হলে ওয়ার্ড ডেস্কে ম্যানুয়াল রিভিউ', '80% Confidence Gate — Human review mandatory for unconfident routing'),
        t('পানি সরবরাহ, সড়ক ও পরিবহন, বর্জ্য, বিদ্যুৎ, স্বাস্থ্য, খাদ্য ও ড্রেনেজ ক্যাটাগরি স্বয়ংক্রিয় শ্রেণীবদ্ধ', 'Autonomous categorization across Water, Road & Transport, Waste, Electricity, Healthcare, Food Safety & Drainage')
      ],
      actionPath: '/report',
      actionText: t('এআই সহায়তা দিয়ে রিপোর্ট করুন', 'Report with AI Intake')
    },
    multidept: {
      title: t('একক কেসে বহু-বিভাগীয় ওয়ার্কফ্লো চেইন', 'Unified Multi-Department Workflow'),
      tag: t('পর্যায়ক্রমিক সমন্বয়', 'Sequential Dependencies'),
      icon: Workflow,
      color: '#38bdf8',
      desc: t(
        'একই এলাকার জটিল সমস্যায় পৃথক ৩টি কেস না খুলে ১টি কেসের আওতায় ড্রেনেজ, বর্জ্য ও সড়ক বিভাগকে শর্তযুক্ত ক্রমানুসারে কাজের দায়িত্ব দেওয়া হয়।',
        'Instead of separate tickets, complex cases coordinate Drainage, Waste, and Roads in strict prerequisite sequences under one ticket.'
      ),
      points: [
        t('ড্রেন পরিষ্কারের পর সড়ক পিচঢালাই — পূর্বশর্ত ছাড়া পরবর্তী টাস্ক লক', 'Prerequisite locking: Road repair unlocks only after drainage clears'),
        t('কেন্দ্রীয় সমন্বয়ক (Coordinator) সরাসরি অগ্রগতি পর্যবেক্ষণ করেন', 'City coordinator oversees cross-department handovers & SLA'),
        t('একক কেস আইডিতে ৩টি বিভাগের পৃথক অগ্রগতি দৃশ্যমান', 'All 3 departments tracked transparently under 1 case ID')
      ],
      actionPath: '/cases/NS-2026-000184',
      actionText: t('বহু-বিভাগীয় কেস প্রিভিউ দেখুন', 'View Multi-Dept Case Preview')
    },
    gps: {
      title: t('জিপিএস জিওফেন্সিং ও স্বয়ংক্রিয় ওয়ার্ড ম্যাপিং', 'GPS Geofencing & Ward Mapping'),
      tag: t('স্থানিক জিআইএস', 'Spatial Geofence'),
      icon: MapPin,
      color: '#a78bfa',
      desc: t(
        'ব্রাউজারের আসল জিপিএস নিয়ে চট্টগ্রাম সিটি কর্পোরেশনের ৪১টি ওয়ার্ডের সীমানার সাথে মেলানো হয়। ঘনঘন অভিযোগের এলাকায় হটস্পট চিহ্নিত হয়।',
        'Captures authentic GPS coordinates matched against ward boundary polygons, identifying recurring civic problem hotspots.'
      ),
      points: [
        t('কোনো নকল বা সিন্থেটিক জিপিএস নেওয়া হয় না', 'Zero synthetic GPS — strict citizen browser location permission'),
        t('ওয়ার্ড ও জোন অনুযায়ী স্বয়ংক্রিয় কর্মকর্তা অ্যাসাইনমেন্ট', 'Auto-assigns responsible ward desk & jurisdiction engineers'),
        t('লাইভ ইন্টারেক্টিভ ম্যাপে সমস্যা ও সমাধান মার্কার', 'Interactive map with status pins & cluster analytics')
      ],
      actionPath: '/map',
      actionText: t('লাইভ নগর মানচিত্র খুলুন', 'Explore Live City Map')
    },
    evidence: {
      title: t('বাধ্যতামূলক পূর্বে/পরে ফটো প্রমাণক ও অডিট', 'Mandatory Before/After Proof & Audit'),
      tag: t('স্বচ্ছতা ও জবাবদিহি', 'SHA-256 Audit'),
      icon: ShieldCheck,
      color: '#f59e0b',
      desc: t(
        'মাঠপর্যায়ে কাজ শেষ বলে চিহ্নিত করতে হলে প্রকৌশলীকে কাজের পূর্বের ও পরের হাই-রেজোলিউশন ফটো প্রমাণক আপলোড করতেই হবে।',
        'Field officers cannot close tasks without attaching genuine high-resolution Before & After photo evidence verified on-chain.'
      ),
      points: [
        t('কাজের স্পষ্ট প্রমাণ ছাড়া কেস সমাধান গ্রাহ্য হয় না', 'Submissions without photographic proof are rejected'),
        t('প্রতিটি পরিবর্তনের পেছনে অপরিবর্তনীয় SHA-256 অডিট হ্যাশ', 'Tamper-proof SHA-256 audit chaining for all actions'),
        t('নাগরিক ও ওয়ার্ড কাউন্সিলর সরাসরি ছবি যাচাই করতে পারেন', 'Public, councillor and citizen access to verified photos')
      ],
      actionPath: '/transparency',
      actionText: t('স্বচ্ছতা ও প্রমাণক লগ দেখুন', 'Inspect Evidence & Audit Logs')
    },
    objection: {
      title: t('নাগরিকের ৪ দিনের আপত্তি ও সন্তুষ্টি অধিকার', 'Citizen 4-Day Statutory Objection Right'),
      tag: t('নাগরিক সুরক্ষা', 'Citizen Power'),
      icon: Award,
      color: '#ec4899',
      desc: t(
        'কর্তৃপক্ষ সমাধান ঘোষণা করলেও নাগরিকের হাতে থাকে চূড়ান্ত ক্ষমতা। কাজে ত্রুটি থাকলে ৪ দিনের মধ্যে আপত্তি জানালে কেসটি পুনর্মূল্যায়নে যায়।',
        'Citizens retain complete authority: if work is substandard, lodge an objection within 4 days to trigger automatic supervisor review.'
      ),
      points: [
        t('সমাধান ঘোষণার পর ৪ দিনের আইনি গ্রেস পিরিয়ড', 'Mandatory 4-day grace window before case permanently closes'),
        t('ছবি ও কারণ উল্লেখ করে এক ক্লিকে আপত্তি দাখিল', 'One-click objection filing with photo proof of unresolved issue'),
        t('আপত্তি গৃহীত হলে ঊর্ধ্বতন কর্মকর্তা কর্তৃক নতুন ওয়ার্কঅর্ডার', 'Triggers automatic supervisory review and reopened tasks')
      ],
      actionPath: '/services',
      actionText: t('নাগরিক সেবা সনদ পড়ুন', 'Read Citizen Charter Rights')
    },
    sla: {
      title: t('রিয়েল-টাইম এসএলএ কাউন্টডাউন ও এসকেলেশন', 'Real-Time SLA & Auto-Escalation'),
      tag: t('সময়সীমা নিশ্চয়তা', 'SLA Target'),
      icon: Clock,
      color: '#10b981',
      desc: t(
        'জরুরি কেসে ২-৬ ঘণ্টা এবং সাধারণ কেসে ২৪-৭২ ঘণ্টার এসএলএ কাউন্টডাউন চলে। সময় অতিক্রম করলে সরাসরি সচিব ও মেয়রের ড্যাশবোর্ডে এসকেলেট হয়।',
        'Live countdown timers monitor target resolution hours (2-6h emergency, 24-72h standard) with automatic multi-tier escalation.'
      ),
      points: [
        t('প্রতিটি কাজের জন্য লাইভ কাউন্টডাউন টাইমার', 'Live remaining-hour countdown for every department task'),
        t('লেভেল-১ (বিভাগীয় প্রধান) ও লেভেল-২ (সিটি সচিব) এসকেলেশন', 'Tiered automated escalations when lead hours expire'),
        t('পারফরম্যান্স স্কোরিং যা মাসিক জবাবদিহি রিপোর্টে প্রকাশ পায়', 'Public reporting on department compliance & breach metrics')
      ],
      actionPath: '/transparency',
      actionText: t('এসএলএ মেট্রিক্স ড্যাশবোর্ড', 'View SLA Metrics Dashboard')
    }
  };

  const currentFeature = featureDetails[activeFeature];
  const ActiveIcon = currentFeature.icon;

  const services = [
    {
      title: t('সমস্যা জানান', 'Report Civic Issue'),
      subtitle: t('ছবি, অডিও, বিবরণ ও স্বয়ংক্রিয় অবস্থান যুক্ত করুন', 'Attach photos, audio, details & GPS coordinates'),
      path: '/report',
      icon: Camera,
      tone: 'teal',
      number: '01',
      badge: t('তাৎক্ষণিক এআই বিশ্লেষণ', 'Instant AI Intake')
    },
    {
      title: t('অভিযোগ ট্র্যাক করুন', 'Track Complaint'),
      subtitle: t('রিয়েল-টাইম কাজের অগ্রগতি ও এসএলএ পর্যবেক্ষণ', 'Live status, milestone timeline & SLA countdown'),
      path: '/cases',
      icon: FileSearch,
      tone: 'blue',
      number: '02',
      badge: t('লাইভ স্ট্যাটাস', 'Live Tracking')
    },
    {
      title: t('নগর মানচিত্র', 'Interactive City Map'),
      subtitle: t('ওয়ার্ডভিত্তিক সমস্যা, সমাধান ও সক্রিয় হটস্পট', 'Ward-level spatial issues, resolutions & hotspots'),
      path: '/map',
      icon: MapPin,
      tone: 'violet',
      number: '03',
      badge: t('জিও-লোকেশন', 'Geo Location')
    },
    {
      title: t('সেবা নির্দেশিকা', 'Citizen Services Charter'),
      subtitle: t('সিটি কর্পোরেশনের নাগরিক সনদ ও আবেদন নিয়মাবলী', 'Citizen charter regulations, standard timelines & rights'),
      path: '/services',
      icon: BookOpen,
      tone: 'amber',
      number: '04',
      badge: t('নাগরিক অধিকার', 'Citizen Rights')
    },
    {
      title: t('স্বচ্ছতা ড্যাশবোর্ড', 'Transparency & Audit'),
      subtitle: t('বিভাগীয় পারফরম্যান্স, অডিট লগ ও জবাবদিহি', 'Department performance, public metrics & Open311'),
      path: '/transparency',
      icon: ShieldCheck,
      tone: 'green',
      number: '05',
      badge: t('ওপেন ৩১১', 'Open311 Ready')
    },
    {
      title: t('দাপ্তরিক প্রবেশ', 'Official Workspaces'),
      subtitle: t('ওয়ার্ড ডেস্ক, প্রকৌশলী, সমন্বয়ক ও অ্যাডমিন হাব', 'Ward desks, department engineers & administrative hubs'),
      path: '/roles',
      icon: Users,
      tone: 'slate',
      number: '06',
      badge: t('৬টি ডেমো রোল', '6 Demo Roles')
    }
  ];

  const stats = [
    {
      value: t('৯৮.৪%', '98.4%'),
      label: t('সমাধান সাফল্যের হার', 'Resolution Rate'),
      detail: t('৭টি সিটি বিভাগে সমন্বিত', 'Unified across 7 depts'),
      icon: TrendingUp,
      accent: '#10b981',
      soft: 'rgba(16, 185, 129, 0.12)'
    },
    {
      value: t('২৪–৪৮ ঘণ্টা', '24–48 Hours'),
      label: t('গড় প্রতিক্রিয়া সময়', 'Avg Response SLA'),
      detail: t('জরুরি কেসে ২ ঘণ্টা এসএলএ', '2h target for emergency'),
      icon: Clock,
      accent: '#0284c7',
      soft: 'rgba(2, 132, 199, 0.12)'
    },
    {
      value: t('৭টি বিভাগ', '7 Departments'),
      label: t('এক প্ল্যাটফর্মে সমন্বয়', 'Integrated Operations'),
      detail: t('পানি, সড়ক, বর্জ্য, বিদ্যুৎ, স্বাস্থ্য, খাদ্য ও ড্রেনেজ', 'Water, Road, Waste, Power, Health, Food & Drainage'),
      icon: Layers,
      accent: '#8b5cf6',
      soft: 'rgba(139, 92, 246, 0.12)'
    },
    {
      value: t('৫টি ওয়ার্ড', '5 Pilot Wards'),
      label: t('ডিজিটাল পাইলট কাভারেজ', 'Digital Pilot Coverage'),
      detail: t('১ হতে ৫ নং ওয়ার্ড চট্টগ্রাম', 'Ward 01 to 05 Chattogram'),
      icon: Compass,
      accent: '#0f766e',
      soft: 'rgba(15, 118, 110, 0.12)'
    }
  ];

  const recentResolutions = [
    {
      id: 'NS-2026-000184',
      title: t('পাঁচলাইশ আবাসিক সংযোগ সড়কে জলাবদ্ধতা ও ড্রেন মেরামত', 'Panchlaish Residential Access Road Drainage & Waterlogging Repair'),
      ward: t('৩ নং ওয়ার্ড · পাঁচলাইশ', 'Ward 03 · Panchlaish'),
      dept: t('ড্রেনেজ ও সড়ক প্রকৌশল', 'Drainage & Roads Engineering'),
      status: t('সমাধান সম্পন্ন (নাগরিক অনুমোদিত)', 'Resolved & Citizen Approved'),
      beforeImg: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&q=80',
      afterImg: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80',
      slaHours: t('৪৮ ঘণ্টা এসএলএ পূরণ', 'Met 48h SLA Target')
    },
    {
      id: 'NS-2026-000192',
      title: t('চান্দগাঁও সেকেন্ডারি ট্রান্সফার স্টেশন বর্জ্য অপসারণ ও জীবাণুনাশক স্প্রে', 'Chandgaon STS Waste Removal & Disinfection Spray'),
      ward: t('৪ নং ওয়ার্ড · চান্দগাঁও', 'Ward 04 · Chandgaon'),
      dept: t('বর্জ্য ব্যবস্থাপনা বিভাগ', 'Waste Management Department'),
      status: t('সমাধান সম্পন্ন', 'Resolved'),
      beforeImg: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80',
      afterImg: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
      slaHours: t('১২ ঘণ্টা এসএলএ পূরণ', 'Met 12h SLA Target')
    },
    {
      id: 'NS-2026-000170',
      title: t('দক্ষিণ পাহাড়তলী প্রধান সড়ক সড়কবাতি পোস্ট-৮৮ মেরামত', 'South Pahartali Main Road Streetlight Pole-88 Repair'),
      ward: t('১ নং ওয়ার্ড · দক্ষিণ পাহাড়তলী', 'Ward 01 · South Pahartali'),
      dept: t('বিদ্যুৎ ও সড়কবাতি বিভাগ', 'Electrical & Street Lighting'),
      status: t('সমাধান সম্পন্ন', 'Resolved'),
      beforeImg: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&q=80',
      afterImg: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
      slaHours: t('২৪ ঘণ্টা এসএলএ পূরণ', 'Met 24h SLA Target')
    }
  ];

  return (
    <main className="nagar-home animate-in fade-in duration-300">
      {/* ======================= HERO SECTION ======================= */}
      <section className="nagar-hero">
        <div className="nagar-hero-image" />
        <div className="nagar-hero-overlay" />

        {/* Ambient glowing radial lights */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="nagar-hero-content">
          {/* Header Eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="nagar-eyebrow">
              <span className="nagar-live-dot" />
              <span>{t('ডিজিটাল নাগরিক সেবা সমন্বয় প্ল্যাটফর্ম', 'Connected Civic Service Platform')}</span>
            </div>
          </div>

          {/* Hero Main Grid */}
          <div className="nagar-hero-grid">
            <div className="max-w-3xl">
              <p className="nagar-hero-kicker flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                NAGORIK SATHI / CONNECTED CIVIC TECHNOLOGY
              </p>

              <h1 className="tracking-tight">
                {t('আপনার শহর।', 'Your City.')}<br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                  {t('এক ক্লিকেই সমাধান।', 'One Click Solution.')}
                </span>
              </h1>

              <p className="nagar-hero-copy">
                {t(
                  'আপনার সমস্যা জানান। ওয়ার্ড ডেস্ক, বিভাগীয় প্রকৌশলী এবং সমন্বিত কার্যপ্রক্রিয়ার মাধ্যমে প্রমাণসহ জবাবদিহিতামূলক সমাধান নিশ্চিত করুন।',
                  'Report your civic issues. Ensure transparent, evidence-based resolutions through ward desks, department engineers, and unified workflows.'
                )}
              </p>

              {/* Quick Case Tracker Bar */}
              <div className="nagar-track-bar">
                <form onSubmit={handleTrackSubmit} className="nagar-track-input-wrapper">
                  <Search className="h-4 w-4 shrink-0 text-white/60 ml-1" />
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder={t('আপনার অভিযোগ নম্বর দিন (যেমন: NS-2026-000184)', 'Enter complaint tracking ID (e.g. NS-2026-000184)')}
                    className="nagar-track-input"
                    aria-label="অভিযোগ ট্র্যাকিং সার্চ"
                  />
                  <button type="submit" className="nagar-track-btn">
                    <span>{t('ট্র্যাক করুন', 'Track Case')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>

                {/* Quick Chips */}
                <div className="nagar-quick-chips">
                  <span className="text-[10px] text-white/50">{t('ডেমো কেস পরীক্ষা:', 'Demo Cases:')}</span>
                  <button
                    type="button"
                    onClick={() => handleQuickChip('NS-2026-000184')}
                    className="nagar-quick-chip"
                    title="৩-ধাপের বহু-বিভাগীয় জটিল কেস"
                  >
                    <span>#NS-2026-000184</span>
                    <span className="text-emerald-300 text-[9px]">{t('(বহু-বিভাগীয়)', '(Multi-Dept)')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickChip('NS-2026-000192')}
                    className="nagar-quick-chip"
                    title="বর্জ্য ব্যবস্থাপনা কেস"
                  >
                    <span>#NS-2026-000192</span>
                    <span className="text-amber-300 text-[9px]">{t('(বর্জ্য)', '(Waste)')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickChip('NS-2026-000170')}
                    className="nagar-quick-chip"
                    title="সড়কবাতি কেস"
                  >
                    <span>#NS-2026-000170</span>
                    <span className="text-cyan-300 text-[9px]">{t('(সড়কবাতি)', '(Lighting)')}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to={isAuthenticated ? '/report' : '/login/citizen'}
                  className="nagar-primary-action shadow-lg hover:shadow-emerald-500/20"
                >
                  <Camera className="h-4 w-4" />
                  <span>{t('নতুন সমস্যা জানান', 'Report Civic Issue')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/map" className="nagar-secondary-action">
                  <MapPin className="h-4 w-4 text-emerald-300" />
                  <span>{t('লাইভ নগর মানচিত্র', 'Live City Map')}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDevDemoDrawerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-3 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
                >
                  <Users className="h-4 w-4 text-amber-300" />
                  <span>{t('৬টি রোল পোর্টাল', '6 Roles Hub')}</span>
                </button>
              </div>
            </div>

            {/* ======================= HERO RIGHT: INTERACTIVE FEATURE SELECTOR ======================= */}
            <aside className="nagar-hero-panel">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide">
                    {t('নাগরিক সাথী ফিচার এক্সপ্লোরার', 'Platform Feature Hub')}
                  </span>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                  {t('ক্লিক করে দেখুন', 'Interactive')}
                </span>
              </div>

              {/* Feature Selection Buttons */}
              <div className="nagar-feature-tabs">
                {featureOptions.map((opt) => {
                  const OptIcon = opt.icon;
                  const isSelected = activeFeature === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setActiveFeature(opt.id)}
                      className={`nagar-feature-tab-btn ${isSelected ? 'active' : ''}`}
                    >
                      <OptIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Feature Interactive Preview Card */}
              <div className="nagar-feature-preview-box">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-teal-950 font-bold shadow-sm"
                      style={{ backgroundColor: currentFeature.color }}
                    >
                      <ActiveIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {currentFeature.title}
                      </h4>
                      <span className="text-[10px] text-emerald-300 font-mono">
                        {currentFeature.tag}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-white/80 leading-relaxed my-2">
                  {currentFeature.desc}
                </p>

                {/* Key Bullet Points */}
                <div className="space-y-1.5 my-3 pt-2 border-t border-white/10">
                  {currentFeature.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[10px] text-white/70">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA for Selected Feature */}
                <Link
                  to={currentFeature.actionPath}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-emerald-300 transition"
                >
                  <span>{currentFeature.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Panel Footer */}
              <div className="nagar-panel-foot">
                <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>{t('চূড়ান্ত দায়িত্ব নির্ধারণ ও সমাধানে প্রাতিষ্ঠানিক মানব যাচাই বজায় থাকে', 'Human verification remains mandatory for all final actions')}</span>
              </div>
            </aside>
          </div>

          {/* Hero Bottom Meta Strip */}
          <div className="nagar-hero-bottom">
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
              {t('চট্টগ্রাম সিটি কর্পোরেশন ও আইসিটি বিভাগের উন্মুক্ত নাগরিক সেবা উদ্যোগ', 'Chattogram City Corporation & ICT Division Civic Technology Initiative')}
            </span>
            <span className="font-mono">VER 1.2 · SHA-256 AUDIT VERIFIED</span>
          </div>
        </div>
      </section>

      {/* ======================= LIVE PULSE STATS STRIP ======================= */}
      <section className="section-shell">
        <div className="nagar-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="nagar-stat-card">
                <div className="nagar-stat-icon" style={{ backgroundColor: stat.soft, color: stat.accent }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="nagar-stat-content">
                  <h4>{stat.value}</h4>
                  <p>{stat.label}</p>
                  <span className="text-[10px] text-[var(--muted-light)] block mt-0.5">{stat.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================= SERVICES SHORTCUTS ======================= */}
      <section className="nagar-shortcuts section-shell">
        <div className="nagar-section-heading">
          <div>
            <span className="nagar-section-kicker">SERVICES & DIRECT ACCESS</span>
            <h2>{t('নাগরিক সেবাসমূহ ও পোর্টাল', 'Civic Services & Direct Access')}</h2>
            <p>{t('আপনার প্রয়োজনীয় সেবায় সরাসরি এক ক্লিকে প্রবেশ করুন।', 'Access all civic services and official workspaces with one click.')}</p>
          </div>
          <Link to="/services" className="nagar-text-link">
            <span>{t('সকল সেবা ও নাগরিক সনদ দেখুন', 'Explore Full Citizen Charter')}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="nagar-service-grid">
          {services.map(({ title, subtitle, path, icon: Icon, tone, number, badge }) => (
            <Link key={path} to={path} className={`nagar-service-card tone-${tone} group`}>
              <div className="nagar-card-top">
                <span className="nagar-service-icon">
                  <Icon />
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[var(--paper-elevated)] border border-[var(--line)] px-2 py-0.5 text-[9px] font-semibold text-[var(--muted)]">
                    {badge}
                  </span>
                  <span className="nagar-card-number">{number}</span>
                </div>
              </div>

              <div>
                <h3>{title}</h3>
                <p>{subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================= VERIFIED EVIDENCE SHOWCASE ======================= */}
      <section className="section-shell mt-16">
        <div className="nagar-section-heading">
          <div>
            <span className="nagar-section-kicker">VERIFIED CIVIC EVIDENCE</span>
            <h2>{t('সম্প্রতি সমাধানকৃত সমস্যা ও প্রমাণক', 'Recently Resolved Issues & Field Evidence')}</h2>
            <p>{t('কাজের পূর্বে ও পরের ছবিসহ বাস্তব নাগরিক সন্তুষ্টির চিত্র।', 'Authentic before and after photographic evidence of completed civic works.')}</p>
          </div>
          <Link to="/cases" className="nagar-text-link">
            <span>{t('সকল পাবলিক কেস দেখুন', 'View All Public Cases')}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="nagar-evidence-grid">
          {recentResolutions.map((item) => (
            <Link
              key={item.id}
              to={`/cases/${item.id}`}
              className="nagar-evidence-card group cursor-pointer"
            >
              {/* Split Before/After Thumbnail View */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <div className="grid grid-cols-2 h-full w-full">
                  <div className="relative h-full overflow-hidden border-r border-white/20">
                    <img
                      src={item.beforeImg}
                      alt={t('কাজের পূর্বে', 'Before Work')}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-red-300 backdrop-blur-xs">
                      {t('পূর্বে', 'Before')}
                    </span>
                  </div>
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={item.afterImg}
                      alt={t('কাজের পরে', 'After Resolution')}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-emerald-950/85 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 backdrop-blur-xs">
                      {t('পরে (সমাধান)', 'After (Resolved)')}
                    </span>
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                    #{item.id}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--muted)] mb-1.5">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3 text-[var(--accent)]" />
                      {item.ward}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      {item.slaHours}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)] line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition">
                    {item.title}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--line-subtle)] flex items-center justify-between text-[11px]">
                  <span className="text-[var(--muted)] font-medium">{t('বিভাগ:', 'Department:')} {item.dept}</span>
                  <span className="text-[var(--accent)] font-bold inline-flex items-center gap-1">
                    {t('বিস্তারিত', 'View Details')} <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================= CIVIC TRUST & ARCHITECTURE ======================= */}
      <section className="nagar-trust-strip section-shell">
        <div className="nagar-trust-item">
          <span className="nagar-trust-icon">
            <Building2 />
          </span>
          <div>
            <strong>{t('একক সমন্বিত কেস ফ্রেমওয়ার্ক', 'Unified Compound Case Framework')}</strong>
            <small>{t('ড্রেনেজ, বর্জ্য ও সড়ক বিভাগ একই কেসে পরস্পর সম্পর্কিত ধাপে কাজ করে', 'Drainage, waste & road departments coordinate sequential tasks under one ticket')}</small>
          </div>
        </div>

        <div className="nagar-trust-item">
          <span className="nagar-trust-icon">
            <ShieldCheck />
          </span>
          <div>
            <strong>{t('টেম্পার-প্রুফ অডিট ট্রেইল', 'Tamper-Proof Audit Trail')}</strong>
            <small>{t('প্রতিটি সিদ্ধান্ত ও পরিবর্তনের পেছনে SHA-256 চেইন ও কারণ সংরক্ষণ', 'Every decision backed by cryptographic SHA-256 audit chaining')}</small>
          </div>
        </div>

        <div className="nagar-trust-item">
          <span className="nagar-trust-icon">
            <Award />
          </span>
          <div>
            <strong>{t('নাগরিক আপত্তি ও সন্তুষ্টি অধিকার', 'Citizen Statutory Objection Right')}</strong>
            <small>{t('সমাধান মানসম্মত না হলে ৪ দিনের মধ্যে নাগরিক সরাসরি আপত্তি জানাতে পারেন', '4-day citizen objection window to reject substandard repairs')}</small>
          </div>
        </div>
      </section>

      {/* ======================= EMERGENCY HOTLINES ======================= */}
      <section className="nagar-emergency section-shell">
        <div>
          <span className="nagar-section-kicker">URGENT HELP & HOTLINES</span>
          <h2>{t('জরুরি প্রয়োজনে তাৎক্ষণিক যোগাযোগ করুন', 'Urgent Assistance & Emergency Hotlines')}</h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            {t(
              'গুরুতর বিপদ, অগ্নি দুর্ঘটনা বা জরুরি নাগরিক সহযোগিতায় সরাসরি কল করুন।',
              'Direct dial for disaster management, fire, law enforcement, and municipal emergencies.'
            )}
          </p>
        </div>
        <div className="nagar-emergency-actions">
          <a href="tel:999" className="hover:scale-105 transition">
            <PhoneCall className="h-4 w-4" />
            <span>{t('জাতীয় জরুরি সেবা', 'National Emergency')}</span>
            <strong>৯৯৯</strong>
          </a>
          <a href="tel:333" className="hover:scale-105 transition">
            <Building2 className="h-4 w-4" />
            <span>{t('নাগরিক তথ্য বাতায়ন', 'Citizen Helpline')}</span>
            <strong>৩৩৩</strong>
          </a>
          <a href="tel:16256" className="hover:scale-105 transition">
            <Landmark className="h-4 w-4" />
            <span>{t('পরিবেশ ও বর্জ্য হটলাইন', 'Waste & Environment')}</span>
            <strong>১৬২৫৬</strong>
          </a>
        </div>
      </section>
    </main>
  );
};
