import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { indianMarketService, MarketQuote } from '../services/indianMarketService';

interface MarketDataTickerProps {
  onToggleDetailedView?: () => void;
  isDetailedViewOpen?: boolean;
}

export const MarketDataTicker: React.FC<MarketDataTickerProps> = ({
  onToggleDetailedView,
  isDetailedViewOpen = false,
}) => {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [asOf, setAsOf] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchQuotes = async (force = false) => {
    setIsLoading(true);
    try {
      const res = await indianMarketService.getMarketQuotes(force);
      if (res.success && res.quotes.length > 0) {
        setQuotes(res.quotes);
        setAsOf(res.asOf);
        setErrorNotice(res.error || null);
      } else {
        setErrorNotice(res.error || 'Market quotes currently unavailable.');
      }
    } catch (e: any) {
      setErrorNotice(e.message || 'Error fetching quotes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(false);
    // 5-minute periodic refresh
    const interval = setInterval(() => fetchQuotes(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#ffffff] border-y border-[#e7ded3] py-1.5 px-2.5 sm:px-4 mb-4 sm:mb-5 text-[11px] sm:text-xs font-mono-meta shadow-2xs max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left Badge & Disclaimer */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[#0f766e]">
            <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="font-bold text-[#191715] uppercase tracking-wider text-[10px] sm:text-[11px]">
              Indian Markets:
            </span>
          </div>

          <span className="text-[9px] sm:text-[10px] font-bold text-[#0f766e] bg-[#f0fdfa] border border-[#99f6e4] px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0f766e] animate-pulse" />
            <span>15-Min Delayed (NSE &amp; BSE)</span>
          </span>

          {asOf ? (
            <span className="hidden md:inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-[#8c8278]">
              <Clock className="w-3 h-3 text-[#0f766e]" />
              <span>As of {asOf}</span>
            </span>
          ) : null}
        </div>

        {/* Right Controls: Refresh & Detailed Watchlist Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => fetchQuotes(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#5c554e] hover:text-[#191715] bg-[#faf7f2] hover:bg-[#ede5dc] px-2 py-1 rounded-md sm:rounded-lg border border-[#e7ded3] transition-colors cursor-pointer"
            title="Refresh Indian market prices"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#0f766e]' : ''}`} />
            <span>{isLoading ? 'Updating…' : 'Refresh'}</span>
          </button>

          {onToggleDetailedView && (
            <button
              type="button"
              onClick={onToggleDetailedView}
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#0f766e] hover:text-[#115e59] bg-[#f0fdfa] hover:bg-[#e6fbf7] px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg border border-[#99f6e4] transition-all cursor-pointer"
            >
              <BarChart2 className="w-3 h-3" />
              <span>{isDetailedViewOpen ? 'Hide Watchlist' : 'Explore Watchlist'}</span>
              {isDetailedViewOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling Quotes Tape */}
      <div className="mt-2 overflow-x-auto max-w-full pb-0.5 scrollbar-thin">
        {isLoading && quotes.length === 0 ? (
          <div className="py-1.5 text-center text-[10px] sm:text-[11px] text-[#8c8278] animate-pulse">
            Fetching verified NSE &amp; BSE market prices…
          </div>
        ) : quotes.length > 0 ? (
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap min-w-max py-0.5">
            {quotes.map((q) => {
              const isPositive = q.change >= 0;
              return (
                <div
                  key={q.symbol}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#faf7f2] hover:bg-[#f2ece2] border border-[#e7ded3] rounded-md sm:rounded-lg transition-colors text-[10px] sm:text-[11px]"
                >
                  <span className="text-[9px] sm:text-[10px] font-mono-meta font-bold text-[#6e685f] uppercase">
                    {q.exchange}:
                  </span>
                  <span className="font-bold text-[#191715]">{q.ticker}</span>
                  <span className="font-mono-meta font-semibold text-[#191715]">
                    {indianMarketService.formatPrice(q.price, q.category === 'index')}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold px-1 py-0.2 rounded ${
                      isPositive
                        ? 'text-[#0f766e] bg-[#f0fdfa]'
                        : 'text-[#e25c50] bg-[#fef2f2]'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}
                      {q.changePercent.toFixed(2)}%
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-1.5 px-2 text-center text-[10px] sm:text-[11px] text-[#9a422a] bg-[#fff5f0] border border-[#f5cbbe] rounded-md flex flex-wrap items-center justify-center gap-2">
            <span>{errorNotice || 'Unable to retrieve live market numbers at this moment.'}</span>
            <button
              type="button"
              onClick={() => fetchQuotes(true)}
              className="inline-flex items-center gap-1 font-bold text-[#0f766e] underline hover:no-underline cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
