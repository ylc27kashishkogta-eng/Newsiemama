import React from 'react';
import { TopicCategory, FinanceSubcategory } from '../types';
import { SlidersHorizontal, Bookmark, Layers, LayoutGrid, ChevronDown } from 'lucide-react';
import { FINANCE_SUBCATEGORY_LABELS } from '../services/feedService';

interface TopicBarProps {
  selectedTopic: TopicCategory | 'all' | 'saved';
  onSelectTopic: (topic: TopicCategory | 'all' | 'saved') => void;
  availableTopics: TopicCategory[];
  totalStoriesCount: number;
  savedStoriesCount: number;
  onOpenCustomizeTopics: () => void;
  selectedFinanceSubcategory?: FinanceSubcategory;
  onSelectFinanceSubcategory?: (sub: FinanceSubcategory) => void;
  viewMode?: 'broadsheet' | 'playcard';
  onToggleViewMode?: (mode: 'broadsheet' | 'playcard') => void;
}

const TOPIC_LABELS: Record<TopicCategory, { label: string; activeClass: string }> = {
  finance: { label: 'Finance & Markets', activeClass: 'bg-[#0f766e] text-[#ffffff] border-[#0f766e]' },
  economy: { label: 'Markets & Economy', activeClass: 'bg-[#0f766e] text-[#ffffff] border-[#0f766e]' },
  tech: { label: 'Technology & AI', activeClass: 'bg-[#0284c7] text-[#ffffff] border-[#0284c7]' },
  policy: { label: 'Policy & Governance', activeClass: 'bg-[#82351f] text-[#ffffff] border-[#82351f]' },
  world: { label: 'World Intelligence', activeClass: 'bg-[#191715] text-[#ffffff] border-[#191715]' },
  climate: { label: 'Climate & Energy', activeClass: 'bg-[#047857] text-[#ffffff] border-[#047857]' },
  science: { label: 'Science & Space', activeClass: 'bg-[#0369a1] text-[#ffffff] border-[#0369a1]' },
  sports_culture: { label: 'Sports & Culture', activeClass: 'bg-[#9e4429] text-[#ffffff] border-[#9e4429]' },
};

const FINANCE_SUBCATEGORIES: FinanceSubcategory[] = [
  'all',
  'stocks',
  'startups',
  'personal_finance',
  'business',
  'economy',
  'tech',
];

export const TopicBar: React.FC<TopicBarProps> = ({
  selectedTopic,
  onSelectTopic,
  availableTopics,
  totalStoriesCount,
  savedStoriesCount,
  onOpenCustomizeTopics,
  selectedFinanceSubcategory = 'all',
  onSelectFinanceSubcategory,
  viewMode = 'broadsheet',
  onToggleViewMode,
}) => {
  const isFinanceRelevant = selectedTopic === 'all' || selectedTopic === 'finance' || selectedTopic === 'economy';

  return (
    <div className="space-y-3 border-b border-[#e4dcd3] pb-3 mb-6">
      {/* Top Row: Primary Category Tabs & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelectTopic('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              selectedTopic === 'all'
                ? 'bg-[#181513] text-[#ffffff] border-[#181513] shadow-2xs'
                : 'bg-[#ffffff] text-[#5c5449] border-[#d8ccc0] hover:border-[#181513] hover:text-[#181513]'
            }`}
          >
            All Sections ({totalStoriesCount})
          </button>

          {availableTopics.map((topic) => {
            const info = TOPIC_LABELS[topic] || { label: topic, activeClass: 'bg-[#e25c50] text-[#ffffff] border-[#e25c50]' };
            const isActive = selectedTopic === topic;

            return (
              <button
                key={topic}
                onClick={() => onSelectTopic(topic)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? `${info.activeClass} shadow-2xs`
                    : 'bg-[#ffffff] text-[#5c5449] border-[#d8ccc0] hover:border-[#181513] hover:text-[#181513]'
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
                ? 'bg-[#e25c50] text-[#ffffff] border-[#e25c50] shadow-2xs'
                : 'bg-[#ffffff] text-[#5c5449] border-[#d8ccc0] hover:border-[#e25c50] hover:text-[#e25c50]'
            }`}
            title="View articles you saved for later"
          >
            <Bookmark className="w-3 h-3" />
            <span>Saved ({savedStoriesCount})</span>
          </button>

          {/* Customize Topics Pill */}
          <button
            onClick={onOpenCustomizeTopics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-dashed border-[#cbbfb0] text-[#5c5449] bg-[#f7efe9] hover:bg-[#ede5dc] hover:border-[#8f887d] hover:text-[#181513] transition-all cursor-pointer"
            title="Add or remove topics for your personal edition"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#e25c50]" />
            <span>Customize</span>
          </button>
        </div>

        {/* High-Visibility View Mode Switcher: Broadsheet vs Playcards */}
        {onToggleViewMode && (
          <div className="flex items-center bg-[#ffffff] border-2 border-[#e7ded3] rounded-2xl p-1 shadow-xs shrink-0">
            <button
              onClick={() => onToggleViewMode('broadsheet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                viewMode === 'broadsheet'
                  ? 'bg-[#191715] text-[#ffffff] shadow-2xs'
                  : 'text-[#5c554e] hover:text-[#191715] hover:bg-[#faf6f0]'
              }`}
              title="Classic Broadsheet Newspaper View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Broadsheet</span>
            </button>
            <button
              onClick={() => onToggleViewMode('playcard')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                viewMode === 'playcard'
                  ? 'bg-[#0f766e] text-[#ffffff] shadow-2xs ring-1 ring-[#99f6e4]'
                  : 'text-[#9e4429] bg-[#fde8df]/60 hover:bg-[#fde8df] hover:text-[#82351f]'
              }`}
              title="Modern Interactive Playcards Deck"
            >
              <Layers className="w-3.5 h-3.5 text-[#0f766e]" />
              <span>Playcards</span>
              <span className="text-[9px] bg-[#0f766e] text-[#ffffff] px-1.5 py-0.2 rounded-full uppercase font-mono-meta tracking-wider">
                Deck
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Second Row: Finance Subcategories Sub-Filter (when finance is relevant) */}
      {isFinanceRelevant && onSelectFinanceSubcategory && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs animate-paper-fade">
          <span className="text-[11px] font-mono-meta text-[#8c8278] uppercase tracking-wider shrink-0 mr-1">
            Finance Focus:
          </span>
          {FINANCE_SUBCATEGORIES.map((sub) => {
            const isSubActive = selectedFinanceSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => onSelectFinanceSubcategory(sub)}
                className={`px-2.5 py-1 text-[11px] font-mono-meta rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isSubActive
                    ? 'bg-[#fde8df] text-[#82351f] font-bold border border-[#f5cbbe]'
                    : 'text-[#5c554e] hover:bg-[#ffffff] hover:text-[#191715]'
                }`}
              >
                {FINANCE_SUBCATEGORY_LABELS[sub]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
