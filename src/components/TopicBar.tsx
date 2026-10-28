import React from 'react';
import { TopicCategory } from '../types';

interface TopicBarProps {
  selectedTopic: TopicCategory | 'all';
  onSelectTopic: (topic: TopicCategory | 'all') => void;
  availableTopics: TopicCategory[];
  totalStoriesCount: number;
}

const TOPIC_LABELS: Record<TopicCategory, { label: string; badge: string }> = {
  economy: { label: 'Markets & Economy', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  tech: { label: 'Technology & AI', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  policy: { label: 'Policy & Governance', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  world: { label: 'World Intelligence', badge: 'bg-sky-50 text-sky-800 border-sky-200' },
  climate: { label: 'Climate & Infra', badge: 'bg-teal-50 text-teal-800 border-teal-200' },
};

export const TopicBar: React.FC<TopicBarProps> = ({
  selectedTopic,
  onSelectTopic,
  availableTopics,
  totalStoriesCount,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-8 overflow-x-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSelectTopic('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
            selectedTopic === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
          }`}
        >
          All Topics ({totalStoriesCount})
        </button>

        {availableTopics.map((topic) => {
          const info = TOPIC_LABELS[topic] || { label: topic, badge: 'bg-zinc-100 text-zinc-800 border-zinc-200' };
          const isActive = selectedTopic === topic;

          return (
            <button
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-red-800 text-white border-red-800 shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
              }`}
            >
              {info.label}
            </button>
          );
        })}
      </div>

      <div className="hidden md:flex items-center text-xs text-zinc-400 italic font-serif-editorial">
        Click any headline to open conversational voice synthesis
      </div>
    </div>
  );
};
