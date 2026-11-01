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
    id: 'finance',
    title: 'Finance & Markets',
    desc: 'Stock markets, startups, personal finance, business capex, and central banking.',
    badge: 'bg-[#fbeae5] text-[#e25c50] border-[#f3c8bc]',
  },
  {
    id: 'tech',
    title: 'Technology & AI',
    desc: 'Open-weight models, semiconductor cleanrooms, sovereign cloud, and computing.',
    badge: 'bg-[#eee8f8] text-[#7c66dc] border-[#d7cbf0]',
  },
  {
    id: 'policy',
    title: 'Politics & Governance',
    desc: 'National infrastructure, dedicated freight corridors, digital public missions.',
    badge: 'bg-[#fdf2e9] text-[#b35a20] border-[#f5d9c2]',
  },
  {
    id: 'world',
    title: 'World Intelligence',
    desc: 'International trade, multilateral climate tariffs, and global technology alliances.',
    badge: 'bg-[#f6eef2] text-[#9b2c48] border-[#e8cbd5]',
  },
  {
    id: 'climate',
    title: 'Climate & Energy',
    desc: 'Grid-scale battery storage, deep-water floating wind, and clean industrial transition.',
    badge: 'bg-[#e3ece5] text-[#3e5f49] border-[#c1d6c7]',
  },
  {
    id: 'science',
    title: 'Science & Space',
    desc: 'ISRO space docking, orbital stations, and radio astronomy cosmic discoveries.',
    badge: 'bg-[#e8f0fe] text-[#2458b8] border-[#c2d7fc]',
  },
  {
    id: 'sports_culture',
    title: 'Sports & Culture',
    desc: 'WPL franchise expansion, indie gaming heritage awards, and contemporary arts.',
    badge: 'bg-[#fbf0ea] text-[#bc4b25] border-[#f6d2c4]',
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#181513]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#e4dcd3] animate-paper-fade">
        <div className="flex items-center justify-between pb-3 border-b border-[#e4dcd3] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#fbeae5] text-[#e25c50]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-lg font-bold text-[#181513]">Customize Edition Topics</h3>
              <p className="text-xs text-[#6e685f]">
                Select subjects for {currentProfile.name}'s daily edition
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8f887d] hover:text-[#181513] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {ALL_TOPICS.map((topic) => {
            const isChecked = selectedTopics.includes(topic.id);
            return (
              <div
                key={topic.id}
                onClick={() => handleToggle(topic.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-[#faf7f2] border-[#e25c50]/50 shadow-2xs'
                    : 'bg-[#ffffff] border-[#e4dcd3] hover:border-[#cbbfb0]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                    isChecked
                      ? 'bg-[#e25c50] border-[#e25c50] text-[#ffffff]'
                      : 'border-[#d8ccc0] bg-[#ffffff]'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-serif-editorial text-sm font-bold text-[#181513]">
                      {topic.title}
                    </span>
                    <span className={`text-[10px] font-mono-meta uppercase tracking-wider px-2 py-0.5 rounded-full border ${topic.badge}`}>
                      {topic.id === 'sports_culture' ? 'Culture' : topic.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#6e685f] leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-[#e4dcd3] flex items-center justify-between">
          <span className="text-xs text-[#8f887d] font-mono-meta">
            {selectedTopics.length} of {ALL_TOPICS.length} sections selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6e685f] hover:text-[#181513] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#e25c50] text-[#ffffff] hover:bg-[#cf4b3f] transition-all shadow-xs cursor-pointer"
            >
              {isSavedNotice ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Update Edition</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
