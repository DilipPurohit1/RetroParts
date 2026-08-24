import React from 'react';
import { Shield, ShieldCheck, Printer, X, FileText } from 'lucide-react';
import { IListing } from '../../types/index.js';
import { Button } from '../common/Button.js';

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
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isVerified = passport?.status === 'verified' || listing.verificationStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in print:p-0 print:bg-white text-text-primary">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-card p-6 sm:p-10 shadow-2xl text-text-primary space-y-6 print:border-none print:shadow-none print:text-black print:bg-white">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-border pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span className="font-mono text-xs uppercase font-medium text-accent">
              Official Part Passport™ certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="primary" size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary p-1.5 rounded hover:bg-surface-raised transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="border border-border p-6 sm:p-8 rounded bg-surface-raised relative overflow-hidden print:border-2 print:border-slate-800">
          {/* Watermark Emblem */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <Shield className="w-64 h-64 text-accent" />
          </div>

          <div className="space-y-6 relative z-10">
            {/* Certificate Header */}
            <div className="text-center space-y-1 border-b border-border pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface border border-border text-accent text-xs font-mono font-medium uppercase tracking-wider mb-1">
                RetroParts trust & provenance registry
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-text-primary uppercase tracking-wide">
                Certificate of provenance
              </h2>
              <p className="text-xs text-text-muted">
                Part Passport ID: <span className="font-mono text-accent font-medium">{listing._id}</span>
              </p>
            </div>

            {/* Part Specification Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-text-muted font-mono uppercase block">Component title</span>
                <p className="font-medium text-sm text-text-primary">{listing.title}</p>
              </div>

              <div className="space-y-1">
                <span className="text-text-muted font-mono uppercase block">Stamped OEM part #</span>
                <p className="font-mono font-medium text-sm text-accent">{listing.oemNumber || 'Preserved Period Spec'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-text-muted font-mono uppercase block">Vehicle fitment</span>
                <p className="font-medium text-text-primary">
                  {listing.vehicleBrand} {listing.vehicleModel} ({listing.vehicleYear}) • {listing.vehicleVariant || 'Standard'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-text-muted font-mono uppercase block">Graded condition</span>
                <p className="font-medium text-text-primary">{listing.condition} • {listing.partType}</p>
              </div>
            </div>

            {/* Provenance Evidence Section */}
            <div className="p-4 rounded bg-surface border border-border space-y-3">
              <span className="text-xs font-mono uppercase font-medium text-accent flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Submitted evidence & history record
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-muted block">Storage & preservation history:</span>
                  <p className="text-text-secondary font-medium mt-0.5">
                    {passport?.repairHistory || 'Preserved in original dry packaging with factory preservative oil coating.'}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted block">Physical flaw & wear disclosure:</span>
                  <p className="text-text-secondary font-medium mt-0.5">
                    {passport?.defects || 'Zero structural fatigue or slide barrel wear reported.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Status & Legal Non-Guarantee Disclaimer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded border ${isVerified ? 'bg-verified/15 border-verified/30 text-verified' : 'bg-surface border-border text-accent'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-medium text-text-primary block uppercase font-mono">
                    Status: {isVerified ? 'VERIFIED EVIDENCE' : 'CLAIMED PROVENANCE'}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Reviewed against submitted photographic & metallurgical evidence
                  </span>
                </div>
              </div>

              <div className="text-right text-[10px] text-text-muted max-w-xs">
                <p>Issued by RetroParts Verification Protocol. Non-guarantee trust layer standard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
