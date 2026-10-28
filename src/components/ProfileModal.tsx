import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TopicCategory, VoicePreset } from '../types';
import { X, UserPlus, Check, UserCheck } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TOPICS: { id: TopicCategory; label: string }[] = [
  { id: 'economy', label: 'Markets & Economy' },
  { id: 'tech', label: 'Technology & AI' },
  { id: 'policy', label: 'Policy & Governance' },
  { id: 'world', label: 'World Intelligence' },
  { id: 'climate', label: 'Climate & Infra' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profiles, currentProfile, switchProfile, createNewProfile } = useProfile();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<TopicCategory[]>(['tech', 'economy']);
  const [selectedPreset, setSelectedPreset] = useState<VoicePreset>('conversational');

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    createNewProfile(
      newName.trim(),
      selectedTopics.length > 0 ? selectedTopics : ['economy', 'tech'],
      selectedPreset
    );
    setIsCreating(false);
    setNewName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-paper-fade">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-5">
          <div>
            <h3 className="font-masthead text-lg font-bold text-zinc-900">Reader Profiles</h3>
            <p className="text-xs text-zinc-500 font-serif-editorial">
              Each reader gets an independent daily newspaper & reading voice
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer" title="Close (Esc)">
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
                        ? 'border-red-700 bg-red-50/50 shadow-xs ring-1 ring-red-700'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900">{profile.name}</span>
                        {isActive && (
                          <span className="text-[10px] bg-red-700 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Active Edition
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 capitalize">
                        Voice: <strong>{profile.voicePreset}</strong> • {profile.topics.length} topics followed
                      </div>
                    </div>
                    {isActive ? (
                      <UserCheck className="w-5 h-5 text-red-700" />
                    ) : (
                      <span className="text-xs text-zinc-400">Select</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Profile Button */}
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Reader Profile</span>
            </button>
          </div>
        ) : (
          /* Create Profile Form */
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Reader's Name</label>
              <input
                type="text"
                placeholder="e.g. Maya Rao"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-800"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
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
                          ? 'bg-red-800 text-white border-red-800'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
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
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold text-white bg-red-800 hover:bg-red-900 rounded-lg cursor-pointer shadow-xs"
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
