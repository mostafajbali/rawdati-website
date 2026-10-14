import React, { useState } from 'react';
import { UserRole } from '../types.ts';
import { AppIcon } from './AppIcon.tsx';

interface RoleTestingBannerProps {
  currentRole: UserRole;
  onSwitchRole: (newRole: UserRole) => void;
  onOpenAdminDashboard: () => void;
  pendingRequestsCount?: number;
}

export const RoleTestingBanner: React.FC<RoleTestingBannerProps> = ({
  currentRole,
  onSwitchRole,
  onOpenAdminDashboard,
  pendingRequestsCount = 2
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside aria-label="شريط اختبار الأدوار والصلاحيات" className="sticky top-16 sm:top-20 z-30 bg-linear-to-r from-[#003833] via-[#004d46] to-[#00685f] text-white shadow-md border-b border-[#89f5e7]/20 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left/Start: Role Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#89f5e7] animate-ping" />
          <span className="font-extrabold text-[#89f5e7] hidden sm:inline">نظام الصلاحيات (RBAC):</span>
          <span className="text-white/90">
            أنت تتصفح حالياً بصفة:
          </span>
          <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[11px] shadow-2xs flex items-center gap-1 bg-white text-[#00685f]">
            {currentRole === 'admin' && '👑 مدير المنصة (Admin)'}
            {currentRole === 'owner' && '🏫 مالك حضانة (Owner)'}
            {currentRole === 'parent' && '👨‍👩‍👧 ولي أمر (Parent)'}
          </span>
        </div>

        {/* Center: Quick Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-white/70 hidden md:inline ml-1">تجربة دور آخر:</span>
          
          <button
            onClick={() => onSwitchRole('parent')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              currentRole === 'parent'
                ? 'bg-[#89f5e7] text-[#003833] shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="الأهل لا يمكنهم تعديل أي حضانة"
          >
            👨‍👩‍👧 ولي أمر
          </button>

          <button
            onClick={() => onSwitchRole('owner')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              currentRole === 'owner'
                ? 'bg-[#fea619] text-[#684000] shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="المالك يمكنه تعديل حضانته لكن لا يمكنه اعتمادها بنفسه"
          >
            🏫 مالك حضانة
          </button>

          <button
            onClick={() => onSwitchRole('admin')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              currentRole === 'admin'
                ? 'bg-white text-[#00685f] shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="الأدمن يعتمد الحضانات ويشرف على التقييمات والمستخدمين"
          >
            👑 مدير المنصة
          </button>
        </div>

        {/* Right/End: Admin Dashboard CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdminDashboard}
            className="px-3 py-1 rounded-xl bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] font-extrabold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          >
            <AppIcon name="admin_panel_settings" className="w-3.5 h-3.5 text-[#684000]" />
            <span>لوحة تحكم المشرف (Admin)</span>
            {pendingRequestsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[10px] flex items-center justify-center font-bold">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
