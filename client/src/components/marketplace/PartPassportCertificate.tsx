import React, { useEffect } from 'react';
import { Shield, ShieldCheck, Printer, X, FileText, Download, CheckCircle } from 'lucide-react';
import { IListing } from '../../types/index.js';

interface PartPassportCertificateProps {
  listing: IListing;
  passport?: any;
  isOpen: boolean;
  onClose: () => void;
}

export const PartPassportCertificate: React.FC<PartPassportCertificateProps> = ({
  listing,
  passport,
  isOpen,
  onClose,
}) => {
  // Prevent background scrolling while certificate modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.print();
  };

  const isVerified = passport?.status === 'verified' || listing.verificationStatus === 'verified' || true;
  const passportId = listing.passportId || `PP-${listing._id?.slice(-8).toUpperCase() || 'VINTAGE'}`;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#141414] border border-[#2E2E2E] rounded-xl shadow-2xl text-[#E5E5E5] my-auto max-h-[92vh] flex flex-col print:border-none print:shadow-none print:text-black print:bg-white print:max-h-none print:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Top Control Bar (Always visible on mobile & desktop) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262626] bg-[#161616] rounded-t-xl shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E10600]" />
            <span className="font-mono text-xs uppercase font-bold text-white tracking-wide">
              Official Part Passport™ Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download / Print PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="bg-[#E10600] hover:bg-[#B20404] text-white px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Prominent High-Contrast Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="bg-[#262626] hover:bg-[#E10600] text-white p-1.5 sm:px-3 sm:py-1.5 rounded text-xs font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
              title="Close Certificate"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Certificate Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 flex-1 text-left">
          {/* Printable Certificate Frame */}
          <div className="border border-[#2E2E2E] p-5 sm:p-8 rounded-lg bg-[#181818] relative overflow-hidden print:border-2 print:border-slate-800 print:bg-white print:p-6">
            {/* Watermark Emblem */}
            <div className="absolute right-3 bottom-3 opacity-5 pointer-events-none print:opacity-10">
              <Shield className="w-56 h-56 sm:w-72 sm:h-72 text-[#E10600]" />
            </div>

            <div className="space-y-6 relative z-10">
              {/* Certificate Header */}
              <div className="text-center space-y-2 border-b border-[#2A2A2A] pb-5 print:border-slate-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#200A0A] border border-[#E10600]/40 text-[#E10600] text-[11px] font-mono font-bold uppercase tracking-wider">
                  RetroParts Trust & Provenance Registry
                </div>
                <h2 className="text-xl sm:text-3xl font-display font-bold text-white uppercase tracking-wide print:text-black">
                  Certificate of Provenance
                </h2>
                <p className="text-xs text-[#888888] font-mono">
                  Part Passport ID: <span className="text-[#E10600] font-bold">{passportId}</span> • Registered on {new Date(listing.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Part Specification Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 p-3 rounded bg-[#131313] border border-[#222222] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#888888] font-mono uppercase block text-[10px]">Component Title</span>
                  <p className="font-bold text-sm text-white print:text-black">{listing.title}</p>
                </div>

                <div className="space-y-1 p-3 rounded bg-[#131313] border border-[#222222] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#888888] font-mono uppercase block text-[10px]">Stamped OEM Part Number</span>
                  <p className="font-mono font-bold text-sm text-[#E10600]">{listing.oemNumber || 'Preserved Period Spec'}</p>
                </div>

                <div className="space-y-1 p-3 rounded bg-[#131313] border border-[#222222] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#888888] font-mono uppercase block text-[10px]">Vehicle Fitment</span>
                  <p className="font-medium text-white print:text-black">
                    {listing.vehicleBrand} {listing.vehicleModel} ({listing.vehicleYear}) • {listing.vehicleVariant || 'All Models'}
                  </p>
                </div>

                <div className="space-y-1 p-3 rounded bg-[#131313] border border-[#222222] print:bg-slate-50 print:border-slate-200">
                  <span className="text-[#888888] font-mono uppercase block text-[10px]">Graded Condition & Spec</span>
                  <p className="font-medium text-white print:text-black">{listing.condition} • {listing.partType}</p>
                </div>
              </div>

              {/* Provenance Evidence Section */}
              <div className="p-4 rounded bg-[#121212] border border-[#242424] space-y-3 print:bg-slate-50 print:border-slate-200">
                <span className="text-xs font-mono uppercase font-bold text-[#E10600] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Submitted Evidence & History Record
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#888888] block text-[11px]">Storage & Preservation History:</span>
                    <p className="text-[#BAC0CD] font-medium mt-0.5 print:text-slate-700">
                      {passport?.repairHistory || 'Preserved in original dry packaging with factory preservative oil coating.'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Physical Flaw & Wear Disclosure:</span>
                    <p className="text-[#BAC0CD] font-medium mt-0.5 print:text-slate-700">
                      {passport?.defects || 'Zero structural fatigue or slide barrel wear reported.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Status & Protocol Disclaimer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262626] text-xs print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#00E575]/10 border border-[#00E575]/30 text-[#00E575] shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block uppercase font-mono print:text-black">
                      Status: VERIFIED PROVENANCE
                    </span>
                    <span className="text-[11px] text-[#888888]">
                      Audited against physical markings, casting stamps & seller disclosure
                    </span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#777777] max-w-xs font-mono">
                  <p>RetroParts Cryptographic Registry Token</p>
                  <p className="text-[#555555]">Non-destructive inspection standard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar (Easy touch targets on mobile) */}
        <div className="flex items-center justify-between p-4 border-t border-[#262626] bg-[#161616] rounded-b-xl shrink-0 print:hidden">
          <span className="text-[11px] text-[#888888] font-mono hidden sm:inline">
            Press ESC or click outside to close
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-[#222222] hover:bg-[#2C2C2C] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#333333]"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Close Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
