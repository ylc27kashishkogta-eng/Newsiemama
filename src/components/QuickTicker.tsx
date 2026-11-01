import React from 'react';
import { Story } from '../types';
import { useProfile } from '../context/ProfileContext';
import { ExternalLink, Sparkles, Check, FileText, Radio } from 'lucide-react';

interface QuickTickerProps {
  stories: Story[];
  onOpenExplainer: (story: Story) => void;
}

export const QuickTicker: React.FC<QuickTickerProps> = ({ stories, onOpenExplainer }) => {
  const { isArticleRead } = useProfile();

  if (stories.length === 0) return null;

  return (
    <aside className="bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-5 sm:p-6 shadow-xs animate-card-stagger stagger-3">
      <div className="flex items-center justify-between border-b-2 border-[#1e1b18] pb-2.5 mb-4">
        <h3 className="font-masthead text-base font-bold tracking-wide text-[#1e1b18] uppercase">
          In Brief Today
        </h3>
        <span className="text-[10px] font-mono-meta font-semibold uppercase text-[#6e685f] bg-[#f0e8df] px-2.5 py-0.5 rounded-full border border-[#ded4c7]">
          Scannable Digest
        </span>
      </div>

      <div className="divide-y divide-dashed divide-[#e8ded5]">
        {stories.map((story) => {
          const isRead = isArticleRead(story.id);

          return (
            <div key={story.id} className="py-3.5 first:pt-0 last:pb-0 group">
              <div className="flex items-center justify-between text-[11px] font-mono-meta text-[#8f887d] mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#5c5449]">{story.sourceName}</span>
                  <span className="text-[9px] text-[#2d6a4f] bg-[#e8f5e9] px-1.5 py-0.2 rounded-xs border border-[#c8e6c9]">
                    Live
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isRead && (
                    <span className="text-[10px] text-[#4e6c58] font-semibold flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>Read</span>
                    </span>
                  )}
                  <span>{story.timeAgo}</span>
                </div>
              </div>

              {/* Personalized Reason */}
              <div className="text-[10px] text-[#4e6c58] font-medium mb-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{story.curatedReason || `Because you follow ${story.category}`}</span>
              </div>

              <h4
                onClick={() => onOpenExplainer(story)}
                className="font-serif-editorial text-sm font-semibold text-[#1e1b18] leading-snug group-hover:text-[#b9533f] transition-colors cursor-pointer"
              >
                {story.title}
              </h4>

              <div className="flex items-center justify-between mt-2 text-xs">
                <button
                  onClick={() => onOpenExplainer(story)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b9533f] hover:text-[#963f2e] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#b9533f]" />
                  <span>Explain</span>
                </button>

                <a
                  href={story.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8f887d] hover:text-[#1e1b18] transition-colors"
                  title="View original article"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
