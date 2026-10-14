import { UserReview, FacilityPhoto } from '../types.ts';

// Sample facility photos for demonstration
export const NURSERY_FACILITY_PHOTOS: Record<number, FacilityPhoto[]> = {
  1: [
    {
      id: 'f1-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIw023i5f3Fg4F7PuPqNc5uSly8H8jD5tkW9MPGGk3vJyWGEGv9IqUzTr9NgI9Xu9XjKfMan4Msfwkyqu3dXjxAA_H8jaTzdzlLFyuIrwpScEyGiHNpmeDDVydlIcW90cGgI5WGiVD597KWjD0vNCeJYVwOaLruSTOpHb8UazWNHSggZ2ih0jMYcO-1Su0dOMhp1CDnaXiRkVFcT0Ku1hX_rslfLsRZYSCv4-lLhUk4RTvTMTnSdw',
      title: 'ركن المونتيسوري التفاعلي',
      caption: 'ألعاب خشبية تعليمية وأرضيات مبطنة آمنة للأطفال',
      uploadedBy: 'أم فيصل',
      category: 'classroom'
    },
    {
      id: 'f1-2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT-_JMMjkF4U-0ijCAIygcS0rA11Q5GMGOhWb-RoD57fq2vgkc01yZigTT4c2CdJ43k-YlvrdHKnD88NDdQQg4kKMv_7D_6k4vHbroBqJ9Yz6NBBdBzYm8-9aa9mTItBLungJa0CdI8YVWcdeSYRrlXGvKyPpbDV-aTsObtAW9eVAj22bPerNiSpZ2P6BJvL-9zkMYoL8oG1MSMCpZLe-zAsK6RCrfE0zMVR7tjJi-_pBNsbGg2UWu',
      title: 'الفصول الذكية وشاشات الأنشطة',
      caption: 'تقنيات تفاعلية حديثة لتحفيز الإدراك البصري واللغوي',
      uploadedBy: 'نورة السديري',
      category: 'activities'
    },
    {
      id: 'f1-3',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAN-A_W_hkb1SzecKhkKgDpOt5reUhkMOw51LOiWcREZha77C0MCpFM48LRBFlKsSbViw2mto9LInMXvlMpMSPANMeZUapQeQH5FWprX2paX451PVOfzS2lU3yv4zQ-Z4o1YPbR0WwMZKl5X5P-Ub373lEJMJGvmwJ971ioUuv8Fh57KV1Q0Rwzhv07loxmI1asdodgsd2iRalzVmzD1Hbntrq5mdXLww6nFgA_x2M6xOJ_ew6PdHw',
      title: 'الساحة الخارجية المظللة',
      caption: 'ألعاب حركية ومطاط مانع للصدمات مع مظلات تبريد رذاذي',
      uploadedBy: 'أم عبدالعزيز',
      category: 'playground'
    },
    {
      id: 'f1-4',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL1YzWyyqe73uRmDfov9TRC3ccic5RT7oJrAss640NYSFOD0CsJCMzSZFc4luQJrcHqJDJeWgvK1ca5s4Kd5Ujivqaa16NIPsjlYxVFP6m6g2t7xV5PCaEQQi3_pVnb8ySjHr3ja2otLC2-HrZ2yT7fQPQk8K8t_BeLQ3YJCELLWf_tzz3tePN_krIEo8Mytyg7CA0ANTomZW27BX-ZvKHT9CeJzNEH-S-AI84nMzs-EbwF3XTATyD',
      title: 'غرفة القيلولة ورعاية الرضع',
      caption: 'أسرة مفردة معقمة وإضاءة هادئة ومراقبة تمريضية دائمة',
      uploadedBy: 'أم سارة',
      category: 'sleep'
    }
  ],
  2: [
    {
      id: 'f2-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL1YzWyyqe73uRmDfov9TRC3ccic5RT7oJrAss640NYSFOD0CsJCMzSZFc4luQJrcHqJDJeWgvK1ca5s4Kd5Ujivqaa16NIPsjlYxVFP6m6g2t7xV5PCaEQQi3_pVnb8ySjHr3ja2otLC2-HrZ2yT7fQPQk8K8t_BeLQ3YJCELLWf_tzz3tePN_krIEo8Mytyg7CA0ANTomZW27BX-ZvKHT9CeJzNEH-S-AI84nMzs-EbwF3XTATyD',
      title: 'جناح الرضع والمواليد',
      caption: 'غرف مجهزة بأجهزة تنقية الهواء وممرضة مقيمة 24 ساعة',
      uploadedBy: 'د. ليلى الغامدي',
      category: 'sleep'
    },
    {
      id: 'f2-2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIw023i5f3Fg4F7PuPqNc5uSly8H8jD5tkW9MPGGk3vJyWGEGv9IqUzTr9NgI9Xu9XjKfMan4Msfwkyqu3dXjxAA_H8jaTzdzlLFyuIrwpScEyGiHNpmeDDVydlIcW90cGgI5WGiVD597KWjD0vNCeJYVwOaLruSTOpHb8UazWNHSggZ2ih0jMYcO-1Su0dOMhp1CDnaXiRkVFcT0Ku1hX_rslfLsRZYSCv4-lLhUk4RTvTMTnSdw',
      title: 'صالة اللعب الحسي والمهارات',
      caption: 'بيئة مرحة ومحفزة تنمي مهارات التوازن والمشي المبكر',
      uploadedBy: 'أم نايف',
      category: 'classroom'
    }
  ],
  3: [
    {
      id: 'f3-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXOaWtgWcFzFbzDadGxMSggOpL2kYJFtWyKQRAoR2nHKGzeA2spTTDPfwJyMsRwIFxrhGhHtMyiY52Lsp0Kmo6Yz8uppc10SW37-SGYJ-XmeHcROLWF2xsArUf0c3cFg5kslo1n2fV1-LFuN6AuWIkLV5HGi7FuJgETRW7oAPCF4tgQ3fWyAMY8-oFEKJBVQ7vCK5Q00_jbh4Ud07jUE2yiDq9_NaYZqj6UbPkLicBA6YgbW-hefYw',
      title: 'مختبر STEM واستكشاف العلوم',
      caption: 'أركان التجارب الممتعة والروبوتات الخشبية الآمنة',
      uploadedBy: 'م. مريم الدوسري',
      category: 'activities'
    },
    {
      id: 'f3-2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG6ik8KldgeOQAQoNh1KCTcL_lyesS0hI8ze6oHCuZ4tunZ3-jWRDzbGqSdZkwQOL4egTZLX2PrAQTEdDdMus-RQj9wclZWogh48-kGWDS67G8rNI53NxsEyg6jPRWF2NRaCvg66ALq3YG2j_BRDoqCF0bwBqRZQO7_6wheqGJ0_EDInH7rjKNTJJFPq_amsJIdnJ8MBQiz2Id0ww0lpq6SYd-1FFc5sP3n5J_FxoIMHqnw3NldwjV',
      title: 'مرسم الفنون والموسيقى',
      caption: 'ألوان آمنة صالحة للأكل وأدوات إيقاعية موسيقية',
      uploadedBy: 'أم خالد',
      category: 'classroom'
    }
  ],
  4: [
    {
      id: 'f4-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT-_JMMjkF4U-0ijCAIygcS0rA11Q5GMGOhWb-RoD57fq2vgkc01yZigTT4c2CdJ43k-YlvrdHKnD88NDdQQg4kKMv_7D_6k4vHbroBqJ9Yz6NBBdBzYm8-9aa9mTItBLungJa0CdI8YVWcdeSYRrlXGvKyPpbDV-aTsObtAW9eVAj22bPerNiSpZ2P6BJvL-9zkMYoL8oG1MSMCpZLe-zAsK6RCrfE0zMVR7tjJi-_pBNsbGg2UWu',
      title: 'الفصول الذكية ومكتبة القراءة',
      caption: 'جلسات مريحة مع شاشات عرض تفاعلية تخدم التعليم المرن',
      uploadedBy: 'أم الجوهرة',
      category: 'classroom'
    }
  ],
  5: [
    {
      id: 'f5-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG6ik8KldgeOQAQoNh1KCTcL_lyesS0hI8ze6oHCuZ4tunZ3-jWRDzbGqSdZkwQOL4egTZLX2PrAQTEdDdMus-RQj9wclZWogh48-kGWDS67G8rNI53NxsEyg6jPRWF2NRaCvg66ALq3YG2j_BRDoqCF0bwBqRZQO7_6wheqGJ0_EDInH7rjKNTJJFPq_amsJIdnJ8MBQiz2Id0ww0lpq6SYd-1FFc5sP3n5J_FxoIMHqnw3NldwjV',
      title: 'صالون الموسيقى والمسرح التعبيري',
      caption: 'أنشطة تعبيرية حركية مسائية بإشراف معلمات متخصصات',
      uploadedBy: 'أم راكان',
      category: 'activities'
    }
  ],
  6: [
    {
      id: 'f6-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAN-A_W_hkb1SzecKhkKgDpOt5reUhkMOw51LOiWcREZha77C0MCpFM48LRBFlKsSbViw2mto9LInMXvlMpMSPANMeZUapQeQH5FWprX2paX451PVOfzS2lU3yv4zQ-Z4o1YPbR0WwMZKl5X5P-Ub373lEJMJGvmwJ971ioUuv8Fh57KV1Q0Rwzhv07loxmI1asdodgsd2iRalzVmzD1Hbntrq5mdXLww6nFgA_x2M6xOJ_ew6PdHw',
      title: 'الساحات الخارجية والحديقة المظللة',
      caption: 'أشجار طبيعية ومظلات تبريد ومسبح كرات وألعاب آمنة',
      uploadedBy: 'أم عائشة',
      category: 'playground'
    }
  ]
};

