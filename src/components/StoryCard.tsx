import React from 'react';
import { Story, VoicePreset } from '../types';
import { ExternalLink, Sparkles, Clock, Bookmark, BookmarkCheck } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onOpenExplainer: (story: Story) => void;
  isSaved: boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
}

const CATEGORY_COLORS: Record<string, string> = {
  economy: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  tech: 'text-indigo-800 bg-indigo-50 border-indigo-200',
  policy: 'text-amber-800 bg-amber-50 border-amber-200',
  world: 'text-sky-800 bg-sky-50 border-sky-200',
  climate: 'text-teal-800 bg-teal-50 border-teal-200',
};

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onOpenExplainer,
  isSaved,
  onToggleSave,
  activePreset,
}) => {
  const categoryBadge = CATEGORY_COLORS[story.category] || 'text-zinc-800 bg-zinc-50 border-zinc-200';

  return (
    <article className="bg-white rounded-xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Card Header Meta */}
        <div className="flex items-center justify-between text-xs mb-3 font-mono-meta">
          <span className={`px-2 py-0.5 rounded-xs border font-semibold uppercase tracking-wider text-[10px] ${categoryBadge}`}>
            {story.category}
          </span>

          <div className="flex items-center gap-2 text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              {story.timeAgo}
            </span>
            <button
              onClick={() => onToggleSave(story.id)}
              className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              {isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-red-700" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Source Attributed */}
        <div className="text-xs font-semibold text-zinc-500 mb-1.5">
          {story.sourceName}
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenExplainer(story)}
          className="font-serif-editorial text-lg sm:text-xl font-bold text-zinc-900 leading-snug mb-2 hover:text-red-900 transition-colors cursor-pointer"
        >
          {story.title}
        </h3>

        {/* Deck */}
        <p className="font-serif-editorial text-sm text-zinc-600 line-clamp-3 leading-relaxed mb-4">
          {story.deck}
        </p>
      </div>

      {/* Card Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
        <button
          onClick={() => onOpenExplainer(story)}
          className="inline-flex items-center gap-1.5 text-red-800 font-semibold hover:text-red-950 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-red-700" />
          <span>Explain ({activePreset})</span>
        </button>

        <a
          href={story.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-800 transition-colors"
          title="Open original article on publisher site"
        >
          <span>Source</span>
          <ExternalLink className="w-3 h-3 text-zinc-400" />
        </a>
      </div>
    </article>
  );
};
