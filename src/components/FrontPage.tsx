import React from 'react';
import { Story, VoicePreset } from '../types';
import { useProfile } from '../context/ProfileContext';
import { LeadStoryCard } from './LeadStoryCard';
import { StoryCard } from './StoryCard';
import { QuickTicker } from './QuickTicker';
import { PlaycardDeck } from './PlaycardDeck';
import { EditorialCompanion } from './EditorialCompanion';
import {
  CheckCircle2,
  ShieldCheck,
  Bookmark,
  Gamepad2,
  ArrowRight,
  Sparkles,
  Layers,
  Quote,
  Clock,
  Radio,
  ExternalLink
} from 'lucide-react';

interface FrontPageProps {
  stories: Story[];
  onOpenExplainer: (story: Story) => void;
  isSaved: (storyId: string) => boolean;
  onToggleSave: (storyId: string) => void;
  activePreset: VoicePreset;
  sourceNote: string;
  viewMode?: 'broadsheet' | 'playcard';
  onOpenNewsQuest: () => void;
  onRefresh?: () => void;
  onToggleViewMode?: (mode: 'broadsheet' | 'playcard') => void;
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
  onRefresh,
  onToggleViewMode,
}) => {
  const { currentProfile } = useProfile();

  if (stories.length === 0) {
    return (
      <div className="bg-[#ffffff] rounded-3xl border-2 border-[#e7ded3] p-12 text-center my-8 animate-paper-fade shadow-sm">
        <Bookmark className="w-10 h-10 text-[#0f766e] mx-auto mb-3 opacity-60" />
        <h3 className="font-serif-editorial text-2xl font-bold text-[#191715] mb-2">No Stories in This View</h3>
        <p className="text-sm text-[#5c554e] max-w-md mx-auto mb-5 leading-relaxed font-sans">
          If you selected Saved Stories, bookmark any article across your edition to read it here. If a live category has no articles currently syndicated, Moodpaper never invents fictional filler news.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Retry Live Syndication Feeds</span>
          </button>
        )}
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
  const featuredStory = stories.length > 1 ? stories[1] : null;
  const secondaryStories = stories.slice(2, 6);
  const tickerStories = stories.slice(6);

  return (
    <main className="animate-paper-fade space-y-8">
      {/* Editorial Playcards Feature Teaser Banner */}
      {onToggleViewMode && (
        <div className="bg-[#fde8df] border-2 border-[#f5cbbe] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-[#0f766e]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0f766e] text-[#ffffff] flex items-center justify-center shrink-0 shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-base sm:text-lg font-bold text-[#191715]">
                  Experience Modern Playcards Mode
                </span>
                <span className="text-[10px] font-mono-meta font-bold bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-full border border-[#bae6fd]">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-[#5c554e] font-sans mt-0.5">
                Prefer quick, focused reading? Tap to flip through bite-sized narrative cards with key takeaways and progress tracking.
              </p>
            </div>
          </div>
          <button
            onClick={() => onToggleViewMode('playcard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Switch to Playcards</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-Column Responsive Broadsheet Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (Lead Story + Featured Card + Grid) */}
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

          {/* Asymmetric Magazine Feature Card (Story #2) */}
          {featuredStory && (
            <section className="bg-[#fde8df]/40 border-2 border-[#f5cbbe] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f5cbbe] pb-3 mb-4 text-xs font-mono-meta">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0f766e] text-[#ffffff] font-bold uppercase tracking-wider text-[10px]">
                    Featured Dispatch
                  </span>
                  <span className="text-[#5c554e] font-medium font-serif-editorial">
                    {featuredStory.sourceName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#0f766e] bg-[#f0fdfa] px-2 py-0.5 rounded-full border border-[#99f6e4]">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>Live</span>
                  </span>
                </div>
                <span className="text-[#8c8278] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredStory.timeAgo}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  <h3
                    onClick={() => onOpenExplainer(featuredStory)}
                    className="font-serif-editorial text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#191715] leading-snug hover:text-[#0f766e] transition-colors cursor-pointer"
                  >
                    {featuredStory.title}
                  </h3>
                  <p className="font-serif-editorial text-sm sm:text-base text-[#3a332a] leading-relaxed">
                    {featuredStory.deck || featuredStory.content.slice(0, 220) + '...'}
                  </p>
                </div>

                <div className="md:col-span-4 bg-[#ffffff] border border-[#e7ded3] rounded-2xl p-4 shadow-2xs space-y-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#f0fdfa] text-[#0f766e] flex items-center justify-center mx-auto">
                    <Quote className="w-4 h-4" />
                  </div>
                  <p className="font-serif-editorial italic text-xs text-[#5c554e] leading-snug">
                    "Grounded wire report verified directly from {featuredStory.sourceName}."
                  </p>
                  <button
                    onClick={() => onOpenExplainer(featuredStory)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explore Story</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Secondary Story Cards Grid (Stories 3, 4, 5, 6) */}
          {secondaryStories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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

        {/* Right Rail Sidebar Column (Companion + News Quest + Quick Ticker + Provenance) */}
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
          <div className="bg-[#ffffff] border-2 border-[#e7ded3] rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 animate-card-stagger stagger-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] flex items-center justify-center">
                  <Gamepad2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-serif-editorial text-base font-bold text-[#191715]">
                    News Quest
                  </h4>
                  <p className="text-[11px] font-mono-meta text-[#5c554e]">
                    Today's 3-Question Quiz
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono-meta font-bold text-[#0369a1] bg-[#e0f2fe] px-2.5 py-1 rounded-full border border-[#bae6fd]">
                {currentProfile.questProgress?.totalPoints || 0} pts
              </span>
            </div>

            <p className="text-xs text-[#5c554e] leading-relaxed font-sans">
              Test your understanding of today's verified stories. 100% voluntary, no penalties for missed days, and all answers link back to source facts.
            </p>

            <button
              onClick={onOpenNewsQuest}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-[#ffffff] font-bold text-xs shadow-xs transition-colors cursor-pointer"
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
          <div className="bg-[#f4eee5] border-2 border-[#e7ded3] rounded-3xl p-5 text-xs text-[#5c554e] space-y-2.5 animate-card-stagger stagger-4">
            <h4 className="font-mono-meta font-bold uppercase tracking-wider text-[#191715] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
              <span>Provenance & Attribution</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              Every story is directly syndicated from official publisher RSS feeds with exact headlines, publication timestamps, and direct canonical links. Moodpaper never fabricates news or generates fictional filler articles.
            </p>
            <div className="pt-2 text-[10px] text-[#8c8278] font-mono-meta border-t border-[#e7ded3]">
              Status: {sourceNote}
            </div>
          </div>
        </div>
      </div>

      {/* Finite Newspaper Completion Finish Line */}
      <div className="mt-16 pt-8 border-double-top text-center pb-12">
        <div className="inline-flex items-center gap-2 text-[#5c554e] text-xs font-serif-editorial italic bg-[#ffffff] px-5 py-2.5 rounded-full border border-[#e7ded3] shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#0f766e]" />
          <span>You are all caught up with today's edition. Have a calm, productive day ahead!</span>
        </div>
      </div>
    </main>
  );
};
