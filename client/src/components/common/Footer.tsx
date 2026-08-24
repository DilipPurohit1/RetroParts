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
    <footer className="relative z-20 w-full bg-[#0A0A0A] border-t border-[#1E1E1E] text-[#888888] text-xs mt-auto">

      {/* ── Tier 1: Trust Badges ───────────────────────────────── */}
      <div className="border-b border-[#1E1E1E] bg-[#0D0D0D] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {[
            { icon: ShieldCheck, label: '100% Verified Spares', sub: 'Direct provenance verification' },
            { icon: Award,       label: 'Escrow Vault',         sub: 'Safe payouts upon inspection'  },
            { icon: Truck,       label: 'Pan-India Freight',    sub: 'Crated specialist logistics'   },
            { icon: RotateCcw,   label: 'Fitment Guarantee',    sub: 'Pre-screened OEM compatibility' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5 min-w-[160px]">
              <Icon className="w-4 h-4 text-[#E10600] shrink-0" />
              <div>
                <span className="block font-bold text-white uppercase text-[11px] tracking-wide">{label}</span>
                <span className="text-[10px] text-[#888888]">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tier 2: Main Links Grid ────────────────────────────── */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 items-start">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/">
              <HeritageLogo size="md" variant="horizontal" showTagline={true} />
            </Link>
            <p className="text-[11px] text-[#888888] leading-relaxed max-w-[240px]">
              India's premier marketplace for authentic vintage, discontinued, and classic automobile & motorcycle components.
            </p>
            <div className="flex gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-1.5 rounded bg-[#141414] border border-[#222222] hover:border-[#E10600] hover:text-[#E10600] transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">CATALOG</h4>
            <ul className="space-y-2.5 text-[11px]">
              {[
                { label: 'All Spares',            to: '/explore' },
                { label: 'Engine & Carburetors',  to: '/explore?category=Engine%20Parts' },
                { label: 'Brakes & Rotors',       to: '/explore?category=Braking%20System' },
                { label: 'Ignition & Electrical', to: '/explore?category=Electrical%20%26%20Ignition' },
                { label: 'Body, Trim & Grilles',  to: '/explore?category=Body%20%26%20Chassis' },
              ].map(({ label, to }) => (
                <li key={label}><Link to={to} className="hover:text-[#E10600] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">PLATFORM</h4>
            <ul className="space-y-2.5 text-[11px]">
              {[
                { label: 'Vehicle Garage',     to: '/garage' },
                { label: 'Sell a Part',        to: '/sell' },
                { label: 'Rare Part Bounties', to: '/wanted' },
                { label: 'About Us & FAQ',     to: '/about' },
                { label: 'Platform Mission',   to: '/about' },
              ].map(({ label, to }, i) => (
                <li key={i}><Link to={to} className="hover:text-[#E10600] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">SUPPORT</h4>
            <ul className="space-y-2.5 text-[11px]">
              {[
                { label: 'Contact Concierge', to: '/contact' },
                { label: 'Escrow Protection', to: '/about' },
                { label: 'Shipping & Returns', to: '/about' },
                { label: 'Restorer API',       to: '/docs' },
              ].map(({ label, to }, i) => (
                <li key={i}><Link to={to} className="hover:text-[#E10600] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Dispatch Desk — contacts only, NO email form */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase text-white tracking-widest border-l-2 border-[#E10600] pl-2">DISPATCH DESK</h4>
            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E10600] shrink-0 mt-0.5" />
                <span className="text-[#CBD5E1] break-all">concierge@retroparts.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E10600] shrink-0" />
                <span className="text-[#CBD5E1]">+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#E10600] shrink-0 mt-0.5" />
                <span className="text-[#888888] leading-snug">Mon – Sat<br/>9:30 AM – 7:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tier 3: Full-width Newsletter Row ───────────────── */}
        <div className="mt-10 rounded-lg bg-[#121212] border border-[#252525] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wide mb-0.5">Get Stock & Rare Part Alerts</p>
            <p className="text-[11px] text-[#888888]">Weekly updates on newly catalogued NOS finds and verified restorer listings.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 sm:w-64 bg-[#0D0D0D] text-[#E5E5E5] placeholder-[#555555] text-[11px] rounded border border-[#2A2A2A] focus:border-[#E10600] focus:outline-none px-3 py-2.5"
            />
            <button
              type="submit"
              className="shrink-0 bg-[#E10600] hover:bg-[#B20404] text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
            >
              Subscribe <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* ── Tier 4: Copyright Bar ───────────────────────────── */}
        <div className="mt-8 pt-5 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#555555]">
          <p>© 2024 RetroParts India. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Escrow</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition-colors">Dispute Resolution</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
