import React, { useState } from 'react';
import { signInWithGoogle, FirebaseUser } from '../lib/firebase.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: FirebaseUser | null;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout
}) => {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'options' | 'phone' | 'otp' | 'success'>('options');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      setErrorMsg(null);
      await signInWithGoogle();
      setLoadingGoogle(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setLoadingGoogle(false);
      setErrorMsg('تعذر تسجيل الدخول بحساب Google. يرجى المحاولة مرة أخرى.');
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 9) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5eeff]">
        {/* Modal Header */}
        <div className="bg-[#00685f] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base">
              {currentUser ? 'الملف الشخصي' : 'تسجيل الدخول إلى روضتي'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6">
          {currentUser ? (
            /* Logged in state */
            <div className="text-center space-y-4 py-2">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || ''}
                  className="w-16 h-16 rounded-full mx-auto border-2 border-[#00685f] shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#00685f] text-white mx-auto flex items-center justify-center text-xl font-bold">
                  {currentUser.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h4 className="font-bold text-base text-[#0b1c30]">
                  {currentUser.displayName || 'ولي أمر مسجل'}
                </h4>
                <p className="text-xs text-[#6d7a77]">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[11px] font-bold text-[#00685f] bg-[#89f5e7]/30 px-2.5 py-0.5 rounded-full">
                  حساب معتمد في روضتي ✓
                </span>
              </div>

              <div className="pt-2 border-t border-[#e5eeff] space-y-2">
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-[#eff4ff] hover:bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs transition-colors cursor-pointer"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          ) : step === 'options' ? (
            /* Login Options */
            <div className="space-y-4">
              <p className="text-xs text-[#3d4947] leading-relaxed text-center">
                سجّلي الدخول لمزامنة حضاناتك المفضلة، حجز جولات تعريفية، ونشر مراجعات وصور المرافق المعتمدة.
              </p>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 text-center">
                  {errorMsg}
                </div>
              )}

              {/* 1. Google One-Click Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#0b1c30] text-xs font-bold shadow-xs border border-[#bcc9c6] flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
                <span>{loadingGoogle ? 'جاري الاتصال...' : 'الدخول بحساب Google'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-[#6d7a77] my-1">
                <div className="flex-1 h-px bg-[#e5eeff]" />
                <span>أو الدخول برقم الجوال</span>
                <div className="flex-1 h-px bg-[#e5eeff]" />
              </div>

              {/* 2. Phone Login Button */}
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full py-2.5 rounded-2xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#00685f] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                <span>تسجيل الدخول برقم الجوال السعودي</span>
              </button>
            </div>
          ) : step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <p className="text-xs text-[#3d4947] leading-relaxed">
                أدخلي رقم جوالك لاستقبال رمز التحقق ومتابعة حجوزاتك.
              </p>
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الجوال</label>
                <div className="flex items-center rounded-xl bg-[#eff4ff] px-3 py-2 border border-transparent focus-within:border-[#00685f] focus-within:bg-white transition-all">
                  <span className="text-xs text-[#6d7a77] font-bold pl-2 border-l border-[#bcc9c6]">+966</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="5XXXXXXXX"
                    className="w-full pr-2 bg-transparent text-xs text-[#0b1c30] outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  إرسال الرمز
                </button>
                <button
                  type="button"
                  onClick={() => setStep('options')}
                  className="px-3 py-2.5 bg-[#eff4ff] text-[#3d4947] font-bold text-xs rounded-2xl"
                >
                  رجوع
                </button>
              </div>
            </form>
          ) : step === 'otp' ? (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
              <p className="text-xs text-[#3d4947]">
                تم إرسال رمز التحقق المكون من 4 أرقام إلى الرقم: <br />
                <strong className="text-[#00685f] font-mono">+966 {phone}</strong>
              </p>
              <div className="flex justify-center gap-2.5 py-2">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otp];
                      next[idx] = val;
                      setOtp(next);
                    }}
                    className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-[#eff4ff] border border-[#bcc9c6]/40 focus:border-[#00685f] outline-none"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
              >
                تأكيد الدخول
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#89f5e7]/40 text-[#00685f] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">check</span>
              </div>
              <h4 className="font-bold text-[#0b1c30] text-sm">مرحباً بك في روضتي!</h4>
              <p className="text-xs text-[#6d7a77]">تم تسجيل دخولك بنجاح.</p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#00685f] text-white text-xs font-bold"
              >
                متابعة التصفح
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
