import React from 'react';
import { Nursery } from '../types.ts';
import { AppIcon } from './AppIcon.tsx';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Nursery[];
  onRemoveFavorite: (id: number) => void;
  onSelectNursery: (nursery: Nursery) => void;
  onBookTour: (nursery: Nursery) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectNursery,
  onBookTour
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-[#e5eeff]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <AppIcon name="favorite" className="w-5 h-5 text-[#ba1a1a]" filled />
            <h3 className="font-bold text-base text-[#0b1c30]">قائمتي المفضلة ({favorites.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#3d4947] hover:text-[#0b1c30] cursor-pointer"
          >
            <AppIcon name="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-[#6d7a77] space-y-2">
              <AppIcon name="favorite" className="w-12 h-12 text-[#bcc9c6] mx-auto" />
              <p className="text-sm font-bold text-[#0b1c30]">لم تقومي بإضافة أي حضانات للمفضلة بعد</p>
              <p className="text-xs text-[#6d7a77] max-w-xs mx-auto">
                اضغطي على أيقونة القلب على أي بطاقة حضانة لحفظها هنا ومقارنتها لاحقاً بكل سهولة.
              </p>
            </div>
          ) : (
            favorites.map((nursery) => (
              <div
                key={nursery.id}
                className="p-3.5 rounded-2xl border border-[#e5eeff] hover:border-[#00685f]/40 transition-all flex items-center gap-3 bg-[#f8f9ff]"
              >
                <img
                  src={nursery.image}
                  alt={nursery.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectNursery(nursery);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      onClose();
                      onSelectNursery(nursery);
                    }}
                    className="text-xs sm:text-sm font-bold text-[#0b1c30] truncate hover:text-[#00685f] cursor-pointer"
                  >
                    {nursery.name}
                  </h4>
                  <p className="text-[11px] text-[#6d7a77] truncate">
                    {nursery.cityName}، {nursery.district} · {nursery.price.toLocaleString()} ر.س/شهر
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onBookTour(nursery);
                      }}
                      className="px-2.5 py-1 bg-[#fea619] text-[#684000] text-[10px] font-bold rounded-lg shadow-xs cursor-pointer"
                    >
                      حجز جولة
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(nursery.id)}
                      className="text-[11px] text-[#ba1a1a] hover:underline cursor-pointer"
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
