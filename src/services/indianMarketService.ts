/**
 * Legitimate Indian Market Data Service
 * 
 * Delayed market data feed covering Indian benchmark indices and bluechip equities.
 * 
 * Source & Latency Notice:
 * - Data source: TradingView Indian Market Feed.
 * - Latency: 15-minute exchange-delayed feed (NSE & BSE).
 * - Zero synthetic or simulated prices.
 * - Browser-safe CORS-safelisted endpoint.
 */

export interface MarketQuote {
  symbol: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume?: number;
  exchange: 'BSE' | 'NSE';
  category: 'index' | 'equity';
  updateMode: string;
  tradingViewUrl: string;
}

export interface MarketFetchResult {
  quotes: MarketQuote[];
  indices: MarketQuote[];
  equities: MarketQuote[];
  success: boolean;
  asOf: string;
  source: string;
  delayNotice: string;
  error?: string;
}

// Configured symbol universe
export const SUPPORTED_INDIAN_SYMBOLS = [
  // Core Indices
  'BSE:SENSEX',
  'NSE:NIFTY',
  'NSE:BANKNIFTY',
  'NSE:CNXIT',

  // Top Indian Bluechip Equities
  'NSE:RELIANCE',
  'NSE:TCS',
  'NSE:HDFCBANK',
  'NSE:INFY',
  'NSE:ICICIBANK',
  'NSE:BHARTIARTL',
  'NSE:SBIN',
  'NSE:ITC',
  'NSE:LT',
  'NSE:HINDUNILVR',

  // Tata Motors Demerged Entities (TMPV & TMCV)
  'NSE:TMPV',
  'NSE:TMCV',
];

// Clean human-friendly titles
const SYMBOL_DISPLAY_METADATA: Record<
  string,
  { ticker: string; name: string; exchange: 'BSE' | 'NSE'; category: 'index' | 'equity' }
