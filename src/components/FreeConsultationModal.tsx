import React, { useState } from 'react';

interface FreeConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeConsultationModal: React.FC<FreeConsultationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('الرياض');
  const [childAge, setChildAge] = useState('سنة ونصف');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5eeff]">
        <div className="bg-gradient-to-r from-[#008378] to-[#00685f] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-[#89f5e7]">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div>
              <h3 className="font-bold text-base">استشارة هاتفية مجانية مع أخصائي</h3>
              <p className="text-xs text-[#89f5e7]">خدمة إرشادية محايدة من منصة روضتي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#89f5e7]/40 text-[#00685f] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">check</span>
              </div>
              <h4 className="text-lg font-bold text-[#0b1c30]">تم استلام طلب الاستشارة!</h4>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                سيتواصل معك أحد مستشاري رعاية الطفولة المبكرة على رقمك ({phone}) خلال 30 دقيقة للمساعدة في اختيار أفضل حضانة مطابقة لاحتياجات طفلك.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 mt-2 rounded-xl bg-[#00685f] text-white font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-xs text-[#3d4947] leading-relaxed">
                تفضلي بتعبئة بياناتك وسيقوم مستشار معتمد بمقارنة كافة الخيارات وترشيح أفضل 3 حضانات تلائم ميزانيتك وموقعك السكني.
              </p>
              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">الاسم الكريم *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: منيرة الشمري"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d4947] mb-1">رقم الجوال للتواصل *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">المدينة</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] text-xs outline-none"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الخبر">الخبر</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d4947] mb-1">عمر الطفل</label>
                  <input
                    type="text"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="مثال: سنتان"
                    className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  طلب اتصال هاتفي مجاني
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
