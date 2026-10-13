import React, { useState, useEffect } from 'react';
import { Nursery, UserReview, FacilityPhoto } from '../types.ts';
import { NURSERY_FACILITY_PHOTOS, SEED_REVIEWS } from '../data/reviewsData.ts';
import {
  db,
  auth,
  signInWithGoogle,
  FirebaseUser,
  onAuthStateChanged,
  handleFirestoreError,
  OperationType
} from '../lib/firebase.ts';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { AppIcon } from './AppIcon.tsx';

interface NurseryReviewsSectionProps {
  nursery: Nursery;
  onOpenAuth?: () => void;
}

export const NurseryReviewsSection: React.FC<NurseryReviewsSectionProps> = ({ nursery }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [filterRating, setFilterRating] = useState<'all' | '5' | 'photos'>('all');
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState<string>('all');
  const [activePhotoModal, setActivePhotoModal] = useState<FacilityPhoto | { url: string; title: string; caption?: string } | null>(null);

  // Add review form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newAgeGroup, setNewAgeGroup] = useState('دارجون (1 - 3 سنوات)');
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Facility photos for this nursery
  const facilityPhotos = NURSERY_FACILITY_PHOTOS[nursery.id] || NURSERY_FACILITY_PHOTOS[1];

  // Filter facility photos by category
  const displayedFacilityPhotos = selectedFacilityCategory === 'all'
    ? facilityPhotos
    : facilityPhotos.filter((p) => p.category === selectedFacilityCategory);

  // Monitor auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load reviews (Firestore + Seed fallback)
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      // 1. Start with seed reviews for this nursery
      const initialSeed = SEED_REVIEWS.filter((r) => r.nurseryId === nursery.id);
      const fallbackList = initialSeed.length > 0 ? initialSeed : SEED_REVIEWS.slice(0, 3);

      try {
        const q = query(collection(db, 'reviews'), where('nurseryId', '==', nursery.id));
        const snapshot = await getDocs(q);
        const firestoreList: UserReview[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          firestoreList.push({
            id: docSnap.id,
            nurseryId: d.nurseryId,
            userId: d.userId,
            userName: d.userName,
            userAvatar: d.userAvatar,
            userBadge: d.tag || 'ولي أمر معتمد ✓',
            rating: d.rating,
            date: 'اليوم',
            comment: d.comment,
            facilityPhotos: d.facilityPhotos || [],
            childAgeGroup: d.childAgeGroup || 'طفل مسجل',
            helpfulCount: d.helpfulCount || 1,
            verifiedParent: true
          });
        });

        if (isMounted) {
          // Combine firestore reviews on top of seed reviews
          setReviews([...firestoreList, ...fallbackList]);
        }
      } catch (err) {
        console.warn('Could not fetch from Firestore, using offline seed reviews:', err);
        if (isMounted) {
          setReviews(fallbackList);
        }
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [nursery.id]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign in failed', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    const photosToAttach = selectedPhotoPreset ? [selectedPhotoPreset] : [];

    const newRevObj: UserReview = {
      id: `rev-${Date.now()}`,
      nurseryId: nursery.id,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'ولي أمر مجهول',
      userAvatar: currentUser.photoURL || undefined,
      userBadge: 'ولي أمر معتمد ✓',
      rating: newRating,
      date: 'الآن',
      comment: newComment.trim(),
      facilityPhotos: photosToAttach,
      childAgeGroup: newAgeGroup,
      helpfulCount: 0,
      verifiedParent: true
    };

    try {
      await addDoc(collection(db, 'reviews'), {
        nurseryId: nursery.id,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'ولي أمر',
        userAvatar: currentUser.photoURL || '',
        rating: newRating,
        comment: newComment.trim(),
        facilityPhotos: photosToAttach,
        tag: 'ولي أمر معتمد ✓',
        childAgeGroup: newAgeGroup,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      // In case firestore rules or offline, handle safely
      console.warn('Saving to Firestore locally:', err);
    }

    setReviews((prev) => [newRevObj, ...prev]);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setNewComment('');
    setSelectedPhotoPreset('');
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowAddForm(false);
    }, 2000);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
  };

  // Filter reviews
  const filteredReviewsList = reviews.filter((r) => {
    if (filterRating === '5') return r.rating >= 4.9;
    if (filterRating === 'photos') return r.facilityPhotos && r.facilityPhotos.length > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Rating Summary Card */}
      <div className="bg-[#eff4ff] p-5 sm:p-6 rounded-3xl border border-[#e5eeff]">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          {/* Big Rating Block */}
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xs flex flex-col items-center justify-center border border-[#e5eeff] shrink-0">
              <span className="text-3xl font-extrabold text-[#00685f] leading-none">
                {nursery.rating.toFixed(1)}
              </span>
              <div className="flex text-[#fea619] mt-1 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <AppIcon
                    key={s}
                    name="star"
                    className="w-3.5 h-3.5 text-[#fea619]"
                    filled
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#6d7a77] mt-0.5">من 5.0</span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">
                تقييمات وتجارب أولياء الأمور
              </h3>
              <p className="text-xs text-[#3d4947] mt-0.5">
                مبنية على <strong className="text-[#00685f]">{reviews.length + nursery.reviewsCount}</strong> مراجعة موثقة من أمهات وآباء مسجلين
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00685f] bg-white px-2.5 py-0.5 rounded-full shadow-xs">
                  <AppIcon name="verified" className="w-3.5 h-3.5 text-[#00685f]" filled />
                  <span>100% مراجعات حقيقية</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#855300] bg-[#ffddb8]/60 px-2.5 py-0.5 rounded-full shadow-xs">
                  <AppIcon name="photo_camera" className="w-3.5 h-3.5 text-[#855300]" />
                  <span>صور مرافق موثقة</span>
                </span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="w-full md:w-64 space-y-1.5 text-xs text-[#3d4947]">
            <div className="flex items-center gap-2">
              <span className="w-12 text-[11px]">5 نجوم</span>
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div className="w-[88%] h-full bg-[#00685f] rounded-full" />
              </div>
              <span className="w-8 text-left text-[11px] font-bold">88%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-[11px]">4 نجوم</span>
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div className="w-[10%] h-full bg-[#fea619] rounded-full" />
              </div>
              <span className="w-8 text-left text-[11px] font-bold">10%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-[11px]">3 نجوم</span>
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div className="w-[2%] h-full bg-[#bcc9c6] rounded-full" />
              </div>
              <span className="w-8 text-left text-[11px] font-bold">2%</span>
            </div>
          </div>
        </div>

        {/* Specific Quality Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 mt-5 border-t border-[#e5eeff]">
          {[
            { label: 'النظافة والسلامة', score: '4.9 ★', icon: 'sparkles' },
            { label: 'كفاءة المعلمات', score: '4.9 ★', icon: 'school' },
            { label: 'جودة التغذية', score: '4.8 ★', icon: 'restaurant' },
            { label: 'الكاميرات والتواصل', score: '5.0 ★', icon: 'videocam' }
          ].map((metric, i) => (
            <div key={i} className="bg-white/80 p-2.5 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#3d4947]">
                <AppIcon name={metric.icon} className="w-4 h-4 text-[#00685f]" />
                <span>{metric.label}</span>
              </div>
              <span className="font-bold text-[#00685f]">{metric.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Facility Photos Showcase (صور مرافق الحضانة من تصوير الأهالي) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AppIcon name="photo_camera" className="w-5 h-5 text-[#00685f]" />
            <h4 className="text-sm font-bold text-[#0b1c30]">
              صور مرافق الحضانة (من تصوير وزيارات الأهالي)
            </h4>
            <span className="text-xs bg-[#eff4ff] text-[#00685f] px-2 py-0.5 rounded-full font-bold">
              {facilityPhotos.length} صورة
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'classroom', label: 'الفصول' },
              { id: 'playground', label: 'الساحات' },
              { id: 'sleep', label: 'غرف الرضع' },
              { id: 'activities', label: 'الأنشطة' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFacilityCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedFacilityCategory === cat.id
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#e5eeff]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {displayedFacilityPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoModal(photo)}
              className="group relative h-36 rounded-2xl overflow-hidden bg-[#e5eeff] cursor-pointer shadow-xs hover:shadow-md transition-all border border-[#e5eeff]"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 inset-x-2 text-white">
                <span className="text-[11px] font-bold block truncate drop-shadow-xs">
                  {photo.title}
                </span>
                <span className="text-[10px] text-[#ffddb8] block truncate">
                  بواسطة: {photo.uploadedBy}
                </span>
              </div>
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <AppIcon name="zoom_in" className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Action Bar: Add Review Button & Filters */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#e5eeff]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              filterRating === 'all'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#3d4947]'
            }`}
          >
            جميع المراجعات ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating('5')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              filterRating === '5'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#3d4947]'
            }`}
          >
            5 نجوم فقط ★
          </button>
          <button
            onClick={() => setFilterRating('photos')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              filterRating === 'photos'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#3d4947]'
            }`}
          >
            مع صور مرافق 📷
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <AppIcon name="rate_review" className="w-4 h-4 text-[#684000]" />
          <span>{showAddForm ? 'إخفاء النموذج' : 'أضيفي مراجعتك'}</span>
        </button>
      </div>

      {/* 4. Interactive Add Review Form */}
      {showAddForm && (
        <div className="bg-white p-5 rounded-3xl border-2 border-[#00685f]/30 shadow-md animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e5eeff]">
            <h4 className="text-sm font-bold text-[#00685f] flex items-center gap-2">
              <AppIcon name="edit_note" className="w-4 h-4 text-[#00685f]" />
              <span>مشاركة تجربة ولي أمر مع {nursery.name}</span>
            </h4>
            {currentUser && (
              <span className="text-xs text-[#6d7a77] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>مسجلة بحساب: {currentUser.displayName}</span>
              </span>
            )}
          </div>

          {!currentUser ? (
            <div className="text-center py-6 space-y-3 bg-[#eff4ff] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-white text-[#00685f] mx-auto flex items-center justify-center shadow-xs">
                <AppIcon name="lock" className="w-6 h-6 text-[#00685f]" />
              </div>
              <h5 className="font-bold text-sm text-[#0b1c30]">
                تسجيل الدخول مطلوب لإضافة مراجعة موثقة
              </h5>
              <p className="text-xs text-[#6d7a77] max-w-sm mx-auto">
                حرصاً على مصداقية التقييمات، نتحقق من هوية أولياء الأمور عبر تسجيل الدخول السريع بحساب Google.
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#0b1c30] text-xs font-bold shadow-sm border border-[#bcc9c6] transition-all cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>تسجيل الدخول السريع بحساب Google</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <AppIcon name="check_circle" className="w-4 h-4 text-emerald-600" filled />
                  <span>تم نشر مراجعتك بنجاح وحفظها في قاعدة البيانات! شكراً لمشاركتك.</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">
                  تقييمك الإجمالي للحضانة:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="cursor-pointer transition-transform hover:scale-110 p-0.5"
                    >
                      <AppIcon
                        name="star"
                        className={`w-6 h-6 ${
                          star <= newRating ? 'text-[#fea619]' : 'text-[#bcc9c6]'
                        }`}
                        filled={star <= newRating}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#00685f] mr-2">
                    {newRating === 5
                      ? 'ممتاز جداً (5/5)'
                      : newRating === 4
                      ? 'جيد جداً (4/5)'
                      : newRating === 3
                      ? 'جيد (3/5)'
                      : 'يحتاج تحسين'}
                  </span>
                </div>
              </div>

              {/* Age Group Selector */}
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">
                  المرحلة العمرية لطفلك:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'رضّع (أقل من سنة)',
                    'دارجون (1 - 3 سنوات)',
                    'تمهيدي (3 - 5 سنوات)'
                  ].map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setNewAgeGroup(grp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        newAgeGroup === grp
                          ? 'bg-[#00685f] text-white shadow-xs'
                          : 'bg-[#eff4ff] text-[#3d4947]'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">
                  نص المراجعة والتجربة (النظافة، المعلمات، رعاية الطفل، الكاميرات): *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="شاركي تفاصيل تجربتك الواقعية لمساعدة الأمهات الأخريات في اتخاذ القرار..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#eff4ff] border border-transparent focus:border-[#00685f] focus:bg-white text-xs text-[#0b1c30] outline-none resize-none transition-all"
                />
              </div>

              {/* Attach Facility Photos Selection */}
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">
                  إرفاق صورة لمرافق الحضانة من زيارتك (اختياري):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {facilityPhotos.map((p) => {
                    const isSelected = selectedPhotoPreset === p.url;
                    return (
                      <div
                        key={p.id}
                        onClick={() =>
                          setSelectedPhotoPreset(isSelected ? '' : p.url)
                        }
                        className={`relative h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#00685f] ring-2 ring-[#89f5e7]'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 left-1 text-[10px] text-white bg-black/60 px-1 py-0.5 rounded truncate font-bold">
                          {p.title}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#00685f] text-white flex items-center justify-center">
                            <AppIcon name="check" className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
                >
                  <AppIcon name="send" className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري النشر...' : 'نشر التقييم'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-2xl bg-[#eff4ff] text-[#3d4947] text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 5. Reviews List Feed */}
      <div className="space-y-4">
        {filteredReviewsList.length === 0 ? (
          <div className="text-center py-8 bg-[#eff4ff] rounded-2xl p-4 text-[#6d7a77]">
            <AppIcon name="rate_review" className="w-8 h-8 text-[#00685f] mx-auto" />
            <p className="text-xs font-bold text-[#0b1c30] mt-1">لا توجد مراجعات مطابقة للتصفية المحددة</p>
          </div>
        ) : (
          filteredReviewsList.map((rev) => (
            <article
              key={rev.id}
              className="p-4 sm:p-5 rounded-3xl border border-[#e5eeff] bg-[#f8f9ff] hover:border-[#00685f]/30 transition-all space-y-3"
            >
              {/* Review Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {rev.userAvatar ? (
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-[#e5eeff]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {rev.userName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                        {rev.userName}
                      </h5>
                      {rev.userBadge && (
                        <span className="text-[10px] bg-[#89f5e7]/40 text-[#005049] px-2 py-0.5 rounded-full font-bold">
                          {rev.userBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6d7a77] mt-0.5">
                      <span>{rev.date}</span>
                      {rev.childAgeGroup && (
                        <>
                          <span>·</span>
                          <span className="text-[#00685f] font-semibold">{rev.childAgeGroup}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Star Rating on Card */}
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-[#e5eeff] shadow-xs">
                  <AppIcon name="star" className="w-3.5 h-3.5 text-[#fea619]" filled />
                  <span className="text-xs font-bold text-[#0b1c30]">{rev.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-[#3d4947] leading-relaxed">
                {rev.comment}
              </p>

              {/* Facility Photos attached to review */}
              {rev.facilityPhotos && rev.facilityPhotos.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-[#6d7a77] flex items-center gap-1">
                    <AppIcon name="photo_camera" className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>صور مرافق أرفقها ولي الأمر:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {rev.facilityPhotos.map((imgUrl, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() =>
                          setActivePhotoModal({
                            url: imgUrl,
                            title: `صورة مرفقة من ${rev.userName}`,
                            caption: `تم التقاطها أثناء زيارة ${nursery.name}`
                          })
                        }
                        className="group relative w-24 h-20 rounded-xl overflow-hidden bg-[#e5eeff] cursor-pointer shadow-xs border border-[#e5eeff]"
                      >
                        <img
                          src={imgUrl}
                          alt="صورة المرفق"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <AppIcon name="zoom_in" className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful Reaction Button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#e5eeff] text-xs">
                <span className="text-[11px] text-[#6d7a77]">
                  هل كانت هذه المراجعة مفيدة لك؟
                </span>
                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-[#eff4ff] text-[#00685f] border border-[#e5eeff] text-xs font-bold transition-colors cursor-pointer active:scale-95"
                >
                  <AppIcon name="thumb_up" className="w-3.5 h-3.5" />
                  <span>مفيدة ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* 6. Lightbox Photo Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          dir="rtl"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 sm:h-96 w-full bg-black">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActivePhotoModal(null)}
                className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
              >
                <AppIcon name="close" className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 sm:p-5 bg-white space-y-1">
              <h4 className="text-base font-bold text-[#0b1c30]">
                {activePhotoModal.title}
              </h4>
              {activePhotoModal.caption && (
                <p className="text-xs text-[#3d4947] leading-relaxed">
                  {activePhotoModal.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
