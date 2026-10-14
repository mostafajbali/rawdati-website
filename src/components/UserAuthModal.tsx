import React, { useState } from 'react';
import { FirebaseUser, signInWithGoogle } from '../lib/firebase.ts';
import { AppIcon } from './AppIcon.tsx';
import { RawdatiLogo } from './RawdatiLogo.tsx';
import { UserRole, UserProfile } from '../types.ts';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: FirebaseUser | null;
  currentRole: UserRole;
  onLogout?: () => void;
  onUserLoginSuccess: (user: Partial<UserProfile> & { uid: string; email: string; displayName: string; role: UserRole }) => void;
  onUserRegisterSuccess: (newUser: UserProfile) => void;
  onOpenRegisterNursery?: () => void;
  onOpenFavorites?: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentRole,
  onLogout,
  onUserLoginSuccess,
  onUserRegisterSuccess,
  onOpenRegisterNursery,
  onOpenFavorites
}) => {
  // Tabs: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'parent' | 'owner'>('parent');

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle standard login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني');
      return;
    }

    // Determine role based on email or default to parent
    let resolvedRole: UserRole = 'parent';
    let resolvedName = email.split('@')[0];

    if (email.includes('owner') || email.includes('monira')) {
      resolvedRole = 'owner';
      resolvedName = 'أ. منيرة السبيعي (مالكة حضانة)';
    } else if (email.includes('parent') || email.includes('omrayan')) {
      resolvedRole = 'parent';
      resolvedName = 'أم ريان (ولي أمر)';
    }

    onUserLoginSuccess({
      uid: `usr-${Date.now().toString().slice(-6)}`,
      email,
      displayName: resolvedName,
      role: resolvedRole
    });

    setSuccessMsg('تم تسجيل الدخول بنجاح! أهلاً بك في روضتي.');
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 1000);
  };

  // Handle new user registration ("اذا كان مش مسجل يسجل بعدين بيدخل")
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim()) {
      setErrorMsg('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('يرجى إدخال كلمة مرور مناسبة (4 أحرف على الأقل)');
      return;
    }

    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      displayName: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim() || undefined,
      role: regRole,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // 1. Add user to database / state
    // 2. Automatically log them in!
    onUserRegisterSuccess(newUser);

    setSuccessMsg(`أهلاً بك يا ${regName}! تم إنشاء حسابك بنجاح وتسجيل دخولك تلقائياً.`);
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 1200);
  };

  // 1-Click Google Sign In
  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      setErrorMsg(null);
      const user = await signInWithGoogle();
      if (user) {
        onUserLoginSuccess({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'مستخدم مسجل',
          role: 'parent'
        });
      }
      setLoadingGoogle(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setLoadingGoogle(false);
      setErrorMsg('تعذر تسجيل الدخول عبر Google. يمكنك استخدام البريد الإلكتروني.');
    }
  };

  // Quick Demo logins for regular testing
  const handleQuickParent = () => {
    onUserLoginSuccess({
      uid: 'user-parent-demo',
      displayName: 'أم ريان (ولي أمر)',
      email: 'parent.omrayan@gmail.com',
      role: 'parent'
    });
    onClose();
  };

  const handleQuickOwner = () => {
    onUserLoginSuccess({
      uid: 'user-owner-demo',
      displayName: 'أ. منيرة السبيعي (مالكة حضانة)',
      email: 'monira.owner@rawdati.sa',
      role: 'owner'
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5eeff] flex flex-col">
        {/* Header Banner */}
        <div className="bg-linear-to-r from-[#00685f] to-[#008378] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RawdatiLogo size={32} />
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {currentUser ? 'حسابي في روضتي' : 'دخول وتسجيل حساب المستخدم'}
              </h3>
              <p className="text-[11px] text-[#89f5e7]/90">
                {currentUser ? 'إدارة حسابك وحجوزاتك' : 'بوابة أولياء الأمور وملاك الحضانات'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <AppIcon name="close" className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {currentUser ? (
            /* Logged in User Profile Details */
            <div className="text-center space-y-4 py-1">
              <div className="w-16 h-16 rounded-full bg-[#00685f]/10 text-[#00685f] mx-auto flex items-center justify-center text-2xl font-black border-2 border-[#00685f]/30">
                {currentUser.displayName?.charAt(0) || 'م'}
              </div>

              <div>
                <h4 className="font-extrabold text-lg text-[#0b1c30]">
                  {currentUser.displayName || 'مستخدم مسجل'}
                </h4>
                <p className="text-xs text-[#6d7a77] font-mono mt-0.5">{currentUser.email}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#89f5e7]/30 text-[#00685f] border border-[#00685f]/20">
                  <span>{currentRole === 'owner' ? '🏫 مالك ومسؤول حضانة' : '👨‍👩‍👧 ولي أمر معتمد'}</span>
                </div>
              </div>

              {/* Quick links for user */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-start">
                {onOpenFavorites && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFavorites();
                    }}
                    className="p-3 rounded-2xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00685f] text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <AppIcon name="favorite" className="w-4 h-4 text-rose-500" />
                    <span>حضاناتي المفضلة</span>
                  </button>
                )}

                {currentRole === 'owner' && onOpenRegisterNursery && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRegisterNursery();
                    }}
                    className="p-3 rounded-2xl bg-[#fff8e6] hover:bg-[#ffe5a3] text-[#684000] text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <AppIcon name="domain" className="w-4 h-4 text-[#fea619]" />
                    <span>تقديم طلب حضانة جديدة</span>
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-[#e5eeff]">
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-red-200"
                >
                  <AppIcon name="logout" className="w-4 h-4 text-red-600" />
                  <span>تسجيل الخروج من الحساب</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated User: Switch between Login & Register */
            <div className="space-y-4">
              {/* Notification & Errors */}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AppIcon name="info" className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <AppIcon name="check_circle" className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Tab Selector Buttons */}
              <div className="flex bg-[#eff4ff] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                >
                  تسجيل الدخول (حساب مسجل)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                >
                  إنشاء حساب جديد (تسجيل)
                </button>
              </div>

              {/* 1. LOGIN TAB (إذا كان مسجل يدخل بإيميله) */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <p className="text-xs text-[#6d7a77] text-center">
                    أدخل بريدك الإلكتروني وكلمة المرور للدخول إلى حسابك ومتابعة حجوزاتك ومفضلاتك.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-[#3d4947] mb-1">
                      البريد الإلكتروني
                    </label>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                      <AppIcon name="mail" className="w-4 h-4 text-[#00685f]" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="your-name@example.com"
                        className="w-full bg-transparent text-xs text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#3d4947]">كلمة المرور</label>
                      <a href="#forgot" className="text-[11px] text-[#00685f] hover:underline">
                        نسيت كلمة المرور؟
                      </a>
                    </div>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                      <AppIcon name="lock" className="w-4 h-4 text-[#00685f]" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-xs text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6d7a77]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded-xs text-[#00685f]"
                      />
                      <span>تذكرني على هذا الجهاز</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98"
                  >
                    تسجيل الدخول
                  </button>

                  <div className="relative my-3 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <span className="relative bg-white px-3 text-[11px] text-slate-400">
                      أو الدخول بنقرة واحدة
                    </span>
                  </div>

                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loadingGoogle}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                    <span>الدخول بحساب Google</span>
                  </button>

                  {/* Fast demo login options */}
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleQuickParent}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer transition-all"
                    >
                      دخول تجريبي (ولي أمر)
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickOwner}
                      className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200 cursor-pointer transition-all"
                    >
                      دخول تجريبي (مالك حضانة)
                    </button>
                  </div>
                </form>
              )}

              {/* 2. REGISTER TAB (إذا كان مش مسجل يسجل بعدين يدخل) */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <p className="text-xs text-[#6d7a77] text-center">
                    أنشئ حسابك الجديد الآن وسيتم تسجيل دخولك فوراً إلى المنصة.
                  </p>

                  {/* Role Chooser */}
                  <div>
                    <label className="block text-xs font-bold text-[#3d4947] mb-1.5">
                      نوع الحساب المطلوب:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegRole('parent')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-start flex items-center gap-2 ${
                          regRole === 'parent'
                            ? 'bg-[#00685f] text-white border-[#00685f] shadow-xs'
                            : 'bg-[#eff4ff] text-slate-700 border-slate-200 hover:bg-[#dce9ff]'
                        }`}
                      >
                        <span className="text-base">👨‍👩‍👧</span>
                        <div className="leading-tight">
                          <span className="block font-bold">ولي أمر</span>
                          <span className="text-[10px] opacity-80 block font-normal">بحث وحجز وتقييم</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('owner')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-start flex items-center gap-2 ${
                          regRole === 'owner'
                            ? 'bg-[#fea619] text-[#684000] border-[#fea619] shadow-xs'
                            : 'bg-[#eff4ff] text-slate-700 border-slate-200 hover:bg-[#dce9ff]'
                        }`}
                      >
                        <span className="text-base">🏫</span>
                        <div className="leading-tight">
                          <span className="block font-bold">مالك حضانة</span>
                          <span className="text-[10px] opacity-80 block font-normal">إضافة وإدارة حضانتي</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3d4947] mb-1">الاسم الكامل</label>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                      <AppIcon name="person" className="w-4 h-4 text-[#00685f]" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="مثال: سارة محمد"
                        className="w-full bg-transparent text-xs text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3d4947] mb-1">البريد الإلكتروني</label>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                      <AppIcon name="mail" className="w-4 h-4 text-[#00685f]" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="sara@example.com"
                        className="w-full bg-transparent text-xs text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الجوال</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="w-full bg-[#eff4ff] rounded-xl px-3 py-2 text-xs text-[#0b1c30] outline-none focus:bg-white focus:border focus:border-[#00685f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3d4947] mb-1">كلمة المرور</label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#eff4ff] rounded-xl px-3 py-2 text-xs text-[#0b1c30] outline-none focus:bg-white focus:border focus:border-[#00685f]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 mt-2"
                  >
                    <AppIcon name="how_to_reg" className="w-4 h-4 text-[#89f5e7]" />
                    <span>إنشاء الحساب والتسجيل والدخول فوراً</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
