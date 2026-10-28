import React from 'react';
import { TopicCategory } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface TopicBarProps {
  selectedTopic: TopicCategory | 'all';
  onSelectTopic: (topic: TopicCategory | 'all') => void;
  availableTopics: TopicCategory[];
  totalStoriesCount: number;
  onOpenCustomizeTopics: () => void;
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
  onOpenCustomizeTopics,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3 mb-8">
      <div className="flex flex-wrap items-center gap-2">
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

        {/* Customize Topics Pill */}
        <button
          onClick={onOpenCustomizeTopics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-dashed border-zinc-300 text-zinc-600 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 hover:text-zinc-900 transition-all cursor-pointer"
          title="Add or remove topics for your personal edition"
        >
          <SlidersHorizontal className="w-3 h-3 text-red-800" />
          <span>Customize Topics</span>
        </button>
      </div>

      <div className="hidden lg:flex items-center text-xs text-zinc-400 italic font-serif-editorial">
        Click any headline to open conversational voice synthesis
      </div>
    </div>
  );
};
