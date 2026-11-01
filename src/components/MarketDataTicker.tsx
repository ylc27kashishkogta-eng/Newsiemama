import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

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
      .then((res) => res.json())
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
        setMarketInfo({
          connected: false,
          asOf: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: 'Market data service is unreachable.',
        });
      });
  }, []);

  return (
    <div className="bg-[#ffffff] border-y border-[#e4dcd3] py-2 px-4 mb-4 text-xs font-mono-meta flex flex-wrap items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-[#e25c50]" />
        <span className="font-bold text-[#181513] uppercase tracking-wider text-[11px]">
          Financial Markets:
        </span>
        {marketInfo.connected ? (
          <span className="text-[#3e5f49] bg-[#e3ece5] px-2 py-0.5 rounded-full text-[10px] font-bold">
            Live Provider Active ({marketInfo.provider})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[#8f887d] bg-[#faf7f2] border border-[#e4dcd3] px-2 py-0.5 rounded-full text-[10px]">
            <AlertCircle className="w-3 h-3 text-[#e25c50]" />
            <span>Live market quotes unavailable (Provider unconfigured)</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-[#6e685f]">
        <span>Zero synthetic prices policy</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#8f887d]" />
          <span>As of: {marketInfo.asOf}</span>
        </span>
      </div>
    </div>
  );
};
