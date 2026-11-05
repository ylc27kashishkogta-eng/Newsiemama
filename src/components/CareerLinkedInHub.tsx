import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CAREER_FIELDS_CONFIG,
  CareerFieldConfig,
  CareerTopicConfig,
  getDefaultFieldIdForTopic,
} from '../config/careerFields';
import { jobService, JobListing, JobScope } from '../services/jobService';
import {
  Briefcase,
  Search,
  ExternalLink,
  RefreshCw,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Sparkles,
  Layers,
  Cpu,
  TrendingUp,
  Palette,
  Stethoscope,
  GraduationCap,
  Leaf,
  Rocket,
  Shield,
  Filter,
  X,
  Laptop,
} from 'lucide-react';

interface CareerLinkedInHubProps {
  initialTopicCategory?: string;
  onBackToNews?: () => void;
}

// Icon mapper for career fields
const FIELD_ICONS: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Stethoscope: <Stethoscope className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
  Rocket: <Rocket className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

export const CareerLinkedInHub: React.FC<CareerLinkedInHubProps> = ({
  initialTopicCategory,
  onBackToNews,
}) => {
  // Determine default field based on user's profile topic
  const defaultFieldId = useMemo(() => {
    return getDefaultFieldIdForTopic(initialTopicCategory);
  }, [initialTopicCategory]);

  const [activeFieldId, setActiveFieldId] = useState<string>(defaultFieldId);
  const currentField: CareerFieldConfig = useMemo(() => {
    return (
      CAREER_FIELDS_CONFIG.find((f) => f.id === activeFieldId) ||
      CAREER_FIELDS_CONFIG[0]
    );
  }, [activeFieldId]);

  // Selected topic within field ('all' or topic ID)
  const [activeTopicId, setActiveTopicId] = useState<string>('all');
  const activeTopic: CareerTopicConfig | undefined = useMemo(() => {
    if (activeTopicId === 'all') return currentField.topics[0];
    return currentField.topics.find((t) => t.id === activeTopicId) || currentField.topics[0];
  }, [activeTopicId, currentField]);

  // Search input for LinkedIn posts
  const [linkedinSearchInput, setLinkedinSearchInput] = useState<string>('');

  // Update LinkedIn search input when topic changes
  useEffect(() => {
    if (activeTopic) {
      setLinkedinSearchInput(activeTopic.linkedinSearchQuery);
    }
  }, [activeTopic]);

  // Reset topic selection when field changes
  const handleSelectField = (fieldId: string) => {
    setActiveFieldId(fieldId);
    setActiveTopicId('all');
  };

  // Job roles state
  const [allJobs, setAllJobs] = useState<JobListing[]>([]);
  const [indiaCount, setIndiaCount] = useState<number>(0);
  const [internationalCount, setInternationalCount] = useState<number>(0);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [jobsFetchedAt, setJobsFetchedAt] = useState<string>('');

  // Job filter controls (Defaults to India scope first)
  const [filterScope, setFilterScope] = useState<'all' | 'india' | 'international'>('india');
  const [filterCity, setFilterCity] = useState<'all' | 'bengaluru' | 'delhi_ncr' | 'mumbai_pune' | 'hyderabad' | 'chennai' | 'remote_in'>('all');
  const [filterWorkMode, setFilterWorkMode] = useState<'all' | 'remote' | 'on_site_hybrid'>('all');
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Load jobs from both Dev Global Jobs (India) and Jobicy (International Remote)
  const loadJobs = useCallback(
    async (force = false) => {
      setIsLoadingJobs(true);
      setJobsError(null);

      const topicKeyword =
        activeTopicId !== 'all' && activeTopic
          ? activeTopic.jobSearchKeywords
          : currentField.topics[0]?.jobSearchKeywords;

      try {
        const result = await jobService.fetchJobs(topicKeyword, force);
        if (result.success) {
          setAllJobs(result.jobs);
          setIndiaCount(result.indiaCount);
          setInternationalCount(result.internationalCount);
          setJobsFetchedAt(result.fetchedAt);
          if (result.error) {
            setJobsError(result.error);
          }
        } else {
          setJobsError(result.error || 'Failed to load jobs from feed.');
        }
      } catch (err: any) {
        setJobsError(err.message || 'Error connecting to public jobs feeds.');
      } finally {
        setIsLoadingJobs(false);
      }
    },
    [activeTopicId, activeTopic, currentField]
  );

  useEffect(() => {
    loadJobs(false);
  }, [loadJobs]);

  // Filter jobs based on active criteria and subtopic keywords
  const filteredJobs = useMemo(() => {
    const effectiveKeyword =
      filterKeyword.trim() !== ''
        ? filterKeyword
        : activeTopicId !== 'all' && activeTopic
        ? activeTopic.jobSearchKeywords
        : '';

    return jobService.filterJobs(allJobs, {
      scope: filterScope,
      city: filterCity,
      workMode: filterWorkMode,
      keyword: effectiveKeyword,
      level: filterLevel,
    });
  }, [allJobs, filterScope, filterCity, filterWorkMode, filterKeyword, activeTopicId, activeTopic, filterLevel]);

  // Helper to open LinkedIn searches in new tab
  const handleOpenLinkedInPosts = (queryToUse?: string) => {
    const query = (queryToUse || linkedinSearchInput).trim();
    if (!query) return;
    const url = `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenLinkedInJobs = (roleQuery?: string) => {
    const query = (roleQuery || (activeTopic ? activeTopic.linkedinJobQuery : currentField.label)).trim();
    const locationParam = filterScope === 'india' ? 'India' : '';
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${
      locationParam ? `&location=${encodeURIComponent(locationParam)}` : ''
    }`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Clear filters
  const handleResetFilters = () => {
    setFilterKeyword('');
    setFilterScope('india');
    setFilterCity('all');
    setFilterWorkMode('all');
    setFilterLevel('all');
  };

  const hasActiveFilters =
    filterKeyword !== '' ||
    filterScope !== 'india' ||
    filterCity !== 'all' ||
    filterWorkMode !== 'all' ||
    filterLevel !== 'all';

  return (
    <div className="space-y-8 animate-paper-fade pb-16">
      {/* Top Breadcrumb & Return to News Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ffffff] border border-[#e7ded3] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0a66c2]/10 border border-[#0a66c2]/20 flex items-center justify-center text-[#0a66c2]">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#191715]">
                Career &amp; LinkedIn Dispatch
              </h1>
              <span className="text-[10px] font-mono-meta font-bold uppercase tracking-wider bg-[#0a66c2] text-white px-2 py-0.5 rounded-full">
                Professional Hub
              </span>
            </div>
            <p className="text-xs text-[#6e685f] font-mono-meta">
              Curated LinkedIn discovery queries &amp; verified real-world job roles for India and International Remote
            </p>
          </div>
        </div>

        {onBackToNews && (
          <button
            type="button"
            onClick={onBackToNews}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c554e] hover:text-[#191715] bg-[#faf6f0] hover:bg-[#ede5dc] px-3 py-1.5 rounded-xl border border-[#d8ccc0] transition-colors cursor-pointer"
          >
            <span>Back to Daily News</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Field-Based Subtabs Navigation Ribbon */}
      <div className="bg-[#ffffff] border border-[#e7ded3] rounded-2xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#f0eae1]">
          <span className="text-xs font-mono-meta text-[#8c8278] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0a66c2]" />
            <span>Select Career Field</span>
          </span>
          <span className="text-[11px] text-[#6e685f] font-mono-meta">
            Defaulted to your primary interest ({currentField.shortLabel || currentField.label})
          </span>
        </div>

        {/* Horizontal scrollable field pill tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CAREER_FIELDS_CONFIG.map((field) => {
            const isFieldActive = field.id === activeFieldId;
            const icon = FIELD_ICONS[field.iconName] || <Briefcase className="w-4 h-4" />;

            return (
              <button
                key={field.id}
                type="button"
                onClick={() => handleSelectField(field.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  isFieldActive
                    ? 'bg-[#191715] text-[#ffffff] border-[#191715] shadow-xs'
                    : 'bg-[#faf7f2] text-[#5c5449] border-[#e4dcd3] hover:border-[#191715] hover:text-[#191715] hover:bg-[#ffffff]'
                }`}
              >
                <span className={isFieldActive ? 'text-[#99f6e4]' : 'text-[#8c8278]'}>{icon}</span>
                <span>{field.shortLabel || field.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono-meta font-bold ${
                    isFieldActive ? 'bg-[#ffffff]/20 text-[#ffffff]' : 'bg-[#e7ded3] text-[#5c5449]'
                  }`}
                >
                  {field.topics.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtopics Selector Bar */}
      <div className="bg-[#ffffff] border border-[#e7ded3] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-bold font-serif-editorial text-[#191715] flex items-center gap-2">
              <span>{currentField.label}</span>
              <span className={`text-[10px] font-mono-meta font-bold px-2 py-0.5 rounded-full border ${currentField.badgeClass}`}>
                {currentField.topics.length} Subtopics
              </span>
            </h2>
            <p className="text-xs text-[#5c554e] font-sans mt-0.5">{currentField.description}</p>
          </div>

          <span className="text-[11px] font-mono-meta text-[#8c8278] uppercase tracking-wider shrink-0">
            Focus Subtopic:
          </span>
        </div>

        {/* Subtopic chips */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTopicId('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              activeTopicId === 'all'
                ? 'bg-[#0f766e] text-[#ffffff] border-[#0f766e] shadow-2xs font-bold'
                : 'bg-[#f7efe9] text-[#6e685f] border-[#e7ded3] hover:text-[#191715] hover:border-[#8f887d]'
            }`}
          >
            All {currentField.shortLabel || currentField.label} Topics
          </button>

          {currentField.topics.map((t) => {
            const isTopicActive = activeTopicId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTopicId(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  isTopicActive
                    ? 'bg-[#0a66c2] text-[#ffffff] border-[#0a66c2] shadow-2xs font-bold'
                    : 'bg-[#faf7f2] text-[#5c5449] border-[#e4dcd3] hover:border-[#0a66c2] hover:text-[#0a66c2] hover:bg-[#ffffff]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: RELEVANT LINKEDIN POSTS & DISCOURSE */}
      <section className="bg-[#ffffff] border border-[#e7ded3] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="border-b border-[#f0eae1] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0a66c2] text-[#ffffff] flex items-center justify-center font-bold text-sm shadow-xs">
                in
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-serif-editorial text-[#191715]">
                  1. Relevant LinkedIn Discourse &amp; Insights
                </h3>
                <p className="text-xs text-[#5c554e] font-sans">
                  Targeted LinkedIn search queries for{' '}
                  <strong className="text-[#191715]">
                    {activeTopicId === 'all'
                      ? currentField.label
                      : activeTopic?.label || currentField.label}
                  </strong>
                  . Explore insights, career advice, and industry trends directly on LinkedIn.
                </p>
              </div>
            </div>

            {/* Direct LinkedIn Jobs Quick Button */}
            <button
              type="button"
              onClick={() => handleOpenLinkedInJobs()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a66c2] bg-[#f0f7ff] hover:bg-[#0a66c2] hover:text-[#ffffff] px-3.5 py-2 rounded-xl border border-[#bae6fd] transition-all cursor-pointer shadow-2xs shrink-0"
              title="Search open job listings on LinkedIn for this field"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Search LinkedIn Jobs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Bar for LinkedIn Posts */}
        <div className="bg-[#faf7f2] border border-[#e7ded3] rounded-xl p-3 sm:p-4">
          <div className="text-[11px] font-mono-meta text-[#8c8278] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
            <Search className="w-3.5 h-3.5 text-[#0a66c2]" />
            <span>Search Query for LinkedIn Post Discovery</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={linkedinSearchInput}
                onChange={(e) => setLinkedinSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleOpenLinkedInPosts();
                }}
                placeholder="Enter career topic, architecture, skill or keyword..."
                className="w-full bg-[#ffffff] border border-[#d8ccc0] focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#191715] placeholder-[#a59a8e] outline-none transition-all"
              />
              {linkedinSearchInput && (
                <button
                  type="button"
                  onClick={() => setLinkedinSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a59a8e] hover:text-[#191715] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleOpenLinkedInPosts()}
              className="inline-flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#084e96] text-[#ffffff] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search LinkedIn Posts</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Curated Post Search Themes Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-meta text-[#8c8278] uppercase tracking-wider font-semibold">
              Curated Discovery Themes for{' '}
              {activeTopicId === 'all' ? currentField.shortLabel : activeTopic?.label}
            </span>
            <span className="text-[11px] text-[#6e685f] font-mono-meta">
              Opens LinkedIn with parameters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(activeTopic?.searchThemes || [
              {
                title: 'Industry Insights & Thought Leadership',
                description: `Strategic breakdowns and deep analysis across ${currentField.label}`,
                query: `${activeTopic?.linkedinSearchQuery || currentField.label} insights strategy`,
                badge: 'Insights',
              },
              {
                title: 'Practical Career Advice & Lessons Learned',
                description: `Real career milestones, transition stories, and interview preparation`,
                query: `${activeTopic?.label || currentField.label} career advice lessons learned`,
                badge: 'Career Tips',
              },
              {
                title: 'Active Hiring Announcements (#Hiring)',
                description: `Direct hiring posts from team leads and engineering managers`,
                query: `#hiring ("${activeTopic?.label || currentField.label}")`,
                badge: 'Hiring',
              },
              {
                title: 'Tools, Tech Stack & Best Practices',
                description: `Production tooling, frameworks, and architecture updates`,
                query: `${activeTopic?.label || currentField.label} best practices tools`,
                badge: 'Practices',
              },
            ]).map((theme, idx) => (
              <div
                key={idx}
                className="bg-[#faf7f2] hover:bg-[#f5eee6] border border-[#e7ded3] hover:border-[#0a66c2]/40 rounded-xl p-4 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[#191715] group-hover:text-[#0a66c2] transition-colors">
                      {theme.title}
                    </h4>
                    {theme.badge && (
                      <span className="text-[9px] font-mono-meta font-bold uppercase tracking-wider bg-[#ffffff] text-[#0a66c2] border border-[#bae6fd] px-2 py-0.5 rounded-full">
                        {theme.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5c554e] leading-relaxed">{theme.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#e7ded3]/60">
                  <span className="text-[10px] font-mono-meta text-[#8c8278] truncate max-w-[200px]">
                    "{theme.query}"
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenLinkedInPosts(theme.query)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0a66c2] hover:text-[#084e96] cursor-pointer"
                  >
                    <span>Search on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Transparency Notice */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 text-xs text-[#166534] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Free &amp; Compliant LinkedIn Discovery:</strong> These buttons launch official LinkedIn searches
            in a new tab with tailored boolean operators. We never scrape personal LinkedIn data, bypass
            rate limits, or simulate synthetic user posts.
          </div>
        </div>
      </section>

      {/* SECTION 2: OPEN JOB ROLES */}
      <section className="bg-[#ffffff] border border-[#e7ded3] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="border-b border-[#f0eae1] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0f766e] text-[#ffffff] flex items-center justify-center font-bold text-sm shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-serif-editorial text-[#191715]">
                  2. Open Job Roles
                </h3>
                <p className="text-xs text-[#5c554e] font-sans">
                  Verified live positions from top employers in India &amp; global remote teams.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadJobs(true)}
                disabled={isLoadingJobs}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c554e] hover:text-[#191715] bg-[#faf6f0] hover:bg-[#ede5dc] px-3 py-1.5 rounded-xl border border-[#d8ccc0] transition-colors cursor-pointer"
                title="Refresh jobs feed from source"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingJobs ? 'animate-spin text-[#0f766e]' : ''}`} />
                <span>{isLoadingJobs ? 'Refreshing…' : 'Refresh Feed'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenLinkedInJobs()}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0a66c2] bg-[#f0f7ff] hover:bg-[#e0f2fe] px-3 py-1.5 rounded-xl border border-[#bae6fd] transition-colors cursor-pointer"
              >
                <span>Search LinkedIn Jobs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* GEOGRAPHIC SEGMENTATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#faf7f2] border border-[#e7ded3] rounded-xl p-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterScope('india')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterScope === 'india'
                  ? 'bg-[#0f766e] text-[#ffffff] shadow-2xs'
                  : 'bg-[#ffffff] text-[#5c5449] border border-[#d8ccc0] hover:text-[#191715]'
              }`}
            >
              <span>🇮🇳 India Jobs</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-meta ${
                filterScope === 'india' ? 'bg-[#ffffff]/20 text-white' : 'bg-[#e7ded3] text-[#5c5449]'
              }`}>
                {indiaCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterScope('international')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterScope === 'international'
                  ? 'bg-[#0a66c2] text-[#ffffff] shadow-2xs'
                  : 'bg-[#ffffff] text-[#5c5449] border border-[#d8ccc0] hover:text-[#191715]'
              }`}
            >
              <span>🌐 International Remote</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-meta ${
                filterScope === 'international' ? 'bg-[#ffffff]/20 text-white' : 'bg-[#e7ded3] text-[#5c5449]'
              }`}>
                {internationalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterScope('all')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterScope === 'all'
                  ? 'bg-[#191715] text-[#ffffff] shadow-2xs'
                  : 'bg-[#ffffff] text-[#5c5449] border border-[#d8ccc0] hover:text-[#191715]'
              }`}
            >
              <span>All Locations</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-meta ${
                filterScope === 'all' ? 'bg-[#ffffff]/20 text-white' : 'bg-[#e7ded3] text-[#5c5449]'
              }`}>
                {allJobs.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono-meta text-[#8c8278]">
            {filterScope === 'india'
              ? 'Showing verified roles in India & domestic remote'
              : filterScope === 'international'
              ? 'Showing international remote contractor positions'
              : 'Showing all Indian and international listings'}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#faf7f2] border border-[#e7ded3] rounded-xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono-meta text-[#8c8278] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-[#0f766e]" />
              <span>Refine Listings</span>
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-mono-meta text-[#e25c50] hover:text-[#b45309] font-semibold cursor-pointer underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Keyword Filter */}
            <div>
              <label className="block text-[10px] font-mono-meta text-[#6e685f] uppercase tracking-wider mb-1">
                Keyword / Role / Company
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  placeholder="e.g. React, MongoDB, Engineer..."
                  className="w-full bg-[#ffffff] border border-[#d8ccc0] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] rounded-lg px-2.5 py-1.5 text-xs text-[#191715] placeholder-[#a59a8e] outline-none"
                />
                {filterKeyword && (
                  <button
                    type="button"
                    onClick={() => setFilterKeyword('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a59a8e] hover:text-[#191715]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Indian City Filter (when looking at India or All) */}
            <div>
              <label className="block text-[10px] font-mono-meta text-[#6e685f] uppercase tracking-wider mb-1">
                Indian Hiring Hub
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value as any)}
                disabled={filterScope === 'international'}
                className={`w-full bg-[#ffffff] border border-[#d8ccc0] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] rounded-lg px-2.5 py-1.5 text-xs text-[#191715] outline-none cursor-pointer ${
                  filterScope === 'international' ? 'opacity-50 cursor-not-allowed bg-[#f5eee6]' : ''
                }`}
              >
                <option value="all">All Indian Cities</option>
                <option value="bengaluru">Bengaluru / Bangalore</option>
                <option value="delhi_ncr">Delhi NCR (Gurugram / Noida)</option>
                <option value="mumbai_pune">Mumbai / Pune</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
                <option value="remote_in">Remote (India)</option>
              </select>
            </div>

            {/* Work Mode Filter (Remote vs On-site / Office) */}
            <div>
              <label className="block text-[10px] font-mono-meta text-[#6e685f] uppercase tracking-wider mb-1">
                Work Mode
              </label>
              <select
                value={filterWorkMode}
                onChange={(e) => setFilterWorkMode(e.target.value as any)}
                className="w-full bg-[#ffffff] border border-[#d8ccc0] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] rounded-lg px-2.5 py-1.5 text-xs text-[#191715] outline-none cursor-pointer"
              >
                <option value="all">All Work Modes</option>
                <option value="remote">Remote Only</option>
                <option value="on_site_hybrid">On-Site / Hybrid Office</option>
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-[10px] font-mono-meta text-[#6e685f] uppercase tracking-wider mb-1">
                Experience Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full bg-[#ffffff] border border-[#d8ccc0] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] rounded-lg px-2.5 py-1.5 text-xs text-[#191715] outline-none cursor-pointer"
              >
                <option value="all">All Experience Levels</option>
                <option value="entry">Entry / Junior Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior / Lead / Director</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Job Feed Status Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono-meta text-[#8c8278] pt-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0f766e] animate-pulse" />
            <span className="font-semibold text-[#191715]">
              Showing {filteredJobs.length} active listings
            </span>
            {jobsFetchedAt && <span>(Fetched at {jobsFetchedAt})</span>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span>Powered by</span>
            <a
              href="https://devglobaljobs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0f766e] hover:underline font-bold"
            >
              Dev Global Jobs (India)
            </a>
            <span>•</span>
            <a
              href="https://jobicy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0a66c2] hover:underline font-bold"
            >
              Jobicy (International)
            </a>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoadingJobs && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[#faf7f2] border border-[#e7ded3] rounded-xl p-5 space-y-3 animate-pulse"
              >
                <div className="h-4 bg-[#e7ded3] rounded w-1/3" />
                <div className="h-5 bg-[#e7ded3] rounded w-3/4" />
                <div className="h-3 bg-[#e7ded3] rounded w-full" />
                <div className="h-3 bg-[#e7ded3] rounded w-2/3" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-[#e7ded3] rounded w-20" />
                  <div className="h-6 bg-[#e7ded3] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Listings Grid */}
        {!isLoadingJobs && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              const isIndia = job.scope === 'india';

              return (
                <div
                  key={job.id}
                  className="bg-[#faf7f2] hover:bg-[#ffffff] border border-[#e7ded3] hover:border-[#0f766e]/40 rounded-xl p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between gap-4 group"
                >
                  <div>
                    {/* Employer & Source Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="w-9 h-9 rounded-lg object-contain bg-white border border-[#e7ded3] p-0.5"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase border ${
                              isIndia
                                ? 'bg-[#f0fdfa] border-[#99f6e4] text-[#0f766e]'
                                : 'bg-[#f0f7ff] border-[#bae6fd] text-[#0a66c2]'
                            }`}
                          >
                            {job.companyName.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-[#191715] flex items-center gap-1.5">
                            <span>{job.companyName}</span>
                          </div>
                          <div className="text-[11px] font-mono-meta text-[#8c8278] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0f766e]" />
                            <span className="truncate max-w-[200px]" title={job.location}>
                              {job.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Source & Scope Badge */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[9px] font-mono-meta font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isIndia
                              ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
                              : 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]'
                          }`}
                        >
                          {isIndia ? '🇮🇳 India' : '🌐 International'}
                        </span>
                        <span className="text-[10px] font-mono-meta text-[#8c8278] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(job.pubDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Role Title */}
                    <h4 className="text-base font-bold font-serif-editorial text-[#191715] group-hover:text-[#0f766e] transition-colors leading-snug mb-2">
                      {job.jobTitle}
                    </h4>

                    {/* Excerpt */}
                    {job.jobExcerpt && (
                      <p className="text-xs text-[#5c554e] line-clamp-3 leading-relaxed mb-3">
                        {job.jobExcerpt}
                      </p>
                    )}

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Work mode badge */}
                      <span
                        className={`text-[10px] font-mono-meta font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                          job.isRemote
                            ? 'bg-[#f0fdfa] text-[#0f766e] border-[#99f6e4]'
                            : 'bg-[#faf6f0] text-[#5c554e] border-[#d8ccc0]'
                        }`}
                      >
                        <Laptop className="w-3 h-3" />
                        <span>{job.isRemote ? 'Remote' : 'On-Site / Hybrid'}</span>
                      </span>

                      {job.normalizedCity && (
                        <span className="text-[10px] font-mono-meta font-semibold bg-[#ffffff] text-[#191715] border border-[#d8ccc0] px-2 py-0.5 rounded-md">
                          {job.normalizedCity}
                        </span>
                      )}

                      {job.jobLevel && (
                        <span className="text-[10px] font-mono-meta font-semibold bg-[#ffffff] text-[#6e685f] border border-[#d8ccc0] px-2 py-0.5 rounded-md">
                          {job.jobLevel}
                        </span>
                      )}

                      {job.jobType.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono-meta font-semibold bg-[#faf7f2] text-[#6e685f] border border-[#e7ded3] px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}

                      {job.salary && (
                        <span className="text-[10px] font-mono-meta font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2 py-0.5 rounded-md flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{job.salary}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-[#e7ded3]/70 flex items-center justify-between gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#ffffff] bg-[#0f766e] hover:bg-[#115e59] px-3.5 py-1.5 rounded-lg transition-colors shadow-2xs"
                    >
                      <span>Apply / View Listing</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenLinkedInJobs(job.jobTitle)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0a66c2] hover:text-[#084e96] bg-[#f0f7ff] hover:bg-[#e0f2fe] px-2.5 py-1.5 rounded-lg border border-[#bae6fd] transition-colors cursor-pointer"
                      title="Search for similar positions on LinkedIn"
                    >
                      <span>Check on LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingJobs && filteredJobs.length === 0 && (
          <div className="py-12 px-4 text-center bg-[#faf7f2] border border-dashed border-[#d8ccc0] rounded-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#fde8df] text-[#e25c50] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold font-serif-editorial text-[#191715]">
                No Open Roles Found For These Specific Filters
              </h4>
              <p className="text-xs text-[#6e685f] font-mono-meta max-w-md mx-auto mt-1">
                We couldn't find active postings matching your exact combination of city and level. Try clearing filters or searching live on LinkedIn Jobs.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-[#191715] bg-[#ffffff] border border-[#d8ccc0] hover:bg-[#faf6f0] rounded-xl transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}

              <button
                type="button"
                onClick={() => handleOpenLinkedInJobs()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Search LinkedIn Jobs for {activeTopic?.label || currentField.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Official Sources and Transparency Notice */}
        <div className="text-[11px] font-mono-meta text-[#8c8278] bg-[#faf7f2] border border-[#e7ded3] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0f766e] shrink-0" />
            <div className="leading-relaxed">
              <span>Verified Employer Feeds: </span>
              <strong>Dev Global Jobs</strong> (India domestic) &amp; <strong>Jobicy</strong> (International remote).
              Zero scraping. Expired listings automatically pruned.
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://devglobaljobs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0f766e] hover:underline font-bold"
            >
              Powered by Dev Global Jobs ↗
            </a>
            <span>•</span>
            <a
              href="https://jobicy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0a66c2] hover:underline font-bold"
            >
              Jobicy ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
