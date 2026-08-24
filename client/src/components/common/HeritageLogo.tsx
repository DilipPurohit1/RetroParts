import React from 'react';

export interface HeritageLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'horizontal' | 'stacked';
  showTagline?: boolean;
  className?: string;
}

export const HeritageLogo: React.FC<HeritageLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  showTagline = true,
  className = '',
}) => {
  // Sizing definitions - Enlarged scale with bold prominence
  const dimensions = {
    sm: {
      height: variant === 'horizontal' ? 40 : 64,
      iconSize: 36,
      retroSize: 'text-[20px]',
      partsSize: 'text-[13px]',
      taglineSize: 'text-[7.5px]',
    },
    md: {
      height: variant === 'horizontal' ? 50 : 88,
      iconSize: 48,
      retroSize: 'text-[25px]',
      partsSize: 'text-[16px]',
      taglineSize: 'text-[8.5px]',
    },
    lg: {
      height: variant === 'horizontal' ? 64 : 112,
      iconSize: 64,
      retroSize: 'text-[32px]',
      partsSize: 'text-[21px]',
      taglineSize: 'text-[10px]',
    },
    xl: {
      height: variant === 'horizontal' ? 80 : 140,
      iconSize: 82,
      retroSize: 'text-[42px]',
      partsSize: 'text-[28px]',
      taglineSize: 'text-[12px]',
    },
  }[size];

  // The Piston Emblem with Full Flame Headroom & Dynamic Combustion Stroke
  const PistonEmblem = ({ sizePx }: { sizePx: number }) => (
    <svg
      width={sizePx * 1.25}
      height={sizePx * 1.15}
      viewBox="0 -32 200 195"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible drop-shadow-[0_0_14px_rgba(225,6,0,0.5)] transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        {/* Chrome / Metallic Piston Gradients */}
        <linearGradient id="pistonCrown" x1="60" y1="10" x2="140" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#F1F5F9" />
          <stop offset="55%" stopColor="#94A3B8" />
          <stop offset="80%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <linearGradient id="conRodGrad" x1="90" y1="65" x2="110" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="30%" stopColor="#F8FAFC" />
          <stop offset="60%" stopColor="#64748B" />
          <stop offset="85%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Static Racing Red Speed Wings Gradients */}
        <linearGradient id="redWingLeft" x1="10" y1="50" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="60%" stopColor="#E10600" />
          <stop offset="100%" stopColor="#8A0000" />
        </linearGradient>

        <linearGradient id="redWingRight" x1="190" y1="50" x2="120" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="60%" stopColor="#E10600" />
          <stop offset="100%" stopColor="#8A0000" />
        </linearGradient>

        {/* Combustion Fire Flame Gradients */}
        <linearGradient id="flameOuter" x1="100" y1="-18" x2="100" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="35%" stopColor="#FF5500" />
          <stop offset="75%" stopColor="#E10600" />
          <stop offset="100%" stopColor="rgba(225,6,0,0)" />
        </linearGradient>

        <linearGradient id="flameCore" x1="100" y1="-6" x2="100" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFF275" />
          <stop offset="85%" stopColor="#FF3B30" />
          <stop offset="100%" stopColor="rgba(255,59,48,0)" />
        </linearGradient>

        <radialGradient id="flameAura" cx="100" cy="8" r="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,210,0,0.9)" />
          <stop offset="50%" stopColor="rgba(225,6,0,0.5)" />
          <stop offset="100%" stopColor="rgba(225,6,0,0)" />
        </radialGradient>
      </defs>

      {/* 1. STATIC LEFT SPEED WINGS */}
      <g>
        <path d="M 12 56 L 76 60 L 73 73 L 26 71 Z" fill="url(#redWingLeft)" />
        <path d="M 22 76 L 73 78 L 70 91 L 36 89 Z" fill="url(#redWingLeft)" />
        <path d="M 33 94 L 71 95 L 68 107 L 46 105 Z" fill="url(#redWingLeft)" />
      </g>

      {/* 2. STATIC RIGHT SPEED WINGS */}
      <g>
        <path d="M 188 56 L 124 60 L 127 73 L 174 71 Z" fill="url(#redWingRight)" />
        <path d="M 178 76 L 127 78 L 130 91 L 164 89 Z" fill="url(#redWingRight)" />
        <path d="M 167 94 L 129 95 L 132 107 L 154 105 Z" fill="url(#redWingRight)" />
      </g>

      {/* 3. ANIMATED CONNECTING ROD (Angular mechanical oscillation) */}
      <g className="animate-logo-conrod">
        <path
          d="M 94 66 L 94 114 C 88 118 84 126 84 136 C 84 150 96 158 100 158 C 104 158 116 150 116 136 C 116 126 112 118 106 114 L 106 66 Z"
          fill="url(#conRodGrad)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <path d="M 97 72 L 97 110 L 103 110 L 103 72 Z" fill="#0F172A" stroke="#475569" strokeWidth="1" />
        <circle cx="100" cy="136" r="10" fill="#0A0A0A" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="89" cy="126" r="2" fill="#F1F5F9" stroke="#0F172A" strokeWidth="1" />
        <circle cx="111" cy="126" r="2" fill="#F1F5F9" stroke="#0F172A" strokeWidth="1" />
      </g>

      {/* 4. ANIMATED CHROME PISTON WITH FULL VISIBLE FIRE */}
      <g className="animate-logo-piston">
        {/* Animated Combustion Flame Tongues */}
        <g className="animate-logo-fire pointer-events-none">
          <circle cx="100" cy="8" r="28" fill="url(#flameAura)" />
          <path
            d="M 76 22 C 76 10 82 -6 92 4 C 96 -14 104 -16 108 2 C 114 -8 124 6 124 22 Z"
            fill="url(#flameOuter)"
          />
          <path
            d="M 84 22 C 84 12 90 2 96 6 C 100 -4 104 -2 108 8 C 112 4 116 12 116 22 Z"
            fill="url(#flameCore)"
          />
          <circle cx="94" cy="-8" r="2" fill="#FFE600" />
          <circle cx="107" cy="-12" r="1.8" fill="#FFFFFF" />
          <circle cx="100" cy="-18" r="2.2" fill="#FF5500" />
        </g>

        {/* Chrome Piston Body */}
        <path
          d="M 68 22 C 68 15 132 15 132 22 L 132 68 C 132 72 128 75 124 75 L 115 75 C 114 62 86 62 85 75 L 76 75 C 72 75 68 72 68 68 Z"
          fill="url(#pistonCrown)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />

        {/* Piston Ring Grooves */}
        <line x1="70" y1="28" x2="130" y2="28" stroke="#0F172A" strokeWidth="2" />
        <line x1="70" y1="36" x2="130" y2="36" stroke="#0F172A" strokeWidth="2" />
        <line x1="70" y1="44" x2="130" y2="44" stroke="#0F172A" strokeWidth="1.8" />

        {/* Metallic Crown Specular Highlight */}
        <path d="M 72 20 C 72 17 128 17 128 20 L 128 24 C 128 21 72 21 72 24 Z" fill="#FFFFFF" opacity="0.9" />

        {/* Wrist Pin */}
        <circle cx="100" cy="54" r="10" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="100" cy="54" r="6" fill="#1E293B" />
        <circle cx="98" cy="52" r="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  );

  // Horizontal Layout (Navbar, Footer, Headers)
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
        {/* Animated Piston & Fire Emblem */}
        <PistonEmblem sizePx={dimensions.iconSize} />

        {/* Brand Name Lockup & Tagline on the Website */}
        <div className="flex flex-col text-left leading-none justify-center shrink-0">
          <div className="flex items-baseline gap-1 font-display font-black italic overflow-visible whitespace-nowrap">
            {/* RETRO in Solid Crisp Silver / White */}
            <span
              className={`${dimensions.retroSize} uppercase font-black tracking-wider text-white inline-block overflow-visible`}
              style={{
                textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(255,255,255,0.4)',
              }}
            >
              RETRO
            </span>

            {/* PARTS in Bold Racing Red */}
            <span
              className={`${dimensions.partsSize} tracking-widest uppercase font-black text-[#E10600] drop-shadow-[0_0_10px_rgba(225,6,0,0.6)] inline-block transition-transform duration-200 group-hover:scale-105`}
            >
              PARTS
            </span>
          </div>

          {/* Tagline preserved on website */}
          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1 whitespace-nowrap">
              <span className="w-2 h-[1px] bg-[#E10600] shrink-0" />
              <span
                className={`font-mono font-medium tracking-[0.14em] uppercase text-[#888888] whitespace-nowrap ${dimensions.taglineSize}`}
              >
                ORIGINAL PARTS • TIMELESS PERFORMANCE
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Stacked Layout (Login, Register)
  return (
    <div className={`inline-flex flex-col items-center text-center select-none group cursor-pointer ${className}`}>
      {/* Centered Animated Piston & Fire Emblem */}
      <PistonEmblem sizePx={dimensions.iconSize} />

      {/* Brand Text Stack */}
      <div className="mt-2.5 flex flex-col items-center overflow-visible">
        {/* RETRO */}
        <span
          className={`${dimensions.retroSize} font-display font-black italic tracking-widest uppercase leading-none text-white pr-1 inline-block overflow-visible`}
          style={{
            textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(255,255,255,0.5)',
          }}
        >
          RETRO
        </span>

        {/* PARTS */}
        <div className="flex items-center justify-center gap-2 mt-1 w-full">
          <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#E10600] shadow-[0_0_4px_#E10600]" />
          <span
            className={`${dimensions.partsSize} font-display font-black italic tracking-[0.22em] uppercase text-[#E10600] leading-none drop-shadow-[0_0_10px_rgba(225,6,0,0.6)] transition-transform duration-200 group-hover:scale-105`}
          >
            PARTS
          </span>
          <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#E10600] shadow-[0_0_4px_#E10600]" />
        </div>

        {/* Tagline preserved on website */}
        {showTagline && (
          <p className={`font-mono font-medium tracking-[0.16em] uppercase text-[#888888] group-hover:text-[#CBD5E1] transition-colors ${dimensions.taglineSize} mt-1.5 whitespace-nowrap`}>
            ORIGINAL PARTS • TIMELESS PERFORMANCE
          </p>
        )}
      </div>
    </div>
  );
};
