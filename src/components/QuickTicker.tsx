import React from 'react';
import { Story } from '../types';
import { useProfile } from '../context/ProfileContext';
import { ExternalLink, Sparkles, Check } from 'lucide-react';

interface QuickTickerProps {
  stories: Story[];
  onOpenExplainer: (story: Story) => void;
}

export const QuickTicker: React.FC<QuickTickerProps> = ({ stories, onOpenExplainer }) => {
  const { isArticleRead } = useProfile();

  if (stories.length === 0) return null;

  return (
    <aside className="bg-[#ffffff] rounded-3xl border-2 border-[#e7ded3] p-5 sm:p-6 shadow-xs animate-card-stagger stagger-3">
      <div className="flex items-center justify-between border-b-2 border-[#0f766e] pb-2.5 mb-4">
        <h3 className="font-masthead text-base font-bold tracking-wide text-[#191715] uppercase">
          In Brief Today
        </h3>
        <span className="text-[10px] font-mono-meta font-bold uppercase tracking-wider text-[#0369a1] bg-[#e0f2fe] px-2.5 py-0.5 rounded-full border border-[#bae6fd]">
          Scannable Digest
        </span>
      </div>

      <div className="divide-y divide-dashed divide-[#e7ded3]">
        {stories.map((story, idx) => {
          const isRead = isArticleRead(story.id);

          return (
            <div key={story.id} className="py-3.5 first:pt-0 last:pb-0 group">
              <div className="flex items-center justify-between text-[11px] font-mono-meta text-[#8c8278] mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#0f766e] font-mono-meta">
                    0{idx + 1}
                  </span>
                  <span className="font-semibold text-[#5c554e]">{story.sourceName}</span>
                  <span className="text-[9px] text-[#0f766e] bg-[#f0fdfa] px-1.5 py-0.2 rounded-xs border border-[#99f6e4]">
                    Live
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isRead && (
                    <span className="text-[10px] text-[#0f766e] font-semibold flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>Read</span>
                    </span>
                  )}
                  <span>{story.timeAgo}</span>
                </div>
              </div>

              {/* Personalized Reason */}
              <div className="text-[10px] text-[#0369a1] font-medium mb-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{story.curatedReason || `Because you follow ${story.category}`}</span>
              </div>

              <h4
                onClick={() => onOpenExplainer(story)}
                className="font-serif-editorial text-sm font-semibold text-[#191715] leading-snug group-hover:text-[#0f766e] transition-colors cursor-pointer"
              >
                {story.title}
              </h4>

              <div className="flex items-center justify-between mt-2 pt-1">
                <button
                  onClick={() => onOpenExplainer(story)}
                  className="text-[11px] font-bold text-[#0f766e] hover:text-[#115e59] transition-colors cursor-pointer"
                >
                  Quick Explainer →
                </button>
                <a
                  href={story.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#8c8278] hover:text-[#191715] inline-flex items-center gap-1"
                >
                  <span>Link</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
