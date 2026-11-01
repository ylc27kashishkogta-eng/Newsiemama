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
import { FINANCE_SUBCATEGORY_LABELS } from '../services/feedService';

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
  const { currentProfile, isArticleRead, toggleStoryFeedback, getStoryFeedback } = useProfile();
  const isRead = isArticleRead(story.id);
  const feedback = getStoryFeedback(story.id);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const isVibe = currentProfile.slangLevel === 'vibe';

  const handleFeedback = (type: 'more' | 'less', e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStoryFeedback(story.id, type);
    const msg = type === 'more' 
      ? 'Prioritizing more stories like this' 
      : 'Downranking similar stories';
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  return (
    <article className={`bg-[#ffffff] rounded-3xl border-2 border-[#e7ded3] p-6 sm:p-9 shadow-sm hover:shadow-md transition-all relative mb-8 animate-card-stagger stagger-1 ${
      feedback === 'less' ? 'opacity-70 bg-[#faf6f0]' : ''
    }`}>
      {/* Downranked Notification Banner with Undo */}
      {feedback === 'less' && (
        <div className="bg-[#fde8df] border border-[#f5cbbe] rounded-xl p-2.5 mb-4 text-xs text-[#82351f] flex items-center justify-between animate-paper-fade">
          <div className="flex items-center gap-2">
            <ThumbsDown className="w-3.5 h-3.5 text-[#9e4429]" />
            <span>Marked <strong>Less like this</strong>: Similar stories will be downranked.</span>
          </div>
          <button
            onClick={(e) => handleFeedback('less', e)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#ffffff] text-[#9e4429] font-semibold rounded-lg border border-[#f5cbbe] hover:bg-[#faf6f0] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Personalization Reason & Source Trust Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#f4eee5] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Personalized "Why this story" tag */}
          <span className="font-mono-meta font-bold uppercase tracking-wider text-[#0369a1] bg-[#e0f2fe] px-2.5 py-0.5 rounded-full border border-[#bae6fd] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#0369a1]" />
            <span>{story.curatedReason || `Because you follow ${story.category}`}</span>
          </span>

          {/* Subcategory */}
          {story.financeSubcategory && (
            <span className="text-[10px] font-mono-meta text-[#5c554e] bg-[#f9f5ef] px-2 py-0.5 rounded-full border border-[#e7ded3]">
              {FINANCE_SUBCATEGORY_LABELS[story.financeSubcategory] || story.financeSubcategory}
            </span>
          )}

          <span className="text-[#5c554e] font-medium font-serif-editorial">| {story.sourceName}</span>

          {/* Source Mode Trust Indicator */}
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0f766e] bg-[#f0fdfa] px-2 py-0.5 rounded-full border border-[#99f6e4]">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>Live RSS</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[#5c554e] font-mono-meta">
          {isRead && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0f766e] bg-[#f0fdfa] px-2 py-0.5 rounded-full border border-[#99f6e4]">
              <Check className="w-3 h-3" />
              <span>Read</span>
            </span>
          )}

          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#8c8278]" />
            {story.timeAgo}
          </span>
          <span>•</span>
          <span>{story.readingMinutes} min read</span>

          <button
            onClick={() => onToggleSave(story.id)}
            className="text-[#8c8278] hover:text-[#191715] transition-colors cursor-pointer p-1 rounded-md"
            title={isSaved ? 'Remove from saved' : 'Save article for later'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-[#0f766e]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Headline */}
      <h2
        onClick={() => onOpenExplainer(story)}
        className="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#191715] leading-tight mb-4 hover:text-[#0f766e] transition-colors cursor-pointer"
      >
        {story.title}
      </h2>

      {/* Vibe Summary or Deck */}
      {isVibe && story.vibeSummary ? (
        <div className="bg-[#fde8df]/80 border-l-4 border-[#0f766e] pl-4 py-3 my-4 rounded-r-xl">
          <div className="text-[11px] font-mono-meta font-bold uppercase tracking-wider text-[#0f766e] mb-1">
            ⚡ Quick Vibe Takeaway
          </div>
          <p className="text-sm sm:text-base font-sans text-[#191715] font-medium leading-relaxed">
            {story.vibeSummary}
          </p>
        </div>
      ) : (
        <p className="font-serif-editorial italic text-base sm:text-lg text-[#3a332a] border-l-4 border-[#0f766e] pl-4 my-4 leading-snug bg-[#faf6f0] py-2.5 rounded-r-lg">
          {story.deck}
        </p>
      )}

      {/* Editorial Body Excerpt */}
      <div className="text-sm sm:text-base text-[#3a332a] leading-relaxed font-serif-editorial my-4">
        {story.content}
      </div>

      {/* Key Takeaways Preview Bullets */}
      {story.keyBullets && story.keyBullets.length > 0 && (
        <div className="bg-[#f4eee5] border border-[#e7ded3] rounded-2xl p-4 my-4 space-y-2">
          <div className="text-xs font-mono-meta font-bold uppercase tracking-wider text-[#191715]">
            Key Takeaways:
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[#2a241f]">
            {story.keyBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f766e] mt-1.5 shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback Toast */}
      {feedbackNotice && (
        <div className="mb-4 p-2 text-xs font-semibold text-center text-[#0f766e] bg-[#f0fdfa] rounded-xl border border-[#99f6e4] animate-paper-fade">
          {feedbackNotice}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#f4eee5] mt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenExplainer(story)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-transform active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ffffff]" />
            <span>Explain in My Voice ({activePreset})</span>
          </button>

          {/* More / Less shape buttons */}
          <div className="flex items-center gap-1 border-l border-[#e7ded3] pl-2">
            <button
              onClick={(e) => handleFeedback('more', e)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                feedback === 'more'
                  ? 'bg-[#f0fdfa] text-[#0f766e] border-[#99f6e4]'
                  : 'bg-[#ffffff] text-[#8c8278] border-[#e7ded3] hover:text-[#191715]'
              }`}
              title="More stories like this"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => handleFeedback('less', e)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                feedback === 'less'
                  ? 'bg-[#fde8df] text-[#9e4429] border-[#f5cbbe]'
                  : 'bg-[#ffffff] text-[#8c8278] border-[#e7ded3] hover:text-[#191715]'
              }`}
              title="Less stories like this"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <a
          href={story.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5c554e] hover:text-[#0f766e] transition-colors"
        >
          <span>Read original on {story.sourceName}</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8c8278]" />
        </a>
      </div>
    </article>
  );
};
