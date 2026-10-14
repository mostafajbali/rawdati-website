import React from 'react';
import { Language } from '../i18n/translations.ts';
import { RawdatiLogo } from './RawdatiLogo.tsx';
import { AppIcon } from './AppIcon.tsx';

interface AboutUsSectionProps {
  lang: Language;
  onOpenConsultation: () => void;
  onExploreNurseries: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  lang,
  onOpenConsultation,
  onExploreNurseries
}) => {
  const isAr = lang === 'ar';

  const stats = [
    {
      value: 'شامل',
      label: isAr ? 'استكشاف ومقارنة الحضانات' : 'Nursery Exploration & Comparison',
      icon: 'school',
      color: 'text-[#00685f]',
      bg: 'bg-[#00685f]/10'
    },
    {
      value: '+12,000',
      label: isAr ? 'طفل مسجل وسعيد' : 'Enrolled & Happy Children',
      icon: 'favorite',
      color: 'text-[#fea619]',
      bg: 'bg-[#fea619]/15'
    },
    {
      value: '4.9 ★',
      label: isAr ? 'متوسط تقييمات الأمهات' : 'Average Mother Satisfaction',
      icon: 'star',
      color: 'text-[#855300]',
      bg: 'bg-[#ffddb8]/60'
    },
    {
      value: 'شفافية',
      label: isAr ? 'استعراض المرافق والرسوم' : 'Facility & Fee Transparency',
      icon: 'check_circle',
      color: 'text-[#00685f]',
      bg: 'bg-[#71f8e4]/30'
    }
  ];

  const pillars = [
    {
      icon: 'verified',
      title: isAr ? 'معايير واشتراطات المرافق' : 'Facility & Care Standards',
      desc: isAr
        ? 'نستعرض تفاصيل التراخيص واشتراطات السلامة والبيئة التعليمية لمساعدة الوالدين في اتخاذ القرار.'
        : 'Review facility information, safety measures, and educational environments with complete transparency.'
    },
    {
      icon: 'videocam',
      title: isAr ? 'الأمان التام وكاميرات البث' : 'Live CCTV & Strict Child Safety',
      desc: isAr
        ? 'أولوية قصوى لمراكز مجهزة بأنظمة مراقبة حية للأمهات وإجراءات دخول وخروج إلكترونية آمنة.'
        : 'Prioritizing nurseries with encrypted parent-viewing cameras and strict biometric access.'
    },
    {
      icon: 'school',
      title: isAr ? 'المناهج وكفاءة المربيات' : 'Early Childhood Curriculum & Staff',
      desc: isAr
        ? 'متابعة مناهج منتسوري، البرامج ثنائية اللغة، ونسب المعلمات للأطفال لضمان اهتمام فردي متكامل.'
        : 'Curated programs (Montessori, bilingual) with low teacher-to-child ratios for personalized care.'
    },
    {
      icon: 'support_agent',
      title: isAr ? 'استشارات توجيهية محايدة' : 'Unbiased Parent Advisory Support',
      desc: isAr
        ? 'فريق من أخصائيي الطفولة المبكرة يقدم لك استشارة هاتفية مجانية لمساعدتك في اختيار المركز الأنسب.'
        : 'Our childhood advisors provide complimentary consultations to guide your final choice.'
    }
  ];

  return (
    <section id="about-us-section" className="py-16 sm:py-20 bg-gradient-to-b from-[#f8f9ff] via-white to-[#f8f9ff] border-t border-b border-[#00685f]/10 relative overflow-hidden">
      {/* Decorative ambient blurred orbs */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-[#00685f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#fea619]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e5eeff] text-[#00685f] text-xs sm:text-sm font-bold shadow-xs">
            <AppIcon name="info" className="w-4 h-4 text-[#fea619]" />
            <span>{isAr ? 'عن منصة روضتي' : 'About Rawdati Platform'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b1c30] leading-snug">
            {isAr ? (
              <>
                شريكك الأول والموثوق في رحلة{' '}
                <span className="text-[#00685f] underline decoration-[#fea619] decoration-wavy decoration-2">
                  اختيار الحضانة المثالية
                </span>{' '}
                لطفلك
              </>
            ) : (
              <>
                Your Trusted Guide to the{' '}
                <span className="text-[#00685f] underline decoration-[#fea619] decoration-wavy decoration-2">
                  Best Nurseries
                </span>{' '}
                in Saudi Arabia
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#3d4947] max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'تأسست منصة «روضتي» كمشروع ودليل رقمي يجمع دور الحضانة ومراكز ضيافة الأطفال لتسهيل الاستكشاف والمقارنة واستعراض البيئات التعليمية بشفافية ووضوح.'
              : 'Rawdati is a showcase digital directory connecting parents with early childhood care centers to easily explore facilities, environments, and community feedback.'}
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <RawdatiLogo size={48} />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#00685f]">
                  {isAr ? 'رسالتنا: أمان طفلك وراحة بالك أولاً' : 'Our Mission: Child Safety & Parental Peace of Mind'}
                </h3>
                <span className="text-xs text-[#6d7a77]">
                  {isAr ? 'دعم مستهدفات تنمية الطفولة المبكرة ورؤية 2030' : 'Empowering Saudi Vision 2030 early childcare goals'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#3d4947] leading-relaxed">
              {isAr
                ? 'نؤمن في «روضتي» بأن السنوات الأولى من عمر الطفل هي الركيزة الأساسية لتشكيل شخصيته وذكائه العاطفي والمعرفي. لذلك، نسخر التقنية الحديثة لنزيل عبء البحث والحيرة عن كاهل الوالدين، ونقدم دليلاً ذكياً شفافاً يساعدهم في استكشاف المراكز مع إمكانية الاطلاع على مرافق الحضانة بالصور الحقيقية وحجز جولات تعريفية قبل اتخاذ القرار.'
                : 'At Rawdati, we believe the first five years are foundational for emotional and cognitive growth. We empower parents to explore centers with detailed information, authentic facility photos, and easy tour scheduling.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 bg-[#f8f9ff] p-3.5 rounded-2xl border border-[#e5eeff]">
                <AppIcon name="check_circle" className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-[#0b1c30]">
                  {isAr ? 'معلومات وتفاصيل شاملة للمراكز' : 'Comprehensive Center Details'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 bg-[#f8f9ff] p-3.5 rounded-2xl border border-[#e5eeff]">
                <AppIcon name="star" className="w-5 h-5 text-[#fea619] shrink-0 mt-0.5" filled />
                <span className="text-xs font-bold text-[#0b1c30]">
                  {isAr ? 'تقييمات مجتمعية من أمهات وآباء حقيقيين' : 'Authentic Parent Community Reviews'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 bg-[#f8f9ff] p-3.5 rounded-2xl border border-[#e5eeff]">
                <AppIcon name="photo_camera" className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-[#0b1c30]">
                  {isAr ? 'استعراض واقعي لمرافق الحضانة وغرف النوم' : 'Real Nursery Facilities Photos'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 bg-[#f8f9ff] p-3.5 rounded-2xl border border-[#e5eeff]">
                <AppIcon name="support_agent" className="w-5 h-5 text-[#fea619] shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-[#0b1c30]">
                  {isAr ? 'استشارات مجانية مع أخصائيي طفولة' : 'Free Childcare Advisory Calls'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onExploreNurseries}
                className="px-5 py-2.5 rounded-2xl bg-[#00685f] hover:bg-[#008378] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>{isAr ? 'استكشف الحضانات' : 'Browse Nurseries'}</span>
                <AppIcon name={isAr ? "arrow_left" : "arrow_right"} className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="px-5 py-2.5 rounded-2xl bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
              >
                <AppIcon name="support_agent" className="w-4 h-4 text-[#684000]" />
                <span>{isAr ? 'طلب استشارة مجانية' : 'Free Consultation'}</span>
              </button>
            </div>
          </div>

          {/* Side Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#e5eeff] aspect-4/3 sm:aspect-16/11 group">
              <img
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80"
                alt={isAr ? 'أطفال في روضة أطفال يتعلمون ويلعبون بأمان' : 'Kids in nursery learning happily'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-white">
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#00685f] text-[11px] font-bold mb-1 shadow-xs">
                  {isAr ? 'أمان، حب، ورعاية' : 'Safety, Love & Growth'}
                </span>
                <h4 className="text-base font-bold leading-tight">
                  {isAr ? 'بيئة تنموية محفزة لكل طفل' : 'An inspiring growth environment for every child'}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
              {isAr ? 'ركائز الثقة في منصة روضتي' : 'Our Four Pillars of Trust'}
            </h3>
            <p className="text-xs sm:text-sm text-[#6d7a77] mt-1">
              {isAr ? 'المعايير الصارمة التي نعتمدها في اختيار وعرض كل حضانة' : 'The high standards that govern every listed center'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e5eeff] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center">
                    <AppIcon name={pillar.icon} className="w-6 h-6 text-[#00685f]" />
                  </div>
                  <h4 className="text-base font-bold text-[#0b1c30]">{pillar.title}</h4>
                  <p className="text-xs text-[#3d4947] leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Platform Stats Counter */}
        <div className="bg-[#eff4ff] rounded-3xl p-6 sm:p-10 border border-[#e5eeff]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-2">
                <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} mx-auto flex items-center justify-center shadow-2xs`}>
                  <AppIcon name={s.icon} className="w-6 h-6" filled={s.icon === 'star' || s.icon === 'favorite'} />
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-xs font-bold text-[#3d4947]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
