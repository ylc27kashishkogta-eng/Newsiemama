import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { APP_NAME, APP_TAGLINE } from '../config';
import {
  RefreshCw,
  Users,
  Mic,
  Sparkles,
  SlidersHorizontal,
  Check,
  RotateCcw,
  BookOpen,
  Gauge,
  Pencil,
  X,
  Mail,
  Gamepad2,
  Building2,
  Layers,
  LayoutGrid
} from 'lucide-react';

interface MastheadProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenProfiles: () => void;
  onOpenVoiceSettings: () => void;
  onOpenSupporter: () => void;
  onOpenRoadmap?: () => void;
  onOpenNewsQuest?: () => void;
  onOpenBusinessAgent?: () => void;
  onEditSetup: () => void;
  refreshedAt: string;
  isLiveFeed: boolean;
  totalStoriesCount: number;
  readStoriesCount: number;
  viewMode?: 'broadsheet' | 'playcard';
  onToggleViewMode?: (mode: 'broadsheet' | 'playcard') => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  onRefresh,
  isRefreshing,
  onOpenProfiles,
  onOpenVoiceSettings,
  onOpenSupporter,
  onOpenRoadmap,
  onOpenNewsQuest,
  onOpenBusinessAgent,
  onEditSetup,
  refreshedAt,
  isLiveFeed,
  totalStoriesCount,
  readStoriesCount,
  viewMode = 'broadsheet',
  onToggleViewMode,
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

  const slangLabels: Record<string, string> = {
    off: 'Clean',
    subtle: 'Casual',
    vibe: 'Vibe (Gen Z)',
  };

  const percentage = totalStoriesCount > 0 ? Math.round((readStoriesCount / totalStoriesCount) * 100) : 0;

  const handleReset = () => {
    resetAllPreferences();
    setShowResetConfirm(false);
  };

  return (
    <header className="border-double-bottom pb-6 mb-6 pt-2">
      {/* Brand Sub-bar with App Identity & Interactive Agents */}
      <div className="flex items-center justify-between py-1 mb-3 border-b border-[#f0eae1] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif-editorial font-bold text-base tracking-tight text-[#181513]">
            {APP_NAME}
          </span>
          <span className="text-[10px] font-mono-meta text-[#8f887d] uppercase tracking-widest hidden sm:inline">
            • {APP_TAGLINE}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Playcards / Broadsheet Switcher in Masthead Header */}
          {onToggleViewMode && (
            <button
              onClick={() => onToggleViewMode(viewMode === 'broadsheet' ? 'playcard' : 'broadsheet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                viewMode === 'playcard'
                  ? 'bg-[#0f766e] text-[#ffffff] ring-2 ring-[#99f6e4]'
                  : 'bg-[#fde8df] text-[#82351f] border border-[#f5cbbe] hover:bg-[#fadcd0]'
              }`}
              title="Switch between Broadsheet and Playcards reading mode"
            >
              <Layers className="w-3.5 h-3.5 text-[#0f766e]" />
              <span>{viewMode === 'playcard' ? '📰 Broadsheet' : '✨ Playcards Mode'}</span>
            </button>
          )}

          {onOpenBusinessAgent && (
            <button
              onClick={onOpenBusinessAgent}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde8df] text-[#82351f] border border-[#f5cbbe] text-xs font-semibold hover:bg-[#fae1d6] transition-colors shadow-2xs cursor-pointer"
              title="Open Visual AI News & Business Agent"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0f766e]" />
              <span>AI Business Agent</span>
            </button>
          )}

          {onOpenNewsQuest && (
            <button
              onClick={onOpenNewsQuest}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] text-xs font-medium hover:bg-[#bae6fd] transition-colors cursor-pointer"
              title="Open Daily News Quest Game"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">News Quest</span>
              <span className="text-[10px] bg-[#ffffff] px-1.5 py-0.2 rounded-full font-bold">
                {currentProfile.questProgress?.totalPoints || 0}p
              </span>
            </button>
          )}

          {onOpenRoadmap && (
            <button
              onClick={onOpenRoadmap}
              className="inline-flex items-center gap-1 text-xs text-[#5c554e] hover:text-[#191715] px-2 py-1 rounded-lg hover:bg-[#f9f5ef] transition-colors cursor-pointer"
              title="9:00 AM Email Digest & AI Roadmap"
            >
              <Mail className="w-3.5 h-3.5 text-[#0f766e]" />
              <span className="hidden md:inline">9 AM Digest</span>
            </button>
          )}
        </div>
      </div>

      {/* Returning Reader Welcome & Continuity Ribbon */}
      <div className="bg-[#fde8df]/70 border border-[#f5cbbe] rounded-2xl px-4 py-2.5 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#2a241f]">
          <span className="w-5 h-5 rounded-full bg-[#0f766e] text-[#ffffff] flex items-center justify-center font-bold text-[10px]">
            <Check className="w-3 h-3" />
          </span>
          <span>
            Reading as <strong className="text-[#191715] font-bold">{currentProfile.name}</strong>
          </span>
          <span className="hidden md:inline text-[#8c8278]">•</span>
          <span className="hidden md:inline text-xs text-[#5c554e]">
            Age: <strong>{ageLabels[currentProfile.ageRange] || 'Standard'}</strong>
          </span>
          <span className="hidden md:inline text-[#8c8278]">•</span>
          <span className="hidden md:inline text-xs text-[#5c554e]">
            Tone: <strong>{voiceLabels[currentProfile.voicePreset] || currentProfile.voicePreset}</strong>
          </span>
          <span className="hidden md:inline text-[#8c8278]">•</span>
          <span className="hidden md:inline text-xs text-[#5c554e]">
            Flavor: <strong className="text-[#0f766e]">{slangLabels[currentProfile.slangLevel || 'subtle']}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={onEditSetup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] hover:bg-[#faf6f0] text-[#191715] font-semibold rounded-xl border border-[#e7ded3] shadow-2xs transition-colors cursor-pointer"
            title="Edit your name, age range, topics, and voice choices"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0f766e]" />
            <span>Edit Setup</span>
          </button>

          <button
            onClick={onOpenProfiles}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-semibold rounded-xl border border-[#bae6fd] transition-colors cursor-pointer"
            title="Switch reader profile"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Reader</span>
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-[#8f887d] hover:text-[#e25c50] transition-colors cursor-pointer"
              title="Reset preferences and restart welcome setup"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 bg-[#ffffff] border border-[#e25c50] px-2 py-1 rounded-lg text-[11px] animate-paper-fade">
              <span className="text-[#e25c50] font-semibold">Reset all?</span>
              <button
                onClick={handleReset}
                className="px-1.5 py-0.5 bg-[#e25c50] text-[#ffffff] rounded font-bold cursor-pointer hover:bg-[#cf4b3f]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-1.5 py-0.5 text-[#6e685f] hover:text-[#181513] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Daily Reading Progress Indicator */}
      <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-xl px-4 py-2 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#4e6c58]" />
          <span className="font-semibold text-[#181513]">
            Today's Reading Progress:
          </span>
          <span className="text-[#5c5449] font-mono-meta">
            {readStoriesCount} of {totalStoriesCount} articles explored ({percentage}%)
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-48 h-2 bg-[#f0eae1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4e6c58] transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {percentage === 100 && totalStoriesCount > 0 && (
            <span className="text-[11px] font-bold text-[#3e5f49] bg-[#e3ece5] px-2 py-0.5 rounded-full whitespace-nowrap animate-paper-fade">
              ✨ Caught up!
            </span>
          )}
        </div>
      </div>

      {/* Top Utility Ribbon */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#6e685f] border-b border-[#e4dcd3] pb-2 mb-4 font-mono-meta tracking-wider uppercase">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#181513]">VOL. II — 100% REAL NEWS EDITION</span>
          <span>•</span>
          <span className="text-[#181513] font-semibold">{todayFormatted}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reduced Motion Toggle */}
          <button
            onClick={toggleReducedMotion}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] transition-colors cursor-pointer ${
              reducedMotion
                ? 'bg-[#181513] text-[#ffffff] border-[#181513]'
                : 'bg-[#ffffff] text-[#6e685f] border-[#d8ccc0] hover:border-[#181513]'
            }`}
            title="Toggle reduced motion animations for smoother low-movement reading"
          >
            <Gauge className="w-3 h-3" />
            <span>Motion: {reducedMotion ? 'Reduced' : 'Full'}</span>
          </button>

          <span>•</span>

          <span className="flex items-center gap-1.5 text-[#4e6c58] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4e6c58] animate-pulse"></span>
            <span>Live RSS Syndications</span>
          </span>

          <span>•</span>
          <span className="text-[#8f887d]">Updated: {refreshedAt}</span>
        </div>
      </div>

      {/* Main Newspaper Masthead Title */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-3">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#fde8df] text-[#82351f] text-xs font-semibold px-3.5 py-1 rounded-full border border-[#f5cbbe] mb-2.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0f766e]"></span>
            <span>CURATED FOR</span>
            <span className="uppercase tracking-wider font-bold text-[#191715]">{currentProfile.name}</span>
          </div>
          
          {isEditingTitle ? (
            <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="font-serif-editorial text-2xl sm:text-4xl font-extrabold tracking-tight text-[#191715] bg-[#ffffff] border-2 border-[#0f766e] px-3 py-1 rounded-xl shadow-inner focus:outline-none max-w-full"
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
                  className="px-3 py-1.5 bg-[#0f766e] text-[#ffffff] text-xs font-bold rounded-lg hover:bg-[#115e59] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Save title"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-2.5 py-1.5 bg-[#f4eee5] text-[#5c554e] text-xs font-semibold rounded-lg hover:bg-[#e7ded3] transition-colors cursor-pointer flex items-center gap-1"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="group flex items-center justify-center md:justify-start gap-2.5">
              <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#191715] leading-none">
                {currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`}
              </h1>
              <button
                onClick={() => {
                  setTempTitle(currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`);
                  setIsEditingTitle(true);
                }}
                className="opacity-70 group-hover:opacity-100 p-1.5 text-[#8c8278] hover:text-[#0f766e] hover:bg-[#fde8df] rounded-lg transition-all cursor-pointer"
                title="Rename your personalized newspaper"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="font-serif-editorial italic text-[#5c554e] text-sm sm:text-base mt-2">
            A calm, distraction-free morning broadsheet built exclusively from verified live dispatches
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2a241f] bg-[#ffffff] border border-[#e7ded3] rounded-xl shadow-2xs hover:bg-[#faf6f0] hover:text-[#191715] transition-colors disabled:opacity-50 cursor-pointer"
            title="Fetch latest updates from permitted publisher RSS feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0f766e] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Fetching Wires...' : 'Refresh'}</span>
          </button>

          {/* Voice Tuning Button */}
          <button
            onClick={onOpenVoiceSettings}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2a241f] bg-[#ffffff] border border-[#e7ded3] rounded-xl shadow-2xs hover:bg-[#faf6f0] hover:text-[#191715] transition-colors cursor-pointer"
            title="Personalize explanation voice & analyze your writing style"
          >
            <Mic className="w-3.5 h-3.5 text-[#0f766e]" />
            <span>Voice: <strong className="capitalize text-[#191715]">{voiceLabels[currentProfile.voicePreset] || currentProfile.voicePreset}</strong></span>
          </button>

          {/* Profile Switcher Button */}
          <button
            onClick={onOpenProfiles}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#191715] bg-[#fde8df] border border-[#f5cbbe] rounded-xl shadow-2xs hover:bg-[#fae1d6] transition-colors cursor-pointer"
            title="Switch reader profile"
          >
            <Users className="w-3.5 h-3.5 text-[#82351f]" />
            <span className="font-bold text-[#82351f]">{currentProfile.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
