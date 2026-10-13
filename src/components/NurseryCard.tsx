import React from 'react';
import { Nursery } from '../types.ts';
import { Language, translations } from '../i18n/translations.ts';

interface NurseryCardProps {
  nursery: Nursery;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelect: (nursery: Nursery) => void;
  onBookTour: (nursery: Nursery) => void;
  lang: Language;
}

export const NurseryCard: React.FC<NurseryCardProps> = ({
  nursery,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onBookTour,
  lang
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const getBadgeIcon = (type?: string) => {
    switch (type) {
      case 'gold':
        return 'stars';
      case 'trending':
        return 'trending_up';
      case 'discount':
        return 'local_offer';
      case 'new':
        return 'new_releases';
      case 'exclusive':
        return 'military_tech';
      default:
        return 'verified';
    }
  };

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group border border-[#e5eeff]">
      {/* Card Image Box */}
      <div className="relative w-full h-52 overflow-hidden bg-[#e5eeff] cursor-pointer" onClick={() => onSelect(nursery)}>
        <img
          src={nursery.image}
          alt={nursery.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status / Category Ribbon Badge */}
        {nursery.badge && (
          <div className="absolute top-3 right-3 bg-[#fea619] text-[#684000] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {getBadgeIcon(nursery.badge.type)}
            </span>
            <span>{nursery.badge.text}</span>
          </div>
        )}

        {/* Bookmark Favorite Button */}
        <button
          type="button"
          aria-label={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(nursery.id);
          }}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#0b1c30] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10 active:scale-90"
        >
          <span
            className={`material-symbols-outlined text-[20px] ${isFavorite ? 'text-[#ba1a1a]' : 'text-[#3d4947]'}`}
            style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Rating Pill */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs">
          <span
            className="material-symbols-outlined text-[#fea619] text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-xs font-bold text-[#0b1c30]">{nursery.rating.toFixed(1)}</span>
          <span className="text-[11px] text-[#6d7a77]">({nursery.reviewsCount})</span>
        </div>

        {/* Distance Indicator */}
        <div className="absolute bottom-3 left-3 bg-black/45 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg text-[11px] font-medium">
          {nursery.distance}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2">
          <button
            onClick={() => onSelect(nursery)}
            className="text-start w-full group/title cursor-pointer"
          >
            <h3 className="text-base sm:text-lg font-bold text-[#0b1c30] group-hover/title:text-[#00685f] transition-colors leading-snug">
              {nursery.name}
            </h3>
          </button>

          <div className="flex items-center gap-1 text-[#6d7a77] text-xs">
            <span className="material-symbols-outlined text-[#00685f] text-[16px]">location_on</span>
            <span>
              {nursery.cityName}، {nursery.district} ({t.kmAway} {nursery.distance})
            </span>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {nursery.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#00685f] text-[11px] font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#6d7a77] block">{t.estimatedTuition}</span>
            <div className="flex items-baseline gap-1">
              {nursery.originalPrice && (
                <span className="text-xs text-[#6d7a77] line-through">
                  {nursery.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-base sm:text-lg font-bold text-[#00685f]">
                {nursery.price.toLocaleString()}
              </span>
              <span className="text-xs text-[#0b1c30]">{t.perMonth}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookTour(nursery)}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] text-xs sm:text-sm rounded-2xl transition-all shadow-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
          >
            <span>{t.bookTourBtn}</span>
            <span className="material-symbols-outlined text-[16px] rtl:-scale-x-100">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
