import React, { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Clock,
  ShieldCheck,
  Building2,
  BarChart3,
  AlertCircle,
  Info,
  Layers,
} from 'lucide-react';
import { indianMarketService, MarketQuote } from '../services/indianMarketService';

interface TradingViewMarketsSectionProps {
  className?: string;
}

export const TradingViewMarketsSection: React.FC<TradingViewMarketsSectionProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'indices' | 'equities' | 'tatamotors'>('indices');
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchQuotes = async (force = false) => {
    setIsLoading(true);
    try {
      const result = await indianMarketService.getMarketQuotes(force);
      if (result.success && result.quotes.length > 0) {
        setQuotes(result.quotes);
        setLastRefreshed(result.asOf);
        setErrorNotice(result.error || null);
      } else {
        setErrorNotice(result.error || 'Failed to retrieve market quotes.');
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Error connecting to market data service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(false);
  }, []);

  const indices = useMemo(() => quotes.filter((q) => q.category === 'index'), [quotes]);
  const mainEquities = useMemo(
    () => quotes.filter((q) => q.category === 'equity' && !q.symbol.includes('TM')),
    [quotes]
  );
  const tataMotorsEntities = useMemo(
    () => quotes.filter((q) => q.symbol.includes('TMPV') || q.symbol.includes('TMCV')),
    [quotes]
  );

  const currentList = activeTab === 'indices' ? indices : activeTab === 'equities' ? mainEquities : tataMotorsEntities;

  return (
    <div
      className={`bg-[#ffffff] border border-[#e7ded3] rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-5 sm:mb-7 shadow-2xs animate-paper-fade space-y-4 max-w-full overflow-hidden ${className}`}
    >
      {/* Header & Source Transparency Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-[#f0eae1] gap-2.5 sm:gap-3">
        <div className="flex items-start sm:items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#0f766e]/10 border border-[#0f766e]/20 flex items-center justify-center text-[#0f766e] shrink-0 mt-0.5 sm:mt-0">
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold font-serif-editorial text-[#191715]">
                Indian Markets &amp; Equities Watchlist
              </h2>
              <span className="text-[9px] sm:text-[10px] font-mono-meta font-bold uppercase tracking-wider bg-[#f0fdfa] text-[#0f766e] border border-[#99f6e4] px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>15-Min Delayed</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#5c554e] font-sans mt-0.5 leading-snug">
              NSE &amp; BSE quotes provided via TradingView public market feed (15-minute delayed). For informational purposes only.
            </p>
          </div>
        </div>

        {/* Timestamp & Refresh Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[10px] sm:text-[11px] font-mono-meta text-[#8c8278] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#0f766e]" />
            <span>{lastRefreshed ? `Updated ${lastRefreshed}` : 'Pending update'}</span>
          </span>

          <button
            type="button"
            onClick={() => fetchQuotes(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#5c554e] hover:text-[#191715] bg-[#faf6f0] hover:bg-[#ede5dc] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-[#d8ccc0] transition-colors cursor-pointer"
            title="Refresh latest market data"
          >
            <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLoading ? 'animate-spin text-[#0f766e]' : ''}`} />
            <span>{isLoading ? 'Updating…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Indices vs Equities vs Tata Motors Demerger */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center bg-[#faf7f2] border border-[#e7ded3] rounded-lg sm:rounded-xl p-0.5 sm:p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('indices')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-md sm:rounded-lg transition-all cursor-pointer ${
              activeTab === 'indices'
                ? 'bg-[#191715] text-[#ffffff] shadow-2xs'
                : 'text-[#6e685f] hover:text-[#191715]'
            }`}
          >
            Indices ({indices.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('equities')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-md sm:rounded-lg transition-all cursor-pointer ${
              activeTab === 'equities'
                ? 'bg-[#191715] text-[#ffffff] shadow-2xs'
                : 'text-[#6e685f] hover:text-[#191715]'
            }`}
          >
            Equities ({mainEquities.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tatamotors')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-md sm:rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'tatamotors'
                ? 'bg-[#0f766e] text-[#ffffff] shadow-2xs'
                : 'text-[#0f766e] hover:text-[#115e59]'
            }`}
          >
            <span>Tata Motors Demerger</span>
            <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-white/20 font-mono-meta uppercase">
              Notice
            </span>
          </button>
        </div>

        <span className="text-[10px] sm:text-[11px] font-mono-meta text-[#8c8278]">
          NSE &amp; BSE India
        </span>
      </div>

      {/* Demerger Context Box (when in tatamotors tab) */}
      {activeTab === 'tatamotors' && (
        <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 text-[11px] sm:text-xs text-[#134e4a] flex items-start gap-2.5 sm:gap-3">
          <Info className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-[#115e59]">
              Why the old unified symbol "TATAMOTORS" no longer trades:
            </div>
            <p className="leading-relaxed">
              Tata Motors completed its corporate demerger separating its passenger and commercial vehicle businesses.
              Trading now occurs under two listed instruments:
              <strong> TMPV</strong> (Passenger Vehicles, EVs &amp; JLR) and
              <strong> TMCV</strong> (Commercial Vehicles, trucks &amp; buses).
              Both live instruments are tracked below with their official exchange quotes.
            </p>
          </div>
        </div>
      )}

      {/* Error state if quotes failed and not loading */}
      {!isLoading && quotes.length === 0 ? (
        <div className="bg-[#fff8f5] border border-[#f5cbbe] rounded-xl p-4 text-center space-y-2">
          <AlertCircle className="w-5 h-5 text-[#9e4429] mx-auto" />
          <div className="text-xs font-bold text-[#82351f]">
            {errorNotice || 'Unable to connect to market data feed.'}
          </div>
          <p className="text-[11px] text-[#5c554e] max-w-md mx-auto">
            The market scanner feed is temporarily unreachable. Please check your network or try refreshing.
          </p>
          <button
            type="button"
            onClick={() => fetchQuotes(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#191715] text-white px-3 py-1.5 rounded-lg hover:bg-[#302922] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry connection</span>
          </button>
        </div>
      ) : isLoading && quotes.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 py-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#faf7f2] border border-[#e7ded3] rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2.5 animate-pulse"
            >
              <div className="h-3.5 bg-[#e7ded3] rounded w-1/2" />
              <div className="h-6 bg-[#e7ded3] rounded w-3/4" />
              <div className="h-2.5 bg-[#e7ded3] rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {currentList.map((q) => {
            const isPositive = q.change >= 0;
            const priceFormatted = indianMarketService.formatPrice(q.price, q.category === 'index');

            return (
              <div
                key={q.symbol}
                className="bg-[#faf7f2] hover:bg-[#ffffff] border border-[#e7ded3] hover:border-[#0f766e]/40 rounded-lg sm:rounded-xl p-3 sm:p-3.5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between gap-2.5 group"
              >
                <div>
                  {/* Top Bar: Exchange & Symbol */}
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="text-[9px] sm:text-[10px] font-mono-meta font-bold uppercase tracking-wider text-[#6e685f] bg-[#ffffff] border border-[#e7ded3] px-1.5 py-0.5 rounded">
                      {q.exchange}
                    </span>

                    <span className="text-[9px] sm:text-[10px] font-mono-meta text-[#8c8278]">
                      15m delay
                    </span>
                  </div>

                  {/* Title & Name */}
                  <h3 className="font-serif-editorial text-xs sm:text-sm font-bold text-[#191715] group-hover:text-[#0f766e] transition-colors leading-snug">
                    {q.name}
                  </h3>
                  <div className="text-[9px] sm:text-[10px] font-mono-meta text-[#8c8278]">{q.symbol}</div>

                  {/* Current Price */}
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <div className="text-base sm:text-lg font-bold font-mono-meta text-[#191715] tracking-tight">
                      {priceFormatted}
                    </div>

                    <div
                      className={`inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md font-mono-meta ${
                        isPositive
                          ? 'text-[#0f766e] bg-[#f0fdfa] border border-[#99f6e4]'
                          : 'text-[#e25c50] bg-[#fef2f2] border border-[#fecaca]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {q.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Day's Range High / Low */}
                  <div className="mt-2 pt-2 border-t border-[#e7ded3]/70 text-[9px] sm:text-[10px] font-mono-meta text-[#6e685f] space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Low: <strong>{q.low.toLocaleString('en-IN')}</strong></span>
                      <span>High: <strong>{q.high.toLocaleString('en-IN')}</strong></span>
                    </div>

                    {/* Visual range indicator */}
                    <div className="w-full bg-[#e7ded3] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0f766e] h-full rounded-full"
                        style={{
                          width: `${Math.max(
                            5,
                            Math.min(
                              100,
                              q.high > q.low ? ((q.price - q.low) / (q.high - q.low)) * 100 : 50
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-2 border-t border-[#e7ded3]/60 flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-mono-meta text-[#8c8278]">
                    Open: {q.open.toLocaleString('en-IN')}
                  </span>

                  <a
                    href={q.tradingViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#0f766e] hover:underline"
                    title={`View ${q.ticker} chart on TradingView`}
                  >
                    <span>Chart</span>
                    <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Market Data Disclosure & Attribution Footer */}
      <div className="bg-[#faf7f2] border border-[#e7ded3] rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 text-xs text-[#6e685f] space-y-1 font-mono-meta">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#191715] font-semibold text-[10px] sm:text-[11px]">
          <span>Market Data Attribution:</span>
          <span className="text-[#0f766e]">TradingView Public Market Feed</span>
        </div>
        <p className="text-[9px] sm:text-[10px] text-[#8c8278] leading-relaxed">
          Market prices shown are 15-minute delayed exchange quotes (NSE &amp; BSE) for educational and personal tracking.
          Newsimama does not provide financial advisory, broker services, or simulated prices.
        </p>
      </div>
    </div>
  );
};
