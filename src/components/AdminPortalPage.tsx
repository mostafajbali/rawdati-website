import React, { useState, useMemo } from 'react';
import { AppIcon } from './AppIcon.tsx';
import { RawdatiLogo } from './RawdatiLogo.tsx';
import {
  UserProfile,
  NurseryRegistrationRequest,
  QuickContactInquiry,
  UserReview,
  TourBooking,
  Nursery
} from '../types.ts';

interface AdminPortalPageProps {
  isAdminLoggedIn: boolean;
  onAdminLogin: (email: string) => boolean;
  onAdminLogout: () => void;
  onReturnToPublic: () => void;
  users: UserProfile[];
  onUpdateUserRole: (uid: string, newRole: 'parent' | 'owner' | 'admin') => void;
  nurseryRequests: NurseryRegistrationRequest[];
  onApproveRequest: (req: NurseryRegistrationRequest) => void;
  onRejectRequest: (reqId: string, reason?: string) => void;
  reviews: UserReview[];
  onApproveReview: (reviewId: string) => void;
  onRejectReview: (reviewId: string) => void;
  tourBookings: (TourBooking & { id: string; status: string; createdAt: string })[];
  quickContacts: QuickContactInquiry[];
  nurseries: Nursery[];
  onOpenEditNursery: (nursery: Nursery) => void;
  onDeleteNursery: (id: number) => void;
  onAddNewNurseryDirect: (nursery: Partial<Nursery>) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
  onReturnToPublic,
  users,
  onUpdateUserRole,
  nurseryRequests,
  onApproveRequest,
  onRejectRequest,
  reviews,
  onApproveReview,
  onRejectReview,
  tourBookings,
  quickContacts,
  nurseries,
  onOpenEditNursery,
  onDeleteNursery,
  onAddNewNurseryDirect
}) => {
  // Login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<'requests' | 'users' | 'reviews' | 'nurseries' | 'bookings'>('requests');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'parent' | 'owner' | 'admin'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // New Nursery Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNurseryName, setNewNurseryName] = useState('');
  const [newNurseryCity, setNewNurseryCity] = useState('الرياض');
  const [newNurseryDistrict, setNewNurseryDistrict] = useState('');
  const [newNurseryPrice, setNewNurseryPrice] = useState(2500);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLoginFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const emailVal = adminEmail.trim().toLowerCase();
    const passVal = adminPassword.trim();

    if (!emailVal) {
      setLoginError('يرجى كتابة اسم المستخدم أو البريد الإلكتروني للمشرف');
      return;
    }

    if (passVal !== 'admin123' && passVal.length < 4) {
      setLoginError('كلمة المرور غير صحيحة');
      return;
    }

    const success = onAdminLogin(emailVal);
    if (!success) {
      setLoginError('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.displayName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(userSearchQuery));
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchSearch && matchRole;
    });
  }, [users, userSearchQuery, userRoleFilter]);

  // Statistics
  const pendingRequestsCount = nurseryRequests.filter((r) => r.status === 'pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const totalParents = users.filter((u) => u.role === 'parent').length;
  const totalOwners = users.filter((u) => u.role === 'owner').length;

  // View A: Dedicated Admin Login Page
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#021f1d] via-[#05322e] to-[#011413] text-white flex flex-col justify-between" dir="rtl">
        {/* Top Minimal Bar */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <RawdatiLogo size={36} />
            <div>
              <span className="font-extrabold text-lg text-white block">منصة روضتي</span>
              <span className="text-[11px] text-[#89f5e7] block font-mono">بوابة الإدارة المركزية (Admin Portal)</span>
            </div>
          </div>

          <button
            onClick={onReturnToPublic}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            <AppIcon name="home" className="w-4 h-4 text-[#89f5e7]" />
            <span>العودة للموقع العام للزوار</span>
          </button>
        </header>

        {/* Center Login Box */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#89f5e7]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#fea619]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-6 space-y-2 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#00685f] to-[#008378] border border-[#89f5e7]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#00685f]/30">
                <AppIcon name="admin_panel_settings" className="w-7 h-7 text-[#89f5e7]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                تسجيل دخول المشرف العام
              </h1>
              <p className="text-xs text-slate-300">
                صفحة خاصة بمشرفي النظام ومراقبة الحضانات والمستخدمين
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
                <AppIcon name="info" className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginFormSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  اسم المستخدم أو البريد الإلكتروني للمشرف
                </label>
                <div className="flex items-center gap-2 bg-black/20 border border-white/20 rounded-xl px-3 py-2.5 focus-within:border-[#89f5e7] focus-within:bg-black/30 transition-all">
                  <AppIcon name="person" className="w-4 h-4 text-[#89f5e7]" />
                  <input
                    type="text"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="اسم المستخدم أو البريد"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  كلمة المرور
                </label>
                <div className="flex items-center gap-2 bg-black/20 border border-white/20 rounded-xl px-3 py-2.5 focus-within:border-[#89f5e7] focus-within:bg-black/30 transition-all">
                  <AppIcon name="lock" className="w-4 h-4 text-[#89f5e7]" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-linear-to-r from-[#008378] to-[#00a896] hover:from-[#009b8c] hover:to-[#02c39a] text-white font-extrabold text-sm shadow-lg shadow-[#008378]/40 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <AppIcon name="verified_user" className="w-4 h-4 text-[#89f5e7]" />
                <span>دخول لوحة تحكم المشرف</span>
              </button>
            </form>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="px-6 py-4 text-center text-xs text-slate-400 border-t border-white/10">
          <span>بوابة الإدارة المستقلة لمنصة روضتي © 2026 - جميع الحقوق محفوظة</span>
        </footer>
      </div>
    );
  }

  // View B: Full Standalone Admin Dashboard
  return (
    <div className="min-h-screen bg-[#f3f6f9] text-[#0b1c30] flex flex-col font-sans" dir="rtl">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#004d47] text-white shadow-md border-b border-[#00685f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RawdatiLogo size={36} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base sm:text-lg text-white">لوحة تحكم المشرف العام</span>
                <span className="text-[10px] bg-[#89f5e7]/20 text-[#89f5e7] border border-[#89f5e7]/30 px-2 py-0.5 rounded-full font-bold">
                  مستقلة عن الموقع العام
                </span>
                <span className="text-[11px] bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-extrabold shadow-xs">
                  وضع تجريبي - بيانات غير حقيقية
                </span>
              </div>
              <span className="text-xs text-emerald-100/70 hidden sm:block">
                مراقبة الحضانات والمستخدمين والتقييمات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Public Website */}
            <button
              onClick={onReturnToPublic}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-white/15"
              title="معاينة الموقع العام كما يراه المستخدم"
            >
              <AppIcon name="visibility" className="w-4 h-4 text-[#89f5e7]" />
              <span className="hidden sm:inline">معاينة الموقع العام</span>
            </button>

            {/* Logout Admin */}
            <button
              onClick={onAdminLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <AppIcon name="logout" className="w-4 h-4 text-red-300" />
              <span>خروج المشرف</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2 border-t border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-white text-[#004d47] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <AppIcon name="domain" className="w-4 h-4" />
            <span>طلبات الحضانات الجديدة</span>
            {pendingRequestsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#fea619] text-[#684000] text-[11px] font-bold flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-white text-[#004d47] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <AppIcon name="group" className="w-4 h-4" />
            <span>المستخدمين المسجلين</span>
            <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-white text-[#004d47] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <AppIcon name="rate_review" className="w-4 h-4" />
            <span>اعتماد التقييمات والمراجعات</span>
            {pendingReviewsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#fea619] text-[#684000] text-[11px] font-bold flex items-center justify-center">
                {pendingReviewsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('nurseries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'nurseries'
                ? 'bg-white text-[#004d47] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <AppIcon name="storefront" className="w-4 h-4" />
            <span>إدارة الحضانات</span>
            <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
              {nurseries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-white text-[#004d47] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <AppIcon name="calendar_today" className="w-4 h-4" />
            <span>طلبات الحجز والاستشارات</span>
            <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
              {tourBookings.length + quickContacts.length}
            </span>
          </button>
        </div>
      </header>

      {/* Action Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#004d47] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#89f5e7]/40 animate-in slide-in-from-bottom duration-200">
          <AppIcon name="check_circle" className="w-5 h-5 text-[#89f5e7]" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Demo Mode Notice Banner */}
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>لوحة التحكم في وضع تجريبي (Demo Mode) — جميع العمليات والبيانات محاكاة ولا يتم عرض أو تخزين بيانات حقيقية</span>
          </div>
          <span className="bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-lg text-[11px] font-mono">Simulated Demo</span>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">الحضانات المنشورة</span>
              <AppIcon name="storefront" className="w-4 h-4 text-[#00685f]" />
            </div>
            <div className="text-2xl font-black text-[#0b1c30]">{nurseries.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">تظهر مباشرة بالدليل الحي</div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">طلبات قيد المراجعة</span>
              <AppIcon name="hourglass_empty" className="w-4 h-4 text-[#fea619]" />
            </div>
            <div className="text-2xl font-black text-[#fea619]">{pendingRequestsCount}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">من ملاك ومؤسسي الحضانات</div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">المستخدمين المسجلين</span>
              <AppIcon name="group" className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-[#0b1c30]">{users.length}</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">{totalParents} ولي أمر • {totalOwners} مالك</div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">تقييمات بالانتظار</span>
              <AppIcon name="rate_review" className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-[#0b1c30]">{pendingReviewsCount}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">تحتاج اعتماد قبل النشر</div>
          </div>
        </div>

        {/* TAB 1: Nursery Requests (طلبات الحضانات الجديدة) */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <AppIcon name="domain" className="w-5 h-5 text-[#00685f]" />
                  <span>طلبات تسجيل الحضانات الجديدة من الملاك</span>
                </h2>
                <p className="text-xs text-slate-500">
                  مراجعة التراخيص وبيانات الملاك، واعتماد ظهور الحضانة في الدليل العام للزوار فوراً.
                </p>
              </div>
            </div>

            {nurseryRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <AppIcon name="domain_disabled" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold">لا توجد طلبات تسجيل جديدة حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nurseryRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-[#00685f]/40 transition-all bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-[#0b1c30]">{req.centerName}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status === 'approved'
                            ? 'منشورة'
                            : req.status === 'rejected'
                            ? 'مرفوضة'
                            : 'قيد المراجعة'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">تاريخ التقديم: {req.createdAt}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block font-medium">المدينة والحي:</span>
                        <span className="font-bold text-slate-800">{req.city} - {req.district}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">المدير المسؤول:</span>
                        <span className="font-bold text-slate-800">{req.managerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">رقم التواصل:</span>
                        <span className="font-bold text-slate-800 font-mono">{req.managerPhone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">رقم ترخيص التعليم:</span>
                        <span className="font-bold text-slate-800 font-mono">{req.licenseNumber || 'قيد الإجراء'}</span>
                      </div>
                    </div>

                    {req.notes && (
                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
                        <strong className="text-[#00685f]">ملاحظات ومميزات الحضانة:</strong> {req.notes}
                      </p>
                    )}

                    {/* Admin Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      {req.status !== 'approved' && (
                        <button
                          onClick={() => {
                            onApproveRequest(req);
                            showNotice(`تم اعتماد "${req.centerName}" وإضافتها مباشرة للدليل الحي.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <AppIcon name="check_circle" className="w-4 h-4 text-[#89f5e7]" />
                          <span>اعتماد الحضانة وإضافتها للدليل الحي فوراً</span>
                        </button>
                      )}

                      {req.status !== 'rejected' && (
                        <button
                          onClick={() => {
                            onRejectRequest(req.id, 'لم تستوفِ الشروط');
                            showNotice(`تم رفض طلب الحضانة "${req.centerName}".`);
                          }}
                          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer border border-red-200"
                        >
                          <span>رفض الطلب</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Registered Users (المستخدمين المسجلين) */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <AppIcon name="group" className="w-5 h-5 text-[#00685f]" />
                  <span>دليل المستخدمين (وضع تجريبي للمعاينة)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  عرض حسابات تجريبية افتراضية للمعاينة فقط — لا يتم قراءة أو عرض أي بيانات أو هواتف لمستخدمين حقيقيين لحماية الخصوصية.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-xs flex-1 sm:w-64 border border-slate-200">
                  <AppIcon name="search" className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="بحث بالاسم أو الإيميل..."
                    className="w-full bg-transparent outline-none text-slate-700"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl outline-none cursor-pointer"
                >
                  <option value="all">كل الأدوار ({users.length})</option>
                  <option value="parent">أولياء الأمور ({totalParents})</option>
                  <option value="owner">ملاك الحضانات ({totalOwners})</option>
                  <option value="admin">المشرفين (Admins)</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 text-slate-600 border-b border-slate-200 font-bold">
                    <th className="p-3 text-start">المستخدم</th>
                    <th className="p-3 text-start">البريد الإلكتروني</th>
                    <th className="p-3 text-start">رقم الجوال</th>
                    <th className="p-3 text-start">نوع الحساب / الصلاحية</th>
                    <th className="p-3 text-start">تاريخ التسجيل</th>
                    <th className="p-3 text-start">إجراءات الصلاحية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#00685f]/10 text-[#00685f] font-bold flex items-center justify-center shrink-0">
                            {u.displayName.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.displayName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">UID: {u.uid.slice(0, 10)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-700">{u.email}</td>
                      <td className="p-3 font-mono text-slate-600">{u.phone || 'غير مسجل'}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'owner'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.role === 'admin' ? '👑 مشرف عام' : u.role === 'owner' ? '🏫 مالك حضانة' : '👨‍👩‍👧 ولي أمر'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{u.createdAt || 'مؤخراً'}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value as 'parent' | 'owner' | 'admin';
                            onUpdateUserRole(u.uid, newRole);
                            showNotice(`تم تغيير دور "${u.displayName}" إلى ${newRole}.`);
                          }}
                          className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-2 py-1 rounded-lg outline-none cursor-pointer"
                        >
                          <option value="parent">ولي أمر</option>
                          <option value="owner">مالك حضانة</option>
                          <option value="admin">مشرف أدمن</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Reviews Moderation (اعتماد التقييمات والمراجعات) */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <AppIcon name="rate_review" className="w-5 h-5 text-[#00685f]" />
                  <span>اعتماد مراجعات وتقييمات أولياء الأمور</span>
                </h2>
                <p className="text-xs text-slate-500">
                  فحص تقييمات أولياء الأمور قبل ظهورها على بطاقات الحضانات لمنع الإساءة وضمان المصداقية.
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <AppIcon name="rate_review" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold">لا توجد مراجعات حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0b1c30]">{rev.userName}</span>
                        <span className="text-xs text-slate-400">على: {rev.nurseryName || `حضانة رقم #${rev.nurseryId}`}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            rev.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rev.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rev.status === 'approved' ? 'منشور' : rev.status === 'rejected' ? 'مرفوض' : 'بانتظار المراجعة'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <span>★ {rev.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => {
                            onApproveReview(rev.id);
                            showNotice('تم اعتماد التقييم ونشره للعامة.');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <AppIcon name="check" className="w-4 h-4" />
                          <span>قبول ونشر التقييم</span>
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => {
                            onRejectReview(rev.id);
                            showNotice('تم رفض وحجب التقييم.');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer border border-red-200"
                        >
                          <span>رفض وحجب</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Live Nurseries Management (إدارة الحضانات) */}
        {activeTab === 'nurseries' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <AppIcon name="storefront" className="w-5 h-5 text-[#00685f]" />
                  <span>إدارة الحضانات المعروضة في الدليل الحي ({nurseries.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  تعديل بيانات الحضانات أو حذفها أو إضافة حضانة جديدة من قبل إدارة المنصة.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <AppIcon name="add" className="w-4 h-4 text-[#89f5e7]" />
                <span>إضافة حضانة مباشرة كأدمن</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nurseries.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl border border-slate-200 hover:border-[#00685f]/40 bg-slate-50/50 flex flex-col justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={n.image}
                      alt={n.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-slate-900 truncate">{n.name}</h3>
                      <p className="text-xs text-slate-500">{n.cityName} - {n.district}</p>
                      <p className="text-xs font-bold text-[#00685f] mt-1">{n.price} ر.س / شهرياً</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-amber-600 font-bold">★ {n.rating} ({n.reviewsCount} تقييم)</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenEditNursery(n)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <AppIcon name="edit" className="w-3.5 h-3.5 text-[#00685f]" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف حضانة "${n.name}" من الدليل؟`)) {
                            onDeleteNursery(n.id);
                            showNotice(`تم حذف "${n.name}".`);
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="حذف الحضانة"
                      >
                        <AppIcon name="delete" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Tour Bookings & Contact Inquiries (الحجوزات والاستشارات) */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                <AppIcon name="calendar_today" className="w-5 h-5 text-[#00685f]" />
                <span>حجوزات الجولات وطلبات التواصل المقدمة من الأهالي</span>
              </h2>
              <p className="text-xs text-slate-500">
                قائمة طلبات حجز الزيارات والتواصل السريع التي أرسلها أولياء الأمور عبر المنصة.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800">جولات الزيارة المحجوزة:</h3>
              {tourBookings.length === 0 ? (
                <p className="text-xs text-slate-400">لا توجد حجوزات جولات مسجلة حالياً</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600">
                        <th className="p-2.5 text-start">الحضانة</th>
                        <th className="p-2.5 text-start">اسم ولي الأمر</th>
                        <th className="p-2.5 text-start">الجوال</th>
                        <th className="p-2.5 text-start">تاريخ الزيارة</th>
                        <th className="p-2.5 text-start">الفترة</th>
                        <th className="p-2.5 text-start">عمر الطفل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tourBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#00685f]">{b.nurseryName}</td>
                          <td className="p-2.5 font-bold">{b.parentName}</td>
                          <td className="p-2.5 font-mono">{b.parentPhone}</td>
                          <td className="p-2.5 font-mono">{b.visitDate}</td>
                          <td className="p-2.5">{b.timeSlot}</td>
                          <td className="p-2.5">{b.childAge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800">استفسارات التواصل المباشر:</h3>
              {quickContacts.length === 0 ? (
                <p className="text-xs text-slate-400">لا توجد استفسارات تواصل جديدة</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickContacts.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{c.contactPerson} - {c.centerName}</span>
                        <span className="text-slate-400">{c.city}</span>
                      </div>
                      <p className="text-slate-600 font-mono">{c.phone} • {c.email}</p>
                      <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                        "{c.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Admin Quick Add Direct Nursery Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" dir="rtl">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#00685f]">إضافة حضانة جديدة كمدير للنظام</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <AppIcon name="close" className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الحضانة / الروضة</label>
                <input
                  type="text"
                  value={newNurseryName}
                  onChange={(e) => setNewNurseryName(e.target.value)}
                  placeholder="مثال: حضانة رواد الغد النموذجية"
                  className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#00685f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدينة</label>
                  <select
                    value={newNurseryCity}
                    onChange={(e) => setNewNurseryCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#00685f]"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="الخبر">الخبر</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحي</label>
                  <input
                    type="text"
                    value={newNurseryDistrict}
                    onChange={(e) => setNewNurseryDistrict(e.target.value)}
                    placeholder="مثال: حي النرجس"
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#00685f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الرسوم الشهرية (ر.س)</label>
                <input
                  type="number"
                  value={newNurseryPrice}
                  onChange={(e) => setNewNurseryPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#00685f]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (!newNurseryName.trim()) {
                    alert('يرجى كتابة اسم الحضانة');
                    return;
                  }
                  onAddNewNurseryDirect({
                    name: newNurseryName,
                    cityName: newNurseryCity,
                    district: newNurseryDistrict || 'وسط المدينة',
                    price: newNurseryPrice
                  });
                  setIsAddModalOpen(false);
                  setNewNurseryName('');
                  showNotice(`تمت إضافة "${newNurseryName}" إلى الدليل الحي.`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                نشر الحضانة مباشرة
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
