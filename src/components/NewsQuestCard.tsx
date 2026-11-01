import React, { useState } from 'react';
import { Story, QuestQuestion } from '../types';
import { useProfile } from '../context/ProfileContext';
import { questService, QUEST_BADGES } from '../services/questService';
import {
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ChevronRight,
  EyeOff,
  RotateCcw,
  ShieldCheck,
  Check,
  Gamepad2,
  ExternalLink
} from 'lucide-react';

interface NewsQuestCardProps {
  stories: Story[];
  onOpenStory: (story: Story) => void;
}

export const NewsQuestCard: React.FC<NewsQuestCardProps> = ({ stories, onOpenStory }) => {
  const { currentProfile, recordQuestAnswer, toggleShowNewsQuest, resetQuestProgress } = useProfile();
  const questProgress = currentProfile.questProgress || {
    totalPoints: 0,
    unlockedBadgeIds: [],
    completedEditionDates: [],
    answeredQuestions: {},
    showNewsQuest: true,
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [recentlyUnlockedBadges, setRecentlyUnlockedBadges] = useState<string[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Derive questions matching today's active real edition stories
  const questions: QuestQuestion[] = React.useMemo(() => {
    return questService.getQuestionsForStories(stories);
  }, [stories]);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Check if current question was already answered in saved state
  const savedAnswer = currentQuestion ? questProgress.answeredQuestions[currentQuestion.id] : undefined;

  // Sync internal state when navigating between questions
  React.useEffect(() => {
    if (savedAnswer) {
      setSelectedOption(savedAnswer.selectedIndex);
      setHasSubmittedCurrent(true);
    } else {
      setSelectedOption(null);
      setHasSubmittedCurrent(false);
    }
  }, [currentIndex, savedAnswer]);

  // If reader turned off the News Quest
  if (!questProgress.showNewsQuest) {
    return (
      <div className="bg-[#f7efe9] border border-[#e8dacd] rounded-2xl p-4 my-4 flex items-center justify-between text-xs text-[#6e685f] shadow-2xs animate-paper-fade">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e25c50]" />
          <span>The educational <strong>News Quest</strong> is paused for your edition.</span>
        </div>
        <button
          onClick={() => toggleShowNewsQuest(true)}
          className="px-3 py-1 bg-[#ffffff] hover:bg-[#faf7f2] text-[#181513] font-semibold border border-[#d8ccc0] rounded-xl cursor-pointer transition-colors"
        >
          Resume News Quest
        </button>
      </div>
    );
  }

  // If no questions could be derived (e.g. 0 live stories loaded yet)
  if (!currentQuestion) {
    return (
      <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-2xl p-8 text-center space-y-3 animate-paper-fade">
        <div className="w-10 h-10 rounded-2xl bg-[#eee8f8] text-[#7c66dc] flex items-center justify-center mx-auto">
          <Gamepad2 className="w-5 h-5" />
        </div>
        <h4 className="font-serif-editorial text-base font-bold text-[#181513]">
          No Active Live Stories For Quiz
        </h4>
        <p className="text-xs text-[#6e685f] max-w-sm mx-auto leading-relaxed">
          News Quest questions are generated strictly from verified real articles retrieved in your current edition. Fetch live stories using the Refresh button to activate today’s questions.
        </p>
      </div>
    );
  }

  const referencedStory = stories.find((s) => s.id === currentQuestion.storyId);

  // Check if all questions have been completed
  const allAnswered = questions.every((q) => questProgress.answeredQuestions[q.id]);
  const correctCount = questions.filter((q) => questProgress.answeredQuestions[q.id]?.isCorrect).length;

  const handleSelectOption = (index: number) => {
    if (hasSubmittedCurrent) return;
    setSelectedOption(index);
    setHasSubmittedCurrent(true);

    const isCorrect = index === currentQuestion.correctIndex;
    const isLast = currentIndex === questions.length - 1;

    const { newBadgeIds } = recordQuestAnswer(
      currentQuestion.id,
      index,
      isCorrect,
      currentQuestion.category,
      isLast,
      questions.length
    );

    if (newBadgeIds.length > 0) {
      setRecentlyUnlockedBadges((prev) => [...prev, ...newBadgeIds]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsReviewMode(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkipQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleOpenSourceStory = () => {
    if (referencedStory) {
      onOpenStory(referencedStory);
    } else if (currentQuestion.sourceUrl) {
      window.open(currentQuestion.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const unlockedBadges = QUEST_BADGES.filter((b) =>
    questProgress.unlockedBadgeIds.includes(b.id)
  );

  return (
    <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5 animate-paper-fade text-[#181513]">
      {/* Top Banner: Title, Total Points & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e4dcd3] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#eee8f8] text-[#7c66dc] flex items-center justify-center font-bold text-lg shadow-2xs">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-editorial text-lg font-bold text-[#181513]">
                Daily News Quest
              </h3>
              <span className="text-[10px] font-mono-meta uppercase tracking-wider font-bold bg-[#e3ece5] text-[#3e5f49] px-2 py-0.5 rounded-full border border-[#c1d6c7]">
                Live Wire Facts
              </span>
            </div>
            <p className="text-xs text-[#6e685f]">
              3 quick questions testing today's retrieved dispatches • No penalty streaks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Knowledge Points Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] border border-[#e4dcd3] rounded-xl text-xs font-mono-meta font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#e25c50]" />
            <span className="text-[#181513]">{questProgress.totalPoints} pts</span>
          </div>

          {/* Reset progress */}
          <button
            onClick={resetQuestProgress}
            className="p-2 text-[#8f887d] hover:text-[#181513] hover:bg-[#ffffff] rounded-xl transition-colors"
            title="Reset quest progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Badges Ribbon (if any unlocked) */}
      {unlockedBadges.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono-meta text-[#8f887d] uppercase tracking-wider shrink-0">
            Badges:
          </span>
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#ffffff] border border-[#e4dcd3] shadow-2xs text-[11px] font-medium text-[#181513] shrink-0"
              title={badge.description}
            >
              <span>{badge.icon}</span>
              <span>{badge.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Question Panel */}
      <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs border-b border-[#f0eae1] pb-2.5">
          <span className="font-mono-meta font-bold text-[#e25c50] uppercase tracking-wider text-[11px]">
            Question {currentIndex + 1} of {questions.length} • {currentQuestion.category.toUpperCase()}
          </span>

          <span className="text-[11px] font-mono-meta text-[#8f887d]">
            +25 pts for first correct answer
          </span>
        </div>

        {/* Question Text */}
        <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-[#181513] leading-snug">
          {currentQuestion.question}
        </h4>

        {/* Option Cards */}
        <div className="space-y-2">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            let btnStyle = 'bg-[#ffffff] border-[#e4dcd3] hover:border-[#cbbfb0] text-[#181513]';

            if (hasSubmittedCurrent) {
              if (isCorrect) {
                btnStyle = 'bg-[#e3ece5] border-[#4e6c58] text-[#2d5238] font-semibold';
              } else if (isSelected) {
                btnStyle = 'bg-[#fbeae5] border-[#e25c50] text-[#9b2c48]';
              } else {
                btnStyle = 'bg-[#ffffff] border-[#e4dcd3] opacity-60 text-[#8f887d]';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={hasSubmittedCurrent}
                className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-md flex items-center justify-center font-mono-meta font-bold text-[11px] bg-[#faf7f2] border border-[#e4dcd3] shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation & Source Link upon submission */}
        {hasSubmittedCurrent && (
          <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-xl p-4 space-y-3 animate-paper-fade">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                  selectedOption === currentQuestion.correctIndex ? 'bg-[#4e6c58]' : 'bg-[#e25c50]'
                }`}
              >
                {selectedOption === currentQuestion.correctIndex ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-xs text-[#181513] block">
                  {selectedOption === currentQuestion.correctIndex
                    ? '✓ Correct! Verified Live Reporting:'
                    : 'The Verified Fact:'}
                </span>
                <p className="text-xs text-[#5c5449] leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f0eae1] flex items-center justify-between">
              <button
                type="button"
                onClick={handleOpenSourceStory}
                className="inline-flex items-center gap-1.5 text-xs text-[#e25c50] hover:text-[#cf4b3f] font-semibold underline underline-offset-4"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open verified source article: &ldquo;{currentQuestion.storyTitle}&rdquo; →</span>
              </button>

              <span className="text-[10px] font-mono-meta text-[#4e6c58] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Grounded live fact</span>
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f0eae1]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 text-xs font-semibold text-[#6e685f] hover:text-[#181513] disabled:opacity-30"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {!hasSubmittedCurrent && (
              <button
                type="button"
                onClick={handleSkipQuestion}
                className="px-3 py-1.5 text-xs text-[#8f887d] hover:text-[#181513]"
              >
                Skip
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#181513] hover:bg-[#342f2b] text-[#ffffff] text-xs font-semibold rounded-xl transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-bold text-[#4e6c58] bg-[#e3ece5] px-3 py-1.5 rounded-xl border border-[#c1d6c7]">
                Quest Finished! ({correctCount}/{questions.length} correct)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
