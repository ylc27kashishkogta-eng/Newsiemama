import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TopicCategory, VoicePreset, AgeRange } from '../types';
import { Sparkles, ArrowRight, Check, BookOpen, Clock, Coffee, Heart, User } from 'lucide-react';

interface WelcomeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
  isEditMode?: boolean;
}

const AGE_OPTIONS: { id: AgeRange; label: string; subtext: string }[] = [
  { id: 'under-13', label: 'Under 13', subtext: 'Simpler language & fun analogies' },
  { id: '13-17', label: '13–17', subtext: 'High-school & student context' },
  { id: '18-24', label: '18–24', subtext: 'College & early-career focus' },
  { id: '25-34', label: '25–34', subtext: 'Practical career & economic impact' },
  { id: '35-plus', label: '35+', subtext: 'Strategic & macroeconomic depth' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say', subtext: 'Balanced general reading' },
];

const TOPICS: { id: TopicCategory; title: string; desc: string; icon: string }[] = [
  { id: 'economy', title: 'Markets & Economy', desc: 'RBI rates, industrial growth & startups', icon: '📈' },
  { id: 'tech', title: 'Technology & AI', desc: 'Open models, semiconductors & chips', icon: '⚡' },
  { id: 'policy', title: 'Policy & Governance', desc: 'Freight corridors, infrastructure & rules', icon: '🏛️' },
  { id: 'world', title: 'World Intelligence', desc: 'Global trade, energy & diplomacy', icon: '🌍' },
  { id: 'climate', title: 'Climate & Energy', desc: 'Solar grids, batteries & clean tech', icon: '🌱' },
];

const STYLES: { id: VoicePreset; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'executive',
    title: 'Quick Brief',
    desc: 'Dense bullets, core takeaways, and bottom-line impact. Zero fluff.',
    icon: <Clock className="w-5 h-5 text-[#b9533f]" />,
  },
  {
    id: 'conversational',
    title: 'Friendly Explainer',
    desc: 'Warm, approachable everyday language with relatable real-world analogies.',
    icon: <Coffee className="w-5 h-5 text-[#4e6c58]" />,
  },
  {
    id: 'storyteller',
    title: 'Storyteller',
    desc: 'Narrative journalism setting the scene, human context, and how it unfolds.',
    icon: <BookOpen className="w-5 h-5 text-[#d68175]" />,
  },
];

