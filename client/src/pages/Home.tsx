import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import { listingService } from '../services/listingService.js';
import { IListing } from '../types/index.js';
import { VehicleSelector } from '../components/marketplace/VehicleSelector.js';
import { ProductCard } from '../components/marketplace/ProductCard.js';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader.js';

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  partLabel: string;
  partPrice: string;
  linkUrl: string;
}

export const Home: React.FC = () => {
  const [featuredListings, setFeaturedListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // 4 Curated Hero Slides with Authentic Real Part Photography
  const HERO_SLIDES: HeroSlide[] = [
    {
      title: 'Yamaha RX100 Original Mikuni Slide Carburetor',
      subtitle: 'New Old Stock (NOS) • Factory Preserved',
      image: '/parts/carburetor.jpg',
      partLabel: 'Mikuni VM20 • Japan Spec',
      partPrice: '₹8,500',
      linkUrl: '/explore?search=RX100',
    },
    {
      title: 'NGK Laser Iridium Performance Spark Plug Kit',
      subtitle: 'Laser-Welded Iridium Electrode • High Durability',
      image: '/parts/spark-plug.jpg',
      partLabel: 'NGK Iridium • Pack of 4',
      partPrice: '₹2,400',
      linkUrl: '/explore?search=Spark',
    },
    {
      title: 'Maruti 800 SS80 Original Chrome Honeycomb Grille',
      subtitle: '1983-1986 Series 1 • Genuine OEM Emblem',
      image: '/parts/chrome-grille.jpg',
      partLabel: 'SS80 Chrome • Series 1',
      partPrice: '₹6,200',
      linkUrl: '/explore?search=Maruti%20800',
    },
    {
      title: 'Yamaha RD350 High Torque Cylinder Head & Piston Kit',
      subtitle: 'Original 30.5 BHP Spec • Glass-Bead Cleaned',
      image: '/parts/cylinder-piston.jpg',
      partLabel: 'RD350 HT Heads • Matched Pair',
      partPrice: '₹24,500',
      linkUrl: '/explore?search=RD350',
    },
  ];

  // Auto-advance hero carousel with gentle timing
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, HERO_SLIDES.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const listingsRes = await listingService.getFeaturedListings();
        setFeaturedListings(listingsRes.slice(0, 8));
      } catch (err) {
        console.warn('Home data load error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 6 Subtle, Essential Categories with Real Part Photography
  const CATEGORIES = [
    {
      name: 'Engine & Intake',
      desc: 'Carburetors, pistons, valves & blocks',
      slug: 'Engine Parts',
      image: '/parts/carburetor.jpg',
    },
    {
      name: 'Brakes & Friction',
      desc: 'Ventilated rotors, drums & pads',
      slug: 'Braking System',
      image: '/parts/brake-rotor.jpg',
    },
    {
      name: 'Suspension & Steering',
      desc: 'Coilovers, struts, bushings & arms',
      slug: 'Suspension',
      image: '/parts/suspension-coilover.jpg',
    },
    {
      name: 'Ignition & Electrical',
      desc: 'Distributors, spark plugs & coils',
      slug: 'Electrical & Ignition',
      image: '/parts/spark-plug.jpg',
    },
    {
      name: 'Body, Trim & Grilles',
      desc: 'Chrome grilles, emblems & spoilers',
      slug: 'Body & Chassis',
      image: '/parts/chrome-grille.jpg',
    },
    {
      name: 'Exhaust & Manifolds',
      desc: 'Headers, mufflers & downpipes',
      slug: 'Exhaust & Intake',
      image: '/parts/exhaust-header.jpg',
    },
  ];

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className="space-y-20 pb-24 text-[#E5E5E5] bg-transparent">
      {/* 1. SUBTLE & ELEGANT HERO SECTION */}
      <section
        className="relative pt-28 sm:pt-32 pb-4 px-4 sm:px-6 lg:px-8 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-[1680px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Clean, Uncluttered Typography & Primary Actions */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            {/* Minimal Sub-Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2A2A2A] text-[11px] font-mono text-[#BAC0CD]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
              AUTHENTIC RETRO AUTOMOTIVE SPARES
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.08]">
                Original Parts.
              </h1>
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#E10600] tracking-tight uppercase leading-[1.08]">
                Timeless Performance.
              </h1>
            </div>

            {/* Clean Subtext */}
            <p className="text-xs sm:text-sm text-[#888888] max-w-lg leading-relaxed font-sans font-normal">
              The curated marketplace for rare, vintage, and discontinued car and motorcycle components. Mapped to exact vehicle fitment with verified provenance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/explore">
                <button
                  type="button"
                  className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  Explore Catalog <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link to="/garage">
                <button
                  type="button"
                  className="bg-[#181818] hover:bg-[#222222] border border-[#2A2A2A] hover:border-[#383838] text-[#E5E5E5] px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Find by Vehicle
                </button>
              </Link>
            </div>

            {/* Subtle Carousel Progress Indicators */}
            <div className="flex items-center gap-2 pt-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-8 bg-[#E10600]' : 'w-2 bg-[#2A2A2A] hover:bg-[#444444]'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Quiet, Crisp Product Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#262626] bg-[#121212] group">
              <Link
                to={activeSlideData.linkUrl}
                className="block w-full h-full flex items-center justify-center p-6 cursor-pointer"
              >
                <img
                  key={activeSlideData.image}
                  src={activeSlideData.image}
                  alt={activeSlideData.title}
                  className="max-h-full max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-105 animate-fade-in"
                />
              </Link>

              {/* Discreet Floating Caption Pill */}
              <Link
                to={activeSlideData.linkUrl}
                className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded bg-[#161616]/95 border border-[#2A2A2A] backdrop-blur-sm flex items-center justify-between text-xs z-10 hover:border-[#E10600] transition-colors cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-white uppercase truncate font-display text-[12px]">
                    {activeSlideData.partLabel}
                  </p>
                  <p className="text-[10px] text-[#888888] truncate">{activeSlideData.subtitle}</p>
                </div>
                <span className="font-mono font-bold text-[#E10600] shrink-0 text-xs">
                  {activeSlideData.partPrice}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CATEGORIES (Clean, Subtle Grid) */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div>
            <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
              COMPONENT ARCHIVE
            </span>
            <h2 className="text-base sm:text-lg font-display font-bold uppercase text-white tracking-wide">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#E10600] transition-colors flex items-center gap-1"
          >
            All Categories <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              to={`/explore?category=${encodeURIComponent(cat.slug)}`}
              className="group flex flex-col items-center bg-[#141414] border border-[#222222] hover:border-[#383838] rounded-lg p-3 transition-all duration-200"
            >
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden mb-2 rounded bg-[#0F0F0F] p-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain rounded group-hover:scale-105 transition-transform duration-300 brightness-95"
                />
              </div>
              <span className="text-center text-[11px] font-bold uppercase tracking-wider text-[#E5E5E5] group-hover:text-[#E10600] transition-colors truncate w-full">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED SPARES COLLECTION */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div>
            <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
              VERIFIED INVENTORY
            </span>
            <h2 className="text-base sm:text-lg font-display font-bold uppercase text-white tracking-wide">
              Featured Parts
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#E10600] transition-colors flex items-center gap-1"
          >
            Explore Catalog <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredListings.map((listing) => (
              <ProductCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* 5. SUBTLE VEHICLE FITMENT SELECTOR */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="p-5 sm:p-6 rounded-lg bg-[#141414] border border-[#222222] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 text-[#E10600]" />
              <div>
                <h3 className="text-sm font-display font-bold uppercase text-white">
                  Filter by Vehicle Fitment
                </h3>
                <p className="text-[11px] text-[#888888]">
                  Select your make, model, and year to see verified compatible components
                </p>
              </div>
            </div>
            <Link
              to="/garage"
              className="text-xs font-bold uppercase text-[#888888] hover:text-[#E10600] transition-colors flex items-center gap-1"
            >
              My Garage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <VehicleSelector />
        </div>
      </section>

      {/* 6. CONCIERGE RARE PART SOURCING (Quiet, High-End Banner) */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="p-6 sm:p-7 rounded-lg bg-[#141414] border border-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#E10600] uppercase tracking-wider font-bold">
              RARE PART CONCIERGE
            </span>
            <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase">
              Looking for an Unavailable Component?
            </h3>
            <p className="text-xs text-[#888888] max-w-xl font-sans leading-relaxed">
              Broadcast a sourcing request across our network of verified vintage restorers and collectors. Receive direct price offers and condition disclosures.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/wanted?new=true">
              <button
                type="button"
                className="bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
              >
                Post Part Request
              </button>
            </Link>
            <Link to="/wanted">
              <button
                type="button"
                className="bg-[#1E1E1E] hover:bg-[#282828] text-[#E5E5E5] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-[#2A2A2A] transition-colors"
              >
                View Requests
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
