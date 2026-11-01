import React, { useEffect } from 'react';
import { Story } from '../types';
import { NewsQuestCard } from './NewsQuestCard';
import { X, Gamepad2 } from 'lucide-react';

interface NewsQuestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  onOpenStory: (story: Story) => void;
}

export const NewsQuestDrawer: React.FC<NewsQuestDrawerProps> = ({
  isOpen,
  onClose,
  stories,
  onOpenStory,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-[#181513]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="News Quest Daily Quiz"
          className="w-screen max-w-2xl bg-[#faf7f2] border-l border-[#e4dcd3] shadow-2xl flex flex-col animate-drawer-slide"
        >
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-[#ffffff] border-b border-[#e4dcd3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eee8f8] text-[#7c66dc] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-editorial text-lg font-bold text-[#181513]">
                  News Quest
                </h3>
                <p className="text-xs text-[#6e685f] font-mono-meta">
                  Test your understanding • 100% voluntary • No guilt streaks
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#8f887d] hover:text-[#181513] hover:bg-[#faf7f2] transition-colors"
              aria-label="Close News Quest"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <NewsQuestCard
              stories={stories}
              onOpenStory={(story) => {
                onClose();
                onOpenStory(story);
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
