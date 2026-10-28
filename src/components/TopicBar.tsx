import React from 'react';
import { TopicCategory } from '../types';
import { SlidersHorizontal, Bookmark } from 'lucide-react';

interface TopicBarProps {
  selectedTopic: TopicCategory | 'all' | 'saved';
  onSelectTopic: (topic: TopicCategory | 'all' | 'saved') => void;
  availableTopics: TopicCategory[];
  totalStoriesCount: number;
  savedStoriesCount: number;
  onOpenCustomizeTopics: () => void;
}

const TOPIC_LABELS: Record<TopicCategory, { label: string; activeClass: string }> = {
  economy: { label: 'Markets & Economy', activeClass: 'bg-[#963f2e] text-white border-[#963f2e]' },
  tech: { label: 'Technology & AI', activeClass: 'bg-[#2c3e50] text-white border-[#2c3e50]' },
  policy: { label: 'Policy & Governance', activeClass: 'bg-[#8a5d2b] text-white border-[#8a5d2b]' },
  world: { label: 'World Intelligence', activeClass: 'bg-[#8b4352] text-white border-[#8b4352]' },
  climate: { label: 'Climate & Infra', activeClass: 'bg-[#3b5744] text-white border-[#3b5744]' },
};

export const TopicBar: React.FC<TopicBarProps> = ({
  selectedTopic,
  onSelectTopic,
  availableTopics,
  totalStoriesCount,
  savedStoriesCount,
  onOpenCustomizeTopics,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4dcd3] pb-3 mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelectTopic('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
            selectedTopic === 'all'
              ? 'bg-[#1e1b18] text-[#faf7f2] border-[#1e1b18] shadow-2xs'
              : 'bg-[#ffffff] text-[#5c5449] border-[#d8ccc0] hover:border-[#1e1b18] hover:text-[#1e1b18]'
          }`}
        >
          All Topics ({totalStoriesCount})
        </button>

        {availableTopics.map((topic) => {
          const info = TOPIC_LABELS[topic] || { label: topic, activeClass: 'bg-[#b9533f] text-white border-[#b9533f]' };
          const isActive = selectedTopic === topic;

          return (
            <button
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? `${info.activeClass} shadow-2xs`
                  : 'bg-[#ffffff] text-[#5c5449] border-[#d8ccc0] hover:border-[#1e1b18] hover:text-[#1e1b18]'
              }`}
            >
              {info.label}
            </button>
          );
        })}

        {/* Saved for Later Filter Pill */}
        <button
          onClick={() => onSelectTopic('saved')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
            selectedTopic === 'saved'
              ? 'bg-[#b9533f] text-white border-[#b9533f] shadow-2xs'
              : 'bg-[#ffffff] text-[#5c5449] border-[#d8ccc0] hover:border-[#b9533f] hover:text-[#b9533f]'
          }`}
          title="View articles you saved for later"
        >
          <Bookmark className="w-3 h-3" />
          <span>Saved ({savedStoriesCount})</span>
        </button>

        {/* Customize Topics Pill */}
        <button
          onClick={onOpenCustomizeTopics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-dashed border-[#cbbfb0] text-[#5c5449] bg-[#f7efe9] hover:bg-[#ede5dc] hover:border-[#8f887d] hover:text-[#1e1b18] transition-all cursor-pointer"
          title="Add or remove topics for your personal edition"
        >
          <SlidersHorizontal className="w-3 h-3 text-[#b9533f]" />
          <span>Customize Topics</span>
        </button>
      </div>

      <div className="hidden lg:flex items-center text-xs text-[#8f887d] italic font-serif-editorial">
        Click any headline to open conversational voice synthesis
      </div>
    </div>
  );
};