export const WelcomeSetupModal: React.FC<WelcomeSetupModalProps> = ({
  isOpen,
  onClose,
  isEditing = false,
  isEditMode = false,
}) => {
  const effectiveEditing = isEditing || isEditMode;
  const { currentProfile, createNewProfile, updateProfileDetails, completeOnboarding } = useProfile();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(effectiveEditing ? currentProfile.name : '');
  const [ageRange, setAgeRange] = useState<AgeRange>(effectiveEditing ? currentProfile.ageRange : '25-34');
  const [selectedTopics, setSelectedTopics] = useState<TopicCategory[]>(
    effectiveEditing ? currentProfile.topics : ['economy', 'tech']
  );
  const [selectedStyle, setSelectedStyle] = useState<VoicePreset>(
    effectiveEditing ? currentProfile.voicePreset : 'conversational'
  );

  // Sync state if modal opens in edit mode
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (effectiveEditing) {
        setName(currentProfile.name);
        setAgeRange(currentProfile.ageRange);
        setSelectedTopics(currentProfile.topics);
        setSelectedStyle(currentProfile.voicePreset);
      } else {
        setName('');
        setAgeRange('25-34');
        setSelectedTopics(['economy', 'tech']);
        setSelectedStyle('conversational');
      }
    }
  }, [isOpen, effectiveEditing, currentProfile]);

  if (!isOpen) return null;

  const handleToggleTopic = (topic: TopicCategory) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.length > 1
          ? prev.filter((t) => t !== topic)
          : prev
        : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Reader';

    if (effectiveEditing) {
      updateProfileDetails(finalName, ageRange, selectedStyle, selectedTopics);
    } else {
      createNewProfile(finalName, ageRange, selectedTopics, selectedStyle);
    }
    completeOnboarding();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e9e3da] animate-paper-fade text-[#1e1b18]">
        {/* Onboarding Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f7ebe8] text-[#b9533f] rounded-full text-xs font-semibold tracking-wider uppercase mb-2 border border-[#faecea]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{effectiveEditing ? 'Customize Reader Setup' : 'Welcome to Curio Dispatch'}</span>
          </div>
          <h2 className="font-masthead text-2xl sm:text-3xl font-bold text-[#1e1b18]">
            {effectiveEditing ? 'Update Your Reading Preferences' : 'Your Personal Daily Newspaper'}
          </h2>
          <p className="font-serif-editorial italic text-xs sm:text-sm text-[#57524b] mt-1">
            Let’s craft a calm, curated edition tailored precisely to you in 30 seconds.
          </p>
        </div>

        {/* Step Progression Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-8 bg-[#b9533f]'
                  : step > s
                  ? 'w-4 bg-[#4e6c58]'
                  : 'w-4 bg-[#e9e3da]'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: NAME */}
          {step === 1 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  What should we call you?
                </label>
                <p className="text-xs text-[#57524b] mb-3">
                  This will be printed on your morning broadsheet masthead (e.g. <em>“Aarav’s Daily Briefing”</em>).
                </p>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-3 text-[#8a837a]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name or nickname (e.g. Aarav Sharma)"
                    className="w-full pl-11 pr-4 py-3 bg-[#faf7f2] border border-[#e9e3da] rounded-2xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#b9533f] focus:bg-white transition-all"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#f8f1ec] rounded-2xl border border-[#faecea] text-xs text-[#57524b] leading-relaxed">
                🔒 <strong>Device-only profile:</strong> No password or email needed. Your preferences are saved exclusively on this browser.
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="px-6 py-2.5 bg-[#b9533f] hover:bg-[#963d2b] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AGE RANGE */}
          {step === 2 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  Choose your age range
                </label>
                <p className="text-xs text-[#57524b] mb-3">
                  Used solely to adapt storytelling analogies and reading complexity — never shared.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AGE_OPTIONS.map((opt) => {
                  const isSelected = ageRange === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAgeRange(opt.id)}
                      className={`p-3 text-left rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#b9533f] bg-[#f7ebe8] ring-1 ring-[#b9533f] shadow-xs'
                          : 'border-[#e9e3da] hover:border-[#d68175] bg-[#faf7f2] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#1e1b18]">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#b9533f]" />}
                      </div>
                      <span className="text-[11px] text-[#57524b] leading-tight font-serif-editorial">
                        {opt.subtext}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-[#57524b] hover:text-[#1e1b18] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#b9533f] hover:bg-[#963d2b] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Select Topics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TOPICS */}
          {step === 3 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  Which topics do you want to follow?
                </label>
                <p className="text-xs text-[#57524b] mb-3">
                  Select at least one. We’ll curate your morning broadsheet from these categories.
                </p>
              </div>

              <div className="space-y-2">
                {TOPICS.map((t) => {
                  const isChecked = selectedTopics.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTopic(t.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-[#b9533f] bg-[#f7ebe8]/70 shadow-xs'
                          : 'border-[#e9e3da] bg-[#faf7f2] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{t.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-[#1e1b18]">{t.title}</div>
                          <div className="text-[11px] text-[#57524b] font-serif-editorial">{t.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isChecked ? 'bg-[#b9533f] text-white' : 'border border-[#d6cdc4] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-[#57524b] hover:text-[#1e1b18] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={selectedTopics.length === 0}
                  className="px-6 py-2.5 bg-[#b9533f] hover:bg-[#963d2b] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Choose Explanation Voice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EXPLANATION VOICE */}
          {step === 4 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  How should we explain stories to you?
                </label>
                <p className="text-xs text-[#57524b] mb-3">
                  Every article can be translated into this conversational narrative style on demand.
                </p>
              </div>

              <div className="space-y-3">
                {STYLES.map((st) => {
                  const isSelected = selectedStyle === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStyle(st.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#b9533f] bg-[#f7ebe8] ring-1 ring-[#b9533f] shadow-xs'
                          : 'border-[#e9e3da] bg-[#faf7f2] hover:bg-white'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white shadow-xs">{st.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs text-[#1e1b18]">{st.title}</span>
                          {isSelected && <span className="text-[10px] font-bold text-[#b9533f]">Selected</span>}
                        </div>
                        <p className="text-xs text-[#57524b] leading-relaxed font-serif-editorial">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#e9e3da]">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-[#57524b] hover:text-[#1e1b18] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#b9533f] hover:bg-[#963d2b] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all transform active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{effectiveEditing ? 'Save My Preferences' : 'Launch My Daily Broadsheet 🗞️'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
