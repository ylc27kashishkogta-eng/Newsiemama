import React from 'react';
import { VisualExplainerItem } from '../types';
import {
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  BarChart3,
  CheckCircle2,
  Info,
  Navigation,
  Compass,
  Zap,
  Activity
} from 'lucide-react';

interface VisualExplainerProps {
  explainer: VisualExplainerItem;
}

export const VisualExplainer: React.FC<VisualExplainerProps> = ({ explainer }) => {
  const getHeaderIcon = () => {
    switch (explainer.type) {
      case 'timeline':
        return <Clock className="w-4 h-4 text-[#4e6c58]" />;
      case 'map':
        return <Compass className="w-4 h-4 text-[#b9533f]" />;
      case 'chart':
        return <BarChart3 className="w-4 h-4 text-[#963f2e]" />;
      case 'comparison':
        return <Activity className="w-4 h-4 text-[#4e6c58]" />;
      case 'steps':
      default:
        return <Layers className="w-4 h-4 text-[#4e6c58]" />;
    }
  };

  const getBadgeLabel = () => {
    switch (explainer.type) {
      case 'timeline':
        return 'Chronological Timeline';
      case 'map':
        return 'Corridor Transit Map';
      case 'chart':
        return 'Comparative Data Chart';
      case 'comparison':
        return 'Labeled Comparison';
      case 'steps':
      default:
        return 'Step-by-Step Sequence';
    }
  };

  return (
    <div className="bg-[#faf6f0] border border-[#e2d5c7] rounded-2xl p-5 sm:p-6 my-4 shadow-xs">
      {/* Explainer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#e8ded5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ffffff] border border-[#d8ccc0] flex items-center justify-center shadow-2xs">
            {getHeaderIcon()}
          </div>
          <div>
            <h5 className="font-serif-editorial font-bold text-base sm:text-lg text-[#1e1b18] leading-tight">
              {explainer.title}
            </h5>
            {explainer.subtitle && (
              <p className="text-xs text-[#6e685f] mt-0.5 font-serif-editorial">
                {explainer.subtitle}
              </p>
            )}
          </div>
        </div>

        <span className="self-start sm:self-auto text-[10px] font-mono-meta uppercase tracking-wider font-bold text-[#6e685f] bg-[#f0e8df] px-2.5 py-1 rounded-full border border-[#ded4c7]">
          {getBadgeLabel()}
        </span>
      </div>

      {/* 1. TIMELINE GRAPHIC */}
      {explainer.type === 'timeline' && (
        <div className="relative pl-6 sm:pl-8 space-y-4 my-4 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#cbbfb0]">
          {explainer.items.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Pin/Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border-2 transition-transform ${
                  item.highlight
                    ? 'bg-[#b9533f] border-[#ffffff] ring-3 ring-[#b9533f]/30 scale-110'
                    : 'bg-[#ffffff] border-[#4e6c58]'
                }`}
              />

              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  item.highlight
                    ? 'bg-[#ffffff] border-[#b9533f]/50 shadow-2xs'
                    : 'bg-[#f7f2eb] border-[#e2d7cc]'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                  <span
                    className={`text-xs font-mono-meta font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                      item.highlight
                        ? 'bg-[#f5e6e1] text-[#963f2e]'
                        : 'bg-[#ede5dc] text-[#5c5449]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.subtext && (
                    <span className="text-[11px] text-[#8f887d] font-mono-meta">
                      {item.subtext}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#2d2720] font-medium leading-relaxed font-serif-editorial">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. STEP-BY-STEP DIAGRAM */}
      {explainer.type === 'steps' && (
        <div className="space-y-3 my-4">
          {explainer.items.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                item.highlight
                  ? 'bg-[#ffffff] border-[#b9533f]/50 shadow-2xs ring-1 ring-[#b9533f]/20'
                  : 'bg-[#f7f2eb] border-[#e2d7cc]'
              }`}
            >
              {/* Numbered Step Disc */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs font-mono-meta ${
                  item.highlight
                    ? 'bg-[#b9533f] text-[#faf7f2] shadow-xs'
                    : 'bg-[#ede5dc] text-[#5c5449]'
                }`}
              >
                {idx + 1}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                  <h6 className="font-bold text-xs sm:text-sm text-[#1e1b18]">
                    {item.label}
                  </h6>
                  {item.subtext && (
                    <span className="text-[10px] text-[#8f887d] font-mono-meta">
                      {item.subtext}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#3a332a] leading-relaxed font-serif-editorial">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. LABELED COMPARISON CARDS */}
      {explainer.type === 'comparison' && (
        <div className="space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {explainer.items.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  item.highlight
                    ? 'bg-[#ffffff] border-[#4e6c58]/50 shadow-2xs ring-1 ring-[#4e6c58]/20'
                    : 'bg-[#f7f2eb] border-[#e2d7cc]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-mono-meta font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        item.highlight
                          ? 'bg-[#edf2ee] text-[#3b5744]'
                          : 'bg-[#ede5dc] text-[#6e685f]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.highlight && (
                      <span className="text-[10px] font-bold text-[#4e6c58] flex items-center gap-1 font-mono-meta">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Advantage</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#2d2720] leading-relaxed font-medium mb-3 font-serif-editorial">
                    {item.text}
                  </p>
                </div>

                {item.subtext && (
                  <div className="pt-2 border-t border-[#e8ded5] text-[11px] text-[#8f887d] font-mono-meta">
                    {item.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SCHEMATIC ROUTE MAP */}
      {explainer.type === 'map' && explainer.mapData && (
        <div className="my-4 space-y-3">
          {/* Map Overview Header Pill */}
          <div className="bg-[#f0e8df] p-3 rounded-xl border border-[#ded4c7] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#1e1b18] font-bold">
              <Navigation className="w-4 h-4 text-[#b9533f]" />
              <span>{explainer.mapData.corridorName}</span>
            </div>
            <span className="text-[11px] text-[#6e685f] font-mono-meta font-semibold">
              {explainer.mapData.statSummary}
            </span>
          </div>

          {/* Connected Route Stations & Waypoints */}
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e4dcd3] space-y-3">
            <div className="text-[11px] font-mono-meta uppercase tracking-wider text-[#8f887d] font-bold">
              Corridor Waypoints & Hub Terminals
            </div>

            <div className="relative pl-6 space-y-3 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-1 before:bg-[#b9533f]/30">
              {explainer.mapData.stops.map((stop, idx) => (
                <div key={idx} className="relative flex items-start gap-2.5">
                  <div
                    className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 ${
                      stop.isTerminal
                        ? 'bg-[#b9533f] border-[#ffffff] ring-2 ring-[#b9533f]'
                        : 'bg-[#ffffff] border-[#4e6c58]'
                    }`}
                  />
                  <div className="flex-1 bg-[#fcf9f5] p-2.5 rounded-lg border border-[#ece4dc]">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <span className="font-bold text-xs text-[#1e1b18]">
                        {stop.name}
                      </span>
                      {stop.isTerminal && (
                        <span className="text-[9px] font-mono-meta uppercase font-bold text-[#963f2e] bg-[#f5e6e1] px-1.5 py-0.2 rounded-xs">
                          Key Terminal
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5c5449] font-serif-editorial mt-0.5">
                      {stop.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SMALL COMPARATIVE DATA CHART */}
      {explainer.type === 'chart' && explainer.chartData && (
        <div className="my-4 bg-[#ffffff] p-4 sm:p-5 rounded-xl border border-[#e4dcd3] space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-meta">
            <span className="font-bold text-[#1e1b18] uppercase tracking-wider">
              {explainer.chartData.metricLabel}
            </span>
            {explainer.chartData.unit && (
              <span className="text-[#8f887d]">{explainer.chartData.unit}</span>
            )}
          </div>

          {/* Bar Chart Rows */}
          <div className="space-y-3">
            {explainer.chartData.bars.map((bar, idx) => {
              const maxVal = Math.max(...(explainer.chartData?.bars.map((b) => b.value) || [100]));
              const barWidth = Math.max(Math.round((bar.value / maxVal) * 100), 12);

              const barBg =
                bar.color === 'sage'
                  ? 'bg-[#4e6c58]'
                  : bar.color === 'terracotta'
                  ? 'bg-[#b9533f]'
                  : 'bg-[#a39a8e]';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#1e1b18] flex items-center gap-1.5 font-serif-editorial">
                      <span>{bar.label}</span>
                      {bar.isTarget && (
                        <span className="text-[10px] font-mono-meta font-bold text-[#3b5744] bg-[#edf2ee] px-1.5 py-0.2 rounded-xs">
                          Target Zone
                        </span>
                      )}
                    </span>
                    <span className="font-bold font-mono-meta text-[#1e1b18]">
                      {bar.displayValue}
                    </span>
                  </div>

                  {/* Horizontal Bar Graphic */}
                  <div className="w-full bg-[#f0e8df] h-3.5 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full ${barBg} rounded-full transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {bar.subtext && (
                    <div className="text-[10px] text-[#8f887d] font-mono-meta">
                      {bar.subtext}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Explanatory Text Paragraph (Ensures meaning is clear without relying solely on graphic) */}
      {explainer.explanationText && (
        <div className="bg-[#ffffff] p-3.5 rounded-xl border border-[#ece4dc] text-xs text-[#3a332a] leading-relaxed my-3">
          <strong className="text-[#1e1b18] font-bold block mb-1">
            Why this visual matters:
          </strong>
          <span className="font-serif-editorial text-xs sm:text-sm text-[#4a4237]">
            {explainer.explanationText}
          </span>
        </div>
      )}

      {/* Illustrative Trust Disclosure Note */}
      {explainer.illustrativeNote && (
        <div className="flex items-start gap-1.5 text-[11px] text-[#8f887d] pt-2 border-t border-[#e8ded5]">
          <Info className="w-3.5 h-3.5 shrink-0 text-[#a39a8e] mt-0.5" />
          <span className="italic font-serif-editorial">
            {explainer.illustrativeNote}
          </span>
        </div>
      )}
    </div>
  );
};
