import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ReaderProfile,
  TopicCategory,
  VoicePreset,
  CustomVoiceProfile,
  AgeRange,
  ReaderQuestProgress,
  SlangLevel,
  StoryLength
} from '../types';
import { storageService, DEFAULT_PROFILES } from '../services/storageService';
import { questService } from '../services/questService';

interface ProfileContextType {
  currentProfile: ReaderProfile;
  profiles: ReaderProfile[];
  hasCompletedOnboarding: boolean;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  switchProfile: (id: string) => void;
  updateTopics: (topics: TopicCategory[]) => void;
  setVoicePreset: (preset: VoicePreset) => void;
  setSlangLevel: (level: SlangLevel) => void;
  setStoryLength: (length: StoryLength) => void;
  setCompanionEnabled: (enabled: boolean) => void;
  updateAgeRange: (ageRange: AgeRange) => void;
  updateEditionTitle: (title: string) => void;
  updateProfileDetails: (
    name: string,
    ageRange: AgeRange,
    voicePreset: VoicePreset,
    topics: TopicCategory[],
    editionTitle?: string,
    slangLevel?: SlangLevel,
    storyLength?: StoryLength
  ) => void;
  saveCustomVoice: (custom: CustomVoiceProfile) => void;
  createNewProfile: (
    name: string,
    ageRange: AgeRange,
    topics: TopicCategory[],
    preset: VoicePreset,
    editionTitle?: string,
    slangLevel?: SlangLevel,
    storyLength?: StoryLength
  ) => ReaderProfile;
  toggleSaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;
  markArticleAsRead: (articleId: string) => void;
  isArticleRead: (articleId: string) => boolean;
  toggleStoryFeedback: (articleId: string, feedback: 'more' | 'less') => void;
  getStoryFeedback: (articleId: string) => 'more' | 'less' | null;
  recordQuestAnswer: (
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean,
    categoryTested?: TopicCategory,
    isLastInQuest?: boolean,
    totalQuestionsInQuest?: number
  ) => { pointsEarned: number; newBadgeIds: string[] };
  toggleShowNewsQuest: (show?: boolean) => void;
  resetQuestProgress: () => void;
  completeOnboarding: () => void;
  resetToWelcome: () => void;
  resetAllPreferences: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ReaderProfile[]>(() => storageService.getProfiles());
  const [activeId, setActiveId] = useState<string>(() => storageService.getActiveProfileId());
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() =>
    storageService.hasCompletedOnboarding()
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    storageService.getReducedMotion()
  );

  const currentProfile = profiles.find((p) => p.id === activeId) || profiles[0] || DEFAULT_PROFILES[0];

  useEffect(() => {
    storageService.setActiveProfileId(activeId);
  }, [activeId]);

  useEffect(() => {
    storageService.setReducedMotion(reducedMotion);
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  const switchProfile = (id: string) => {
    setActiveId(id);
    storageService.setActiveProfileId(id);
  };

  const updateTopics = (topics: TopicCategory[]) => {
    const updated: ReaderProfile = { ...currentProfile, topics };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const setVoicePreset = (voicePreset: VoicePreset) => {
    const updated: ReaderProfile = { ...currentProfile, voicePreset };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const setSlangLevel = (slangLevel: SlangLevel) => {
    const updated: ReaderProfile = { ...currentProfile, slangLevel };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const setStoryLength = (storyLength: StoryLength) => {
    const updated: ReaderProfile = { ...currentProfile, storyLength };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const setCompanionEnabled = (companionEnabled: boolean) => {
    const updated: ReaderProfile = { ...currentProfile, companionEnabled };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const updateAgeRange = (ageRange: AgeRange) => {
    const updated: ReaderProfile = { ...currentProfile, ageRange };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const updateEditionTitle = (title: string) => {
    const cleanTitle = title.trim() || `${currentProfile.name}'s Newsroom`;
    const updated: ReaderProfile = { ...currentProfile, editionTitle: cleanTitle };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const updateProfileDetails = (
    name: string,
    ageRange: AgeRange,
    voicePreset: VoicePreset,
    topics: TopicCategory[],
    customEditionTitle?: string,
    slangLevel?: SlangLevel,
    storyLength?: StoryLength
  ) => {
    const editionTitle = customEditionTitle?.trim() || `${name}'s Newsroom`;
    const updated: ReaderProfile = {
      ...currentProfile,
      name,
      ageRange,
      voicePreset,
      topics,
      editionTitle,
      slangLevel: slangLevel || currentProfile.slangLevel || 'subtle',
      storyLength: storyLength || currentProfile.storyLength || 'balanced',
    };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const saveCustomVoice = (customVoice: CustomVoiceProfile) => {
    const updated: ReaderProfile = { ...currentProfile, customVoice };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const createNewProfile = (
    name: string,
    ageRange: AgeRange,
    topics: TopicCategory[],
    preset: VoicePreset,
    customTitle?: string,
    slangLevel: SlangLevel = 'subtle',
    storyLength: StoryLength = 'balanced'
  ): ReaderProfile => {
    const newProfile = storageService.createProfile(name, ageRange, topics, preset, customTitle, slangLevel, storyLength);
    setProfiles(storageService.getProfiles());
    setActiveId(newProfile.id);
    setHasCompletedOnboarding(true);
    return newProfile;
  };

  const toggleSaveArticle = (articleId: string) => {
    const isSaved = (currentProfile.savedArticleIds || []).includes(articleId);
    const savedArticleIds = isSaved
      ? (currentProfile.savedArticleIds || []).filter((id) => id !== articleId)
      : [...(currentProfile.savedArticleIds || []), articleId];

    const updated: ReaderProfile = { ...currentProfile, savedArticleIds };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const isArticleSaved = (articleId: string): boolean => {
    return (currentProfile.savedArticleIds || []).includes(articleId);
  };

  const markArticleAsRead = (articleId: string) => {
    if ((currentProfile.readStoryIds || []).includes(articleId)) return;
    const readStoryIds = [...(currentProfile.readStoryIds || []), articleId];
    const updated: ReaderProfile = { ...currentProfile, readStoryIds };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const isArticleRead = (articleId: string): boolean => {
    return (currentProfile.readStoryIds || []).includes(articleId);
  };

  const toggleStoryFeedback = (articleId: string, feedback: 'more' | 'less') => {
    let liked = [...(currentProfile.likedStoryIds || [])];
    let disliked = [...(currentProfile.dislikedStoryIds || [])];

    if (feedback === 'more') {
      if (liked.includes(articleId)) {
        liked = liked.filter((id) => id !== articleId);
      } else {
        liked.push(articleId);
        disliked = disliked.filter((id) => id !== articleId);
      }
    } else {
      if (disliked.includes(articleId)) {
        disliked = disliked.filter((id) => id !== articleId);
      } else {
        disliked.push(articleId);
        liked = liked.filter((id) => id !== articleId);
      }
    }

    const updated: ReaderProfile = {
      ...currentProfile,
      likedStoryIds: liked,
      dislikedStoryIds: disliked,
    };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const getStoryFeedback = (articleId: string): 'more' | 'less' | null => {
    if ((currentProfile.likedStoryIds || []).includes(articleId)) return 'more';
    if ((currentProfile.dislikedStoryIds || []).includes(articleId)) return 'less';
    return null;
  };

  const recordQuestAnswer = (
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean,
    categoryTested?: TopicCategory,
    isLastInQuest?: boolean,
    totalQuestionsInQuest: number = 3
  ): { pointsEarned: number; newBadgeIds: string[] } => {
    const currentProgress: ReaderQuestProgress = currentProfile.questProgress || {
      totalPoints: 0,
      unlockedBadgeIds: [],
      completedEditionDates: [],
      answeredQuestions: {},
      showNewsQuest: true,
    };

    const alreadyAnswered = Boolean(currentProgress.answeredQuestions[questionId]);
    const todayDate = new Date().toISOString().split('T')[0];
    let pointsToAdd = 0;
    const newBadgeIds: string[] = [];

    // Award points only for first-time correct answers
    if (!alreadyAnswered && isCorrect) {
      pointsToAdd = 25;
    }

    const updatedAnsweredQuestions = {
      ...currentProgress.answeredQuestions,
      [questionId]: { selectedIndex, isCorrect },
    };

    const newTotalPoints = currentProgress.totalPoints + pointsToAdd;
    const existingBadges = new Set(currentProgress.unlockedBadgeIds);

    // Badge Evaluation Rules
    if (!existingBadges.has('first-quest') && Object.keys(updatedAnsweredQuestions).length >= 1) {
      existingBadges.add('first-quest');
      newBadgeIds.push('first-quest');
    }

    if (categoryTested && !existingBadges.has(`curator-${categoryTested}`) && isCorrect) {
      const answersInCategory = Object.keys(updatedAnsweredQuestions).filter((qId) =>
        qId.includes(categoryTested)
      );
      if (answersInCategory.length >= 1) {
        existingBadges.add(`curator-${categoryTested}`);
        newBadgeIds.push(`curator-${categoryTested}`);
      }
    }

    let updatedDates = [...currentProgress.completedEditionDates];
    if (isLastInQuest && !updatedDates.includes(todayDate)) {
      updatedDates.push(todayDate);
      if (!existingBadges.has('edition-master')) {
        existingBadges.add('edition-master');
        newBadgeIds.push('edition-master');
      }
    }

    const updatedProgress: ReaderQuestProgress = {
      ...currentProgress,
      totalPoints: newTotalPoints,
      unlockedBadgeIds: Array.from(existingBadges),
      completedEditionDates: updatedDates,
      answeredQuestions: updatedAnsweredQuestions,
    };

    const updatedProfile: ReaderProfile = {
      ...currentProfile,
      questProgress: updatedProgress,
    };

    setProfiles((prev) => prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));
    storageService.updateProfile(updatedProfile);

    return { pointsEarned: pointsToAdd, newBadgeIds };
  };

  const toggleShowNewsQuest = (show?: boolean) => {
    const currentProgress = currentProfile.questProgress || {
      totalPoints: 0,
      unlockedBadgeIds: [],
      completedEditionDates: [],
      answeredQuestions: {},
      showNewsQuest: true,
    };

    const newShow = show !== undefined ? show : !currentProgress.showNewsQuest;
    const updatedProgress: ReaderQuestProgress = {
      ...currentProgress,
      showNewsQuest: newShow,
    };

    const updatedProfile: ReaderProfile = {
      ...currentProfile,
      questProgress: updatedProgress,
    };

    setProfiles((prev) => prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));
    storageService.updateProfile(updatedProfile);
  };

  const resetQuestProgress = () => {
    const updatedProgress: ReaderQuestProgress = {
      totalPoints: 0,
      unlockedBadgeIds: [],
      completedEditionDates: [],
      answeredQuestions: {},
      showNewsQuest: true,
    };

    const updatedProfile: ReaderProfile = {
      ...currentProfile,
      questProgress: updatedProgress,
    };

    setProfiles((prev) => prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));
    storageService.updateProfile(updatedProfile);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    storageService.setCompletedOnboarding(true);
  };

  const resetToWelcome = () => {
    setHasCompletedOnboarding(false);
    storageService.setCompletedOnboarding(false);
  };

  const resetAllPreferences = () => {
    storageService.resetAllPreferences();
    setProfiles(DEFAULT_PROFILES);
    setActiveId(DEFAULT_PROFILES[0].id);
    setHasCompletedOnboarding(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        profiles,
        hasCompletedOnboarding,
        reducedMotion,
        toggleReducedMotion,
        switchProfile,
        updateTopics,
        setVoicePreset,
        setSlangLevel,
        setStoryLength,
        setCompanionEnabled,
        updateAgeRange,
        updateEditionTitle,
        updateProfileDetails,
        saveCustomVoice,
        createNewProfile,
        toggleSaveArticle,
        isArticleSaved,
        markArticleAsRead,
        isArticleRead,
        toggleStoryFeedback,
        getStoryFeedback,
        recordQuestAnswer,
        toggleShowNewsQuest,
        resetQuestProgress,
        completeOnboarding,
        resetToWelcome,
        resetAllPreferences,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
