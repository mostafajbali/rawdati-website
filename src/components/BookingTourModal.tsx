import React, { useState } from 'react';
import { Nursery } from '../types.ts';

interface BookingTourModalProps {
  nursery: Nursery | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingTourModal: React.FC<BookingTourModalProps> = ({
  nursery,
  isOpen,
  onClose
}) => {
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childAge, setChildAge] = useState('1 - 2 سنة');
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedSlot, setSelectedSlot] = useState('10:00 صباحاً');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !nursery) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !parentPhone) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5eeff] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#00685f] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">حجز جولة تعريفية مجانية</h3>
              <p className="text-xs text-[#89f5e7] opacity-90">{nursery.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#89f5e7]/40 text-[#00685f] mx-auto flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h4 className="text-xl font-bold text-[#0b1c30]">تم تأكيد موعد جولتك بنجاح!</h4>
              <p className="text-xs sm:text-sm text-[#3d4947] max-w-sm mx-auto leading-relaxed">
                يسعد طاقم <strong className="text-[#00685f]">{nursery.name}</strong> باستقبالك يوم{' '}
                <strong className="text-[#0b1c30]">{selectedDate}</strong> في تمام الساعة{' '}
                <strong className="text-[#0b1c30]">{selectedSlot}</strong>.
              </p>
              <div className="bg-[#eff4ff] p-3.5 rounded-2xl text-xs text-[#3d4947] text-right space-y-1 border border-[#e5eeff]">
                <div className="flex justify-between">
                  <span className="text-[#6d7a77]">رقم تأكيد الزيارة:</span>
                  <span className="font-bold text-[#00685f]">RD-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d7a77]">الموقع:</span>
                  <span className="font-bold">{nursery.cityName} - {nursery.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d7a77]">رقم التواصل للحضانة:</span>
                  <span className="font-bold text-[#855300]">{nursery.phone || '0501234567'}</span>
                </div>
              </div>
              <p className="text-[11px] text-[#6d7a77]">
                تم إرسال رسالة نصية SMS ورابط الموقع الجغرافي إلى جوالك: {parentPhone}
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-2xl bg-[#00685f] text-white font-bold text-sm shadow-md cursor-pointer hover:bg-[#008378] transition-colors"
              >
                تم، شكراً لكم
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#eff4ff] p-3 rounded-2xl flex items-center gap-3">
                <img
                  src={nursery.image}
                  alt={nursery.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0b1c30] block">{nursery.name}</span>
                  <span className="text-[#6d7a77]">{nursery.cityName}، {nursery.district}</span>
                  <span className="text-[#00685f] font-semibold block mt-0.5">
                    زيارة بدون أي رسوم أو التزامات
                  </span>
                </div>
              </div>

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
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الجوال *</label>
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
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">عمر الطفل</label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none cursor-pointer"
                  >
                    <option value="أقل من سنة (رضيع)">أقل من سنة (رضيع)</option>
                    <option value="1 - 2 سنة">1 - 2 سنة</option>
                    <option value="2 - 3 سنوات">2 - 3 سنوات</option>
                    <option value="3 - 5 سنوات (تمهيدي)">3 - 5 سنوات (تمهيدي)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">تاريخ الزيارة المفضل</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">وقت الزيارة المناسب</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00 صباحاً', '10:30 صباحاً', '12:00 ظهراً', '04:00 عصراً', '05:30 مساءً'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 text-center text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#00685f] text-white border-[#00685f] shadow-xs'
                          : 'bg-[#eff4ff] text-[#3d4947] border-transparent hover:bg-[#e5eeff]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">ملاحظات أو أسئلة خاصة (اختياري)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: الاستفسار عن برامج الحساسية الغذائية أو كاميرات البث..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  تأكيد حجز الزيارة المجانية
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 bg-[#eff4ff] text-[#3d4947] hover:bg-[#e5eeff] font-bold text-xs rounded-2xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
