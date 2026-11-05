import React, { useState, useEffect } from 'react';
import { Story, VoicePreset, StoryExplanation } from '../types';
import { useProfile } from '../context/ProfileContext';
import { toneEngine } from '../services/toneEngine';
import { VisualExplainer } from './VisualExplainer';
import { ReadAloudPlayer } from './ReadAloudPlayer';
import { EditorialCompanion } from './EditorialCompanion';
import {
  X,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Check,
  BookOpen,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Clock,
  Layers,
  Lightbulb,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Info,
  Radio,
  FileText,
  Volume2
} from 'lucide-react';
import { FINANCE_SUBCATEGORY_LABELS } from '../services/feedService';
import { StoryIllustration } from './StoryIllustration';

interface StoryDrawerProps {
  story: Story | null;
  onClose: () => void;
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({ story, onClose }) => {
  const {
    currentProfile,
    toggleSaveArticle,
    isArticleSaved,
    setVoicePreset,
    markArticleAsRead,
    toggleStoryFeedback,
    getStoryFeedback,
  } = useProfile();

  const [activePreset, setActivePreset] = useState<VoicePreset>(currentProfile.voicePreset);
  const [explanation, setExplanation] = useState<StoryExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefaultSavedNotice, setIsDefaultSavedNotice] = useState(false);
  const [isEasyReadingMode, setIsEasyReadingMode] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Mark article as read whenever opened
  useEffect(() => {
    if (story) {
      markArticleAsRead(story.id);
    }
  }, [story]);