// Seed reviews for nurseries
export const SEED_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    nurseryId: 1,
    userId: 'seed-user-1',
    userName: 'أم فيصل القحطاني',
    userBadge: 'رأي عينة',
    rating: 5,
    date: 'منذ 3 أيام',
    comment: 'ما شاء الله تبارك الله، من أفضل القرارات التي اتخذتها لطفلي فيصل (سنتين). نظافة المركز فائقة، والمعلمات سعوديات متخصصات برياض الأطفال وقمة في الرقي والاحتواء. والأجمل هو تطبيق الجوال اللي فيه بث مباشر للكاميرات أتابع طفلي وأنا بالدوام بكل اطمئنان.',
    childAgeGroup: 'دارجون (1 - 3 سنوات)',
    facilityPhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIw023i5f3Fg4F7PuPqNc5uSly8H8jD5tkW9MPGGk3vJyWGEGv9IqUzTr9NgI9Xu9XjKfMan4Msfwkyqu3dXjxAA_H8jaTzdzlLFyuIrwpScEyGiHNpmeDDVydlIcW90cGgI5WGiVD597KWjD0vNCeJYVwOaLruSTOpHb8UazWNHSggZ2ih0jMYcO-1Su0dOMhp1CDnaXiRkVFcT0Ku1hX_rslfLsRZYSCv4-lLhUk4RTvTMTnSdw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAN-A_W_hkb1SzecKhkKgDpOt5reUhkMOw51LOiWcREZha77C0MCpFM48LRBFlKsSbViw2mto9LInMXvlMpMSPANMeZUapQeQH5FWprX2paX451PVOfzS2lU3yv4zQ-Z4o1YPbR0WwMZKl5X5P-Ub373lEJMJGvmwJ971ioUuv8Fh57KV1Q0Rwzhv07loxmI1asdodgsd2iRalzVmzD1Hbntrq5mdXLww6nFgA_x2M6xOJ_ew6PdHw'
    ],
    helpfulCount: 24,
    verifiedParent: false
  },
  {
    id: 'rev-2',
    nurseryId: 1,
    userId: 'seed-user-2',
    userName: 'د. نورة السديري',
    userBadge: 'رأي عينة',
    rating: 5,
    date: 'منذ أسبوعين',
    comment: 'منهج المونتيسوري عندهم مطبق بشكل حرفي رائع، وليس مجرد تسويق. طفلي أصبح يعتمد على نفسه في ارتداء ملابسه وتناول طعامه وترتيب ألعابه. الوجبات العضوية المقدمة مدروسة جداً وخالية من السكريات المصنعة.',
    childAgeGroup: 'تمهيدي (3 - 5 سنوات)',
    facilityPhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAT-_JMMjkF4U-0ijCAIygcS0rA11Q5GMGOhWb-RoD57fq2vgkc01yZigTT4c2CdJ43k-YlvrdHKnD88NDdQQg4kKMv_7D_6k4vHbroBqJ9Yz6NBBdBzYm8-9aa9mTItBLungJa0CdI8YVWcdeSYRrlXGvKyPpbDV-aTsObtAW9eVAj22bPerNiSpZ2P6BJvL-9zkMYoL8oG1MSMCpZLe-zAsK6RCrfE0zMVR7tjJi-_pBNsbGg2UWu'
    ],
    helpfulCount: 19,
    verifiedParent: false
  },
  {
    id: 'rev-3',
    nurseryId: 1,
    userId: 'seed-user-3',
    userName: 'سلطان الحربي',
    userBadge: 'رأي عينة',
    rating: 4.8,
    date: 'منذ شهر',
    comment: 'التعامل الإداري احترافي للغاية. مواعيد الاستلام والتسليم منضبطة بأبواب أمان ذكية، والممرضة المقيمة تقوم بفحص دوري صباحي للأطفال قبل دخول الفصول للحد من انتقال أي عدوى موسمية.',
    childAgeGroup: 'رضّع (أقل من سنة)',
    facilityPhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCL1YzWyyqe73uRmDfov9TRC3ccic5RT7oJrAss640NYSFOD0CsJCMzSZFc4luQJrcHqJDJeWgvK1ca5s4Kd5Ujivqaa16NIPsjlYxVFP6m6g2t7xV5PCaEQQi3_pVnb8ySjHr3ja2otLC2-HrZ2yT7fQPQk8K8t_BeLQ3YJCELLWf_tzz3tePN_krIEo8Mytyg7CA0ANTomZW27BX-ZvKHT9CeJzNEH-S-AI84nMzs-EbwF3XTATyD'
    ],
    helpfulCount: 14,
    verifiedParent: false
  },
  {
    id: 'rev-4',
    nurseryId: 2,
    userId: 'seed-user-4',
    userName: 'أم ريان الغامدي',
    userBadge: 'رأي عينة',
    rating: 5,
    date: 'منذ 5 أيام',
    comment: 'حضانة خطواتي الأولى في جدة أنقذتني كأم عاملة! قسم الرضع عندهم يضاهي أرقى المستشفيات الخاصة، ممرضات مرخصات ومتابعة فورية للحليب ومواعيد القيلولة ودرجة الحرارة. شكراً للإدارة الكريمة.',
    childAgeGroup: 'رضّع (أقل من سنة)',
    facilityPhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCL1YzWyyqe73uRmDfov9TRC3ccic5RT7oJrAss640NYSFOD0CsJCMzSZFc4luQJrcHqJDJeWgvK1ca5s4Kd5Ujivqaa16NIPsjlYxVFP6m6g2t7xV5PCaEQQi3_pVnb8ySjHr3ja2otLC2-HrZ2yT7fQPQk8K8t_BeLQ3YJCELLWf_tzz3tePN_krIEo8Mytyg7CA0ANTomZW27BX-ZvKHT9CeJzNEH-S-AI84nMzs-EbwF3XTATyD'
    ],
    helpfulCount: 22,
    verifiedParent: false
  },
  {
    id: 'rev-5',
    nurseryId: 3,
    userId: 'seed-user-5',
    userName: 'م. مريم الدوسري',
    userBadge: 'رأي عينة',
    rating: 5,
    date: 'منذ أسبوع',
    comment: 'روضة أزهار الغد في الخبر رائدة في أنشطة الـ STEM وتأسيس اللغات الإنجليزية والعربية معاً. بنتي أصبحت تتحدث بطلاقة وتتعلم حب الاستكشاف والأرقام بسعادة غامرة.',
    childAgeGroup: 'تمهيدي (3 - 5 سنوات)',
    facilityPhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXOaWtgWcFzFbzDadGxMSggOpL2kYJFtWyKQRAoR2nHKGzeA2spTTDPfwJyMsRwIFxrhGhHtMyiY52Lsp0Kmo6Yz8uppc10SW37-SGYJ-XmeHcROLWF2xsArUf0c3cFg5kslo1n2fV1-LFuN6AuWIkLV5HGi7FuJgETRW7oAPCF4tgQ3fWyAMY8-oFEKJBVQ7vCK5Q00_jbh4Ud07jUE2yiDq9_NaYZqj6UbPkLicBA6YgbW-hefYw'
    ],
    helpfulCount: 31,
    verifiedParent: false
  },
  {
    id: 'rev-6',
    nurseryId: 6,
    userId: 'seed-user-6',
    userName: 'أم عبدالملك القرشي',
    userBadge: 'رأي عينة',
    rating: 5,
    date: 'منذ 4 أيام',
    comment: 'حضانة مسك الصغار في مكة المكرمة قمة في التربية القرآنية والأخلاق العالية، ابني حفظ جزء عم وهو بعمر 4 سنوات بحلقات تحفيظ مبهجة ومحببة للأطفال، والمبنى مظلل ونظيف جداً.',
    childAgeGroup: 'تمهيدي (3 - 5 سنوات)',
    facilityPhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAN-A_W_hkb1SzecKhkKgDpOt5reUhkMOw51LOiWcREZha77C0MCpFM48LRBFlKsSbViw2mto9LInMXvlMpMSPANMeZUapQeQH5FWprX2paX451PVOfzS2lU3yv4zQ-Z4o1YPbR0WwMZKl5X5P-Ub373lEJMJGvmwJ971ioUuv8Fh57KV1Q0Rwzhv07loxmI1asdodgsd2iRalzVmzD1Hbntrq5mdXLww6nFgA_x2M6xOJ_ew6PdHw'
    ],
    helpfulCount: 28,
    verifiedParent: false
  }
];
