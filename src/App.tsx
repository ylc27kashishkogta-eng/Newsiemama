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
import { Newspaper } from 'lucide-react';

const NewspaperApp: React.FC = () => {
  const { currentProfile, isArticleSaved, toggleSaveArticle } = useProfile();
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory | 'all'>('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSupporterModalOpen, setIsSupporterModalOpen] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState('06:30 AM');
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [sourceNote, setSourceNote] = useState('');

  // Fetch stories on profile change or initial mount
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
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
        {/* Newspaper Masthead */}
        <Masthead
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenProfiles={() => setIsProfileModalOpen(true)}
          onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
          onOpenSupporter={() => setIsSupporterModalOpen(true)}
          refreshedAt={refreshedAt}
          isLiveFeed={isLiveFeed}
        />

        {/* Topic Filter Ribbon */}
        <TopicBar
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          availableTopics={currentProfile.topics}
          totalStoriesCount={stories.length}
        />

        {/* Main Broadsheet Front Page */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Newspaper className="w-8 h-8 text-red-800 animate-bounce mx-auto mb-3" />
            <div className="font-serif-editorial text-lg text-zinc-700 font-semibold">
              Compiling {currentProfile.name}'s Morning Edition...
            </div>
            <p className="text-xs text-zinc-500 mt-1">Filtering topics and parsing editorial feeds</p>
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
      <StoryDrawer
        story={activeStory}
        onClose={() => setActiveStory(null)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      <SupporterModal
        isOpen={isSupporterModalOpen}
        onClose={() => setIsSupporterModalOpen(false)}
      />

      {/* Educational & Publisher Attribution Footer */}
      <footer className="bg-white border-t border-zinc-200 py-8 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-serif-editorial italic text-zinc-700">
            Curio Dispatch is an educational digital newspaper prototype. News headlines and summaries are syndications of official public RSS feeds from The Economic Times, The Indian Express, India Today, and BBC News.
          </p>
          <p className="font-mono-meta text-[11px] text-zinc-400">
            Built with React, Vite, and Tailwind CSS • Multi-profile LocalStorage isolation • Offline-first resilience
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
