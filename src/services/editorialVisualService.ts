import { Story, TopicCategory } from '../types';

export type VisualMotif =
  | 'space'
  | 'technology'
  | 'finance'
  | 'climate'
  | 'politics'
  | 'world'
  | 'culture'
  | 'editorial';

export interface ExtractedMetric {
  type: 'percentage' | 'currency' | 'stat';
  value: string;
  label: string;
  rawSnippet: string;
  numericValue?: number;
  benchmarkRatio?: number; // 0 to 1 for valid percentages
}

export interface StoryVisualTheme {
  motif: VisualMotif;
  motifTitle: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  secondaryColor: string;
  metric: ExtractedMetric | null;
  editorialKicker: string;
}

/**
 * Detects the most appropriate visual motif based on category and headline keywords.
 */
export function detectVisualMotif(category: TopicCategory | string, title = '', content = ''): VisualMotif {
  const text = `${title} ${content}`.toLowerCase();

  // 1. Climate, Clean Energy & Environment (takes precedence over generic terms like "energy market")
  if (
    category === 'climate' ||
    text.match(/\b(climate|carbon|solar|wind|renewable|emissions|green energy|temperature|wildfire|ocean|forest|clean energy|turbine|grid capacity|hydropower|warming|cop\d+)\b/)
  ) {
    return 'climate';
  }

  // 2. Space & Cosmic Science
  if (
    category === 'science' ||
    text.match(/\b(space|isro|nasa|esa|moon|lunar|mars|orbit|orbital|satellite|rocket|propulsion|astronomy|cosmic|telescope|planetary|galaxy|deep space|astrophysics)\b/)
  ) {
    return 'space';
  }

  // 3. Technology, Chips & Computing
  if (
    category === 'tech' ||
    text.match(/\b(chip|semiconductor|silicon|ai|artificial intelligence|algorithm|software|quantum|cloud|gpu|compute|neural|cyber|hardware|fab|foundry|nvidia|intel|amd|tsmc|llm)\b/)
  ) {
    return 'technology';
  }

  // 4. World & Geopolitics
  if (
    category === 'world' ||
    text.match(/\b(un|united nations|treaty|diplomacy|border|summit|geopolitic|global|international|sanction|sanctions|embassy|envoy|nato|war|peace|conflict)\b/)
  ) {
    return 'world';
  }

  // 5. Politics, Governance, Courts & Law
  if (
    category === 'policy' ||
    text.match(/\b(court|supreme court|parliament|election|elections|vote|voting|minister|cabinet|policy|governance|bill|law|senate|congress|constitution|bench|ruling)\b/)
  ) {
    return 'politics';
  }

  // 6. Sports, Culture & Arts
  if (
    category === 'sports_culture' ||
    text.match(/\b(cricket|football|olympic|olympics|match|tournament|film|cinema|art|festival|music|stadium|trophy|actor|actress|exhibition|cultural)\b/)
  ) {
    return 'culture';
  }

  // 7. Finance, Banking, Capital Markets & Economy
  if (
    category === 'finance' ||
    category === 'economy' ||
    text.match(/\b(bank|banking|lending|bond|bonds|yield|yields|market|markets|stock|stocks|shares|rupee|dollar|inflation|gdp|ipo|revenue|profit|credit|fiscal|fed|rbi|fundraising|investor|venture|valuation)\b/)
  ) {
    return 'finance';
  }

  return 'editorial';
}

/**
 * Extracts strictly verified factual numbers from story text.
 * Returns null if no real numbers exist to prevent fake data presentation.
 */
