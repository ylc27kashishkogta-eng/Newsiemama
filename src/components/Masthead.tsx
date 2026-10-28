import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { RefreshCw, Users, Mic, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

interface MastheadProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenProfiles: () => void;
  onOpenVoiceSettings: () => void;
  onOpenSupporter: () => void;
  onEditSetup: () => void;
  refreshedAt: string;
  isLiveFeed: boolean;
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
}) => {
  const { currentProfile } = useProfile();

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

  return (
    <header className="border-double-bottom pb-6 mb-8 pt-4">
      {/* Returning Reader Welcome & Continuity Bar */}
      <div className="bg-[#f7efe9] border border-[#e8dacd] rounded-xl px-4 py-2.5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#3a332a]">
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
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onEditSetup}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#faf7f2] text-[#1e1b18] font-medium rounded-lg border border-[#d8ccc0] shadow-2xs transition-colors cursor-pointer"
            title="Edit your name, age range, topics, and voice choices"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#b9533f]" />
            <span>Edit Setup</span>
          </button>

          <button
            onClick={onOpenProfiles}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ede4da] hover:bg-[#e2d7cb] text-[#3a332a] font-medium rounded-lg transition-colors cursor-pointer"
            title="Switch reader profile"
          >
            <Users className="w-3.5 h-3.5 text-[#6e685f]" />
            <span>Switch Reader</span>
          </button>
        </div>
      </div>

      {/* Top Utility Ribbon */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#6e685f] border-b border-[#e4dcd3] pb-2 mb-4 font-mono-meta tracking-wider uppercase">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#1e1b18]">VOL. I — NO. 42</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#1e1b18] font-semibold">{todayFormatted}</span>
        </div>

        <div className="flex items-center gap-3">
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
          <h1 className="font-masthead text-3xl sm:text-5xl font-bold tracking-tight text-[#1e1b18] leading-none">
            {currentProfile.editionTitle || `${currentProfile.name}'s Daily Dispatch`}
          </h1>
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
