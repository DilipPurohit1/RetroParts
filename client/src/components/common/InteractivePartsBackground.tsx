import React, { useEffect, useRef } from 'react';

interface AnimatedPart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  phase: number;
  size: number;
  rotation: number;
  vRot: number;
  partType:
    | 'piston'
    | 'gears'
    | 'turbo'
    | 'sparkplug'
    | 'brake'
    | 'tachometer'
    | 'coilover'
    | 'valve'
    | 'exhaust'
    | 'steering'
    | 'injector'
    | 'crankshaft';
  opacity: number;
  speedMultiplier: number;
}

const PART_TYPES: AnimatedPart['partType'][] = [
  'piston',
  'gears',
  'turbo',
  'sparkplug',
  'brake',
  'tachometer',
  'coilover',
  'valve',
  'exhaust',
  'steering',
  'injector',
  'crankshaft',
];

export const InteractivePartsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Smooth Mouse Tracking with Responsive Spring Damping
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Balanced particle count: 12 sleek, small, modern components evenly distributed
    const partCount = 12;
    const parts: AnimatedPart[] = [];

    for (let i = 0; i < partCount; i++) {
      const pType = PART_TYPES[i % PART_TYPES.length];
      const baseVx = (Math.random() - 0.5) * 0.3;
      const baseVy = -Math.random() * 0.3 - 0.35;

      parts.push({
        x: (width / partCount) * i + Math.random() * 60,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 12 + 40, // 40px to 52px (sleek, small, modern & clean)
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.008 + 0.005),
        partType: pType,
        opacity: Math.random() * 0.08 + 0.32, // Crisp, stylish modern visibility
        speedMultiplier: Math.random() * 0.4 + 0.8,
      });
    }

    let time = 0;

    // --- SLEEK, COMPACT & MODERN ANIMATED AUTOMOTIVE VECTOR DRAWINGS ---

    // 1. Sleek Piston & Con-Rod
    const drawPiston = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const stroke = t * 3.5;
      const pistonY = Math.sin(stroke) * 7 * s;
      const crankAngle = stroke;
      const crankR = 9 * s;
      const crankX = Math.cos(crankAngle) * crankR;
      const crankY = 17 * s + Math.sin(crankAngle) * crankR;

      // Cylinder outline
      c.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      c.lineWidth = 1 * s;
      c.strokeRect(-16 * s, -24 * s, 32 * s, 30 * s);

      // Piston Head
      c.save();
      c.translate(0, pistonY);

      if (pistonY < -4 * s) {
        c.fillStyle = 'rgba(225, 6, 0, 0.4)';
        c.beginPath();
        c.arc(0, -20 * s, 10 * s, 0, Math.PI * 2);
        c.fill();
      }

      c.fillStyle = '#141414';
      c.strokeStyle = '#E10600';
      c.lineWidth = 1.4 * s;
      c.beginPath();
      c.roundRect(-14 * s, -18 * s, 28 * s, 16 * s, 2 * s);
      c.fill();
      c.stroke();

      // Rings
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 0.8 * s;
      c.beginPath();
      c.moveTo(-12 * s, -14 * s);
      c.lineTo(12 * s, -14 * s);
      c.moveTo(-12 * s, -10 * s);
      c.lineTo(12 * s, -10 * s);
      c.stroke();

      // Wrist Pin
      c.fillStyle = '#E10600';
      c.beginPath();
      c.arc(0, -6 * s, 3 * s, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // Con-rod
      c.strokeStyle = '#A0AEC0';
      c.lineWidth = 2.5 * s;
      c.beginPath();
      c.moveTo(0, pistonY - 6 * s);
      c.lineTo(crankX, crankY);
      c.stroke();

      // Crank pin
      c.fillStyle = '#E10600';
      c.beginPath();
      c.arc(crankX, crankY, 3.5 * s, 0, Math.PI * 2);
      c.fill();
    };

    // 2. Sleek Dual Intermeshing Gears
    const drawGears = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const angle1 = t * 2.2;
      const angle2 = -t * 3.3;

      const drawSingleGear = (gx: number, gy: number, r: number, teeth: number, rot: number, color: string) => {
        c.save();
        c.translate(gx, gy);
        c.rotate(rot);

        c.fillStyle = '#141414';
        c.strokeStyle = color;
        c.lineWidth = 1.3 * s;

        c.beginPath();
        for (let i = 0; i < teeth; i++) {
          const a = (i / teeth) * Math.PI * 2;
          const aHalf = ((i + 0.5) / teeth) * Math.PI * 2;
          const rOuter = r + 3.5 * s;
          const rInner = r;

          c.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
          c.lineTo(Math.cos(aHalf) * rInner, Math.sin(aHalf) * rInner);
        }
        c.closePath();
        c.fill();
        c.stroke();

        c.strokeStyle = '#FFFFFF';
        c.lineWidth = 0.8 * s;
        c.beginPath();
        c.arc(0, 0, r * 0.5, 0, Math.PI * 2);
        c.stroke();

        c.fillStyle = color;
        c.beginPath();
        c.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
        c.fill();

        c.restore();
      };

      drawSingleGear(-8 * s, 0, 14 * s, 9, angle1, '#E10600');
      drawSingleGear(12 * s, -9 * s, 9 * s, 6, angle2, '#E2E8F0');
    };

    // 3. Sleek Turbocharger Impeller
    const drawTurbo = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const spin = t * 6.5;

      c.strokeStyle = '#E10600';
      c.lineWidth = 1.4 * s;
      c.fillStyle = '#141414';
      c.beginPath();
      c.arc(0, 2 * s, 16 * s, 0.4, Math.PI * 2.2);
      c.lineTo(22 * s, -18 * s);
      c.lineTo(12 * s, -18 * s);
      c.closePath();
      c.fill();
      c.stroke();

      c.strokeStyle = '#FFFFFF';
      c.lineWidth = 1 * s;
      c.beginPath();
      c.arc(0, 2 * s, 11 * s, 0, Math.PI * 2);
      c.stroke();

      c.save();
      c.translate(0, 2 * s);
      c.rotate(spin);

      const blades = 6;
      c.strokeStyle = '#E10600';
      c.lineWidth = 1.4 * s;
      for (let i = 0; i < blades; i++) {
        const a = (i / blades) * Math.PI * 2;
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(Math.cos(a + 0.4) * 8 * s, Math.sin(a + 0.4) * 8 * s, Math.cos(a) * 10 * s, Math.sin(a) * 10 * s);
        c.stroke();
      }

      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // 4. Sleek Spark Plug with Electric Flash
    const drawSparkPlug = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;

      // Ceramic body
      c.fillStyle = '#181818';
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 1.2 * s;
      c.beginPath();
      c.roundRect(-6 * s, -22 * s, 12 * s, 18 * s, 1.5 * s);
      c.fill();
      c.stroke();

      c.fillStyle = '#E10600';
      c.fillRect(-6 * s, -16 * s, 12 * s, 2 * s);
      c.fillRect(-6 * s, -10 * s, 12 * s, 2 * s);

      // Hex nut
      c.strokeStyle = '#E10600';
      c.lineWidth = 1.4 * s;
      c.strokeRect(-9 * s, -4 * s, 18 * s, 9 * s);

      // Threads
      c.strokeStyle = '#718096';
      c.lineWidth = 1 * s;
      c.strokeRect(-6 * s, 5 * s, 12 * s, 11 * s);
      for (let y = 7 * s; y < 16 * s; y += 3 * s) {
        c.beginPath();
        c.moveTo(-6 * s, y);
        c.lineTo(6 * s, y);
        c.stroke();
      }

      // Ground Electrode
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 1.4 * s;
      c.beginPath();
      c.moveTo(-4 * s, 16 * s);
      c.lineTo(-4 * s, 22 * s);
      c.lineTo(3 * s, 22 * s);
      c.stroke();

      // Spark
      if (Math.sin(t * 12) > 0.2) {
        c.save();
        c.strokeStyle = '#00F0FF';
        c.lineWidth = 1.5 * s;
        c.shadowColor = '#00F0FF';
        c.shadowBlur = 6;
        c.beginPath();
        c.moveTo(0, 20 * s);
        c.lineTo((Math.random() - 0.5) * 4 * s, 21 * s);
        c.lineTo(1 * s, 22 * s);
        c.stroke();
        c.restore();
      }
    };

    // 5. Sleek Ventilated Brake Rotor
    const drawBrake = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const spin = t * 2.5;

      c.save();
      c.rotate(spin);

      c.fillStyle = '#141414';
      c.strokeStyle = '#718096';
      c.lineWidth = 1.4 * s;
      c.beginPath();
      c.arc(0, 0, 19 * s, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      c.strokeStyle = '#4A5568';
      c.lineWidth = 0.8 * s;
      c.beginPath();
      c.arc(0, 0, 15 * s, 0, Math.PI * 2);
      c.arc(0, 0, 9 * s, 0, Math.PI * 2);
      c.stroke();

      c.fillStyle = '#E2E8F0';
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        c.beginPath();
        c.arc(Math.cos(a) * 12 * s, Math.sin(a) * 12 * s, 1.2 * s, 0, Math.PI * 2);
        c.arc(Math.cos(a + 0.3) * 16 * s, Math.sin(a + 0.3) * 16 * s, 1.2 * s, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();

      // Caliper
      c.fillStyle = '#E10600';
      c.strokeStyle = '#FFFFFF';
      c.lineWidth = 1 * s;
      c.beginPath();
      c.roundRect(9 * s, -14 * s, 11 * s, 28 * s, 3 * s);
      c.fill();
      c.stroke();

      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(14.5 * s, -6 * s, 2.2 * s, 0, Math.PI * 2);
      c.arc(14.5 * s, 6 * s, 2.2 * s, 0, Math.PI * 2);
      c.fill();
    };

    // 6. Modern Tachometer Dial
    const drawTachometer = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const gaugeAngle = -Math.PI * 0.8 + (Math.sin(t * 3) * 0.5 + 0.5) * Math.PI * 1.6;

      c.fillStyle = '#141414';
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 1.4 * s;
      c.beginPath();
      c.arc(0, 0, 19 * s, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      c.strokeStyle = '#E10600';
      c.lineWidth = 2.5 * s;
      c.beginPath();
      c.arc(0, 0, 15 * s, Math.PI * 0.2, Math.PI * 0.75);
      c.stroke();

      c.strokeStyle = '#FFFFFF';
      c.lineWidth = 0.9 * s;
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI * 0.8 + (i / 6) * Math.PI * 1.55;
        c.beginPath();
        c.moveTo(Math.cos(a) * 14 * s, Math.sin(a) * 14 * s);
        c.lineTo(Math.cos(a) * 17 * s, Math.sin(a) * 17 * s);
        c.stroke();
      }

      c.save();
      c.rotate(gaugeAngle);
      c.strokeStyle = '#E10600';
      c.lineWidth = 1.8 * s;
      c.beginPath();
      c.moveTo(-2 * s, 0);
      c.lineTo(15 * s, 0);
      c.stroke();
      c.restore();

      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(0, 0, 3 * s, 0, Math.PI * 2);
      c.fill();
    };

    // 7. Sleek Coilover Damper Spring
    const drawCoilover = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const compression = Math.sin(t * 3.5) * 3 * s;

      c.fillStyle = '#1F2937';
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 1.2 * s;
      c.strokeRect(-11 * s, -20 * s, 22 * s, 4 * s);
      c.strokeRect(-11 * s, 16 * s, 22 * s, 4 * s);

      c.strokeStyle = '#FFFFFF';
      c.lineWidth = 2.5 * s;
      c.beginPath();
      c.moveTo(0, -16 * s);
      c.lineTo(0, 16 * s);
      c.stroke();

      c.strokeStyle = '#E10600';
      c.lineWidth = 2.2 * s;
      c.beginPath();
      const coils = 5;
      const startY = -15 * s;
      const totalH = (29 * s) + compression;
      for (let i = 0; i <= coils; i++) {
        const y = startY + (i / coils) * totalH;
        const x = (i % 2 === 0 ? -9 : 9) * s;
        if (i === 0) c.moveTo(0, y);
        else c.lineTo(x, y);
      }
      c.lineTo(0, startY + totalH);
      c.stroke();
    };

    // 8. Sleek Camshaft & Valve Lifter
    const drawValve = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const camRot = t * 3.5;
      const lifterY = (Math.cos(camRot) > 0.2 ? -Math.cos(camRot) * 5 * s : 0);

      c.save();
      c.translate(0, -10 * s);
      c.rotate(camRot);
      c.fillStyle = '#141414';
      c.strokeStyle = '#E10600';
      c.lineWidth = 1.4 * s;
      c.beginPath();
      c.arc(0, 0, 7 * s, 0, Math.PI);
      c.lineTo(0, -12 * s);
      c.closePath();
      c.fill();
      c.stroke();

      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
      c.fill();
      c.restore();

      c.save();
      c.translate(0, lifterY);
      c.strokeStyle = '#FFFFFF';
      c.lineWidth = 2 * s;
      c.beginPath();
      c.moveTo(0, -2 * s);
      c.lineTo(0, 16 * s);
      c.stroke();

      c.fillStyle = '#E10600';
      c.beginPath();
      c.moveTo(-10 * s, 16 * s);
      c.lineTo(10 * s, 16 * s);
      c.lineTo(0, 20 * s);
      c.closePath();
      c.fill();
      c.restore();
    };

    // 9. Modern 4-Runner Exhaust Header
    const drawExhaust = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const flowOffset = (t * 2) % 1;

      // Exhaust Flange
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 1.5 * s;
      c.strokeRect(-18 * s, -20 * s, 36 * s, 4 * s);

      // 4 Tubular Runners
      c.strokeStyle = '#E10600';
      c.lineWidth = 2 * s;
      c.beginPath();
      c.moveTo(-12 * s, -16 * s);
      c.bezierCurveTo(-14 * s, -4 * s, -6 * s, 6 * s, 0, 14 * s);
      c.moveTo(-4 * s, -16 * s);
      c.bezierCurveTo(-4 * s, -4 * s, -2 * s, 6 * s, 0, 14 * s);
      c.moveTo(4 * s, -16 * s);
      c.bezierCurveTo(4 * s, -4 * s, 2 * s, 6 * s, 0, 14 * s);
      c.moveTo(12 * s, -16 * s);
      c.bezierCurveTo(14 * s, -4 * s, 6 * s, 6 * s, 0, 14 * s);
      c.stroke();

      // Collector Pipe
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 3.5 * s;
      c.beginPath();
      c.moveTo(0, 14 * s);
      c.lineTo(0, 22 * s);
      c.stroke();

      // Pulsing Heat Flow Indicator
      c.fillStyle = 'rgba(225, 6, 0, 0.7)';
      c.beginPath();
      c.arc(0, 14 * s + flowOffset * 8 * s, 2.5 * s, 0, Math.PI * 2);
      c.fill();
    };

    // 10. Sport Steering Wheel
    const drawSteering = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const steerAngle = Math.sin(t * 2) * 0.45;

      c.save();
      c.rotate(steerAngle);

      // Outer Rim
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 2.5 * s;
      c.beginPath();
      c.arc(0, 0, 18 * s, 0, Math.PI * 2);
      c.stroke();

      // Red 12-o'clock racing stripe
      c.strokeStyle = '#E10600';
      c.lineWidth = 3.2 * s;
      c.beginPath();
      c.arc(0, 0, 18 * s, -Math.PI * 0.55, -Math.PI * 0.45);
      c.stroke();

      // 3 Spokes
      c.strokeStyle = '#718096';
      c.lineWidth = 2 * s;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-16 * s, 0);
      c.moveTo(0, 0);
      c.lineTo(16 * s, 0);
      c.moveTo(0, 0);
      c.lineTo(0, 16 * s);
      c.stroke();

      // Center Horn Button
      c.fillStyle = '#141414';
      c.strokeStyle = '#E10600';
      c.lineWidth = 1.2 * s;
      c.beginPath();
      c.arc(0, 0, 5 * s, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      c.restore();
    };

    // 11. Modern Fuel Injector
    const drawInjector = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const spray = Math.sin(t * 8) > 0.3;

      // Injector Body
      c.fillStyle = '#141414';
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 1.3 * s;
      c.beginPath();
      c.roundRect(-5 * s, -18 * s, 10 * s, 26 * s, 1.5 * s);
      c.fill();
      c.stroke();

      // Red solenoid band & electrical plug
      c.fillStyle = '#E10600';
      c.fillRect(-5 * s, -12 * s, 10 * s, 5 * s);
      c.fillRect(5 * s, -16 * s, 4 * s, 6 * s);

      // Nozzle Tip
      c.strokeStyle = '#718096';
      c.lineWidth = 1 * s;
      c.beginPath();
      c.moveTo(-2 * s, 8 * s);
      c.lineTo(0, 14 * s);
      c.lineTo(2 * s, 8 * s);
      c.stroke();

      // Atomized Fuel Spray Cone Pulse
      if (spray) {
        c.fillStyle = 'rgba(225, 6, 0, 0.35)';
        c.beginPath();
        c.moveTo(0, 14 * s);
        c.lineTo(-8 * s, 24 * s);
        c.lineTo(8 * s, 24 * s);
        c.closePath();
        c.fill();
      }
    };

    // 12. Counterweighted Crankshaft Assembly
    const drawCrankshaft = (c: CanvasRenderingContext2D, size: number, t: number) => {
      const s = size / 50;
      const rot = t * 3;

      c.save();
      c.rotate(rot);

      // Main Journal Axle
      c.strokeStyle = '#E2E8F0';
      c.lineWidth = 3 * s;
      c.beginPath();
      c.moveTo(-16 * s, 0);
      c.lineTo(16 * s, 0);
      c.stroke();

      // Counterweight Webs
      c.fillStyle = '#141414';
      c.strokeStyle = '#E10600';
      c.lineWidth = 1.3 * s;
      c.beginPath();
      c.arc(-8 * s, 6 * s, 8 * s, 0, Math.PI);
      c.closePath();
      c.fill();
      c.stroke();

      c.beginPath();
      c.arc(8 * s, -6 * s, 8 * s, Math.PI, Math.PI * 2);
      c.closePath();
      c.fill();
      c.stroke();

      // Crankpins
      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(-8 * s, 9 * s, 2.2 * s, 0, Math.PI * 2);
      c.arc(8 * s, -9 * s, 2.2 * s, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    // Main Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Smooth mouse position damping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        // Cursor fluid repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist && dist > 1) {
          const force = (1 - dist / maxDist) * 0.65;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Return to base drift velocity with wave dynamics
        p.phase += 0.02;
        p.vx += (p.baseVx - p.vx) * 0.035;
        p.vy += (p.baseVy - p.vy) * 0.035;

        // Position & Rotation update with organic floating undulation
        p.x += p.vx + Math.sin(p.phase) * 0.65;
        p.y += p.vy + Math.cos(p.phase * 0.8) * 0.35;
        p.rotation += p.vRot;

        // Screen wrap
        if (p.y < -p.size * 1.5) {
          p.y = height + p.size;
          p.x = Math.random() * width;
        }
        if (p.x < -p.size * 1.5) p.x = width + p.size;
        if (p.x > width + p.size * 1.5) p.x = -p.size;

        // Render Animated Vector Schematic Auto Part
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        // Subtle glowing engine aura
        const aura = ctx.createRadialGradient(0, 0, p.size * 0.15, 0, 0, p.size * 0.55);
        aura.addColorStop(0, 'rgba(225, 6, 0, 0.16)');
        aura.addColorStop(1, 'rgba(225, 6, 0, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Draw the specific animated mechanical component
        const partTime = time * p.speedMultiplier;
        switch (p.partType) {
          case 'piston':
            drawPiston(ctx, p.size, partTime);
            break;
          case 'gears':
            drawGears(ctx, p.size, partTime);
            break;
          case 'turbo':
            drawTurbo(ctx, p.size, partTime);
            break;
          case 'sparkplug':
            drawSparkPlug(ctx, p.size, partTime);
            break;
          case 'brake':
            drawBrake(ctx, p.size, partTime);
            break;
          case 'tachometer':
            drawTachometer(ctx, p.size, partTime);
            break;
          case 'coilover':
            drawCoilover(ctx, p.size, partTime);
            break;
          case 'valve':
            drawValve(ctx, p.size, partTime);
            break;
          case 'exhaust':
            drawExhaust(ctx, p.size, partTime);
            break;
          case 'steering':
            drawSteering(ctx, p.size, partTime);
            break;
          case 'injector':
            drawInjector(ctx, p.size, partTime);
            break;
          case 'crankshaft':
            drawCrankshaft(ctx, p.size, partTime);
            break;
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
    />
  );
};
