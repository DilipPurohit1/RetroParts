import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Search,
  Wrench,
  CheckCircle,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const buyerSteps = [
    {
      num: '01',
      title: 'CHOOSE VEHICLE',
      desc: 'Select your Make, Model, Year, and Engine variant to filter genuine spares tailored to your build.',
    },
    {
      num: '02',
      title: 'SEARCH SPARE',
      desc: 'Search by keyword, OEM part number, category, or browse curated New Old Stock (NOS) inventory.',
    },
    {
      num: '03',
      title: 'CHECK FITMENT',
      desc: 'Use our live Fitment Engine to verify OEM dimensions, mounting tabs, and chassis compatibility.',
    },
    {
      num: '04',
      title: 'PART PASSPORT™',
      desc: 'Review Part Passport™ certificate for stamp authenticity, storage history, and flaw disclosures.',
    },
    {
      num: '05',
      title: 'ESCROW VAULT',
      desc: 'Checkout securely. Funds are held in Escrow protection until you physically inspect delivery.',
    },
  ];

  const rarePartSteps = [
    {
      num: '01',
      title: 'POST REQUEST',
      desc: 'Post a bounty with vehicle specs, required part condition, photos, and your target budget.',
    },
    {
      num: '02',
      title: 'STOCKIST ALERTS',
      desc: 'Our deterministic scoring engine alerts verified stockists and restorers who carry matching inventory.',
    },
    {
      num: '03',
      title: 'DIRECT QUOTES',
      desc: 'Restorers reply directly with authentic part photos, condition grade, price quote, and dispatch estimate.',
    },
    {
      num: '04',
      title: 'COMPARE & CHAT',
      desc: 'Compare incoming seller bids, chat directly in real time to clarify specs, and accept the best offer.',
    },
    {
      num: '05',
      title: 'ESCROW FULFILL',
      desc: 'Complete the purchase seamlessly through the Escrow protection system with full tracking.',
    },
  ];

  const faqs = [
    {
      q: 'How does RetroParts guarantee part compatibility?',
      a: 'Every listing is indexed with vehicle make, model, chassis variant, and production year range. Our multi-token fitment engine prevents orders of incompatible parts.',
    },
    {
      q: 'What is the Part Passport™ certificate?',
      a: 'The Part Passport™ is a documented provenance record disclosing stamped OEM markings, manufacturing era, refurbishment logs, and condition assessments before purchase.',
    },
    {
      q: 'How does Escrow Protection work for buyers and sellers?',
      a: 'When an order is placed, buyer funds are safely locked in vault escrow. The seller dispatches the part. Once delivered, the buyer has a 48-hour inspection window before funds are released to the seller.',
    },
    {
      q: 'What happens if a part I need is not listed in the catalog?',
      a: 'You can post a Rare Part Request on our Wanted Board. Our nationwide network of verified classic stockists and master restorers receive instant notifications and send direct price quotes.',
    },
  ];

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E10600] px-3 py-1 rounded bg-[#161616] border border-[#2A2A2A] inline-block">
          WORKFLOW & FAQ
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
          How RetroParts Works
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] font-sans">
          A seamless, vehicle-first ecosystem connecting classic vehicle owners with authentic stockists.
        </p>
      </div>

      {/* Workflow 1: Buying In-Stock Rare Parts */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#E10600] block">
              PATHWAY 01
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white">
              Finding & Buying In-Stock Spares
            </h2>
          </div>
          <Link to="/explore">
            <button className="bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5">
              Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {buyerSteps.map((step) => (
            <div key={step.num} className="p-4 rounded bg-[#222222] border border-[#2A2A2A] space-y-2 relative">
              <span className="text-[11px] font-mono font-bold text-[#E10600]">
                {step.num}
              </span>
              <h3 className="font-display font-bold text-sm uppercase text-white">
                {step.title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow 2: Sourcing Hard-to-Find Spares */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#FFB800] block">
              PATHWAY 02
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white">
              Sourcing Impossible-to-Find Spares
            </h2>
          </div>
          <Link to="/wanted?new=true">
            <button className="bg-[#222222] hover:bg-[#2A2A2A] text-white border border-[#2A2A2A] hover:border-[#E10600] px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5">
              Post Wanted Request <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {rarePartSteps.map((step) => (
            <div key={step.num} className="p-4 rounded bg-[#222222] border border-[#2A2A2A] space-y-2 relative">
              <span className="text-[11px] font-mono font-bold text-[#FFB800]">
                {step.num}
              </span>
              <h3 className="font-display font-bold text-sm uppercase text-white">
                {step.title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] space-y-6">
        <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white border-b border-[#2A2A2A] pb-3">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded bg-[#222222] border border-[#2A2A2A] space-y-2">
              <h4 className="font-bold text-white font-display text-sm uppercase">{faq.q}</h4>
              <p className="text-xs text-[#888888] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