export function extractStoryMetrics(story: {
  title?: string;
  deck?: string;
  content?: string;
}): ExtractedMetric | null {
  const fullText = `${story.title || ''}. ${story.deck || ''}. ${story.content || ''}`.trim();
  if (!fullText) return null;

  // 1. Percentage Extraction: e.g. "14.2%", "+7.5%", "22 percent"
  const pctRegex = /(?:(?:rose|grew|dropped|fell|increased|decreased|accelerated|climbed|up|down|by)\s+(?:to\s+)?)?([+-]?\d+(?:\.\d+)?%|[+-]?\d+(?:\.\d+)?\s*(?:percent|per cent))/i;
  const pctMatch = fullText.match(pctRegex);
  if (pctMatch) {
    const rawVal = pctMatch[1].replace(/\s*(?:percent|per cent)/i, '%').trim();
    const num = parseFloat(rawVal);
    const benchmark = !isNaN(num) && num >= 0 && num <= 100 ? num / 100 : undefined;

    // Find snippet context
    const idx = fullText.indexOf(pctMatch[0]);
    const start = Math.max(0, idx - 25);
    const end = Math.min(fullText.length, idx + pctMatch[0].length + 25);
    const snippet = fullText.slice(start, end).replace(/\s+/g, ' ').trim();

    // Derive concise label
    let label = 'Reported Rate';
    if (/growth|accelerat|expand/i.test(snippet)) label = 'Reported Growth';
    else if (/drop|fall|decline|shrink/i.test(snippet)) label = 'Reported Decline';
    else if (/inflation|cpi/i.test(snippet)) label = 'Inflation Metric';
    else if (/yield|rate/i.test(snippet)) label = 'Benchmark Yield';
    else if (/share|stake/i.test(snippet)) label = 'Reported Share';

    return {
      type: 'percentage',
      value: rawVal,
      label,
      rawSnippet: snippet,
      numericValue: num,
      benchmarkRatio: benchmark
    };
  }

  // 2. Currency Extraction: e.g. "₹1.2 lakh crore", "$10 billion", "€800M", "Rs 5,400 crore"
  const currRegex = /(?:[₹$€£]|Rs\.?|USD|INR)\s*(\d+(?:,\d+)*(?:\.\d+)?\s*(?:lakh crore|crore|lakh|billion|million|trillion|k|m|b)?)/i;
  const currMatch = fullText.match(currRegex);
  if (currMatch) {
    const symbol = currMatch[0].match(/^[₹$€£]|Rs\.?|USD|INR/i)?.[0] || '';
    const cleanVal = `${symbol} ${currMatch[1]}`.trim();

    const idx = fullText.indexOf(currMatch[0]);
    const start = Math.max(0, idx - 25);
    const end = Math.min(fullText.length, idx + currMatch[0].length + 25);
    const snippet = fullText.slice(start, end).replace(/\s+/g, ' ').trim();

    let label = 'Capital / Deal Metric';
    if (/fundrais|funding|invest|raise/i.test(snippet)) label = 'Fundraising Volume';
    else if (/loan|credit|advanc/i.test(snippet)) label = 'Credit Volume';
    else if (/revenue|sale|turnover/i.test(snippet)) label = 'Reported Revenue';
    else if (/profit|net/i.test(snippet)) label = 'Profit Metric';
    else if (/valuat/i.test(snippet)) label = 'Reported Valuation';

    return {
      type: 'currency',
      value: cleanVal,
      label,
      rawSnippet: snippet
    };
  }

  // 3. Technical & Unit Capacity: e.g. "510 GW", "440N", "85 bps", "1,250 points"
  const statRegex = /(\d+(?:,\d+)*(?:\.\d+)?)\s*(gw|mw|kw|bps|basis points|points|pts|tons|twh)/i;
  const statMatch = fullText.match(statRegex);
  if (statMatch) {
    const unit = statMatch[2].toUpperCase();
    const cleanVal = `${statMatch[1]} ${unit}`;

    const idx = fullText.indexOf(statMatch[0]);
    const start = Math.max(0, idx - 20);
    const end = Math.min(fullText.length, idx + statMatch[0].length + 20);
    const snippet = fullText.slice(start, end).replace(/\s+/g, ' ').trim();

    let label = 'Reported Capacity';
    if (/bps|basis points/i.test(unit)) label = 'Rate Adjustment';
    else if (/points|pts/i.test(unit)) label = 'Index Movement';

    return {
      type: 'stat',
      value: cleanVal,
      label,
      rawSnippet: snippet
    };
  }

  // Zero-invention guarantee: return null if no verifiable figures are reported
  return null;
}

/**
 * Derives comprehensive visual theme settings for a given story.
 */
export function getStoryVisualTheme(story: Story): StoryVisualTheme {
  const motif = detectVisualMotif(story.category, story.title, story.content || story.deck);
  const metric = extractStoryMetrics(story);

  switch (motif) {
    case 'space':
      return {
        motif,
        motifTitle: 'Cosmic & Orbital Exploration',
        accentColor: '#0f766e',
        accentBg: '#e0f2fe',
        borderColor: '#99f6e4',
        secondaryColor: '#0284c7',
        metric,
        editorialKicker: 'Astrophysics & Aerospace Vector'
      };

    case 'technology':
      return {
        motif,
        motifTitle: 'Silicon & Computation Architecture',
        accentColor: '#0f766e',
        accentBg: '#f0fdfa',
        borderColor: '#99f6e4',
        secondaryColor: '#0284c7',
        metric,
        editorialKicker: 'Computing & Circuit Telemetry'
      };

    case 'finance':
      return {
        motif,
        motifTitle: 'Capital Markets & Economic Ledger',
        accentColor: '#0f766e',
        accentBg: '#fde8df',
        borderColor: '#f5cbbe',
        secondaryColor: '#82351f',
        metric,
        editorialKicker: 'Financial Vector & Valuation Index'
      };

    case 'climate':
      return {
        motif,
        motifTitle: 'Atmospheric & Ecological Systems',
        accentColor: '#047857',
        accentBg: '#f0fdf4',
        borderColor: '#a7f3d0',
        secondaryColor: '#0f766e',
        metric,
        editorialKicker: 'Renewable Dynamics & Energy Grid'
      };

    case 'politics':
      return {
        motif,
        motifTitle: 'Civic Governance & Legislative Assembly',
        accentColor: '#82351f',
        accentBg: '#fde8df',
        borderColor: '#f5cbbe',
        secondaryColor: '#191715',
        metric,
        editorialKicker: 'Constitutional & Policy Record'
      };

    case 'world':
      return {
        motif,
        motifTitle: 'Geopolitical & Meridian Coordinates',
        accentColor: '#0369a1',
        accentBg: '#e0f2fe',
        borderColor: '#bae6fd',
        secondaryColor: '#0f766e',
        metric,
        editorialKicker: 'Global Dispatch & International Grid'
      };

    case 'culture':
      return {
        motif,
        motifTitle: 'Cultural Expression & Kinetic Momentum',
        accentColor: '#9e4429',
        accentBg: '#fde8df',
        borderColor: '#f5cbbe',
        secondaryColor: '#0f766e',
        metric,
        editorialKicker: 'Arts, Sports & Narrative Rhythm'
      };

    case 'editorial':
    default:
      return {
        motif: 'editorial',
        motifTitle: 'Broadsheet Dispatch & Record',
        accentColor: '#191715',
        accentBg: '#faf6f0',
        borderColor: '#e7ded3',
        secondaryColor: '#0f766e',
        metric,
        editorialKicker: 'Editorial Broadsheet Typography'
      };
  }
}
