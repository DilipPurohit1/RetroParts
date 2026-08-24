import React from 'react';

/**
 * AmbientBackground
 * A subtle, clean, modern dark automotive backdrop.
 * Replaces distracting moving particles with a static, elegant technical grid
 * and soft ambient crimson studio glow.
 */
export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Matte Obsidian Base */}
      <div className="absolute inset-0 bg-[#0D0D0D]" />

      {/* 2. Soft Ambient Top Crimson Studio Illumination */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] opacity-40 blur-[120px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(225,6,0,0.18) 0%, rgba(225,6,0,0.04) 50%, transparent 80%)',
        }}
      />

      {/* 3. Subtle Technical Dot Grid Matrix Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 4. Soft Vignette Around Edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]/90" />
    </div>
  );
};
