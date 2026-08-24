export interface AIIdentificationResult {
  detectedPart: string;
  category: string;
  categorySlug: string;
  vehicleBrand: string;
  vehicleModel: string;
  suggestedTitle: string;
  estimatedOemNumber: string;
  detectedCondition: 'NOS (New Old Stock)' | 'OEM Mint' | 'OEM Refurbished' | 'Used - Grade A' | 'Used - Restorable';
  confidenceScore: number;
  tags: string[];
  visualHighlights: string[];
}

// Catalog of known vintage part signatures for deterministic AI visual simulation
const VINTAGE_SIGNATURES = [
  {
    keywords: ['carburetor', 'carb', 'mikuni', 'slide', 'fuel', 'jet'],
    detectedPart: 'Round Slide Carburetor Assembly',
    category: 'Engine Parts',
    categorySlug: 'engine-parts',
    vehicleBrand: 'Yamaha',
    vehicleModel: 'RX100',
    suggestedTitle: 'Yamaha RX100 Original Mikuni VM20 Slide Carburetor (Made in Japan)',
    estimatedOemNumber: '17G-14101-00-JP',
    detectedCondition: 'NOS (New Old Stock)' as const,
    confidenceScore: 0.94,
    tags: ['Mikuni Japan', '20mm Slide', 'Factory Preservative Oil', 'Flange Mount'],
    visualHighlights: ['Authentic "MIKUNI CORP. JAPAN" stamp detected', 'Zero slide barrel wear', 'Factory brass jets intact'],
  },
  {
    keywords: ['speedometer', 'gauge', 'meter', 'cluster', 'dial', 'yenkay', 'veglia'],
    detectedPart: 'Instrument Gauge Cluster Assembly',
    category: 'Lighting & Gauges',
    categorySlug: 'lighting-gauges',
    vehicleBrand: 'Yamaha',
    vehicleModel: 'RX100',
    suggestedTitle: 'Yamaha RX100 Original Yenkay Speedometer & Gauge Cluster',
    estimatedOemNumber: '17G-83510-00-YK',
    detectedCondition: 'NOS (New Old Stock)' as const,
    confidenceScore: 0.96,
    tags: ['Yenkay Escorts', 'Crisp White Dial', 'Original Green Neutral Lens'],
    visualHighlights: ['Period-correct 120 km/h face detected', 'Factory wiring coupler intact', 'Zero UV lens fading'],
  },
  {
    keywords: ['grille', 'honeycomb', 'chrome', 'emblem', 'badge', 'front'],
    detectedPart: 'Front Honeycomb Chrome Grille',
    category: 'Body & Chassis',
    categorySlug: 'body-chassis',
    vehicleBrand: 'Maruti Suzuki',
    vehicleModel: '800 (SS80)',
    suggestedTitle: 'Maruti 800 SS80 Original Chrome Honeycomb Front Grille with Logo',
    estimatedOemNumber: 'SZ-71711-78000',
    detectedCondition: 'OEM Mint' as const,
    confidenceScore: 0.91,
    tags: ['SS80 DX', 'Central M Emblem', 'Factory Nickel Chrome'],
    visualHighlights: ['Authentic Maruti SS80 1st Gen honeycomb pattern', 'All rear mounting tabs intact', 'Zero chrome pitting'],
  },
  {
    keywords: ['brake', 'pad', 'disc', 'caliper', 'rotor', 'shim'],
    detectedPart: 'Front Disc Brake Pad Axle Set',
    category: 'Brakes & Hydraulics',
    categorySlug: 'brakes-hydraulics',
    vehicleBrand: 'Honda',
    vehicleModel: 'City Type-Z',
    suggestedTitle: 'Honda City Type-Z OEM Semi-Metallic Front Brake Pad Set',
    estimatedOemNumber: '45022-SX8-T00',
    detectedCondition: 'NOS (New Old Stock)' as const,
    confidenceScore: 0.89,
    tags: ['Semi-Metallic', 'Anti-Rattle Shims', 'SX8 Type-Z Fitment'],
    visualHighlights: ['Factory acoustic wear indicator detected', 'Honda OEM backing plate markings'],
  },
  {
    keywords: ['crankshaft', 'crank', 'flywheel', 'connecting rod', 'engine'],
    detectedPart: 'Heavy Cast-Iron Crankshaft Assembly',
    category: 'Engine Parts',
    categorySlug: 'engine-parts',
    vehicleBrand: 'Royal Enfield',
    vehicleModel: 'Bullet 350 (Cast Iron)',
    suggestedTitle: 'Royal Enfield Bullet 350 Heavy Crankshaft & Flywheel Assembly',
    estimatedOemNumber: 'RE-110023-CRK',
    detectedCondition: 'OEM Refurbished' as const,
    confidenceScore: 0.93,
    tags: ['Cast Iron G2', 'Heavy Flywheel', 'Precision Dynamic Balanced'],
    visualHighlights: ['Authentic Redditch spec heavy flywheel weights', 'Needle bearing journal surface pristine'],
  },
  {
    keywords: ['hubcap', 'wheel', 'fiat', 'star', 'cap', 'chrome'],
    detectedPart: 'Vintage Chrome Hubcap Set with Fiat Star',
    category: 'Wheels & Hubs',
    categorySlug: 'wheels-hubs',
    vehicleBrand: 'Premier',
    vehicleModel: 'Padmini / Fiat 1100D',
    suggestedTitle: 'Premier Padmini Vintage Chrome Hubcaps with Fiat Star Emblem',
    estimatedOemNumber: 'PAL-4091182-HC',
    detectedCondition: 'NOS (New Old Stock)' as const,
    confidenceScore: 0.95,
    tags: ['Fiat Star Insignia', '14-inch Wheel Fitment', 'Spring Tension Clips'],
    visualHighlights: ['Mirror finish triple-plated chrome', 'Embossed central Fiat star detected'],
  },
];

export const identifyVintagePartFromImage = async (
  imageUrlOrName: string,
  hintQuery?: string
): Promise<AIIdentificationResult> => {
  // Simulate AI computer vision latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const textToScan = `${imageUrlOrName} ${hintQuery || ''}`.toLowerCase();

  // Find best matching signature
  for (const sig of VINTAGE_SIGNATURES) {
    if (sig.keywords.some((kw) => textToScan.includes(kw))) {
      return sig;
    }
  }

  // Default fallback if unknown component photo
  return {
    detectedPart: 'Vintage Automotive Component',
    category: 'Body & Chassis',
    categorySlug: 'body-chassis',
    vehicleBrand: 'Yamaha',
    vehicleModel: 'RX100',
    suggestedTitle: 'Authentic Vintage Motorcycle OEM Component',
    estimatedOemNumber: 'OEM-VINTAGE-SPEC',
    detectedCondition: 'OEM Mint',
    confidenceScore: 0.82,
    tags: ['Vintage Stock', 'Authentic Spec', 'Physical Component Inspected'],
    visualHighlights: ['Clean factory stamping detected', 'Period-correct metallurgy identified'],
  };
};
