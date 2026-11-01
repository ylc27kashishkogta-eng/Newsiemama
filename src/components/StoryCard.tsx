import React, { useState } from 'react';
import { Story, VoicePreset } from '../types';
import { useProfile } from '../context/ProfileContext';
import {
  ExternalLink,
  Sparkles,
  Clock,
  Bookmark,
  BookmarkCheck,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Radio
} from 'lucide-react';
import { FINANCE_SUBCATEGORY_LABELS } from '../services/feedService';

interface StoryCardProps {
  story: Story;
  onOpenExplainer: (story: Story) => void;
  isSaved: boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  finance: 'text-[#0f766e] bg-[#f0fdfa] border-[#99f6e4]',
  economy: 'text-[#0f766e] bg-[#f0fdfa] border-[#99f6e4]',
  tech: 'text-[#0284c7] bg-[#e0f2fe] border-[#bae6fd]',
  policy: 'text-[#82351f] bg-[#fde8df] border-[#f5cbbe]',
  world: 'text-[#191715] bg-[#f4eee5] border-[#e7ded3]',
  climate: 'text-[#047857] bg-[#ecfdf5] border-[#a7f3d0]',
  science: 'text-[#0369a1] bg-[#e0f2fe] border-[#bae6fd]',
  sports_culture: 'text-[#9e4429] bg-[#fde8df] border-[#f5cbbe]',
};

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onOpenExplainer,
  isSaved,
  onToggleSave,
  index = 0,
}) => {
  const { currentProfile, isArticleRead, toggleStoryFeedback, getStoryFeedback } = useProfile();
  const isRead = isArticleRead(story.id);
  const feedback = getStoryFeedback(story.id);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const categoryBadge = CATEGORY_COLORS[story.category] || 'text-[#5c554e] bg-[#f4eee5] border-[#e7ded3]';
  const staggerClass = `stagger-${Math.min((index % 4) + 1, 5)}`;
  const isVibe = currentProfile.slangLevel === 'vibe';

  const handleFeedback = (type: 'more' | 'less', e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStoryFeedback(story.id, type);
    const msg = type === 'more' 
      ? 'Prioritizing stories like this' 
      : 'Downranking similar stories';
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  return (
    <article className={`bg-[#ffffff] rounded-2xl border-2 border-[#e7ded3] p-5 sm:p-6 shadow-xs hover:border-[#0f766e] hover:shadow-md transition-all flex flex-col justify-between animate-card-stagger ${staggerClass} ${
      feedback === 'less' ? 'opacity-70 bg-[#faf6f0]' : ''
    }`}>
      <div>
        {/* Downranked Notification Banner with Undo */}
        {feedback === 'less' && (
          <div className="bg-[#fde8df] border border-[#f5cbbe] rounded-xl p-2 mb-3 text-xs text-[#82351f] flex items-center justify-between animate-paper-fade">
            <div className="flex items-center gap-1.5 text-[11px]">
              <ThumbsDown className="w-3 h-3 text-[#9e4429]" />
              <span>Downranked</span>
            </div>
            <button
              onClick={(e) => handleFeedback('less', e)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ffffff] text-[#9e4429] font-semibold rounded-md border border-[#f5cbbe] hover:bg-[#faf6f0] cursor-pointer text-[10px]"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Undo</span>
            </button>
          </div>
        )}

        {/* Card Header: Category & Reason */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs mb-2.5 font-mono-meta">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider text-[10px] ${categoryBadge}`}>
              {story.category === 'sports_culture' ? 'Culture' : story.category}
            </span>

            {/* Subcategory if available */}
            {story.financeSubcategory && story.financeSubcategory !== 'all' && (
              <span className="text-[10px] font-mono-meta text-[#5c554e] bg-[#f9f5ef] px-2 py-0.5 rounded-full border border-[#e7ded3]">
                {FINANCE_SUBCATEGORY_LABELS[story.financeSubcategory] || story.financeSubcategory}
              </span>
            )}

            {/* Source Mode Trust Indicator */}
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#0f766e] bg-[#f0fdfa] px-2 py-0.5 rounded-full border border-[#99f6e4]">
              <Radio className="w-2 h-2 animate-pulse" />
              <span>Live</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#8c8278]">
            {isRead && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#0f766e] bg-[#f0fdfa] px-1.5 py-0.5 rounded-md">
                <Check className="w-2.5 h-2.5" />
                <span>Read</span>
              </span>
            )}

            <span className="flex items-center gap-1 text-[#5c554e]">
              <Clock className="w-3 h-3 text-[#8c8278]" />
              {story.timeAgo}
            </span>

            <button
              onClick={() => onToggleSave(story.id)}
              className="text-[#8c8278] hover:text-[#191715] transition-colors cursor-pointer p-0.5"
              title={isSaved ? 'Saved for later' : 'Save article'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-[#0f766e]" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Personalized "Why this story" banner */}
        <div className="mb-2 text-[11px] font-medium text-[#0369a1] flex items-center gap-1 font-serif-editorial">
          <Sparkles className="w-3 h-3 text-[#0369a1] shrink-0" />
          <span>{story.curatedReason || `Because you follow ${story.category}`}</span>
        </div>

        {/* Source Attributed */}
        <div className="text-[11px] font-semibold text-[#8c8278] mb-1">
          {story.sourceName}
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenExplainer(story)}
          className="font-serif-editorial text-lg sm:text-xl font-bold text-[#191715] leading-snug mb-2 hover:text-[#0f766e] transition-colors cursor-pointer"
        >
          {story.title}
        </h3>

        {/* Vibe / Deck content */}
        {isVibe && story.vibeSummary ? (
          <div className="bg-[#fde8df]/70 border-l-2 border-[#0f766e] pl-3 py-1.5 my-2 text-xs font-sans text-[#2a241f] leading-relaxed rounded-r-md">
            <span className="text-[#0f766e] font-mono-meta font-bold uppercase text-[10px] block mb-0.5">TL;DR Vibe</span>
            {story.vibeSummary}
          </div>
        ) : (
          <p className="font-serif-editorial text-xs sm:text-sm text-[#5c554e] line-clamp-3 leading-relaxed mb-4">
            {story.deck}
          </p>
        )}

        {feedbackNotice && (
          <div className="mb-2 p-1.5 text-[11px] font-medium text-center text-[#0f766e] bg-[#f0fdfa] rounded-lg border border-[#99f6e4]">
            {feedbackNotice}
          </div>
        )}
      </div>

      {/* Card Action Row & Shape Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f4eee5] text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenExplainer(story)}
            className="inline-flex items-center gap-1.5 text-[#0f766e] font-bold hover:text-[#115e59] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explain</span>
          </button>

          {/* Quick thumbs */}
          <div className="flex items-center gap-1 border-l border-[#e7ded3] pl-2">
            <button
              onClick={(e) => handleFeedback('more', e)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                feedback === 'more'
                  ? 'text-[#0f766e] bg-[#f0fdfa]'
                  : 'text-[#8c8278] hover:text-[#191715]'
              }`}
              title="More stories like this"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleFeedback('less', e)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                feedback === 'less'
                  ? 'text-[#9e4429] bg-[#fde8df]'
                  : 'text-[#8c8278] hover:text-[#191715]'
              }`}
              title="Less stories like this"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <a
          href={story.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#8c8278] hover:text-[#0f766e] transition-colors"
          title="Open original article on publisher site"
        >
          <span>Source</span>
          <ExternalLink className="w-3 h-3 text-[#8c8278]" />
        </a>
      </div>
    </article>
  );
};
