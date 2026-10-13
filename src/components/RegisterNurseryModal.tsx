import React, { useState } from 'react';
import { AppIcon } from './AppIcon.tsx';

interface RegisterNurseryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterNurseryModal: React.FC<RegisterNurseryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [centerName, setCenterName] = useState('');
  const [city, setCity] = useState('الرياض');
  const [district, setDistrict] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerName || !managerPhone) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5eeff]">
        <div className="bg-[#fea619] p-5 text-[#684000] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#684000]/10 flex items-center justify-center">
              <AppIcon name="school" className="w-6 h-6 text-[#684000]" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">تسجيل مركز أو حضانة جديدة</h3>
              <p className="text-xs text-[#684000]/80">انضمي لشبكة الحضانات المعتمدة في منصة روضتي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer"
          >
            <AppIcon name="close" className="w-4 h-4 text-[#684000]" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#00685f]/15 text-[#00685f] mx-auto flex items-center justify-center">
                <AppIcon name="task_alt" className="w-8 h-8 text-[#00685f]" />
              </div>
              <h4 className="text-lg font-bold text-[#0b1c30]">تم استلام طلب انضمام المركز بنجاح!</h4>
              <p className="text-xs text-[#3d4947] max-w-sm mx-auto leading-relaxed">
                شكراً لك. سيتواصل فريق اعتماد المراكز في منصة روضتي مع إدارة المركز للتحقق من الرخصة الرسمية وتفعيل الصفحة التعريفية واستقبال أولياء الأمور.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-[#00685f] text-white text-xs font-bold"
              >
                حسناً، فهمت
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-[#3d4947] leading-relaxed">
                تتيح لك منصة روضتي الوصول إلى أكثر من 50,000 ولي أمر شهرياً، مع نظام حجز جولات إلكتروني ومتابعة استفسارات التسجيل.
              </p>

              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">اسم الحضانة / الروضة الرسمي *</label>
                <input
                  type="text"
                  required
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  placeholder="مثال: روضة براعم التفوق النموذجية"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">المدينة *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الخبر">الخبر</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">الحي</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="مثال: حي الياسمين"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الترخيص من وزارة التعليم (اختياري)</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="MOE-XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">اسم المسؤولة / المديرة *</label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="الاسم الثلاثي"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الجوال الرسمي *</label>
                  <input
                    type="tel"
                    required
                    value={managerPhone}
                    onChange={(e) => setManagerPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  إرسال طلب الانضمام والاعتماد
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
