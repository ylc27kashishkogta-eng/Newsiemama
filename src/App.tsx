import React, { useState, useEffect } from 'react';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { Story, TopicCategory } from './types';
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
import { Newspaper } from 'lucide-react';

const NewspaperApp: React.FC = () => {
  const { currentProfile, isArticleSaved, toggleSaveArticle, hasCompletedOnboarding } = useProfile();
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory | 'all'>('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Modal visibility states
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isWelcomeEditMode, setIsWelcomeEditMode] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSupporterModalOpen, setIsSupporterModalOpen] = useState(false);
  const [isCustomizeTopicsOpen, setIsCustomizeTopicsOpen] = useState(false);

  // Metadata states
  const [refreshedAt, setRefreshedAt] = useState('06:30 AM');
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
  }, [currentProfile.id]);

  // Fetch stories on profile topics change or profile switch
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    feedService.getEditionStories(currentProfile.topics, false).then((res: FeedResponse) => {
      if (isCurrent) {
        setStories(res.stories);
        setRefreshedAt(res.refreshedAt);
        setIsLiveFeed(res.isLive);
        setSourceNote(res.sourceNote);
        setIsLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [currentProfile.topics, currentProfile.id]);

  // Handle on-demand edition refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await feedService.getEditionStories(currentProfile.topics, true);
      setStories(res.stories);
      setRefreshedAt(res.refreshedAt);
      setIsLiveFeed(res.isLive);
      setSourceNote(res.sourceNote);
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter stories by current topic selection
  const filteredStories = selectedTopic === 'all'
    ? stories
    : stories.filter((s) => s.category === selectedTopic);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b18] flex flex-col justify-between selection:bg-[#f5e6e1] selection:text-[#963f2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
        {/* Newspaper Masthead */}
        <Masthead
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenProfiles={() => setIsProfileModalOpen(true)}
          onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
          onOpenSupporter={() => setIsSupporterModalOpen(true)}
          onEditSetup={() => {
            setIsWelcomeEditMode(true);
            setIsWelcomeModalOpen(true);
          }}
          refreshedAt={refreshedAt}
          isLiveFeed={isLiveFeed}
        />

        {/* Topic Filter Ribbon & Customizer */}
        <TopicBar
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          availableTopics={currentProfile.topics}
          totalStoriesCount={stories.length}
          onOpenCustomizeTopics={() => setIsCustomizeTopicsOpen(true)}
        />

        {/* Main Broadsheet Front Page */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Newspaper className="w-8 h-8 text-[#b9533f] animate-bounce mx-auto mb-3" />
            <div className="font-serif-editorial text-lg text-[#1e1b18] font-semibold">
              Compiling {currentProfile.name}'s Morning Edition...
            </div>
            <p className="text-xs text-[#6e685f] mt-1 font-mono-meta">Filtering topics & synthesizing storytelling narratives</p>
          </div>
        ) : (
          <FrontPage
            stories={filteredStories}
            onOpenExplainer={(story) => setActiveStory(story)}
            isSaved={isArticleSaved}
            onToggleSave={toggleSaveArticle}
            activePreset={currentProfile.voicePreset}
            sourceNote={sourceNote}
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

      {/* Educational & Publisher Attribution Footer */}
      <footer className="bg-[#f5ece3] border-t border-[#e2d5c7] py-8 px-4 text-center text-xs text-[#6e685f] mt-12">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-serif-editorial italic text-[#3a332a]">
            Curio Dispatch is an educational digital newspaper prototype. News headlines and summaries are syndications of official public RSS feeds from The Economic Times, The Indian Express, India Today, and BBC News.
          </p>
          <p className="font-mono-meta text-[11px] text-[#8f887d]">
            Built with React 19, Vite, and Tailwind CSS • On-device LocalStorage profile isolation • WCAG AA contrast compliant
          </p>
        </div>
      </footer>
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
