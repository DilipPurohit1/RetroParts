import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/dilip/.gemini/antigravity/scratch/retroparts/client/public/parts';

const parts = {
  // 1. NGK Laser Iridium Spark Plug
  'spark-plug.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <linearGradient id="metalChrome" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#64748B"/>
      <stop offset="30%" stop-color="#F1F5F9"/>
      <stop offset="70%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="ceramicWhite" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="40%" stop-color="#FFFFFF"/>
      <stop offset="80%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark)"/>
  <g transform="translate(200, 200) rotate(-35) translate(-200, -200)">
    <!-- Terminal Stud -->
    <rect x="188" y="40" width="24" height="25" rx="4" fill="url(#metalChrome)" stroke="#0F172A" stroke-width="2"/>
    <circle cx="200" cy="38" r="8" fill="#E2E8F0" stroke="#334155" stroke-width="2"/>
    <!-- White Ribbed Ceramic Insulator -->
    <rect x="175" y="65" width="50" height="110" rx="6" fill="url(#ceramicWhite)" stroke="#64748B" stroke-width="2"/>
    <!-- Ceramic Ribs -->
    <rect x="168" y="80" width="64" height="10" rx="3" fill="url(#ceramicWhite)" stroke="#94A3B8" stroke-width="1.5"/>
    <rect x="168" y="100" width="64" height="10" rx="3" fill="url(#ceramicWhite)" stroke="#94A3B8" stroke-width="1.5"/>
    <rect x="168" y="120" width="64" height="10" rx="3" fill="url(#ceramicWhite)" stroke="#94A3B8" stroke-width="1.5"/>
    <!-- NGK Racing Red Branding Band -->
    <rect x="175" y="145" width="50" height="8" fill="#E10600"/>
    <text x="200" y="152" font-family="monospace" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">NGK IRIDIUM</text>
    <!-- Metal Hex Nut Shell -->
    <path d="M 160 175 L 240 175 L 245 225 L 155 225 Z" fill="url(#metalChrome)" stroke="#0F172A" stroke-width="2"/>
    <line x1="187" y1="175" x2="187" y2="225" stroke="#334155" stroke-width="2"/>
    <line x1="213" y1="175" x2="213" y2="225" stroke="#334155" stroke-width="2"/>
    <!-- Metal Gasket Washer -->
    <rect x="165" y="225" width="70" height="8" rx="2" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
    <!-- Threaded Body -->
    <rect x="172" y="233" width="56" height="85" fill="#475569" stroke="#0F172A" stroke-width="2"/>
    <!-- Thread Ridges -->
    <line x1="170" y1="245" x2="230" y2="245" stroke="#94A3B8" stroke-width="4"/>
    <line x1="170" y1="260" x2="230" y2="260" stroke="#94A3B8" stroke-width="4"/>
    <line x1="170" y1="275" x2="230" y2="275" stroke="#94A3B8" stroke-width="4"/>
    <line x1="170" y1="290" x2="230" y2="290" stroke="#94A3B8" stroke-width="4"/>
    <line x1="170" y1="305" x2="230" y2="305" stroke="#94A3B8" stroke-width="4"/>
    <!-- Insulator Nose & Fine Wire Iridium Electrode -->
    <polygon points="185,318 215,318 208,335 192,335" fill="#F8FAFC" stroke="#64748B" stroke-width="1.5"/>
    <rect x="198" y="335" width="4" height="16" fill="#00E5FF" stroke="#0F172A" stroke-width="1"/>
    <!-- Ground Electrode Arm (L-shape with spark gap) -->
    <path d="M 176 318 L 176 360 L 206 360" fill="none" stroke="url(#metalChrome)" stroke-width="6" stroke-linecap="square"/>
    <!-- Laser Spark Glow -->
    <circle cx="202" cy="354" r="5" fill="#00E5FF" opacity="0.8"/>
  </g>
</svg>`,

  // 2. Mikuni VM20 Slide Carburetor
  'carburetor.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <linearGradient id="carbMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="35%" stop-color="#94A3B8"/>
      <stop offset="70%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="brassJet" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark2)"/>
  <!-- Top Throttle Cable Guide & Red Adjuster Nut -->
  <rect x="190" y="30" width="20" height="30" rx="3" fill="#94A3B8" stroke="#0F172A" stroke-width="2"/>
  <rect x="185" y="45" width="30" height="12" rx="2" fill="#E10600" stroke="#0F172A" stroke-width="2"/>
  <!-- Carburetor Top Mixing Chamber Cap -->
  <path d="M 160 60 L 240 60 L 235 90 L 165 90 Z" fill="url(#carbMetal)" stroke="#0F172A" stroke-width="2.5"/>
  <circle cx="175" cy="75" r="4" fill="#CBD5E1" stroke="#0F172A" stroke-width="1.5"/>
  <circle cx="225" cy="75" r="4" fill="#CBD5E1" stroke="#0F172A" stroke-width="1.5"/>
  <!-- Main Cylindrical Slide Body -->
  <rect x="150" y="90" width="100" height="120" rx="8" fill="url(#carbMetal)" stroke="#0F172A" stroke-width="3"/>
  <!-- Stamped Brand Plaque -->
  <rect x="165" y="115" width="70" height="24" rx="3" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
  <text x="200" y="131" font-family="sans-serif" font-size="9" font-weight="900" fill="#E2E8F0" text-anchor="middle" letter-spacing="1">MIKUNI JAPAN</text>
  <!-- Air Intake Bellmouth Funnel (Left) -->
  <path d="M 70 115 L 150 135 L 150 185 L 70 205 Z" fill="url(#carbMetal)" stroke="#0F172A" stroke-width="3"/>
  <ellipse cx="70" cy="160" rx="15" ry="45" fill="#0A0B0E" stroke="#94A3B8" stroke-width="3"/>
  <!-- Engine Intake Flange (Right) -->
  <rect x="250" y="130" width="65" height="60" fill="url(#carbMetal)" stroke="#0F172A" stroke-width="3"/>
  <rect x="315" y="110" width="18" height="100" rx="6" fill="url(#carbMetal)" stroke="#0F172A" stroke-width="3"/>
  <circle cx="324" cy="125" r="6" fill="#0A0B0E" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="324" cy="195" r="6" fill="#0A0B0E" stroke="#94A3B8" stroke-width="2"/>
  <!-- Choke Lever & Idle Screw -->
  <rect x="135" y="100" width="15" height="35" rx="3" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
  <circle cx="142" cy="100" r="10" fill="#E10600" stroke="#0F172A" stroke-width="2"/>
  <!-- Brass Idle Air Screw -->
  <circle cx="215" cy="165" r="8" fill="url(#brassJet)" stroke="#0F172A" stroke-width="1.5"/>
  <line x1="211" y1="165" x2="219" y2="165" stroke="#78350F" stroke-width="2"/>
  <!-- Fuel Intake Nipple -->
  <rect x="130" y="170" width="22" height="14" rx="2" fill="url(#brassJet)" stroke="#0F172A" stroke-width="2"/>
  <!-- Bottom Float Bowl Chamber -->
  <path d="M 140 210 L 260 210 L 250 320 C 250 335 150 335 150 320 Z" fill="url(#carbMetal)" stroke="#0F172A" stroke-width="3"/>
  <!-- Float Bowl Screws -->
  <circle cx="152" cy="222" r="5" fill="#CBD5E1" stroke="#0F172A" stroke-width="1.5"/>
  <circle cx="248" cy="222" r="5" fill="#CBD5E1" stroke="#0F172A" stroke-width="1.5"/>
  <!-- Bottom Main Jet Hex Drain Plug -->
  <polygon points="190,325 210,325 216,345 184,345" fill="url(#brassJet)" stroke="#0F172A" stroke-width="2"/>
  <!-- Overflow Tube Spigot -->
  <rect x="196" y="345" width="8" height="25" fill="url(#brassJet)" stroke="#0F172A" stroke-width="1.5"/>
</svg>`,

  // 3. Ventilated Cross-Drilled Disc Brake Rotor & Red Brembo Caliper
  'brake-rotor.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <radialGradient id="rotorMetal" cx="50%" cy="50%" r="50%">
      <stop offset="35%" stop-color="#0F172A"/>
      <stop offset="55%" stop-color="#475569"/>
      <stop offset="85%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#64748B"/>
    </radialGradient>
    <linearGradient id="caliperRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3B30"/>
      <stop offset="50%" stop-color="#E10600"/>
      <stop offset="100%" stop-color="#880000"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark3)"/>
  <!-- Outer Cast-Iron Brake Rotor -->
  <circle cx="200" cy="200" r="160" fill="url(#rotorMetal)" stroke="#1E293B" stroke-width="5"/>
  <!-- Precision Ground Friction Surface Grooves -->
  <circle cx="200" cy="200" r="140" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="8 4" opacity="0.6"/>
  <circle cx="200" cy="200" r="120" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="12 6" opacity="0.5"/>
  <circle cx="200" cy="200" r="100" fill="#1E293B" stroke="#0F172A" stroke-width="4"/>
  <!-- Center Hat & Hub Mounting -->
  <circle cx="200" cy="200" r="65" fill="#0F172A" stroke="#475569" stroke-width="3"/>
  <circle cx="200" cy="200" r="30" fill="#020617"/>
  <!-- 5 Wheel Lug Stud Holes -->
  <circle cx="200" cy="155" r="9" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
  <circle cx="242" cy="186" r="9" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
  <circle cx="226" cy="235" r="9" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
  <circle cx="174" cy="235" r="9" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
  <circle cx="158" cy="186" r="9" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
  <!-- Cross-Drilled Ventilation Holes (Radial Spiral Pattern) -->
  <g fill="#0A0B0E">
    <circle cx="200" cy="70" r="4"/><circle cx="200" cy="85" r="4"/>
    <circle cx="270" cy="100" r="4"/><circle cx="260" cy="115" r="4"/>
    <circle cx="315" cy="165" r="4"/><circle cx="300" cy="175" r="4"/>
    <circle cx="300" cy="250" r="4"/><circle cx="285" cy="240" r="4"/>
    <circle cx="240" cy="310" r="4"/><circle cx="230" cy="295" r="4"/>
    <circle cx="160" cy="310" r="4"/><circle cx="170" cy="295" r="4"/>
    <circle cx="100" cy="250" r="4"/><circle cx="115" cy="240" r="4"/>
    <circle cx="85" cy="165" r="4"/><circle cx="100" cy="175" r="4"/>
    <circle cx="130" cy="100" r="4"/><circle cx="140" cy="115" r="4"/>
  </g>
  <!-- Red High-Performance Multi-Piston Caliper (Top-Right) -->
  <path d="M 245 40 C 340 75 365 180 325 250 L 285 220 C 315 170 300 95 230 70 Z" fill="url(#caliperRed)" stroke="#5B0500" stroke-width="4"/>
  <!-- Caliper Pistons -->
  <circle cx="280" cy="105" r="12" fill="#E2E8F0" stroke="#1E293B" stroke-width="3"/>
  <circle cx="305" cy="155" r="12" fill="#E2E8F0" stroke="#1E293B" stroke-width="3"/>
  <circle cx="295" cy="205" r="12" fill="#E2E8F0" stroke="#1E293B" stroke-width="3"/>
  <!-- Caliper Brand Text -->
  <text x="270" y="140" font-family="sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" transform="rotate(45, 270, 140)">BREMBO</text>
