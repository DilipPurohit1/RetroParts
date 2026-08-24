import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wrench,
  Search,
  Truck,
  MessageSquare,
  CreditCard,
  Zap,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does RetroParts guarantee part compatibility?',
    a: 'Every listing is indexed with vehicle make, model, chassis variant, and production year range. Our multi-token fitment engine cross-references all these fields so you only see parts that fit your exact build — zero guesswork.',
  },
  {
    q: 'What is the Part Passport™ certificate?',
    a: 'Part Passport™ is a documented provenance record disclosing OEM part stamps, manufacturing era, storage history, refurbishment logs, and any condition disclosures. It accompanies every listing before you purchase.',
  },
  {
    q: 'How does Escrow Protection work?',
    a: 'When an order is placed, buyer funds are safely locked in vault escrow. The seller dispatches the part with tracking. Once delivered, the buyer has a 48-hour inspection window before funds are released to the seller.',
  },
  {
    q: 'What if the part I need is not listed in the catalog?',
    a: 'Post a Rare Part Bounty on the Wanted Board. Our nationwide network of verified classic stockists and master restorers receive instant notifications and reply directly with price quotes and photos.',
  },
  {
    q: 'Are all sellers verified?',
    a: 'Yes. Every seller undergoes a manual verification process including identity confirmation, parts provenance review, and listing accuracy checks before they can transact on the platform.',
  },
  {
    q: 'What vehicles does RetroParts cover?',
    a: 'RetroParts covers all classic, vintage, and discontinued Indian and imported cars and motorcycles — including Maruti 800, Ambassador, Premier Padmini, Yamaha RX100/RD350, Royal Enfield Bullet, BMW, Toyota, Mitsubishi Lancer, and many more.',
  },
];

const BUYER_STEPS = [
  { icon: Search,       num: '01', title: 'Choose Your Vehicle',   desc: 'Select Make, Model, Year, and Engine variant from your Garage to filter spares tailored to your exact build.'    },
  { icon: Wrench,       num: '02', title: 'Search for the Spare',  desc: 'Search by keyword, OEM part number, category, or browse curated New Old Stock (NOS) inventory.'                },
  { icon: ShieldCheck,  num: '03', title: 'Verify Fitment',        desc: 'Use the live Fitment Engine to confirm OEM dimensions, mounting specs, and chassis compatibility before buying.'   },
  { icon: MessageSquare,num: '04', title: 'Review Part Passport™', desc: 'Inspect the provenance certificate: OEM stamps, storage history, refurbishment records, and flaw disclosures.'   },
  { icon: CreditCard,   num: '05', title: 'Checkout via Escrow',   desc: 'Funds are held in secure vault escrow and only released after your 48-hour post-delivery inspection window.'      },
];

