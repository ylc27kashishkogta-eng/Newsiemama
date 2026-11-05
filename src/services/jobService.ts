/**
 * Multi-Source Verified Job Service
 * 
 * Sources:
 * 1. Dev Global Jobs (India & Domestic Remote)
 *    - Free display API covering 8,800+ active jobs across Indian cities & remote India.
 *    - Unkeyed, CORS-enabled, official documentation: https://devglobaljobs.com/developers
 *    - Attribution: "Powered by Dev Global Jobs" with link to https://devglobaljobs.com
 * 
 * 2. Jobicy (International Remote)
 *    - Free public remote API covering international opportunities (US, Europe, Worldwide).
 *    - Unkeyed, CORS-enabled, official documentation: https://jobicy.com
 *    - Attribution: Link to https://jobicy.com
 * 
 * Quality & Compliance:
 * - Zero scraping of private portals.
 * - Expired listings automatically filtered out via closingDate.
 * - Clear separation between Indian domestic roles and International remote roles.
 */

export type JobScope = 'india' | 'international';

export interface JobListing {
  id: string | number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  normalizedCity?: 'Bengaluru' | 'Delhi NCR' | 'Mumbai / Pune' | 'Hyderabad' | 'Chennai' | 'Remote (India)' | 'Other India';
  scope: JobScope;
  jobLevel?: string;
  jobType: string[];
  jobIndustry: string[];
  jobExcerpt: string;
  pubDate: string;
  salary?: string;
  source: 'Dev Global Jobs' | 'Jobicy';
  sourceUrl: string;
  isRemote: boolean;
}

export interface JobFetchResult {
  jobs: JobListing[];
  indiaCount: number;
  internationalCount: number;
  success: boolean;
  error?: string;
  fetchedAt: string;
  sourceNotice: string;
}

export interface JobFilterCriteria {
  scope?: 'all' | 'india' | 'international';
  city?: 'all' | 'bengaluru' | 'delhi_ncr' | 'mumbai_pune' | 'hyderabad' | 'chennai' | 'remote_in';
  workMode?: 'all' | 'remote' | 'on_site_hybrid';
  keyword?: string;
  level?: string;
  jobType?: string;
}

// In-memory cache (5-minute TTL)
interface CacheEntry {
  data: JobListing[];
  timestamp: number;
}

let jobsCache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Normalizes Indian location strings into major metropolitan hiring hubs.
 */
function normalizeIndianLocation(rawLocation: string): 'Bengaluru' | 'Delhi NCR' | 'Mumbai / Pune' | 'Hyderabad' | 'Chennai' | 'Remote (India)' | 'Other India' {
  const loc = rawLocation.toLowerCase();

  if (loc.includes('bengaluru') || loc.includes('bangalore') || loc.includes('whitefield') || loc.includes('electronic city')) {
    return 'Bengaluru';
  }
  if (loc.includes('gurugram') || loc.includes('gurgaon') || loc.includes('noida') || loc.includes('delhi') || loc.includes('ncr')) {
    return 'Delhi NCR';
  }
  if (loc.includes('mumbai') || loc.includes('pune') || loc.includes('navi mumbai') || loc.includes('thane')) {
    return 'Mumbai / Pune';
  }
  if (loc.includes('hyderabad') || loc.includes('secunderabad') || loc.includes('telangana')) {
    return 'Hyderabad';
  }
  if (loc.includes('chennai') || loc.includes('tamil nadu')) {
    return 'Chennai';
  }
  if (loc.includes('remote') || loc.includes('work from home') || loc.includes('wfh')) {
    return 'Remote (India)';
  }

  return 'Other India';
}

/**
 * Detects experience level from title or summary.
 */
function inferExperienceLevel(title: string, excerpt: string, explicitLevel?: string): string {
  if (explicitLevel && explicitLevel.trim() !== '') return explicitLevel;

  const text = (title + ' ' + excerpt).toLowerCase();
  if (text.includes('senior') || text.includes('sr.') || text.includes('lead') || text.includes('principal') || text.includes('architect') || text.includes('manager') || text.includes('director')) {
    return 'Senior / Lead';
  }
  if (text.includes('intern') || text.includes('entry') || text.includes('junior') || text.includes('graduate') || text.includes('associate') || text.includes('trainee')) {
    return 'Entry / Junior';
  }
  return 'Mid Level';
}