</svg>`,

  // 4. RD350 Finned Cylinder Head & Piston Kit
  'cylinder-piston.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark4" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <linearGradient id="finMetal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark4)"/>
  <!-- Cylinder Head Block with Radial Cooling Fins -->
  <g transform="translate(200, 150)">
    <!-- Outer Cooling Fins (Step down layers) -->
    <rect x="-140" y="-80" width="280" height="12" rx="4" fill="url(#finMetal)" stroke="#0F172A" stroke-width="2"/>
    <rect x="-150" y="-60" width="300" height="12" rx="4" fill="url(#finMetal)" stroke="#0F172A" stroke-width="2"/>
    <rect x="-155" y="-40" width="310" height="12" rx="4" fill="url(#finMetal)" stroke="#0F172A" stroke-width="2"/>
    <rect x="-150" y="-20" width="300" height="12" rx="4" fill="url(#finMetal)" stroke="#0F172A" stroke-width="2"/>
    <rect x="-140" y="0" width="280" height="12" rx="4" fill="url(#finMetal)" stroke="#0F172A" stroke-width="2"/>
    <rect x="-125" y="20" width="250" height="12" rx="4" fill="url(#finMetal)" stroke="#0F172A" stroke-width="2"/>
    <!-- Center Spark Plug Well Hole -->
    <circle cx="0" cy="-30" r="22" fill="#0A0B0E" stroke="#E10600" stroke-width="3"/>
    <circle cx="0" cy="-30" r="14" fill="#334155" stroke="#94A3B8" stroke-width="2"/>
    <!-- 4 Cylinder Head Stud Holes -->
    <circle cx="-80" cy="-45" r="9" fill="#0F172A" stroke="#CBD5E1" stroke-width="2.5"/>
    <circle cx="80" cy="-45" r="9" fill="#0F172A" stroke="#CBD5E1" stroke-width="2.5"/>
    <circle cx="-80" cy="10" r="9" fill="#0F172A" stroke="#CBD5E1" stroke-width="2.5"/>
    <circle cx="80" cy="10" r="9" fill="#0F172A" stroke="#CBD5E1" stroke-width="2.5"/>
  </g>
  <!-- Cast Aluminum Piston with Compression Rings (Bottom-Center) -->
  <g transform="translate(200, 290)">
    <!-- Piston Dome -->
    <path d="M -60 -40 C -60 -55 60 -55 60 -40 L 60 50 C 60 58 50 64 42 64 L 30 64 C 28 50 -28 50 -30 64 L -42 64 C -50 64 -60 58 -60 50 Z" fill="url(#finMetal)" stroke="#0F172A" stroke-width="3"/>
    <!-- 2-Stroke Ring Lands -->
    <line x1="-58" y1="-28" x2="58" y2="-28" stroke="#0F172A" stroke-width="3.5"/>
    <line x1="-58" y1="-14" x2="58" y2="-14" stroke="#0F172A" stroke-width="3.5"/>
    <!-- Wrist Pin Boss -->
    <circle cx="0" cy="15" r="16" fill="#0A0B0E" stroke="#E2E8F0" stroke-width="3"/>
    <circle cx="0" cy="15" r="10" fill="#1E293B"/>
    <circle cx="-4" cy="11" r="3" fill="#FFFFFF" opacity="0.8"/>
  </g>
</svg>`,

  // 5. Heavy Forged Steel Crankshaft & Con-Rod Assembly
  'crankshaft.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark5" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="40%" stop-color="#94A3B8"/>
      <stop offset="80%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark5)"/>
  <g transform="translate(200, 220)">
    <!-- Main Center Flywheel Counterweight Discs -->
    <circle cx="-50" cy="0" r="95" fill="url(#steelGrad)" stroke="#0F172A" stroke-width="4"/>
    <circle cx="50" cy="0" r="95" fill="url(#steelGrad)" stroke="#0F172A" stroke-width="4"/>
    <!-- Crankshaft Counterweight Crescent Cutouts -->
    <path d="M -110 -20 C -70 60 -30 60 10 -20 Z" fill="#0A0B0E" opacity="0.6"/>
    <path d="M -10 -20 C 30 60 70 60 110 -20 Z" fill="#0A0B0E" opacity="0.6"/>
    <!-- Crankpin Journal -->
    <circle cx="0" cy="-45" r="24" fill="#0F172A" stroke="#F8FAFC" stroke-width="3"/>
    <!-- Heavy Forged Connecting Rod (Shooting Upward) -->
    <path d="M -16 -45 L -12 -160 C -22 -165 -28 -176 -28 -188 C -28 -205 -12 -216 0 -216 C 12 -216 28 -205 28 -188 C 28 -176 22 -165 12 -160 L 16 -45 Z" fill="url(#steelGrad)" stroke="#0F172A" stroke-width="3"/>
    <!-- H-Beam Shank Recess -->
    <rect x="-6" y="-155" width="12" height="95" fill="#1E293B" rx="2" stroke="#475569" stroke-width="1.5"/>
    <!-- Small End Piston Pin Bushing -->
    <circle cx="0" cy="-188" r="14" fill="#0A0B0E" stroke="#F59E0B" stroke-width="3"/>
    <!-- Big End Rod Cap Bolts -->
    <circle cx="-16" cy="-22" r="4" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
    <circle cx="16" cy="-22" r="4" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
    <!-- Left & Right Main Axle Shafts -->
    <rect x="-160" y="-18" width="65" height="36" rx="4" fill="url(#steelGrad)" stroke="#0F172A" stroke-width="3"/>
    <rect x="95" y="-18" width="65" height="36" rx="4" fill="url(#steelGrad)" stroke="#0F172A" stroke-width="3"/>
  </g>
