import React, { useState, useMemo, useEffect } from 'react';
import {
  Nursery,
  FilterState,
  UserRole,
  UserProfile,
  NurseryRegistrationRequest,
  UserReview,
  TourBooking,
  QuickContactInquiry
} from './types.ts';
import { NURSERIES_DATA } from './data/nurseries.ts';
import { Header } from './components/Header.tsx';
import { HeroSearch } from './components/HeroSearch.tsx';
import { FilterSidebar } from './components/FilterSidebar.tsx';
import { NurseryCard } from './components/NurseryCard.tsx';
import { MapView } from './components/MapView.tsx';
import { ParentGuideBanner } from './components/ParentGuideBanner.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingTourModal } from './components/BookingTourModal.tsx';
import { FreeConsultationModal } from './components/FreeConsultationModal.tsx';
import { NurseryDetailsModal } from './components/NurseryDetailsModal.tsx';
import { RegisterNurseryModal } from './components/RegisterNurseryModal.tsx';
import { FavoritesDrawer } from './components/FavoritesDrawer.tsx';
import { UserAuthModal } from './components/UserAuthModal.tsx';
import { WelcomeAuthGate } from './components/WelcomeAuthGate.tsx';
import { AdminPortalPage } from './components/AdminPortalPage.tsx';
import { MobileFilterDrawer } from './components/MobileFilterDrawer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { EducationalProgramsModal } from './components/EducationalProgramsModal.tsx';
import { CommunityReviewsModal } from './components/CommunityReviewsModal.tsx';
import { AboutUsSection } from './components/AboutUsSection.tsx';
import { AppIcon } from './components/AppIcon.tsx';
import { EditNurseryModal } from './components/EditNurseryModal.tsx';
import { Language, translations } from './i18n/translations.ts';
import {
  auth,
  onAuthStateChanged,
  FirebaseUser,
  logoutUser,
  testFirestoreConnection,
  fetchAllAdminData,
  approveNurseryRequest,
  rejectNurseryRequest,
  moderateReviewStatus,
  updateUserRoleInDb,
  syncUserProfile,
  saveUserRegistrationToDb
} from './lib/firebase.ts';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  city: 'all',
  maxBudget: 0,
  priceRange: [1000, 5000],
  minRating: null,
  ageGroups: ['infants', 'toddlers'],
  curriculums: ['montessori', 'bilingual'],
  amenities: ['cctv', 'organic_food', 'nurse'],
  operatingHours: ['morning', 'extended'],
  quickTag: null
};

// Demo Registered Users for Admin Portal (Simulated accounts only - No real user data)
const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'demo-admin-1',
    displayName: 'مشرف المنصة (حساب تجريبي)',
    email: 'admin.demo@example.com',
    role: 'admin',
    phone: '050XXXXXXX',
    createdAt: '2026-10-01'
  },
  {
    uid: 'demo-owner-1',
    displayName: 'مالك حضانة (حساب تجريبي)',
    email: 'owner.demo@example.com',
    role: 'owner',
    phone: '055XXXXXXX',
    managedNurseryId: 1,
    createdAt: '2026-10-05'
  },
  {
    uid: 'demo-parent-1',
    displayName: 'ولي أمر (حساب تجريبي)',
    email: 'parent.demo@example.com',
    role: 'parent',
    phone: '056XXXXXXX',
    createdAt: '2026-10-10'
  }
];

