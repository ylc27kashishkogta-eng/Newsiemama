import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Clock } from 'lucide-react';

export const MarketDataTicker: React.FC = () => {
  const [marketInfo, setMarketInfo] = useState<{
    connected: boolean;
    provider?: string;
    asOf: string;
    message?: string;
    data?: any;
  }>({
    connected: false,
    asOf: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  useEffect(() => {
    fetch('/api/market')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMarketInfo({
          connected: Boolean(data.connected),
          provider: data.provider || 'alphavantage',
          asOf: data.asOf || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: data.message,
          data: data.data,
        });
      })
      .catch(() => {
        const isStaticHost = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
        setMarketInfo({
          connected: false,
          asOf: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: isStaticHost
            ? 'Live quotes unavailable on static GitHub Pages (Requires backend server)'
            : 'Live market data service unconfigured (Set MARKET_DATA_API_KEY in .env)',
        });
      });
  }, []);

  return (
    <div className="bg-[#ffffff] border-y border-[#e7ded3] py-2 px-4 mb-5 text-xs font-mono-meta flex flex-wrap items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-[#0f766e]" />
        <span className="font-bold text-[#191715] uppercase tracking-wider text-[11px]">
          Financial Markets:
        </span>
        {marketInfo.connected ? (
          <span className="text-[#0f766e] bg-[#f0fdfa] border border-[#99f6e4] px-2 py-0.5 rounded-full text-[10px] font-bold">
            Live Provider Active ({marketInfo.provider})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[#82351f] bg-[#fde8df] border border-[#f5cbbe] px-2.5 py-0.5 rounded-full text-[10px] font-medium">
            <AlertCircle className="w-3 h-3 text-[#9e4429]" />
            <span>{marketInfo.message || 'Live market quotes unavailable without server backend'}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-[#5c554e]">
        <span className="font-medium text-[#0f766e]">Zero synthetic prices policy</span>
        <span>•</span>
        <span className="flex items-center gap-1 text-[#8c8278]">
          <Clock className="w-3 h-3 text-[#8c8278]" />
          <span>As of: {marketInfo.asOf}</span>
        </span>
      </div>
    </div>
  );
};