const BOUNTY_STEPS = [
  { icon: Zap,          num: '01', title: 'Post a Bounty',         desc: 'Post a sourcing request with vehicle specs, required part condition, reference photos, and your target budget.'    },
  { icon: Truck,        num: '02', title: 'Stockist Alerts Go Out', desc: 'Our deterministic scoring engine alerts verified specialist stockists and restorers holding matching inventory.'   },
  { icon: MessageSquare,num: '03', title: 'Receive Direct Quotes', desc: 'Sellers reply with authentic part photos, condition grade, price quote, and dispatch ETA — all in one thread.'     },
  { icon: Search,       num: '04', title: 'Compare & Chat',        desc: 'Compare incoming bids side-by-side, chat in real-time to clarify specs, and accept the most verified offer.'       },
  { icon: CreditCard,   num: '05', title: 'Complete via Escrow',   desc: 'Finalize the purchase through the secure Escrow protection system with full shipment tracking and dispute cover.'  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#222222] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-[#141414] hover:bg-[#181818] transition-colors"
      >
        <span className="text-sm font-bold text-white font-display uppercase pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#E10600] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-[#888888] shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 py-4 bg-[#111111] border-t border-[#1E1E1E]">
          <p className="text-xs text-[#AAAAAA] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export const About: React.FC = () => {
  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-20 min-h-screen text-[#E5E5E5] bg-transparent text-left">

      {/* ── Hero Header ─────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E10600] px-3 py-1 rounded bg-[#161616] border border-[#2A2A2A] inline-block">
          OUR MISSION, WORKFLOW & FAQ
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight leading-tight">
          Keeping Automotive Heritage<br />Alive On The Road.
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-sans max-w-2xl mx-auto">
          RetroParts is the dedicated vehicle-first marketplace and restoration ecosystem for rare, vintage, discontinued, and hard-to-find car and motorcycle spares across India.
        </p>
      </div>

      {/* ── About: Mission & Trust Promise ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Problem Statement */}
        <div className="space-y-5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFB800]">
            THE RESTORER'S CHALLENGE
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white leading-snug">
            Why Generic E-Commerce Fails Classic Vehicle Owners
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-sans">
            Owners of older or uncommon vehicles face an uphill battle. Dealerships stop stocking parts after 10–15 years, and mainstream e-commerce focuses only on high-volume modern cars. Unverified classifieds lack fitment guarantees, often resulting in wrong or counterfeit parts.
          </p>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-sans">
            RetroParts bridges this gap by cataloging authentic New Old Stock (NOS), original refurbished, and period-correct performance spares with exact model year and engine variant cross-referencing.
          </p>
        </div>

        {/* Right: Trust Promise */}
        <div className="p-6 sm:p-8 rounded-lg bg-[#141414] border border-[#222222] space-y-4">
          <h3 className="font-display font-bold uppercase text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E10600]" />
            THE RETROPARTS TRUST PROMISE
          </h3>
          <div className="space-y-3 text-xs text-[#888888]">
            {[
              { title: '100% Fitment Compatibility',   body: 'Parts are mapped to exact vehicle models, years, and engine variants. Zero guesswork.' },
              { title: 'Part Passport™ Provenance',     body: 'Immutable records documenting OEM stamps, storage history, and metallurgical disclosures.' },
              { title: 'Rare Parts Wanted Board',       body: 'If a spare isn\'t listed, our community of specialist stockists receives instant alerts.' },
              { title: 'Vault Escrow Protection',       body: 'Funds remain securely vaulted until the buyer physically inspects part condition.' },
            ].map(({ title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span><strong className="text-white">{title}:</strong> {body}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How It Works: Pathway 01 ─────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#222222] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#E10600] block mb-1">PATHWAY 01</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white">Finding & Buying In-Stock Spares</h2>
          </div>
          <Link to="/explore">
            <button className="bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shrink-0">
              Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BUYER_STEPS.map(({ icon: Icon, num, title, desc }) => (
            <div key={num} className="p-4 rounded-lg bg-[#141414] border border-[#222222] space-y-2.5 hover:border-[#333333] transition-colors">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#E10600] shrink-0" />
                <span className="text-[11px] font-mono font-bold text-[#E10600]">{num}</span>
              </div>
              <h3 className="font-display font-bold text-sm uppercase text-white">{title}</h3>
              <p className="text-xs text-[#888888] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How It Works: Pathway 02 ─────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#222222] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#FFB800] block mb-1">PATHWAY 02</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white">Sourcing Impossible-to-Find Spares</h2>
          </div>
          <Link to="/wanted?new=true">
            <button className="bg-[#1E1E1E] hover:bg-[#252525] text-white border border-[#2A2A2A] hover:border-[#E10600] px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shrink-0">
              Post Wanted Request <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BOUNTY_STEPS.map(({ icon: Icon, num, title, desc }) => (
            <div key={num} className="p-4 rounded-lg bg-[#141414] border border-[#222222] space-y-2.5 hover:border-[#333333] transition-colors">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span className="text-[11px] font-mono font-bold text-[#FFB800]">{num}</span>
              </div>
              <h3 className="font-display font-bold text-sm uppercase text-white">{title}</h3>
              <p className="text-xs text-[#888888] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ Accordion ────────────────────────────────────── */}
      <div className="space-y-5">
        <div className="border-b border-[#222222] pb-4">
          <span className="text-[10px] font-mono font-bold uppercase text-[#888888] block mb-1">COMMON QUESTIONS</span>
          <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <div className="p-7 sm:p-10 rounded-lg bg-[#141414] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase">Have Vintage Spares in Your Garage?</h3>
          <p className="text-xs text-[#888888]">
            Join our network of verified stockists and connect with classic vehicle restorers nationwide.
          </p>
        </div>
        <Link to="/sell" className="shrink-0">
          <button className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2">
            List Your Spares <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

    </div>
  );
};
