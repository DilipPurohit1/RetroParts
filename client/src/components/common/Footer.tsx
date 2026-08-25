import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, Send, Facebook, Instagram, Twitter, Youtube, ShieldCheck, Award, Truck, RotateCcw } from 'lucide-react';
import { HeritageLogo } from './HeritageLogo.js';
import { useToast } from '../../context/ToastContext.js';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      success('Subscribed! You will receive stock alerts.', 'Subscribed');
      setEmail('');
    }
  };

  return (
    <footer className="relative z-20 w-full bg-[#0A0A0A] border-t border-[#1E1E1E] text-[#888888] text-xs mt-auto pb-16 md:pb-0">
      {/* ── Tier 1: Trust Badges (2x2 on mobile, 4 in 1 row on desktop) ── */}
      <div className="border-b border-[#1E1E1E] bg-[#0D0D0D] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1680px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {[
            { icon: ShieldCheck, label: '100% Verified', sub: 'Direct provenance check' },
            { icon: Award, label: 'Escrow Vault', sub: 'Safe payout protection' },
            { icon: Truck, label: 'Pan-India Freight', sub: 'Crated logistics' },
            { icon: RotateCcw, label: 'Fitment Guarantee', sub: 'OEM pre-screened' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-[#E10600] shrink-0" />
              <div>
                <span className="block font-bold text-white uppercase text-[10px] sm:text-[11px] tracking-wide">
                  {label}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#777777] hidden sm:block">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tier 2: Main Links Grid (2 columns on mobile, 5 on desktop) ── */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 text-left">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 items-start">
          {/* Brand Info (Spans 2 cols on mobile) */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link to="/">
              <HeritageLogo size="sm" variant="horizontal" showTagline={false} />
            </Link>
            <p className="text-[11px] text-[#888888] leading-relaxed">
              India's premier marketplace for authentic vintage & classic automobile spares.
            </p>
            <div className="flex gap-2 pt-1">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-1.5 rounded bg-[#141414] border border-[#222222] hover:border-[#E10600] hover:text-[#E10600] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Catalog (Column 1 on mobile) */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">
              CATALOG
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {[
                { label: 'All Spares', to: '/explore' },
                { label: 'Engine & Fuel', to: '/explore?category=Engine%20Parts' },
                { label: 'Brakes & Rotors', to: '/explore?category=Braking%20System' },
                { label: 'Electricals', to: '/explore?category=Electrical%20%26%20Ignition' },
                { label: 'Body & Chassis', to: '/explore?category=Body%20%26%20Chassis' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-[#E10600] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform (Column 2 on mobile) */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">
              PLATFORM
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {[
                { label: 'My Garage', to: '/garage' },
                { label: 'Sell a Part', to: '/sell' },
                { label: 'Part Sourcing', to: '/wanted' },
                { label: 'About & FAQ', to: '/about' },
                { label: 'API Docs', to: '/docs' },
              ].map(({ label, to }, i) => (
                <li key={i}>
                  <Link to={to} className="hover:text-[#E10600] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support (Column 1 on mobile tier 2) */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">
              SUPPORT
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {[
                { label: 'Contact Help', to: '/contact' },
                { label: 'Escrow Security', to: '/about' },
                { label: 'Shipping Policy', to: '/about' },
                { label: 'Returns & Claims', to: '/about' },
              ].map(({ label, to }, i) => (
                <li key={i}>
                  <Link to={to} className="hover:text-[#E10600] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dispatch Desk (Column 2 on mobile tier 2) */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">
              DISPATCH
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-1.5">
                <Mail className="w-3 h-3 text-[#E10600] shrink-0 mt-0.5" />
                <span className="text-[#CBD5E1] break-all">concierge@retroparts.in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#E10600] shrink-0" />
                <span className="text-[#CBD5E1]">+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Clock className="w-3 h-3 text-[#E10600] shrink-0 mt-0.5" />
                <span className="text-[#888888] leading-tight">Mon–Sat: 9:30AM–7PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tier 3: Compact Newsletter Row ───────────────── */}
        <div className="mt-8 rounded-lg bg-[#121212] border border-[#252525] p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wide">Stock & Rare Part Alerts</p>
            <p className="text-[10px] sm:text-[11px] text-[#888888]">Get weekly updates on newly catalogued NOS vintage finds.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 sm:w-60 bg-[#0D0D0D] text-[#E5E5E5] placeholder-[#555555] text-[11px] rounded border border-[#2A2A2A] focus:border-[#E10600] focus:outline-none px-3 py-2"
            />
            <button
              type="submit"
              className="shrink-0 bg-[#E10600] hover:bg-[#B20404] text-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1"
            >
              Subscribe <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* ── Tier 4: Copyright Bar ───────────────────────────── */}
        <div className="mt-6 pt-4 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#555555]">
          <p>© 2026 RetroParts India. All rights reserved.</p>
          <div className="flex items-center gap-2.5">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Escrow</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition-colors">Disputes</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
