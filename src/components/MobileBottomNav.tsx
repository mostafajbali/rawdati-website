import React from 'react';
import { Language, translations } from '../i18n/translations.ts';
import { AppIcon } from './AppIcon.tsx';

interface MobileBottomNavProps {
  activeTab: 'home' | 'search' | 'favorites' | 'profile';
  setActiveTab: (tab: 'home' | 'search' | 'favorites' | 'profile') => void;
  favoritesCount: number;
  lang: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  lang
}) => {
  const t = translations[lang];

  const tabs = [
    { id: 'home' as const, label: t.mobileHome, icon: 'home' },
    { id: 'search' as const, label: t.mobileSearch, icon: 'search' },
    { id: 'favorites' as const, label: t.mobileFavorites, icon: 'favorite', count: favoritesCount },
    { id: 'profile' as const, label: t.mobileAccount, icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,104,95,0.08)] border-t border-[#00685f]/10 lg:hidden">
      <div className="h-16 px-4 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors cursor-pointer ${
                isActive ? 'text-[#00685f] font-bold' : 'text-[#6d7a77] hover:text-[#0b1c30]'
              }`}
            >
              <div className="relative">
                <AppIcon
                  name={tab.icon}
                  className="w-6 h-6"
                  filled={isActive && tab.id === 'favorites'}
                />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#fea619] text-[#684000] text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
