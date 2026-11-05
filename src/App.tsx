import React, { useState, useEffect, useCallback } from 'react';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { Story, TopicCategory, FinanceSubcategory, MainNavigationTab } from './types';
import { feedService, FeedResponse } from './services/feedService';
import { Masthead } from './components/Masthead';
import { TopicBar } from './components/TopicBar';
import { FrontPage } from './components/FrontPage';
import { StoryDrawer } from './components/StoryDrawer';
import { ProfileModal } from './components/ProfileModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { SupporterModal } from './components/SupporterModal';
import { CustomizeTopicsModal } from './components/CustomizeTopicsModal';
import { WelcomeSetupModal } from './components/WelcomeSetupModal';
import { NewsQuestDrawer } from './components/NewsQuestDrawer';
import { FutureIntegrationsModal } from './components/FutureIntegrationsModal';
import { MarketDataTicker } from './components/MarketDataTicker';
import { VisualBusinessAgent } from './components/VisualBusinessAgent';
import { APP_NAME } from './config';
import { Newspaper } from 'lucide-react';
import { NewsimamaIntro } from './components/NewsimamaIntro';
import { TradingViewMarketsSection } from './components/TradingViewMarketsSection';
import { CareerLinkedInHub } from './components/CareerLinkedInHub';