export const jobService = {
  /**
   * Fetch jobs concurrently from Dev Global Jobs (India) and Jobicy (International Remote).
   */
  async fetchJobs(topicKeywords?: string, forceRefresh = false): Promise<JobFetchResult> {
    const now = Date.now();

    if (!forceRefresh && jobsCache && now - jobsCache.timestamp < CACHE_TTL_MS) {
      const indiaCount = jobsCache.data.filter((j) => j.scope === 'india').length;
      const internationalCount = jobsCache.data.filter((j) => j.scope === 'international').length;
      return {
        jobs: jobsCache.data,
        indiaCount,
        internationalCount,
        success: true,
        fetchedAt: new Date(jobsCache.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceNotice: 'Jobs sourced from Dev Global Jobs (India) and Jobicy (International Remote)',
      };
    }

    const fetchedJobs: JobListing[] = [];
    const errors: string[] = [];

    // 1. Fetch Indian Roles from Dev Global Jobs
    try {
      const dgjController = new AbortController();
      const dgjTimeout = setTimeout(() => dgjController.abort(), 7500);

      const dgjUrl = 'https://devglobaljobs.com/api/v1/jobs?country=IN&limit=50';
      const dgjRes = await fetch(dgjUrl, {
        signal: dgjController.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(dgjTimeout);

      if (dgjRes.ok) {
        const dgjData = await dgjRes.json();
        if (dgjData && Array.isArray(dgjData.jobs)) {
          const currentTimeIso = new Date().toISOString();

          dgjData.jobs.forEach((raw: any) => {
            // Filter out expired jobs if closingDate is past
            if (raw.closingDate && raw.closingDate < currentTimeIso) {
              return;
            }

            const rawLocation = raw.location || 'India';
            const normalizedCity = normalizeIndianLocation(rawLocation);
            const isRemote =
              rawLocation.toLowerCase().includes('remote') ||
              (raw.category && raw.category.toLowerCase().includes('remote'));

            // Clean html tags from excerpt
            let cleanExcerpt = raw.descriptionExcerpt || '';
            cleanExcerpt = cleanExcerpt
              .replace(/<[^>]*>/g, '')
              .replace(/&hellip;/g, '...')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>');

            const level = inferExperienceLevel(raw.title || '', cleanExcerpt);

            fetchedJobs.push({
              id: `dgj-${raw.id}`,
              url: raw.url || `https://devglobaljobs.com/jobs/detail/${raw.id}`,
              jobTitle: raw.title || 'Role in India',
              companyName: raw.organization || 'Verified Employer',
              companyLogo: undefined,
              location: rawLocation,
              normalizedCity,
              scope: 'india',
              jobLevel: level,
              jobType: raw.jobType ? [raw.jobType] : ['Full-Time'],
              jobIndustry: [raw.category || 'technology', raw.skillCategory || ''].filter(Boolean),
              jobExcerpt: cleanExcerpt,
              pubDate: raw.postedAt || new Date().toISOString(),
              salary: raw.salary || undefined,
              source: 'Dev Global Jobs',
              sourceUrl: 'https://devglobaljobs.com',
              isRemote,
            });
          });
        }
      } else {
        errors.push(`Dev Global Jobs responded with status ${dgjRes.status}`);
      }
    } catch (e: any) {
      errors.push(`India jobs feed error: ${e.message}`);
    }

    // 2. Fetch International Remote Roles from Jobicy
    try {
      const jobicyController = new AbortController();
      const jobicyTimeout = setTimeout(() => jobicyController.abort(), 7500);

      const jobicyRes = await fetch('https://jobicy.com/api/v2/remote-jobs?count=30', {
        signal: jobicyController.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(jobicyTimeout);

      if (jobicyRes.ok) {
        const jobicyData = await jobicyRes.json();
        if (jobicyData && Array.isArray(jobicyData.jobs)) {
          jobicyData.jobs.forEach((raw: any) => {
            let salary: string | undefined;
            if (raw.salaryMin && raw.salaryMax) {
              const cur = raw.salaryCurrency || 'USD';
              const per = raw.salaryPeriod ? `/${raw.salaryPeriod}` : '';
              salary = `${cur} ${Number(raw.salaryMin).toLocaleString()} – ${Number(raw.salaryMax).toLocaleString()} ${per}`;
            }

            let cleanExcerpt = raw.jobExcerpt || '';
            cleanExcerpt = cleanExcerpt
              .replace(/<[^>]*>/g, '')
              .replace(/&hellip;/g, '...')
              .replace(/&amp;/g, '&');

            const jobTypeArr: string[] = Array.isArray(raw.jobType)
              ? raw.jobType
              : raw.jobType
              ? [String(raw.jobType)]
              : ['Full-Time'];

            const jobIndustryArr: string[] = Array.isArray(raw.jobIndustry)
              ? raw.jobIndustry
              : raw.jobIndustry
              ? [String(raw.jobIndustry)]
              : [];

            fetchedJobs.push({
              id: `jobicy-${raw.id || raw.jobSlug}`,
              url: raw.url || 'https://jobicy.com',
              jobTitle: raw.jobTitle || 'Remote Position',
              companyName: raw.companyName || 'Verified Employer',
              companyLogo: raw.companyLogo || undefined,
              location: `${raw.jobGeo || 'Worldwide'} (Remote)`,
              scope: 'international',
              jobLevel: raw.jobLevel || 'All Levels',
              jobType: jobTypeArr,
              jobIndustry: jobIndustryArr,
              jobExcerpt: cleanExcerpt,
              pubDate: raw.pubDate || new Date().toISOString(),
              salary,
              source: 'Jobicy',
              sourceUrl: 'https://jobicy.com',
              isRemote: true,
            });
          });
        }
      } else {
        errors.push(`Jobicy responded with status ${jobicyRes.status}`);
      }
    } catch (e: any) {
      errors.push(`International remote feed error: ${e.message}`);
    }

    if (fetchedJobs.length > 0) {
      jobsCache = {
        data: fetchedJobs,
        timestamp: now,
      };

      const indiaCount = fetchedJobs.filter((j) => j.scope === 'india').length;
      const internationalCount = fetchedJobs.filter((j) => j.scope === 'international').length;

      return {
        jobs: fetchedJobs,
        indiaCount,
        internationalCount,
        success: true,
        fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceNotice: 'Sourced from Dev Global Jobs (India) and Jobicy (International Remote)',
        error: errors.length > 0 ? errors.join('; ') : undefined,
      };
    }

    return {
      jobs: [],
      indiaCount: 0,
      internationalCount: 0,
      success: false,
      error: errors.join('; ') || 'Unable to retrieve live listings.',
      fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceNotice: 'Job feeds temporarily unavailable.',
    };
  },

  /**
   * Filter job listings in-memory by user criteria.
   */
  filterJobs(jobs: JobListing[], criteria: JobFilterCriteria): JobListing[] {
    return jobs.filter((job) => {
      // 1. Geographic Scope Filter (India vs International vs All)
      if (criteria.scope && criteria.scope !== 'all') {
        if (job.scope !== criteria.scope) return false;
      }

      // 2. Indian City Filter (only applies to Indian listings)
      if (criteria.city && criteria.city !== 'all') {
        if (job.scope === 'india') {
          const cityMap: Record<string, string> = {
            bengaluru: 'Bengaluru',
            delhi_ncr: 'Delhi NCR',
            mumbai_pune: 'Mumbai / Pune',
            hyderabad: 'Hyderabad',
            chennai: 'Chennai',
            remote_in: 'Remote (India)',
          };
          const target = cityMap[criteria.city];
          if (target && job.normalizedCity !== target) {
            return false;
          }
        }
      }

      // 3. Work Mode Filter (Remote vs On-Site/Hybrid)
      if (criteria.workMode && criteria.workMode !== 'all') {
        if (criteria.workMode === 'remote' && !job.isRemote) {
          return false;
        }
        if (criteria.workMode === 'on_site_hybrid' && job.isRemote) {
          return false;
        }
      }

      // 4. Keyword Filter (Title, Company, Location, Excerpt)
      if (criteria.keyword && criteria.keyword.trim() !== '') {
        const query = criteria.keyword.toLowerCase().trim();
        const matchesTitle = job.jobTitle.toLowerCase().includes(query);
        const matchesCompany = job.companyName.toLowerCase().includes(query);
        const matchesExcerpt = job.jobExcerpt.toLowerCase().includes(query);
        const matchesLocation = job.location.toLowerCase().includes(query);
        const matchesIndustry = job.jobIndustry.some((ind) => ind.toLowerCase().includes(query));

        if (!matchesTitle && !matchesCompany && !matchesExcerpt && !matchesLocation && !matchesIndustry) {
          return false;
        }
      }

      // 5. Experience Level Filter
      if (criteria.level && criteria.level !== 'all') {
        const levelTarget = criteria.level.toLowerCase();
        const jobLevel = (job.jobLevel || '').toLowerCase();
        if (levelTarget === 'senior' && !jobLevel.includes('senior') && !jobLevel.includes('lead') && !jobLevel.includes('director')) {
          return false;
        }
        if (levelTarget === 'entry' && !jobLevel.includes('entry') && !jobLevel.includes('junior') && !jobLevel.includes('associate')) {
          return false;
        }
        if (levelTarget === 'mid' && !jobLevel.includes('mid') && jobLevel.includes('senior')) {
          return false;
        }
      }

      // 6. Job Type Filter
      if (criteria.jobType && criteria.jobType !== 'all') {
        const typeTarget = criteria.jobType.toLowerCase();
        const matchesType = job.jobType.some((t) => t.toLowerCase().includes(typeTarget));
        if (!matchesType) return false;
      }

      return true;
    });
  },
};
