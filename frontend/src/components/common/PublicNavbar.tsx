import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogIn,
  Sun,
  Moon,
  ArrowRight,
  Code,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const { setDevDemoDrawerOpen } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('মূল পাতা', 'Overview'), path: '/', num: '01' },
    { label: t('সমস্যা জানান', 'Report Issue'), path: '/report', num: '02' },
    { label: t('নগর মানচিত্র', 'City Map'), path: '/map', num: '03' },
    { label: t('সেবা নির্দেশিকা', 'Services Charter'), path: '/services', num: '04' },
    { label: t('নাগরিক স্বচ্ছতা', 'Transparency'), path: '/transparency', num: '05' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 border-b border-white/15 shadow-lg ${isScrolled ? 'py-2' : 'py-2.5'
          }`}
        style={{
          background: `linear-gradient(105deg, rgba(7, 25, 43, 0.94) 0%, rgba(8, 44, 59, 0.88) 48%, rgba(7, 37, 48, 0.80) 100%), url('/images/hero_civic_fullpage.webp') center top / cover no-repeat`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#ffffff',
        }}
      >
        <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center group cursor-pointer" aria-label="Nagorik Sathi Home">
            <img
              src="/images/nagorik-sathi-logo-dark.png"
              alt="নাগরিক সাথী"
              className="h-11 w-auto max-w-[200px] object-contain sm:h-14 sm:max-w-[240px]"
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold tracking-wide transition-all relative py-1.5 ${isActive
                    ? 'text-emerald-300 font-bold'
                    : 'text-white/80 hover:text-white'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-cyan-300 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-white/20 bg-white/10 p-0.5 text-[11px] backdrop-blur-md">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${language === 'bn'
                  ? 'bg-emerald-400 text-teal-950 shadow-xs'
                  : 'text-white/80 hover:text-white'
                  }`}
              >
                BN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${language === 'en'
                  ? 'bg-emerald-400 text-teal-950 shadow-xs'
                  : 'text-white/80 hover:text-white'
                  }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle (Dark / Light) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-white/20 bg-white/10 text-white/85 hover:bg-white/20 hover:text-white transition cursor-pointer backdrop-blur-md"
              aria-label={t('থিম পরিবর্তন করুন', 'Toggle Theme')}
              title={t('থিম পরিবর্তন করুন', 'Toggle Theme')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-200" aria-hidden="true" />
              )}
            </button>

            {/* Role Switcher Trigger */}
            <button
              type="button"
              onClick={() => setDevDemoDrawerOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition cursor-pointer shadow-xs backdrop-blur-md"
              title={t('সকল রোল ওয়ার্কস্পেস', 'Explore all 6 Roles')}
            >
              <Code className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>{t('রোল', 'Role')}</span>
            </button>

            {/* Login / Portal Entry Button */}
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-3.5 py-1.5 text-xs font-bold text-teal-950 shadow-md transition hover:brightness-110"
            >
              <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('লগইন পোর্টাল', 'Login Portal')}</span>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#092237]/98 text-white flex flex-col p-6 overflow-y-auto backdrop-blur-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <span className="text-xs font-extrabold tracking-wider uppercase text-emerald-300">
              NAGORIK SATHI
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="মেনু বন্ধ করুন"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="my-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-white/10 text-base font-medium text-white hover:text-emerald-300 transition"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/50">{link.num}</span>
                  <span>{link.label}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-white/50" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setDevDemoDrawerOpen(true);
              }}
              className="flex-1 py-2.5 rounded-xl border border-white/20 bg-white/10 text-xs font-bold text-white text-center hover:bg-white/20 transition"
            >
              {t('রোল', 'Role')}
            </button>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-teal-950 text-xs font-bold text-center hover:brightness-110 transition"
            >
              {t('লগইন পোর্টাল', 'Login Portal')}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
