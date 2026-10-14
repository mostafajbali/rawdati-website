import React, { useState } from 'react';
import { FirebaseUser } from '../lib/firebase.ts';
import { Language, translations } from '../i18n/translations.ts';
import { RawdatiLogo } from './RawdatiLogo.tsx';
import { AppIcon } from './AppIcon.tsx';
import { UserRole } from '../types.ts';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenFavorites: () => void;
  onOpenPrograms: () => void;
  onOpenReviews: () => void;
  favoritesCount: number;
  activeNav: string;
  onNavigate: (nav: string) => void;
  currentUser?: FirebaseUser | null;
  onLogout?: () => void;
  currentRole: UserRole;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onOpenRegister,
  onOpenLogin,
  onOpenFavorites,
  onOpenPrograms,
  onOpenReviews,
  favoritesCount,
  activeNav,
  onNavigate,
  currentUser,
  currentRole
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];
  const isAr = lang === 'ar';

  const navItems = [
    { id: 'home', label: t.home, action: () => onNavigate('home') },
    { id: 'explore', label: t.explore, action: () => onNavigate('explore') },
    { id: 'about', label: t.aboutUs, action: () => onNavigate('about') },
    { id: 'programs', label: t.programs, action: onOpenPrograms },
    { id: 'reviews', label: t.reviewsNav, action: onOpenReviews },
    { id: 'centers', label: t.forNurseries, action: onOpenRegister }
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_1px_10px_rgba(0,104,95,0.08)] border-b border-[#00685f]/10">
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-6 lg:gap-8 min-w-0">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 sm:gap-3 text-start group cursor-pointer shrink-0"
              aria-label={t.brandName}
            >
              {/* Transparent Cute Rawdati SVG Logo */}
              <RawdatiLogo size={36} className="w-9 h-9 sm:w-11 sm:h-11 shrink-0" />
              <div className="flex flex-col text-start leading-tight">
                <span className="text-sm sm:text-xl font-extrabold text-[#00685f] tracking-tight">
                  {t.brandName}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#3d4947] font-medium hidden xs:inline truncate max-w-[110px] sm:max-w-none">
                  {t.brandTagline}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      item.action();
                    }}
                    className={`transition-all duration-200 font-semibold text-sm px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#008378] text-white shadow-sm'
                        : 'text-[#3d4947] hover:text-[#0b1c30] hover:bg-[#dce9ff]/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action CTAs & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Switch Button */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white hover:bg-[#e5eeff] text-[#00685f] border border-[#e5eeff] shadow-2xs transition-all text-xs font-bold cursor-pointer active:scale-95 shrink-0"
              type="button"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <span>{t.langToggle}</span>
              <AppIcon name="language" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00685f]" />
            </button>

            {/* Favorites Icon Button */}
            <button
              onClick={onOpenFavorites}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#00685f] flex items-center justify-center transition-all cursor-pointer shrink-0"
              title={t.mobileFavorites}
              aria-label={t.mobileFavorites}
            >
              <AppIcon
                name="favorite"
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#00685f]"
                filled={favoritesCount > 0}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#fea619] text-[#684000] text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>


            {/* Register Nursery CTA Button (Desktop & Tablet) */}
            <button
              onClick={onOpenRegister}
              className="hidden md:inline-flex items-center justify-center bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-full transition-all duration-150 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              {t.registerNurseryCTA}
            </button>

            {/* User Login / Profile CTA */}
            {currentUser ? (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 sm:gap-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#00685f] font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 shrink-0"
                title={t.myAccount}
              >
                <span className="text-xs font-bold truncate max-w-[65px] sm:max-w-[110px]">
                  {currentUser.displayName?.split(' ')[0] || t.myAccount}
                </span>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || ''}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#00685f]/30"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-2xs">
                    {currentUser.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1 sm:gap-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#00685f] font-semibold text-xs sm:text-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 shrink-0"
              >
                <span className="hidden sm:inline text-xs sm:text-sm">{t.login}</span>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-2xs">
                  <AppIcon name="person" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#e5eeff] cursor-pointer shrink-0"
              aria-label="القائمة الرئيسية"
            >
              <AppIcon
                name={mobileMenuOpen ? 'close' : 'menu'}
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#0b1c30]"
              />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with full navigation actions */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e5eeff] bg-[#f8f9ff]/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(item.id);
                  item.action();
                }}
                className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                  activeNav === item.id
                    ? 'bg-[#008378] text-white shadow-xs'
                    : 'text-[#3d4947] hover:bg-[#eff4ff]'
                }`}
              >
                <span>{item.label}</span>
                <AppIcon
                  name={isAr ? "chevron_left" : "chevron_right"}
                  className="w-4 h-4 opacity-70"
                />
              </button>
            ))}
            <div className="pt-2 border-t border-[#e5eeff] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-2.5 rounded-xl bg-[#fea619] text-[#684000] font-bold text-sm text-center shadow-xs cursor-pointer active:scale-98 transition-transform"
              >
                {t.registerNurseryCTA}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