const NewspaperApp: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const completeIntro = useCallback(() => setShowIntro(false), []);
  const [isMarketsSectionOpen, setIsMarketsSectionOpen] = useState(true);
  const { currentProfile, isArticleSaved, toggleSaveArticle, hasCompletedOnboarding } = useProfile();
  const [selectedTopic, setSelectedTopic] = useState<MainNavigationTab>('all');
  const [selectedFinanceSubcategory, setSelectedFinanceSubcategory] = useState<FinanceSubcategory>('all');
  const [viewMode, setViewMode] = useState<'broadsheet' | 'playcard'>('broadsheet');

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Modal & Drawer visibility states
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isWelcomeEditMode, setIsWelcomeEditMode] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSupporterModalOpen, setIsSupporterModalOpen] = useState(false);
  const [isCustomizeTopicsOpen, setIsCustomizeTopicsOpen] = useState(false);
  const [isNewsQuestDrawerOpen, setIsNewsQuestDrawerOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isBusinessAgentOpen, setIsBusinessAgentOpen] = useState(false);

  // Metadata states
  const [refreshedAt, setRefreshedAt] = useState('');
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [sourceNote, setSourceNote] = useState('');

  // Check if first-time visitor needs welcome onboarding
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setIsWelcomeModalOpen(true);
      setIsWelcomeEditMode(false);
    }
  }, [hasCompletedOnboarding]);

  // Reset topic filter to 'all' whenever active profile changes
  useEffect(() => {
    setSelectedTopic('all');
    setSelectedFinanceSubcategory('all');
  }, [currentProfile.id]);

  // Fetch stories on profile topics change or profile switch
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    feedService.getEditionStories(currentProfile.topics, false, selectedFinanceSubcategory).then((res: FeedResponse) => {
      if (isCurrent) {
        setStories(res.stories);
        setRefreshedAt(res.refreshedAt);
        setIsLiveFeed(res.isLive && res.liveCount > 0);
        setSourceNote(res.sourceNote);
        setIsLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [currentProfile.topics, currentProfile.id, selectedFinanceSubcategory]);

  // Handle on-demand edition refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await feedService.getEditionStories(currentProfile.topics, true, selectedFinanceSubcategory);
      setStories(res.stories);
      setRefreshedAt(res.refreshedAt);
      setIsLiveFeed(res.isLive && res.liveCount > 0);
      setSourceNote(res.sourceNote);
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter stories by current topic selection (including 'saved' for later)
  const filteredStories = selectedTopic === 'all' || selectedTopic === 'career'
    ? stories
    : selectedTopic === 'saved'
    ? stories.filter((s) => (currentProfile.savedArticleIds || []).includes(s.id))
    : stories.filter((s) => {
        if (selectedTopic === 'finance') {
          return s.category === 'finance' || s.category === 'economy';
        }
        return s.category === selectedTopic;
      });

  const totalStoriesCount = stories.length;
  const readStoriesCount = stories.filter((s) => (currentProfile.readStoryIds || []).includes(s.id)).length;
  const savedStoriesCount = (currentProfile.savedArticleIds || []).length;

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#191715] flex flex-col justify-between selection:bg-[#ffedd5] selection:text-[#0f766e]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 w-full py-3 sm:py-4 max-w-full overflow-x-hidden">
        {/* Newspaper Masthead */}
        <Masthead
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenProfiles={() => setIsProfileModalOpen(true)}
          onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
          onOpenSupporter={() => setIsSupporterModalOpen(true)}
          onOpenRoadmap={() => setIsRoadmapModalOpen(true)}
          onOpenNewsQuest={() => setIsNewsQuestDrawerOpen(true)}
          onOpenBusinessAgent={() => setIsBusinessAgentOpen(true)}
          onOpenCareer={() => setSelectedTopic('career')}
          onEditSetup={() => {
            setIsWelcomeEditMode(true);
            setIsWelcomeModalOpen(true);
          }}
          refreshedAt={refreshedAt}
          isLiveFeed={isLiveFeed}
          totalStoriesCount={totalStoriesCount}
          readStoriesCount={readStoriesCount}
          viewMode={viewMode}
          onToggleViewMode={(mode) => setViewMode(mode)}
        />

        {/* Live Market Data Ticker */}
        <MarketDataTicker
          isDetailedViewOpen={isMarketsSectionOpen || selectedTopic === 'finance' || selectedTopic === 'economy'}
          onToggleDetailedView={() => setIsMarketsSectionOpen((prev) => !prev)}
        />

        {/* Dedicated Indian Markets & Watchlist Overview (TradingView) */}
        {(isMarketsSectionOpen || selectedTopic === 'finance' || selectedTopic === 'economy') && (
          <TradingViewMarketsSection />
        )}

        {/* Topic Filter Ribbon & Customizer */}
        <TopicBar
          selectedTopic={selectedTopic}
          onSelectTopic={(t) => {
            setSelectedTopic(t);
            if (t !== 'all' && t !== 'finance' && t !== 'economy') {
              setSelectedFinanceSubcategory('all');
            }
          }}
          availableTopics={currentProfile.topics}
          totalStoriesCount={totalStoriesCount}
          savedStoriesCount={savedStoriesCount}
          onOpenCustomizeTopics={() => setIsCustomizeTopicsOpen(true)}
          selectedFinanceSubcategory={selectedFinanceSubcategory}
          onSelectFinanceSubcategory={(sub) => setSelectedFinanceSubcategory(sub)}
          viewMode={viewMode}
          onToggleViewMode={(mode) => setViewMode(mode)}
        />

        {/* Main Broadsheet Front Page or Playcard Deck */}
        {selectedTopic === 'career' ? (
          <CareerLinkedInHub
            initialTopicCategory={currentProfile.topics[0]}
            onBackToNews={() => setSelectedTopic('all')}
          />
        ) : isLoading ? (
          <div className="py-24 text-center">
            <Newspaper className="w-8 h-8 text-[#e25c50] animate-bounce mx-auto mb-3" />
            <div className="font-serif-editorial text-lg text-[#181513] font-semibold">
              Compiling {currentProfile.name}'s Edition...
            </div>
            <p className="text-xs text-[#6e685f] mt-1 font-mono-meta">
              Curating sections & personalizing narrative explainers
            </p>
          </div>
        ) : (
          <FrontPage
            stories={filteredStories}
            onOpenExplainer={(story) => setActiveStory(story)}
            isSaved={isArticleSaved}
            onToggleSave={toggleSaveArticle}
            activePreset={currentProfile.voicePreset}
            sourceNote={sourceNote}
            viewMode={viewMode}
            onOpenNewsQuest={() => setIsNewsQuestDrawerOpen(true)}
            onRefresh={handleRefresh}
            onToggleViewMode={(mode) => setViewMode(mode)}
          />
        )}
      </div>

      {/* Global Interactive Modals & Drawers */}
      <WelcomeSetupModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        isEditMode={isWelcomeEditMode}
      />

      <StoryDrawer
        story={activeStory}
        onClose={() => setActiveStory(null)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenNewProfileSetup={() => {
          setIsWelcomeEditMode(false);
          setIsWelcomeModalOpen(true);
        }}
      />

      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      <CustomizeTopicsModal
        isOpen={isCustomizeTopicsOpen}
        onClose={() => setIsCustomizeTopicsOpen(false)}
      />

      <SupporterModal
        isOpen={isSupporterModalOpen}
        onClose={() => setIsSupporterModalOpen(false)}
      />

      <NewsQuestDrawer
        isOpen={isNewsQuestDrawerOpen}
        onClose={() => setIsNewsQuestDrawerOpen(false)}
        stories={stories}
        onOpenStory={(s) => setActiveStory(s)}
      />

      <VisualBusinessAgent
        isOpen={isBusinessAgentOpen}
        onClose={() => setIsBusinessAgentOpen(false)}
        activeStories={filteredStories}
      />

      <FutureIntegrationsModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
      />

      {/* Educational & Publisher Attribution Footer */}
      <footer className="bg-[#ffffff] border-t border-[#e4dcd3] py-8 px-4 text-center text-xs text-[#6e685f] mt-12 shadow-inner">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-serif-editorial italic text-[#3a332a]">
            {APP_NAME} is an educational digital newspaper prototype. News headlines and summaries are syndications of official public RSS feeds from The Economic Times, The Indian Express, Mint, India Today, and BBC News.
          </p>
          <p className="font-mono-meta text-[11px] text-[#8f887d]">
            Built with React 19, Vite, and Tailwind CSS • On-device LocalStorage profile isolation • WCAG AA contrast compliant
          </p>
        </div>
      </footer>

      {showIntro && <NewsimamaIntro onComplete={completeIntro} />}
    </div>
  );
};

export default function App() {
  return (
    <ProfileProvider>
      <NewspaperApp />
    </ProfileProvider>
  );
}


