import React from 'react';
import { Award, AlertCircle } from 'lucide-react';

interface ListingQualityGaugeProps {
  score: number;
  tips?: string[];
  compact?: boolean;
}

export const ListingQualityGauge: React.FC<ListingQualityGaugeProps> = ({ score, tips = [], compact = false }) => {
  let tierColor = 'text-danger border-danger/30 bg-danger/15';
  let tierLabel = 'Needs improvement';
  let barColor = 'bg-danger';

  if (score >= 80) {
    tierColor = 'text-success border-success/30 bg-success/15';
    tierLabel = 'Elite quality';
    barColor = 'bg-success';
  } else if (score >= 50) {
    tierColor = 'text-warning border-warning/30 bg-warning/15';
    tierLabel = 'Good listing';
    barColor = 'bg-warning';
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-surface-raised rounded-full overflow-hidden border border-border">
          <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs font-mono font-medium text-text-primary">{score}/100</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-card border border-border bg-surface space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-text-primary uppercase tracking-wider">Listing quality score</span>
        </div>
        <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${tierColor}`}>
          {score}/100 • {tierLabel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden border border-border">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>

      <p className="text-[11px] text-text-muted leading-relaxed">
        High quality listings with verified OEM part numbers and complete fitment matrices receive up to <strong className="text-text-primary">3.8x more buyer inquiries</strong> and faster checkout.
      </p>

      {/* Actionable Tips */}
      {tips.length > 0 && (
        <div className="pt-2 border-t border-border space-y-1.5">
          <span className="text-[10px] font-medium uppercase text-text-muted">Tips to reach 100/100:</span>
          <ul className="space-y-1">
            {tips.slice(0, 3).map((tip, index) => (
              <li key={index} className="flex items-start gap-1.5 text-[11px] text-text-muted">
                <AlertCircle className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
