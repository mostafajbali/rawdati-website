import React, { useState } from 'react';
import { RawdatiLogo } from './RawdatiLogo.tsx';
import { AppIcon } from './AppIcon.tsx';
import { UserProfile, UserRole } from '../types.ts';
import { signInWithGoogle } from '../lib/firebase.ts';

interface WelcomeAuthGateProps {
  onRegisterSuccess: (newUser: UserProfile) => void;
  onLoginSuccess: (user: Partial<UserProfile> & { uid: string; email: string; displayName: string; role: UserRole }) => void;
  onContinueAsGuest: () => void;
}

export const WelcomeAuthGate: React.FC<WelcomeAuthGateProps> = ({
  onRegisterSuccess,
  onLoginSuccess,
  onContinueAsGuest
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'parent' | 'owner'>('parent');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim()) {
      setErrorMsg('يرجى كتابة الاسم الكامل');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('يرجى كتابة البريد الإلكتروني');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('يرجى إدخال كلمة مرور من 4 خانات على الأقل');
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

    setSuccessMsg(`أهلاً بك يا ${regName}! جاري حفظ بياناتك في الداتابيز ونقلك للصفحة العامة...`);
    setTimeout(() => {
      onRegisterSuccess(newUser);
    }, 700);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني أو اسم المستخدم');
      return;
    }

    // Admin login detection
    if (email === 'admin' || email === 'admin@rawdati.sa' || email === 'mostafaaljabaly9@gmail.com') {
      if (loginPassword && loginPassword !== 'admin123') {
        setErrorMsg('كلمة المرور غير صحيحة لحساب المشرف (الافتراضية: admin123)');
        return;
      }
      setSuccessMsg('أهلاً بك أيها المشرف! جاري توجيهك مباشرة لصفحة لوحة تحكم المشرف...');
      setTimeout(() => {
        onLoginSuccess({
          uid: 'admin-master',
          email: email === 'admin' ? 'admin@rawdati.sa' : email,
          displayName: 'مدير المنصة الرئيسي (Admin)',
          role: 'admin'
        });
      }, 500);
      return;
    }

    // Standard user login
    let resolvedRole: UserRole = 'parent';
    let resolvedName = email.split('@')[0];

    if (email.includes('owner') || email.includes('monira')) {
      resolvedRole = 'owner';
      resolvedName = 'أ. منيرة السبيعي (مالكة حضانة)';
    } else if (email.includes('parent') || email.includes('omrayan')) {
      resolvedRole = 'parent';
      resolvedName = 'أم ريان (ولي أمر)';
    }

    setSuccessMsg('تم تسجيل الدخول بنجاح! جاري الانتقال للصفحة العامة للمستخدمين...');
    setTimeout(() => {
      onLoginSuccess({
        uid: `usr-${Date.now().toString().slice(-6)}`,
        email,
        displayName: resolvedName,
        role: resolvedRole
      });
    }, 500);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      setErrorMsg(null);
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'مستخدم مسجل',
          role: 'parent'
        });
      }
      setLoadingGoogle(false);
    } catch (err) {
      console.error(err);
      setLoadingGoogle(false);
      setErrorMsg('تعذر تسجيل الدخول بحساب Google. يمكنك إدخال بريدك مباشرة.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#004d47] via-[#00685f] to-[#042825] text-white flex flex-col justify-between" dir="rtl">
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <RawdatiLogo size={40} />
          <div>
            <span className="font-extrabold text-lg text-white block">منصة روضتي</span>
            <span className="text-[11px] text-[#89f5e7] block">دليل استكشاف ومقارنة الحضانات المعتمدة</span>
          </div>
        </div>

        {/* Button to explore as visitor */}
        <button
          onClick={onContinueAsGuest}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/15 active:scale-95 shadow-sm"
        >
          <span>تصفّح الروضات كزائر أولاً 👁️</span>
          <AppIcon name="arrow_forward" className="w-4 h-4 text-[#89f5e7]" />
        </button>
      </header>

      {/* Main Content Area: Split 2 Columns */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Column 1: Welcome & Benefits Presentation */}
          <div className="lg:col-span-6 space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#89f5e7]/20 text-[#89f5e7] border border-[#89f5e7]/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#89f5e7] animate-pulse" />
              <span>المنصة الرائدة في المملكة العربية السعودية</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              اختيار الحضانة الأنسب <br />
              <span className="text-[#89f5e7]">أصبح أسهل وأكثر أماناً</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-lg">
              سجّل حسابك الآن لحجز الجولات التعريفية، متابعة الحضانات المفضلة، ونشر مراجعاتك وتقييماتك ومزامنة كل بياناتك في قاعدة البيانات.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-[#89f5e7]/20 flex items-center justify-center shrink-0">
                  <AppIcon name="verified" className="w-5 h-5 text-[#89f5e7]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">+500 حضانة معتمدة</h4>
                  <p className="text-[11px] text-slate-300">مرخصة من وزارة التعليم</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-[#fea619]/20 flex items-center justify-center shrink-0">
                  <AppIcon name="calendar_month" className="w-5 h-5 text-[#fea619]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">حجز جولات واشتراك</h4>
                  <p className="text-[11px] text-slate-300">مباشرة مع المركز</p>
                </div>
              </div>
            </div>

            {/* Quick Guest Preview Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#89f5e7] hover:text-white transition-colors cursor-pointer"
              >
                <span>أو يمكنك البدء بتصفح قائمة الروضات كزائر دون تسجيل</span>
                <AppIcon name="chevron_left" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2: The Registration & Login Form Card */}
          <div className="lg:col-span-6">
            <div className="w-full bg-white text-[#0b1c30] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 relative">
              {/* Card Tabs */}
              <div className="flex bg-[#eff4ff] p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                >
                  <AppIcon name="person_add" className="w-4 h-4" />
                  <span>إنشاء حساب</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                >
                  <AppIcon name="login" className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </button>
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AppIcon name="info" className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <AppIcon name="check_circle" className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: REGISTER */}
              {activeTab === 'register' ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Role Chooser */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      أنا أسجل بصفتي:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegRole('parent')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-start flex items-center gap-2 ${
                          regRole === 'parent'
                            ? 'bg-[#00685f] text-white border-[#00685f] shadow-xs'
                            : 'bg-[#eff4ff] text-slate-700 border-slate-200 hover:bg-[#dce9ff]'
                        }`}
                      >
                        <span className="text-lg">👨‍👩‍👧</span>
                        <div className="leading-tight">
                          <span className="block font-bold">ولي أمر</span>
                          <span className="text-[10px] opacity-80 block font-normal">بحث واشتراك لطفلي</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('owner')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-start flex items-center gap-2 ${
                          regRole === 'owner'
                            ? 'bg-[#fea619] text-[#684000] border-[#fea619] shadow-xs'
                            : 'bg-[#eff4ff] text-slate-700 border-slate-200 hover:bg-[#dce9ff]'
                        }`}
                      >
                        <span className="text-lg">🏫</span>
                        <div className="leading-tight">
                          <span className="block font-bold">مالك حضانة</span>
                          <span className="text-[10px] opacity-80 block font-normal">إضافة وإدارة روضتي</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل</label>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                      <AppIcon name="person" className="w-4 h-4 text-[#00685f]" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="مثال: منى الفهد"
                        className="w-full bg-transparent text-xs text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                      <AppIcon name="mail" className="w-4 h-4 text-[#00685f]" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="muna@example.com"
                        className="w-full bg-transparent text-xs text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رقم الجوال</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="w-full bg-[#eff4ff] rounded-xl px-3 py-2 text-xs text-[#0b1c30] outline-none focus:bg-white focus:border focus:border-[#00685f]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#00685f] to-[#008378] hover:from-[#005850] hover:to-[#007369] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 mt-2"
                  >
                    <AppIcon name="person_add" className="w-4 h-4 text-[#89f5e7]" />
                    <span>إنشاء حساب</span>
                  </button>

                  {/* Switch to login if user already has an account */}
                  <div className="text-center text-xs text-slate-600 pt-1">
                    لديك حساب بالفعل؟{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setErrorMsg(null);
                      }}
                      className="text-[#00685f] font-extrabold hover:underline cursor-pointer"
                    >
                      تسجيل الدخول
                    </button>
                  </div>

                  {/* Guest Button inside card */}
                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={onContinueAsGuest}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>تصفح الروضات كزائر أولاً بدون تسجيل 👁️</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* TAB 2: LOGIN */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني أو اسم المستخدم</label>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2.5 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                      <AppIcon name="person" className="w-4 h-4 text-[#00685f]" />
                      <input
                        type="text"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin أو بريدك الإلكتروني"
                        className="w-full bg-transparent text-xs text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
                    <div className="flex items-center gap-2 bg-[#eff4ff] rounded-xl px-3 py-2.5 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
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

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#00685f] to-[#008378] hover:from-[#005850] hover:to-[#007369] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                  >
                    <AppIcon name="login" className="w-4 h-4 text-[#89f5e7]" />
                    <span>تسجيل الدخول</span>
                  </button>

                  {/* Switch to register if user is new */}
                  <div className="text-center text-xs text-slate-600 pt-1">
                    مستخدم جديد ليس لديك حساب؟{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('register');
                        setErrorMsg(null);
                      }}
                      className="text-[#00685f] font-extrabold hover:underline cursor-pointer"
                    >
                      إنشاء حساب
                    </button>
                  </div>

                  {/* Quick Preset Button for testing */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('parent.omrayan@gmail.com');
                        setLoginPassword('123456');
                        setErrorMsg(null);
                        setSuccessMsg('جاري نقلك كمستخدم إلى صفحة المستخدمين...');
                        setTimeout(() => {
                          onLoginSuccess({
                            uid: 'usr-parent-demo',
                            email: 'parent.omrayan@gmail.com',
                            displayName: 'أم ريان (ولي أمر)',
                            role: 'parent'
                          });
                        }, 400);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>👨‍👩‍👧 تجربة دخول سريعة كولي أمر (مستخدم مسجل)</span>
                    </button>
                  </div>

                  <div className="relative my-1 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <span className="relative bg-white px-3 text-[11px] text-slate-400">
                      أو الدخول بحساب Google
                    </span>
                  </div>

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
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>الدخول بحساب Google</span>
                  </button>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={onContinueAsGuest}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>تصفح الروضات كزائر أولاً بدون تسجيل 👁️</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimal without admin button */}
      <footer className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300 border-t border-white/10">
        <span>منصة روضتي © 2026 - جميع الحقوق محفوظة</span>
        <div className="flex items-center gap-4">
          <button
            onClick={onContinueAsGuest}
            className="hover:text-white transition-colors cursor-pointer font-bold text-[#89f5e7]"
          >
            تصفح الروضات كزائر 👁️
          </button>
        </div>
      </footer>
    </div>
  );
};
