import React, { useState, useEffect, useMemo } from 'react';
import { Story, QuestQuestion } from '../types';
import { useProfile } from '../context/ProfileContext';
import { questService } from '../services/questService';
import { HISTORICAL_DISPATCHES, HistoricalDispatch } from '../data/historicalArchive';
import {
  X,
  Gamepad2,
  Sparkles,
  Calendar,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  Award,
  Check
} from 'lucide-react';

interface GamesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  onOpenStory?: (story: Story) => void;
}

export const GamesDrawer: React.FC<GamesDrawerProps> = ({
  isOpen,
  onClose,
  stories,
  onOpenStory,
}) => {
  const { currentProfile, recordQuestAnswer, resetQuestProgress } = useProfile();
  const questProgress = currentProfile.questProgress || {
    totalPoints: 0,
    unlockedBadgeIds: [],
    completedEditionDates: [],
    answeredQuestions: {},
    showNewsQuest: true,
  };

  const [activeTab, setActiveTab] = useState<'daily' | 'history'>('daily');

  // Daily Quiz state
  const [dailyIndex, setDailyIndex] = useState(0);
  const [dailySelected, setDailySelected] = useState<number | null>(null);
  const [dailySubmitted, setDailySubmitted] = useState(false);

  // History Mode state
  const [historyCategory, setHistoryCategory] = useState<string>('all');
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historySelectedYear, setHistorySelectedYear] = useState<number | null>(null);
  const [historySubmitted, setHistorySubmitted] = useState(false);

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

  // Derive daily questions strictly from verified current edition stories
  const dailyQuestions: QuestQuestion[] = useMemo(() => {
    return questService.getQuestionsForStories(stories);
  }, [stories]);

  const currentDailyQuestion = dailyQuestions[dailyIndex];

  // Sync daily question saved answer if already completed
  useEffect(() => {
    if (!currentDailyQuestion) return;
    const saved = questProgress.answeredQuestions[currentDailyQuestion.id];
    if (saved) {
      setDailySelected(saved.selectedIndex);
      setDailySubmitted(true);
    } else {
      setDailySelected(null);
      setDailySubmitted(false);
    }
  }, [dailyIndex, currentDailyQuestion, questProgress.answeredQuestions]);

  // Filter historical dispatches
  const filteredHistory: HistoricalDispatch[] = useMemo(() => {
    if (historyCategory === 'all') return HISTORICAL_DISPATCHES;
    return HISTORICAL_DISPATCHES.filter((h) => h.category === historyCategory);
  }, [historyCategory]);

  const currentHistoryItem = filteredHistory[historyIndex];

  // Reset history item selection when index changes
  useEffect(() => {
    if (!currentHistoryItem) return;
    const saved = questProgress.answeredQuestions[currentHistoryItem.id];
    if (saved) {
      setHistorySelectedYear(saved.selectedIndex);
      setHistorySubmitted(true);
    } else {
      setHistorySelectedYear(null);
      setHistorySubmitted(false);
    }
  }, [historyIndex, currentHistoryItem, questProgress.answeredQuestions]);

  // Gentle Streak calculation (count of days played with zero missed-day penalty)
  const completedDates = questProgress.completedEditionDates || [];
  const streakDays = completedDates.length > 0 ? completedDates.length : (questProgress.totalPoints > 0 ? 1 : 0);

  // Handle Daily Quiz Answer
  const handleSelectDailyOption = (optIndex: number) => {
    if (dailySubmitted || !currentDailyQuestion) return;
    setDailySelected(optIndex);
    setDailySubmitted(true);

    const isCorrect = optIndex === currentDailyQuestion.correctIndex;
    const isLast = dailyIndex === dailyQuestions.length - 1;

    recordQuestAnswer(
      currentDailyQuestion.id,
      optIndex,
      isCorrect,
      currentDailyQuestion.category,
      isLast,
      dailyQuestions.length
    );
  };

  // Handle History Answer
  const handleSelectHistoryYear = (year: number) => {
    if (historySubmitted || !currentHistoryItem) return;
    setHistorySelectedYear(year);
    setHistorySubmitted(true);

    const isCorrect = year === currentHistoryItem.correctYear;
    recordQuestAnswer(
      currentHistoryItem.id,
      year,
      isCorrect,
      currentHistoryItem.category as any,
      false,
      filteredHistory.length
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Newsiemama Games">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#181513]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside
          aria-label="Newsiemama Games Center"
          className="w-screen max-w-2xl bg-[#faf7f2] border-l border-[#e4dcd3] shadow-2xl flex flex-col animate-drawer-slide text-[#191715]"
        >
          {/* Header with Title & Stats */}
          <div className="px-5 py-4 bg-[#ffffff] border-b border-[#e4dcd3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f0fdfa] text-[#0f766e] border border-[#99f6e4] flex items-center justify-center shadow-2xs">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#191715] flex items-center gap-2">
                  <span>Games</span>
                </h3>
                <p className="text-xs text-[#6e685f] font-mono-meta">
                  100% grounded in verified reporting • No pressure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Score pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffffff] border border-[#e4dcd3] rounded-full text-xs font-mono-meta font-bold shadow-2xs text-[#0f766e]">
                <Sparkles className="w-3.5 h-3.5 text-[#e25c50]" />
                <span>{questProgress.totalPoints} pts</span>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#8f887d] hover:text-[#191715] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                aria-label="Close Games"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gentle Streak & Reassurance Bar */}
          <div className="bg-[#f0fdfa] border-b border-[#99f6e4] px-5 py-2.5 flex items-center justify-between text-xs text-[#0f766e] shrink-0">
            <div className="flex items-center gap-2 font-mono-meta font-semibold">
              <Flame className="w-4 h-4 text-[#e25c50]" />
              <span>{streakDays} Day Gentle Journey</span>
            </div>
            <span className="text-[11px] text-[#3e5f49] font-sans">
              Play at your pace — no missed-day penalties!
            </span>
          </div>

          {/* Mode Tabs */}
          <div className="bg-[#ffffff] px-5 pt-3 border-b border-[#e4dcd3] flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'daily'
                  ? 'border-[#0f766e] text-[#0f766e]'
                  : 'border-transparent text-[#6e685f] hover:text-[#191715]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Daily News Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'border-[#0f766e] text-[#0f766e]'
                  : 'border-transparent text-[#6e685f] hover:text-[#191715]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>News Through the Years</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* TAB 1: DAILY NEWS QUIZ */}
            {activeTab === 'daily' && (
              <div className="space-y-4">
                {dailyQuestions.length === 0 ? (
                  /* Empty state when 0 live stories are loaded */
                  <div className="bg-[#ffffff] border-2 border-[#e4dcd3] rounded-3xl p-8 text-center space-y-3 animate-paper-fade">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0fdfa] text-[#0f766e] border border-[#99f6e4] flex items-center justify-center mx-auto">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif-editorial text-lg font-bold text-[#191715]">
                      No Active Live Stories For Quiz
                    </h4>
                    <p className="text-xs text-[#6e685f] max-w-sm mx-auto leading-relaxed">
                      Daily news quiz questions are generated strictly from verified real articles in your current edition. Fetch live stories using the Refresh button to activate today’s questions.
                    </p>
                  </div>
                ) : (
                  currentDailyQuestion && (
                    <div className="bg-[#ffffff] border-2 border-[#e4dcd3] rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm animate-paper-fade">
                      {/* Top meta */}
                      <div className="flex items-center justify-between text-xs border-b border-[#f4eee5] pb-3">
                        <span className="font-mono-meta font-bold text-[#0f766e] uppercase tracking-wider text-[11px]">
                          Question {dailyIndex + 1} of {dailyQuestions.length}
                        </span>
                        <span className="text-[11px] font-mono-meta text-[#8c8278]">
                          +25 pts for first correct answer
                        </span>
                      </div>

                      {/* Question */}
                      <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-[#191715] leading-snug">
                        {currentDailyQuestion.question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2">
                        {currentDailyQuestion.options.map((opt, idx) => {
                          const isSelected = dailySelected === idx;
                          const isCorrect = idx === currentDailyQuestion.correctIndex;
                          let btnStyle = 'bg-[#ffffff] border-[#e4dcd3] hover:border-[#0f766e] text-[#191715]';

                          if (dailySubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-[#f0fdfa] border-[#0f766e] text-[#0f766e] font-bold';
                            } else if (isSelected) {
                              btnStyle = 'bg-[#fef2f2] border-[#e25c50] text-[#9b2c48]';
                            } else {
                              btnStyle = 'bg-[#ffffff] border-[#e4dcd3] opacity-60 text-[#8c8278]';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectDailyOption(idx)}
                              disabled={dailySubmitted}
                              className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-md flex items-center justify-center font-mono-meta font-bold text-[11px] bg-[#faf6f0] border border-[#e4dcd3] shrink-0 mt-0.5">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="flex-1 leading-relaxed">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation & Source Reference */}
                      {dailySubmitted && (
                        <div className="bg-[#faf6f0] border border-[#e4dcd3] rounded-2xl p-4 space-y-3 animate-paper-fade">
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                                dailySelected === currentDailyQuestion.correctIndex ? 'bg-[#0f766e]' : 'bg-[#e25c50]'
                              }`}
                            >
                              {dailySelected === currentDailyQuestion.correctIndex ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-xs text-[#191715] block">
                                {dailySelected === currentDailyQuestion.correctIndex
                                  ? '✓ Correct! Verified Live Reporting:'
                                  : 'The Verified Fact:'}
                              </span>
                              <p className="text-xs text-[#5c554e] leading-relaxed">
                                {currentDailyQuestion.explanation}
                              </p>
                            </div>
                          </div>

                          {currentDailyQuestion.sourceUrl && (
                            <div className="pt-2 border-t border-[#ede5da] flex items-center justify-between">
                              <a
                                href={currentDailyQuestion.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#0f766e] font-bold hover:underline"
                              >
                                <span>Read original dispatch</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom navigation */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#f4eee5]">
                        <button
                          type="button"
                          onClick={() => setDailyIndex((prev) => Math.max(0, prev - 1))}
                          disabled={dailyIndex === 0}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#e4dcd3] text-[#5c554e] hover:bg-[#faf6f0] disabled:opacity-40 cursor-pointer"
                        >
                          Previous
                        </button>

                        <span className="font-mono-meta text-xs text-[#8c8278]">
                          {dailyIndex + 1} / {dailyQuestions.length}
                        </span>

                        <button
                          type="button"
                          onClick={() => setDailyIndex((prev) => Math.min(dailyQuestions.length - 1, prev + 1))}
                          disabled={dailyIndex === dailyQuestions.length - 1}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#0f766e] text-[#ffffff] hover:bg-[#115e59] disabled:opacity-40 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* TAB 2: NEWS THROUGH THE YEARS */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {/* Category filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'All History' },
                    { id: 'science', label: 'Space & Science' },
                    { id: 'finance', label: 'Finance & Economy' },
                    { id: 'policy', label: 'Policy & Governance' },
                    { id: 'tech', label: 'Technology' },
                    { id: 'climate', label: 'Climate & Energy' },
                    { id: 'world', label: 'World' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setHistoryCategory(cat.id);
                        setHistoryIndex(0);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        historyCategory === cat.id
                          ? 'bg-[#0f766e] text-white font-bold'
                          : 'bg-[#ffffff] text-[#5c554e] border border-[#e4dcd3] hover:bg-[#faf6f0]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {filteredHistory.length === 0 ? (
                  /* Empty state for categories with no archived dispatches */
                  <div className="bg-[#ffffff] border-2 border-[#e4dcd3] rounded-3xl p-8 text-center space-y-3 animate-paper-fade">
                    <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] text-[#8c8278] border border-[#e4dcd3] flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif-editorial text-lg font-bold text-[#191715]">
                      No Verified Archived Dispatches
                    </h4>
                    <p className="text-xs text-[#6e685f] max-w-sm mx-auto leading-relaxed">
                      There are no dated, historically sourced articles cataloged for this category yet. Newsiemama strictly relies on verified historical archives and never invents past news.
                    </p>
                  </div>
                ) : (
                  currentHistoryItem && (
                    <div className="bg-[#ffffff] border-2 border-[#e4dcd3] rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm animate-paper-fade">
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f4eee5] pb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-meta font-bold text-[#0f766e] uppercase tracking-wider text-[11px] bg-[#f0fdfa] border border-[#99f6e4] px-2 py-0.5 rounded-full">
                            Milestone {historyIndex + 1} of {filteredHistory.length}
                          </span>
                          <span className="text-[#8c8278] font-serif-editorial">
                            {currentHistoryItem.sourceName}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono-meta text-[#8c8278]">
                          +25 pts for recall
                        </span>
                      </div>

                      {/* Milestone Brief */}
                      <div className="space-y-2">
                        <span className="text-xs font-mono-meta text-[#8c8278] uppercase tracking-wider">
                          Historical Dispatch
                        </span>
                        <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-[#191715] leading-snug">
                          {currentHistoryItem.headline}
                        </h4>
                        <p className="text-xs text-[#5c554e] leading-relaxed font-sans">
                          {currentHistoryItem.summary}
                        </p>
                      </div>

                      {/* Year Guess Prompt */}
                      <div className="pt-2 space-y-2">
                        <span className="text-xs font-bold text-[#191715] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#0f766e]" />
                          <span>In which year did this verified event occur?</span>
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {currentHistoryItem.options.map((year) => {
                            const isSelected = historySelectedYear === year;
                            const isCorrect = year === currentHistoryItem.correctYear;
                            let btnStyle = 'bg-[#ffffff] border-[#e4dcd3] hover:border-[#0f766e] text-[#191715]';

                            if (historySubmitted) {
                              if (isCorrect) {
                                btnStyle = 'bg-[#f0fdfa] border-[#0f766e] text-[#0f766e] font-bold ring-2 ring-[#99f6e4]';
                              } else if (isSelected) {
                                btnStyle = 'bg-[#fef2f2] border-[#e25c50] text-[#9b2c48]';
                              } else {
                                btnStyle = 'bg-[#ffffff] border-[#e4dcd3] opacity-60 text-[#8c8278]';
                              }
                            }

                            return (
                              <button
                                key={year}
                                type="button"
                                onClick={() => handleSelectHistoryYear(year)}
                                disabled={historySubmitted}
                                className={`py-3 px-2 rounded-2xl border text-center font-mono-meta text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
                              >
                                {year}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Historical Context & Provenance after answer */}
                      {historySubmitted && (
                        <div className="bg-[#faf6f0] border border-[#e4dcd3] rounded-2xl p-4 space-y-3 animate-paper-fade">
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                                historySelectedYear === currentHistoryItem.correctYear ? 'bg-[#0f766e]' : 'bg-[#e25c50]'
                              }`}
                            >
                              {historySelectedYear === currentHistoryItem.correctYear ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-xs text-[#191715] block">
                                {historySelectedYear === currentHistoryItem.correctYear
                                  ? `✓ Exactly right! (${currentHistoryItem.exactDate})`
                                  : `Recorded Date: ${currentHistoryItem.exactDate}`}
                              </span>
                              <p className="text-xs text-[#5c554e] leading-relaxed">
                                {currentHistoryItem.contextNote}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#ede5da] flex items-center justify-between text-xs">
                            <span className="text-[#8c8278] font-mono-meta text-[11px]">
                              Archive: {currentHistoryItem.sourceName}
                            </span>
                            <a
                              href={currentHistoryItem.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#0f766e] font-bold hover:underline"
                            >
                              <span>Official Archive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Bottom navigation */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#f4eee5]">
                        <button
                          type="button"
                          onClick={() => setHistoryIndex((prev) => Math.max(0, prev - 1))}
                          disabled={historyIndex === 0}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#e4dcd3] text-[#5c554e] hover:bg-[#faf6f0] disabled:opacity-40 cursor-pointer"
                        >
                          Previous
                        </button>

                        <span className="font-mono-meta text-xs text-[#8c8278]">
                          {historyIndex + 1} / {filteredHistory.length}
                        </span>

                        <button
                          type="button"
                          onClick={() => setHistoryIndex((prev) => Math.min(filteredHistory.length - 1, prev + 1))}
                          disabled={historyIndex === filteredHistory.length - 1}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#0f766e] text-[#ffffff] hover:bg-[#115e59] disabled:opacity-40 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