// Initial Nursery Requests pending admin approval
const INITIAL_REQUESTS: NurseryRegistrationRequest[] = [
  {
    id: 'req-101',
    centerName: 'مركز أزهار المستقبل للطفولة المبكرة',
    city: 'الرياض',
    district: 'حي الملقا',
    licenseNumber: 'MOE-RYD-9981',
    managerName: 'أ. نورة القحطاني',
    managerPhone: '0505123987',
    ownerEmail: 'noura.azhar@gmail.com',
    status: 'pending',
    createdAt: '2026-10-13',
    price: 2400,
    notes: 'مركز مجهز بمنهج مونتيسوري وكاميرات مراقبة متكاملة.'
  },
  {
    id: 'req-102',
    centerName: 'حضانة براعم الأمل النموذجية',
    city: 'جدة',
    district: 'حي الشاطئ',
    licenseNumber: 'MOE-JED-4421',
    managerName: 'د. ليلى الغامدي',
    managerPhone: '0566677889',
    ownerEmail: 'laila.hope@hotmail.com',
    status: 'pending',
    createdAt: '2026-10-12',
    price: 2100,
    notes: 'حضانة ثنائية اللغة مع مسبح تعليمي وطاقم تمريضي مقيم.'
  },
  {
    id: 'req-103',
    centerName: 'روضة أجيال العطاء',
    city: 'الدمام',
    district: 'حي الشاطئ الشرقي',
    licenseNumber: 'MOE-DAM-3310',
    managerName: 'أ. فهد الدوسري',
    managerPhone: '0544411223',
    ownerEmail: 'fahad.ajyal@gmail.com',
    status: 'approved',
    createdAt: '2026-10-08',
    price: 1950,
    notes: 'تم التحقق من رخصة وزارة التعليم واعتماد المركز.'
  }
];

