import React, { useState, useEffect } from 'react';
import { AppIcon } from './AppIcon.tsx';
import { UserRole, UserProfile, NurseryRegistrationRequest, QuickContactInquiry, UserReview, TourBooking } from '../types.ts';
import {
  fetchAllAdminData,
  approveNurseryRequest,
  rejectNurseryRequest,
  moderateReviewStatus,
  deleteReviewDocument,
  updateUserRoleInDb
} from '../lib/firebase.ts';
import { NURSERIES_DATA } from '../data/nurseries.ts';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSwitchRole: (newRole: UserRole) => void;
  currentUserEmail?: string;
  onApproveNurseryToLive?: (request: NurseryRegistrationRequest) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSwitchRole,
  currentUserEmail,
  onApproveNurseryToLive
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'reviews' | 'users' | 'bookings' | 'tester'>('requests');
  const [loading, setLoading] = useState(false);

  // Data states
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [nurseryRequests, setNurseryRequests] = useState<NurseryRegistrationRequest[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [tourBookings, setTourBookings] = useState<(TourBooking & { id: string; status: string; createdAt: string })[]>([]);
  const [quickContacts, setQuickContacts] = useState<QuickContactInquiry[]>([]);

  // Action feedback
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllAdminData();

      // Demo Mode: users are purely simulated local profiles to protect privacy
      const initialUsers: UserProfile[] = [
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

      const initialRequests: NurseryRegistrationRequest[] = data.nurseryRequests.length > 0 ? data.nurseryRequests : [
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

      const initialReviews: UserReview[] = data.reviews.length > 0 ? data.reviews : [
        {
          id: 'rev-201',
          nurseryId: 1,
          nurseryName: 'حضانة عالم الصغار الإبداعية',
          userId: 'user-parent-1',
          userName: 'أم ريان',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
          rating: 5,
          date: 'اليوم',
          comment: 'تجربة رائعة جداً، طفلي ريان تحسن نطقه بشكل ملحوظ والمعلمات متفانيات وقمة في اللطافة. البث المباشر يمنحني راحة بال طوال ساعات الدوام.',
          childAgeGroup: 'دارجون (1 - 3 سنوات)',
          status: 'approved',
          helpfulCount: 14,
          verifiedParent: true
        },
        {
          id: 'rev-202',
          nurseryId: 2,
          nurseryName: 'حضانة خطواتي الأولى',
          userId: 'user-parent-2',
          userName: 'عبدالله التميمي',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          rating: 5,
          date: 'أمس',
          comment: 'الاهتمام بالنظافة والتعقيم عالي جداً والممرضة متواجدة باستمرار. الطعام صحي ومتنوع وابنتي سعيدة جداً بألعاب المونتيسوري.',
          childAgeGroup: 'ما قبل الروضة (3 - 5 سنوات)',
          status: 'pending',
          helpfulCount: 6,
          verifiedParent: true
        },
        {
          id: 'rev-203',
          nurseryId: 3,
          nurseryName: 'روضة رياض الصالحين الأهلية',
          userId: 'user-parent-3',
          userName: 'سارة العتيبي',
          rating: 4,
          date: 'منذ يومين',
          comment: 'المبنى فسيح والحديقة الخارجية مجهزة بأرضيات مطاطية آمنة. نأمل فقط تمديد ساعات الدوام المسائي قليلاً.',
          childAgeGroup: 'رضّع (3 شهور - سنة)',
          status: 'pending',
          helpfulCount: 3,
          verifiedParent: true
        }
      ];

      const initialBookings = data.tourBookings.length > 0 ? data.tourBookings : [
        {
          id: 'tour-301',
          nurseryId: 1,
          nurseryName: 'حضانة عالم الصغار الإبداعية',
          parentName: 'هند الدوسري',
          parentPhone: '0559988771',
          childAge: 'سنتان',
          visitDate: '2026-10-16',
          timeSlot: '10:00 صباحاً',
          notes: 'أود مقابلة مشرفة قسم منتسوري ومعاينة الفصول.',
          status: 'confirmed',
          createdAt: '2026-10-13'
        },
        {
          id: 'tour-302',
          nurseryId: 2,
          nurseryName: 'حضانة خطواتي الأولى',
          parentName: 'خالد المطيري',
          parentPhone: '0501239999',
          childAge: '8 شهور (رضيع)',
          visitDate: '2026-10-18',
          timeSlot: '01:00 ظهراً',
          notes: 'الاستفسار عن اشتراطات قسم الرضع والرضاعة الطبيعية.',
          status: 'pending',
          createdAt: '2026-10-14'
        }
      ];

      const initialContacts: QuickContactInquiry[] = data.quickContacts.length > 0 ? data.quickContacts : [
        {
          id: 'cnt-401',
          centerName: 'أكاديمية النجوم الصغار',
          contactPerson: 'أ. ريم الشريف',
          phone: '0543216789',
          email: 'rim@stars-academy.sa',
          city: 'الرياض',
          inquiryType: 'join',
          message: 'نود الانضمام لشبكة الحضانات واستعراض خدماتنا لأولياء الأمور.',
          createdAt: '2026-10-13',
          status: 'new'
        }
      ];

      setUsers(initialUsers);
      setNurseryRequests(initialRequests);
      setReviews(initialReviews);
      setTourBookings(initialBookings);
      setQuickContacts(initialContacts);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Actions
  const handleApproveRequest = async (request: NurseryRegistrationRequest) => {
    try {
      await approveNurseryRequest(request.id);
      setNurseryRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: 'approved' } : r))
      );
      if (onApproveNurseryToLive) {
        onApproveNurseryToLive(request);
      }
      showNotification(`✅ تم اعتماد الحضانة "${request.centerName}" بنجاح ونشرها في الدليل!`);
    } catch (err) {
      console.error(err);
      showNotification('تعذر الاعتماد حالياً');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectNurseryRequest(requestId);
      setNurseryRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
      );
      showNotification('❌ تم رفض طلب تسجيل الحضانة وإشعار المركز.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await moderateReviewStatus(reviewId, 'approved');
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
      );
      showNotification('✨ تم توثيق واعتماد التقييم ليظهر في بطاقة الحضانة!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReviewDocument(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showNotification('🗑️ تم حذف التقييم غير المطابق.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRoleInDb(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === userId ? { ...u, role: newRole } : u))
      );
      showNotification(`تم تحديث دور المستخدم إلى (${newRole === 'admin' ? 'مدير منصة' : newRole === 'owner' ? 'صاحب حضانة' : 'ولي أمر'})`);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingRequestsCount = nurseryRequests.filter((r) => r.status === 'pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-5xl bg-[#f8f9ff] rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border border-[#00685f]/20">
        {/* Header */}
        <div className="bg-[#00685f] text-white p-4 sm:p-6 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-[#89f5e7] shadow-inner">
              <AppIcon name="admin_panel_settings" className="w-7 h-7 text-[#89f5e7]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">لوحة تحكم المشرف العام (Admin Dashboard)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fea619] text-[#684000]">
                  صلاحيات كاملة
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950">
                  وضع تجريبي - بيانات غير حقيقية
                </span>
              </div>
              <p className="text-xs text-[#89f5e7] mt-0.5">
                متابعة المستخدمين المسجلين، اعتماد الحضانات الجديدة، وإدارة التقييمات والحجوزات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Quick Refresh */}
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="تحديث البيانات"
            >
              <AppIcon name="refresh" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            >
              <AppIcon name="close" className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Action Notice Bar */}
        {actionNotice && (
          <div className="bg-[#89f5e7] text-[#003732] px-4 py-2.5 text-xs font-bold text-center animate-in slide-in-from-top duration-150 flex items-center justify-center gap-2">
            <AppIcon name="check_circle" className="w-4 h-4 text-[#00685f]" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-5 bg-white border-b border-[#e5eeff] shrink-0">
          <div className="p-3 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00685f]/15 text-[#00685f] flex items-center justify-center font-bold">
              <AppIcon name="group" className="w-5 h-5 text-[#00685f]" />
            </div>
            <div>
              <span className="text-xs text-[#6d7a77] block font-medium">المستخدمين المسجلين</span>
              <span className="text-lg font-extrabold text-[#0b1c30]">{users.length} مستخدم</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#fff8e6] border border-[#ffe5a3] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fea619]/20 text-[#684000] flex items-center justify-center font-bold">
              <AppIcon name="domain_verification" className="w-5 h-5 text-[#684000]" />
            </div>
            <div>
              <span className="text-xs text-[#684000] block font-medium">طلبات الحضانات</span>
              <span className="text-lg font-extrabold text-[#684000]">
                {pendingRequestsCount} بانتظار الاعتماد
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#eefaf7] border border-[#c3eee4] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008378]/20 text-[#00685f] flex items-center justify-center font-bold">
              <AppIcon name="rate_review" className="w-5 h-5 text-[#00685f]" />
            </div>
            <div>
              <span className="text-xs text-[#00685f] block font-medium">التقييمات الواردة</span>
              <span className="text-lg font-extrabold text-[#0b1c30]">
                {reviews.length} تقييم ({pendingReviewsCount} معلق)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#f5efff] border border-[#e5d8ff] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6f42c1]/20 text-[#6f42c1] flex items-center justify-center font-bold">
              <AppIcon name="calendar_month" className="w-5 h-5 text-[#6f42c1]" />
            </div>
            <div>
              <span className="text-xs text-[#6f42c1] block font-medium">طلبات الجولات والاستفسار</span>
              <span className="text-lg font-extrabold text-[#0b1c30]">
                {tourBookings.length + quickContacts.length} طلب
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e5eeff] bg-white px-4 sm:px-6 overflow-x-auto no-scrollbar shrink-0 gap-2">
          {[
            { id: 'requests', label: 'طلبات تسجيل الحضانات', count: pendingRequestsCount, icon: 'school' },
            { id: 'reviews', label: 'التقييمات الواردة وإدارتها', count: pendingReviewsCount, icon: 'rate_review' },
            { id: 'users', label: 'المستخدمين والأدوار', count: users.length, icon: 'manage_accounts' },
            { id: 'bookings', label: 'حجوزات الجولات والاستفسارات', count: tourBookings.length, icon: 'event_note' },
            { id: 'tester', label: 'مصفوفة اختبار الصلاحيات (RBAC)', count: null, icon: 'security' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#00685f] text-[#00685f] bg-[#eff4ff]/60'
                  : 'border-transparent text-[#6d7a77] hover:text-[#0b1c30]'
              }`}
            >
              <AppIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-[#fea619] text-[#684000]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: NURSERY REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#dce9ff] flex items-start gap-3">
                <AppIcon name="info" className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <div className="text-xs text-[#0b1c30] leading-relaxed">
                  <strong className="text-[#00685f] block text-sm mb-0.5">ضابط الصلاحيات الصارم (Access Control):</strong>
                  عندما يقدّم مالك الحضانة طلب التسجيل، تظل حالتها تلقائياً <strong>«قيد المراجعة»</strong>. 
                  لا يستطيع المالك اعتماد ونشر حضانته بنفسه أبداً، والاعتماد حصري لمشرف منصة روضتي بعد التحقق من رخصة وزارة التعليم.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {nurseryRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  return (
                    <div
                      key={req.id}
                      className={`p-5 rounded-3xl bg-white border transition-all shadow-xs ${
                        isPending
                          ? 'border-[#fea619]/40 bg-linear-to-r from-white to-[#fffcf5]'
                          : isApproved
                          ? 'border-[#008378]/30 bg-linear-to-r from-white to-[#f4fcf9]'
                          : 'border-red-200 bg-red-50/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                            isApproved ? 'bg-[#008378]/15 text-[#00685f]' : 'bg-[#fea619]/20 text-[#684000]'
                          }`}>
                            <AppIcon name="school" className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-[#0b1c30]">{req.centerName}</h3>
                            <p className="text-xs text-[#6d7a77]">
                              {req.city} - {req.district} · تاريخ التقديم: {req.createdAt}
                            </p>
                          </div>
                        </div>

                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#fff8e6] text-[#684000] border border-[#fea619]/40">
                              <AppIcon name="pending" className="w-3.5 h-3.5 text-[#fea619]" />
                              بانتظار موافقة الإدارة
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#e6f8f4] text-[#00685f] border border-[#008378]/40">
                              <AppIcon name="check_circle" className="w-3.5 h-3.5 text-[#00685f]" />
                              منشورة في الدليل ✓
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                              <AppIcon name="cancel" className="w-3.5 h-3.5 text-red-700" />
                              طلب مرفوض
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#e5eeff] text-xs">
                        <div>
                          <span className="text-[#6d7a77] block text-[11px]">رقم الترخيص:</span>
                          <span className="font-bold text-[#0b1c30]">{req.licenseNumber || 'قيد المراجعة'}</span>
                        </div>
                        <div>
                          <span className="text-[#6d7a77] block text-[11px]">المسؤولة / المديرة:</span>
                          <span className="font-bold text-[#0b1c30]">{req.managerName}</span>
                        </div>
                        <div>
                          <span className="text-[#6d7a77] block text-[11px]">رقم الجوال:</span>
                          <a href={`tel:${req.managerPhone}`} className="font-bold text-[#00685f] hover:underline" dir="ltr">
                            {req.managerPhone}
                          </a>
                        </div>
                        <div>
                          <span className="text-[#6d7a77] block text-[11px]">الرسوم المقترحة:</span>
                          <span className="font-bold text-[#0b1c30]">{req.price || 2200} ر.س / شهرياً</span>
                        </div>
                      </div>

                      {req.notes && (
                        <p className="text-xs text-[#3d4947] bg-[#eff4ff]/60 p-2.5 rounded-xl my-3">
                          📝 <strong>ملاحظات المركز:</strong> {req.notes}
                        </p>
                      )}

                      {/* Admin Decision Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/966${req.managerPhone.replace(/^0/, '')}?text=${encodeURIComponent(`السلام عليكم، نتواصل معكم من إدارة منصة روضتي بخصوص طلب اعتماد مركز (${req.centerName})`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-[#00685f] text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <AppIcon name="chat" className="w-3.5 h-3.5 text-[#00685f]" />
                            <span>محادثة واتساب للمطابقة</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleRejectRequest(req.id)}
                                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer"
                              >
                                رفض الطلب
                              </button>
                              <button
                                onClick={() => handleApproveRequest(req)}
                                className="px-5 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                              >
                                <AppIcon name="verified" className="w-4 h-4 text-white" />
                                <span>اعتماد الحضانة ونشرها فوراً</span>
                              </button>
                            </>
                          )}
                          {isApproved && (
                            <span className="text-xs text-[#00685f] font-bold flex items-center gap-1">
                              <AppIcon name="task_alt" className="w-4 h-4 text-[#00685f]" />
                              الحضانة منشورة وظاهرة لجميع أولياء الأمور
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#dce9ff] flex items-start gap-3">
                <AppIcon name="rate_review" className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <div className="text-xs text-[#0b1c30] leading-relaxed">
                  <strong className="text-[#00685f] block text-sm mb-0.5">💬 أين تذهب تقييمات أولياء الأمور؟</strong>
                  عندما يقوم ولي الأمر بإرسال تقييم أو رفع صور لمرافق الحضانة، يتم حفظها في قاعدة بيانات Firestore وتصل مباشرة إلى هذه اللوحة للمشرف العام، حيث يمكنك اعتمادها، توثيقها بشارة التحقق، أو حذف أي تعليقات مسيئة.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e5eeff] shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {rev.userAvatar ? (
                          <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full object-cover border border-[#00685f]/30" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-sm">
                            {rev.userName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#0b1c30]">{rev.userName}</h4>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#89f5e7]/30 text-[#00685f]">
                              {rev.userBadge || 'ولي أمر مسجّل'}
                            </span>
                          </div>
                          <span className="text-xs text-[#6d7a77]">
                            الحضانة: {rev.nurseryName || `حضانة رقم #${rev.nurseryId}`} · {rev.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[#fea619] font-bold text-xs bg-[#fff8e6] px-2.5 py-1 rounded-full">
                          <span>{rev.rating}</span>
                          <AppIcon name="star" className="w-3.5 h-3.5 text-[#fea619]" filled />
                        </div>
                        {rev.status === 'approved' ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e6f8f4] text-[#00685f] border border-[#008378]/30">
                            منشور ✓
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#fff8e6] text-[#684000] border border-[#fea619]/40">
                            قيد المراجعة
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#3d4947] leading-relaxed bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff]">
                      "{rev.comment}"
                    </p>

                    {rev.childAgeGroup && (
                      <span className="inline-block text-[11px] text-[#6d7a77]">
                        الفئة العمرية للطفل: <strong>{rev.childAgeGroup}</strong>
                      </span>
                    )}

                    {rev.facilityPhotos && rev.facilityPhotos.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-[#6d7a77]">الصور المرفقة:</span>
                        {rev.facilityPhotos.map((photo, i) => (
                          <img key={i} src={photo} alt="مرفق" className="w-14 h-14 rounded-xl object-cover border border-[#e5eeff]" />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#f0f4ff]">
                      <span className="text-xs text-[#6d7a77]">
                        مفيد لـ {rev.helpfulCount || 0} من أولياء الأمور
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          حذف التقييم
                        </button>
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <AppIcon name="verified" className="w-3.5 h-3.5 text-white" />
                            <span>توثيق ونشر التقييم</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REGISTERED USERS & ROLES */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#dce9ff] flex items-start gap-3">
                <AppIcon name="manage_accounts" className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <div className="text-xs text-[#0b1c30] leading-relaxed">
                  <strong className="text-[#00685f] block text-sm mb-0.5">سجل الحسابات وصلاحيات الأدوار:</strong>
                  هنا يظهر جميع الأشخاص الذين سجّلوا دخولهم بحساب Google أو بالهاتف. بصفتك مشرفاً، يمكنك ترقية أو تغيير دور أي مستخدم للاختبار والتحقق الفوري.
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#e5eeff] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-[#eff4ff] text-[#00685f] font-bold border-b border-[#e5eeff]">
                      <tr>
                        <th className="p-3.5 text-start">المستخدم</th>
                        <th className="p-3.5 text-start">البريد الإلكتروني</th>
                        <th className="p-3.5 text-start">رقم الهاتف</th>
                        <th className="p-3.5 text-start">الدور الحالي</th>
                        <th className="p-3.5 text-start">تعديل الصلاحية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f4ff]">
                      {users.map((u) => (
                        <tr key={u.uid} className="hover:bg-[#f8f9ff]">
                          <td className="p-3.5 font-bold text-[#0b1c30]">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#00685f]/15 text-[#00685f] flex items-center justify-center font-bold text-xs">
                                {u.displayName.charAt(0)}
                              </div>
                              <span>{u.displayName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-[#3d4947]" dir="ltr">{u.email}</td>
                          <td className="p-3.5 text-[#3d4947]" dir="ltr">{u.phone || '05XXXXXXXX'}</td>
                          <td className="p-3.5">
                            {u.role === 'admin' ? (
                              <span className="px-2.5 py-1 rounded-full bg-[#00685f] text-white font-bold text-[11px]">
                                👑 مدير المنصة (Admin)
                              </span>
                            ) : u.role === 'owner' ? (
                              <span className="px-2.5 py-1 rounded-full bg-[#fea619] text-[#684000] font-bold text-[11px]">
                                🏫 صاحب حضانة (Owner)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#00685f] font-bold text-[11px]">
                                👨‍👩‍👧 ولي أمر (Parent)
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeUserRole(u.uid, e.target.value as UserRole)}
                              className="px-2.5 py-1.5 rounded-xl border border-[#e5eeff] bg-white text-xs font-semibold outline-none cursor-pointer"
                            >
                              <option value="parent">ولي أمر (Parent)</option>
                              <option value="owner">صاحب حضانة (Owner)</option>
                              <option value="admin">مدير المنصة (Admin)</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKINGS & INQUIRIES */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tour Bookings */}
                <div className="bg-white p-5 rounded-3xl border border-[#e5eeff] shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0f4ff]">
                    <h3 className="font-bold text-sm text-[#0b1c30] flex items-center gap-2">
                      <AppIcon name="calendar_month" className="w-4 h-4 text-[#00685f]" />
                      <span>طلبات حجز الجولات التعريفية</span>
                    </h3>
                    <span className="text-xs font-bold text-[#00685f]">{tourBookings.length} طلب</span>
                  </div>

                  <div className="space-y-2.5">
                    {tourBookings.map((b) => (
                      <div key={b.id} className="p-3 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#0b1c30]">{b.parentName}</strong>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00685f]/15 text-[#00685f]">
                            {b.timeSlot}
                          </span>
                        </div>
                        <p className="text-[#6d7a77]">الحضانة: {b.nurseryName}</p>
                        <p className="text-[#6d7a77]">الموعد: {b.visitDate} · عمر الطفل: {b.childAge}</p>
                        <a href={`tel:${b.parentPhone}`} className="text-[#00685f] font-bold block pt-1 hover:underline" dir="ltr">
                          📞 {b.parentPhone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Contacts */}
                <div className="bg-white p-5 rounded-3xl border border-[#e5eeff] shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0f4ff]">
                    <h3 className="font-bold text-sm text-[#0b1c30] flex items-center gap-2">
                      <AppIcon name="contact_mail" className="w-4 h-4 text-[#fea619]" />
                      <span>رسائل التواصل السريع (الفوتر)</span>
                    </h3>
                    <span className="text-xs font-bold text-[#684000]">{quickContacts.length} رسالة</span>
                  </div>

                  <div className="space-y-2.5">
                    {quickContacts.map((c) => (
                      <div key={c.id} className="p-3 rounded-2xl bg-[#fffcf5] border border-[#fea619]/20 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#0b1c30]">{c.centerName}</strong>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fea619]/20 text-[#684000]">
                            {c.city}
                          </span>
                        </div>
                        <p className="text-[#3d4947]">المسؤول: {c.contactPerson} ({c.email})</p>
                        <p className="text-[#6d7a77] italic">"{c.message}"</p>
                        <a href={`tel:${c.phone}`} className="text-[#00685f] font-bold block pt-1 hover:underline" dir="ltr">
                          📞 {c.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ROLE PERMISSIONS TESTER */}
          {activeTab === 'tester' && (
            <div className="space-y-4">
              <div className="bg-[#eff4ff] p-5 rounded-3xl border border-[#dce9ff] space-y-2">
                <h3 className="text-sm font-extrabold text-[#00685f] flex items-center gap-2">
                  <AppIcon name="security" className="w-5 h-5 text-[#00685f]" />
                  <span>محاكي واختبار الصلاحيات والأدوار المباشر (RBAC Testing Matrix)</span>
                </h3>
                <p className="text-xs text-[#3d4947] leading-relaxed">
                  يمكنك النقر على أي من الأزرار أدناه للتبديل الفوري بين أدوار المستخدمين وتجربة الموقع بنفسك للتحقق من أن كل قاعدة مفروضة بشكل صارم.
                </p>
              </div>

              {/* Quick Switch Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentRole === 'parent' ? 'border-[#00685f] bg-[#e6f8f4] shadow-sm' : 'border-[#e5eeff] bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0b1c30]">👨‍👩‍👧 ولي أمر (Parent)</span>
                    {currentRole === 'parent' && <span className="text-[11px] font-extrabold text-[#00685f]">الدور النشط</span>}
                  </div>
                  <ul className="text-xs text-[#6d7a77] space-y-1 mb-4">
                    <li>✅ البحث والتصفية المتقدمة</li>
                    <li>✅ حجز الجولات والاستشارات</li>
                    <li>✅ إضافة تقييمات وصور للمرافق</li>
                    <li className="text-red-600 font-bold">❌ لا يمكنه تعديل أي حضانة</li>
                    <li className="text-red-600 font-bold">❌ لا يمكنه دخول لوحة الأدمن</li>
                  </ul>
                  <button
                    onClick={() => {
                      onSwitchRole('parent');
                      showNotification('تم التحويل إلى دور «ولي أمر» — لن يظهر لك زر تعديل الحضانة');
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      currentRole === 'parent'
                        ? 'bg-[#00685f] text-white'
                        : 'bg-[#eff4ff] text-[#00685f] hover:bg-[#dce9ff]'
                    }`}
                  >
                    تجربة الموقع كـ ولي أمر
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  currentRole === 'owner' ? 'border-[#fea619] bg-[#fffcf5] shadow-sm' : 'border-[#e5eeff] bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0b1c30]">🏫 مالك حضانة (Owner)</span>
                    {currentRole === 'owner' && <span className="text-[11px] font-extrabold text-[#684000]">الدور النشط</span>}
                  </div>
                  <ul className="text-xs text-[#6d7a77] space-y-1 mb-4">
                    <li>✅ تقديم طلب تسجيل حضانة جديدة</li>
                    <li>✅ تعديل بيانات حضانته (الرسوم، السعة، الواتساب)</li>
                    <li>✅ متابعة طلبات الجولات لمركزه</li>
                    <li className="text-red-600 font-bold">❌ لا يمكنه اعتماد حضانته بنفسه!</li>
                    <li className="text-red-600 font-bold">❌ تظل الحضانة معلقة حتى يوافق الأدمن</li>
                  </ul>
                  <button
                    onClick={() => {
                      onSwitchRole('owner');
                      showNotification('تم التحويل إلى دور «مالك حضانة» — يمكنك تقديم وتعديل الحضانة ولكن لن تستطيع اعتمادها بنفسك');
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      currentRole === 'owner'
                        ? 'bg-[#fea619] text-[#684000]'
                        : 'bg-[#fff8e6] text-[#684000] hover:bg-[#ffe5a3]'
                    }`}
                  >
                    تجربة الموقع كـ مالك حضانة
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  currentRole === 'admin' ? 'border-[#008378] bg-[#eefaf7] shadow-sm' : 'border-[#e5eeff] bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0b1c30]">👑 مدير المنصة (Admin)</span>
                    {currentRole === 'admin' && <span className="text-[11px] font-extrabold text-[#00685f]">الدور النشط</span>}
                  </div>
                  <ul className="text-xs text-[#6d7a77] space-y-1 mb-4">
                    <li>✅ اعتماد أو رفض طلبات الحضانات</li>
                    <li>✅ مراجعة وتوثيق وحذف التقييمات</li>
                    <li>✅ الاطلاع على سجل جميع المسجلين</li>
                    <li>✅ إدارة وتعديل كامل محتوى المنصة</li>
                    <li>✅ الوصول للوحة التحكم الشاملة</li>
                  </ul>
                  <button
                    onClick={() => {
                      onSwitchRole('admin');
                      showNotification('أنت الآن تعمل بصلاحيات «مدير المنصة» الكاملة');
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      currentRole === 'admin'
                        ? 'bg-[#00685f] text-white'
                        : 'bg-[#eff4ff] text-[#00685f] hover:bg-[#dce9ff]'
                    }`}
                  >
                    تفعيل صلاحيات الأدمن
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#6d7a77]">
            <AppIcon name="lock" className="w-4 h-4 text-[#00685f]" />
            <span>نظام الحماية مفعل عبر قواعد <strong>Firestore Security Rules</strong> المشفرة.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00685f] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95"
          >
            إغلاق لوحة الإدارة
          </button>
        </div>
      </div>
    </div>
  );
};
