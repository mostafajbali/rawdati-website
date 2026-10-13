import React from 'react';
import { Language, translations } from '../i18n/translations.ts';

interface ParentGuideBannerProps {
  onOpenConsultation: () => void;
  lang: Language;
}

export const ParentGuideBanner: React.FC<ParentGuideBannerProps> = ({
  onOpenConsultation,
  lang
}) => {
  const t = translations[lang];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="relative bg-gradient-to-r from-[#008378] to-[#00685f] rounded-3xl p-6 sm:p-8 lg:p-10 text-white overflow-hidden shadow-xl border border-white/10">
        {/* Soft Background Orb */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#71f8e4]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3 text-center md:text-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-[#89f5e7]">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>{t.advisorSupport}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              {t.confusedTitle}
            </h3>

            <p className="text-sm sm:text-base text-[#f4fffc] max-w-xl leading-relaxed">
              {t.confusedDesc}
            </p>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] rounded-2xl text-sm sm:text-base font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span>{t.bookFreeConsultation}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
