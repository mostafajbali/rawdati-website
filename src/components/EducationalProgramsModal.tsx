import React from 'react';
import { Language, translations } from '../i18n/translations.ts';

interface EducationalProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectCurriculum: (curriculumId: string) => void;
}

export const EducationalProgramsModal: React.FC<EducationalProgramsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectCurriculum
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const programs = [
    {
      id: 'montessori',
      icon: 'psychology',
      titleAr: 'منهج منتسوري (Montessori)',
      titleEn: 'Montessori Method',
      tagAr: 'الأكثر طلباً للأعمار المبكرة',
      tagEn: 'Most Popular for Early Ages',
      descAr: 'يركز على استقلالية الطفل وتنمية قدراته الحسية والحركية من خلال أدوات تعليمية خشبية وتوجيه غير مباشر يشجع الاستكشاف الذاتي.',
      descEn: 'Focuses on child independence, sensory and motor skill development through self-correcting wooden tools and child-led discovery.',
      ageAr: 'من 6 أشهر حتى 6 سنوات',
      ageEn: '6 months to 6 years',
      benefitsAr: ['بناء الاعتماد على النفس', 'تطوير التركيز والصبر', 'تنمية المهارات الحركية الدقيقة'],
      benefitsEn: ['Fosters self-reliance', 'Enhances patience and focus', 'Develops fine motor skills']
    },
    {
      id: 'bilingual',
      icon: 'translate',
      titleAr: 'المنهج ثنائي اللغة (عربي / إنجليزي)',
      titleEn: 'Bilingual Immersion (Arabic / English)',
      tagAr: 'تأسيس لغوي متكامل',
      tagEn: 'Integrated Language Immersion',
      descAr: 'دمج طبيعي للغتين الإنجليزية والعربية في الروتين اليومي والقصص والأنشطة والأناشيد، مما يمنح الطفل مرونة عقلية وطلاقة مبكرة.',
      descEn: 'Natural immersion in English and Arabic through daily routines, story-time, and songs for early mental flexibility and fluency.',
      ageAr: 'من سنة حتى 5 سنوات',
      ageEn: '1 to 5 years',
      benefitsAr: ['اكتساب اللغات بدون مجهود', 'نطق سليم للمفردات', 'توسيع آفاق الطفل الثقافية'],
      benefitsEn: ['Effortless language acquisition', 'Clear pronunciation', 'Broad cultural horizons']
    },
    {
      id: 'stem',
      icon: 'science',
      titleAr: 'أنشطة STEM واستكشاف العلوم',
      titleEn: 'STEM & Early Scientific Discovery',
      tagAr: 'تفكير إبداعي وتحليلي',
      tagEn: 'Creative & Analytical Thinking',
      descAr: 'تجارب علمية حسية آمنة، تركيبات هندسية، واستكشاف مبادئ الطبيعة والأرقام بطريقة مرحة تثير الفضول والتساؤل.',
      descEn: 'Safe sensory science experiments, spatial building blocks, and playful nature exploration that sparks curiosity and inquiry.',
      ageAr: 'من سنتين حتى 5 سنوات',
      ageEn: '2 to 5 years',
      benefitsAr: ['حل المشكلات بطرق ذكية', 'فهم محيط الطفل الطبيعي', 'حب الرياضيات والتجربة'],
      benefitsEn: ['Problem-solving skills', 'Understanding the physical world', 'Passion for math and trial']
    },
    {
      id: 'reggio',
      icon: 'palette',
      titleAr: 'منهج ريجيو إميليا (Reggio Emilia)',
      titleEn: 'Reggio Emilia Approach',
      tagAr: 'الفنون والتعبير الإبداعي',
      tagEn: 'Arts & Expressive Play',
      descAr: 'يعتبر البيئة "المعلم الثالث"، حيث يعبر الطفل عن مائة لغة من خلال الرسم، الطين، النحت، المسرح التعبيري، والمشاريع التعاونية.',
      descEn: 'Views the environment as the "third teacher", empowering children to express themselves through drawing, sculpting, and theater.',
      ageAr: 'من سنة ونصف حتى 5 سنوات',
      ageEn: '1.5 to 5 years',
      benefitsAr: ['إطلاق العنان للخيال والابتكار', 'الذكاء الاجتماعي والتعاون', 'تقدير الجماليات'],
      benefitsEn: ['Unleashes creative imagination', 'Social collaboration', 'Appreciation of aesthetics']
    },
    {
      id: 'quran',
      icon: 'menu_book',
      titleAr: 'منهج تحفيظ القرآن والتربية القيمية',
      titleEn: 'Quran & Values Foundation',
      tagAr: 'غرس القيم والأخلاق',
      tagEn: 'Spiritual & Moral Foundation',
      descAr: 'حفظ قصار السور بأصوات عذبة مع ترسيخ الأذكار النبوية اليومية والآداب الرفيعة بأسلوب قصصي تفاعلي محبب لقلوب الصغار.',
      descEn: 'Early memorization of short Surahs, daily supplications, and timeless moral values taught through engaging storytelling.',
      ageAr: 'من سنتين حتى 5 سنوات',
      ageEn: '2 to 5 years',
      benefitsAr: ['فصاحة اللسان ومخارج الحروف', 'السكينة والهدوء النفسي', 'غرس البر والاحترام'],
      benefitsEn: ['Eloquent speech and articulation', 'Peace and serenity', 'Instills kindness and respect']
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#e5eeff]">
        {/* Header */}
        <div className="bg-[#00685f] p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold">
                {isAr ? 'دليل المناهج والبرامج التعليمية في دور الحضانة' : 'Guide to Educational Curriculums in Nurseries'}
              </h3>
              <p className="text-xs text-[#89f5e7] opacity-90">
                {isAr
                  ? 'تعرفي على الفلسفة الأنسب لنمو طفلك وتطوير مهاراته المبكرة'
                  : 'Discover the ideal pedagogical approach tailored to your child'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="p-4 sm:p-5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] hover:border-[#00685f]/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#00685f]/15 text-[#00685f] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{prog.icon}</span>
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0b1c30]">
                      {isAr ? prog.titleAr : prog.titleEn}
                    </h4>
                    <span className="text-[11px] text-[#6d7a77]">
                      {isAr ? prog.ageAr : prog.ageEn}
                    </span>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#fea619]/20 text-[#855300] text-xs font-bold">
                  {isAr ? prog.tagAr : prog.tagEn}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#3d4947] leading-relaxed">
                {isAr ? prog.descAr : prog.descEn}
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(isAr ? prog.benefitsAr : prog.benefitsEn).map((b, bIdx) => (
                  <span
                    key={bIdx}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00685f] bg-white px-2.5 py-1 rounded-lg border border-[#e5eeff]"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    <span>{b}</span>
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#e5eeff] flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectCurriculum(prog.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span>
                    {isAr
                      ? `استعراض الحضانات التي تقدم هذا المنهج`
                      : `View nurseries offering this curriculum`}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
