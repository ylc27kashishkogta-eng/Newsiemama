import React, { useState } from 'react';
import { Mail, Sparkles, ShieldCheck, Clock, Key, AlertCircle, X, ExternalLink, Check } from 'lucide-react';

interface FutureIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureIntegrationsModal: React.FC<FutureIntegrationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata (IST)');
  const [isSavedEmailPreview, setIsSavedEmailPreview] = useState(false);

  if (!isOpen) return null;

  const handleSaveEmailPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSavedEmailPreview(true);
      setTimeout(() => setIsSavedEmailPreview(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#181513]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e4dcd3] animate-paper-fade space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#f0eae1] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fbeae5] text-[#e25c50] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-xl font-bold text-[#181513]">
                Integrations & Delivery Roadmap
              </h3>
              <p className="text-xs text-[#6e685f]">
                Honest technical prerequisites for email delivery & AI synchronization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8f887d] hover:text-[#181513] hover:bg-[#faf7f2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature 1: 9:00 AM Timezone Email Dispatch */}
        <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e25c50]" />
              <h4 className="font-serif-editorial font-bold text-sm text-[#181513]">
                9:00 AM Morning Email Digest
              </h4>
            </div>
            <span className="text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded-full bg-[#fbeae5] text-[#9b2c48] font-bold">
              Roadmap Spec
            </span>
          </div>

          <p className="text-xs text-[#5c5449] leading-relaxed">
            Delivers a concise, personalized PDF or formatted newsletter directly to your inbox every morning at 9:00 AM local time.
          </p>

          {/* Honest Technical Prerequisite Notice */}
          <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-xl p-3 text-xs text-[#6e685f] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#181513]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4e6c58]" />
              <span>Production Prerequisites (Security & Architecture)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#5c5449]">
              • Requires a scheduled worker queue (e.g. Cloudflare Workers Cron or AWS EventBridge) to trigger timezone-aware dispatches.<br />
              • Requires Google OAuth 2.0 or transactional email service (Resend / SendGrid).<br />
              • <strong>Security Rule:</strong> This local frontend demo will never ask for your email password or store credentials in unencrypted storage.
            </p>
          </div>

          {/* Configuration Mock Preview */}
          <form onSubmit={handleSaveEmailPreview} className="pt-2 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="email"
                placeholder="reader@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="text-xs bg-[#ffffff] border border-[#e4dcd3] rounded-xl px-3 py-2 text-[#181513] focus:outline-none focus:ring-1 focus:ring-[#e25c50]"
              />
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="text-xs bg-[#ffffff] border border-[#e4dcd3] rounded-xl px-3 py-2 text-[#181513] focus:outline-none focus:ring-1 focus:ring-[#e25c50]"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST, UTC+5:30)</option>
                <option value="America/New_York (EST)">America/New York (EST, UTC-5)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT, UTC+0)</option>
                <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT, UTC+8)</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181513] text-[#ffffff] text-xs font-medium hover:bg-[#3a332a] transition-colors"
            >
              {isSavedEmailPreview ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4e6c58]" />
                  <span>Preferences Staged Locally</span>
                </>
              ) : (
                <span>Stage Delivery Schedule</span>
              )}
            </button>
          </form>
        </div>

        {/* Feature 2: ChatGPT Style & Profile Sync */}
        <div className="bg-[#faf7f2] border border-[#e4dcd3] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7c66dc]" />
              <h4 className="font-serif-editorial font-bold text-sm text-[#181513]">
                ChatGPT Custom Style Sync
              </h4>
            </div>
            <span className="text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded-full bg-[#eee8f8] text-[#7c66dc] font-bold">
              API-First Roadmap
            </span>
          </div>

          <p className="text-xs text-[#5c5449] leading-relaxed">
            Allows readers to import custom voice instructions or connect an OpenAI API key (BYOK) to generate individualized story explanations.
          </p>

          <div className="bg-[#ffffff] border border-[#e4dcd3] rounded-xl p-3 text-xs text-[#6e685f] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#181513]">
              <AlertCircle className="w-3.5 h-3.5 text-[#7c66dc]" />
              <span>Architectural Transparency</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#5c5449]">
              • Newsimama never claims to scrape or secretly access private ChatGPT chats.<br />
              • Live custom AI calls will use standard, user-provided OpenAI API keys stored client-side.<br />
              • For today’s demo, the three built-in narrative engines (Quick Brief, Friendly Explainer, Storyteller) run 100% locally with zero API cost.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0eae1]">
          <p className="text-[11px] font-mono-meta text-[#8f887d]">
            Local prototype • Zero external telemetry
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#181513] text-[#ffffff] text-xs font-medium hover:bg-[#3a332a] transition-colors"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

