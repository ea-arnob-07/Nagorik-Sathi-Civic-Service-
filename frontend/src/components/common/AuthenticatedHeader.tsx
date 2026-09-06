import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationDropdown } from './NotificationDropdown';
import { OfficialReportModal } from './OfficialReportModal';
import {
  LogOut,
  User,
  Shield,
  Wrench,
  GitMerge,
  Code,
  Sun,
  Moon,
  Landmark,
  Menu,
  X,
  Globe,
  Printer
} from 'lucide-react';

export const AuthenticatedHeader: React.FC = () => {
  const { currentUser, activeRole, logout, setDevDemoDrawerOpen, isSidebarOpen, toggleSidebar } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    switch (activeRole) {
      case 'ward_desk':
        return { label: t('ওয়ার্ড ডেস্ক', 'Ward Desk'), icon: <Shield className="w-3.5 h-3.5" aria-hidden="true" /> };
      case 'field_officer':
        return { label: t('দপ্তর কর্মকর্তা', 'Field Officer'), icon: <Wrench className="w-3.5 h-3.5" aria-hidden="true" /> };
      case 'coordinator':
        return { label: t('কেস সমন্বয়ক', 'Case Coordinator'), icon: <GitMerge className="w-3.5 h-3.5" aria-hidden="true" /> };
      case 'governance_head':
        return { label: t('সিটি গভর্নেন্স প্রধান', 'Governance Head'), icon: <Landmark className="w-3.5 h-3.5" aria-hidden="true" /> };
      case 'admin':
        return { label: t('সিস্টেম অ্যাডমিন', 'System Admin'), icon: <Shield className="w-3.5 h-3.5" aria-hidden="true" /> };
      default:
        return { label: t('নাগরিক', 'Citizen'), icon: <User className="w-3.5 h-3.5" aria-hidden="true" /> };
    }
  };

  const badge = getRoleBadge();

  return (
    <header
      className="sticky top-0 z-50 w-full py-2.5 px-4 sm:px-6 shadow-lg border-b border-white/15"
      style={{
        background: `linear-gradient(105deg, rgba(7, 25, 43, 0.94) 0%, rgba(8, 44, 59, 0.88) 48%, rgba(7, 37, 48, 0.80) 100%), url('/images/hero_civic_fullpage.webp') center top / cover no-repeat`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: '#ffffff',
      }}
    >
      <div className="max-w-[1540px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Active Workspace */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Trigger */}
          {activeRole !== 'citizen' && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/15 md:hidden transition cursor-pointer"
              title={t('মেনু খুলুন/বন্ধ করুন', 'Toggle Menu')}
              aria-label="Toggle Sidebar Navigation"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link to="/" className="flex shrink-0 items-center group cursor-pointer" aria-label="Nagorik Sathi Home">
            <img
              src="/images/nagorik-sathi-logo-dark.png"
              alt="নাগরিক সাথী"
              className="h-10 w-auto max-w-[170px] object-contain sm:h-12 sm:max-w-[210px]"
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          <span className="text-white/25 hidden sm:inline" aria-hidden="true">|</span>

          {/* Active Role Indicator */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-emerald-300 border border-white/20 shadow-xs backdrop-blur-md">
            {badge.icon}
            <span>{badge.label} {t('ওয়ার্কস্পেস', 'Workspace')}</span>
          </div>
        </div>

        {/* Right User Meta & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition cursor-pointer shadow-xs"
            title={t('ভাষা পরিবর্তন', 'Switch Language')}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'EN' : 'BN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/20 transition cursor-pointer shadow-xs"
            title={t('থিম পরিবর্তন', 'Toggle Theme')}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" /> : <Moon className="w-4 h-4 text-emerald-300" aria-hidden="true" />}
          </button>

          {/* Developer Demo Tooling Trigger */}
          <button
            type="button"
            onClick={() => setDevDemoDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 hover:border-white/30 transition cursor-pointer shadow-xs"
            title={t('রোল পরিবর্তন মেনু', 'Switch Demo Role')}
          >
            <Code className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span className="hidden md:inline">{t('রোল পরিবর্তন', 'Switch Role')}</span>
          </button>

          {/* Official Report & PDF Export Trigger */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400/60 transition cursor-pointer shadow-xs"
            title={t('অফিসিয়াল রিপোর্ট ও PDF ডাউনলোড', 'Official Report & PDF Export')}
          >
            <Printer className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
            <span className="hidden sm:inline">{t('রিপোর্ট / PDF', 'Report / PDF')}</span>
          </button>

          {/* Interactive Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile Info */}
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/20">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-xs shadow-xs">
                {language === 'en'
                  ? currentUser.name?.match(/[A-Za-z]/)?.[0] || 'U'
                  : currentUser.name ? currentUser.name.slice(0, 1) : 'ন'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-bold text-xs text-white leading-none">{currentUser.name}</p>
                <p className="text-[11px] text-white/70 font-medium mt-0.5 max-w-[180px] truncate">{currentUser.designation || currentUser.role}</p>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-md text-white/70 hover:text-rose-400 hover:bg-white/10 transition cursor-pointer ml-1"
                title={t('লগআউট', 'Sign Out')}
                aria-label={t('লগআউট', 'Sign Out')}
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Official Role-based Report & PDF Modal */}
      <OfficialReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </header>
  );
};
