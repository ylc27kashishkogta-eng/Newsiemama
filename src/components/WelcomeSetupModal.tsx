import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TopicCategory, VoicePreset, AgeRange } from '../types';
import {
  Sparkles,
  ArrowRight,
  Check,
  BookOpen,
  Clock,
  Coffee,
  User,
  Radio,
  FileText,
  TrendingUp,
  HelpCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

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
  { id: 'economy', title: 'Markets & Economy', desc: 'RBI rates, industrial capex & startups', icon: '📈' },
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
    icon: <BookOpen className="w-5 h-5 text-[#b9533f]" />,
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
    effectiveEditing ? currentProfile.topics : ['tech', 'economy']
  );
  const [selectedStyle, setSelectedStyle] = useState<VoicePreset>(
    effectiveEditing ? currentProfile.voicePreset : 'conversational'
  );

  // Sync state when modal opens in edit mode
  useEffect(() => {
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
        setSelectedTopics(['tech', 'economy']);
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

  const handleFinish = (e: React.FormEvent) => {
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

  const primaryTopic = selectedTopics[0] || 'tech';
  const primaryTopicInfo = TOPICS.find((t) => t.id === primaryTopic) || TOPICS[0];
  const activeStyleInfo = STYLES.find((s) => s.id === selectedStyle) || STYLES[1];
  const activeAgeInfo = AGE_OPTIONS.find((a) => a.id === ageRange) || AGE_OPTIONS[3];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e4dcd3] animate-paper-fade text-[#1e1b18]">
        {/* Onboarding Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5e6e1] text-[#963f2e] rounded-full text-xs font-semibold tracking-wider uppercase mb-2 border border-[#e8cecb]">
            <Sparkles className="w-3.5 h-3.5 text-[#b9533f]" />
            <span>{effectiveEditing ? 'Customize Reader Setup' : 'Welcome to Curio Dispatch'}</span>
          </div>
          <h2 className="font-masthead text-2xl sm:text-3xl font-bold text-[#1e1b18]">
            {effectiveEditing ? 'Update Your Reading Preferences' : 'Your Personal Daily Newspaper'}
          </h2>
          <p className="font-serif-editorial italic text-xs sm:text-sm text-[#5c5449] mt-1">
            A calm, distraction-free morning broadsheet synthesized in your preferred voice.
          </p>
        </div>

        {/* 5-Step Progression Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-8 bg-[#b9533f]'
                  : step > s
                  ? 'w-4 bg-[#4e6c58]'
                  : 'w-4 bg-[#ded4c7]'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleFinish} className="space-y-6">
          {/* STEP 1: NAME */}
          {step === 1 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  1. What should we call you?
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
                  This will be printed on your morning broadsheet masthead (e.g. <em>“Aarav’s Daily Briefing”</em>).
                </p>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-3.5 text-[#8f887d]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name or nickname (e.g. Aarav Sharma)"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#cbbfb0] rounded-2xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#b9533f] transition-all"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#fbf5ee] rounded-2xl border border-[#ecdacb] text-xs text-[#5c5449] leading-relaxed">
                🔒 <strong>On-Device Profile:</strong> No passwords, emails, or tracking. Stored purely inside your browser’s LocalStorage.
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="px-6 py-2.5 bg-[#b9533f] hover:bg-[#963f2e] disabled:opacity-40 text-[#faf7f2] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AGE RANGE */}
          {step === 2 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  2. What is your age range?
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
                  Used strictly to calibrate vocabulary complexity and real-world analogies (e.g., student vs. career vs. macro).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {AGE_OPTIONS.map((opt) => {
                  const isSelected = ageRange === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAgeRange(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#b9533f] bg-[#fbf0ec] ring-1 ring-[#b9533f] shadow-xs'
                          : 'border-[#e4dcd3] bg-white hover:border-[#cbbfb0] hover:bg-[#fcf9f5]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs sm:text-sm text-[#1e1b18]">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#b9533f]" />}
                      </div>
                      <span className="text-[11px] text-[#6e685f] leading-tight block">{opt.subtext}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#1e1b18] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#b9533f] hover:bg-[#963f2e] text-[#faf7f2] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TOPICS OF INTEREST */}
          {step === 3 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  3. Which subjects do you want on your front page?
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
                  Choose the sections that matter most. Each story will show a personalized “Because you follow...” tag.
                </p>
              </div>

              <div className="space-y-2">
                {TOPICS.map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleToggleTopic(topic.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'border-[#b9533f] bg-[#fbf0ec] shadow-xs'
                          : 'border-[#e4dcd3] bg-white hover:border-[#cbbfb0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{topic.icon}</span>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#1e1b18]">{topic.title}</div>
                          <div className="text-[11px] text-[#6e685f]">{topic.desc}</div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isChecked ? 'bg-[#b9533f] text-white' : 'border border-[#cbbfb0] bg-white'
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
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#1e1b18] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={selectedTopics.length === 0}
                  className="px-6 py-2.5 bg-[#b9533f] hover:bg-[#963f2e] disabled:opacity-40 text-[#faf7f2] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EXPLANATION VOICE */}
          {step === 4 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  4. How would you like stories explained?
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
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
                          ? 'border-[#b9533f] bg-[#fbf0ec] ring-1 ring-[#b9533f] shadow-xs'
                          : 'border-[#e4dcd3] bg-white hover:border-[#cbbfb0]'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-[#faf7f2] shadow-xs">{st.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs sm:text-sm text-[#1e1b18]">{st.title}</span>
                          {isSelected && <span className="text-[10px] font-bold text-[#b9533f]">Selected</span>}
                        </div>
                        <p className="text-xs text-[#5c5449] leading-relaxed font-serif-editorial">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#1e1b18] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 bg-[#b9533f] hover:bg-[#963f2e] text-[#faf7f2] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Preview Broadsheet</span>
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: LIVE NEWSPAPER PREVIEW (Special First-Visit Preview) */}
          {step === 5 && (
            <div className="space-y-5 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#1e1b18] mb-1">
                  5. Preview Your Personal Newspaper
                </label>
                <p className="text-xs text-[#5c5449]">
                  Here is how your morning edition broadsheet looks before you step inside:
                </p>
              </div>

              {/* Broadsheet Miniature Preview Container */}
              <div className="bg-[#ffffff] border-2 border-[#1e1b18] rounded-2xl p-5 shadow-md space-y-4">
                {/* Miniature Masthead */}
                <div className="border-b-2 border-[#1e1b18] pb-3 text-center">
                  <div className="flex items-center justify-between text-[10px] font-mono-meta text-[#6e685f] uppercase tracking-wider mb-1">
                    <span>VOL. I — NO. 42</span>
                    <span>OCTOBER 28, 2026</span>
                    <span className="text-[#4e6c58] font-bold">● MORNING EDITION</span>
                  </div>

                  <h3 className="font-masthead text-xl sm:text-2xl font-bold text-[#1e1b18]">
                    {name.trim() ? `${name.trim()}'s Daily Briefing` : "Your Daily Briefing"}
                  </h3>
                  <p className="font-serif-editorial italic text-xs text-[#5c5449]">
                    Curated for {name.trim() || 'Reader'} • Calibrated for {activeAgeInfo.label} • {activeStyleInfo.title}
                  </p>
                </div>

                {/* Setup Summary Tags */}
                <div className="flex flex-wrap items-center gap-1.5 justify-center py-1">
                  {selectedTopics.map((t) => {
                    const top = TOPICS.find((item) => item.id === t);
                    return (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#faf7f2] text-[#1e1b18] border border-[#d8ccc0]"
                      >
                        {top?.title || t}
                      </span>
                    );
                  })}
                </div>

                {/* Sample Story Card Inside Preview */}
                <div className="bg-[#faf7f2] p-3.5 rounded-xl border border-[#e4dcd3] text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono-meta mb-1.5">
                    <span className="font-bold text-[#3b5744] bg-[#edf2ee] px-2 py-0.5 rounded-full border border-[#cbe0d0] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#4e6c58]" />
                      <span>Because you follow {primaryTopicInfo.title}</span>
                    </span>
                    <span className="text-[#8f887d]">Verified Demo Story</span>
                  </div>

                  <h4 className="font-serif-editorial font-bold text-sm text-[#1e1b18] mb-1">
                    {primaryTopic === 'tech'
                      ? 'ISRO Completes Critical Autonomous Docking Test for Space Station'
                      : 'RBI Signals Measured Liquidity Path as Core Inflation Moderates to 3.8%'}
                  </h4>

                  <p className="font-serif-editorial text-xs text-[#5c5449] mb-2">
                    {primaryTopic === 'tech'
                      ? 'Miniaturized test craft achieve sub-millimeter latching alignment in orbit.'
                      : 'Monetary Policy Committee maintains neutral stance with room for selective growth.'}
                  </p>

                  {/* 3-part narrative sample preview */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#e8dacd] text-[10px]">
                    <div className="p-1.5 rounded-lg bg-white border border-[#ece4dc]">
                      <strong className="text-[#b9533f] block">1. What happened?</strong>
                      <span className="text-[#6e685f] text-[9px]">Grounded facts</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-[#ece4dc]">
                      <strong className="text-[#4e6c58] block">2. Why it matters</strong>
                      <span className="text-[#6e685f] text-[9px]">Tailored to you</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-[#ece4dc]">
                      <strong className="text-[#7c5e3f] block">3. What is next?</strong>
                      <span className="text-[#6e685f] text-[9px]">Future outlook</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#1e1b18] cursor-pointer"
                >
                  Adjust Choices
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#b9533f] hover:bg-[#963f2e] text-[#faf7f2] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all transform active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#fcdcd4]" />
                  <span>{effectiveEditing ? 'Save My Preferences' : 'Enter My Newspaper 🗞️'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