// Initial Reviews
const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-201',
    nurseryId: 1,
    nurseryName: 'حضانة عالم الصغار الإبداعية',
    userId: 'user-parent-1',
    userName: 'أم ريان',
    userBadge: 'ولي أمر مسجّل',
    rating: 5,
    date: '2026-10-12',
    comment: 'بيئة تعليمية فائقة التميز وطاقم متعاون جداً، ابني تطور بشكل ملحوظ في النطق والمهارات الاجتماعية.',
    status: 'approved'
  },
  {
    id: 'rev-202',
    nurseryId: 2,
    nurseryName: 'روضة براعم المستقبل النموذجية',
    userId: 'user-parent-2',
    userName: 'عبدالله التميمي',
    userBadge: 'ولي أمر مسجّل',
    rating: 4.8,
    date: '2026-10-13',
    comment: 'النظافة ومستوى كاميرات المراقبة يمنحان راحة بال استثنائية، والمتابعة اليومية عبر التطبيق ممتازة.',
    status: 'pending'
  }
];

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const t = translations[lang];
  const isAr = lang === 'ar';

  // Standalone Page Routing: 'public' | 'admin'
  const [pageView, setPageView] = useState<'public' | 'admin'>('public');

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Dynamic Nurseries state (supports live additions by admin and edits by owners)
  const [nurseriesList, setNurseriesList] = useState<Nursery[]>(NURSERIES_DATA);

  // Centralized Application Data
  const [usersList, setUsersList] = useState<UserProfile[]>(INITIAL_USERS);
  const [nurseryRequests, setNurseryRequests] = useState<NurseryRegistrationRequest[]>(INITIAL_REQUESTS);
  const [reviewsList, setReviewsList] = useState<UserReview[]>(INITIAL_REVIEWS);
  const [tourBookingsList, setTourBookingsList] = useState<any[]>([]);
  const [quickContactsList, setQuickContactsList] = useState<QuickContactInquiry[]>([]);

  // Public User Role & State
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [hasPassedWelcomeGate, setHasPassedWelcomeGate] = useState<boolean>(false);

  // Modals & Navigation
  const [isEditNurseryModalOpen, setIsEditNurseryModalOpen] = useState(false);
  const [selectedNurseryForEdit, setSelectedNurseryForEdit] = useState<Nursery | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'price' | 'popularity'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [favorites, setFavorites] = useState<number[]>([1, 3]);

  // Modal states
  const [selectedNurseryForModal, setSelectedNurseryForModal] = useState<Nursery | null>(null);
  const [selectedNurseryForTour, setSelectedNurseryForTour] = useState<Nursery | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState(false);
  const [isProgramsModalOpen, setIsProgramsModalOpen] = useState(false);
  const [isCommunityReviewsModalOpen, setIsCommunityReviewsModalOpen] = useState(false);

  // Navigation states
  const [activeNav, setActiveNav] = useState('home');
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'search' | 'favorites' | 'profile'>('home');

  // Sync hash for direct access (e.g. #admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setPageView('admin');
      } else {
        setPageView('public');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync language & direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [lang, isAr]);

  // Firebase auth & data sync
  useEffect(() => {
    testFirestoreConnection();
    fetchAllAdminData().then((data) => {
      if (data.nurseryRequests && data.nurseryRequests.length > 0) {
        setNurseryRequests(data.nurseryRequests);
      }
      if (data.reviews && data.reviews.length > 0) {
        setReviewsList(data.reviews);
      }
      if (data.tourBookings) {
        setTourBookingsList(data.tourBookings);
      }
      if (data.quickContacts) {
        setQuickContactsList(data.quickContacts);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.email?.toLowerCase() === 'mostafaaljabaly9@gmail.com') {
          setIsAdminLoggedIn(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // User Authentication Handlers
  const handleUserLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentRole('parent');
  };

  const handleUserLoginSuccess = (user: Partial<UserProfile> & { uid: string; email: string; displayName: string; role: UserRole }) => {
    const fakeFirebaseUser = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null
    } as FirebaseUser;

    setCurrentUser(fakeFirebaseUser);
    setCurrentRole(user.role);
    setHasPassedWelcomeGate(true);

    const lowerEmail = (user.email || '').toLowerCase().trim();
    const isAdmin =
      user.role === 'admin' ||
      lowerEmail === 'admin' ||
      lowerEmail === 'admin@rawdati.sa' ||
      lowerEmail === 'mostafaaljabaly9@gmail.com' ||
      usersList.some((u) => (u.email.toLowerCase() === lowerEmail || u.displayName.toLowerCase() === lowerEmail) && u.role === 'admin');

    if (isAdmin) {
      // إذا سجل الدخول كادمن ابعته على صفحة الادمن
      setIsAdminLoggedIn(true);
      setPageView('admin');
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // واذا مستخدم ابعته على صفحة المستخدمين
      setIsAdminLoggedIn(false);
      setPageView('public');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // When a new user registers: "اذا كان مش مسجل يسجل بعدين يدخل"
  const handleUserRegisterSuccess = (newUser: UserProfile) => {
    // 1. Automatically log them in!
    const fakeFirebaseUser = {
      uid: newUser.uid,
      displayName: newUser.displayName,
      email: newUser.email,
      photoURL: newUser.photoURL || null
    } as FirebaseUser;

    setCurrentUser(fakeFirebaseUser);
    setCurrentRole(newUser.role);
    setHasPassedWelcomeGate(true);

    // Send to public page for users
    setIsAdminLoggedIn(false);
    setPageView('public');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 3. Save to database (Firestore)!
    saveUserRegistrationToDb(newUser).catch(console.warn);
  };

  // Admin Portal Handlers
  const handleAdminLogin = (email: string): boolean => {
    const lower = email.toLowerCase().trim();
    const isOwner = lower === 'mostafaaljabaly9@gmail.com';
    const isDemoAdmin = lower === 'admin' || lower === 'admin@rawdati.sa';
    const isUserAdmin = usersList.some((u) => (u.email.toLowerCase() === lower || u.displayName.toLowerCase() === lower) && u.role === 'admin');

    if (isOwner || isDemoAdmin || isUserAdmin) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentUser(null);
    setCurrentRole('parent');
    setPageView('public');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToPublic = () => {
    setPageView('public');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminPortal = () => {
    setPageView('admin');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin approves new nursery request -> add live to directory
  const handleApproveNurseryToLive = (request: NurseryRegistrationRequest) => {
    // 1. Update in requests list
    setNurseryRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: 'approved' } : r))
    );
    approveNurseryRequest(request.id).catch(console.warn);

    // 2. Insert into live nurseries directory
    const cityKeyMap: Record<string, 'riyadh' | 'jeddah' | 'dammam' | 'khobar' | 'makkah'> = {
      'الرياض': 'riyadh',
      'جدة': 'jeddah',
      'الدمام': 'dammam',
      'الخبر': 'khobar',
      'مكة المكرمة': 'makkah'
    };

    const newNursery: Nursery = {
      id: Date.now(),
      name: request.centerName,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
      ],
      badge: {
        text: 'منشورة حديثاً',
        type: 'new'
      },
      rating: 5.0,
      reviewsCount: 1,
      city: cityKeyMap[request.city] || 'riyadh',
      cityName: request.city,
      district: request.district,
      distance: '1.5 كم',
      tags: ['حضانة نموذجية', 'جديدة', 'بيئة تفاعلية'],
      ageGroup: ['infants', 'toddlers', 'preschool'],
      curriculum: ['montessori', 'bilingual'],
      amenities: ['cctv', 'nurse', 'organic_food'],
      hours: ['morning', 'extended'],
      price: request.price || 2200,
      description: request.notes || 'حضانة توفر بيئة تربوية متكاملة وآمنة لرعاية الأطفال والطفولة المبكرة.',
      phone: request.managerPhone,
      whatsapp: `966${request.managerPhone.replace(/^0/, '')}`,
      address: `${request.city}، ${request.district}`,
      capacity: 50,
      teacherChildRatio: '1 معلمات لكل 4 أطفال',
      hasLicense: true,
      licenseNumber: request.licenseNumber || `LIC-${Date.now().toString().slice(-5)}`,
      coordinates: { lat: 24.7136, lng: 46.6753 }
    };

    setNurseriesList((prev) => [newNursery, ...prev]);
  };

  const handleRejectNurseryRequest = (reqId: string, reason?: string) => {
    setNurseryRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'rejected' } : r))
    );
    rejectNurseryRequest(reqId, reason).catch(console.warn);
  };

  const handleUpdateUserRole = (uid: string, newRole: 'parent' | 'owner' | 'admin') => {
    setUsersList((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
    );
    updateUserRoleInDb(uid, newRole).catch(console.warn);
  };

  const handleApproveReview = (reviewId: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
    );
    moderateReviewStatus(reviewId, 'approved').catch(console.warn);
  };

  const handleRejectReview = (reviewId: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'rejected' } : r))
    );
    moderateReviewStatus(reviewId, 'rejected').catch(console.warn);
  };

  const handleDeleteNursery = (id: number) => {
    setNurseriesList((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAddNewNurseryDirect = (data: Partial<Nursery>) => {
    const directNursery: Nursery = {
      id: Date.now(),
      name: data.name || 'حضانة جديدة',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
      badge: { text: 'إشراف مباشر', type: 'gold' },
      rating: 5.0,
      reviewsCount: 1,
      city: 'riyadh',
      cityName: data.cityName || 'الرياض',
      district: data.district || 'حي حطين',
      distance: '2.0 كم',
      tags: ['بيئة آمنة', 'إشراف كامل'],
      ageGroup: ['infants', 'toddlers'],
      curriculum: ['bilingual', 'montessori'],
      amenities: ['cctv', 'nurse'],
      hours: ['morning'],
      price: data.price || 2500,
      description: 'حضانة مضافة ومنشورة في الدليل.',
      hasLicense: true,
      coordinates: { lat: 24.7136, lng: 46.6753 }
    };
    setNurseriesList((prev) => [directNursery, ...prev]);
  };

  const handleSaveNurseryEdit = (updated: Nursery) => {
    setNurseriesList((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    if (selectedNurseryForModal?.id === updated.id) {
      setSelectedNurseryForModal(updated);
    }
  };

  // Filter & Search Logic for Public Directory
  const filteredNurseries = useMemo(() => {
    return nurseriesList
      .filter((n) => {
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = n.name.toLowerCase().includes(q);
          const matchDistrict = n.district.toLowerCase().includes(q);
          const matchCity = n.cityName.toLowerCase().includes(q);
          const matchTag = n.tags.some((tag) => tag.toLowerCase().includes(q));
          if (!matchName && !matchDistrict && !matchCity && !matchTag) return false;
        }

        if (filters.city !== 'all') {
          if (n.city !== filters.city) return false;
        }

        if (filters.maxBudget > 0) {
          if (n.price > filters.maxBudget) return false;
        }

        if (n.price > filters.priceRange[1]) return false;

        if (filters.minRating !== null) {
          if (n.rating < filters.minRating) return false;
        }

        if (filters.curriculums.length > 0) {
          const hasCurriculum = filters.curriculums.some((c) => n.curriculum.includes(c as any));
          if (!hasCurriculum) return false;
        }

        if (filters.quickTag) {
          if (filters.quickTag === 'certified' && !n.hasLicense) return false;
          if (filters.quickTag === 'infants' && !n.ageGroup.includes('infants')) return false;
          if (filters.quickTag === 'cctv' && !n.amenities.includes('cctv')) return false;
          if (filters.quickTag === 'montessori' && !n.curriculum.includes('montessori')) return false;
          if (filters.quickTag === 'extended_hours' && !n.hours.includes('extended')) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'popularity') return b.reviewsCount - a.reviewsCount;
        if (sortBy === 'distance') {
          const distA = parseFloat(a.distance);
          const distB = parseFloat(b.distance);
          return distA - distB;
        }
        return 0;
      });
  }, [filters, sortBy, nurseriesList]);

  const totalItems = filteredNurseries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const displayedNurseries = filteredNurseries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const favoriteNurseries = useMemo(() => {
    return nurseriesList.filter((n) => favorites.includes(n.id));
  }, [favorites, nurseriesList]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const scrollToDirectory = () => {
    const elem = document.getElementById('nursery-directory-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    scrollToDirectory();
  };

  const scrollToAboutUs = () => {
    const elem = document.getElementById('about-us-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (navId: string) => {
    setActiveNav(navId);
    if (navId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navId === 'explore') {
      scrollToDirectory();
    } else if (navId === 'about') {
      scrollToAboutUs();
    } else if (navId === 'programs') {
      setIsProgramsModalOpen(true);
    } else if (navId === 'reviews') {
      setIsCommunityReviewsModalOpen(true);
    } else if (navId === 'centers') {
      setIsRegisterModalOpen(true);
    }
  };

  const handleMobileTabClick = (tab: 'home' | 'search' | 'favorites' | 'profile') => {
    setActiveMobileTab(tab);
    if (tab === 'favorites') {
      setIsFavoritesDrawerOpen(true);
    } else if (tab === 'profile') {
      setIsAuthModalOpen(true);
    } else if (tab === 'search') {
      setIsMobileFilterDrawerOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // IF PAGE VIEW IS ADMIN: Render standalone Admin Portal Page!
  if (pageView === 'admin') {
    return (
      <AdminPortalPage
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        onReturnToPublic={handleReturnToPublic}
        users={usersList}
        onUpdateUserRole={handleUpdateUserRole}
        nurseryRequests={nurseryRequests}
        onApproveRequest={handleApproveNurseryToLive}
        onRejectRequest={handleRejectNurseryRequest}
        reviews={reviewsList}
        onApproveReview={handleApproveReview}
        onRejectReview={handleRejectReview}
        tourBookings={tourBookingsList}
        quickContacts={quickContactsList}
        nurseries={nurseriesList}
        onOpenEditNursery={(n) => {
          setSelectedNurseryForEdit(n);
          setIsEditNurseryModalOpen(true);
        }}
        onDeleteNursery={handleDeleteNursery}
        onAddNewNurseryDirect={handleAddNewNurseryDirect}
      />
    );
  }

  // IF NOT ADMIN AND FIRST TIME VISITOR (NOT LOGGED IN & NOT GUEST): Show Welcome Registration Gate
  if (pageView === 'public' && !hasPassedWelcomeGate && !currentUser) {
    return (
      <WelcomeAuthGate
        onRegisterSuccess={handleUserRegisterSuccess}
        onLoginSuccess={handleUserLoginSuccess}
        onContinueAsGuest={() => setHasPassedWelcomeGate(true)}
      />
    );
  }

  // OTHERWISE: Render standard clean Public Website (with visitor mode, directory, search)
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Public Navigation Bar */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        onOpenPrograms={() => setIsProgramsModalOpen(true)}
        onOpenReviews={() => setIsCommunityReviewsModalOpen(true)}
        favoritesCount={favorites.length}
        activeNav={activeNav}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleUserLogout}
        currentRole={currentRole}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1 pb-16 lg:pb-0">
        {/* 1. Hero & Search Bar */}
        <HeroSearch
          lang={lang}
          filters={filters}
          setFilters={setFilters}
          onSearchSubmit={handleSearchSubmit}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
        />

        {/* 2. Main Directory Layout (Sidebar + Grid / Map) */}
        <section id="nursery-directory-section" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Bar: Counter, Sort, View Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-[#e5eeff]">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="w-3 h-3 rounded-full bg-[#00685f] animate-pulse shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-[#0b1c30]">
                {t.showingCount} <span className="text-[#00685f] font-bold">{displayedNurseries.length}</span> {t.outOf}{' '}
                <span className="font-bold">{totalItems}</span> {t.nurseriesAvailable}
              </h2>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileFilterDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white text-[#0b1c30] shadow-xs border border-[#e5eeff] text-xs font-bold cursor-pointer"
              >
                <AppIcon name="tune" className="w-4 h-4 text-[#00685f]" />
                <span>{t.filterBtn}</span>
              </button>

              {/* Sort Control */}
              <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-2xl shadow-xs border border-[#e5eeff]">
                <span className="text-xs text-[#6d7a77]">{t.sortByLabel}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs sm:text-sm text-[#00685f] font-bold outline-none cursor-pointer"
                >
                  <option value="rating">{t.sortHighestRated}</option>
                  <option value="distance">{t.sortClosest}</option>
                  <option value="price">{t.sortLowestPrice}</option>
                  <option value="popularity">{t.sortMostPopular}</option>
                </select>
              </div>

              {/* View Toggle Buttons */}
              <div className="inline-flex p-1 bg-[#e5eeff] rounded-2xl">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                  title={t.viewGrid}
                >
                  <AppIcon name="grid_view" className="w-4 h-4" />
                  <span className="hidden md:inline">{t.viewGrid}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                  title={t.viewMap}
                >
                  <AppIcon name="map" className="w-4 h-4" />
                  <span className="hidden md:inline">{t.viewMap}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <FilterSidebar
                lang={lang}
                filters={filters}
                setFilters={setFilters}
                totalCount={totalItems}
                filteredCount={displayedNurseries.length}
                onReset={handleResetFilters}
              />
            </aside>

            {/* Nurseries Cards Grid or Map View */}
            <div className="lg:col-span-3">
              {viewMode === 'grid' ? (
                <>
                  {displayedNurseries.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-[#e5eeff] p-8 shadow-xs">
                      <div className="w-16 h-16 rounded-full bg-[#89f5e7]/20 flex items-center justify-center mx-auto mb-4">
                        <AppIcon name="search" className="w-8 h-8 text-[#00685f]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0b1c30] mb-2">{t.noNurseriesFound}</h3>
                      <p className="text-sm text-[#3d4947] max-w-md mx-auto mb-6">
                        {t.resetFiltersPrompt}
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00685f] text-white font-bold text-sm shadow-xs hover:bg-[#008378] transition-all cursor-pointer"
                      >
                        <AppIcon name="refresh" className="w-4 h-4" />
                        <span>{t.resetFiltersBtn}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {displayedNurseries.map((nursery) => (
                        <NurseryCard
                          key={nursery.id}
                          nursery={nursery}
                          lang={lang}
                          onSelect={(n) => setSelectedNurseryForModal(n)}
                          onBookTour={(n) => setSelectedNurseryForTour(n)}
                          isFavorite={favorites.includes(nursery.id)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2 pt-6 border-t border-[#e5eeff]">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-full border border-[#bcc9c6] text-xs font-bold text-[#00685f] hover:bg-[#eff4ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        {t.previousPage}
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => {
                              setCurrentPage(page);
                              scrollToDirectory();
                            }}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              currentPage === page
                                ? 'bg-[#00685f] text-white shadow-xs'
                                : 'text-[#3d4947] hover:bg-[#eff4ff]'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-full border border-[#bcc9c6] text-xs font-bold text-[#00685f] hover:bg-[#eff4ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        {t.nextPage}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#e5eeff] overflow-hidden">
                  <MapView
                    nurseries={filteredNurseries}
                    onSelectNursery={(n) => setSelectedNurseryForModal(n)}
                    onBookTour={(n) => setSelectedNurseryForTour(n)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. Parent Childcare Guide Banner */}
        <ParentGuideBanner
          lang={lang}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
        />

        {/* 4. About Us Section */}
        <AboutUsSection
          lang={lang}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
          onExploreNurseries={scrollToDirectory}
        />
      </main>

      {/* Footer without Admin Portal Entrance */}
      <Footer
        lang={lang}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onNavigate={handleNavigate}
        onOpenPrograms={() => setIsProgramsModalOpen(true)}
        onOpenReviews={() => setIsCommunityReviewsModalOpen(true)}
      />

      {/* Mobile Sticky Bottom Nav Bar */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        setActiveTab={handleMobileTabClick}
        favoritesCount={favorites.length}
        lang={lang}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterDrawerOpen}
        onClose={() => setIsMobileFilterDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        filteredCount={totalItems}
        onReset={handleResetFilters}
      />

      {/* Nursery Details Modal */}
      <NurseryDetailsModal
        nursery={selectedNurseryForModal}
        isOpen={Boolean(selectedNurseryForModal)}
        onClose={() => setSelectedNurseryForModal(null)}
        onBookTour={(n) => {
          setSelectedNurseryForModal(null);
          setSelectedNurseryForTour(n);
        }}
        isFavorite={selectedNurseryForModal ? favorites.includes(selectedNurseryForModal.id) : false}
        onToggleFavorite={handleToggleFavorite}
        currentRole={currentRole}
        onOpenEditNursery={(n) => {
          setSelectedNurseryForEdit(n);
          setIsEditNurseryModalOpen(true);
        }}
      />

      {/* Book Tour & Subscription Modal */}
      <BookingTourModal
        nursery={selectedNurseryForTour}
        isOpen={Boolean(selectedNurseryForTour)}
        onClose={() => setSelectedNurseryForTour(null)}
        currentUser={currentUser}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Free Childcare Consultation Modal */}
      <FreeConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      {/* Register Nursery Modal (Owner registers nursery) */}
      <RegisterNurseryModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Favorites Drawer Modal */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favoriteNurseries}
        onRemoveFavorite={handleToggleFavorite}
        onSelectNursery={(n) => setSelectedNurseryForModal(n)}
        onBookTour={(n) => setSelectedNurseryForTour(n)}
      />

      {/* Dedicated User Auth Modal (Login if registered, Register first if not registered) */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        currentRole={currentRole}
        onLogout={handleUserLogout}
        onUserLoginSuccess={handleUserLoginSuccess}
        onUserRegisterSuccess={handleUserRegisterSuccess}
        onOpenRegisterNursery={() => setIsRegisterModalOpen(true)}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
      />

      {/* Educational Programs Modal */}
      <EducationalProgramsModal
        isOpen={isProgramsModalOpen}
        onClose={() => setIsProgramsModalOpen(false)}
        lang={lang}
        onSelectCurriculum={(curriculumId) => {
          setFilters((prev) => ({ ...prev, curriculums: [curriculumId] }));
          setCurrentPage(1);
          scrollToDirectory();
        }}
      />

      {/* Community Stories & Reviews Modal */}
      <CommunityReviewsModal
        isOpen={isCommunityReviewsModalOpen}
        onClose={() => setIsCommunityReviewsModalOpen(false)}
        lang={lang}
        onExploreTopRated={() => {
          setSortBy('rating');
          setFilters((prev) => ({ ...prev, minRating: 4.8 }));
          setCurrentPage(1);
          scrollToDirectory();
        }}
      />

      {/* Edit Nursery Modal (for Owners and Admins) */}
      <EditNurseryModal
        isOpen={isEditNurseryModalOpen}
        onClose={() => setIsEditNurseryModalOpen(false)}
        nursery={selectedNurseryForEdit}
        currentRole={currentRole}
        onSave={handleSaveNurseryEdit}
      />
    </div>
  );
}
