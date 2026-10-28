import React, { useState, useEffect } from 'react';
import { Story, VoicePreset, StoryExplanation } from '../types';
import { useProfile } from '../context/ProfileContext';
import { toneEngine } from '../services/toneEngine';
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
  ShieldCheck
} from 'lucide-react';

interface StoryDrawerProps {
  story: Story | null;
  onClose: () => void;
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({ story, onClose }) => {
  const { currentProfile, toggleSaveArticle, isArticleSaved, setVoicePreset } = useProfile();
  const [activePreset, setActivePreset] = useState<VoicePreset>(currentProfile.voicePreset);
  const [explanation, setExplanation] = useState<StoryExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefaultSavedNotice, setIsDefaultSavedNotice] = useState(false);
  const [isEasyReadingMode, setIsEasyReadingMode] = useState(false);

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

  const handleSetAsDefault = () => {
    setVoicePreset(activePreset);
    setIsDefaultSavedNotice(true);
    setTimeout(() => setIsDefaultSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} aria-label="Close backdrop"></div>

      {/* Slide-over Drawer Panel */}
      <div className="w-full max-w-2xl bg-[#faf7f2] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-drawer-slide border-l border-[#e4dcd3]">
        <div>
          {/* Drawer Top Navigation Bar */}
          <div className="sticky top-0 bg-[#faf7f2]/95 backdrop-blur-md z-10 border-b border-[#e4dcd3] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono-meta text-xs font-bold uppercase tracking-wider text-[#b9533f] bg-[#f5e6e1] px-2.5 py-0.5 rounded-full border border-[#e8cecb]">
                {story.category}
              </span>
              <span className="text-xs text-[#6e685f] font-medium">| {story.sourceName}</span>
              <span className="text-xs text-[#8f887d]">• {story.timeAgo}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveArticle(story.id)}
                className="p-2 text-[#6e685f] hover:text-[#1e1b18] hover:bg-[#ede5dc] transition-colors rounded-lg cursor-pointer"
                title={isSaved ? 'Saved to reading list' : 'Save article'}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-[#b9533f]" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#6e685f] hover:text-[#1e1b18] hover:bg-[#ede5dc] transition-colors rounded-lg cursor-pointer"
                title="Close drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Story Title & Deck */}
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-[#1e1b18] leading-snug mb-3">
              {story.title}
            </h2>
            <p className="font-serif-editorial italic text-base text-[#5c5449] border-l-3 border-[#b9533f] pl-3.5 mb-6 bg-[#fbf5ee] py-1 rounded-r-lg">
              {story.deck}
            </p>

            {/* Reading Mode Selector & Tone Switcher */}
            <div className="bg-[#f0e8df] p-3 rounded-2xl mb-6 border border-[#e2d7cc] space-y-3">
              {/* Tone selection buttons */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-xs font-mono-meta uppercase tracking-wider text-[#6e685f] font-bold">
                    Explanation Voice
                  </span>
                  {activePreset !== currentProfile.voicePreset ? (
                    <button
                      onClick={handleSetAsDefault}
                      className="text-xs font-semibold text-[#b9533f] hover:text-[#963f2e] cursor-pointer flex items-center gap-1"
                    >
                      <span>Set as default</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#8f887d] font-mono-meta">
                      Default for {currentProfile.name.split(' ')[0]}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-[#e5dbd0] p-1 rounded-xl">
                  {(['executive', 'conversational', 'storyteller'] as VoicePreset[]).map((preset) => {
                    const isActive = activePreset === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => setActivePreset(preset)}
                        className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#faf7f2] text-[#1e1b18] shadow-xs font-bold'
                            : 'text-[#6e685f] hover:text-[#1e1b18]'
                        }`}
                      >
                        {preset === 'executive' && 'Quick Brief'}
                        {preset === 'conversational' && 'Friendly Explainer'}
                        {preset === 'storyteller' && 'Storyteller'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode Toggle: Standard vs Easy-Reading */}
              <div className="pt-2 border-t border-[#dfd3c5] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#4e6c58]" />
                  <span className="text-xs font-medium text-[#1e1b18]">
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
                  <span className="text-[#3b5744] font-semibold text-xs inline-flex items-center gap-1 animate-paper-fade bg-[#edf2ee] px-2.5 py-0.5 rounded-full border border-[#cbe0d0]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved {activePreset} as default voice for {currentProfile.name.split(' ')[0]}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Main Guided Narrative Container */}
            <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-2xl p-6 sm:p-7 shadow-xs mb-6 transition-all">
              {/* Header Badge & Age Range Note */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#ece4dc] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#fbf0ec] text-[#b9533f] flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-sm text-[#1e1b18]">
                      {currentProfile.name.split(' ')[0]}’s Guided Narrative
                    </h3>
                    <p className="text-[11px] text-[#8f887d]">
                      {isEasyReadingMode ? 'Plain language & short sections active' : `${activePreset} storytelling format`}
                    </p>
                  </div>
                </div>

                {explanation?.ageAdaptedNote && (
                  <span className="text-[11px] bg-[#edf2ee] text-[#3b5744] font-medium px-2.5 py-1 rounded-full border border-[#cbe0d0] self-start sm:self-auto">
                    {explanation.ageAdaptedNote}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-sm text-[#6e685f]">
                  <div className="w-7 h-7 border-2 border-[#b9533f] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <span className="font-serif-editorial italic">Synthesizing narrative for {currentProfile.name.split(' ')[0]}...</span>
                </div>
              ) : explanation ? (
                <div className="space-y-6">
                  {/* Headline & Core Summary */}
                  <div>
                    <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#1e1b18] mb-2 leading-snug">
                      {explanation.headline}
                    </h4>
                    <p className="text-sm sm:text-base text-[#4a4237] leading-relaxed font-serif-editorial">
                      {explanation.coreSummary}
                    </p>
                  </div>

                  {/* Easy-Reading Mode Callout (when active) */}
                  {isEasyReadingMode && (
                    <div className="bg-[#fcf8f3] border-l-4 border-[#4e6c58] p-4 rounded-r-xl">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3b5744] mb-1 font-mono-meta">
                        <BookOpen className="w-4 h-4" />
                        <span>In Plain, Everyday Words</span>
                      </div>
                      <p className="text-sm text-[#2d2822] leading-relaxed font-medium">
                        {explanation.easyReadingText}
                      </p>
                    </div>
                  )}

                  {/* 1. What Happened? */}
                  <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ede5dc]">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b9533f] mb-1.5 font-mono-meta">
                      <HelpCircle className="w-4 h-4" />
                      <span>1. What Happened?</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#38322a] leading-relaxed font-serif-editorial">
                      {explanation.whatHappened}
                    </p>
                  </div>

                  {/* 2. Why Does It Matter? */}
                  {explanation.whyItMatters && explanation.whyItMatters.length > 0 && (
                    <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ede5dc]">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4e6c58] mb-2 font-mono-meta">
                        <TrendingUp className="w-4 h-4" />
                        <span>2. Why Does It Matter?</span>
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

                  {/* 3. What Could Happen Next? */}
                  <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ede5dc]">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7c5e3f] mb-1.5 font-mono-meta">
                      <ArrowRight className="w-4 h-4" />
                      <span>3. What Could Happen Next?</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#38322a] leading-relaxed font-serif-editorial">
                      {explanation.whatCouldHappenNext}
                    </p>
                  </div>

                  {/* 4. Simple Everyday Example or Analogy */}
                  <div className="bg-[#fffdfa] p-4 rounded-xl border-2 border-dashed border-[#e4d5c5]">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b9533f] mb-1.5 font-mono-meta">
                      <Lightbulb className="w-4 h-4 text-[#c76550]" />
                      <span>Everyday Analogy</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#2d2720] leading-relaxed italic font-serif-editorial">
                      "{explanation.everydayAnalogy}"
                    </p>
                  </div>

                  {/* Optional Visual Explainer Card (Steps, Timeline, Comparison) */}
                  {explanation.visualExplainer && (
                    <div className="bg-[#faf6f0] border border-[#e2d5c7] rounded-xl p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-[#4e6c58]" />
                        <h5 className="font-serif-editorial font-bold text-sm sm:text-base text-[#1e1b18]">
                          {explanation.visualExplainer.title}
                        </h5>
                      </div>
                      {explanation.visualExplainer.subtitle && (
                        <p className="text-xs text-[#6e685f] mb-4">
                          {explanation.visualExplainer.subtitle}
                        </p>
                      )}

                      {/* Render Visual Items */}
                      <div className="space-y-2.5">
                        {explanation.visualExplainer.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border transition-all ${
                              item.highlight
                                ? 'bg-[#ffffff] border-[#b9533f]/40 shadow-xs ring-1 ring-[#b9533f]/20'
                                : 'bg-[#f7f2eb] border-[#e2d7cc]'
                            }`}
                          >
                            <div className="flex items-baseline justify-between mb-1">
                              <span
                                className={`text-[11px] font-mono-meta font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                                  item.highlight
                                    ? 'bg-[#f5e6e1] text-[#963f2e]'
                                    : 'bg-[#ede5dc] text-[#5c5449]'
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.subtext && (
                                <span className="text-[10px] text-[#8f887d] font-mono-meta">
                                  {item.subtext}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-[#2d2720] font-medium leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Line / Conversational Takeaway */}
                  {explanation.conversationalTakeaway && (
                    <div className="bg-[#fbf4eb] rounded-xl p-4 border border-[#e8dacb] text-xs sm:text-sm text-[#2d2720] leading-relaxed">
                      <strong className="text-[#963f2e] font-bold block mb-1 uppercase tracking-wider text-[11px] font-mono-meta">
                        Bottom Line:
                      </strong>
                      {explanation.conversationalTakeaway}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Original Excerpt Section */}
            <div className="border-t border-[#e4dcd3] pt-5 mb-4">
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
            <div className="bg-[#edf2ee] border border-[#cbe0d0] rounded-xl p-3 text-[11px] text-[#3b5744] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#4e6c58]" />
              <p className="leading-relaxed">
                <strong>Reporting Transparency:</strong> Curio Dispatch guided explanations are synthesized strictly from verified facts reported by <strong>{story.sourceName}</strong> ({story.timeAgo}). No simulated facts or external speculation are added.
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer with External Link */}
        <div className="sticky bottom-0 bg-[#faf7f2] border-t border-[#e4dcd3] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6e685f] text-center sm:text-left">
            Source: <strong className="text-[#1e1b18]">{story.sourceName}</strong> • {story.readingMinutes} min read
          </div>

          <a
            href={story.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e1b18] hover:bg-[#342f2b] text-[#faf7f2] text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Read full story on {story.sourceName}</span>
            <ExternalLink className="w-4 h-4 text-[#cfc8bd]" />
          </a>
        </div>
      </div>
    </div>
  );
};
