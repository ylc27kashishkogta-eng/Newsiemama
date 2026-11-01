import React, { useState } from 'react';
import { Story, VoicePreset } from '../types';
import { Bookmark, ChevronLeft, ChevronRight, BookOpen, Sparkles, Layers, Share2, Check } from 'lucide-react';

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

  if (!stories || stories.length === 0) {
    return null;
  }

  const activeStory = stories[currentStoryIndex] || stories[0];
  const slides = activeStory.playcards && activeStory.playcards.length > 0
    ? activeStory.playcards
    : [
        { label: 'The Pulse', title: 'What Happened?', body: activeStory.deck || activeStory.content.slice(0, 160) + '...', type: 'what' as const },
        { label: 'Impact', title: 'Why It Matters', body: (activeStory.keyBullets && activeStory.keyBullets[0]) || `Major development impacting ${activeStory.category}.`, type: 'why' as const },
        { label: 'Forward Look', title: 'What Could Happen Next (Analysis)', body: 'Industry analysts and public officials are monitoring upcoming quarter benchmarks.', type: 'next' as const }
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
    } else {
      // Loop or go to next story
      handleNextStory();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(activeStory.canonicalUrl || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 px-4 animate-paper-fade">
      {/* Top Deck Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#eee8f8] text-[#7c66dc]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif-editorial text-sm font-bold text-[#181513]">
              Playcard Deck
            </h4>
            <p className="text-[11px] font-mono-meta text-[#6e685f]">
              Story {currentStoryIndex + 1} of {stories.length} • Tap card or arrows to advance
            </p>
          </div>
        </div>

        {/* Story Index Navigator */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevStory}
            disabled={currentStoryIndex === 0}
            className="p-1.5 rounded-full border border-[#e4dcd3] bg-[#ffffff] text-[#181513] hover:bg-[#faf7f2] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous story"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextStory}
            disabled={currentStoryIndex === stories.length - 1}
            className="p-1.5 rounded-full border border-[#e4dcd3] bg-[#ffffff] text-[#181513] hover:bg-[#faf7f2] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next story"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Playcard */}
      <div
        onClick={handleNextSlide}
        className="cursor-pointer select-none relative bg-[#ffffff] rounded-3xl border border-[#e4dcd3] p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-300 min-h-[380px] flex flex-col justify-between overflow-hidden"
      >
        {/* Soft Decorative Ambient Gradient in corner */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#fbeae5] via-[#eee8f8]/40 to-transparent rounded-bl-full pointer-events-none -z-0 opacity-70" />

        <div className="relative z-10 space-y-4">
          {/* Top Metadata Strip */}
          <div className="flex items-center justify-between gap-2 border-b border-[#f0eae1] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-meta uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#faf7f2] text-[#9b2c48] border border-[#e4dcd3]">
                {activeStory.category}
              </span>
              <span className="text-[11px] font-mono-meta text-[#8f887d]">
                {activeStory.sourceName} • {activeStory.timeAgo}
              </span>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onToggleSave(activeStory.id)}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved(activeStory.id)
                    ? 'text-[#e25c50] bg-[#fbeae5]'
                    : 'text-[#8f887d] hover:text-[#181513] hover:bg-[#faf7f2]'
                }`}
                title="Save story"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full text-[#8f887d] hover:text-[#181513] hover:bg-[#faf7f2] transition-colors"
                title="Copy story link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#4e6c58]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Story Title */}
          <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#181513] leading-snug">
            {activeStory.title}
          </h3>

          {/* Active Slide Content */}
          <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-2xl p-4 sm:p-5 space-y-2 mt-2">
            <div className="flex items-center gap-1.5 text-[#e25c50] font-mono-meta text-xs uppercase tracking-wider font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSlide.label} • {currentSlide.title}</span>
            </div>
            <p className="text-sm sm:text-base text-[#3a332a] leading-relaxed font-sans">
              {currentSlide.body}
            </p>
          </div>
        </div>

        {/* Card Footer: Slide Step Indicator & Action Buttons */}
        <div
          className="relative z-10 pt-4 border-t border-[#f0eae1] flex items-center justify-between gap-3 mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Slide Progress Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIndex === idx
                    ? 'w-6 bg-[#e25c50]'
                    : 'w-2 bg-[#d4c8bd] hover:bg-[#8f887d]'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
            <span className="text-[10px] font-mono-meta text-[#8f887d] ml-1">
              {currentSlideIndex + 1}/{slides.length}
            </span>
          </div>

          {/* Action to open full story narrative drawer */}
          <button
            onClick={() => onOpenExplainer(activeStory)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181513] text-[#ffffff] text-xs font-medium hover:bg-[#3a332a] transition-colors shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Full Story</span>
          </button>
        </div>
      </div>

      {/* Helpful Hint */}
      <p className="text-center text-[11px] text-[#8f887d] font-mono-meta mt-2.5">
        Click or tap inside the card to step through key points • Swipe or use arrows for next story
      </p>
    </div>
  );
};
