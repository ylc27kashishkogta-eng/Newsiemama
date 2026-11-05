import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { VoicePreset } from '../types';
import { voiceAnalyzer } from '../services/voiceAnalyzer';
import { X, Sparkles, Check } from 'lucide-react';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentProfile, setVoicePreset, saveCustomVoice } = useProfile();
  const [activeTab, setActiveTab] = useState<'presets' | 'teach' | 'byok'>('presets');
  const [sampleText, setSampleText] = useState(currentProfile.customVoice?.rawSample || '');
  const [analyzedMarkers, setAnalyzedMarkers] = useState(currentProfile.customVoice || null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('curio_byok_api_key') || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAnalyzeAndSave = () => {
    const profile = voiceAnalyzer.analyzeWritingSample(sampleText);
    setAnalyzedMarkers(profile);
    saveCustomVoice(profile);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('curio_byok_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('curio_byok_api_key');
    }
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#e4dcd3] animate-paper-fade">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4dcd3] mb-5">
          <div>
            <h3 className="font-masthead text-lg font-bold text-[#1e1b18]">Personalize Reading Voice</h3>
            <p className="text-xs text-[#6e685f] font-serif-editorial">
              Configure how news stories are explained for {currentProfile.name}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#8f887d] hover:text-[#1e1b18] cursor-pointer" title="Close (Esc)">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-[#ede5dc] p-1 rounded-xl flex items-center gap-1 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'presets' ? 'bg-[#ffffff] text-[#1e1b18] shadow-xs' : 'text-[#6e685f] hover:text-[#1e1b18]'
            }`}
          >
            Voice Presets
          </button>
          <button
            onClick={() => setActiveTab('teach')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'teach' ? 'bg-[#ffffff] text-[#1e1b18] shadow-xs' : 'text-[#6e685f] hover:text-[#1e1b18]'
            }`}
          >
            Teach My Voice (Sample)
          </button>
          <button
            onClick={() => setActiveTab('byok')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'byok' ? 'bg-[#ffffff] text-[#1e1b18] shadow-xs' : 'text-[#6e685f] hover:text-[#1e1b18]'
            }`}
          >
            Optional AI API Key
          </button>
        </div>

        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            {[
              {
                id: 'executive' as VoicePreset,
                title: 'Quick Brief (Executive)',
                desc: 'Dense bullet points, bottom-line financial & regulatory impact, zero fluff.',
                example: '“RBI holds repo rate at 6.5%. Core inflation at 3.8% expands corporate borrowing room.”',
              },
              {
                id: 'conversational' as VoicePreset,
                title: 'Friendly Explainer (Conversational)',
                desc: 'Warm, approachable, uses relatable everyday analogies.',
                example: '“Think of this like cruise control on a highway — no dramatic lane shifts, just steady cruising ahead.”',
              },
              {
                id: 'storyteller' as VoicePreset,
                title: 'Storyteller',
                desc: 'Narrative journalism, setting the scene, unfolding context and human angle.',
                example: '“Behind the closed doors on Mumbai’s Mint Road, months of inflation anxiety gave way to quiet confidence.”',
              },
            ].map((p) => {
              const isSelected = currentProfile.voicePreset === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setVoicePreset(p.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#b9533f] bg-[#fbf0ec] shadow-xs ring-1 ring-[#b9533f]'
                      : 'border-[#e4dcd3] bg-white hover:border-[#cbbfb0] hover:bg-[#f7f2eb]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#1e1b18]">{p.title}</span>
                    {isSelected && <span className="text-xs font-bold text-[#b9533f]">Active</span>}
                  </div>
                  <p className="text-xs text-[#5c5449] mb-2">{p.desc}</p>
                  <div className="bg-[#faf6f0] p-2 rounded-lg border border-[#e4dcd3] font-serif-editorial italic text-xs text-[#6e685f]">
                    {p.example}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: TEACH MY VOICE */}
        {activeTab === 'teach' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#5c5449] leading-relaxed mb-3">
                Paste 1–2 paragraphs (~100 words) of an email, memo, or note you wrote. Newsiemama will analyze your sentence cadence, brevity, and tone markers to adapt story explanations to your natural communication style.
              </p>
              <textarea
                rows={4}
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder="Paste a writing sample that sounds like you..."
                className="w-full p-3 text-xs bg-white border border-[#cbbfb0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#b9533f] font-sans"
              />
            </div>

            <button
              onClick={handleAnalyzeAndSave}
              disabled={!sampleText.trim()}
              className="w-full py-2.5 px-4 bg-[#b9533f] hover:bg-[#963f2e] text-[#faf7f2] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#fcdcd4]" />
              <span>Analyze & Save Voice Profile</span>
            </button>

            {analyzedMarkers && (
              <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-xl p-3.5 text-xs space-y-1.5">
                <div className="font-semibold text-[#1e1b18]">Extracted Style Profile:</div>
                <div className="grid grid-cols-2 gap-2 text-[#5c5449]">
                  <div>Formality: <strong className="capitalize text-[#1e1b18]">{analyzedMarkers.formality}</strong></div>
                  <div>Pacing: <strong className="capitalize text-[#1e1b18]">{analyzedMarkers.brevity}</strong></div>
                  <div>Real-world Analogies: <strong className="text-[#1e1b18]">{analyzedMarkers.useAnalogies ? 'Enabled' : 'Off'}</strong></div>
                  <div>Bulleted Takeaways: <strong className="text-[#1e1b18]">{analyzedMarkers.bulletPreference ? 'Preferred' : 'Prose'}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BYOK */}
        {activeTab === 'byok' && (
          <div className="space-y-4 text-xs text-[#5c5449]">
            <div className="bg-[#fbf4eb] border border-[#edd8be] rounded-xl p-3 text-[#7a481c] leading-relaxed">
              <strong>100% Optional:</strong> Newsiemama runs completely without an API key using our built-in tone engine. If you want to experiment with live streaming LLM calls, you can paste your own Gemini or OpenAI key below. It is stored exclusively in your browser’s LocalStorage.
            </div>

            <div>
              <label className="block font-semibold text-[#1e1b18] mb-1">
                Gemini or OpenAI API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... or sk-proj-..."
                  className="flex-1 p-2.5 text-xs bg-white border border-[#cbbfb0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#b9533f]"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2.5 bg-[#1e1b18] text-[#faf7f2] font-semibold rounded-xl hover:bg-[#342f2b] transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isSavedNotice && (
          <div className="mt-4 p-2 bg-[#edf2ee] text-[#3b5744] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-[#cbe0d0] animate-paper-fade">
            <Check className="w-3.5 h-3.5 text-[#4e6c58]" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};


