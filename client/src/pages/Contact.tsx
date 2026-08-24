import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext.js';

export const Contact: React.FC = () => {
  const { success } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    vehicleInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      success('Thank you for contacting RetroParts. Our restoration support team will get back to you within 24 hours.', 'Inquiry received');
      setFormData({ name: '', email: '', subject: '', message: '', vehicleInfo: '' });
    }, 600);
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-block px-3 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-[#161616] text-[#E10600] border border-[#2A2A2A]">
          CONCIERGE & SUPPORT
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
          Contact <span className="text-[#E10600]">RetroParts</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] font-sans">
          Need help locating a rare part, authenticating provenance, or resolving an order? Our vintage automotive specialists are ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#161616] border border-[#2A2A2A] rounded p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-display font-bold uppercase text-white tracking-wider border-b border-[#2A2A2A] pb-3">
              DIRECT CHANNELS
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded bg-[#222222] text-[#E10600] border border-[#2A2A2A] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#888888] uppercase font-mono">Email Concierge</h3>
                  <p className="text-sm font-bold text-white">support@retroparts.com</p>
                  <p className="text-[11px] text-[#888888]">Typically replies within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded bg-[#222222] text-[#E10600] border border-[#2A2A2A] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#888888] uppercase font-mono">Restorer Helpline</h3>
                  <p className="text-sm font-bold text-white">+91 98765 43210</p>
                  <p className="text-[11px] text-[#888888]">Mon – Sat, 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded bg-[#222222] text-[#E10600] border border-[#2A2A2A] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#888888] uppercase font-mono">Headquarters</h3>
                  <p className="text-sm font-bold text-white">RetroParts Technologies Pvt Ltd</p>
                  <p className="text-[11px] text-[#888888]">Indiranagar 100ft Road, Bengaluru, Karnataka 560038</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#2A2A2A] space-y-3 text-xs text-[#888888]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified escrow and secure buyer protection guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E10600]" />
                <span>Dedicated Part Passport™ provenance authentication team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-[#161616] border border-[#2A2A2A] rounded p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-base font-display font-bold uppercase text-white tracking-wider border-b border-[#2A2A2A] pb-3">
              SEND AN INQUIRY
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Inquiry Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourcing OEM RX100 Speedo"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Vehicle Make / Model / Year</label>
                <input
                  type="text"
                  placeholder="e.g. Premier Padmini 1988"
                  value={formData.vehicleInfo}
                  onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Your Message *</label>
              <textarea
                required
                rows={5}
                placeholder="Please include part numbers, vehicle VIN/chassis details, or order reference numbers..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E10600] hover:bg-[#B20404] text-white py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Delivering Inquiry...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
