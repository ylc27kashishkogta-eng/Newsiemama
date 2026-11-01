import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TopicCategory, VoicePreset, AgeRange, SlangLevel, StoryLength } from '../types';
import { APP_NAME, APP_TAGLINE } from '../config';
import {
  Sparkles,
  ArrowRight,
  Check,
  BookOpen,
  Clock,
  Coffee,
  User,
  Eye,
  SlidersHorizontal,
  Edit3,
  Flame,
  Zap,
  AlignLeft,
  List
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
  { id: 'finance', title: 'Finance & Markets', desc: 'Stocks, startups, personal finance, RBI & capex', icon: '📈' },
  { id: 'tech', title: 'Technology & AI', desc: 'Open models, semiconductor cleanrooms & software infra', icon: '⚡' },
  { id: 'policy', title: 'Policy & Governance', desc: 'Freight corridors, infrastructure & digital public goods', icon: '🏛️' },
  { id: 'world', title: 'World Intelligence', desc: 'Global trade, carbon tariffs & diplomatic pacts', icon: '🌍' },
  { id: 'climate', title: 'Climate & Energy', desc: 'Solar grids, battery storage & floating offshore wind', icon: '🌱' },
  { id: 'science', title: 'Science & Space', desc: 'ISRO docking tests, space stations & cosmic radio discoveries', icon: '🚀' },
  { id: 'sports_culture', title: 'Sports & Culture', desc: 'WPL expansion, indie gaming awards & heritage arts', icon: '🎨' },
];

const STYLES: { id: VoicePreset; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'executive',
    title: 'Quick Brief',
    desc: 'Dense bullets, core takeaways, and bottom-line impact. Zero fluff.',
    icon: <Clock className="w-5 h-5 text-[#e25c50]" />,
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
    icon: <BookOpen className="w-5 h-5 text-[#7c66dc]" />,
  },
];

const SLANG_OPTIONS: { id: SlangLevel; label: string; desc: string }[] = [
  { id: 'off', label: 'Clean Editorial', desc: 'Crisp, modern, and serious journalism' },
  { id: 'subtle', label: 'Casual Conversational', desc: 'Breezy and natural morning coffee tone' },
  { id: 'vibe', label: 'Gen Z Vibe', desc: 'Playful tl;dr, "hits different", no cap on verified facts' },
];

