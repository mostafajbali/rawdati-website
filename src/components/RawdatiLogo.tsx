import React from 'react';

interface RawdatiLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
}

/**
 * Clean, transparent, lovable Rawdati Kindergarten Logo (شعار روضتي)
 * Features a cute smiling sun embracing a cheerful sprouting leaf with joyful twinkling eyes,
 * warm blushing cheeks, and golden gentle rays.
 * Fully transparent (no solid white badge/box background), lightweight, scalable, and crisp on all screens.
 */
export const RawdatiLogo: React.FC<RawdatiLogoProps> = ({
  className = 'h-10 w-auto',
  size = 40,
  showText = false,
  textColor = 'text-[#00685f]',
  subtextColor = 'text-[#3d4947]'
}) => {
  return (
    <div className="inline-flex items-center gap-2.5 select-none shrink-0">
      {/* 100% Transparent SVG Icon - Cute, Warm & Playful Kindergarten Sun & Sprout */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,104,95,0.12)]`}
        aria-label="شعار روضتي - Rawdati Logo"
      >
        <defs>
          {/* Gentle Warm Sunrise Gradient */}
          <linearGradient id="warmSunGrad" x1="16" y1="8" x2="48" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffb95f" />
            <stop offset="60%" stopColor="#fea619" />
            <stop offset="100%" stopColor="#f58e0b" />
          </linearGradient>

          {/* Reassuring Botanical Teal Gradient for Child Leaf */}
          <linearGradient id="sproutGrad" x1="18" y1="26" x2="46" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00a396" />
            <stop offset="50%" stopColor="#008378" />
            <stop offset="100%" stopColor="#005850" />
          </linearGradient>

          {/* Soft Mint Fresh Leaf Gradient */}
          <linearGradient id="mintLeafGrad" x1="28" y1="20" x2="48" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#71f8e4" />
            <stop offset="100%" stopColor="#008378" />
          </linearGradient>

          {/* Soft Blushing Cheeks Radial Gradient */}
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7b72" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ff9a8b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Playful Radiant Sun Rays (Soft rounded rays) */}
        <g stroke="#fea619" strokeWidth="2.8" strokeLinecap="round" opacity="0.9">
          <line x1="32" y1="3.5" x2="32" y2="7.5" />
          <line x1="47.5" y1="9.5" x2="44.5" y2="12.5" />
          <line x1="16.5" y1="9.5" x2="19.5" y2="12.5" />
          <line x1="56.5" y1="21.5" x2="52.5" y2="22.5" />
          <line x1="7.5" y1="21.5" x2="11.5" y2="22.5" />
        </g>

        {/* 2. Warm Glowing Sun Body */}
        <circle cx="32" cy="22" r="14.5" fill="url(#warmSunGrad)" />

        {/* 3. Cute Blushing Cheeks */}
        <circle cx="23.5" cy="24.5" r="3.2" fill="url(#blushGrad)" />
        <circle cx="40.5" cy="24.5" r="3.2" fill="url(#blushGrad)" />

        {/* 4. Cheerful Twinkling Eyes with Highlights */}
        <g fill="#4e2c00">
          <circle cx="26" cy="20.5" r="1.8" />
          <circle cx="38" cy="20.5" r="1.8" />
        </g>
        {/* Eye Twinkle Highlights */}
        <circle cx="25.2" cy="19.7" r="0.7" fill="#ffffff" />
        <circle cx="37.2" cy="19.7" r="0.7" fill="#ffffff" />

        {/* 5. Gentle Sweet Smile */}
        <path
          d="M28.5 24C29.5 26.2 34.5 26.2 35.5 24"
          stroke="#4e2c00"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 6. Protective Nurturing Sprout Leaves (Kindergarten & Child) */}
        {/* Left Leaf (Embracing Mother/Guardian) */}
        <path
          d="M32 46C22.5 46 15 37 17.5 26.5C26 26.5 32 35 32 46Z"
          fill="url(#sproutGrad)"
        />

        {/* Right Playful Tender Leaf (Flourishing Child) */}
        <path
          d="M32 44C41 44 48.5 35.5 46.5 24.5C38 24.5 32 33 32 44Z"
          fill="url(#mintLeafGrad)"
        />

        {/* Center Root / Stem */}
        <path
          d="M32 35C31 39 30.2 47 32 59"
          stroke="url(#sproutGrad)"
          strokeWidth="3.6"
          strokeLinecap="round"
        />

        {/* Little Heart at the center of the sprout */}
        <path
          d="M32 37.5C31 36 28.5 36.5 29 38.5C29.5 40 32 42 32 42C32 42 34.5 40 35 38.5C35.5 36.5 33 36 32 37.5Z"
          fill="#fea619"
          opacity="0.95"
        />

        {/* Joyful Star Sparkle */}
        <path
          d="M48.5 6.5L49.5 9.5L52.5 10.5L49.5 11.5L48.5 14.5L47.5 11.5L44.5 10.5L47.5 9.5L48.5 6.5Z"
          fill="#fea619"
        />
      </svg>

      {/* Optional Brand Wordmark */}
      {showText && (
        <div className="flex flex-col text-start leading-none">
          <span className={`text-xl font-bold tracking-tight ${textColor}`}>روضتي</span>
          <span className={`text-[11px] font-medium mt-0.5 ${subtextColor}`}>دليل الحضانات المعتمد</span>
        </div>
      )}
    </div>
  );
};
