import React, { useState } from 'react';
import { CompanionMood, SlangLevel } from '../types';
import { Sparkles, MessageCircle, ChevronDown, ChevronUp, EyeOff } from 'lucide-react';

interface EditorialCompanionProps {
  mood?: CompanionMood;
  message?: string;
  category?: string;
  slangLevel?: SlangLevel;
  onDismiss?: () => void;
  compact?: boolean;
}

export const EditorialCompanion: React.FC<EditorialCompanionProps> = ({
  mood = 'curious',
  message,
  category,
  slangLevel = 'subtle',
  onDismiss,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [currentMood, setCurrentMood] = useState<CompanionMood>(mood);

  // Dynamic commentary tailored to category and slang level
  const getDefaultMessage = () => {
    if (message) return message;

    if (slangLevel === 'vibe') {
      switch (currentMood) {
        case 'hyped':
          return 'No cap, this development is moving fast! Keep your eyes on the timeline.';
        case 'thoughtful':
          return 'Lowkey fascinating how this connects back to what happened last month.';
        case 'skeptical':
          return 'Take the headline with a grain of salt — check the analysis tab below.';
        case 'chill':
          return 'Grab a coffee, this one’s a smooth, easy read with zero fluff.';
        case 'curious':
        default:
          return 'Hey! I pulled this because it hits different for your morning watchlist.';
      }
    }

    switch (currentMood) {
      case 'hyped':
        return 'Major shift underway here — check the key indicators below!';
      case 'thoughtful':
        return 'Notice how this policy balances economic growth with long-term stability.';
      case 'skeptical':
        return 'Forward estimates are projections from analysts, not guaranteed facts.';
      case 'chill':
        return 'A concise brief to keep you informed in under three minutes.';
      case 'curious':
      default:
        return category
          ? `Following ${category}? Here is the core context you need to know.`
          : 'I’m Pip, your editorial companion. I highlight the signals in your morning edition!';
    }
  };

  // SVG-based expressive illustrated character avatar
  const renderAvatar = () => {
    return (
      <div className="relative w-11 h-11 shrink-0 animate-companion-bob">
        <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
          {/* Base Head / Body Capsule */}
          <rect
            x="6"
            y="6"
            width="36"
            height="36"
            rx="14"
            className="fill-[#fbeae5] stroke-[#e25c50] stroke-2"
          />

          {/* Cheeks */}
          <circle cx="12" cy="27" r="2.5" className="fill-[#f5c7bc] opacity-80" />
          <circle cx="36" cy="27" r="2.5" className="fill-[#f5c7bc] opacity-80" />

          {/* Expressive Eyes depending on mood */}
          {currentMood === 'hyped' && (
            <>
              {/* Star / sparkle eyes */}
              <path d="M 17 21 L 18 18 L 19 21 L 22 22 L 19 23 L 18 26 L 17 23 L 14 22 Z" className="fill-[#e25c50]" />
              <path d="M 29 21 L 30 18 L 31 21 L 34 22 L 31 23 L 30 26 L 29 23 L 26 22 Z" className="fill-[#e25c50]" />
            </>
          )}

          {currentMood === 'thoughtful' && (
            <>
              {/* Looking up-right thoughtfully */}
              <circle cx="19" cy="19" r="3" className="fill-[#181513]" />
              <circle cx="33" cy="19" r="3" className="fill-[#181513]" />
              <line x1="14" y1="15" x2="20" y2="17" className="stroke-[#181513] stroke-2 stroke-linecap-round" />
              <line x1="28" y1="17" x2="34" y2="15" className="stroke-[#181513] stroke-2 stroke-linecap-round" />
            </>
          )}

          {currentMood === 'skeptical' && (
            <>
              {/* One raised eyebrow, narrowed eyes */}
              <ellipse cx="17" cy="22" rx="3" ry="1.5" className="fill-[#181513]" />
              <circle cx="31" cy="21" r="2.5" className="fill-[#181513]" />
              <line x1="28" y1="15" x2="35" y2="17" className="stroke-[#e25c50] stroke-2" />
            </>
          )}

          {currentMood === 'chill' && (
            <>
              {/* Relaxed smiling curve eyes */}
              <path d="M 15 22 Q 18 19 21 22" fill="none" className="stroke-[#181513] stroke-2 stroke-linecap-round" />
              <path d="M 27 22 Q 30 19 33 22" fill="none" className="stroke-[#181513] stroke-2 stroke-linecap-round" />
            </>
          )}

          {currentMood === 'curious' && (
            <>
              {/* Wide curious friendly eyes with white catchlight */}
              <circle cx="17" cy="21" r="3" className="fill-[#181513]" />
              <circle cx="18" cy="20" r="1" className="fill-[#ffffff]" />
              <circle cx="31" cy="21" r="3" className="fill-[#181513]" />
              <circle cx="32" cy="20" r="1" className="fill-[#ffffff]" />
            </>
          )}

          {/* Smile / Mouth */}
          {currentMood === 'hyped' ? (
            <path d="M 20 29 Q 24 35 28 29 Z" className="fill-[#e25c50]" />
          ) : currentMood === 'skeptical' ? (
            <line x1="21" y1="31" x2="27" y2="29" className="stroke-[#181513] stroke-2 stroke-linecap-round" />
          ) : (
            <path d="M 20 29 Q 24 33 28 29" fill="none" className="stroke-[#181513] stroke-2 stroke-linecap-round" />
          )}

          {/* Tiny Beret / Editorial Feather Cap */}
          <path d="M 26 8 C 34 8 38 12 34 14 C 30 15 24 13 22 12 Z" className="fill-[#9b2c48]" />
          <circle cx="32" cy="9" r="1.5" className="fill-[#e25c50]" />
        </svg>

        {/* Small Mood Badge */}
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#ffffff] border border-[#e4dcd3] rounded-full flex items-center justify-center text-[9px] shadow-2xs">
          {currentMood === 'hyped' ? '⚡' : currentMood === 'skeptical' ? '🧐' : currentMood === 'thoughtful' ? '💡' : '✨'}
        </span>
      </div>
    );
  };

  return (
    <aside aria-label="Pip Editorial Companion" className="relative group bg-[#faf7f2] border border-[#e4dcd3] rounded-2xl p-3 sm:p-4 shadow-sm transition-all hover:border-[#d4c8bd]">
      <div className="flex items-start gap-3">
        {/* Click avatar to cycle moods interactively */}
        <button
          onClick={() => {
            const moods: CompanionMood[] = ['curious', 'hyped', 'thoughtful', 'chill', 'skeptical'];
            const nextIdx = (moods.indexOf(currentMood) + 1) % moods.length;
            setCurrentMood(moods[nextIdx]);
          }}
          className="focus:outline-hidden hover:scale-105 transition-transform"
          title="Click to change Pip's mood"
        >
          {renderAvatar()}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-editorial font-bold text-xs text-[#181513]">
                Pip
              </span>
              <span className="text-[10px] font-mono-meta uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#fbeae5] text-[#9b2c48]">
                {currentMood}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[#8f887d]">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-lg hover:bg-[#ffffff] hover:text-[#181513] transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1 rounded-lg hover:bg-[#ffffff] hover:text-[#e25c50] transition-colors"
                  title="Hide Pip for this session"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Speech Bubble */}
          {isExpanded && (
            <div className="relative bg-[#ffffff] border border-[#e4dcd3] rounded-xl p-2.5 sm:p-3 text-xs text-[#3a332a] leading-relaxed shadow-2xs animate-paper-fade">
              {/* Little triangle pointer towards Pip */}
              <div className="absolute -left-1.5 top-3 w-3 h-3 bg-[#ffffff] border-l border-b border-[#e4dcd3] transform rotate-45" />
              <p className="relative z-10 font-sans">
                {getDefaultMessage()}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
