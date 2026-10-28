import React from 'react';
import { Story, VoicePreset } from '../types';
import { ExternalLink, Sparkles, Clock, Bookmark, BookmarkCheck } from 'lucide-react';

interface LeadStoryCardProps {
  story: Story;
  onOpenExplainer: (story: Story) => void;
  isSaved: boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
}

export const LeadStoryCard: React.FC<LeadStoryCardProps> = ({
  story,
  onOpenExplainer,
  isSaved,
  onToggleSave,
  activePreset,
}) => {
  return (
    <article className="bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-6 sm:p-8 shadow-xs hover:shadow-md transition-all relative mb-8 animate-card-stagger stagger-1">
      {/* Editorial Category & Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0e9e1] pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono-meta font-bold uppercase tracking-wider text-[#b9533f] bg-[#f5e6e1] px-2.5 py-0.5 rounded-full border border-[#e8cecb]">
            Lead Story • {story.category}
          </span>
          <span className="text-[#6e685f] font-medium">| {story.sourceName}</span>
        </div>

        <div className="flex items-center gap-3 text-[#6e685f] font-mono-meta">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#8f887d]" />
            {story.timeAgo}
          </span>
          <span>•</span>
          <span>{story.readingMinutes} min read</span>
          <button
            onClick={() => onToggleSave(story.id)}
            className="text-[#8f887d] hover:text-[#1e1b18] transition-colors cursor-pointer"
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-[#b9533f]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Headline & Deck */}
      <h2
        onClick={() => onOpenExplainer(story)}
        className="font-serif-editorial text-2xl sm:text-4xl font-extrabold text-[#1e1b18] leading-tight mb-3 hover:text-[#b9533f] transition-colors cursor-pointer"
      >
        {story.title}
      </h2>

      <p className="font-serif-editorial italic text-base sm:text-lg text-[#5c5449] border-l-3 border-[#b9533f] pl-4 my-4 leading-snug bg-[#fcf9f5] py-1.5 rounded-r-lg">
        {story.deck}
      </p>

      {/* Editorial Body Excerpt */}
      <div className="text-sm sm:text-base text-[#3a332a] leading-relaxed font-serif-editorial my-4">
        {story.content}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#f0e9e1] mt-6">
        <button
          onClick={() => onOpenExplainer(story)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b9533f] hover:bg-[#963f2e] text-[#faf7f2] rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-transform active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#fcdcd4]" />
          <span>Explain in My Voice ({activePreset})</span>
        </button>

        <a
          href={story.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#6e685f] hover:text-[#1e1b18] transition-colors"
        >
          <span>Read original on {story.sourceName}</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8f887d]" />
        </a>
      </div>
    </article>
  );
};
