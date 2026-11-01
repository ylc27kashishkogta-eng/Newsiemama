import React from 'react';
import { Story, VoicePreset } from '../types';
import { useProfile } from '../context/ProfileContext';
import { LeadStoryCard } from './LeadStoryCard';
import { StoryCard } from './StoryCard';
import { QuickTicker } from './QuickTicker';
import { PlaycardDeck } from './PlaycardDeck';
import { EditorialCompanion } from './EditorialCompanion';
import { CheckCircle2, ShieldCheck, Bookmark, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';

interface FrontPageProps {
  stories: Story[];
  onOpenExplainer: (story: Story) => void;
  isSaved: (storyId: string) => boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
  sourceNote: string;
  viewMode?: 'broadsheet' | 'playcard';
  onOpenNewsQuest: () => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({
  stories,
  onOpenExplainer,
  isSaved,
  onToggleSave,
  activePreset,
  sourceNote,
  viewMode = 'broadsheet',
  onOpenNewsQuest,
}) => {
  const { currentProfile } = useProfile();

  if (stories.length === 0) {
    return (
      <div className="bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-12 text-center my-8 animate-paper-fade">
        <Bookmark className="w-8 h-8 text-[#e25c50] mx-auto mb-3 opacity-60" />
        <h3 className="font-serif-editorial text-xl font-bold text-[#181513] mb-2">No Stories in This View</h3>
        <p className="text-sm text-[#6e685f] max-w-md mx-auto">
          If you selected Saved Stories, bookmark any article across your edition to read it here. Otherwise, try selecting All Sections above.
        </p>
      </div>
    );
  }

  // Interactive Playcard View Mode
  if (viewMode === 'playcard') {
    return (
      <main className="animate-paper-fade">
        {currentProfile.companionEnabled !== false && (
          <div className="max-w-2xl mx-auto mb-4 px-4">
            <EditorialCompanion
              mood="curious"
              message="Swipe or click through each playcard to catch the key takeaways, or open the full story when you want all the details!"
              slangLevel={currentProfile.slangLevel}
            />
          </div>
        )}
        <PlaycardDeck
          stories={stories}
          onOpenExplainer={onOpenExplainer}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          activePreset={activePreset}
        />
      </main>
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

        {/* Right Rail Sidebar Column (Companion + Game Controller + Quick Ticker) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Animated Editorial Companion ("Pip") */}
          {currentProfile.companionEnabled !== false && (
            <EditorialCompanion
              mood="thoughtful"
              category={leadStory?.category}
              slangLevel={currentProfile.slangLevel}
            />
          )}

          {/* Sidebar News Quest Controller Launcher */}
          <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-2xl p-5 shadow-sm space-y-3 animate-card-stagger stagger-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#eee8f8] text-[#7c66dc] flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif-editorial text-sm font-bold text-[#181513]">
                    News Quest
                  </h4>
                  <p className="text-[11px] font-mono-meta text-[#6e685f]">
                    Today's 3-Question Quiz
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono-meta font-bold text-[#7c66dc] bg-[#eee8f8] px-2 py-0.5 rounded-full">
                {currentProfile.questProgress?.totalPoints || 0} pts
              </span>
            </div>

            <p className="text-xs text-[#5c5449] leading-relaxed">
              Test your understanding of today's stories. 100% voluntary, no penalties for missed days, and all answers link back to source facts.
            </p>

            <button
              onClick={onOpenNewsQuest}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#7c66dc] hover:bg-[#6750c8] text-[#ffffff] font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Play News Quest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scannable Digest Ticker */}
          <QuickTicker
            stories={tickerStories.length > 0 ? tickerStories : secondaryStories.slice(0, 3)}
            onOpenExplainer={onOpenExplainer}
          />

          {/* Editorial Integrity Box */}
          <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-2xl p-5 text-xs text-[#5c5449] space-y-2.5 animate-card-stagger stagger-4">
            <h4 className="font-mono-meta font-bold uppercase tracking-wider text-[#181513] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4e6c58]" />
              <span>Provenance & Attribution</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              Every headline links to official publisher syndications or topic hubs. Bundled stories are clearly labeled illustrative scenarios crafted for prototype demonstration and do not claim to be breaking live wire dispatches.
            </p>
            <div className="pt-2 text-[10px] text-[#8f887d] font-mono-meta border-t border-[#e2d5c7]">
              Status: {sourceNote}
            </div>
          </div>
        </div>
      </div>

      {/* Finite Newspaper Completion Finish Line */}
      <div className="mt-16 pt-8 border-double-top text-center pb-12">
        <div className="inline-flex items-center gap-2 text-[#6e685f] text-xs font-serif-editorial italic bg-[#ffffff] px-4 py-2 rounded-full border border-[#e4dcd3] shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#4e6c58]" />
          <span>You are all caught up with today's edition. Have a calm, productive day ahead!</span>
        </div>
      </div>
    </main>
  );
};
