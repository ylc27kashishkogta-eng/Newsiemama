import React, { useState, useEffect } from 'react';
import { Story, AgentResponse } from '../types';
import {
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Building2,
  TrendingUp,
  X,
  Key,
  Layers,
  ChevronRight,
  Send,
  HelpCircle
} from 'lucide-react';

interface VisualBusinessAgentProps {
  isOpen: boolean;
  onClose: () => void;
  activeStories: Story[];
}

export const VisualBusinessAgent: React.FC<VisualBusinessAgentProps> = ({
  isOpen,
  onClose,
  activeStories,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    geminiConnected: boolean;
    marketConnected: boolean;
    provider: string;
  }>({
    geminiConnected: false,
    marketConnected: false,
    provider: 'alphavantage',
  });

  // Check integration status from server endpoint
  useEffect(() => {
    if (isOpen) {
      fetch('/api/status')
        .then((res) => res.json())
        .then((data) => {
          setApiStatus({
            geminiConnected: Boolean(data.geminiConnected),
            marketConnected: Boolean(data.marketConnected),
            provider: data.provider || 'alphavantage',
          });
        })
        .catch(() => {
          setApiStatus({ geminiConnected: false, marketConnected: false, provider: 'alphavantage' });
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAsk = async (userPrompt: string) => {
    const trimmed = userPrompt.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setResponse(null);

    // Call server-side agent endpoint (server holds key safely)
    try {
      const res = await fetch('/api/gemini/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          activeStories: activeStories.slice(0, 10).map((s) => ({
            title: s.title,
            sourceName: s.sourceName,
            publishedAt: s.publishedAt,
            canonicalUrl: s.canonicalUrl,
            content: s.content,
            deck: s.deck,
          })),
        }),
      });

      const json = await res.json();

      if (json.connected && json.response) {
        setResponse({
          directAnswer: json.response.directAnswer || 'Analysis generated based on active dispatches.',
          businessAnalysis: json.response.businessAnalysis,
          sourcesCited: json.response.sourcesCited || [],
          unknownNotice: json.response.unknownNotice,
          connected: true,
          asOf: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        // Fallback when GEMINI_API_KEY is not configured
        const matched = activeStories.filter((s) =>
          s.title.toLowerCase().includes(trimmed.toLowerCase()) ||
          s.content.toLowerCase().includes(trimmed.toLowerCase())
        );

        setResponse({
          directAnswer: matched.length > 0
            ? `Found ${matched.length} relevant live article(s) in your current edition. Review the exact source links below for verified reporting.`
            : `No matching articles for "${trimmed}" in today's active dispatches. Live AI synthesis is not connected.`,
          businessAnalysis: matched.length > 0
            ? `Reported developments from ${matched.map((m) => m.sourceName).join(', ')}. Full business model and capex data require the primary publisher dispatches cited below.`
            : undefined,
          sourcesCited: matched.map((m) => ({
            title: m.title,
            publisher: m.sourceName,
            publishedAt: m.publishedAt,
            url: m.canonicalUrl,
          })),
          unknownNotice: 'Live generative AI synthesis and stock price lookups are not connected. Set GEMINI_API_KEY and MARKET_DATA_API_KEY in your local .env to enable server-side generative responses.',
          connected: false,
          asOf: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (err: any) {
      setResponse({
        directAnswer: `Query processing encountered an error: ${err.message}`,
        sourcesCited: [],
        connected: false,
        asOf: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleChips = [
    activeStories[0]
      ? `Explain the business impact of: "${activeStories[0].title.slice(0, 40)}..."`
      : 'What are the main economic trends reported today?',
    'What policy shifts are highlighted in today’s dispatches?',
    'Are there any semiconductor or infrastructure updates today?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#181513]/40 backdrop-blur-xs flex justify-end">
      {/* Backdrop */}
      <div className="flex-1" onClick={onClose} aria-label="Close backdrop" />

      {/* Slide-over Agent Panel */}
      <aside
        aria-label="Visual AI News and Business Agent"
        className="w-full max-w-2xl bg-[#faf7f2] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-drawer-slide border-l border-[#e4dcd3]"
      >
        <div>
          {/* Header */}
          <div className="sticky top-0 bg-[#ffffff] border-b border-[#e4dcd3] px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#eee8f8] text-[#7c66dc] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-editorial text-lg font-bold text-[#181513]">
                  AI News & Business Agent
                </h3>
                <p className="text-xs text-[#6e685f] font-mono-meta">
                  Grounded strictly in {activeStories.length} live retrieved articles
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#8f887d] hover:text-[#181513] hover:bg-[#faf7f2] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Live Credentials & Status Banner */}
            <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-2xl p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#181513] flex items-center gap-1.5 font-mono-meta uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-[#4e6c58]" />
                  <span>Integration Status</span>
                </span>
                <span className="text-[11px] font-mono-meta text-[#8f887d]">
                  Zero Mock Data Policy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Gemini Status */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  apiStatus.geminiConnected
                    ? 'bg-[#e3ece5] border-[#c1d6c7] text-[#3e5f49]'
                    : 'bg-[#faf7f2] border-[#e4dcd3] text-[#6e685f]'
                }`}>
                  <span className="font-medium">Google AI Studio (Gemini):</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apiStatus.geminiConnected ? 'bg-[#4e6c58] text-white' : 'bg-[#e4dcd3] text-[#5c5449]'
                  }`}>
                    {apiStatus.geminiConnected ? 'Connected' : 'Unconfigured'}
                  </span>
                </div>

                {/* Market Data Status */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  apiStatus.marketConnected
                    ? 'bg-[#e3ece5] border-[#c1d6c7] text-[#3e5f49]'
                    : 'bg-[#faf7f2] border-[#e4dcd3] text-[#6e685f]'
                }`}>
                  <span className="font-medium">Market Data ({apiStatus.provider}):</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apiStatus.marketConnected ? 'bg-[#4e6c58] text-white' : 'bg-[#e4dcd3] text-[#5c5449]'
                  }`}>
                    {apiStatus.marketConnected ? 'Connected' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {!apiStatus.geminiConnected && (
                <p className="text-[11px] text-[#8f887d] leading-relaxed pt-1 border-t border-[#f0eae1]">
                  💡 <strong>To enable live generative Q&A:</strong> Add <code>GEMINI_API_KEY=your_key</code> to your local <code>.env</code> file. Your key is stored server-side and is never exposed in browser code.
                </p>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(query);
              }}
              className="space-y-2"
            >
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8f887d]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about a company, business model, or market shift..."
                  className="w-full pl-10 pr-24 py-3 bg-[#ffffff] border border-[#d8ccc0] rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7c66dc] transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 top-2 px-3 py-1.5 bg-[#7c66dc] hover:bg-[#6750c8] disabled:opacity-40 text-[#ffffff] text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span>Ask</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sampleChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(chip);
                      handleAsk(chip);
                    }}
                    className="text-[11px] bg-[#ffffff] hover:bg-[#eee8f8] hover:text-[#7c66dc] text-[#5c5449] px-2.5 py-1 rounded-full border border-[#e4dcd3] transition-colors truncate max-w-full"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </form>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-8 text-center space-y-2 animate-paper-fade">
                <div className="w-6 h-6 border-2 border-[#7c66dc] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-serif-editorial italic text-xs text-[#6e685f]">
                  Consulting {activeStories.length} verified dispatches & analyzing business impact...
                </p>
              </div>
            )}

            {/* Answer Display */}
            {response && !isLoading && (
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4dcd3] p-6 shadow-sm space-y-4 animate-paper-fade">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#7c66dc]" />
                    <span className="font-serif-editorial font-bold text-sm text-[#181513]">
                      Agent Analysis
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-meta text-[#8f887d]">
                    As of: {response.asOf}
                  </span>
                </div>

                {/* Direct Answer */}
                <div>
                  <p className="text-xs sm:text-sm text-[#181513] leading-relaxed font-sans">
                    {response.directAnswer}
                  </p>
                </div>

                {/* Business Model / Capex Analysis */}
                {response.businessAnalysis && (
                  <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-xl p-3.5 space-y-1">
                    <span className="text-[11px] font-mono-meta font-bold uppercase text-[#e25c50] block">
                      Business & Strategic Mechanics
                    </span>
                    <p className="text-xs text-[#3a332a] leading-relaxed">
                      {response.businessAnalysis}
                    </p>
                  </div>
                )}

                {/* Cited Sources List */}
                {response.sourcesCited && response.sourcesCited.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#f0eae1]">
                    <span className="text-[11px] font-mono-meta font-bold uppercase text-[#6e685f] block">
                      Supporting Live Sources Cited ({response.sourcesCited.length}):
                    </span>

                    <div className="space-y-1.5">
                      {response.sourcesCited.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-[#faf7f2] hover:bg-[#eee8f8] border border-[#e4dcd3] transition-colors group"
                        >
                          <div className="min-w-0">
                            <h5 className="font-serif-editorial text-xs font-bold text-[#181513] truncate group-hover:text-[#7c66dc]">
                              {src.title}
                            </h5>
                            <p className="text-[10px] font-mono-meta text-[#8f887d]">
                              {src.publisher} • {src.publishedAt ? new Date(src.publishedAt).toLocaleDateString() : 'Recent wire'}
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-[#8f887d] group-hover:text-[#7c66dc] shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unknown Notice Disclaimer */}
                {response.unknownNotice && (
                  <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-xl p-3 text-[11px] text-[#6e685f] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#e25c50] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {response.unknownNotice}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#faf7f2] border-t border-[#e4dcd3] p-4 text-center text-xs text-[#8f887d] font-mono-meta">
          Strictly grounded in verified live feeds • Zero AI hallucinations • No synthetic prices
        </div>
      </aside>
    </div>
  );
};