</svg>`,

  // 6. Stainless Steel 4-2-1 Performance Exhaust Header
  'exhaust-header.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark6" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <linearGradient id="inoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="30%" stop-color="#E2E8F0"/>
      <stop offset="60%" stop-color="#94A3B8"/>
      <stop offset="85%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="weldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark6)"/>
  <!-- CNC Laser-Cut Cylinder Head Flange (Top) -->
  <rect x="50" y="45" width="300" height="24" rx="4" fill="url(#inoxGrad)" stroke="#0F172A" stroke-width="3"/>
  <!-- 4 Exhaust Port Inlets -->
  <circle cx="95" cy="57" r="14" fill="#0A0B0E" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="165" cy="57" r="14" fill="#0A0B0E" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="235" cy="57" r="14" fill="#0A0B0E" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="305" cy="57" r="14" fill="#0A0B0E" stroke="#94A3B8" stroke-width="2"/>
  <!-- 4 Primary Mandrel-Bent Runners (Pair 1 & 4, Pair 2 & 3) -->
  <g fill="none" stroke="url(#inoxGrad)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 95 69 C 95 140 130 180 150 210"/>
    <path d="M 165 69 C 165 130 160 170 155 210"/>
    <path d="M 235 69 C 235 130 240 170 245 210"/>
    <path d="M 305 69 C 305 140 270 180 250 210"/>
  </g>
  <!-- 2 Secondary Collectors (2-into-1) with Titanium TIG Weld Rings -->
  <rect x="135" y="205" width="35" height="15" rx="3" fill="url(#inoxGrad)" stroke="#0F172A" stroke-width="2"/>
  <line x1="135" y1="212" x2="170" y2="212" stroke="url(#weldGlow)" stroke-width="3"/>
  <rect x="230" y="205" width="35" height="15" rx="3" fill="url(#inoxGrad)" stroke="#0F172A" stroke-width="2"/>
  <line x1="230" y1="212" x2="265" y2="212" stroke="url(#weldGlow)" stroke-width="3"/>
  <!-- Secondary Downpipes to Final Collector -->
  <g fill="none" stroke="url(#inoxGrad)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 152 220 C 152 270 185 300 200 320"/>
    <path d="M 248 220 C 248 270 215 300 200 320"/>
  </g>
  <!-- Final 2.5-Inch Collector & 2-Bolt Flange -->
  <rect x="180" y="315" width="40" height="35" rx="4" fill="url(#inoxGrad)" stroke="#0F172A" stroke-width="3"/>
  <line x1="180" y1="328" x2="220" y2="328" stroke="url(#weldGlow)" stroke-width="4"/>
  <!-- Exit Flange -->
  <ellipse cx="200" cy="355" rx="35" ry="12" fill="url(#inoxGrad)" stroke="#0F172A" stroke-width="3"/>
  <circle cx="200" cy="355" r="15" fill="#0A0B0E"/>
  <circle cx="172" cy="355" r="5" fill="#E2E8F0"/>
  <circle cx="228" cy="355" r="5" fill="#E2E8F0"/>
</svg>`,

  // 7. SS80 Chrome Honeycomb Front Grille with Vintage 'M' Emblem
  'chrome-grille.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark7" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <linearGradient id="chromeBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="25%" stop-color="#CBD5E1"/>
      <stop offset="70%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <pattern id="honeycomb" width="20" height="34.64" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 20 5.77 L 20 17.32 L 10 23.09 L 0 17.32 L 0 5.77 Z M 10 34.64 L 20 28.87 L 20 17.32 L 10 23.09 L 0 17.32 L 0 28.87 Z" fill="#0A0B0E" stroke="#475569" stroke-width="1.2"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark7)"/>
  <!-- Chrome Grille Outer Frame -->
  <g transform="translate(20, 100)">
    <rect x="0" y="0" width="360" height="200" rx="12" fill="url(#chromeBevel)" stroke="#0F172A" stroke-width="4"/>
    <!-- Inner Recessed Mesh Area -->
    <rect x="16" y="16" width="328" height="168" rx="8" fill="url(#honeycomb)" stroke="#0F172A" stroke-width="3"/>
    <!-- Horizontal Chrome Center Accent Louver -->
    <line x1="16" y1="100" x2="344" y2="100" stroke="url(#chromeBevel)" stroke-width="6"/>
    <!-- Central Vintage Maruti 'M' Shield Emblem Badge -->
    <g transform="translate(180, 100)">
      <polygon points="0,-42 36,-18 28,36 0,48 -28,36 -36,-18" fill="#E10600" stroke="url(#chromeBevel)" stroke-width="4"/>
      <!-- Vintage Winged 'M' Mark -->
      <path d="M -20 -15 L -10 18 L 0 -5 L 10 18 L 20 -15" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`,

  // 8. Yenkay Analog Speedometer & Gauge Cluster
  'speedometer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark8" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <radialGradient id="gaugeFace" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="#0F172A"/>
      <stop offset="95%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#334155"/>
    </radialGradient>
    <linearGradient id="chromeBezel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="30%" stop-color="#CBD5E1"/>
      <stop offset="70%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark8)"/>
  <!-- Chrome Outer Bezel Ring -->
  <circle cx="200" cy="200" r="160" fill="url(#chromeBezel)" stroke="#0A0B0E" stroke-width="6"/>
  <!-- Dark Matte Dial Face -->
  <circle cx="200" cy="200" r="145" fill="url(#gaugeFace)" stroke="#0F172A" stroke-width="4"/>
  <!-- Speed Ticks & Numbers (0 to 140 km/h) -->
  <g stroke="#FFFFFF" stroke-width="2.5">
    <line x1="85" y1="265" x2="100" y2="255"/>
    <line x1="68" y1="200" x2="85" y2="200" stroke-width="4"/>
    <line x1="85" y1="135" x2="100" y2="145"/>
    <line x1="135" y1="85" x2="145" y2="100" stroke-width="4"/>
    <line x1="200" y1="68" x2="200" y2="85" stroke-width="4"/>
    <line x1="265" y1="85" x2="255" y2="100" stroke-width="4"/>
    <line x1="315" y1="135" x2="300" y2="145"/>
    <line x1="332" y1="200" x2="315" y2="200" stroke-width="4" stroke="#E10600"/>
    <line x1="315" y1="265" x2="300" y2="255" stroke-width="4" stroke="#E10600"/>
  </g>
  <!-- Numeric Dial Labels -->
  <text x="105" y="210" font-family="sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">20</text>
  <text x="120" y="150" font-family="sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">40</text>
  <text x="155" y="110" font-family="sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">60</text>
  <text x="200" y="98" font-family="sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">80</text>
  <text x="245" y="110" font-family="sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">100</text>
  <text x="280" y="150" font-family="sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">120</text>
  <text x="295" y="210" font-family="sans-serif" font-size="14" font-weight="900" fill="#E10600" text-anchor="middle">140</text>
  <!-- Brand Badge & Unit -->
  <text x="200" y="145" font-family="sans-serif" font-size="10" font-weight="900" fill="#94A3B8" text-anchor="middle" letter-spacing="2">YENKAY</text>
  <text x="200" y="160" font-family="monospace" font-size="8" font-weight="700" fill="#64748B" text-anchor="middle">km/h</text>
  <!-- Mechanical Rolling Odometer Window -->
  <rect x="155" y="225" width="90" height="24" rx="3" fill="#0A0B0E" stroke="#475569" stroke-width="1.5"/>
  <text x="200" y="242" font-family="monospace" font-size="14" font-weight="900" fill="#E2E8F0" text-anchor="middle" letter-spacing="3">042110</text>
  <!-- Red Gauge Needle Pointer -->
  <g transform="translate(200, 200) rotate(15)">
    <polygon points="-4,20 4,20 1,-125 -1,-125" fill="#E10600" stroke="#7F1D1D" stroke-width="1"/>
    <circle cx="0" cy="0" r="16" fill="#0A0B0E" stroke="#CBD5E1" stroke-width="3"/>
    <circle cx="0" cy="0" r="6" fill="#E10600"/>
  </g>
</svg>`,

  // 9. 7-inch Sealed-Beam Round Halogen Headlight
  'headlight.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark9" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <radialGradient id="glassLens" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="40%" stop-color="#E0F2FE"/>
      <stop offset="75%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark9)"/>
  <!-- Chrome Headlamp Retaining Ring -->
  <circle cx="200" cy="200" r="160" fill="#CBD5E1" stroke="#0F172A" stroke-width="6"/>
  <!-- Convex Fluted Glass Lens -->
  <circle cx="200" cy="200" r="145" fill="url(#glassLens)" stroke="#1E293B" stroke-width="4" opacity="0.9"/>
  <!-- Vintage Vertical Fluted Optical Prisms -->
  <g stroke="#FFFFFF" stroke-width="1.8" opacity="0.65">
    <line x1="120" y1="120" x2="120" y2="280"/><line x1="140" y1="95" x2="140" y2="305"/>
    <line x1="160" y1="80" x2="160" y2="320"/><line x1="180" y1="70" x2="180" y2="330"/>
    <line x1="200" y1="65" x2="200" y2="335"/><line x1="220" y1="70" x2="220" y2="330"/>
    <line x1="240" y1="80" x2="240" y2="320"/><line x1="260" y1="95" x2="260" y2="305"/>
    <line x1="280" y1="120" x2="280" y2="280"/>
  </g>
  <!-- Center Bulb Reflector Shield -->
  <circle cx="200" cy="200" r="28" fill="#F8FAFC" stroke="#0284C7" stroke-width="2.5"/>
  <circle cx="200" cy="200" r="12" fill="#FBBF24" opacity="0.8"/>
