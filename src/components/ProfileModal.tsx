import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TopicCategory, VoicePreset, AgeRange } from '../types';
import { X, UserPlus, Check, UserCheck, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewProfileSetup?: () => void;
}

const AVAILABLE_TOPICS: { id: TopicCategory; label: string }[] = [
  { id: 'economy', label: 'Markets & Economy' },
  { id: 'tech', label: 'Technology & AI' },
  { id: 'policy', label: 'Policy & Governance' },
  { id: 'world', label: 'World Intelligence' },
  { id: 'climate', label: 'Climate & Infra' },
];

const AGE_RANGES: { id: AgeRange; label: string }[] = [
  { id: 'under-13', label: 'Under 13' },
  { id: '13-17', label: '13–17' },
  { id: '18-24', label: '18–24' },
  { id: '25-34', label: '25–34' },
  { id: '35-plus', label: '35+' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenNewProfileSetup,
}) => {
  const { profiles, currentProfile, switchProfile, createNewProfile, updateEditionTitle, toggleShowNewsQuest } = useProfile();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEditionTitle, setNewEditionTitle] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeRange>('25-34');
  const [selectedTopics, setSelectedTopics] = useState<TopicCategory[]>(['tech', 'economy']);
  const [selectedPreset, setSelectedPreset] = useState<VoicePreset>('conversational');
  const [activeTitleInput, setActiveTitleInput] = useState(
    currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`
  );
  const [titleSavedNotification, setTitleSavedNotification] = useState(false);

  useEffect(() => {
    setActiveTitleInput(currentProfile.editionTitle || `${currentProfile.name}'s Newsroom`);
  }, [currentProfile]);

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

  const handleToggleTopic = (topic: TopicCategory) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSaveActiveTitle = () => {
    const finalTitle = activeTitleInput.trim() || `${currentProfile.name}'s Newsroom`;
    updateEditionTitle(finalTitle);
    setTitleSavedNotification(true);
    setTimeout(() => setTitleSavedNotification(false), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    createNewProfile(
      newName.trim(),
      selectedAge,
      selectedTopics.length > 0 ? selectedTopics : ['economy', 'tech'],
      selectedPreset,
      newEditionTitle.trim() || undefined
    );
    setIsCreating(false);
    setNewName('');
    setNewEditionTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e4dcd3] animate-paper-fade">
        <div className="flex items-center justify-between pb-3 border-b border-[#e4dcd3] mb-5">
          <div>
            <h3 className="font-masthead text-lg font-bold text-[#1e1b18]">Reader Profiles</h3>
            <p className="text-xs text-[#6e685f] font-serif-editorial">
              Each reader gets an independent daily newspaper & reading voice
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#8f887d] hover:text-[#1e1b18] cursor-pointer" title="Close (Esc)">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCreating ? (
          <div>
            {/* List of Existing Profiles */}
            <div className="space-y-3 mb-6">
              {profiles.map((profile) => {
                const isActive = profile.id === currentProfile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      switchProfile(profile.id);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'border-[#b9533f] bg-[#fbf0ec] shadow-xs ring-1 ring-[#b9533f]'
                        : 'border-[#e4dcd3] bg-white hover:border-[#cbbfb0] hover:bg-[#f7f2eb]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1e1b18]">{profile.name}</span>
                        {isActive && (
                          <span className="text-[10px] bg-[#b9533f] text-[#faf7f2] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Active Edition
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-serif-editorial italic text-[#b9533f] font-medium mt-0.5">
                        {profile.editionTitle || `${profile.name}'s Newsroom`}
                      </p>
                      <div className="text-xs text-[#6e685f] mt-1 capitalize">
                        Age: <strong>{profile.ageRange || 'Standard'}</strong> • Voice: <strong>{profile.voicePreset}</strong> • {profile.topics.length} topics
                      </div>
                    </div>
                    {isActive ? (
                      <UserCheck className="w-5 h-5 text-[#b9533f]" />
                    ) : (
                      <span className="text-xs text-[#8f887d]">Select</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Customize Newspaper Title for Active Reader */}
            <div className="bg-[#f7efe9] border border-[#e8dacd] rounded-xl p-3.5 mb-5 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#1e1b18]">
                  Newspaper Title ({currentProfile.name})
                </label>
                {titleSavedNotification && (
                  <span className="text-[11px] font-bold text-[#4e6c58] flex items-center gap-1 animate-paper-fade">
                    <Check className="w-3 h-3" />
                    Saved!
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeTitleInput}
                  onChange={(e) => setActiveTitleInput(e.target.value)}
                  placeholder={`${currentProfile.name}'s Newsroom`}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#cbbfb0] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#b9533f]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveActiveTitle();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveActiveTitle}
                  className="px-3 py-1.5 bg-[#b9533f] hover:bg-[#963f2e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Save Title
                </button>
              </div>
              <p className="text-[11px] text-[#6e685f] mt-1.5">
                Default: <span className="font-semibold text-[#1e1b18]">{currentProfile.name}'s Newsroom</span>
              </p>
            </div>

            {/* News Quest Preferences for Active Reader */}
            <div className="bg-[#f7efe9] border border-[#e8dacd] rounded-xl p-3.5 mb-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#1e1b18] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#b9533f]" />
                    <span>Educational News Quest</span>
                  </div>
                  <p className="text-[11px] text-[#6e685f] mt-0.5">
                    Calm 2-minute edition quiz with zero streaks, timers, or guilt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleShowNewsQuest()}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    currentProfile.questProgress?.showNewsQuest !== false
                      ? 'bg-[#4e6c58] text-white border-[#4e6c58]'
                      : 'bg-white text-[#6e685f] border-[#d8ccc0]'
                  }`}
                  title="Toggle News Quest on/off for this edition"
                >
                  {currentProfile.questProgress?.showNewsQuest !== false ? 'Enabled' : 'Paused'}
                </button>
              </div>

              {/* Badges / Points Summary */}
              <div className="mt-2.5 pt-2 border-t border-[#e8dacd] flex items-center justify-between text-[11px] text-[#5c5449]">
                <span>Knowledge Points: <strong className="text-[#1e1b18]">{currentProfile.questProgress?.totalPoints || 0} pts</strong></span>
                <span>Badges: <strong className="text-[#4e6c58]">{(currentProfile.questProgress?.unlockedBadgeIds || []).length} earned</strong></span>
              </div>
            </div>

            {/* Add New Profile Buttons */}
            <div className="space-y-2">
              {onOpenNewProfileSetup ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenNewProfileSetup();
                  }}
                  className="w-full py-2.5 px-4 bg-[#b9533f] hover:bg-[#963f2e] text-[#faf7f2] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Start New Reader Setup</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full py-2.5 px-4 bg-[#1e1b18] hover:bg-[#342f2b] text-[#faf7f2] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Quick Add Reader Profile</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Create Profile Form */
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1e1b18] mb-1">Reader's Name</label>
              <input
                type="text"
                placeholder="e.g. Maya Rao"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#cbbfb0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#b9533f]"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1b18] mb-1">
                Newspaper Title <span className="text-[#8f887d] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder={newName.trim() ? `${newName.trim()}'s Newsroom` : "e.g. Maya's Newsroom"}
                value={newEditionTitle}
                onChange={(e) => setNewEditionTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#cbbfb0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#b9533f]"
              />
              <p className="text-[11px] text-[#6e685f] mt-1">
                Leave blank to default to {newName.trim() ? `${newName.trim()}'s Newsroom` : "[Name]'s Newsroom"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1b18] mb-1.5">Age Range</label>
              <div className="grid grid-cols-3 gap-1.5">
                {AGE_RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedAge(r.id)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedAge === r.id
                        ? 'bg-[#1e1b18] text-white border-[#1e1b18]'
                        : 'bg-white text-[#5c5449] border-[#d8ccc0]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1b18] mb-1.5">
                Select Topics of Interest
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TOPICS.map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleToggleTopic(topic.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[#b9533f] text-[#faf7f2] border-[#b9533f]'
                          : 'bg-white text-[#5c5449] border-[#d8ccc0]'
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1b18] mb-1.5">
                Default Explanation Voice
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['executive', 'conversational', 'storyteller'] as VoicePreset[]).map((preset) => {
                  const isChecked = selectedPreset === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedPreset(preset)}
                      className={`p-2 text-xs font-semibold capitalize rounded-lg border text-center transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#1e1b18] text-white border-[#1e1b18]'
                          : 'bg-white text-[#5c5449] border-[#d8ccc0]'
                      }`}
                    >
                      {preset === 'executive' ? 'Quick Brief' : preset === 'conversational' ? 'Friendly' : 'Storyteller'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 text-xs font-semibold text-[#5c5449] bg-[#ede5dc] hover:bg-[#e2d7cb] rounded-lg cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#b9533f] hover:bg-[#963f2e] rounded-lg cursor-pointer shadow-xs"
              >
                Create Edition
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
