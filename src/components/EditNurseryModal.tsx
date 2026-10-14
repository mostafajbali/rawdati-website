import React, { useState } from 'react';
import { Nursery, UserRole } from '../types.ts';
import { AppIcon } from './AppIcon.tsx';

interface EditNurseryModalProps {
  isOpen: boolean;
  onClose: () => void;
  nursery: Nursery | null;
  currentRole: UserRole;
  onSave: (updated: Nursery) => void;
}

export const EditNurseryModal: React.FC<EditNurseryModalProps> = ({
  isOpen,
  onClose,
  nursery,
  currentRole,
  onSave
}) => {
  if (!isOpen || !nursery) return null;

  const [price, setPrice] = useState(nursery.price.toString());
  const [description, setDescription] = useState(nursery.description);
  const [capacity, setCapacity] = useState(nursery.capacity?.toString() || '60');
  const [teacherChildRatio, setTeacherChildRatio] = useState(nursery.teacherChildRatio || '1 معلمات لكل 4 أطفال');
  const [phone, setPhone] = useState(nursery.phone || '');
  const [whatsapp, setWhatsapp] = useState(nursery.whatsapp || '');
  const [licenseNumber, setLicenseNumber] = useState(nursery.licenseNumber || '');
  const [hasLicense, setHasLicense] = useState(nursery.hasLicense);
  const [successNotice, setSuccessNotice] = useState(false);

  const isOwner = currentRole === 'owner';
  const isAdmin = currentRole === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Nursery = {
      ...nursery,
      price: parseInt(price, 10) || nursery.price,
      description,
      capacity: parseInt(capacity, 10) || nursery.capacity,
      teacherChildRatio,
      phone,
      whatsapp,
      // Owners CANNOT alter licensing/approval! Only Admin can!
      hasLicense: isAdmin ? hasLicense : nursery.hasLicense,
      licenseNumber: isAdmin ? licenseNumber : nursery.licenseNumber
    };

    onSave(updated);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#00685f]/20 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#00685f] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-[#89f5e7]">
              <AppIcon name="edit" className="w-5 h-5 text-[#89f5e7]" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">تعديل بيانات الحضانة</h3>
              <p className="text-xs text-[#89f5e7] opacity-90">{nursery.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <AppIcon name="close" className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {successNotice ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#00685f]/15 text-[#00685f] mx-auto flex items-center justify-center">
                <AppIcon name="task_alt" className="w-8 h-8 text-[#00685f]" />
              </div>
              <h4 className="text-base font-bold text-[#0b1c30]">تم حفظ تعديلات الحضانة بنجاح!</h4>
              <p className="text-xs text-[#6d7a77]">تم تحديث البيانات المعروضة لأولياء الأمور لحظياً.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Info Box */}
              <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-start gap-2.5 text-xs">
                <AppIcon name="security" className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[#0b1c30]">
                  {isOwner && (
                    <span>
                      <strong>أنت في وضع مالك الحضانة:</strong> يمكنك تحديث الرسوم والأنشطة والوصف. 
                      <span className="text-red-700 font-bold block mt-0.5">
                        ⚠️ تنبيه أمني: لا يمكنك تعديل رقم الرخصة أو اعتماد الحضانة ذاتياً، فالاعتماد مقفل ومقتصر على إدارة روضتي.
                      </span>
                    </span>
                  )}
                  {isAdmin && (
                    <span>
                      <strong>أنت في وضع مدير المنصة:</strong> تملك كافة الصلاحيات لتعديل بيانات الحضانة، الرسوم، والترخيص الرسمي.
                    </span>
                  )}
                </div>
              </div>

              {/* Monthly Price & Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">الرسوم الشهرية (ر.س) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">الطاقة الاستيعابية (طالب)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                  />
                </div>
              </div>

              {/* Ratio */}
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">نسبة المعلمات للأطفال</label>
                <input
                  type="text"
                  value={teacherChildRatio}
                  onChange={(e) => setTeacherChildRatio(e.target.value)}
                  placeholder="مثال: 1 معلمات لكل 4 أطفال"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">الوصف التعريفي للحضانة</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs leading-relaxed outline-none"
                />
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الهاتف الرسمي</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الواتساب للاستفسارات</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="9665XXXXXXXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#eff4ff] text-xs outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* License Field (Locked for Owner, Editable for Admin) */}
              <div className="p-3 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                    <AppIcon name={isAdmin ? "verified" : "lock"} className={`w-4 h-4 ${isAdmin ? 'text-[#00685f]' : 'text-[#ba1a1a]'}`} />
                    <span>ترخيص وزارة التعليم الرسمي (MOE)</span>
                  </label>
                  {isOwner && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      🔒 مقفل على المالك (صلاحية أدمن فقط)
                    </span>
                  )}
                </div>

                {isAdmin ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="MOE-RYD-8842"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#00685f] text-xs font-bold outline-none"
                    />
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#00685f]">
                      <input
                        type="checkbox"
                        checked={hasLicense}
                        onChange={(e) => setHasLicense(e.target.checked)}
                        className="rounded accent-[#00685f]"
                      />
                      <span>اعتماد الحضانة وتفعيل شارة التوثيق الذهبية</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-[#e5eeff] text-xs">
                    <span className="font-bold text-[#0b1c30]">{nursery.licenseNumber || 'معتمدة من وزارة التعليم'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#00685f]/15 text-[#00685f] text-[11px] font-bold">
                      {nursery.hasLicense ? 'حضانة معتمدة رسمياً ✓' : 'قيد التدقيق'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#3d4947] text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