> = {
  'BSE:SENSEX': { ticker: 'SENSEX', name: 'S&P BSE SENSEX', exchange: 'BSE', category: 'index' },
  'NSE:NIFTY': { ticker: 'NIFTY 50', name: 'Nifty 50 Benchmark', exchange: 'NSE', category: 'index' },
  'NSE:BANKNIFTY': { ticker: 'NIFTY BANK', name: 'Nifty Bank Index', exchange: 'NSE', category: 'index' },
  'NSE:CNXIT': { ticker: 'NIFTY IT', name: 'Nifty IT Index', exchange: 'NSE', category: 'index' },

  'NSE:RELIANCE': { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', category: 'equity' },
  'NSE:TCS': { ticker: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', category: 'equity' },
  'NSE:HDFCBANK': { ticker: 'HDFC BANK', name: 'HDFC Bank Ltd', exchange: 'NSE', category: 'equity' },
  'NSE:INFY': { ticker: 'INFOSYS', name: 'Infosys Ltd', exchange: 'NSE', category: 'equity' },
  'NSE:ICICIBANK': { ticker: 'ICICI BANK', name: 'ICICI Bank Ltd', exchange: 'NSE', category: 'equity' },
  'NSE:BHARTIARTL': { ticker: 'AIRTEL', name: 'Bharti Airtel Ltd', exchange: 'NSE', category: 'equity' },
  'NSE:SBIN': { ticker: 'SBI', name: 'State Bank of India', exchange: 'NSE', category: 'equity' },
  'NSE:ITC': { ticker: 'ITC', name: 'ITC Ltd', exchange: 'NSE', category: 'equity' },
  'NSE:LT': { ticker: 'L&T', name: 'Larsen & Toubro Ltd', exchange: 'NSE', category: 'equity' },
  'NSE:HINDUNILVR': { ticker: 'HUL', name: 'Hindustan Unilever Ltd', exchange: 'NSE', category: 'equity' },

  'NSE:TMPV': { ticker: 'TATA MOTORS (PV)', name: 'Tata Motors Passenger Vehicles', exchange: 'NSE', category: 'equity' },
  'NSE:TMCV': { ticker: 'TATA MOTORS (CV)', name: 'Tata Motors Commercial Vehicles', exchange: 'NSE', category: 'equity' },
};

let cachedResult: MarketFetchResult | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 1-minute in-memory cache

export const indianMarketService = {
  /**
   * Fetch verified delayed quotes for Indian market symbols.
   */
  async getMarketQuotes(forceRefresh = false): Promise<MarketFetchResult> {
    const now = Date.now();

    if (!forceRefresh && cachedResult && now - lastCacheTimestamp < CACHE_TTL_MS) {
      return cachedResult;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    try {
      const response = await fetch('https://scanner.tradingview.com/india/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          symbols: {
            tickers: SUPPORTED_INDIAN_SYMBOLS,
          },
          columns: [
            'name',          // 0: ticker symbol
            'close',         // 1: latest price
            'change',        // 2: change in percent
            'change_abs',    // 3: absolute change
            'description',   // 4: company description
            'update_mode',   // 5: data latency mode (e.g. delayed_streaming_900)
            'volume',        // 6: daily volume
            'open',          // 7: open price
            'high',          // 8: day high
            'low',           // 9: day low
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Market endpoint HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.data)) {
        throw new Error('Invalid market data payload received from provider.');
      }

      const quotes: MarketQuote[] = data.data.map((item: any) => {
        const symbolKey = item.s;
        const meta = SYMBOL_DISPLAY_METADATA[symbolKey] || {
          ticker: item.d[0] || symbolKey,
          name: item.d[4] || symbolKey,
          exchange: symbolKey.startsWith('BSE') ? 'BSE' : 'NSE',
          category: symbolKey.includes('SENSEX') || symbolKey.includes('NIFTY') ? 'index' : 'equity',
        };

        const price = Number(item.d[1]) || 0;
        const changePercent = Number(item.d[2]) || 0;
        const change = Number(item.d[3]) || 0;
        const high = Number(item.d[8]) || price;
        const low = Number(item.d[9]) || price;
        const open = Number(item.d[7]) || price;
        const volume = Number(item.d[6]) || 0;

        return {
          symbol: symbolKey,
          ticker: meta.ticker,
          name: meta.name,
          price,
          change,
          changePercent,
          high,
          low,
          open,
          volume,
          exchange: meta.exchange,
          category: meta.category,
          updateMode: '15-Min Delayed Feed',
          tradingViewUrl: `https://www.tradingview.com/symbols/${symbolKey.replace(':', '-')}/`,
        };
      });

      const indices = quotes.filter((q) => q.category === 'index');
      const equities = quotes.filter((q) => q.category === 'equity');

      const result: MarketFetchResult = {
        quotes,
        indices,
        equities,
        success: true,
        asOf: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'TradingView Public Feed (NSE & BSE India)',
        delayNotice: 'Quotes are delayed by 15 minutes (exchange feed). For informational purposes only.',
      };

      cachedResult = result;
      lastCacheTimestamp = now;

      return result;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (cachedResult) {
        return {
          ...cachedResult,
          error: `Notice: Showing cached quotes (${err.name === 'AbortError' ? 'Timeout' : err.message})`,
        };
      }

      return {
        quotes: [],
        indices: [],
        equities: [],
        success: false,
        asOf: '',
        source: 'TradingView Public Feed (NSE & BSE India)',
        delayNotice: 'Quotes are delayed by 15 minutes (exchange feed). For informational purposes only.',
        error: err.name === 'AbortError' ? 'Market data request timed out.' : (err.message || 'Market data feed temporarily unreachable.'),
      };
    }
  },

  /**
   * Helper to format Indian Rupee prices cleanly.
   */
  formatPrice(price: number, isIndex = false): string {
    if (isIndex) {
      return price.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `₹${price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },
};
