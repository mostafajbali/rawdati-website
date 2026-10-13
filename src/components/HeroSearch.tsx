import React from 'react';
import { FilterState } from '../types.ts';
import { Language, translations } from '../i18n/translations.ts';

interface HeroSearchProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearchSubmit: () => void;
  onOpenConsultation: () => void;
  lang: Language;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  setFilters,
  onSearchSubmit,
  onOpenConsultation,
  lang
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, city: e.target.value }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setFilters((prev) => ({ ...prev, maxBudget: val }));
  };

  const handleToggleTag = (tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      quickTag: prev.quickTag === tagId ? null : tagId
    }));
  };

  const popularTags = [
    { id: 'certified', label: t.tagCertified, icon: 'verified', color: 'secondary' },
    { id: 'infants', label: t.tagInfants, icon: 'child_care', color: 'primary' },
    { id: 'cctv', label: t.tagCctv, icon: 'videocam', color: 'primary' },
    { id: 'montessori', label: t.tagMontessori, icon: 'toys', color: 'secondary' },
    { id: 'extended_hours', label: t.tagExtendedHours, icon: 'bedtime', color: 'primary' }
  ];

  return (
    <section className="relative w-full overflow-hidden pb-12 pt-6 lg:pt-10 bg-gradient-to-b from-[#f8f9ff] via-[#eff4ff]/60 to-[#f8f9ff]">
      {/* Playful Ambient Soft Glows */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#89f5e7]/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-[#ffddb8]/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-9">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e5eeff] text-[#00685f] text-xs sm:text-sm font-semibold shadow-xs">
            <span
              className="material-symbols-outlined text-[18px] text-[#fea619]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span>{t.officialBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0b1c30] leading-tight sm:leading-snug">
            {t.heroTitlePrefix}
            <span className="text-[#00685f] relative inline-block">
              {t.heroTitleHighlight}
              <svg
                className="absolute -bottom-2 inset-x-0 w-full text-[#fea619]"
                fill="none"
                height="8"
                viewBox="0 0 120 8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6C35 2 85 2 118 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </span>
            {t.heroTitleSuffix}
          </h1>

          <p className="text-base sm:text-lg text-[#3d4947] max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Trust Highlights Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-xs text-[#0b1c30] border border-[#e5eeff]">
              <span className="w-7 h-7 rounded-full bg-[#00685f]/10 flex items-center justify-center text-[#00685f]">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  workspace_premium
                </span>
              </span>
              <span className="text-sm font-bold">{t.badgeCertified}</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-xs text-[#0b1c30] border border-[#e5eeff]">
              <span className="w-7 h-7 rounded-full bg-[#ffddb8]/60 flex items-center justify-center text-[#855300]">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  reviews
                </span>
              </span>
              <span className="text-sm font-bold">{t.badgeReviews}</span>
            </div>

            <button
              onClick={onOpenConsultation}
              className="flex items-center gap-2 bg-white hover:bg-[#eff4ff] px-4 py-1.5 rounded-full shadow-xs text-[#00685f] border border-[#e5eeff] transition-colors cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-[#71f8e4]/40 flex items-center justify-center text-[#00685f]">
                <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
              </span>
              <span className="text-sm font-bold">{t.badgeFreeTour}</span>
            </button>
          </div>
        </div>

        {/* Integrated Floating Search Bar (Card with Teal & Warm Honey Details) */}
        <div className="bg-white rounded-3xl shadow-[0_12px_36px_rgba(0,104,95,0.08)] p-4 sm:p-6 lg:p-7 border border-[#00685f]/10 transition-all">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            {/* Input 1: Keywords */}
            <div className="md:col-span-4 relative flex items-center">
              <div className={`absolute ${isAr ? 'right-4' : 'left-4'} text-[#00685f] pointer-events-none flex items-center`}>
                <span className="material-symbols-outlined text-[22px]">search</span>
              </div>
              <div className="w-full">
                <label className={`block text-xs font-semibold text-[#3d4947] ${isAr ? 'pr-12' : 'pl-12'} pb-1`}>
                  {t.searchKeywordLabel}
                </label>
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={handleKeywordChange}
                  placeholder={t.searchKeywordPlaceholder}
                  className={`w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] focus:bg-white focus:ring-2 focus:ring-[#00685f]/30 rounded-2xl text-sm text-[#0b1c30] placeholder:text-[#6d7a77] outline-none transition-all`}
                />
              </div>
            </div>

            {/* Input 2: City / District Dropdown */}
            <div className="md:col-span-3 relative flex items-center">
              <div className={`absolute ${isAr ? 'right-4' : 'left-4'} text-[#855300] pointer-events-none flex items-center`}>
                <span className="material-symbols-outlined text-[22px]">location_on</span>
              </div>
              <div className="w-full">
                <label className={`block text-xs font-semibold text-[#3d4947] ${isAr ? 'pr-12' : 'pl-12'} pb-1`}>
                  {t.searchCityLabel}
                </label>
                <div className="relative">
                  <select
                    value={filters.city}
                    onChange={handleCityChange}
                    className={`w-full ${isAr ? 'pr-12 pl-8' : 'pl-12 pr-8'} py-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] focus:bg-white focus:ring-2 focus:ring-[#00685f]/30 rounded-2xl text-sm text-[#0b1c30] outline-none appearance-none cursor-pointer transition-all`}
                  >
                    <option value="all">{t.searchCityAll}</option>
                    <option value="riyadh">{isAr ? 'الرياض (جميع الأحياء)' : 'Riyadh (All Districts)'}</option>
                    <option value="jeddah">{isAr ? 'جدة' : 'Jeddah'}</option>
                    <option value="dammam">{isAr ? 'الدمام' : 'Dammam'}</option>
                    <option value="khobar">{isAr ? 'الخبر' : 'Al Khobar'}</option>
                    <option value="makkah">{isAr ? 'مكة المكرمة' : 'Makkah'}</option>
                  </select>
                  <span className={`material-symbols-outlined absolute ${isAr ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[#6d7a77] pointer-events-none text-[18px]`}>
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Input 3: Max Monthly Budget */}
            <div className="md:col-span-3 relative flex items-center">
              <div className={`absolute ${isAr ? 'right-4' : 'left-4'} text-[#00685f] pointer-events-none flex items-center`}>
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <div className="w-full">
                <label className={`block text-xs font-semibold text-[#3d4947] ${isAr ? 'pr-12' : 'pl-12'} pb-1`}>
                  {t.searchBudgetLabel}
                </label>
                <div className="relative">
                  <select
                    value={filters.maxBudget}
                    onChange={handleBudgetChange}
                    className={`w-full ${isAr ? 'pr-12 pl-8' : 'pl-12 pr-8'} py-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] focus:bg-white focus:ring-2 focus:ring-[#00685f]/30 rounded-2xl text-sm text-[#0b1c30] outline-none appearance-none cursor-pointer transition-all`}
                  >
                    <option value="0">{t.searchBudgetNone}</option>
                    <option value="1500">{t.searchBudgetUpTo} 1,500 {t.perMonth}</option>
                    <option value="2000">{t.searchBudgetUpTo} 2,000 {t.perMonth}</option>
                    <option value="2500">{t.searchBudgetUpTo} 2,500 {t.perMonth}</option>
                    <option value="3500">{t.searchBudgetUpTo} 3,500 {t.perMonth}</option>
                    <option value="5000">{t.searchBudgetAbove} 3,500 {t.perMonth}</option>
                  </select>
                  <span className={`material-symbols-outlined absolute ${isAr ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[#6d7a77] pointer-events-none text-[18px]`}>
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Search CTA Button */}
            <div className="md:col-span-2 pt-2 md:pt-4">
              <button
                type="submit"
                className="w-full h-[46px] bg-[#00685f] hover:bg-[#008378] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>{t.searchSubmitBtn}</span>
                <span className="material-symbols-outlined text-[20px] rtl:-scale-x-100">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>

          {/* Quick filter chips underneath the bar */}
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-[#e5eeff]">
            <span className="text-xs font-bold text-[#3d4947] ml-1">{t.popularTagsLabel}</span>
            {popularTags.map((tag) => {
              const isSelected = filters.quickTag === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleToggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#008378] text-white shadow-xs'
                      : 'bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[15px] ${
                      isSelected ? 'text-white' : tag.color === 'secondary' ? 'text-[#fea619]' : 'text-[#00685f]'
                    }`}
                  >
                    {tag.icon}
                  </span>
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
