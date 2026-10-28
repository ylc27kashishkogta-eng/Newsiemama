import React from 'react';
import { Story } from '../types';
import { ExternalLink, Sparkles } from 'lucide-react';

interface QuickTickerProps {
  stories: Story[];
  onOpenExplainer: (story: Story) => void;
}

export const QuickTicker: React.FC<QuickTickerProps> = ({ stories, onOpenExplainer }) => {
  if (stories.length === 0) return null;

  return (
    <aside className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-2 mb-4">
        <h3 className="font-masthead text-base font-bold tracking-wide text-zinc-900 uppercase">
          In Brief Today
        </h3>
        <span className="text-[10px] font-mono-meta font-semibold uppercase text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-sm">
          Scannable Digest
        </span>
      </div>

      <div className="divide-y divide-dashed divide-zinc-200">
        {stories.map((story) => (
          <div key={story.id} className="py-3.5 first:pt-0 last:pb-0 group">
            <div className="flex items-center justify-between text-[11px] font-mono-meta text-zinc-500 mb-1">
              <span className="font-semibold text-zinc-700">{story.sourceName}</span>
              <span>{story.timeAgo}</span>
            </div>

            <h4
              onClick={() => onOpenExplainer(story)}
              className="font-serif-editorial text-sm font-semibold text-zinc-800 leading-snug group-hover:text-red-900 transition-colors cursor-pointer"
            >
              {story.title}
            </h4>

            <div className="flex items-center justify-between mt-2 text-xs">
              <button
                onClick={() => onOpenExplainer(story)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 hover:text-red-950 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-red-600" />
                <span>Explain</span>
              </button>

              <a
                href={story.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-700 transition-colors"
                title="View original article"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
