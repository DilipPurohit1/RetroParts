import { useEffect } from 'react';

/**
 * useFaviconAnimation
 * Renders an ultra-sharp, bold, enlarged mechanical 4-stroke piston & fire animation
 * in 60 FPS directly onto the browser tab favicon via Canvas Data-URI.
 * Designed specifically for maximum clarity, size, and fluid motion in browser tabs.
 */
export const useFaviconAnimation = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // 1. Clear any old/static icons in <head>
    const oldIcons = document.querySelectorAll("link[rel*='icon']");
    oldIcons.forEach((el) => el.remove());

    // 2. Insert single dedicated high-priority dynamic favicon
    let link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    link.type = 'image/png';
    document.head.appendChild(link);

    // 3. 64x64 Canvas with High-Contrast Bold Vector Graphics
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();
    const cycleMs = 850; // 0.85s per realistic 4-stroke cycle
    let lastRenderTime = 0;
    const minFrameInterval = 1000 / 60; // 60 FPS for ultra-smooth motion

    const drawFrame = (currentTime: number) => {
      animId = requestAnimationFrame(drawFrame);

      // Save CPU when tab is hidden
      if (document.hidden) return;

      const elapsedDelta = currentTime - lastRenderTime;
      if (elapsedDelta < minFrameInterval) return;
      lastRenderTime = currentTime - (elapsedDelta % minFrameInterval);

      const elapsed = (currentTime - startTime) % cycleMs;
      const progress = elapsed / cycleMs; // 0.0 -> 1.0 (0=TDC, 0.5=BDC, 1.0=TDC)

      // Smooth mechanical harmonic cycle: 0px at TDC, 9px down at BDC
      const strokeProgress = (1 - Math.cos(progress * Math.PI * 2)) / 2; // 0 -> 1 -> 0
      const yStroke = strokeProgress * 9; 
      // Connecting rod swing: sinusoidal deflection +/- 7.5 deg
      const rodAngle = Math.sin(progress * Math.PI * 2) * (7.5 * (Math.PI / 180));

      ctx.clearRect(0, 0, 64, 64);

      // ─── 1. BOLD RACING RED SPEED WINGS (Left & Right) ───
      ctx.fillStyle = '#E10600';
      ctx.strokeStyle = '#8A0000';
      ctx.lineWidth = 1.2;

      // Left Wing Upper
      ctx.beginPath();
      ctx.moveTo(1, 20);
      ctx.lineTo(19, 23);
      ctx.lineTo(17, 30);
      ctx.lineTo(4, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Left Wing Lower
      ctx.beginPath();
      ctx.moveTo(5, 32);
      ctx.lineTo(18, 34);
      ctx.lineTo(16, 40);
      ctx.lineTo(8, 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Wing Upper
      ctx.beginPath();
      ctx.moveTo(63, 20);
      ctx.lineTo(45, 23);
      ctx.lineTo(47, 30);
      ctx.lineTo(60, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Wing Lower
      ctx.beginPath();
      ctx.moveTo(59, 32);
      ctx.lineTo(46, 34);
      ctx.lineTo(48, 40);
      ctx.lineTo(56, 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // ─── 2. CONNECTING ROD (Pivots at bottom crank pin x=32, y=56) ───
      ctx.save();
      ctx.translate(32, 56);
      ctx.rotate(rodAngle);

      // Rod Shaft (Bold metallic beam)
      const rodGrad = ctx.createLinearGradient(-4, -28, 4, 0);
      rodGrad.addColorStop(0, '#E2E8F0');
      rodGrad.addColorStop(0.4, '#94A3B8');
      rodGrad.addColorStop(1, '#334155');
      ctx.fillStyle = rodGrad;
      ctx.beginPath();
      ctx.roundRect(-4, -28, 8, 28, 2);
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Crank Bearing Pin
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#E10600';
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();

      // ─── 3. COMBUSTION FIRE (Ignites at TDC with explosive burst) ───
      const isFiring = progress < 0.28 || progress > 0.82;
      if (isFiring) {
        const flameAlpha = progress < 0.28 
          ? Math.pow(1 - progress / 0.28, 1.2) 
          : Math.pow((progress - 0.82) / 0.18, 1.5);

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, flameAlpha));

        const flameY = 10 + yStroke * 0.3;
        
        // Large Outer Glow
        const outerGlow = ctx.createRadialGradient(32, flameY, 2, 32, flameY, 18);
        outerGlow.addColorStop(0, '#FFFFFF');
        outerGlow.addColorStop(0.25, '#FFE600');
        outerGlow.addColorStop(0.65, '#FF5500');
        outerGlow.addColorStop(1, 'rgba(225, 6, 0, 0)');

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(32, flameY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Core White-Hot Flame Tongues
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(32, flameY - 14);
        ctx.lineTo(36, flameY - 2);
        ctx.lineTo(28, flameY - 2);
        ctx.closePath();
        ctx.fill();

        // Golden Side Sparks
        ctx.fillStyle = '#FFE600';
        ctx.beginPath();
        ctx.arc(24, flameY - 6, 2.5, 0, Math.PI * 2);
        ctx.arc(40, flameY - 6, 2.5, 0, Math.PI * 2);
        ctx.arc(32, flameY - 12, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // ─── 4. ENLARGED CHROME PISTON BODY (Moves up & down with yStroke) ───
      const pY = 14 + yStroke;

      // Chrome Body Gradient
      const pGrad = ctx.createLinearGradient(16, pY, 48, pY + 26);
      pGrad.addColorStop(0, '#FFFFFF');
      pGrad.addColorStop(0.2, '#F1F5F9');
      pGrad.addColorStop(0.55, '#94A3B8');
      pGrad.addColorStop(0.85, '#CBD5E1');
      pGrad.addColorStop(1, '#334155');
      ctx.fillStyle = pGrad;

      // Piston Crown & Skirt (Bold 28px width for prominent visibility)
      ctx.beginPath();
      ctx.roundRect(18, pY, 28, 25, [3.5, 3.5, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Top Specular Highlight
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(20, pY + 1.5, 24, 2);

      // Piston Compression Ring Grooves
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(19, pY + 5.5, 26, 1.8);
      ctx.fillRect(19, pY + 10, 26, 1.8);

      // Large Chrome Wrist Pin
      ctx.beginPath();
      ctx.arc(32, pY + 17, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(32, pY + 17, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();

      // ─── 5. Update Favicon Link ───
      link.href = canvas.toDataURL('image/png');
    };

    animId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);
};
