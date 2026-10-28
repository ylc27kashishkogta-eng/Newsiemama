import React from 'react';
import { Story, VoicePreset } from '../types';
import { LeadStoryCard } from './LeadStoryCard';
import { StoryCard } from './StoryCard';
import { QuickTicker } from './QuickTicker';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface FrontPageProps {
  stories: Story[];
  onOpenExplainer: (story: Story) => void;
  isSaved: (storyId: string) => boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
  sourceNote: string;
}

export const FrontPage: React.FC<FrontPageProps> = ({
  stories,
  onOpenExplainer,
  isSaved,
  onToggleSave,
  activePreset,
  sourceNote,
}) => {
  if (stories.length === 0) {
    return (
      <div className="bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-12 text-center my-8">
        <h3 className="font-serif-editorial text-xl font-bold text-[#1e1b18] mb-2">No Stories Matching Selected Topics</h3>
        <p className="text-sm text-[#6e685f] max-w-md mx-auto">
          Try selecting additional topics above or click "Refresh Edition" in the masthead to poll for latest news updates.
        </p>
      </div>
    );
  }

  const leadStory = stories[0];
  const secondaryStories = stories.slice(1, 5);
  const tickerStories = stories.slice(5);

  return (
    <main className="animate-paper-fade">
      {/* 2-Column Responsive Broadsheet Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (Lead Story + Grid) */}
        <div className="lg:col-span-8 space-y-8">
          {leadStory && (
            <LeadStoryCard
              story={leadStory}
              onOpenExplainer={onOpenExplainer}
              isSaved={isSaved(leadStory.id)}
              onToggleSave={onToggleSave}
              activePreset={activePreset}
            />
          )}

          {/* Secondary Story Cards Grid */}
          {secondaryStories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryStories.map((story, idx) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onOpenExplainer={onOpenExplainer}
                  isSaved={isSaved(story.id)}
                  onToggleSave={onToggleSave}
                  activePreset={activePreset}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Rail Sidebar Column (Quick Ticker / In Brief) */}
        <div className="lg:col-span-4 space-y-6">
          <QuickTicker
            stories={tickerStories.length > 0 ? tickerStories : secondaryStories.slice(0, 3)}
            onOpenExplainer={onOpenExplainer}
          />

          {/* Editorial Integrity Box */}
          <div className="bg-[#f7efe9] border border-[#e8dacd] rounded-2xl p-5 text-xs text-[#5c5449] space-y-2.5 animate-card-stagger stagger-4">
            <h4 className="font-mono-meta font-bold uppercase tracking-wider text-[#1e1b18] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4e6c58]" />
              <span>Provenance & Attribution</span>
            </h4>
            <p className="leading-relaxed">
              Every headline, timestamp, and excerpt links directly to official publisher web pages. This edition complies with publisher syndication terms and does not republish paywalled full texts.
            </p>
            <div className="pt-2 text-[11px] text-[#8f887d] font-mono-meta border-t border-[#e2d5c7]">
              Source: {sourceNote}
            </div>
          </div>
        </div>
      </div>

      {/* Finite Newspaper Completion Finish Line */}
      <div className="mt-16 pt-8 border-double-top text-center pb-12">
        <div className="inline-flex items-center gap-2 text-[#6e685f] text-xs font-serif-editorial italic bg-[#f7efe9] px-4 py-2 rounded-full border border-[#e8dacd]">
          <CheckCircle2 className="w-4 h-4 text-[#4e6c58]" />
          <span>You are all caught up with today's morning edition. Have a calm, productive day ahead!</span>
        </div>
      </div>
    </main>
  );
};
