import React, { useState } from 'react';
import { Nursery } from '../types.ts';
import { NurseryReviewsSection } from './NurseryReviewsSection.tsx';
import { AppIcon } from './AppIcon.tsx';

interface NurseryDetailsModalProps {
  nursery: Nursery | null;
  isOpen: boolean;
  onClose: () => void;
  onBookTour: (nursery: Nursery) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export const NurseryDetailsModal: React.FC<NurseryDetailsModalProps> = ({
  nursery,
  isOpen,
  onClose,
  onBookTour,
  isFavorite,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'curriculum' | 'safety' | 'reviews'>('about');

  if (!isOpen || !nursery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#e5eeff]">
        {/* Header Media */}
        <div className="relative h-60 sm:h-72 w-full bg-[#e5eeff] shrink-0">
          <img
            src={nursery.image}
            alt={nursery.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Action buttons on top of image */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#0b1c30] hover:bg-white cursor-pointer shadow-sm"
            >
              <AppIcon name="close" className="w-5 h-5 text-[#0b1c30]" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(nursery.id)}
                className={`w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-sm transition-transform active:scale-90 ${
                  isFavorite ? 'text-[#ba1a1a]' : 'text-[#3d4947]'
                }`}
              >
                <AppIcon
                  name="favorite"
                  className={`w-5 h-5 ${isFavorite ? 'text-[#ba1a1a]' : 'text-[#3d4947]'}`}
                  filled={isFavorite}
                />
              </button>
              {nursery.badge && (
                <span className="px-3 py-1 rounded-full bg-[#fea619] text-[#684000] text-xs font-bold shadow-sm">
                  {nursery.badge.text}
                </span>
              )}
            </div>
          </div>

          {/* Title & Info on image bottom */}
          <div className="absolute bottom-4 right-4 left-4 text-white z-10 space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-[#00685f] text-white font-bold flex items-center gap-1 text-[11px]">
                <AppIcon name="verified" className="w-3.5 h-3.5 text-white" filled />
                <span>مرخصة رسمياً: {nursery.licenseNumber || 'MOE-KSA-9901'}</span>
              </span>
              <span className="text-[#ffddb8] flex items-center gap-1 font-bold">
                <AppIcon name="star" className="w-4 h-4 text-[#fea619]" filled />
                <span>{nursery.rating.toFixed(1)}</span>
                <span className="text-white/80 text-[11px]">({nursery.reviewsCount} تقييم موثق)</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">{nursery.name}</h2>
            <p className="text-xs text-white/90 flex items-center gap-1">
              <AppIcon name="location_on" className="w-4 h-4 text-white" />
              <span>{nursery.cityName} - {nursery.district} · {nursery.address || 'المملكة العربية السعودية'}</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e5eeff] bg-[#eff4ff]/60 px-4 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'about', label: 'نبذة عن الحضانة', icon: 'info' },
            { id: 'curriculum', label: 'المناهج والأنشطة', icon: 'school' },
            { id: 'safety', label: 'السلامة والبيئة الصحية', icon: 'verified_user' },
            { id: 'reviews', label: `التقييمات (${nursery.reviewsCount})`, icon: 'rate_review' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 px-4 font-bold text-xs whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#00685f] text-[#00685f] bg-white'
                  : 'border-transparent text-[#6d7a77] hover:text-[#0b1c30]'
              }`}
            >
              <AppIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30] mb-1.5">الرسالة والرؤية التربوية</h4>
                <p className="text-xs sm:text-sm text-[#3d4947] leading-relaxed">
                  {nursery.description}
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#eff4ff] p-3 rounded-2xl">
                  <span className="text-[11px] text-[#6d7a77] block">نسبة المعلمات للأطفال</span>
                  <span className="text-xs font-bold text-[#00685f]">{nursery.teacherChildRatio || '1 لكل 4'}</span>
                </div>
                <div className="bg-[#eff4ff] p-3 rounded-2xl">
                  <span className="text-[11px] text-[#6d7a77] block">الطاقة الاستيعابية</span>
                  <span className="text-xs font-bold text-[#00685f]">{nursery.capacity || 60} طفل كحد أقصى</span>
                </div>
                <div className="bg-[#eff4ff] p-3 rounded-2xl">
                  <span className="text-[11px] text-[#6d7a77] block">ساعات العمل</span>
                  <span className="text-xs font-bold text-[#00685f]">07:00 ص - 05:00 م</span>
                </div>
                <div className="bg-[#eff4ff] p-3 rounded-2xl">
                  <span className="text-[11px] text-[#6d7a77] block">الفئة المقبولة</span>
                  <span className="text-xs font-bold text-[#00685f]">من شهر إلى 5 سنوات</span>
                </div>
              </div>

              {/* Tags & Amenities List */}
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30] mb-2">المزايا المعتمدة في المركز</h4>
                <div className="flex flex-wrap gap-2">
                  {nursery.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#00685f]/10 text-[#00685f] text-xs font-bold flex items-center gap-1"
                    >
                      <AppIcon name="check_circle" className="w-3.5 h-3.5 text-[#00685f]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  <span className="px-3 py-1 rounded-full bg-[#00685f]/10 text-[#00685f] text-xs font-bold flex items-center gap-1">
                    <AppIcon name="check_circle" className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>تأمين صحي وإسعافات فورية</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#00685f]/10 text-[#00685f] text-xs font-bold flex items-center gap-1">
                    <AppIcon name="check_circle" className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>تقارير يومية عن نوم وغذاء الطفل</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#0b1c30]">الجدول اليومي والبرنامج التربوي</h4>
              <div className="space-y-2.5">
                {[
                  { time: '07:00 - 08:30 ص', title: 'الاستقبال الصباحي وأنشطة التحفيز الحر الهادئة', tag: 'استقبال' },
                  { time: '08:30 - 09:30 ص', title: 'وجبة الإفطار الصحية وتدريب العادات الاستقلالية', tag: 'تغذية' },
                  { time: '09:30 - 11:00 ص', title: 'حلقات منتسوري، الاستكشاف الحسي والأنشطة اللغوية', tag: 'تعليم تفاعلي' },
                  { time: '11:00 - 12:00 م', title: 'اللعب الحركي في الساحات الخارجية المظللة', tag: 'رياضة ولعب' },
                  { time: '12:00 - 01:30 م', title: 'وجبة الغداء ثم وقت القيلولة والراحة الهادئة', tag: 'راحة ونوم' },
                  { time: '01:30 - 03:00 م', title: 'قصص تفاعلية، فنون، وألعاب تركيب STEM', tag: 'إبداع' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-[#eff4ff]">
                    <span className="bg-[#00685f] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0">
                      {item.time}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[#0b1c30] block">{item.title}</span>
                      <span className="text-[11px] text-[#6d7a77]">{item.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#0b1c30]">إجراءات الأمان والصحة المعتمدة</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#00685f]/15 text-[#00685f] flex items-center justify-center shrink-0">
                    <AppIcon name="videocam" className="w-4 h-4 text-[#00685f]" />
                  </span>
                  <div>
                    <span className="text-xs font-bold block text-[#0b1c30]">بث مباشر مشفر 24/7 للأمهات</span>
                    <span className="text-[11px] text-[#6d7a77]">تطبيق خاص للأم لمشاهدة طفلها بأمان تام طوال اليوم</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#fea619]/20 text-[#855300] flex items-center justify-center shrink-0">
                    <AppIcon name="medical_services" className="w-4 h-4 text-[#855300]" />
                  </span>
                  <div>
                    <span className="text-xs font-bold block text-[#0b1c30]">عيادة تمريض مقيمة</span>
                    <span className="text-[11px] text-[#6d7a77]">فحص حرارة يومي ومتابعة حالات التحسس والعلاج</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#00685f]/15 text-[#00685f] flex items-center justify-center shrink-0">
                    <AppIcon name="door_sliding" className="w-4 h-4 text-[#00685f]" />
                  </span>
                  <div>
                    <span className="text-xs font-bold block text-[#0b1c30]">أبواب أمان ذكية بالبصمة</span>
                    <span className="text-[11px] text-[#6d7a77]">لا يُسمح بالاستلام إلا للأشخاص المفوضين من ولي الأمر</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#fea619]/20 text-[#855300] flex items-center justify-center shrink-0">
                    <AppIcon name="restaurant" className="w-4 h-4 text-[#855300]" />
                  </span>
                  <div>
                    <span className="text-xs font-bold block text-[#0b1c30]">مطابخ معتمدة ووجبات طازجة</span>
                    <span className="text-[11px] text-[#6d7a77]">خالية من السكريات المصنعة مع مراعاة الحساسيات</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <NurseryReviewsSection nursery={nursery} />
          )}
        </div>

        {/* Footer Bar with Price and Booking CTA */}
        <div className="p-4 sm:p-5 border-t border-[#e5eeff] bg-[#f8f9ff] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-xs text-[#6d7a77] block">الرسوم الشهرية المقدرة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#00685f]">{nursery.price.toLocaleString()}</span>
              <span className="text-xs text-[#0b1c30]">ر.س / شهرياً</span>
              <span className="text-[11px] text-[#6d7a77] mr-1">(شامل الأنشطة والوجبات)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`https://wa.me/${nursery.whatsapp || '966501234567'}?text=${encodeURIComponent(`السلام عليكم، أود الاستفسار عن التسجيل في ${nursery.name} عبر منصة روضتي`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#00685f] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <AppIcon name="chat" className="w-4 h-4 text-[#00685f]" />
              <span>محادثة واتساب</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onBookTour(nursery);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] text-sm font-bold shadow-md cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <AppIcon name="calendar_month" className="w-4 h-4 text-[#684000]" />
              <span>حجز جولة تعريفية مجانية</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
