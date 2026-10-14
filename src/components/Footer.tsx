import React from 'react';
import { Language, translations } from '../i18n/translations.ts';
import { RawdatiLogo } from './RawdatiLogo.tsx';
import { AppIcon } from './AppIcon.tsx';
import { NurseryQuickContactForm } from './NurseryQuickContactForm.tsx';

interface FooterProps {
  onOpenRegister: () => void;
  onNavigate: (path: string) => void;
  onOpenPrograms?: () => void;
  onOpenReviews?: () => void;
  onOpenAdmin?: () => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegister,
  onNavigate,
  onOpenPrograms,
  onOpenReviews,
  onOpenAdmin,
  lang
}) => {
  const t = translations[lang];

  return (
    <footer className="w-full bg-[#eff4ff] text-[#3d4947] pt-12 pb-24 lg:pb-12 border-t border-[#00685f]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Quick Contact Form for Nursery Owners */}
        <section id="nursery-quick-contact" aria-label={t.quickContactTitle}>
          <NurseryQuickContactForm lang={lang} />
        </section>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-4 pt-4 border-t border-[#00685f]/10">
          {/* Column 1: Brand & About */}
          <div className="space-y-3.5 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <RawdatiLogo size={36} />
              <span className="text-xl font-bold text-[#00685f]">{t.brandName}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#3d4947] leading-relaxed">
              {t.footerBrandDesc}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="#share"
                aria-label="share"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00685f] hover:bg-[#00685f] hover:text-white transition-colors shadow-xs"
              >
                <AppIcon name="share" className="w-4 h-4" />
              </a>
              <a
                href="#chat"
                aria-label="chat"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00685f] hover:bg-[#00685f] hover:text-white transition-colors shadow-xs"
              >
                <AppIcon name="forum" className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@rawdati.sa"
                aria-label="mail"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00685f] hover:bg-[#00685f] hover:text-white transition-colors shadow-xs"
              >
                <AppIcon name="mail" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0b1c30]">{t.quickLinks}</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.explore}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPrograms ? onOpenPrograms() : onNavigate('programs')}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.programs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start font-semibold text-[#00685f]"
                >
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenReviews ? onOpenReviews() : onNavigate('reviews')}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.reviewsNav}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: For Nurseries */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0b1c30]">{t.forCenters}</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#nursery-quick-contact"
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start font-bold text-[#00685f] flex items-center gap-1.5"
                >
                  <AppIcon name="forum" className="w-3.5 h-3.5" />
                  <span>{t.quickContactTitle}</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.joinAsPartner}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.dashboard}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.officialStandards}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-[#00685f] transition-colors cursor-pointer text-start"
                >
                  {t.adPackages}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0b1c30]">{t.contactAndSupport}</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <AppIcon name="call" className="w-4 h-4 text-[#00685f]" />
                <span className="font-mono">800-RAWDA-00</span>
              </li>
              <li className="flex items-center gap-2">
                <AppIcon name="mail" className="w-4 h-4 text-[#00685f]" />
                <span>support@rawdati.sa</span>
              </li>
              <li className="flex items-center gap-2">
                <AppIcon name="location_on" className="w-4 h-4 text-[#00685f]" />
                <span>{lang === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}</span>
              </li>
              {onOpenAdmin && (
                <li className="pt-2 border-t border-[#00685f]/15">
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#00685f] hover:text-[#008378] font-bold transition-colors cursor-pointer text-start flex items-center gap-1.5"
                  >
                    <AppIcon name="admin_panel_settings" className="w-4 h-4 text-[#00685f]" />
                    <span>{lang === 'ar' ? 'صفحة المشرف المستقلة (Admin Portal)' : 'Admin Portal'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Demo Project Notice */}
        <div className="bg-[#00685f]/5 border border-[#00685f]/15 rounded-2xl p-3 text-center">
          <p className="text-xs font-semibold text-[#00685f]">
            ℹ️ {t.demoNote}
          </p>
        </div>

        {/* Sub-footer Copyright */}
        <div className="pt-6 border-t border-[#bcc9c6]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
          <p className="text-xs text-[#6d7a77]">
            {t.allRightsReserved}
          </p>
          <div className="flex items-center gap-4 text-xs text-[#6d7a77]">
            <a href="#privacy" className="hover:text-[#00685f] transition-colors">
              {t.privacyPolicy}
            </a>
            <a href="#terms" className="hover:text-[#00685f] transition-colors">
              {t.termsConditions}
            </a>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hover:text-[#00685f] text-slate-500 font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <AppIcon name="lock" className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'ar' ? 'بوابة الإدارة' : 'Admin'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
