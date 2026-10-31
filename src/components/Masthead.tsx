import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import {
  RefreshCw,
  Users,
  Mic,
  Sparkles,
  SlidersHorizontal,
  Check,
  RotateCcw,
  BookOpen,
  Sparkle,
  Gauge,
  Pencil,
  X
} from 'lucide-react';

interface MastheadProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenProfiles: () => void;
  onOpenVoiceSettings: () => void;
  onOpenSupporter: () => void;
  onEditSetup: () => void;
  refreshedAt: string;
  isLiveFeed: boolean;
  totalStoriesCount: number;
  readStoriesCount: number;
}

export const Masthead: React.FC<MastheadProps> = ({
  onRefresh,
  isRefreshing,
  onOpenProfiles,
  onOpenVoiceSettings,
  onOpenSupporter,
  onEditSetup,
  refreshedAt,
  isLiveFeed,
  totalStoriesCount,
  readStoriesCount,
}) => {
  const { currentProfile, reducedMotion, toggleReducedMotion, resetAllPreferences, updateEditionTitle } = useProfile();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`);

  const handleSaveTitle = () => {
    const finalTitle = tempTitle.trim() || `${currentProfile.name}'s Newsroom`;
    updateEditionTitle(finalTitle);
    setIsEditingTitle(false);
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const ageLabels: Record<string, string> = {
    'under-13': 'Under 13',
    '13-17': '13–17',
    '18-24': '18–24',
    '25-34': '25–34',
    '35-plus': '35+',
    'prefer-not-to-say': 'Standard',
  };

  const voiceLabels: Record<string, string> = {
    executive: 'Quick Brief',
    conversational: 'Friendly Explainer',
    storyteller: 'Storyteller',
  };

  const percentage = totalStoriesCount > 0 ? Math.round((readStoriesCount / totalStoriesCount) * 100) : 0;

  const handleReset = () => {
    resetAllPreferences();
    setShowResetConfirm(false);
  };

  return (
    <header className="border-double-bottom pb-6 mb-8 pt-4">
      {/* Returning Reader Welcome & Continuity Ribbon */}
      <div className="bg-[#f7efe9] border border-[#e8dacd] rounded-2xl px-4 py-3 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#3a332a]">
          <span className="w-5 h-5 rounded-full bg-[#4e6c58] text-white flex items-center justify-center font-bold text-[10px]">
            <Check className="w-3 h-3" />
          </span>
          <span>
            Reading as <strong className="text-[#1e1b18] font-bold">{currentProfile.name}</strong>
          </span>
          <span className="hidden md:inline text-[#8f887d]">•</span>
          <span className="hidden md:inline text-xs text-[#6e685f]">
            Age: <strong>{ageLabels[currentProfile.ageRange] || 'Standard'}</strong>
          </span>
          <span className="hidden md:inline text-[#8f887d]">•</span>
          <span className="hidden md:inline text-xs text-[#6e685f]">
            Voice: <strong>{voiceLabels[currentProfile.voicePreset] || currentProfile.voicePreset}</strong>
          </span>
          <span className="hidden lg:inline text-[#8f887d]">•</span>
          <span className="hidden lg:inline-flex items-center gap-1 text-xs text-[#b9533f] font-semibold bg-white px-2 py-0.5 rounded-lg border border-[#e4dcd3]" title="Knowledge Points earned in Daily News Quest">
            <Sparkles className="w-3 h-3 text-[#b9533f]" />
            <span>{currentProfile.questProgress?.totalPoints || 0} pts</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={onEditSetup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#faf7f2] text-[#1e1b18] font-semibold rounded-xl border border-[#d8ccc0] shadow-2xs transition-colors cursor-pointer"
            title="Edit your name, age range, topics, and voice choices"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#b9533f]" />
            <span>Edit Setup</span>
          </button>

          <button
            onClick={onOpenProfiles}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ede4da] hover:bg-[#e2d7cb] text-[#3a332a] font-semibold rounded-xl transition-colors cursor-pointer"
            title="Switch reader profile"
          >
            <Users className="w-3.5 h-3.5 text-[#6e685f]" />
            <span>Switch Reader</span>
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-[#8f887d] hover:text-[#b9533f] transition-colors cursor-pointer"
              title="Reset preferences and restart welcome setup"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 bg-white border border-[#b9533f] px-2 py-1 rounded-lg text-[11px] animate-paper-fade">
              <span className="text-[#b9533f] font-semibold">Reset all?</span>
              <button
                onClick={handleReset}
                className="px-1.5 py-0.5 bg-[#b9533f] text-white rounded font-bold cursor-pointer hover:bg-[#963f2e]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-1.5 py-0.5 text-[#6e685f] hover:text-[#1e1b18] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Daily Reading Progress Indicator */}
      <div className="bg-[#faf6f0] border border-[#e2d5c7] rounded-xl px-4 py-2.5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#4e6c58]" />
          <span className="font-semibold text-[#1e1b18]">
            Today's Reading Progress:
          </span>
          <span className="text-[#5c5449] font-mono-meta">
            {readStoriesCount} of {totalStoriesCount} stories read ({percentage}%)
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Visual progress bar */}
          <div className="w-full sm:w-48 h-2 bg-[#e8ded5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4e6c58] transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {percentage === 100 && (
            <span className="text-[11px] font-bold text-[#3b5744] bg-[#edf2ee] px-2 py-0.5 rounded-full whitespace-nowrap animate-paper-fade">
              ✨ Caught up!
            </span>
          )}
        </div>
      </div>

      {/* Top Utility Ribbon */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#6e685f] border-b border-[#e4dcd3] pb-2 mb-4 font-mono-meta tracking-wider uppercase">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#1e1b18]">VOL. I — NO. 42</span>
          <span>•</span>
          <span className="text-[#1e1b18] font-semibold">{todayFormatted}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reduced Motion Toggle */}
          <button
            onClick={toggleReducedMotion}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] transition-colors cursor-pointer ${
              reducedMotion
                ? 'bg-[#1e1b18] text-[#faf7f2] border-[#1e1b18]'
                : 'bg-white text-[#6e685f] border-[#d8ccc0] hover:border-[#1e1b18]'
            }`}
            title="Toggle reduced motion animations for smoother low-movement reading"
          >
            <Gauge className="w-3 h-3" />
            <span>Motion: {reducedMotion ? 'Reduced' : 'Full'}</span>
          </button>

          <span>•</span>

          <span className="flex items-center gap-1.5 text-[#4e6c58] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4e6c58] animate-pulse"></span>
            {isLiveFeed ? 'Live RSS Syndication' : 'Morning Edition Snapshot'}
          </span>

          <span>•</span>
          <span className="text-[#8f887d]">Refreshed: {refreshedAt}</span>
        </div>
      </div>

      {/* Main Newspaper Masthead Title */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#f5e6e1] text-[#963f2e] text-xs font-semibold px-3 py-1 rounded-full border border-[#e8cecb] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#b9533f]" />
            <span>CURATED FOR</span>
            <span className="uppercase tracking-wider font-bold">{currentProfile.name}</span>
          </div>
          
          {isEditingTitle ? (
            <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="font-masthead text-2xl sm:text-4xl font-bold tracking-tight text-[#1e1b18] bg-white border-2 border-[#b9533f] px-3 py-1 rounded-xl shadow-inner focus:outline-hidden max-w-full"
                placeholder={`${currentProfile.name}'s Newsroom`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSaveTitle}
                  className="px-3 py-1.5 bg-[#b9533f] text-white text-xs font-bold rounded-lg hover:bg-[#963f2e] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Save title"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-2.5 py-1.5 bg-[#ede5dc] text-[#5c5449] text-xs font-semibold rounded-lg hover:bg-[#e2d8cd] transition-colors cursor-pointer flex items-center gap-1"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="group flex items-center justify-center md:justify-start gap-2.5">
              <h1 className="font-masthead text-3xl sm:text-5xl font-bold tracking-tight text-[#1e1b18] leading-none">
                {currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`}
              </h1>
              <button
                onClick={() => {
                  setTempTitle(currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`);
                  setIsEditingTitle(true);
                }}
                className="opacity-70 group-hover:opacity-100 p-1.5 text-[#8f887d] hover:text-[#b9533f] hover:bg-[#f5e6e1] rounded-lg transition-all cursor-pointer"
                title="Rename your personalized newspaper"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="font-serif-editorial italic text-[#5c5449] text-sm sm:text-base mt-2">
            A calm, distraction-free morning broadsheet with personalized conversational synthesis
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#3a332a] bg-white border border-[#d8ccc0] rounded-xl shadow-2xs hover:bg-[#faf7f2] hover:text-[#1e1b18] transition-colors disabled:opacity-50 cursor-pointer"
            title="Fetch latest updates from permitted publisher RSS feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#6e685f] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Edition'}</span>
          </button>

          {/* Voice Tuning Button */}
          <button
            onClick={onOpenVoiceSettings}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#3a332a] bg-white border border-[#d8ccc0] rounded-xl shadow-2xs hover:bg-[#faf7f2] hover:text-[#1e1b18] transition-colors cursor-pointer"
            title="Personalize explanation voice & analyze your writing style"
          >
            <Mic className="w-3.5 h-3.5 text-[#b9533f]" />
            <span>Voice: <strong className="capitalize text-[#1e1b18]">{voiceLabels[currentProfile.voicePreset] || currentProfile.voicePreset}</strong></span>
          </button>

          {/* Profile Switcher Button */}
          <button
            onClick={onOpenProfiles}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1e1b18] bg-[#ede5dc] border border-[#d8ccc0] rounded-xl shadow-2xs hover:bg-[#e2d8cd] transition-colors cursor-pointer"
            title="Switch reader profile"
          >
            <Users className="w-3.5 h-3.5 text-[#5c5449]" />
            <span className="font-semibold">{currentProfile.name.split(' ')[0]}</span>
          </button>

          {/* Supporter Badge Button (October 31 Prep) */}
          <button
            onClick={onOpenSupporter}
            className="hidden lg:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#8b4513] bg-[#fdf3e7] border border-[#f0d4b8] rounded-xl hover:bg-[#fae7d0] transition-colors cursor-pointer"
            title="Dodo Payments supporter tier preview"
          >
            <span>★ Patron</span>
          </button>
        </div>
      </div>
    </header>
  );
};
