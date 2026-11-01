import React, { useState, useEffect } from 'react';
import { Story, VoicePreset } from '../types';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
  Share2,
  Check,
  ExternalLink,
  Radio,
  Clock,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface PlaycardDeckProps {
  stories: Story[];
  onOpenExplainer: (story: Story) => void;
  isSaved: (storyId: string) => boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
}

export const PlaycardDeck: React.FC<PlaycardDeckProps> = ({
  stories,
  onOpenExplainer,
  isSaved,
  onToggleSave,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!stories || stories.length === 0) {
    return null;
  }

  const activeStory = stories[currentStoryIndex] || stories[0];
  const slides = activeStory.playcards && activeStory.playcards.length > 0
    ? activeStory.playcards
    : [
        {
          label: 'The Fact',
          title: 'What Happened?',
          body: activeStory.deck || activeStory.content.slice(0, 200) + '...',
          type: 'what' as const
        },
        {
          label: 'Impact',
          title: 'Why It Matters',
          body: (activeStory.keyBullets && activeStory.keyBullets[0]) || `A significant verified development impacting the ${activeStory.category} sector.`,
          type: 'why' as const
        },
        {
          label: 'Outlook',
          title: 'What Could Happen Next (Analysis)',
          body: 'Market analysts, regulators, and industry leaders will evaluate subsequent quarterly milestones.',
          type: 'next' as const
        }
      ];

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentSlideIndex(0);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentSlideIndex(0);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      handleNextStory();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentSlideIndex(slides.length - 1);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(activeStory.canonicalUrl || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const progressPercent = Math.round(((currentStoryIndex + 1) / stories.length) * 100);

  return (
    <div className="max-w-3xl mx-auto my-6 px-3 sm:px-6 animate-paper-fade">
      {/* Top Deck Bar & Global Progress */}
      <div className="bg-[#ffffff] border border-[#e7ded3] rounded-2xl p-4 sm:p-5 mb-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f0fdfa] border border-[#99f6e4] text-[#0f766e] flex items-center justify-center font-bold shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-base sm:text-lg font-bold text-[#191715]">
                  Playcard Reading Deck
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-meta font-bold uppercase tracking-wider bg-[#fde8df] text-[#9e4429] border border-[#f5cbbe]">
                  Gen Z Mode
                </span>
              </div>
              <p className="text-xs text-[#5c554e] font-mono-meta">
                Interactive bite-sized narrative cards for modern readers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-xs font-mono-meta font-bold text-[#0f766e] block">
                Story {currentStoryIndex + 1} of {stories.length}
              </span>
              <span className="text-[11px] text-[#8c8278] font-mono-meta">
                {progressPercent}% of edition
              </span>
            </div>
            <div className="w-20 sm:w-28 h-2 bg-[#f4eee5] rounded-full overflow-hidden border border-[#e7ded3]">
              <div
                className="h-full bg-[#0f766e] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Card Container */}
      <div className="relative bg-[#ffffff] rounded-3xl border-2 border-[#e7ded3] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Editorial Top Accent Strip: Peach to Icy-Blue gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-[#fde8df] via-[#bae6fd] to-[#99f6e4]" />

        {/* Card Content Interior */}
        <div className="p-6 sm:p-9 space-y-6">
          {/* Metadata Row: Category, Source, Live Badge, Save & Share */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f4eee5] pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
                {activeStory.category === 'sports_culture' ? 'Culture' : activeStory.category}
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#f0fdfa] text-[#0f766e] border border-[#99f6e4]">
                <Radio className="w-3 h-3 text-[#0f766e] animate-pulse" />
                <span>Live Feed</span>
              </span>

              <span className="text-xs text-[#5c554e] font-medium font-serif-editorial">
                | {activeStory.sourceName}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-[#8c8278] font-mono-meta">
                <Clock className="w-3 h-3" />
                {activeStory.timeAgo}
              </span>
            </div>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onToggleSave(activeStory.id)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isSaved(activeStory.id)
                    ? 'text-[#0f766e] bg-[#f0fdfa] border border-[#99f6e4]'
                    : 'text-[#8c8278] hover:text-[#191715] hover:bg-[#f9f5ef] border border-transparent'
                }`}
                title={isSaved(activeStory.id) ? 'Saved' : 'Save for later'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved(activeStory.id) ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-[#8c8278] hover:text-[#191715] hover:bg-[#f9f5ef] transition-colors cursor-pointer border border-transparent"
                title="Copy canonical article URL"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#0f766e]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expressive Headline */}
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191715] leading-snug sm:leading-tight tracking-tight">
            {activeStory.title}
          </h2>

          {/* 3-Beat Segmented Progress Selector */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {slides.map((s, idx) => {
              const isSlideActive = currentSlideIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSlideActive
                      ? 'bg-[#fde8df] border-[#f5cbbe] text-[#82351f] shadow-xs ring-1 ring-[#f5cbbe]'
                      : 'bg-[#faf6f0] border-[#e7ded3] text-[#5c554e] hover:bg-[#f4eee5]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono-meta uppercase tracking-wider font-bold mb-1">
                    {idx === 0 && <HelpCircle className="w-3.5 h-3.5 text-[#0f766e]" />}
                    {idx === 1 && <TrendingUp className="w-3.5 h-3.5 text-[#0284c7]" />}
                    {idx === 2 && <Lightbulb className="w-3.5 h-3.5 text-[#9e4429]" />}
                    <span className="truncate">{s.title.split('?')[0]}</span>
                  </div>
                  <div className="text-[11px] font-sans font-medium hidden sm:block truncate opacity-80">
                    {s.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Beat Content Box with Smooth Playcard Transition */}
          <div
            key={`${activeStory.id}-${currentSlideIndex}`}
            onClick={handleNextSlide}
            className="group cursor-pointer select-none bg-[#faf6f0] border-2 border-[#e7ded3] hover:border-[#0f766e] rounded-3xl p-6 sm:p-7 transition-all duration-300 relative overflow-hidden animate-playcard"
            title="Click or tap anywhere inside to advance to next beat"
          >
            {/* Background watermark icon */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 text-[#e7ded3]/60 pointer-events-none -z-0">
              <Sparkles className="w-full h-full" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono-meta uppercase tracking-wider font-bold text-[#0f766e] bg-[#f0fdfa] px-3 py-1 rounded-full border border-[#99f6e4]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Beat {currentSlideIndex + 1} of {slides.length}: {currentSlide.title}</span>
                </span>
                <span className="text-[11px] font-mono-meta text-[#8c8278] group-hover:text-[#0f766e] transition-colors">
                  Tap to advance →
                </span>
              </div>

              <p className="text-base sm:text-lg text-[#2a241f] leading-relaxed font-sans font-normal pt-1">
                {currentSlide.body}
              </p>
            </div>
          </div>

          {/* Actions & Deep Dive Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f4eee5]">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Primary Action: Open Full Narrative Drawer */}
              <button
                onClick={() => onOpenExplainer(activeStory)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Full Article & Narratives</span>
              </button>

              {/* Direct Canonical Link */}
              <a
                href={activeStory.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-[#e7ded3] hover:border-[#191715] text-[#5c554e] hover:text-[#191715] bg-[#ffffff] transition-colors cursor-pointer"
                title={`Visit original article on ${activeStory.sourceName}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Slide Navigation Micro-Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0 && currentStoryIndex === 0}
                className="px-3 py-1.5 text-xs font-medium text-[#5c554e] bg-[#faf6f0] hover:bg-[#f4eee5] border border-[#e7ded3] rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                ← Prev Beat
              </button>
              <button
                onClick={handleNextSlide}
                className="px-3 py-1.5 text-xs font-bold text-[#0f766e] bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-[#99f6e4] rounded-xl transition-colors cursor-pointer"
              >
                Next Beat →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Story-Switching Control Bar */}
        <div className="bg-[#faf6f0] border-t-2 border-[#e7ded3] p-4 sm:p-5 flex items-center justify-between gap-3">
          <button
            onClick={handlePrevStory}
            disabled={currentStoryIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e7ded3] bg-[#ffffff] text-[#191715] font-semibold text-xs sm:text-sm hover:bg-[#f4eee5] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 text-[#0f766e]" />
            <span>Previous Story</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-mono-meta font-bold text-[#191715] block">
              Story {currentStoryIndex + 1} of {stories.length}
            </span>
            <span className="text-[10px] font-mono-meta text-[#8c8278] hidden sm:block">
              Use ← and → arrow keys to flip
            </span>
          </div>

          <button
            onClick={handleNextStory}
            disabled={currentStoryIndex === stories.length - 1}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e7ded3] bg-[#ffffff] text-[#191715] font-semibold text-xs sm:text-sm hover:bg-[#f4eee5] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
          >
            <span>Next Story</span>
            <ChevronRight className="w-4 h-4 text-[#0f766e]" />
          </button>
        </div>
      </div>
    </div>
  );
};
