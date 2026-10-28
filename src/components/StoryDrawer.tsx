import React, { useState, useEffect } from 'react';
import { Story, VoicePreset, StoryExplanation } from '../types';
import { useProfile } from '../context/ProfileContext';
import { toneEngine } from '../services/toneEngine';
import { X, ExternalLink, Sparkles, CheckCircle2, Bookmark, BookmarkCheck, Check } from 'lucide-react';

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

  // Generate explanation whenever activePreset or story changes
  useEffect(() => {
    if (!story) return;

    let isMounted = true;
    setIsLoading(true);

    toneEngine
      .explainStory(story, activePreset, currentProfile.customVoice)
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
  }, [story, activePreset, currentProfile.customVoice]);

  if (!story) return null;

  const isSaved = isArticleSaved(story.id);

  const handleSetAsDefault = () => {
    setVoicePreset(activePreset);
    setIsDefaultSavedNotice(true);
    setTimeout(() => setIsDefaultSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose}></div>

      {/* Slide-over Drawer Panel */}
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-drawer-slide border-l border-zinc-200">
        <div>
          {/* Drawer Top Navigation Bar */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-xs z-10 border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono-meta text-xs font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded-sm border border-red-200">
                {story.category}
              </span>
              <span className="text-xs text-zinc-500 font-medium">| {story.sourceName}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveArticle(story.id)}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 transition-colors rounded-lg cursor-pointer"
                title={isSaved ? 'Saved to reading list' : 'Save article'}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-red-700" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 transition-colors rounded-lg cursor-pointer"
                title="Close drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Story Title & Deck */}
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-snug mb-3">
              {story.title}
            </h2>
            <p className="font-serif-editorial italic text-base text-zinc-600 border-l-2 border-red-700 pl-3 mb-6">
              {story.deck}
            </p>

            {/* Voice Tone Selector Tabs */}
            <div className="space-y-2 mb-6">
              <div className="bg-zinc-100 p-1 rounded-xl flex items-center justify-between">
                {(['executive', 'conversational', 'storyteller'] as VoicePreset[]).map((preset) => {
                  const isActive = activePreset === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => setActivePreset(preset)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {preset === 'executive' && 'Executive'}
                      {preset === 'conversational' && 'Conversational'}
                      {preset === 'storyteller' && 'Storyteller'}
                    </button>
                  );
                })}
              </div>

              {/* Set as default voice option */}
              <div className="flex items-center justify-between px-1 text-xs">
                {activePreset !== currentProfile.voicePreset ? (
                  <button
                    onClick={handleSetAsDefault}
                    className="text-red-800 hover:text-red-950 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <span>Set {activePreset} as my default reading voice</span>
                  </button>
                ) : (
                  <span className="text-zinc-400 text-[11px] font-mono-meta">
                    Current default for {currentProfile.name.split(' ')[0]}
                  </span>
                )}

                {isDefaultSavedNotice && (
                  <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1 animate-paper-fade">
                    <Check className="w-3 h-3" />
                    <span>Saved as default!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Explanation Display Box */}
            <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-5 sm:p-6 mb-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-red-800">
                  <Sparkles className="w-4 h-4 text-red-700" />
                  <span>{currentProfile.name.split(' ')[0]}’s Explainer ({activePreset} mode)</span>
                </span>
                {explanation?.isCustomVoiced && (
                  <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full">
                    Custom Voiced
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="py-8 text-center text-sm text-zinc-500">
                  <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span>Synthesizing story in your voice...</span>
                </div>
              ) : explanation ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-zinc-900 mb-1">
                      {explanation.headline}
                    </h4>
                    <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-serif-editorial">
                      {explanation.coreSummary}
                    </p>
                  </div>

                  {/* Why it matters bullet points */}
                  {explanation.whyItMatters && explanation.whyItMatters.length > 0 && (
                    <div className="pt-3 border-t border-zinc-200/60">
                      <h5 className="text-xs font-mono-meta font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Key Takeaways
                      </h5>
                      <ul className="space-y-2">
                        {explanation.whyItMatters.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Real-world takeaway */}
                  {explanation.conversationalTakeaway && (
                    <div className="bg-white rounded-xl p-3.5 border border-zinc-200 text-xs sm:text-sm text-zinc-800 leading-relaxed">
                      <strong className="text-red-900 font-semibold block mb-0.5">Bottom line:</strong>
                      {explanation.conversationalTakeaway}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Original Excerpt Section */}
            <div className="border-t border-zinc-200 pt-5">
              <h4 className="font-mono-meta text-xs uppercase font-bold text-zinc-500 mb-2">
                Original Publisher Excerpt
              </h4>
              <p className="font-serif-editorial text-sm text-zinc-600 leading-relaxed mb-4">
                {story.content}
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer with External Link */}
        <div className="sticky bottom-0 bg-white border-t border-zinc-200 p-6 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Source: <strong className="text-zinc-800">{story.sourceName}</strong>
          </div>

          <a
            href={story.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <span>Read full story on {story.sourceName}</span>
            <ExternalLink className="w-4 h-4 text-zinc-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
