import React, { useState } from 'react';
import { Zap, Activity, Gauge, TrendingUp, Cpu } from 'lucide-react';
import { Badge } from '../common/Badge.js';

interface DynoTelemetryViewerProps {
  partTitle: string;
  vehicleModel: string;
  stockHp?: number;
  gainHp?: number;
  stockTorque?: number;
  gainTorque?: number;
  peakRpm?: number;
}

export const DynoTelemetryViewer: React.FC<DynoTelemetryViewerProps> = ({
  partTitle,
  vehicleModel,
  stockHp = 280,
  gainHp = 45,
  stockTorque = 350,
  gainTorque = 65,
  peakRpm = 7200,
}) => {
  const [activeRpm, setActiveRpm] = useState<number>(6000);

  const rpmPoints = [2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];

  const getPowerAtRpm = (rpm: number, isTuned: boolean) => {
    const factor = Math.sin(((rpm - 1000) / 7500) * Math.PI);
    const base = stockHp * Math.max(0.2, factor);
    return Math.round(isTuned ? base + gainHp * (rpm / 8000) : base);
  };

  const getTorqueAtRpm = (rpm: number, isTuned: boolean) => {
    const factor = Math.sin(((rpm - 500) / 6500) * Math.PI);
    const base = stockTorque * Math.max(0.3, factor);
    return Math.round(isTuned ? base + gainTorque * Math.min(1, rpm / 4500) : base);
  };

  const currentHp = getPowerAtRpm(activeRpm, true);
  const currentStockHp = getPowerAtRpm(activeRpm, false);
  const hpDelta = currentHp - currentStockHp;

  return (
    <div className="neo-card p-6 rounded-2xl border border-neo-border bg-neo-card text-neo-text space-y-5 relative overflow-hidden">
      {/* Background glow and HUD grid lines */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-neo-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-neo-magenta/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header telemetry summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-border pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold text-neo-cyan tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-neo-cyan animate-pulse" /> DYNO BENCHMARK TELEMETRY
            </span>
            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-neo-magenta/15 text-neo-magenta border border-neo-magenta/30">
              +{gainHp} HP GAIN
            </span>
          </div>
          <h3 className="font-display font-bold text-base text-neo-text">
            {vehicleModel} Dyno Simulation Curve
          </h3>
          <p className="text-xs text-neo-text-muted">
            Telemetry calculated for <span className="text-neo-cyan font-bold">{partTitle}</span> upgrade
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-neo-text-subtle uppercase block">Max Output</span>
            <span className="font-mono text-lg font-black text-neo-cyan">
              {stockHp + gainHp} <span className="text-xs font-normal text-neo-text-muted">WHP</span>
            </span>
          </div>
          <div className="text-right border-l border-neo-border pl-3">
            <span className="text-[10px] font-mono text-neo-text-subtle uppercase block">Max Torque</span>
            <span className="font-mono text-lg font-black text-neo-magenta">
              {stockTorque + gainTorque} <span className="text-xs font-normal text-neo-text-muted">Nm</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Dyno Graph Display */}
      <div className="space-y-2 relative z-10">
        <div className="h-44 bg-neo-surface rounded-xl border border-neo-border p-4 relative flex items-end justify-between gap-1 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-10 pointer-events-none">
            <div className="border-b border-neo-cyan w-full" />
            <div className="border-b border-neo-cyan w-full" />
            <div className="border-b border-neo-cyan w-full" />
          </div>

          {/* Dyno Bars */}
          {rpmPoints.map((rpm) => {
            const tunedHp = getPowerAtRpm(rpm, true);
            const stockVal = getPowerAtRpm(rpm, false);
            const heightPercent = Math.min(100, (tunedHp / (stockHp + gainHp + 20)) * 100);
            const isSelected = activeRpm === rpm;

            return (
              <div
                key={rpm}
                onClick={() => setActiveRpm(rpm)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                <span
                  className={`text-[9px] font-mono mb-1 transition ${
                    isSelected ? 'text-neo-cyan font-bold scale-110' : 'text-neo-text-subtle group-hover:text-neo-text'
                  }`}
                >
                  {tunedHp}
                </span>
                <div
                  className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 relative ${
                    isSelected
                      ? 'bg-gradient-to-t from-neo-magenta to-neo-cyan shadow-cyan-glow'
                      : 'bg-neo-border group-hover:bg-neo-cyan/40'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {isSelected && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neo-cyan shadow-cyan-glow" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-mono mt-1.5 transition ${
                    isSelected ? 'text-neo-cyan font-bold' : 'text-neo-text-muted'
                  }`}
                >
                  {rpm / 1000}k
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Scrubber Readout */}
        <div className="p-3 rounded-xl bg-neo-surface border border-neo-border flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-neo-cyan" />
            <span className="text-neo-text-muted">RPM Target:</span>
            <span className="text-neo-cyan font-bold">{activeRpm} RPM</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-neo-text-subtle">Baseline:</span>{' '}
              <span className="text-neo-text font-bold">{currentStockHp} HP</span>
            </div>
            <div>
              <span className="text-neo-text-subtle">Kaizo Spec:</span>{' '}
              <span className="text-neo-cyan font-bold">{currentHp} HP</span>{' '}
              <span className="text-neo-magenta font-bold">(+{hpDelta} HP)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
