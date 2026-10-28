import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { VoicePreset } from '../types';
import { voiceAnalyzer } from '../services/voiceAnalyzer';
import { X, Sparkles, Check, KeyRound } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-5">
          <div>
            <h3 className="font-masthead text-lg font-bold text-zinc-900">Personalize Reading Voice</h3>
            <p className="text-xs text-zinc-500 font-serif-editorial">
              Configure how news stories are explained for {currentProfile.name}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-zinc-100 p-1 rounded-xl flex items-center gap-1 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'presets' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Voice Presets
          </button>
          <button
            onClick={() => setActiveTab('teach')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'teach' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Teach My Voice (Sample)
          </button>
          <button
            onClick={() => setActiveTab('byok')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'byok' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
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
                title: 'Executive Brief',
                desc: 'Dense bullet points, bottom-line financial & regulatory impact, zero fluff.',
                example: '“RBI holds repo rate at 6.5%. Core inflation at 3.8% expands corporate borrowing room.”',
              },
              {
                id: 'conversational' as VoicePreset,
                title: 'Conversational Explainer',
                desc: 'Friendly, jargon-free, uses approachable everyday analogies.',
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
                      ? 'border-red-800 bg-red-50/50 shadow-xs ring-1 ring-red-800'
                      : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-zinc-900">{p.title}</span>
                    {isSelected && <span className="text-xs font-bold text-red-800">Active</span>}
                  </div>
                  <p className="text-xs text-zinc-600 mb-2">{p.desc}</p>
                  <div className="bg-white/80 p-2 rounded-lg border border-zinc-200/60 font-serif-editorial italic text-xs text-zinc-600">
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
              <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                Paste 1–2 paragraphs (~100 words) of an email, memo, or note you wrote. Curio Dispatch will analyze your sentence cadence, brevity, and tone markers to adapt story explanations to your natural communication style.
              </p>
              <textarea
                rows={4}
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder="Paste a writing sample that sounds like you..."
                className="w-full p-3 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-800 font-sans"
              />
            </div>

            <button
              onClick={handleAnalyzeAndSave}
              disabled={!sampleText.trim()}
              className="w-full py-2.5 px-4 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-red-200" />
              <span>Analyze & Save Voice Profile</span>
            </button>

            {analyzedMarkers && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-xs space-y-1.5">
                <div className="font-semibold text-zinc-800">Extracted Style Profile:</div>
                <div className="grid grid-cols-2 gap-2 text-zinc-600">
                  <div>Formality: <strong className="capitalize text-zinc-900">{analyzedMarkers.formality}</strong></div>
                  <div>Pacing: <strong className="capitalize text-zinc-900">{analyzedMarkers.brevity}</strong></div>
                  <div>Real-world Analogies: <strong className="text-zinc-900">{analyzedMarkers.useAnalogies ? 'Enabled' : 'Off'}</strong></div>
                  <div>Bulleted Takeaways: <strong className="text-zinc-900">{analyzedMarkers.bulletPreference ? 'Preferred' : 'Prose'}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BYOK */}
        {activeTab === 'byok' && (
          <div className="space-y-4 text-xs text-zinc-600">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 leading-relaxed">
              <strong>100% Optional:</strong> The MVP runs completely without an API key using our built-in tone engine. If you want to experiment with live streaming LLM calls, you can paste your own Gemini or OpenAI key below. It is stored exclusively in your browser’s LocalStorage.
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Gemini or OpenAI API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... or sk-proj-..."
                  className="flex-1 p-2.5 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-800"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isSavedNotice && (
          <div className="mt-4 p-2 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-emerald-200 animate-paper-fade">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
