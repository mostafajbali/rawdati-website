import React from 'react';
import { Language } from '../i18n/translations.ts';

interface CommunityReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onExploreTopRated: () => void;
}

export const CommunityReviewsModal: React.FC<CommunityReviewsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onExploreTopRated
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const testimonials = [
    {
      name: isAr ? 'د. سارة الشهري - الرياض' : 'Dr. Sarah Al-Shehri - Riyadh',
      child: isAr ? 'والدة الطفل فيصل (سنتين)' : 'Mother of Faisal (2 years)',
      nursery: isAr ? 'حضانة عالم الصغار الإبداعية' : 'Creative Little World Nursery',
      rating: 5.0,
      avatar: 'س',
      storyAr: 'كنت قلقة جداً من ترك طفلي لأول مرة بسبب دوامي في المستشفى. المنصة ساعدتني في المقارنة وزيارة الحضانة مجاناً قبل دفع أي رسوم. الآن أتابع فيصل يومياً عبر البث المباشر وأنا في قمة الاطمئنان.',
      storyEn: 'I was nervous about leaving my toddler for the first time while working long hospital shifts. Rawdati helped me compare and take a free physical tour before any payment. Now I check live cameras daily with total reassurance.'
    },
    {
      name: isAr ? 'المهندس ريان السلمي - جدة' : 'Eng. Rayan Al-Sulami - Jeddah',
      child: isAr ? 'والد الطفلة ليان (10 أشهر)' : 'Father of Layan (10 months)',
      nursery: isAr ? 'حضانة خطواتي الأولى' : 'My First Steps Nursery',
      rating: 5.0,
      avatar: 'ر',
      storyAr: 'قسم الرضّع عندهم نموذجي. النظافة وطاقم التمريض المقيم أعطانا أماناً لا يقدر بثمن. تقارير الرضاعة والنوم تصلنا على التطبيق بدقة فائقة.',
      storyEn: 'Their infant ward is world-class. The hygienic standards and resident nursing team gave us priceless peace of mind. Daily sleep and feeding reports are delivered accurately to our phones.'
    },
    {
      name: isAr ? 'أفنان الدوسري - الخبر' : 'Afnan Al-Dossary - Khobar',
      child: isAr ? 'والدة الطفل تميم (3 سنوات ونصف)' : 'Mother of Tameem (3.5 years)',
      nursery: isAr ? 'روضة أزهار الغد النموذجية' : 'Azhar Al-Ghad Model Preschool',
      rating: 4.9,
      avatar: 'أ',
      storyAr: 'منهج الـ STEM واللغات أحدث نقلة نوعية في شخصية تميم وطلاقة كلامه وثقته بنفسه. الحديقة الخارجية ووجباتهم العضوية ممتازة جداً.',
      storyEn: 'The STEM and bilingual immersion triggered a remarkable leap in Tameem’s confidence, speech fluency, and curiosity. Their outdoor garden and organic meals are outstanding.'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#e5eeff]">
        {/* Header */}
        <div className="bg-[#fea619] p-5 sm:p-6 text-[#684000] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#684000]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">reviews</span>
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold">
                {isAr ? 'تجارب وقصص نجاح أولياء الأمور' : 'Parent Stories & Experiences'}
              </h3>
              <p className="text-xs text-[#684000]/80">
                {isAr
                  ? 'شهادات حقيقية من أمهات وآباء اختاروا بيئة أطفالهم عبر روضتي'
                  : 'Authentic testimonials from families who found their nursery on Rawdati'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#eff4ff] rounded-2xl text-center">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-[#00685f]">98.6%</span>
              <span className="text-[11px] text-[#6d7a77] block">
                {isAr ? 'نسبة رضا الأهالي' : 'Parent Satisfaction'}
              </span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-[#00685f]">+12,000</span>
              <span className="text-[11px] text-[#6d7a77] block">
                {isAr ? 'جولة مجانية محجوزة' : 'Tours Booked'}
              </span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-[#00685f]">4.9 / 5</span>
              <span className="text-[11px] text-[#6d7a77] block">
                {isAr ? 'متوسط تقييم المراكز' : 'Average Nursery Rating'}
              </span>
            </div>
          </div>

          {/* Testimonials Cards */}
          <div className="space-y-3.5">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0b1c30]">{t.name}</h4>
                      <p className="text-[11px] text-[#6d7a77]">
                        {t.child} · <strong className="text-[#00685f]">{t.nursery}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex text-[#fea619]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-[15px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#3d4947] leading-relaxed">
                  "{isAr ? t.storyAr : t.storyEn}"
                </p>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => {
                onClose();
                onExploreTopRated();
              }}
              className="px-6 py-3 rounded-2xl bg-[#00685f] hover:bg-[#008378] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer active:scale-95 transition-all"
            >
              {isAr ? 'استعراض الحضانات الأعلى تقييماً الآن' : 'Explore Top-Rated Nurseries Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