</svg>`,

  // 10. Performance Coilover Suspension Strut with Red Spring
  'suspension-coilover.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgDark10" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#181A20"/>
      <stop offset="100%" stop-color="#0A0B0E"/>
    </radialGradient>
    <linearGradient id="strutMetal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="50%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgDark10)"/>
  <g transform="translate(200, 200) rotate(-25) translate(-200, -200)">
    <!-- Top Pillowball Pillow Mount -->
    <rect x="140" y="30" width="120" height="24" rx="4" fill="#E10600" stroke="#0F172A" stroke-width="3"/>
    <circle cx="200" cy="42" r="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
    <!-- Top Spring Perch -->
    <polygon points="160,54 240,54 230,75 170,75" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
    <!-- Chrome Damper Piston Shaft -->
    <rect x="188" y="75" width="24" height="240" fill="#F1F5F9" stroke="#0F172A" stroke-width="2"/>
    <!-- Coiled Racing Red Suspension Spring -->
    <g fill="none" stroke="#E10600" stroke-width="22" stroke-linecap="round">
      <path d="M 155 85 Q 200 65 245 85"/>
      <path d="M 155 125 Q 200 105 245 125"/>
      <path d="M 155 165 Q 200 145 245 165"/>
      <path d="M 155 205 Q 200 185 245 205"/>
      <path d="M 155 245 Q 200 225 245 245"/>
    </g>
    <!-- Threaded Aluminum Shock Body (Bottom) -->
    <rect x="175" y="240" width="50" height="95" fill="url(#strutMetal)" stroke="#0F172A" stroke-width="3"/>
    <!-- Height Adjustment Locking Collars -->
    <rect x="160" y="245" width="80" height="12" rx="2" fill="#F59E0B" stroke="#0F172A" stroke-width="2"/>
    <rect x="160" y="260" width="80" height="12" rx="2" fill="#F59E0B" stroke="#0F172A" stroke-width="2"/>
    <!-- Lower Eyelet Bushing Mount -->
    <circle cx="200" cy="355" r="20" fill="#E10600" stroke="#0F172A" stroke-width="3"/>
    <circle cx="200" cy="355" r="10" fill="#0A0B0E" stroke="#CBD5E1" stroke-width="2"/>
  </g>
</svg>`,
};

for (const [filename, svgContent] of Object.entries(parts)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log('Wrote part svg:', filename);
}
console.log('Finished generating all 10 high-definition automotive part assets in client/public/parts!');
