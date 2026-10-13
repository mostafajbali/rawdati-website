import React from 'react';
import { FilterState } from '../types.ts';
import { AppIcon } from './AppIcon.tsx';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredCount: number;
  onReset: () => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  filteredCount,
  onReset
}) => {
  if (!isOpen) return null;

  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      const exists = arr.includes(item);
      const nextArr = exists ? arr.filter((i) => i !== item) : [...arr, item];
      return { ...prev, [key]: nextArr };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div
        className="w-full bg-white rounded-t-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300"
        dir="rtl"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <AppIcon name="tune" className="w-5 h-5 text-[#00685f]" />
            <h3 className="text-lg font-bold text-[#0b1c30]">تصفية الحضانات</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#3d4947] hover:text-[#0b1c30] cursor-pointer"
          >
            <AppIcon name="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Filter Options Content */}
        <div className="overflow-y-auto py-4 flex flex-col gap-5 no-scrollbar">
          {/* Price Max */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-[#0b1c30]">
              <span>الحد الأقصى للرسوم</span>
              <span className="text-[#00685f]">
                {filters.priceRange[1].toLocaleString()} ر.س / شهرياً
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)]
                }))
              }
              className="w-full accent-[#00685f]"
            />
          </div>

          {/* Age Category */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#0b1c30]">الفئة العمرية للطفل</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'infants', label: 'رضّع (من شهر إلى سنة)' },
                { id: 'toddlers', label: 'دارجون (1 - 3 سنوات)' },
                { id: 'preschool', label: 'تمهيدي (3 - 5 سنوات)' },
                { id: 'afterschool', label: 'رعاية بعد المدرسة' }
              ].map((item) => {
                const isChecked = filters.ageGroups.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl cursor-pointer text-xs font-medium transition-colors ${
                      isChecked
                        ? 'bg-[#00685f]/10 text-[#00685f] border border-[#00685f]/30'
                        : 'bg-[#eff4ff] text-[#0b1c30]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleArrayItem('ageGroups', item.id)}
                      className="w-4 h-4 accent-[#00685f] rounded"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Curriculums */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#0b1c30]">المنهج التعليمي</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'montessori', label: 'منهج منتسوري' },
                { id: 'bilingual', label: 'ثنائي اللغة' },
                { id: 'stem', label: 'أنشطة STEM' },
                { id: 'quran', label: 'تحفيظ القرآن' },
                { id: 'national', label: 'المنهج الوطني' }
              ].map((item) => {
                const isChecked = filters.curriculums.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleArrayItem('curriculums', item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#00685f] text-white shadow-xs'
                        : 'bg-[#eff4ff] text-[#3d4947]'
                    }`}
                  >
                    {isChecked && <AppIcon name="check" className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#0b1c30]">الخدمات والمزايا</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'cctv', label: 'كاميرات مراقبة للأهل' },
                { id: 'nurse', label: 'طاقم تمريض مقيم' },
                { id: 'organic_food', label: 'وجبات طازجة متكاملة' },
                { id: 'pool', label: 'مسبح ألعاب مائية' },
                { id: 'transport', label: 'نقل وتوصيل مدرسي' }
              ].map((item) => {
                const isChecked = filters.amenities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleArrayItem('amenities', item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#00685f] text-white shadow-xs'
                        : 'bg-[#eff4ff] text-[#3d4947]'
                    }`}
                  >
                    {isChecked && <AppIcon name="check" className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Action Buttons */}
        <div className="pt-3 mt-2 border-t border-[#e5eeff] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-[#00685f] hover:bg-[#008378] text-white text-sm font-bold shadow-md cursor-pointer active:scale-95 transition-all"
          >
            تطبيق النتائج ({filteredCount})
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-3 rounded-full bg-[#eff4ff] text-[#3d4947] hover:bg-[#e5eeff] text-xs font-bold cursor-pointer"
          >
            إعادة ضبط
          </button>
        </div>
      </div>
    </div>
  );
};