  // Sync preset when story or profile changes
  useEffect(() => {
    setActivePreset(currentProfile.voicePreset);
  }, [currentProfile.voicePreset, story]);

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (story) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [story, onClose]);

  // Generate explanation whenever activePreset, ageRange, or story changes
  useEffect(() => {
    if (!story) return;

    let isMounted = true;
    setIsLoading(true);

    toneEngine
      .explainStory(story, activePreset, currentProfile.customVoice, currentProfile.ageRange)
      .then((res) => {
        if (isMounted) {
          setExplanation(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error generating explanation:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [story, activePreset, currentProfile.customVoice, currentProfile.ageRange]);

  if (!story) return null;

  const isSaved = isArticleSaved(story.id);
  const feedback = getStoryFeedback(story.id);
  const isVibe = currentProfile.slangLevel === 'vibe';

  const handleSetAsDefault = () => {
    setVoicePreset(activePreset);
    setIsDefaultSavedNotice(true);
    setTimeout(() => setIsDefaultSavedNotice(false), 2000);
  };

  const handleFeedback = (type: 'more' | 'less') => {
    toggleStoryFeedback(story.id, type);
    const msg = type === 'more' 
      ? "Got it! We'll prioritize stories like this in your edition." 
      : "Understood. We'll downrank stories like this in future editions.";
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Compile narrative text for read aloud
  const textForReadAloud = isEasyReadingMode && explanation?.easyReadingText
    ? `${story.title}. In plain words: ${explanation.easyReadingText}`
    : explanation
    ? `${story.title}. What happened: ${explanation.whatHappened}. Why it matters: ${explanation.whyItMatters.join(' ')}. What could happen next: ${explanation.whatCouldHappenNext}. Everyday analogy: ${explanation.everydayAnalogy}.`
    : `${story.title}. ${story.deck}. ${story.content}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#181513]/40 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} aria-label="Close backdrop"></div>

      {/* Slide-over Drawer Panel */}
      <div className="w-full max-w-2xl bg-[#faf7f2] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-drawer-slide border-l border-[#e4dcd3]">
        <div>
          {/* Drawer Top Navigation Bar */}
          <div className="sticky top-0 bg-[#faf7f2]/95 backdrop-blur-md z-10 border-b border-[#e4dcd3] px-6 py-4 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-meta text-xs font-bold uppercase tracking-wider text-[#e25c50] bg-[#fbeae5] px-2.5 py-0.5 rounded-full border border-[#f3c8bc]">
                {story.category === 'sports_culture' ? 'Culture' : story.category}
              </span>
              {story.financeSubcategory && (
                <span className="text-[10px] font-mono-meta text-[#8f887d] bg-[#ffffff] px-2 py-0.5 rounded-full border border-[#e4dcd3]">
                  {FINANCE_SUBCATEGORY_LABELS[story.financeSubcategory] || story.financeSubcategory}
                </span>
              )}
              <span className="text-xs text-[#6e685f] font-medium">| {story.sourceName}</span>
              <span className="text-xs text-[#8f887d]">• {story.timeAgo}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                className={`p-2 rounded-xl transition-colors ${
                  showAudioPlayer
                    ? 'bg-[#e25c50] text-[#ffffff]'
                    : 'text-[#6e685f] hover:text-[#181513] hover:bg-[#ede5dc]'
                }`}
                title="Toggle Read Aloud Audio Player"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => toggleSaveArticle(story.id)}
                className="p-2 text-[#6e685f] hover:text-[#181513] hover:bg-[#ede5dc] transition-colors rounded-xl cursor-pointer"
                title={isSaved ? 'Saved to reading list' : 'Save article for later'}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-[#e25c50]" /> : <Bookmark className="w-5 h-5" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 text-[#6e685f] hover:text-[#181513] hover:bg-[#ede5dc] transition-colors rounded-xl cursor-pointer"
                title="Close drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div key={story.id} className="p-6 sm:p-8 space-y-6 news-story-reveal">
            {/* Embedded Read Aloud Audio Player (when opened) */}
            {showAudioPlayer && (
              <ReadAloudPlayer
                title={story.title}
                textToRead={textForReadAloud}
                onClose={() => setShowAudioPlayer(false)}
              />
            )}

            {/* Why This Story is in Your Edition (Personalization Transparency) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e3ece5] text-[#3e5f49] border border-[#c1d6c7]">
                <Sparkles className="w-3.5 h-3.5 text-[#3e5f49]" />
                <span>{story.curatedReason || `Because you follow ${story.category}`}</span>
              </span>

              {/* Source Mode Trust Indicator */}
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2d6a4f] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full border border-[#c8e6c9]">
                <Radio className="w-3 h-3 text-[#2d6a4f] animate-pulse" />
                <span>Live Publisher Feed</span>
              </span>

              {explanation?.isAiConnected ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7c66dc] bg-[#eee8f8] px-2.5 py-0.5 rounded-full border border-[#d8cff5]">
                  <Sparkles className="w-3 h-3 text-[#7c66dc]" />
                  <span>Gemini AI Synthesized</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6e685f] bg-[#f0eae1] px-2.5 py-0.5 rounded-full border border-[#e4dcd3]">
                  <span>Factual Direct Extraction</span>
                </span>
              )}
            </div>

            {/* Editorial Companion ("Pip") Commentary */}
            {currentProfile.companionEnabled !== false && (
              <EditorialCompanion
                mood="thoughtful"
                category={story.category}
                slangLevel={currentProfile.slangLevel}
              />
            )}

            {/* Story Title & Deck */}
            <div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-[#181513] leading-snug mb-3">
                {story.title}
              </h2>

              {isVibe && story.vibeSummary ? (
                <div className="bg-[#fbeae5]/70 border-l-4 border-[#e25c50] pl-4 py-2.5 my-3 rounded-r-xl">
                  <span className="text-[11px] font-mono-meta font-bold uppercase tracking-wider text-[#9b2c48] block mb-1">
                    ⚡ The Vibe Check
                  </span>
                  <p className="text-sm font-sans text-[#181513] font-medium">
                    {story.vibeSummary}
                  </p>
                </div>
              ) : (
                <p className="font-serif-editorial italic text-base text-[#5c5449] border-l-3 border-[#e25c50] pl-3.5 mb-4 bg-[#faf7f2] py-1.5 rounded-r-lg">
                  {story.deck}
                </p>
              )}

              {/* On-Demand AI Editorial Illustration */}
              <StoryIllustration story={story} layout="drawer" />
            </div>

            {/* Voice Tuning & Reading Mode Controls */}
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#e4dcd3] space-y-3 shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-meta uppercase tracking-wider text-[#6e685f] font-bold">
                    Explanation Style
                  </span>
                  {activePreset !== currentProfile.voicePreset ? (
                    <button
                      onClick={handleSetAsDefault}
                      className="text-xs font-semibold text-[#e25c50] hover:text-[#cf4b3f] cursor-pointer flex items-center gap-1"
                    >
                      <span>Set as my default</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#8f887d] font-mono-meta">
                      Default for {currentProfile.name.split(' ')[0]}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-[#faf7f2] p-1 rounded-xl border border-[#e4dcd3]">
                  {(['executive', 'conversational', 'storyteller'] as VoicePreset[]).map((preset) => {
                    const isActive = activePreset === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => setActivePreset(preset)}
                        className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#ffffff] text-[#181513] shadow-xs font-bold border border-[#d8ccc0]'
                            : 'text-[#6e685f] hover:text-[#181513]'
                        }`}
                      >
                        {preset === 'executive' && 'Quick Brief'}
                        {preset === 'conversational' && 'Friendly'}
                        {preset === 'storyteller' && 'Storyteller'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode Toggle: Standard vs Easy-Reading */}
              <div className="pt-2 border-t border-[#f0eae1] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#4e6c58]" />
                  <span className="text-xs font-medium text-[#181513]">
                    Easy-Reading Mode
                  </span>
                </div>

                <button
                  onClick={() => setIsEasyReadingMode(!isEasyReadingMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isEasyReadingMode ? 'bg-[#4e6c58]' : 'bg-[#cbbfb0]'
                  }`}
                  role="switch"
                  aria-checked={isEasyReadingMode}
                  title="Toggle easy-reading mode with plain language and simplified sections"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEasyReadingMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {isDefaultSavedNotice && (
                <div className="text-center py-1">
                  <span className="text-[#3e5f49] font-semibold text-xs inline-flex items-center gap-1 animate-paper-fade bg-[#e3ece5] px-2.5 py-0.5 rounded-full border border-[#c1d6c7]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved {activePreset} as default voice for {currentProfile.name.split(' ')[0]}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Main Guided Narrative Container */}
            <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-3xl p-6 sm:p-7 shadow-xs transition-all space-y-6">
              {/* Header Badge & Age Range Note */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0eae1] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#fbeae5] text-[#e25c50] flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-sm text-[#181513]">
                      {currentProfile.name.split(' ')[0]}’s Storytelling Narrative
                    </h3>
                    <p className="text-[11px] text-[#8f887d]">
                      {isEasyReadingMode ? 'Plain language & short sections active' : `${activePreset} storytelling format`}
                    </p>
                  </div>
                </div>

                {explanation?.ageAdaptedNote && (
                  <span className="text-[11px] bg-[#e3ece5] text-[#3e5f49] font-medium px-2.5 py-1 rounded-full border border-[#c1d6c7] self-start sm:self-auto">
                    {explanation.ageAdaptedNote}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-sm text-[#6e685f]">
                  <div className="w-7 h-7 border-2 border-[#e25c50] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <span className="font-serif-editorial italic">Synthesizing narrative for {currentProfile.name.split(' ')[0]}...</span>
                </div>
              ) : explanation ? (
                <div className="space-y-6">
                  {/* Headline & Core Summary */}
                  <div>
                    <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#181513] mb-2 leading-snug">
                      {explanation.headline}
                    </h4>
                    <p className="text-sm sm:text-base text-[#4a4237] leading-relaxed font-serif-editorial">
                      {explanation.coreSummary}
                    </p>
                  </div>

                  {/* Easy-Reading Mode Callout (when active) */}
                  {isEasyReadingMode && (
                    <div className="bg-[#faf7f2] border-l-4 border-[#4e6c58] p-4 rounded-r-xl">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3e5f49] mb-1 font-mono-meta">
                        <BookOpen className="w-4 h-4" />
                        <span>In Plain, Everyday Words</span>
                      </div>
                      <p className="text-sm text-[#2d2822] leading-relaxed font-medium">
                        {explanation.easyReadingText}
                      </p>
                    </div>
                  )}

                  {/* 1. What Happened? (Explicitly Marked as Reporting) */}
                  <div className="bg-[#faf7f2] p-4.5 rounded-2xl border border-[#ede5dc] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e25c50] font-mono-meta">
                        <HelpCircle className="w-4 h-4" />
                        <span>1. What happened?</span>
                      </div>
                      <span className="text-[10px] font-mono-meta uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#e3ece5] text-[#3e5f49] font-bold">
                        Reported Facts
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#38322a] leading-relaxed font-serif-editorial">
                      {explanation.whatHappened}
                    </p>
                  </div>

                  {/* 2. Why It Matters To You */}
                  {explanation.whyItMatters && explanation.whyItMatters.length > 0 && (
                    <div className="bg-[#faf7f2] p-4.5 rounded-2xl border border-[#ede5dc] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4e6c58] font-mono-meta">
                        <TrendingUp className="w-4 h-4" />
                        <span>2. Why it matters to you</span>
                      </div>
                      <ul className="space-y-2">
                        {explanation.whyItMatters.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#38322a]">
                            <CheckCircle2 className="w-4 h-4 text-[#4e6c58] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 3. What Might Happen Next? (Explicitly Marked as Analysis) */}
                  <div className="bg-[#faf7f2] p-4.5 rounded-2xl border border-[#ede5dc] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7c5e3f] font-mono-meta">
                        <ArrowRight className="w-4 h-4" />
                        <span>3. What might happen next?</span>
                      </div>
                      <span className="text-[10px] font-mono-meta uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#fbeae5] text-[#9b2c48] font-bold">
                        Forward Analysis
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#38322a] leading-relaxed font-serif-editorial">
                      {explanation.whatCouldHappenNext}
                    </p>

                    {/* Trust and Prediction Guard Disclaimer */}
                    <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-xl p-2.5 text-[11px] text-[#5c5449] flex items-center gap-2 mt-2">
                      <Info className="w-3.5 h-3.5 shrink-0 text-[#e25c50]" />
                      <span>
                        <strong>Analysis Notice:</strong> Scenarios are analytical forward outlooks based on current reporting. They are not guaranteed outcomes or financial advice.
                      </span>
                    </div>
                  </div>

                  {/* 4. Simple Everyday Example or Analogy */}
                  <div className="bg-[#ffffff] p-4.5 rounded-2xl border-2 border-dashed border-[#e4dcd3]">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e25c50] mb-1.5 font-mono-meta">
                      <Lightbulb className="w-4 h-4" />
                      <span>Everyday Analogy</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#2d2720] leading-relaxed italic font-serif-editorial">
                      "{explanation.everydayAnalogy}"
                    </p>
                  </div>

                  {/* Visual Explainer (Timeline, Steps, Comparison, Map, or Chart) */}
                  {explanation.visualExplainer && (
                    <VisualExplainer explainer={explanation.visualExplainer} />
                  )}

                  {/* Bottom Line Takeaway */}
                  {explanation.conversationalTakeaway && (
                    <div className="bg-[#fbeae5]/50 rounded-2xl p-4 border border-[#f3c8bc] text-xs sm:text-sm text-[#2d2720] leading-relaxed">
                      <strong className="text-[#9b2c48] font-bold block mb-1 uppercase tracking-wider text-[11px] font-mono-meta">
                        Takeaway:
                      </strong>
                      {explanation.conversationalTakeaway}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Shape the Edition: More like this / Less like this */}
            <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-2xl p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#181513] block">
                    Shape your future editions:
                  </span>
                  <span className="text-[11px] text-[#6e685f]">
                    Help Newsiemama understand which topics matter most to you.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback('more')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      feedback === 'more'
                        ? 'bg-[#4e6c58] text-[#ffffff] border-[#4e6c58]'
                        : 'bg-[#ffffff] text-[#4e6c58] border-[#c1d6c7] hover:bg-[#e3ece5]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>More like this</span>
                  </button>

                  <button
                    onClick={() => handleFeedback('less')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      feedback === 'less'
                        ? 'bg-[#e25c50] text-[#ffffff] border-[#e25c50]'
                        : 'bg-[#ffffff] text-[#e25c50] border-[#f3c8bc] hover:bg-[#fbeae5]'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Less like this</span>
                  </button>
                </div>
              </div>

              {feedbackNotice && (
                <div className="mt-2 text-center text-xs font-medium text-[#3e5f49] bg-[#e3ece5] p-2 rounded-lg border border-[#c1d6c7] animate-paper-fade">
                  {feedbackNotice}
                </div>
              )}
            </div>

            {/* Original Excerpt Section */}
            <div className="border-t border-[#e4dcd3] pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-[#8f887d]" />
                <h4 className="font-mono-meta text-xs uppercase font-bold text-[#6e685f]">
                  Original Publisher Excerpt
                </h4>
              </div>
              <p className="font-serif-editorial text-xs sm:text-sm text-[#5c5449] leading-relaxed mb-3">
                {story.content}
              </p>
            </div>

            {/* Accuracy & Grounding Transparency Note */}
            <div className="bg-[#e3ece5] border border-[#c1d6c7] rounded-xl p-3 text-[11px] text-[#3e5f49] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#4e6c58]" />
              <div className="space-y-1">
                <p className="leading-relaxed">
                  <strong>Live Syndication Transparency:</strong> Synthesized directly from <strong>{story.sourceName}</strong>’s official public feed ({story.timeAgo}). Excerpts and titles reflect live publisher dispatches without altering reported facts.
                </p>
                {explanation?.aiNotice && (
                  <p className="text-[10px] text-[#426b4e] border-t border-[#c1d6c7] pt-1.5 font-mono-meta">
                    ℹ️ {explanation.aiNotice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer with External Link */}
        <div className="sticky bottom-0 bg-[#faf7f2] border-t border-[#e4dcd3] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6e685f] text-center sm:text-left">
            Source: <strong className="text-[#181513]">{story.sourceName}</strong> • {story.readingMinutes} min read
          </div>

          <a
            href={story.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#181513] hover:bg-[#342f2b] text-[#ffffff] text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>{story.sourceMode === 'rss' ? `Read full article on ${story.sourceName}` : `Visit ${story.sourceName}`}</span>
            <ExternalLink className="w-4 h-4 text-[#cfc8bd]" />
          </a>
        </div>
      </div>
    </div>
  );
};