const LENGTH_OPTIONS: { id: StoryLength; label: string; desc: string }[] = [
  { id: 'quick', label: '1-Min Quick', desc: 'Punchy bullets & bottom lines' },
  { id: 'balanced', label: 'Balanced (2-3 min)', desc: 'Standard 3-part guided narrative' },
  { id: 'deep', label: 'Deep Dive (4+ min)', desc: 'In-depth background, timelines & metrics' },
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
  const [editionTitle, setEditionTitle] = useState<string>(
    effectiveEditing ? currentProfile.editionTitle : ''
  );
  const [isCustomTitleEdited, setIsCustomTitleEdited] = useState<boolean>(effectiveEditing);
  const [ageRange, setAgeRange] = useState<AgeRange>(effectiveEditing ? currentProfile.ageRange : '25-34');
  const [selectedTopics, setSelectedTopics] = useState<TopicCategory[]>(
    effectiveEditing ? currentProfile.topics : ['finance', 'tech']
  );
  const [selectedStyle, setSelectedStyle] = useState<VoicePreset>(
    effectiveEditing ? currentProfile.voicePreset : 'conversational'
  );
  const [selectedSlang, setSelectedSlang] = useState<SlangLevel>(
    effectiveEditing ? (currentProfile.slangLevel || 'subtle') : 'subtle'
  );
  const [selectedLength, setSelectedLength] = useState<StoryLength>(
    effectiveEditing ? (currentProfile.storyLength || 'balanced') : 'balanced'
  );

  // Sync state when modal opens in edit mode
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (effectiveEditing) {
        setName(currentProfile.name);
        setEditionTitle(currentProfile.editionTitle);
        setIsCustomTitleEdited(true);
        setAgeRange(currentProfile.ageRange);
        setSelectedTopics(currentProfile.topics);
        setSelectedStyle(currentProfile.voicePreset);
        setSelectedSlang(currentProfile.slangLevel || 'subtle');
        setSelectedLength(currentProfile.storyLength || 'balanced');
      } else {
        setName('');
        setEditionTitle('');
        setIsCustomTitleEdited(false);
        setAgeRange('25-34');
        setSelectedTopics(['finance', 'tech']);
        setSelectedStyle('conversational');
        setSelectedSlang('subtle');
        setSelectedLength('balanced');
      }
    }
  }, [isOpen, effectiveEditing, currentProfile]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!isCustomTitleEdited) {
      setEditionTitle(newName.trim() ? `${newName.trim()}'s Newsroom` : '');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditionTitle(e.target.value);
    setIsCustomTitleEdited(true);
  };

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

  const computedTitle = editionTitle.trim() || (name.trim() ? `${name.trim()}'s Newsroom` : 'Your Newsroom');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Reader';
    const finalTitle = computedTitle;

    if (effectiveEditing) {
      updateProfileDetails(
        finalName,
        ageRange,
        selectedStyle,
        selectedTopics,
        finalTitle,
        selectedSlang,
        selectedLength
      );
    } else {
      createNewProfile(
        finalName,
        ageRange,
        selectedTopics,
        selectedStyle,
        finalTitle,
        selectedSlang,
        selectedLength
      );
    }
    completeOnboarding();
    onClose();
  };

  const primaryTopic = selectedTopics[0] || 'finance';
  const primaryTopicInfo = TOPICS.find((t) => t.id === primaryTopic) || TOPICS[0];
  const activeStyleInfo = STYLES.find((s) => s.id === selectedStyle) || STYLES[1];
  const activeAgeInfo = AGE_OPTIONS.find((a) => a.id === ageRange) || AGE_OPTIONS[3];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#181513]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e4dcd3] animate-paper-fade text-[#181513]">
        {/* Onboarding Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fbeae5] text-[#9b2c48] rounded-full text-xs font-semibold tracking-wider uppercase mb-2 border border-[#f3c8bc]">
            <Sparkles className="w-3.5 h-3.5 text-[#e25c50]" />
            <span>{effectiveEditing ? 'Customize Reader Setup' : `Welcome to ${APP_NAME}`}</span>
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#181513]">
            {effectiveEditing ? 'Update Your Reading Preferences' : 'Your Personal Daily Newspaper'}
          </h2>
          <p className="font-serif-editorial italic text-xs sm:text-sm text-[#5c5449] mt-1">
            {APP_TAGLINE}
          </p>
        </div>

        {/* 5-Step Progression Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-8 bg-[#e25c50]'
                  : step > s
                  ? 'w-4 bg-[#4e6c58]'
                  : 'w-4 bg-[#ded4c7]'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleFinish} className="space-y-6">
          {/* STEP 1: NAME & DISTINCTIVE NEWSPAPER TITLE */}
          {step === 1 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#181513] mb-1">
                  1. What should we call you?
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
                  This will be used to brand your personal newspaper masthead (e.g. <em>“Aarav Sharma’s Newsroom”</em>).
                </p>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-3.5 text-[#8f887d]" />
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter your name or nickname (e.g. Aarav Sharma)"
                    className="w-full pl-11 pr-4 py-3 bg-[#ffffff] border border-[#cbbfb0] rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e25c50] transition-all"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Newspaper Title Customization */}
              <div className="pt-2 border-t border-[#f0eae1]">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#181513] flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-[#e25c50]" />
                    <span>Personalized Newspaper Title</span>
                  </label>
                  <span className="text-[10px] text-[#8f887d] font-mono-meta">
                    Default: [Name]'s Newsroom
                  </span>
                </div>
                <input
                  type="text"
                  value={editionTitle}
                  onChange={handleTitleChange}
                  placeholder={name.trim() ? `${name.trim()}'s Newsroom` : "e.g. Aarav Sharma's Newsroom"}
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#cbbfb0] rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e25c50] transition-all"
                />
                <p className="text-[11px] text-[#6e685f] mt-1 font-serif-editorial">
                  Customize the masthead name now or adjust it anytime in profile settings.
                </p>
              </div>

              <div className="p-3.5 bg-[#faf7f2] rounded-2xl border border-[#e4dcd3] text-xs text-[#5c5449] leading-relaxed">
                🔒 <strong>On-Device Profile:</strong> No passwords, emails, or tracking. Stored purely inside your browser’s LocalStorage.
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="px-6 py-2.5 bg-[#e25c50] hover:bg-[#cf4b3f] disabled:opacity-40 text-[#ffffff] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
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
                <label className="block text-sm font-semibold text-[#181513] mb-1">
                  2. What is your age range?
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
                  Used strictly to calibrate vocabulary complexity and real-world analogies (e.g. student vs career vs household).
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
                          ? 'border-[#e25c50] bg-[#fbeae5] ring-1 ring-[#e25c50] shadow-xs'
                          : 'border-[#e4dcd3] bg-[#ffffff] hover:border-[#cbbfb0] hover:bg-[#faf7f2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs sm:text-sm text-[#181513]">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#e25c50]" />}
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
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#181513] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#e25c50] hover:bg-[#cf4b3f] text-[#ffffff] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
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
                <label className="block text-sm font-semibold text-[#181513] mb-1">
                  3. Which subjects do you want on your front page?
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
                  Choose the sections that matter most. Each story will show a personalized “Because you follow...” tag.
                </p>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {TOPICS.map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleToggleTopic(topic.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'border-[#e25c50] bg-[#fbeae5] shadow-xs'
                          : 'border-[#e4dcd3] bg-[#ffffff] hover:border-[#cbbfb0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{topic.icon}</span>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#181513]">{topic.title}</div>
                          <div className="text-[11px] text-[#6e685f]">{topic.desc}</div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isChecked ? 'bg-[#e25c50] text-[#ffffff]' : 'border border-[#cbbfb0] bg-[#ffffff]'
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
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#181513] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={selectedTopics.length === 0}
                  className="px-6 py-2.5 bg-[#e25c50] hover:bg-[#cf4b3f] disabled:opacity-40 text-[#ffffff] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EXPLANATION VOICE, SLANG FLAVOR & LENGTH */}
          {step === 4 && (
            <div className="space-y-4 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#181513] mb-1">
                  4. Narrative Tone, Flavor & Story Length
                </label>
                <p className="text-xs text-[#5c5449] mb-3">
                  Personalize how stories are explained and formatted in your edition.
                </p>
              </div>

              {/* Style Presets */}
              <div className="space-y-2">
                <div className="text-xs font-mono-meta font-bold uppercase text-[#6e685f]">
                  Explanation Voice
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {STYLES.map((st) => {
                    const isSelected = selectedStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStyle(st.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#e25c50] bg-[#fbeae5] ring-1 ring-[#e25c50] shadow-xs'
                            : 'border-[#e4dcd3] bg-[#ffffff] hover:border-[#cbbfb0]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {st.icon}
                          <span className="font-bold text-xs text-[#181513]">{st.title}</span>
                        </div>
                        <p className="text-[11px] text-[#6e685f] leading-snug">
                          {st.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slang Level / Flavor Selector */}
              <div className="pt-2 border-t border-[#f0eae1] space-y-2">
                <div className="text-xs font-mono-meta font-bold uppercase text-[#6e685f] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#e25c50]" />
                  <span>Conversational Flavor (Gen Z Slang)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SLANG_OPTIONS.map((sl) => {
                    const isSelected = selectedSlang === sl.id;
                    return (
                      <button
                        key={sl.id}
                        type="button"
                        onClick={() => setSelectedSlang(sl.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#e25c50] bg-[#fbeae5] ring-1 ring-[#e25c50]'
                            : 'border-[#e4dcd3] bg-[#ffffff] hover:border-[#cbbfb0]'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#181513] mb-0.5">{sl.label}</div>
                        <div className="text-[10px] text-[#6e685f] leading-tight">{sl.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Story Length Preference */}
              <div className="pt-2 border-t border-[#f0eae1] space-y-2">
                <div className="text-xs font-mono-meta font-bold uppercase text-[#6e685f] flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[#7c66dc]" />
                  <span>Preferred Story Length</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTH_OPTIONS.map((ln) => {
                    const isSelected = selectedLength === ln.id;
                    return (
                      <button
                        key={ln.id}
                        type="button"
                        onClick={() => setSelectedLength(ln.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#7c66dc] bg-[#eee8f8] ring-1 ring-[#7c66dc]'
                            : 'border-[#e4dcd3] bg-[#ffffff] hover:border-[#cbbfb0]'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#181513] mb-0.5">{ln.label}</div>
                        <div className="text-[10px] text-[#6e685f] leading-tight">{ln.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#181513] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 bg-[#e25c50] hover:bg-[#cf4b3f] text-[#ffffff] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Preview Broadsheet</span>
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: LIVE NEWSPAPER PREVIEW */}
          {step === 5 && (
            <div className="space-y-5 animate-paper-fade">
              <div>
                <label className="block text-sm font-semibold text-[#181513] mb-1">
                  5. Preview Your Personal Newsroom
                </label>
                <p className="text-xs text-[#5c5449]">
                  Here is how your morning edition looks before you step inside:
                </p>
              </div>

              {/* Broadsheet Miniature Preview Container */}
              <div className="bg-[#ffffff] border-2 border-[#181513] rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
                {/* Miniature Masthead */}
                <div className="border-b-2 border-[#181513] pb-3 text-center">
                  <div className="flex items-center justify-between text-[10px] font-mono-meta text-[#6e685f] uppercase tracking-wider mb-1">
                    <span>VOL. II — NO. 42</span>
                    <span>TODAY</span>
                    <span className="text-[#4e6c58] font-bold">● MORNING EDITION</span>
                  </div>

                  <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#181513]">
                    {computedTitle}
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
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#faf7f2] text-[#181513] border border-[#d8ccc0]"
                      >
                        {top?.title || t}
                      </span>
                    );
                  })}
                </div>

                {/* Sample Story Card Inside Preview */}
                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e4dcd3] text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono-meta mb-1.5">
                    <span className="font-bold text-[#3e5f49] bg-[#e3ece5] px-2 py-0.5 rounded-full border border-[#c1d6c7] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#3e5f49]" />
                      <span>Because you follow {primaryTopicInfo.title}</span>
                    </span>
                    <span className="text-[#8f887d]">Sample Scenario</span>
                  </div>

                  <h4 className="font-serif-editorial font-bold text-sm text-[#181513] mb-1">
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
                    <div className="p-1.5 rounded-lg bg-[#ffffff] border border-[#ece4dc]">
                      <strong className="text-[#e25c50] block">1. What happened?</strong>
                      <span className="text-[#6e685f] text-[9px]">Grounded facts</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#ffffff] border border-[#ece4dc]">
                      <strong className="text-[#4e6c58] block">2. Why it matters</strong>
                      <span className="text-[#6e685f] text-[9px]">Tailored to you</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#ffffff] border border-[#ece4dc]">
                      <strong className="text-[#7c66dc] block">3. What is next?</strong>
                      <span className="text-[#6e685f] text-[9px]">Forward analysis</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#181513] cursor-pointer flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Edit Name & Title</span>
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#e25c50] hover:bg-[#cf4b3f] text-[#ffffff] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all transform active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#ffffff]" />
                  <span>{effectiveEditing ? 'Save My Preferences' : 'Enter My Newsroom 🗞️'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
