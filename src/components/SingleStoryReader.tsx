import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Story, VoicePreset, TopicCategory, StoryExplanation } from '../types';
import { useProfile } from '../context/ProfileContext';
import { toneEngine } from '../services/toneEngine';
import {
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  Check,
  ExternalLink,
  Radio,
  Clock,
  Sparkles,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { StoryIllustration } from './StoryIllustration';
import { VisualExplainer } from './VisualExplainer';

interface SingleStoryReaderProps {
  stories: Story[];
  onExit: () => void;
  isSaved: (storyId: string) => boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
  initialIndex?: number;
}

const CATEGORY_THEMES: Record<
  TopicCategory,
  { label: string; bg: string; text: string; border: string; accent: string }
> = {
  finance: {
    label: 'Finance & Markets',
    bg: 'bg-[#f0fdfa]',
    text: 'text-[#0f766e]',
    border: 'border-[#99f6e4]',
    accent: '#0f766e',
  },
  economy: {
    label: 'Markets & Economy',
    bg: 'bg-[#f0fdfa]',
    text: 'text-[#0f766e]',
    border: 'border-[#99f6e4]',
    accent: '#0f766e',
  },
  tech: {
    label: 'Technology & AI',
    bg: 'bg-[#f0f9ff]',
    text: 'text-[#0284c7]',
    border: 'border-[#bae6fd]',
    accent: '#0284c7',
  },
  policy: {
    label: 'Policy & Governance',
    bg: 'bg-[#fdf2f0]',
    text: 'text-[#82351f]',
    border: 'border-[#f5cbbe]',
    accent: '#82351f',
  },
  world: {
    label: 'World Intelligence',
    bg: 'bg-[#faf6f0]',
    text: 'text-[#191715]',
    border: 'border-[#e7ded3]',
    accent: '#191715',
  },
  climate: {
    label: 'Climate & Energy',
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#047857]',
    border: 'border-[#a7f3d0]',
    accent: '#047857',
  },
  science: {
    label: 'Science & Space',
    bg: 'bg-[#f0f9ff]',
    text: 'text-[#0369a1]',
    border: 'border-[#bae6fd]',
    accent: '#0369a1',
  },
  sports_culture: {
    label: 'Sports & Culture',
    bg: 'bg-[#fef3c7]',
    text: 'text-[#9e4429]',
    border: 'border-[#fde68a]',
    accent: '#9e4429',
  },
};

export const SingleStoryReader: React.FC<SingleStoryReaderProps> = ({
  stories,
  onExit,
  isSaved,
  onToggleSave,
  activePreset,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [explanation, setExplanation] = useState<StoryExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const { reducedMotion, markArticleAsRead, currentProfile } = useProfile();

  const touchStartRef = useRef<{
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    time: number;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const totalStories = stories.length;
  const activeStory = stories[currentIndex] || stories[0];

  // Mark article as read when viewed
  useEffect(() => {
    if (activeStory?.id) {
      markArticleAsRead(activeStory.id);
    }
  }, [activeStory?.id, markArticleAsRead]);

  // Load full explanation for current story
  useEffect(() => {
    if (!activeStory) return;
    let isCurrent = true;
    setIsExplaining(true);

    toneEngine
      .explainStory(
        activeStory,
        activePreset,
        currentProfile.customVoice,
        currentProfile.ageRange,
        currentProfile.slangLevel
      )
      .then((res) => {
        if (isCurrent) {
          setExplanation(res);
          setIsExplaining(false);
        }
      })
      .catch((err) => {
        console.warn('Explanation generation fallback:', err);
        if (isCurrent) setIsExplaining(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeStory, activePreset, currentProfile.customVoice, currentProfile.ageRange, currentProfile.slangLevel]);

  // Reset scroll position to top when story changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Navigate to Next story (Swipe Up or Down button)
  const handleNextStory = useCallback(() => {
    if (currentIndex < totalStories - 1) {
      setSlideDirection('up');
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalStories]);

  // Navigate to Previous story (Swipe Down or Up button)
  const handlePrevStory = useCallback(() => {
    if (currentIndex > 0) {
      setSlideDirection('down');
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Clear animation direction after transition
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => {
        setSlideDirection(null);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [slideDirection]);

  // Keyboard navigation for desktop:
  // ArrowDown -> Next story
  // ArrowUp -> Previous story
  // Escape -> Exit Story Mode
  // Do NOT intercept when typing in forms/inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextStory();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevStory();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextStory, handlePrevStory, onExit]);

  // Inshorts-style Touch Gestures:
  // Swipe Up -> Next story
  // Swipe Down -> Previous story
  // If story content overflows, allow vertical scrolling smoothly;
  // only trigger story change on a deliberate swipe gesture when at top/bottom.
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      lastX: touch.clientX,
      lastY: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current && e.touches[0]) {
      touchStartRef.current.lastX = e.touches[0].clientX;
      touchStartRef.current.lastY = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStartRef.current.lastX;
    const endY = e.changedTouches?.[0]?.clientY ?? touchStartRef.current.lastY;
    const deltaX = endX - touchStartRef.current.x;
    const deltaY = endY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Ignore slow dragging/holds
    if (elapsed > 700) return;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Strictly ignore horizontal gestures (do not change stories horizontally)
    if (absX > absY * 1.5) return;

    // Check if vertical motion exceeds swipe threshold
    if (absY >= 35) {
      const el = scrollContainerRef.current;
      const isScrollable = el ? el.scrollHeight > el.clientHeight + 10 : false;
      const isAtTop = el ? el.scrollTop <= 8 : true;
      const isAtBottom = el ? el.scrollTop + el.clientHeight >= el.scrollHeight - 12 : true;

      // Deliberate swipe (under 650ms and >= 35px)
      const isDeliberateSwipe = elapsed < 650 && absY >= 35;

      if (deltaY < 0) {
        // Swipe Up -> Next story
        if (!isScrollable || isAtBottom || isDeliberateSwipe) {
          handleNextStory();
        }
      } else if (deltaY > 0) {
        // Swipe Down -> Previous story
        if (!isScrollable || isAtTop || isDeliberateSwipe) {
          handlePrevStory();
        }
      }
    }
  };

  const handleTouchCancel = () => {
    touchStartRef.current = null;
  };

  // Copy canonical article link
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStory?.canonicalUrl) {
      navigator.clipboard.writeText(activeStory.canonicalUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  if (!stories || stories.length === 0 || !activeStory) {
    return (
      <div className="fixed inset-0 z-50 bg-[#faf6f0] flex flex-col items-center justify-center p-6 text-center">
        <h3 className="font-serif-editorial text-2xl font-bold text-[#191715] mb-2">No Stories Available</h3>
        <p className="text-sm text-[#5c554e] mb-6">No matching stories found for this section.</p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-full bg-[#0f766e] text-white font-bold text-xs shadow-xs"
        >
          Return to Newspaper
        </button>
      </div>
    );
  }

  const categoryTheme = CATEGORY_THEMES[activeStory.category] || CATEGORY_THEMES.finance;
  const isSavedStory = isSaved(activeStory.id);
  const progressPercent = Math.round(((currentIndex + 1) / totalStories) * 100);

  const transitionClass = reducedMotion
    ? ''
    : slideDirection === 'up'
    ? 'story-slide-up'
    : slideDirection === 'down'
    ? 'story-slide-down'
    : '';

  return (
    <div
      data-testid="single-story-reader"
      role="region"
      aria-label="Single Story Reader (Inshorts Style)"
      className="fixed inset-0 z-50 bg-[#faf6f0] text-[#191715] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Bar: Exit Control, Story Counter, Bookmark, and Share */}
      <header className="w-full max-w-2xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between border-b border-[#e7ded3] bg-[#ffffff] shadow-2xs z-10 shrink-0">
        {/* Clear Exit / Back to Newspaper Control */}
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4eee5] hover:bg-[#e7ded3] text-[#191715] text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Exit Story Mode and return to full newspaper"
          aria-label="Exit Story Mode"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-sans">Exit Story Mode</span>
        </button>

        {/* Story Position Counter */}
        <div className="flex items-center gap-2">
          <span
            data-testid="story-indicator"
            className="font-mono-meta font-bold text-xs text-[#0f766e] bg-[#f0fdfa] border border-[#99f6e4] px-2.5 py-0.5 rounded-full"
          >
            Story {currentIndex + 1} of {totalStories}
          </span>
        </div>

        {/* Right Actions: Bookmark & Share */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleSave(activeStory.id)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isSavedStory
                ? 'bg-[#fde8df] border-[#f5cbbe] text-[#e25c50]'
                : 'bg-[#faf6f0] border-[#e7ded3] text-[#8c8278] hover:text-[#e25c50]'
            }`}
            title={isSavedStory ? 'Remove bookmark' : 'Bookmark story'}
            aria-label="Bookmark story"
          >
            {isSavedStory ? (
              <BookmarkCheck className="w-4 h-4 fill-current" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-xl bg-[#faf6f0] border border-[#e7ded3] text-[#8c8278] hover:text-[#0f766e] transition-colors cursor-pointer"
            title="Share article link"
            aria-label="Share article link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#0f766e]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Slim Progress Indicator Line */}
      <div className="w-full h-1 bg-[#ede5da] shrink-0">
        <div
          className="h-full bg-[#0f766e] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Full-Screen Story Reading Stage */}
      <main
        className="flex-1 w-full max-w-2xl mx-auto flex flex-col justify-between overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Scrollable Story Content Container (allows full vertical reading without accidental story change) */}
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 ${transitionClass}`}
        >
          {/* Metadata Ribbon: Category, Source, Live Indicator, Time Ago */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#f0eae1] text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${categoryTheme.bg} ${categoryTheme.text} ${categoryTheme.border}`}
              >
                {categoryTheme.label}
              </span>

              <span className="font-serif-editorial font-bold text-[#3a332a] text-xs sm:text-sm">
                {activeStory.sourceName}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] text-[#0f766e] bg-[#f0fdfa] px-2 py-0.5 rounded-full border border-[#99f6e4]">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>Live Wire</span>
              </span>
            </div>

            <span className="text-[#8c8278] flex items-center gap-1 text-[11px] font-mono-meta">
              <Clock className="w-3 h-3" />
              {activeStory.timeAgo || 'Recent'}
            </span>
          </div>

          {/* Headline (Compact readable text, no clipping) */}
          <h1
            data-testid="story-headline"
            className="font-serif-editorial text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#191715] leading-snug tracking-tight"
          >
            {activeStory.title}
          </h1>

          {/* Procedural Visual Motif Graphic for Current Story */}
          <div className="py-1">
            <StoryIllustration story={activeStory} layout="drawer" />
          </div>

          {/* The Story Deck / Summary */}
          {activeStory.deck && (
            <div className="font-serif-editorial italic text-sm sm:text-base text-[#4a4237] leading-relaxed border-l-3 border-[#0f766e] pl-3.5 py-1.5 bg-[#ffffff] rounded-r-xl shadow-2xs">
              {activeStory.deck}
            </div>
          )}

          {/* Full Explanation & Narrative Breakdown */}
          {isExplaining && !explanation ? (
            <div className="py-6 text-center text-xs text-[#6e685f] space-y-2">
              <div className="w-5 h-5 border-2 border-[#0f766e] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-serif-editorial italic">Gathering verified narrative takeaways...</p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* 1. What Happened? (Core Facts) */}
              <div className="bg-[#ffffff] p-4 sm:p-5 rounded-2xl border border-[#ede5dc] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0f766e] font-mono-meta">
                    <HelpCircle className="w-4 h-4" />
                    <span>1. What happened?</span>
                  </div>
                  <span className="text-[10px] font-mono-meta uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#e3ece5] text-[#3e5f49] font-bold">
                    Reported Facts
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#38322a] leading-relaxed font-serif-editorial">
                  {explanation?.whatHappened || activeStory.content}
                </p>
              </div>

              {/* 2. Why It Matters (Key Takeaways) */}
              {((explanation?.whyItMatters && explanation.whyItMatters.length > 0) ||
                (activeStory.keyBullets && activeStory.keyBullets.length > 0)) && (
                <div className="bg-[#ffffff] p-4 sm:p-5 rounded-2xl border border-[#ede5dc] space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0284c7] font-mono-meta">
                    <TrendingUp className="w-4 h-4" />
                    <span>2. Why it matters</span>
                  </div>
                  <ul className="space-y-2">
                    {(explanation?.whyItMatters || activeStory.keyBullets || []).map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#38322a]">
                        <CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. What Could Happen Next (Forward Scenario Analysis) */}
              {explanation?.whatCouldHappenNext && (
                <div className="bg-[#ffffff] p-4 sm:p-5 rounded-2xl border border-[#ede5dc] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#82351f] font-mono-meta">
                      <Sparkles className="w-4 h-4" />
                      <span>3. What could happen next?</span>
                    </div>
                    <span className="text-[10px] font-mono-meta uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#fdf2f0] text-[#82351f] font-bold">
                      Forward Scenario
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#38322a] leading-relaxed font-serif-editorial">
                    {explanation.whatCouldHappenNext}
                  </p>
                </div>
              )}

              {/* Visual Explainer (if available for this story) */}
              {explanation?.visualExplainer && (
                <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#ede5dc] shadow-2xs">
                  <VisualExplainer explainer={explanation.visualExplainer} />
                </div>
              )}
            </div>
          )}

          {/* Prominent "Read Original" Canonical Link Button */}
          {activeStory.canonicalUrl && (
            <div className="pt-2 pb-4">
              <a
                href={activeStory.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                title={`Read full original article on ${activeStory.sourceName}`}
              >
                <span>Read original on {activeStory.sourceName}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-center text-[10px] text-[#8c8278] font-mono-meta mt-1.5">
                Direct syndicated wire coverage • Official publisher source
              </p>
            </div>
          )}
        </div>

        {/* Small Visible Up/Down Controls & Gesture Indicator Dock */}
        <nav aria-label="Story navigation dock" className="w-full px-4 py-2 bg-[#ffffff] border-t border-[#e7ded3] flex items-center justify-between shrink-0 shadow-xs z-10">
          {/* Swipe Gesture Discoverability Hint */}
          <div className="text-[10px] font-mono-meta text-[#6e685f] flex items-center gap-2">
            <span className="font-bold text-[#0f766e]">Swipe:</span>
            <span>⬆ Next Story</span>
            <span>•</span>
            <span>⬇ Prev Story</span>
          </div>

          {/* Small Visible Up / Down Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevStory}
              disabled={currentIndex === 0}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                currentIndex === 0
                  ? 'bg-[#f4eee5] text-[#b3a89b] border-[#e7ded3] cursor-not-allowed opacity-50'
                  : 'bg-[#ffffff] text-[#191715] border-[#e7ded3] hover:bg-[#191715] hover:text-[#ffffff] shadow-2xs'
              }`}
              title="Previous Story (Swipe Down or Up Arrow)"
              aria-label="Previous Story"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono-meta text-[#191715] font-bold px-1.5">
              {currentIndex + 1} / {totalStories}
            </span>

            <button
              onClick={handleNextStory}
              disabled={currentIndex === totalStories - 1}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                currentIndex === totalStories - 1
                  ? 'bg-[#f4eee5] text-[#b3a89b] border-[#e7ded3] cursor-not-allowed opacity-50'
                  : 'bg-[#ffffff] text-[#191715] border-[#e7ded3] hover:bg-[#191715] hover:text-[#ffffff] shadow-2xs'
              }`}
              title="Next Story (Swipe Up or Down Arrow)"
              aria-label="Next Story"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
};
