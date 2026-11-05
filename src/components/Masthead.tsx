import React, { useEffect, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { APP_NAME, APP_TAGLINE } from '../config';
import {
  RefreshCw, Users, Mic, Sparkles, SlidersHorizontal, Check, RotateCcw,
  BookOpen, Gauge, Pencil, X, Mail, Gamepad2, Layers, Menu, ChevronRight,
  Settings2, Heart, Newspaper, Briefcase
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
  onOpenCareer?: () => void;
  onEditSetup: () => void;
  refreshedAt: string;
  isLiveFeed: boolean;
  totalStoriesCount: number;
  readStoriesCount: number;
  viewMode?: 'broadsheet' | 'playcard';
  onToggleViewMode?: (mode: 'broadsheet' | 'playcard') => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  onRefresh, isRefreshing, onOpenProfiles, onOpenVoiceSettings, onOpenSupporter,
  onOpenRoadmap, onOpenNewsQuest, onOpenBusinessAgent, onOpenCareer, onEditSetup,
  refreshedAt, isLiveFeed, totalStoriesCount, readStoriesCount,
  viewMode = 'broadsheet', onToggleViewMode,
}) => {
  const { currentProfile, reducedMotion, toggleReducedMotion, resetAllPreferences, updateEditionTitle } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`);
  const percentage = totalStoriesCount > 0 ? Math.round((readStoriesCount / totalStoriesCount) * 100) : 0;
  const todayFormatted = new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const voiceLabels: Record<string, string> = { executive: 'Quick Brief', conversational: 'Friendly Explainer', storyteller: 'Storyteller' };

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const closeAfter = (action?: () => void) => {
    setMenuOpen(false);
    action?.();
  };
  const saveTitle = () => {
    updateEditionTitle(tempTitle.trim() || `${currentProfile.name}'s Newsroom`);
    setIsEditingTitle(false);
  };
  const doReset = () => { resetAllPreferences(); setShowResetConfirm(false); setMenuOpen(false); };
  const menuButton = (icon: React.ReactNode, title: string, action?: () => void, detail?: string, tint = 'text-[#0f766e]') => (
    <button type="button" onClick={() => closeAfter(action)} className="news-menu__item">
      <span className={`news-menu__icon ${tint}`}>{icon}</span>
      <span className="news-menu__copy"><strong>{title}</strong>{detail && <small>{detail}</small>}</span>
      <ChevronRight size={16} className="text-[#a59a8e]" />
    </button>
  );

  return (
    <header className="newsimama-header mb-7 pt-1">
      <div className="newsimama-header__top">
        <div className="newsimama-header__brand">
          <span className="newsimama-header__seal"><Newspaper size={18} /></span>
          <div><div className="newsimama-header__name">{APP_NAME}</div><div className="newsimama-header__tagline">{APP_TAGLINE}</div></div>
        </div>
        <div className="newsimama-header__top-actions">
          <span className="newsimama-header__date">{todayFormatted}</span>
          <button type="button" onClick={onRefresh} disabled={isRefreshing} className="newsimama-refresh" aria-label="Refresh live news" title="Fetch the latest available publisher feed articles">
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Fetching' : 'Refresh news'}</span>
          </button>
          <button type="button" className="newsimama-menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open newspaper menu" aria-expanded={menuOpen}>
            <Menu size={19} /><span>Menu</span>
          </button>
        </div>
      </div>

      <div className="newsimama-header__edition">
        <div className="newsimama-header__reader"><span className="newsimama-header__spark">✦</span> Made for {currentProfile.name}</div>
        {isEditingTitle ? (
          <div className="newsimama-title-edit">
            <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} autoFocus aria-label="New newspaper title" onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setIsEditingTitle(false); }} />
            <button onClick={saveTitle} aria-label="Save title"><Check size={16} /></button>
            <button onClick={() => setIsEditingTitle(false)} aria-label="Cancel title edit"><X size={16} /></button>
          </div>
        ) : (
          <div className="newsimama-title-row">
            <h1>{currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`}</h1>
            <button className="newsimama-title-edit-button" onClick={() => { setTempTitle(currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`); setIsEditingTitle(true); }} aria-label="Rename your newspaper"><Pencil size={15} /></button>
          </div>
        )}
        <p>Your curious little corner of the world, gathered just for you.</p>
      </div>

      <div className="newsimama-header__status">
        <div className="newsimama-header__progress-label"><BookOpen size={15} /><span>{readStoriesCount} of {totalStoriesCount} stories explored</span><span className="newsimama-header__percent">{percentage}%</span></div>
        <div className="newsimama-header__progress"><span style={{ width: `${percentage}%` }} /></div>
        <div className="newsimama-header__feed-status"><span className={isLiveFeed ? 'newsimama-live-dot' : 'newsimama-idle-dot'} />{isRefreshing ? 'Checking publisher feeds…' : refreshedAt ? `Feeds checked ${refreshedAt}` : 'Checking feeds…'}</div>
      </div>

      {menuOpen && <div className="news-menu-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
        <aside className="news-menu" role="dialog" aria-modal="true" aria-label="Newsiemama menu">
          <div className="news-menu__header"><div><span className="news-menu__eyebrow">YOUR EDITION</span><h2>Little extras</h2></div><button onClick={() => setMenuOpen(false)} className="news-menu__close" aria-label="Close menu"><X size={19} /></button></div>
          <div className="news-menu__reader"><span className="news-menu__avatar">{currentProfile.name.slice(0,1).toUpperCase()}</span><div><strong>{currentProfile.name}</strong><small>{voiceLabels[currentProfile.voicePreset] || currentProfile.voicePreset} · {currentProfile.topics.length} interests</small></div><button onClick={() => closeAfter(onOpenProfiles)} aria-label="Switch reader"><ChevronRight size={18} /></button></div>
          <div className="news-menu__section"><span>READ & PLAY</span>
            {onToggleViewMode && menuButton(<Layers size={17} />, viewMode === 'broadsheet' ? 'Switch to Playcards' : 'Back to newspaper', () => onToggleViewMode(viewMode === 'broadsheet' ? 'playcard' : 'broadsheet'), 'Flip through stories one beat at a time', 'text-[#b4533c]')}
            {onOpenNewsQuest && menuButton(<Gamepad2 size={17} />, 'News Quest', onOpenNewsQuest, `${currentProfile.questProgress?.totalPoints || 0} learning points`, 'text-[#0284c7]')}
            {onOpenBusinessAgent && menuButton(<Sparkles size={17} />, 'Ask the news guide', onOpenBusinessAgent, 'Ask about a company, market, or headline')}
            {onOpenCareer && menuButton(<Briefcase size={17} />, 'Career & LinkedIn Hub', onOpenCareer, 'Discover field insights & open job roles', 'text-[#0a66c2]')}
          </div>
          <div className="news-menu__section"><span>MAKE IT YOURS</span>
            {menuButton(<SlidersHorizontal size={17} />, 'Edit my edition', onEditSetup, 'Name, age, interests and reading style', 'text-[#b4533c]')}
            {menuButton(<Mic size={17} />, 'Voice & narration', onOpenVoiceSettings, 'Choose how stories sound', 'text-[#7c66dc]')}
            {menuButton(<Users size={17} />, 'Switch reader', onOpenProfiles, 'Keep each reader’s edition separate', 'text-[#0284c7]')}
          </div>
          <div className="news-menu__section"><span>MORE</span>
            {onOpenRoadmap && menuButton(<Mail size={17} />, 'Morning email & integrations', onOpenRoadmap, 'See what is ready to connect')}
            {menuButton(<Gauge size={17} />, reducedMotion ? 'Turn on gentle motion' : 'Reduce animation', toggleReducedMotion, reducedMotion ? 'Current setting: reduced motion' : 'Current setting: full motion', 'text-[#0f766e]')}
            {menuButton(<Heart size={17} />, 'Support this project', onOpenSupporter, 'Optional supporter edition', 'text-[#b4533c]')}
          </div>
          <div className="news-menu__footer">
            <div className="news-menu__feed-note"><span className="newsimama-live-dot" />Live feeds from selected publishers. New articles are checked when you open the edition or tap refresh.</div>
            {!showResetConfirm ? <button className="news-menu__reset" onClick={() => setShowResetConfirm(true)}><RotateCcw size={14} /> Reset reader preferences</button> : <div className="news-menu__confirm"><span>Reset all reader settings?</span><button onClick={doReset}>Reset</button><button onClick={() => setShowResetConfirm(false)}>Keep them</button></div>}
          </div>
        </aside>
      </div>}
    </header>
  );
};
