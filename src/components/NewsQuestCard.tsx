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
  Check
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

  // Derive questions matching today's active edition stories
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

  if (!currentQuestion) return null;

  // If reader turned off the News Quest
  if (!questProgress.showNewsQuest) {
    return (
      <div className="bg-[#f7efe9] border border-[#e8dacd] rounded-2xl p-4 my-8 flex items-center justify-between text-xs text-[#6e685f] shadow-2xs animate-paper-fade">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b9533f]" />
          <span>The educational <strong>News Quest</strong> is hidden for your edition.</span>
        </div>
        <button
          onClick={() => toggleShowNewsQuest(true)}
          className="px-3 py-1 bg-white hover:bg-[#faf7f2] text-[#1e1b18] font-semibold border border-[#d8ccc0] rounded-xl cursor-pointer transition-colors"
        >
          Show News Quest
        </button>
      </div>
    );
  }

  // Find the story referenced by the question to allow opening directly
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
    } else {
      // Create fallback story object if dynamic
      onOpenStory({
        id: currentQuestion.storyId,
        title: currentQuestion.storyTitle,
        deck: currentQuestion.explanation,
        content: currentQuestion.explanation,
        sourceName: 'Curio Dispatch Verified Feed',
        canonicalUrl: '#',
        publishedAt: new Date().toISOString(),
        timeAgo: 'Today',
        category: currentQuestion.category,
        readingMinutes: 3,
        sourceMode: 'snapshot',
      });
    }
  };

  const unlockedBadges = QUEST_BADGES.filter((b) =>
    questProgress.unlockedBadgeIds.includes(b.id)
  );

  return (
    <section
      aria-label="Daily News Quest"
      className="my-10 bg-[#f9f3ec] border-2 border-[#e5d6c5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden animate-paper-fade"
    >
      {/* Decorative Editorial Corner Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e2d5c7] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono-meta font-bold uppercase tracking-widest bg-[#b9533f] text-[#faf7f2] px-2.5 py-0.5 rounded-full">
              Educational Mini-Quest
            </span>
            <span className="text-xs text-[#8f887d] font-mono-meta">• Daily Edition Quiz</span>
          </div>
          <h3 className="font-masthead text-xl sm:text-2xl font-bold text-[#1e1b18]">
            The Curio News Quest
          </h3>
          <p className="text-xs text-[#6e685f] font-serif-editorial mt-0.5">
            A calm 2-minute daily check on what’s shaping the world. No streaks, no timers, no pressure.
          </p>
        </div>

        {/* Stats & Actions Header Pill */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Total Knowledge Points */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d8ccc0] rounded-xl text-xs font-semibold text-[#1e1b18] shadow-2xs"
            title="Total Knowledge Points earned from edition quizzes"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b9533f]" />
            <span>{questProgress.totalPoints} pts</span>
          </div>

          {/* Badges Earned */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d8ccc0] rounded-xl text-xs font-semibold text-[#4e6c58] shadow-2xs"
            title={`${unlockedBadges.length} knowledge badges unlocked`}
          >
            <Award className="w-3.5 h-3.5 text-[#4e6c58]" />
            <span>{unlockedBadges.length} Badges</span>
          </div>

          {/* Hide / Turn Off Option */}
          <button
            onClick={() => toggleShowNewsQuest(false)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#8f887d] hover:text-[#b9533f] hover:bg-[#ede5dc] rounded-xl transition-colors cursor-pointer"
            title="Hide News Quest from your edition (can be re-enabled in profile settings)"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hide</span>
          </button>
        </div>
      </div>

      {/* Completion View vs Active Quiz Card */}
      {allAnswered && !isReviewMode ? (
        <div className="py-4 space-y-6">
          <div className="bg-white border border-[#d8ccc0] rounded-2xl p-6 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#edf4ee] border border-[#bed8c2] text-[#4e6c58] flex items-center justify-center mx-auto text-xl shadow-2xs">
              ✨
            </div>
            <h4 className="font-masthead text-xl font-bold text-[#1e1b18]">
              Today's News Quest Complete!
            </h4>
            <p className="text-sm text-[#5c5449] max-w-lg mx-auto font-serif-editorial">
              You answered <strong>{correctCount} of {questions.length}</strong> inquiries correctly and expanded your understanding of today’s reporting.
            </p>

            <div className="inline-flex items-center gap-3 pt-2 text-xs">
              <span className="bg-[#f7efe9] text-[#b9533f] px-3 py-1.5 rounded-xl font-bold border border-[#e8dacd]">
                +{correctCount * 25} Knowledge Points
              </span>
              <span className="text-[#6e685f]">
                Ready for tomorrow's edition
              </span>
            </div>
          </div>

          {/* Earned Badges Showcase */}
          {unlockedBadges.length > 0 && (
            <div className="bg-white/80 border border-[#e2d5c7] rounded-2xl p-5">
              <h5 className="font-mono-meta text-xs font-bold uppercase tracking-wider text-[#1e1b18] mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#b9533f]" />
                <span>Your Knowledge Badges ({unlockedBadges.length})</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3 bg-[#faf7f2] border border-[#e5d6c5] rounded-xl flex items-start gap-2.5 shadow-2xs"
                  >
                    <span className="text-2xl select-none">{badge.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#1e1b18]">{badge.title}</div>
                      <div className="text-[11px] text-[#6e685f] leading-snug mt-0.5">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <button
              onClick={() => {
                setIsReviewMode(true);
                setCurrentIndex(0);
              }}
              className="px-4 py-2 bg-white hover:bg-[#faf7f2] text-[#1e1b18] font-semibold border border-[#d8ccc0] rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              Review Questions & Explanations
            </button>

            <button
              onClick={() => {
                resetQuestProgress();
                setCurrentIndex(0);
                setSelectedOption(null);
                setHasSubmittedCurrent(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[#8f887d] hover:text-[#b9533f] transition-colors cursor-pointer"
              title="Reset questions for practice"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
          </div>

          {/* Clear Anti-Dark Pattern & Supporter Notice */}
          <div className="border-t border-[#e2d5c7] pt-4 text-[11px] text-[#8f887d] font-mono-meta flex items-center justify-between flex-wrap gap-2">
            <span>🛡️ Personal learning only: no monetary rewards, gambling mechanics, or guilt-based streaks.</span>
            <span className="text-[#b9533f] font-semibold">Curio Educational Edition</span>
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="space-y-5">
          {/* Progress bar and inquiry meta */}
          <div className="flex items-center justify-between text-xs text-[#6e685f]">
            <div className="flex items-center gap-2">
              <span className="font-mono-meta font-bold text-[#1e1b18]">
                Inquiry {currentIndex + 1} of {questions.length}
              </span>
              <span>•</span>
              <span className="capitalize bg-white px-2 py-0.5 rounded-md border border-[#e4dcd3] font-mono-meta text-[11px] text-[#b9533f]">
                {currentQuestion.category}
              </span>
              <span className="hidden sm:inline text-[#8f887d]">• {currentQuestion.conceptTag}</span>
            </div>

            {hasSubmittedCurrent && (
              <span
                className={`font-semibold text-xs flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-[#edf4ee] text-[#4e6c58]'
                    : 'bg-[#fdf0ed] text-[#b9533f]'
                }`}
              >
                {selectedOption === currentQuestion.correctIndex ? (
                  <>
                    <Check className="w-3 h-3" />
                    Correct (+25 pts)
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Review Below
                  </>
                )}
              </span>
            )}
          </div>

          {/* Question Headline */}
          <div>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#1e1b18] leading-snug">
              {currentQuestion.question}
            </h4>
          </div>

          {/* 4 Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let cardStyle =
                'bg-white border-[#d8ccc0] text-[#3a332a] hover:border-[#b9533f] hover:bg-[#fffbf8]';

              if (hasSubmittedCurrent) {
                if (isCorrect) {
                  cardStyle =
                    'bg-[#edf4ee] border-[#4e6c58] text-[#24422e] font-semibold ring-1 ring-[#4e6c58]';
                } else if (isSelected && !isCorrect) {
                  cardStyle =
                    'bg-[#fdf0ed] border-[#b9533f] text-[#852c1b] ring-1 ring-[#b9533f]';
                } else {
                  cardStyle = 'bg-white/60 border-[#e8dacd] text-[#8f887d] opacity-75';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasSubmittedCurrent}
                  className={`p-3.5 rounded-xl border text-left transition-all text-xs flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${cardStyle}`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono-meta font-bold text-[10px] shrink-0 ${
                      hasSubmittedCurrent && isCorrect
                        ? 'bg-[#4e6c58] text-white'
                        : hasSubmittedCurrent && isSelected
                        ? 'bg-[#b9533f] text-white'
                        : 'bg-[#ede5dc] text-[#5c5449]'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-relaxed mt-0.5">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Grounded Explanation & Source Story Link (Revealed on Answer) */}
          {hasSubmittedCurrent && (
            <div className="bg-white border border-[#d8ccc0] rounded-2xl p-4 sm:p-5 space-y-3 animate-paper-fade">
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                    selectedOption === currentQuestion.correctIndex ? 'bg-[#4e6c58]' : 'bg-[#b9533f]'
                  }`}
                >
                  {selectedOption === currentQuestion.correctIndex ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="text-xs font-bold text-[#1e1b18]">
                    {selectedOption === currentQuestion.correctIndex
                      ? 'Grounded Story Fact:'
                      : 'Correct Answer & Explanation:'}
                  </div>
                  <p className="text-xs text-[#5c5449] leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>

              {/* Verified Source Story Connection Button */}
              <div className="pt-2 border-t border-[#f0e6dc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleOpenSourceStory}
                  className="inline-flex items-center gap-1.5 text-[#b9533f] hover:text-[#963f2e] font-semibold underline underline-offset-4 cursor-pointer"
                  title="Open the full story in the reader drawer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#b9533f]" />
                  <span>
                    Read source story in your edition: &ldquo;{currentQuestion.storyTitle}&rdquo; →
                  </span>
                </button>

                <span className="text-[11px] text-[#8f887d] font-mono-meta flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#4e6c58]" />
                  Verified in today's edition
                </span>
              </div>
            </div>
          )}

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 text-xs text-[#6e685f] hover:text-[#1e1b18] font-semibold cursor-pointer"
                >
                  ← Previous
                </button>
              )}

              {!hasSubmittedCurrent && (
                <button
                  type="button"
                  onClick={handleSkipQuestion}
                  className="text-xs text-[#8f887d] hover:text-[#b9533f] cursor-pointer"
                  title="Skip to next inquiry with no penalty"
                >
                  Skip for now
                </button>
              )}
            </div>

            {hasSubmittedCurrent && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b9533f] hover:bg-[#963f2e] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>
                  {currentIndex === questions.length - 1
                    ? 'Complete Today’s Quest'
                    : 'Next Inquiry'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
