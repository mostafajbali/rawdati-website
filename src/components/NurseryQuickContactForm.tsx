import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Language, translations } from '../i18n/translations.ts';
import { AppIcon } from './AppIcon.tsx';

export interface NurseryQuickContactFormData {
  centerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  inquiryType: string;
  message: string;
}

interface NurseryQuickContactFormProps {
  lang: Language;
}

export const NurseryQuickContactForm: React.FC<NurseryQuickContactFormProps> = ({ lang }) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<NurseryQuickContactFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NurseryQuickContactFormData>({
    mode: 'onBlur',
    defaultValues: {
      centerName: '',
      contactPerson: '',
      phone: '',
      email: '',
      city: 'الرياض',
      inquiryType: 'join',
      message: ''
    }
  });

  const onSubmit = async (data: NurseryQuickContactFormData) => {
    // Simulate server network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmittedData(data);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#00685f]/15 shadow-sm p-6 sm:p-8 lg:p-10 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Intro Column for Nursery Owners */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5eeff] text-[#00685f] text-xs font-bold">
            <AppIcon name="verified" className="w-4 h-4 text-[#00685f]" />
            <span>{isAr ? 'بوابة شركاء النجاح وأصحاب الحضانات' : 'Nursery Partners & Owners Portal'}</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0b1c30] leading-snug">
              {t.quickContactTitle}
            </h3>
            <p className="mt-2 text-sm text-[#4a5856] leading-relaxed">
              {t.quickContactSubtitle}
            </p>
          </div>

          {/* Value props for nursery owners */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0 mt-0.5">
                <AppIcon name="task_alt" className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30]">
                  {isAr ? 'وصول مباشر لآلاف الأمهات' : 'Direct Reach to Thousands of Parents'}
                </h4>
                <p className="text-xs text-[#6d7a77]">
                  {isAr
                    ? 'أكثر من 50,000 ولي أمر يبحثون شهرياً عن حضانات ورياض أطفال معتمدة.'
                    : 'Over 50,000 parents search monthly for certified nurseries.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0 mt-0.5">
                <AppIcon name="workspace_premium" className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30]">
                  {isAr ? 'توثيق رسمي وعلامة موثوقة' : 'Official Verification & Trusted Badge'}
                </h4>
                <p className="text-xs text-[#6d7a77]">
                  {isAr
                    ? 'إبراز ترخيص وزارة التعليم والشهادات المعتمدة لزيادة ثقة أولياء الأمور.'
                    : 'Highlight official licenses and safety standards to boost credibility.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0 mt-0.5">
                <AppIcon name="call" className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30]">
                  {isAr ? 'دعم هاتفي ومستشار مخصص' : 'Dedicated Account Specialist'}
                </h4>
                <p className="text-xs text-[#6d7a77]">
                  {isAr
                    ? 'تواصل مباشر عبر الخط الساخن 800-RAWDA-00 أو واتساب للأعمال.'
                    : 'Direct assistance via hotline 800-RAWDA-00 or WhatsApp.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#eff4ff] rounded-2xl border border-[#00685f]/10 text-xs text-[#00685f] flex items-center gap-2">
            <AppIcon name="info" className="w-4 h-4 shrink-0" />
            <span>
              {isAr
                ? 'الرد على استفسارات أصحاب المراكز يتم خلال ساعات العمل (8 ص - 5 م).'
                : 'Responses to nursery partners are provided during business hours (8 AM - 5 PM).'}
            </span>
          </div>
        </div>

        {/* Right Column: Form or Success Card */}
        <div className="lg:col-span-7 bg-[#f8faf9] rounded-2xl p-5 sm:p-7 border border-[#00685f]/10">
          {isSubmitted ? (
            <div className="text-center py-6 sm:py-8 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#00685f]/10 text-[#00685f] mx-auto flex items-center justify-center">
                <AppIcon name="check_circle" className="w-10 h-10 text-[#00685f]" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-[#0b1c30]">
                  {t.quickContactSuccessTitle}
                </h4>
                <p className="text-sm text-[#4a5856] max-w-md mx-auto leading-relaxed">
                  {t.quickContactSuccessDesc}
                </p>
              </div>

              {submittedData && (
                <div className="bg-white rounded-xl p-4 border border-[#00685f]/15 max-w-md mx-auto text-start text-xs space-y-1.5 text-[#3d4947]">
                  <div className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">{t.centerNameLabel}:</span>
                    <span className="font-bold text-[#0b1c30]">{submittedData.centerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">{t.contactPersonLabel}:</span>
                    <span className="font-semibold text-[#0b1c30]">{submittedData.contactPerson}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">{t.phoneLabel}:</span>
                    <span className="font-mono text-[#00685f]">{submittedData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.emailLabel}:</span>
                    <span className="text-[#0b1c30]">{submittedData.email}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00685f] text-white text-xs sm:text-sm font-bold hover:bg-[#00524b] transition-colors shadow-sm cursor-pointer"
              >
                <AppIcon name="edit" className="w-4 h-4" />
                <span>{t.sendAnotherMsg}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Center / Nursery Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0b1c30]">
                    {t.centerNameLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t.centerNamePlaceholder}
                      {...register('centerName', {
                        required: isAr ? 'اسم الحضانة أو المركز مطلوب' : 'Center name is required',
                        minLength: {
                          value: 3,
                          message: isAr ? 'يجب أن لا يقل عن 3 أحرف' : 'Must be at least 3 characters'
                        }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white text-[#0b1c30] transition-colors focus:outline-hidden focus:ring-2 ${
                        errors.centerName
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-[#bcc9c6]/50 focus:border-[#00685f] focus:ring-[#00685f]/15'
                      }`}
                    />
                  </div>
                  {errors.centerName && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                      <span>•</span> {errors.centerName.message}
                    </p>
                  )}
                </div>

                {/* Contact Person Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0b1c30]">
                    {t.contactPersonLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t.contactPersonPlaceholder}
                    {...register('contactPerson', {
                      required: isAr ? 'اسم المسؤول مطلوب' : 'Contact person is required',
                      minLength: {
                        value: 3,
                        message: isAr ? 'يجب أن لا يقل عن 3 أحرف' : 'Must be at least 3 characters'
                      }
                    })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white text-[#0b1c30] transition-colors focus:outline-hidden focus:ring-2 ${
                      errors.contactPerson
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#bcc9c6]/50 focus:border-[#00685f] focus:ring-[#00685f]/15'
                    }`}
                  />
                  {errors.contactPerson && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                      <span>•</span> {errors.contactPerson.message}
                    </p>
                  )}
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0b1c30]">
                    {t.phoneLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="05XXXXXXXX"
                    {...register('phone', {
                      required: isAr ? 'رقم الجوال مطلوب للتواصل' : 'Mobile number is required',
                      pattern: {
                        value: /^(05|5|\+9665)[0-9]{8}$|^[0-9]{9,12}$/,
                        message: isAr
                          ? 'يرجى إدخال رقم جوال صحيح (مثال: 0501234567)'
                          : 'Please enter a valid mobile number (e.g. 0501234567)'
                      }
                    })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white text-[#0b1c30] transition-colors focus:outline-hidden focus:ring-2 ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#bcc9c6]/50 focus:border-[#00685f] focus:ring-[#00685f]/15'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                      <span>•</span> {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0b1c30]">
                    {t.emailLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    placeholder={t.emailPlaceholder}
                    {...register('email', {
                      required: isAr ? 'البريد الإلكتروني مطلوب' : 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format'
                      }
                    })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white text-[#0b1c30] transition-colors focus:outline-hidden focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#bcc9c6]/50 focus:border-[#00685f] focus:ring-[#00685f]/15'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                      <span>•</span> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0b1c30]">
                    {t.cityLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('city', {
                      required: isAr ? 'يرجى اختيار المدينة' : 'Please select a city'
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#bcc9c6]/50 text-xs sm:text-sm bg-white text-[#0b1c30] focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/15 focus:outline-hidden cursor-pointer"
                  >
                    <option value="الرياض">{isAr ? 'الرياض' : 'Riyadh'}</option>
                    <option value="جدة">{isAr ? 'جدة' : 'Jeddah'}</option>
                    <option value="الدمام">{isAr ? 'الدمام' : 'Dammam'}</option>
                    <option value="الخبر">{isAr ? 'الخبر' : 'Khobar'}</option>
                    <option value="مكة المكرمة">{isAr ? 'مكة المكرمة' : 'Makkah'}</option>
                    <option value="المدينة المنورة">{isAr ? 'المدينة المنورة' : 'Madinah'}</option>
                    <option value="أخرى">{isAr ? 'مدينة أخرى' : 'Other City'}</option>
                  </select>
                </div>

                {/* Inquiry Type */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0b1c30]">
                    {t.inquiryTypeLabel}
                  </label>
                  <select
                    {...register('inquiryType')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#bcc9c6]/50 text-xs sm:text-sm bg-white text-[#0b1c30] focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/15 focus:outline-hidden cursor-pointer"
                  >
                    <option value="join">{t.inquiryJoin}</option>
                    <option value="packages">{t.inquiryPackages}</option>
                    <option value="update">{t.inquiryUpdate}</option>
                    <option value="other">{t.inquiryOther}</option>
                  </select>
                </div>
              </div>

              {/* Message / Details */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0b1c30]">
                  {t.messageLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={t.messagePlaceholder}
                  {...register('message', {
                    required: isAr ? 'يرجى كتابة تفاصيل استفسارك' : 'Please enter your message',
                    minLength: {
                      value: 10,
                      message: isAr
                        ? 'الرسالة قصيرة جداً (10 أحرف على الأقل)'
                        : 'Message must be at least 10 characters'
                    }
                  })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white text-[#0b1c30] transition-colors focus:outline-hidden focus:ring-2 resize-none ${
                    errors.message
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-[#bcc9c6]/50 focus:border-[#00685f] focus:ring-[#00685f]/15'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5">
                    <span>•</span> {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.sendingQuickContactBtn}</span>
                    </>
                  ) : (
                    <>
                      <AppIcon name="send" className="w-4 h-4" />
                      <span>{t.sendQuickContactBtn}</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#6d7a77] text-center sm:text-start">
                  {isAr
                    ? '🔒 بياناتك محمية ومشفرة وفق أعلى معايير الخصوصية'
                    : '🔒 Your data is encrypted and kept strictly confidential'}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
