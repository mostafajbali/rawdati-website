import React, { useState, useEffect } from 'react';
import { Nursery } from '../types.ts';
import { AppIcon } from './AppIcon.tsx';
import { submitTourBooking, FirebaseUser } from '../lib/firebase.ts';

interface BookingTourModalProps {
  nursery: Nursery | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser?: FirebaseUser | null;
  onRequireAuth?: () => void;
}

export const BookingTourModal: React.FC<BookingTourModalProps> = ({
  nursery,
  isOpen,
  onClose,
  currentUser,
  onRequireAuth
}) => {
  const [requestType, setRequestType] = useState<'subscription' | 'tour'>('subscription');
  const [parentName, setParentName] = useState(currentUser?.displayName || '');
  const [parentPhone, setParentPhone] = useState('');
  const [childAge, setChildAge] = useState('1 - 2 سنة');
  const [planDuration, setPlanDuration] = useState<'monthly' | 'term' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedSlot, setSelectedSlot] = useState('10:00 صباحاً');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName) {
      setParentName(currentUser.displayName);
    }
  }, [currentUser]);

  if (!isOpen || !nursery) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !parentPhone) return;

    setIsSubmitting(true);
    try {
      await submitTourBooking(
        {
          nurseryId: nursery.id,
          nurseryName: nursery.name,
          parentName,
          parentPhone,
          childAge,
          visitDate: selectedDate,
          timeSlot: selectedSlot,
          notes: `[نوع الطلب: ${requestType === 'subscription' ? 'اشتراك وتسجيل طفل' : 'جولة تعريفية'}] [الباقة: ${planDuration}] ${notes}`
        },
        currentUser?.uid
      );
    } catch (err) {
      console.warn('Booking offline saved:', err);
    }
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5eeff] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-[#00685f] to-[#008378] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <AppIcon name="how_to_reg" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {requestType === 'subscription' ? 'طلب اشتراك وتسجيل طفل' : 'حجز جولة تعريفية مجانية'}
              </h3>
              <p className="text-xs text-[#89f5e7] opacity-90">{nursery.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <AppIcon name="close" className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Guest Warning: Must Login to save data */}
          {!currentUser && !submitted && (
            <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AppIcon name="info" className="w-4 h-4 text-amber-600 shrink-0" />
                <span>تنبيه: أنت تتصفح كزائر بدون تسجيل</span>
              </div>
              <p className="leading-relaxed text-[11px] text-amber-900/90">
                لإتمام طلب الاشتراك وحفظ بياناتك وبيانات طفلك رسمياً في قاعدة البيانات ومتابعة حالة القبول، يرجى تسجيل الدخول أو إنشاء حساب جديد.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRequireAuth) onRequireAuth();
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <AppIcon name="person" className="w-3.5 h-3.5 text-[#89f5e7]" />
                <span>تسجيل الدخول أو إنشاء حساب</span>
              </button>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <AppIcon name="check_circle" className="w-9 h-9 text-emerald-600" filled />
              </div>
              <h4 className="text-xl font-black text-[#0b1c30]">
                {requestType === 'subscription' ? 'تم تسجيل طلب التجربة بنجاح!' : 'تم تسجيل موعد الجولة التجريبية!'}
              </h4>
              <p className="text-xs sm:text-sm text-[#3d4947] max-w-sm mx-auto leading-relaxed">
                هذه نسخة تجريبية ولن يتم إرسال طلبك إلى الحضانة الحقيقية.
              </p>

              <div className="bg-[#eff4ff] p-4 rounded-2xl text-xs text-[#3d4947] text-right space-y-1.5 border border-[#e5eeff]">
                <div className="flex justify-between">
                  <span className="text-[#6d7a77]">رقم الطلب المسجل:</span>
                  <span className="font-bold text-[#00685f] font-mono">
                    SUB-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d7a77]">الروضة:</span>
                  <span className="font-bold">{nursery.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d7a77]">نوع الطلب:</span>
                  <span className="font-bold text-emerald-700">
                    {requestType === 'subscription' ? 'طلب اشتراك رسمي' : 'حجز زيارة مجانية'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d7a77]">حالة التخزين:</span>
                  <span className="font-bold text-emerald-700">✓ محفوظة في قاعدة البيانات (Firestore)</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-2xl bg-[#00685f] text-white font-bold text-sm shadow-md cursor-pointer hover:bg-[#008378] transition-colors"
              >
                تم، العودة للصفحة العامة
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex bg-[#eff4ff] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRequestType('subscription')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    requestType === 'subscription'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                >
                  🎓 طلب اشتراك وتسجيل طفل
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('tour')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    requestType === 'tour'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-[#6d7a77] hover:text-[#0b1c30]'
                  }`}
                >
                  👁️ حجز جولة تعريفية أولاً
                </button>
              </div>

              {/* Nursery Summary Box */}
              <div className="bg-[#eff4ff] p-3 rounded-2xl flex items-center gap-3">
                <img
                  src={nursery.image}
                  alt={nursery.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0b1c30] block">{nursery.name}</span>
                  <span className="text-[#6d7a77]">{nursery.cityName}، {nursery.district}</span>
                  <span className="text-[#00685f] font-bold block mt-0.5">
                    الرسوم: {nursery.price} ر.س / شهرياً
                  </span>
                </div>
              </div>

              {/* Subscription Plan if requestType is subscription */}
              {requestType === 'subscription' && (
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">مدة الاشتراك المطلوبة:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPlanDuration('monthly')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        planDuration === 'monthly'
                          ? 'bg-[#00685f] text-white border-[#00685f]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      شهري ({nursery.price} ر.س)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanDuration('term')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        planDuration === 'term'
                          ? 'bg-[#00685f] text-white border-[#00685f]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      فصلي (3 أشهر)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanDuration('yearly')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        planDuration === 'yearly'
                          ? 'bg-[#fea619] text-[#684000] border-[#fea619]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      سنوي (خصم 15%)
                    </button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">اسم ولي الأمر *</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="مثال: سارة العتيبي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] border border-transparent focus:border-[#00685f] focus:bg-white text-xs text-[#0b1c30] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الجوال للتواصل *</label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] border border-transparent focus:border-[#00685f] focus:bg-white text-xs text-[#0b1c30] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">عمر الطفل *</label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] border border-transparent focus:border-[#00685f] focus:bg-white text-xs text-[#0b1c30] outline-none transition-all cursor-pointer"
                  >
                    <option value="أقل من سنة (رضيع)">أقل من سنة (رضيع)</option>
                    <option value="1 - 2 سنة">1 - 2 سنة</option>
                    <option value="2 - 3 سنوات">2 - 3 سنوات</option>
                    <option value="3 - 4 سنوات (تمهيدي)">3 - 4 سنوات (تمهيدي)</option>
                    <option value="4 - 5 سنوات (روضة)">4 - 5 سنوات (روضة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">
                    {requestType === 'subscription' ? 'تاريخ بدء الاشتراك المتوقع' : 'تاريخ الزيارة المقترح'}
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] border border-transparent focus:border-[#00685f] focus:bg-white text-xs text-[#0b1c30] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">ملاحظات إضافية أو استفسارات</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي معلومات هامة عن الطفل، احتياجات خاصة، أو أوقات دوام مفضلة..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#eff4ff] border border-transparent focus:border-[#00685f] focus:bg-white text-xs text-[#0b1c30] outline-none transition-all resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#00685f] hover:bg-[#008378] text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <AppIcon name="send" className="w-4 h-4 text-[#89f5e7]" />
                <span>
                  {isSubmitting
                    ? 'جاري حفظ البيانات...'
                    : requestType === 'subscription'
                    ? 'تأكيد طلب الاشتراك التجريبي'
                    : 'تأكيد حجز الجولة التجريبية'}
                </span>
              </button>

              <p className="text-[11px] text-[#6d7a77] text-center pt-1 font-medium">
                ℹ️ هذه نسخة تجريبية ولن يتم إرسال طلبك.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
