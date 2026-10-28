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
    <article className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow relative mb-8">
      {/* Editorial Category & Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono-meta font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2.5 py-0.5 rounded-sm border border-red-200">
            Lead Story • {story.category}
          </span>
          <span className="text-zinc-500 font-medium">| {story.sourceName}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-500 font-mono-meta">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            {story.timeAgo}
          </span>
          <span>•</span>
          <span>{story.readingMinutes} min read</span>
          <button
            onClick={() => onToggleSave(story.id)}
            className="text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-red-700" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Headline & Deck */}
      <h2
        onClick={() => onOpenExplainer(story)}
        className="font-serif-editorial text-2xl sm:text-4xl font-extrabold text-zinc-900 leading-tight mb-3 hover:text-red-900 transition-colors cursor-pointer"
      >
        {story.title}
      </h2>

      <p className="font-serif-editorial italic text-base sm:text-lg text-zinc-600 border-l-2 border-red-700 pl-4 my-4 leading-snug">
        {story.deck}
      </p>

      {/* Editorial Body Excerpt */}
      <div className="text-sm sm:text-base text-zinc-700 leading-relaxed font-serif-editorial my-4">
        {story.content}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100 mt-6">
        <button
          onClick={() => onOpenExplainer(story)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-transform active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-red-200" />
          <span>Explain in My Voice ({activePreset})</span>
        </button>

        <a
          href={story.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <span>Read original on {story.sourceName}</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
        </a>
      </div>
    </article>
  );
};
