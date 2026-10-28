import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { RefreshCw, Users, Mic, Sparkles, CheckCircle2 } from 'lucide-react';

interface MastheadProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenProfiles: () => void;
  onOpenVoiceSettings: () => void;
  onOpenSupporter: () => void;
  refreshedAt: string;
  isLiveFeed: boolean;
}

export const Masthead: React.FC<MastheadProps> = ({
  onRefresh,
  isRefreshing,
  onOpenProfiles,
  onOpenVoiceSettings,
  onOpenSupporter,
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

  return (
    <header className="border-double-bottom pb-6 mb-8 pt-4">
      {/* Top Utility Ribbon */}
      <div className="flex flex-wrap items-center justify-between text-xs text-zinc-600 border-b border-zinc-200 pb-2 mb-4 font-mono-meta tracking-wider uppercase">
        <div className="flex items-center gap-4">
          <span>VOL. I — NO. 42</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-zinc-800 font-semibold">{todayFormatted}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {isLiveFeed ? 'Live RSS Syndication' : 'Morning Edition Snapshot'}
          </span>
          <span>•</span>
          <span className="text-zinc-500">Refreshed: {refreshedAt}</span>
        </div>
      </div>

      {/* Main Newspaper Masthead Title */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-800 text-xs font-semibold px-3 py-1 rounded-full border border-red-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-700" />
            <span>CURATED FOR</span>
            <span className="uppercase tracking-wider font-bold">{currentProfile.name}</span>
          </div>
          <h1 className="font-masthead text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-none">
            {currentProfile.editionTitle || `${currentProfile.name}'s Daily Dispatch`}
          </h1>
          <p className="font-serif-editorial italic text-zinc-600 text-sm sm:text-base mt-2">
            A calm, distraction-free morning broadsheet with personalized conversational synthesis
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition-colors disabled:opacity-50 cursor-pointer"
            title="Fetch latest updates from permitted publisher RSS feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Edition'}</span>
          </button>

          {/* Voice Tuning Button */}
          <button
            onClick={onOpenVoiceSettings}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer"
            title="Personalize explanation voice & analyze your writing style"
          >
            <Mic className="w-3.5 h-3.5 text-red-700" />
            <span>Voice: <strong className="capitalize text-zinc-900">{currentProfile.voicePreset}</strong></span>
          </button>

          {/* Profile Switcher Button */}
          <button
            onClick={onOpenProfiles}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-300 rounded-lg shadow-xs hover:bg-zinc-200 transition-colors cursor-pointer"
            title="Switch reader profile"
          >
            <Users className="w-3.5 h-3.5 text-zinc-700" />
            <span className="font-semibold">{currentProfile.name.split(' ')[0]}</span>
          </button>

          {/* Supporter Badge Button (October 31 Prep) */}
          <button
            onClick={onOpenSupporter}
            className="hidden lg:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            title="Dodo Payments supporter tier preview"
          >
            <span>★ Patron</span>
          </button>
        </div>
      </div>
    </header>
  );
};
