import React from 'react';
import { Story } from '../types';
import { useProfile } from '../context/ProfileContext';
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Globe2,
  Leaf,
  Landmark,
  Compass,
  Layers,
  Palette
} from 'lucide-react';
import { getStoryVisualTheme, VisualMotif } from '../services/editorialVisualService';
import { MoodpaperMotifGraphic } from './MoodpaperMotifs';

interface StoryIllustrationProps {
  story: Story;
  layout?: 'lead' | 'drawer' | 'card' | 'compact';
  className?: string;
}

const MOTIF_ICONS: Record<VisualMotif, React.ComponentType<{ className?: string }>> = {
  space: Compass,
  technology: Cpu,
  finance: TrendingUp,
  climate: Leaf,
  politics: Landmark,
  world: Globe2,
  culture: Palette,
  editorial: Layers
};

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  story,
  layout = 'lead',
  className = '',
}) => {
  const { reducedMotion } = useProfile();
  const theme = getStoryVisualTheme(story);
  const MotifIcon = MOTIF_ICONS[theme.motif] || Sparkles;

  const isLead = layout === 'lead';
  const isDrawer = layout === 'drawer';
  const isCard = layout === 'card';
  const isCompact = layout === 'compact';

  // Format date or relative time safely
  const displayTime = story.timeAgo || (story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : 'Today');

  return (
    <figure
      className={`my-5 relative rounded-2xl sm:rounded-3xl border-2 border-[#e7ded3] overflow-hidden bg-[#faf6f0] shadow-sm select-none transition-all ${
        reducedMotion ? '' : 'animate-image-reveal'
      } ${className}`}
    >
      {/* 1. Header Bar: Transparent Compliance & Motif Tags */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        {/* Honest Template-Generated Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191715]/90 text-[#ffffff] text-[10px] font-mono-meta font-bold tracking-wider uppercase backdrop-blur-md border border-[#ffffff]/20 shadow-xs pointer-events-auto">
          <Sparkles className="w-3 h-3 text-[#99f6e4]" />
          <span>Newsiemama Editorial Visual</span>
        </div>

        {/* Dynamic Category/Motif Badge */}
        <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#faf6f0]/95 text-[#0f766e] text-[10px] font-mono-meta font-bold tracking-wider uppercase backdrop-blur-md border border-[#e7ded3] shadow-xs pointer-events-auto">
          <MotifIcon className="w-3 h-3 text-[#0f766e]" />
          <span>{theme.editorialKicker}</span>
        </div>
      </div>

      {/* 2. Procedural Canvas Art (SVG Graphic) */}
      <div
        className={`w-full relative overflow-hidden bg-[#faf6f0] ${
          isLead ? 'h-[280px] sm:h-[360px] md:h-[400px]' : isDrawer ? 'h-[240px] sm:h-[300px]' : isCard ? 'h-[200px] sm:h-[240px]' : 'h-[180px]'
        }`}
      >
        <MoodpaperMotifGraphic
          motif={theme.motif}
          reducedMotion={reducedMotion}
          metric={theme.metric}
        />

        {/* 3. Dynamic Editorial Overlay Plaque */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="bg-[#ffffff]/94 backdrop-blur-md border border-[#e7ded3] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Context: Publisher, Headline & Topic */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 text-[10px] sm:text-[11px] font-mono-meta font-bold text-[#0f766e]">
                  <span className="uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f0fdfa] border border-[#99f6e4]">
                    {story.sourceName}
                  </span>
                  <span className="text-[#8c8278]">•</span>
                  <span className="text-[#5c554e]">{displayTime}</span>
                </div>

                <h3 className="font-serif-editorial text-xs sm:text-sm font-bold text-[#191715] leading-snug line-clamp-2">
                  {story.title}
                </h3>
              </div>

              {/* Right Side: Grounded Metric Callout OR Thematic Dispatch Emblem */}
              {theme.metric ? (
                /* Factual Metric Plaque (Strictly Real Extracted Numbers) */
                <div className="shrink-0 bg-[#fde8df]/90 border border-[#f5cbbe] rounded-xl p-2.5 sm:px-3.5 sm:py-2 text-left sm:text-right min-w-[140px]">
                  <div className="flex items-center sm:justify-end gap-1 text-[10px] font-mono-meta font-bold text-[#82351f] uppercase tracking-wider mb-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#0f766e]" />
                    <span>{theme.metric.label}</span>
                  </div>

                  <div className="font-serif-editorial text-lg sm:text-xl font-black text-[#191715] tracking-tight">
                    {theme.metric.value}
                  </div>

                  {/* Benchmark Bar if valid percentage */}
                  {typeof theme.metric.benchmarkRatio === 'number' && (
                    <div className="mt-1 w-full bg-[#ffffff] h-1.5 rounded-full overflow-hidden border border-[#f5cbbe]">
                      <div
                        className="bg-[#0f766e] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, theme.metric.benchmarkRatio * 100))}%` }}
                      />
                    </div>
                  )}

                  <span className="text-[9px] font-mono-meta text-[#5c554e] block mt-0.5">
                    Extracted from dispatch
                  </span>
                </div>
              ) : (
                /* Thematic Dispatch Emblem (Truthful fallback when no numbers exist) */
                <div className="shrink-0 bg-[#faf6f0] border border-[#e7ded3] rounded-xl px-3 py-1.5 text-left sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1 text-[10px] font-mono-meta font-bold text-[#0f766e] uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-[#0f766e]" />
                    <span>Thematic Motif</span>
                  </div>
                  <span className="text-[10px] font-sans text-[#5c554e] block">
                    {theme.motifTitle}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Editorial Caption & Grounding Transparency */}
      <figcaption className="bg-[#faf6f0] border-t border-[#e7ded3] p-3 sm:p-4 text-xs text-[#5c554e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0f766e] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Template-generated Editorial Graphic:</strong> Procedurally styled with SVG/CSS based on reported facts in <strong>{story.sourceName}</strong>. Not an AI-generated image.
            </p>
          </div>

          <a
            href={story.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono-meta text-[#0f766e] hover:text-[#115e59] hover:underline font-bold shrink-0 self-start sm:self-auto"
          >
            <span>Original Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </figcaption>
    </figure>
  );
};

