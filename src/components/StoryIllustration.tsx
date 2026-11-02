import React, { useState, useEffect } from 'react';
import { Story } from '../types';
import { illustrationService, IllustrationResponse } from '../services/illustrationService';
import { useProfile } from '../context/ProfileContext';
import {
  Palette,
  Sparkles,
  AlertCircle,
  Info,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface StoryIllustrationProps {
  story: Story;
  layout?: 'lead' | 'drawer' | 'card';
  className?: string;
}

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  story,
  layout = 'lead',
  className = '',
}) => {
  const { reducedMotion } = useProfile();
  const [result, setResult] = useState<IllustrationResponse | null>(() =>
    illustrationService.getCached(story.id) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSetupDetails, setShowSetupDetails] = useState(false);

  // Sync cache if story changes
  useEffect(() => {
    setResult(illustrationService.getCached(story.id) || null);
    setShowPrompt(false);
  }, [story.id]);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const res = await illustrationService.generateIllustration(story);
      setResult(res);
      if (!res.configured) {
        setShowSetupDetails(true);
      }
    } catch {
      setResult({
        success: false,
        configured: false,
        error: 'Unable to reach the illustration endpoint.'
      });
      setShowSetupDetails(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Initial State: Button to trigger on-demand generation
  if (!result && !isLoading) {
    return (
      <div className={`my-4 ${className}`}>
        <div className="bg-[#faf6f0] border-2 border-dashed border-[#e7ded3] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fde8df] text-[#82351f] border border-[#f5cbbe] flex items-center justify-center shrink-0">
              <Palette className="w-4.5 h-4.5 text-[#0f766e]" />
            </div>
            <div>
              <span className="font-serif-editorial text-sm font-bold text-[#191715] block">
                Editorial AI Illustration
              </span>
              <span className="text-[11px] text-[#5c554e] font-sans">
                Generate conceptual artwork in Moodpaper's peach & teal palette, based strictly on headline facts.
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] font-bold text-xs shadow-xs transition-transform active:scale-98 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Illustration</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Loading State (only shown when request is actually in-flight)
  if (isLoading) {
    return (
      <div className={`my-4 bg-[#faf6f0] border-2 border-dashed border-[#0f766e] rounded-2xl p-6 text-center animate-pulse ${className}`}>
        <RefreshCw className="w-6 h-6 text-[#0f766e] animate-spin mx-auto mb-2" />
        <h4 className="font-serif-editorial text-sm font-bold text-[#191715]">
          Synthesizing Editorial Artwork...
        </h4>
        <p className="text-xs text-[#5c554e] font-mono-meta mt-1 max-w-md mx-auto">
          Contacting server-side Gemini image proxy (gemini-nano-banana-2.1). Generating conceptual artwork for "{story.title.slice(0, 60)}..."
        </p>
      </div>
    );
  }

  // 3. Unconfigured Provider State (honest disclosure with exact setup instructions, NO fake images)
  if (result && !result.configured) {
    return (
      <div className={`my-4 bg-[#fde8df] border-2 border-[#f5cbbe] rounded-2xl p-5 text-left shadow-2xs ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffffff] text-[#9e4429] flex items-center justify-center shrink-0 border border-[#f5cbbe]">
              <AlertCircle className="w-4 h-4 text-[#9e4429]" />
            </div>
            <div>
              <h4 className="font-serif-editorial text-sm font-bold text-[#82351f]">
                AI Image Generation Unconfigured
              </h4>
              <p className="text-xs text-[#9e4429] font-sans">
                Moodpaper uses Google's supported gemini-nano-banana-2.1 model via a server-side proxy to protect API keys.
              </p>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="p-1 text-[#82351f] hover:text-[#191715] rounded-md transition-colors cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setup Guide */}
        <div className="mt-3.5 pt-3 border-t border-[#f5cbbe] text-xs text-[#5c554e] space-y-2">
          <span className="font-mono-meta font-bold uppercase tracking-wider text-[10px] text-[#82351f] block">
            Setup Needed to Enable Illustrations:
          </span>
          <ol className="list-decimal list-inside space-y-1 font-mono-meta text-[11px] text-[#2a241f] bg-[#ffffff] p-3 rounded-xl border border-[#f5cbbe]">
            <li>Create a <code className="text-[#0f766e] font-bold">.env</code> file in the project root.</li>
            <li>Add <code className="text-[#0f766e] font-bold">GEMINI_API_KEY=your_key</code> from Google AI Studio.</li>
            <li>Restart the local dev server: <code className="text-[#0f766e] font-bold">npm run dev</code></li>
          </ol>
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0f766e] font-bold hover:underline"
            >
              <span>Get API Key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleGenerate}
              className="text-[#82351f] font-semibold hover:underline cursor-pointer"
            >
              Retry Check
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Provider Error State (when configured but upstream returned an error)
  if (result && !result.success && result.configured) {
    return (
      <div className={`my-4 bg-[#fde8df] border border-[#f5cbbe] rounded-2xl p-4 text-xs text-[#82351f] ${className}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold">Provider returned an error:</span>
          <button onClick={() => setResult(null)} className="p-1 hover:text-[#191715]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="font-mono-meta text-[11px] mt-1">{result.message || result.error}</p>
        <button
          onClick={handleGenerate}
          className="mt-2 text-xs font-bold text-[#0f766e] hover:underline cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 5. Success State: Editorial Illustration Displayed
  if (result && result.success && result.imageUrl) {
    const isLead = layout === 'lead';
    return (
      <figure className={`my-5 relative rounded-2xl sm:rounded-3xl border-2 border-[#e7ded3] overflow-hidden bg-[#ffffff] shadow-sm ${reducedMotion ? '' : 'animate-image-reveal'} ${className}`}>
        {/* Permanent Compliance Label */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191715]/85 text-[#ffffff] text-[10px] font-mono-meta font-bold tracking-wider uppercase backdrop-blur-sm border border-[#ffffff]/20 shadow-xs">
          <Palette className="w-3 h-3 text-[#99f6e4]" />
          <span>AI-generated illustration</span>
        </div>

        {/* Regenerate Button in Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="p-1.5 rounded-full bg-[#ffffff]/90 hover:bg-[#ffffff] text-[#191715] shadow-xs backdrop-blur-sm transition-transform active:scale-95 cursor-pointer border border-[#e7ded3]"
            title="Generate a new editorial illustration variation"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0f766e] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* The Generated Editorial Artwork */}
        <div className={`w-full overflow-hidden bg-[#faf6f0] ${isLead ? 'max-h-[460px]' : 'max-h-[320px]'}`}>
          <img
            src={result.imageUrl}
            alt={`Conceptual editorial illustration for: ${story.title}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
            loading="lazy"
          />
        </div>

        {/* Editorial Caption & Grounding Transparency */}
        <figcaption className="bg-[#faf6f0] border-t border-[#e7ded3] p-3 sm:p-4 text-xs text-[#5c554e]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0f766e] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Editorial Transparency:</strong> Conceptual artwork generated from reported facts in <strong>{story.sourceName}</strong>. Does not depict real documentary photographs or real human likenesses.
              </p>
            </div>

            {/* Prompt Inspector Toggle */}
            {result.promptUsed && (
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="inline-flex items-center gap-1 text-[11px] font-mono-meta text-[#0f766e] hover:text-[#115e59] font-bold self-start sm:self-auto cursor-pointer shrink-0"
              >
                <span>{showPrompt ? 'Hide Prompt' : 'Inspect Prompt'}</span>
                {showPrompt ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Inspected Art Prompt Box */}
          {showPrompt && result.promptUsed && (
            <div className="mt-3 p-3 bg-[#ffffff] border border-[#e7ded3] rounded-xl text-[10px] font-mono-meta text-[#2a241f] leading-relaxed animate-paper-fade">
              <span className="font-bold text-[#0f766e] uppercase tracking-wider block mb-1">
                Grounded Art Direction Prompt:
              </span>
              <p className="whitespace-pre-wrap">{result.promptUsed}</p>
            </div>
          )}
        </figcaption>
      </figure>
    );
  }

  return null;
};
