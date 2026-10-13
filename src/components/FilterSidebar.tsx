import React from 'react';
import { FilterState } from '../types.ts';
import { Language, translations } from '../i18n/translations.ts';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
  onApply?: () => void;
  lang: Language;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  filteredCount,
  onReset,
  onApply,
  lang
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      const exists = arr.includes(item);
      const nextArr = exists ? arr.filter((i) => i !== item) : [...arr, item];
      return { ...prev, [key]: nextArr };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], val]
    }));
  };

  return (
    <aside className="sticky top-24 bg-white rounded-3xl p-5 lg:p-6 shadow-sm border border-[#e5eeff] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00685f] text-[24px]">tune</span>
          <span className="text-lg font-bold text-[#0b1c30]">{t.filterTitle}</span>
        </div>
        <button
          onClick={onReset}
          className="text-[#00685f] hover:text-[#008378] text-xs font-bold transition-colors cursor-pointer"
          type="button"
        >
          {t.filterReset}
        </button>
      </div>

      {/* Filter 1: Dual Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#0b1c30]">{t.monthlyBudgetRange}</label>
          <span className="text-xs font-bold text-[#00685f]">
            {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
          </span>
        </div>

        {/* Range Slider */}
        <div className="relative pt-2">
          <input
            type="range"
            min="1000"
            max="5000"
            step="100"
            value={filters.priceRange[1]}
            onChange={handlePriceChange}
            className="w-full accent-[#00685f] cursor-pointer"
          />
          <div className="flex items-center justify-between pt-2">
            <span className="bg-[#eff4ff] px-3 py-1 rounded-xl text-xs font-bold text-[#3d4947]">
              1,000 {isAr ? 'ر.س' : 'SAR'}
            </span>
            <span className="text-[#6d7a77] text-xs">-</span>
            <span className="bg-[#eff4ff] px-3 py-1 rounded-xl text-xs font-bold text-[#3d4947]">
              {filters.priceRange[1].toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter 2: Star Ratings */}
      <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
        <label className="text-sm font-bold text-[#0b1c30]">{t.starRatings}</label>
        <div className="space-y-2 pt-1">
          {[
            { rating: 5, label: t.fiveStars, count: '38' },
            { rating: 4, label: t.fourPlusStars, count: '86' },
            { rating: 3, label: t.threePlusStars, count: '24' }
          ].map((item) => (
            <label key={item.rating} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.minRating === item.rating}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: prev.minRating === item.rating ? null : item.rating
                  }))
                }
                className="w-4 h-4 rounded text-[#00685f] focus:ring-0 accent-[#00685f] cursor-pointer"
              />
              <span className="flex-1 flex items-center gap-1.5 text-xs text-[#0b1c30] group-hover:text-[#00685f] transition-colors">
                <span
                  className="text-[#fea619] material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-bold">{item.label}</span>
                <span className="text-[#6d7a77] ml-auto mr-auto">({item.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter 3: Age Groups */}
      <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
        <label className="text-sm font-bold text-[#0b1c30]">{t.ageGroupTitle}</label>
        <div className="space-y-2 pt-1">
          {[
            { id: 'infants', label: t.infantsAge },
            { id: 'toddlers', label: t.toddlersAge },
            { id: 'preschool', label: t.preschoolAge },
            { id: 'afterschool', label: t.afterschoolAge }
          ].map((item) => {
            const isChecked = filters.ageGroups.includes(item.id);
            return (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('ageGroups', item.id)}
                  className="w-4 h-4 rounded text-[#00685f] focus:ring-0 accent-[#00685f] cursor-pointer"
                />
                <span className="text-xs text-[#0b1c30] group-hover:text-[#00685f] transition-colors">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Filter 4: Educational Curriculums */}
      <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
        <label className="text-sm font-bold text-[#0b1c30]">{t.curriculumTitle}</label>
        <div className="space-y-2 pt-1">
          {[
            { id: 'national', label: t.curriculumNational },
            { id: 'montessori', label: t.curriculumMontessori },
            { id: 'bilingual', label: t.curriculumBilingual },
            { id: 'reggio', label: t.curriculumReggio },
            { id: 'quran', label: t.curriculumQuran }
          ].map((item) => {
            const isChecked = filters.curriculums.includes(item.id);
            return (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('curriculums', item.id)}
                  className="w-4 h-4 rounded text-[#00685f] focus:ring-0 accent-[#00685f] cursor-pointer"
                />
                <span className="text-xs text-[#0b1c30] group-hover:text-[#00685f] transition-colors">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Filter 5: Amenities & Facilities */}
      <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
        <label className="text-sm font-bold text-[#0b1c30]">{t.amenitiesTitle}</label>
        <div className="space-y-2 pt-1">
          {[
            { id: 'cctv', label: t.amenityCctv },
            { id: 'organic_food', label: t.amenityFood },
            { id: 'pool', label: t.amenityPool },
            { id: 'nurse', label: t.amenityNurse },
            { id: 'transport', label: t.amenityTransport }
          ].map((item) => {
            const isChecked = filters.amenities.includes(item.id);
            return (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('amenities', item.id)}
                  className="w-4 h-4 rounded text-[#00685f] focus:ring-0 accent-[#00685f] cursor-pointer"
                />
                <span className="text-xs text-[#0b1c30] group-hover:text-[#00685f] transition-colors">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Filter 6: Operating Hours */}
      <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
        <label className="text-sm font-bold text-[#0b1c30]">{t.operatingHoursTitle}</label>
        <div className="space-y-2 pt-1">
          {[
            { id: 'morning', label: t.hoursMorning },
            { id: 'extended', label: t.hoursExtended },
            { id: 'weekend', label: t.hoursWeekend }
          ].map((item) => {
            const isChecked = filters.operatingHours.includes(item.id);
            return (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('operatingHours', item.id)}
                  className="w-4 h-4 rounded text-[#00685f] focus:ring-0 accent-[#00685f] cursor-pointer"
                />
                <span className="text-xs text-[#0b1c30] group-hover:text-[#00685f] transition-colors">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Apply CTA Button */}
      <button
        type="button"
        onClick={onApply}
        className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        <span className="material-symbols-outlined text-[18px]">filter_alt</span>
        <span>
          {t.applyFilterBtn} ({filteredCount})
        </span>
      </button>
    </aside>
  );
};
