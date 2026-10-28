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
  Radio,
  FileText
} from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onOpenExplainer: (story: Story) => void;
  isSaved: boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  economy: 'text-[#963f2e] bg-[#f5e6e1] border-[#e8cecb]',
  tech: 'text-[#2c3e50] bg-[#eef2f5] border-[#d5dee6]',
  policy: 'text-[#8a5d2b] bg-[#fbf2e3] border-[#edd8be]',
  world: 'text-[#8b4352] bg-[#f8ebed] border-[#ebd0d6]',
  climate: 'text-[#3b5744] bg-[#edf2ee] border-[#cbe0d0]',
};

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onOpenExplainer,
  isSaved,
  onToggleSave,
  activePreset,
  index = 0,
}) => {
  const { isArticleRead, toggleStoryFeedback, getStoryFeedback } = useProfile();
  const isRead = isArticleRead(story.id);
  const feedback = getStoryFeedback(story.id);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const categoryBadge = CATEGORY_COLORS[story.category] || 'text-[#5c5449] bg-[#f0e8df] border-[#ded4c7]';
  const staggerClass = `stagger-${Math.min((index % 4) + 1, 5)}`;

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
    <article className={`bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between animate-card-stagger ${staggerClass} ${
      feedback === 'less' ? 'opacity-70 bg-[#faf6f0]' : ''
    }`}>
      <div>
        {/* Downranked Notification Banner with Undo */}
        {feedback === 'less' && (
          <div className="bg-[#fbf0ec] border border-[#f0d4ce] rounded-xl p-2 mb-3 text-xs text-[#b9533f] flex items-center justify-between animate-paper-fade">
            <div className="flex items-center gap-1.5 text-[11px]">
              <ThumbsDown className="w-3 h-3 text-[#b9533f]" />
              <span>Downranked</span>
            </div>
            <button
              onClick={(e) => handleFeedback('less', e)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-[#b9533f] font-semibold rounded-md border border-[#f0d4ce] hover:bg-[#faf7f2] cursor-pointer text-[10px]"
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
              {story.category}
            </span>

            {/* Source Mode Trust Indicator */}
            {story.sourceMode === 'rss' ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#2d6a4f] bg-[#e8f5e9] px-2 py-0.5 rounded-full border border-[#c8e6c9]">
                <Radio className="w-2 h-2 animate-pulse" />
                <span>Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#7c5e3f] bg-[#fbf2e3] px-2 py-0.5 rounded-full border border-[#edd8be]">
                <FileText className="w-2 h-2" />
                <span>Demo</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#8f887d]">
            {isRead && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4e6c58] bg-[#edf2ee] px-1.5 py-0.5 rounded-md">
                <Check className="w-2.5 h-2.5" />
                <span>Read</span>
              </span>
            )}

            <span className="flex items-center gap-1 text-[#6e685f]">
              <Clock className="w-3 h-3 text-[#8f887d]" />
              {story.timeAgo}
            </span>

            <button
              onClick={() => onToggleSave(story.id)}
              className="text-[#8f887d] hover:text-[#1e1b18] transition-colors cursor-pointer p-0.5"
              title={isSaved ? 'Saved for later' : 'Save article'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-[#b9533f]" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Personalized "Why this story" banner */}
        <div className="mb-2 text-[11px] font-medium text-[#4e6c58] flex items-center gap-1 font-serif-editorial">
          <Sparkles className="w-3 h-3 text-[#4e6c58] shrink-0" />
          <span>{story.curatedReason || `Because you follow ${story.category}`}</span>
        </div>

        {/* Source Attributed */}
        <div className="text-[11px] font-semibold text-[#8f887d] mb-1">
          {story.sourceName}
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenExplainer(story)}
          className="font-serif-editorial text-lg sm:text-xl font-bold text-[#1e1b18] leading-snug mb-2 hover:text-[#b9533f] transition-colors cursor-pointer"
        >
          {story.title}
        </h3>

        {/* Deck */}
        <p className="font-serif-editorial text-xs sm:text-sm text-[#5c5449] line-clamp-3 leading-relaxed mb-4">
          {story.deck}
        </p>

        {feedbackNotice && (
          <div className="mb-2 p-1.5 text-[11px] font-medium text-center text-[#3b5744] bg-[#edf2ee] rounded-lg border border-[#cbe0d0]">
            {feedbackNotice}
          </div>
        )}
      </div>

      {/* Card Action Row & Shape Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f0e9e1] text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenExplainer(story)}
            className="inline-flex items-center gap-1.5 text-[#b9533f] font-semibold hover:text-[#963f2e] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b9533f]" />
            <span>Explain ({activePreset})</span>
          </button>

          {/* Quick thumbs */}
          <div className="flex items-center gap-1 border-l border-[#e4dcd3] pl-2">
            <button
              onClick={(e) => handleFeedback('more', e)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                feedback === 'more'
                  ? 'text-[#3b5744] bg-[#edf2ee]'
                  : 'text-[#8f887d] hover:text-[#1e1b18]'
              }`}
              title="More like this"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleFeedback('less', e)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                feedback === 'less'
                  ? 'text-[#b9533f] bg-[#fbf0ec]'
                  : 'text-[#8f887d] hover:text-[#1e1b18]'
              }`}
              title="Less like this"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <a
          href={story.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#8f887d] hover:text-[#1e1b18] transition-colors"
          title="Open original article on publisher site"
        >
          <span>Source</span>
          <ExternalLink className="w-3 h-3 text-[#8f887d]" />
        </a>
      </div>
    </article>
  );
};
