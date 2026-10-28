import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TopicCategory } from '../types';
import { X, Check, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface CustomizeTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_TOPICS: { id: TopicCategory; title: string; desc: string; badge: string }[] = [
  {
    id: 'economy',
    title: 'Markets & Economy',
    desc: 'Reserve Bank policies, inflation, fiscal indicators, and corporate earnings.',
    badge: 'bg-[#f5e6e1] text-[#963f2e] border-[#e8cecb]',
  },
  {
    id: 'tech',
    title: 'Technology & AI',
    desc: 'Open-weight models, Indian tech startups, semiconductor cleanrooms, and software infra.',
    badge: 'bg-[#eef2f5] text-[#2c3e50] border-[#d5dee6]',
  },
  {
    id: 'policy',
    title: 'Policy & Governance',
    desc: 'National infrastructure, rail corridors, digital public goods, and legislation.',
    badge: 'bg-[#fbf2e3] text-[#8a5d2b] border-[#edd8be]',
  },
  {
    id: 'world',
    title: 'World Intelligence',
    desc: 'International trade, bilateral agreements, global diplomacy, and macro energy.',
    badge: 'bg-[#f8ebed] text-[#8b4352] border-[#ebd0d6]',
  },
  {
    id: 'climate',
    title: 'Climate & Infrastructure',
    desc: 'Grid-scale renewables, battery storage, clean hydrogen, and environmental policy.',
    badge: 'bg-[#edf2ee] text-[#3b5744] border-[#cbe0d0]',
  },
];

export const CustomizeTopicsModal: React.FC<CustomizeTopicsModalProps> = ({ isOpen, onClose }) => {
  const { currentProfile, updateTopics } = useProfile();
  const [selectedTopics, setSelectedTopics] = useState<TopicCategory[]>(currentProfile.topics);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    setSelectedTopics(currentProfile.topics);
  }, [currentProfile.topics, isOpen]);

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

  const handleToggle = (id: TopicCategory) => {
    setSelectedTopics((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((t) => t !== id)
          : prev // Prevent unchecking all topics
        : [...prev, id]
    );
  };

  const handleSave = () => {
    updateTopics(selectedTopics);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#e4dcd3] animate-paper-fade">
        <div className="flex items-center justify-between pb-3 border-b border-[#e4dcd3] mb-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[#b9533f]" />
            <div>
              <h3 className="font-masthead text-lg font-bold text-[#1e1b18]">Customize Edition Topics</h3>
              <p className="text-xs text-[#6e685f] font-serif-editorial">
                Select which subjects appear on {currentProfile.name}'s front page
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8f887d] hover:text-[#1e1b18] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {ALL_TOPICS.map((topic) => {
            const isChecked = selectedTopics.includes(topic.id);
            return (
              <div
                key={topic.id}
                onClick={() => handleToggle(topic.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isChecked
                    ? 'border-[#b9533f] bg-[#fbf0ec] shadow-xs'
                    : 'border-[#e4dcd3] bg-white hover:border-[#cbbfb0] hover:bg-[#f7f2eb]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#1e1b18]">{topic.title}</span>
                    <span className={`text-[10px] font-mono-meta px-2 py-0.5 rounded-full border ${topic.badge}`}>
                      {topic.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#5c5449] leading-relaxed font-serif-editorial">
                    {topic.desc}
                  </p>
                </div>

                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                      isChecked ? 'bg-[#b9533f] text-white' : 'border border-[#cbbfb0] bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#e4dcd3]">
          <span className="text-xs text-[#6e685f]">
            {selectedTopics.length} of {ALL_TOPICS.length} topics active
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5c5449] bg-[#ede5dc] hover:bg-[#e2d7cb] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#b9533f] hover:bg-[#963f2e] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSavedNotice ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Edition Topics</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
