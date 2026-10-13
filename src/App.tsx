import React, { useState, useMemo, useEffect } from 'react';
import { Nursery, FilterState } from './types.ts';
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
import { AuthModal } from './components/AuthModal.tsx';
import { MobileFilterDrawer } from './components/MobileFilterDrawer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { EducationalProgramsModal } from './components/EducationalProgramsModal.tsx';
import { CommunityReviewsModal } from './components/CommunityReviewsModal.tsx';
import { AboutUsSection } from './components/AboutUsSection.tsx';
import { Language, translations } from './i18n/translations.ts';
import {
  auth,
  onAuthStateChanged,
  FirebaseUser,
  logoutUser,
  testFirestoreConnection
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

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const t = translations[lang];
  const isAr = lang === 'ar';

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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Dynamic document direction & language sync
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [lang, isAr]);

  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Filter & Search Logic
  const filteredNurseries = useMemo(() => {
    return NURSERIES_DATA.filter((n) => {
      // 1. Keyword search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = n.name.toLowerCase().includes(q);
        const matchDistrict = n.district.toLowerCase().includes(q);
        const matchCity = n.cityName.toLowerCase().includes(q);
        const matchTag = n.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchName && !matchDistrict && !matchCity && !matchTag) return false;
      }

      // 2. City
      if (filters.city !== 'all') {
        if (n.city !== filters.city) return false;
      }

      // 3. Max budget dropdown
      if (filters.maxBudget > 0) {
        if (n.price > filters.maxBudget) return false;
      }

      // 4. Price range slider
      if (n.price > filters.priceRange[1]) return false;

      // 5. Star rating
      if (filters.minRating !== null) {
        if (n.rating < filters.minRating) return false;
      }

      // 6. Curriculums
      if (filters.curriculums.length > 0) {
        const hasCurriculum = filters.curriculums.some((c) => n.curriculum.includes(c as any));
        if (!hasCurriculum) return false;
      }

      // 7. Quick tag
      if (filters.quickTag) {
        if (filters.quickTag === 'certified' && !n.hasLicense) return false;
        if (filters.quickTag === 'infants' && !n.ageGroup.includes('infants')) return false;
        if (filters.quickTag === 'cctv' && !n.amenities.includes('cctv')) return false;
        if (filters.quickTag === 'montessori' && !n.curriculum.includes('montessori')) return false;
        if (filters.quickTag === 'extended_hours' && !n.hours.includes('extended')) return false;
      }

      return true;
    }).sort((a, b) => {
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
  }, [filters, sortBy]);

  // Paginated Nurseries
  const totalItems = filteredNurseries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const displayedNurseries = filteredNurseries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Favorite toggle
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const favoriteNurseries = useMemo(() => {
    return NURSERIES_DATA.filter((n) => favorites.includes(n.id));
  }, [favorites]);

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

  const handleSelectCurriculumFromModal = (curriculumId: string) => {
    setFilters((prev) => ({
      ...prev,
      curriculums: [curriculumId]
    }));
    setCurrentPage(1);
    scrollToDirectory();
  };

  const handleExploreTopRatedFromModal = () => {
    setSortBy('rating');
    setFilters((prev) => ({
      ...prev,
      minRating: 4.8
    }));
    setCurrentPage(1);
    scrollToDirectory();
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Navigation Bar with working actions for all buttons */}
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
        onLogout={logoutUser}
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
                <span className="material-symbols-outlined text-[18px] text-[#00685f]">tune</span>
                <span>{t.filterBtn}</span>
                <span className="w-4 h-4 rounded-full bg-[#fea619] text-[#684000] text-[10px] font-bold flex items-center justify-center">
                  4
                </span>
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
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
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
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span className="hidden md:inline">{t.viewMap}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Directory Content Area */}
          {viewMode === 'map' ? (
            <MapView
              nurseries={filteredNurseries}
              onSelectNursery={(n) => setSelectedNurseryForModal(n)}
              onBookTour={(n) => setSelectedNurseryForTour(n)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* FILTER SIDEBAR (4 cols in desktop - placed based on text direction) */}
              <div className="hidden lg:block lg:col-span-4">
                <FilterSidebar
                  lang={lang}
                  filters={filters}
                  setFilters={setFilters}
                  totalCount={NURSERIES_DATA.length}
                  filteredCount={totalItems}
                  onReset={handleResetFilters}
                />
              </div>

              {/* NURSERY CARDS GRID (8 cols in desktop) */}
              <div className="lg:col-span-8 space-y-8">
                {displayedNurseries.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#e5eeff] space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#eff4ff] text-[#00685f] mx-auto flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px]">search_off</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0b1c30]">{t.noNurseriesFound}</h3>
                    <p className="text-xs sm:text-sm text-[#6d7a77] max-w-sm mx-auto">
                      {t.resetFiltersPrompt}
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 rounded-2xl bg-[#00685f] text-white text-xs font-bold shadow-xs hover:bg-[#008378] cursor-pointer"
                    >
                      {t.resetFiltersBtn}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {displayedNurseries.map((nursery) => (
                      <NurseryCard
                        key={nursery.id}
                        lang={lang}
                        nursery={nursery}
                        isFavorite={favorites.includes(nursery.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={(n) => setSelectedNurseryForModal(n)}
                        onBookTour={(n) => setSelectedNurseryForTour(n)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination & Load More Section */}
                <div className="mt-10 flex flex-col items-center gap-4">
                  {/* Friendly Rounded Pagination Bar */}
                  <div className="inline-flex items-center gap-1 p-1 bg-white rounded-full shadow-xs border border-[#e5eeff]">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[#6d7a77] hover:bg-[#eff4ff] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title={t.previousPage}
                    >
                      <span className="material-symbols-outlined text-[20px] rtl:-scale-x-100">
                        chevron_left
                      </span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          type="button"
                          className={`w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#00685f] text-white shadow-xs'
                              : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[#00685f] hover:bg-[#eff4ff] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title={t.nextPage}
                    >
                      <span className="material-symbols-outlined text-[20px] rtl:-scale-x-100">
                        chevron_right
                      </span>
                    </button>
                  </div>

                  {/* Quick Jump / View More Pill Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((p) => p + 1);
                      } else {
                        setCurrentPage(1);
                      }
                    }}
                    className="px-8 py-3 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#00685f] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>{t.viewMoreNurseries} ({totalItems})</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>

                  {/* Trust Footer Note */}
                  <div className="flex items-center gap-2 text-[#6d7a77] text-xs mt-1">
                    <span className="material-symbols-outlined text-[#00685f] text-[18px]">verified_user</span>
                    <span>{t.inspectionFooterNote}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. About Us / من نحن Section */}
        <AboutUsSection
          lang={lang}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
          onExploreNurseries={scrollToDirectory}
        />

        {/* 4. Reassurance & Parent Guide Banner */}
        <ParentGuideBanner
          lang={lang}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onNavigate={handleNavigate}
        onOpenPrograms={() => setIsProgramsModalOpen(true)}
        onOpenReviews={() => setIsCommunityReviewsModalOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        lang={lang}
        activeTab={activeMobileTab}
        setActiveTab={handleMobileTabClick}
        favoritesCount={favorites.length}
      />

      {/* Mobile Slide-Up Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterDrawerOpen}
        onClose={() => setIsMobileFilterDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        filteredCount={totalItems}
        onReset={handleResetFilters}
      />

      {/* Nursery Details Modal with User Reviews Component */}
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
      />

      {/* Book Tour Modal */}
      <BookingTourModal
        nursery={selectedNurseryForTour}
        isOpen={Boolean(selectedNurseryForTour)}
        onClose={() => setSelectedNurseryForTour(null)}
      />

      {/* Free Childcare Consultation Modal */}
      <FreeConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      {/* Register Nursery Modal */}
      <RegisterNurseryModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
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

      {/* User Auth Modal with Google Sign-in */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogout={logoutUser}
      />

      {/* Educational Programs Modal (Navbar: البرامج التعليمية) */}
      <EducationalProgramsModal
        isOpen={isProgramsModalOpen}
        onClose={() => setIsProgramsModalOpen(false)}
        lang={lang}
        onSelectCurriculum={handleSelectCurriculumFromModal}
      />

      {/* Community Stories & Reviews Modal (Navbar: الآراء والتجارب) */}
      <CommunityReviewsModal
        isOpen={isCommunityReviewsModalOpen}
        onClose={() => setIsCommunityReviewsModalOpen(false)}
        lang={lang}
        onExploreTopRated={handleExploreTopRatedFromModal}
      />
    </div>
  );
}
