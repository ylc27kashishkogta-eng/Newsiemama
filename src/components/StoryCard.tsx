import React from 'react';
import { Story, VoicePreset } from '../types';
import { ExternalLink, Sparkles, Clock, Bookmark, BookmarkCheck } from 'lucide-react';

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
  const categoryBadge = CATEGORY_COLORS[story.category] || 'text-[#5c5449] bg-[#f0e8df] border-[#ded4c7]';
  const staggerClass = `stagger-${Math.min((index % 4) + 1, 5)}`;

  return (
    <article className={`bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between animate-card-stagger ${staggerClass}`}>
      <div>
        {/* Card Header Meta */}
        <div className="flex items-center justify-between text-xs mb-3 font-mono-meta">
          <span className={`px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider text-[10px] ${categoryBadge}`}>
            {story.category}
          </span>

          <div className="flex items-center gap-2 text-[#8f887d]">
            <span className="flex items-center gap-1 text-[#6e685f]">
              <Clock className="w-3 h-3 text-[#8f887d]" />
              {story.timeAgo}
            </span>
            <button
              onClick={() => onToggleSave(story.id)}
              className="text-[#8f887d] hover:text-[#1e1b18] transition-colors cursor-pointer"
              title={isSaved ? 'Saved' : 'Save article'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-[#b9533f]" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Source Attributed */}
        <div className="text-xs font-semibold text-[#8f887d] mb-1.5">
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
      </div>

      {/* Card Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f0e9e1] text-xs">
        <button
          onClick={() => onOpenExplainer(story)}
          className="inline-flex items-center gap-1.5 text-[#b9533f] font-semibold hover:text-[#963f2e] transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#b9533f]" />
          <span>Explain ({activePreset})</span>
        </button>

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
