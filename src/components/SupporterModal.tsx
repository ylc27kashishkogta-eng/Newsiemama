import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SupporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupporterModal: React.FC<SupporterModalProps> = ({ isOpen, onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMockCheckout = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 animate-paper-fade">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-sm font-bold">
              ★
            </span>
            <div>
              <h3 className="font-masthead text-base font-bold text-zinc-900">Patron Supporter Edition</h3>
              <p className="text-xs text-zinc-500 font-serif-editorial">Dodo Payments Integration (Target: Oct 31)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer" title="Close (Esc)">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="space-y-4">
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 leading-relaxed">
              <strong>Support Independent Journalism:</strong> As a Patron Supporter, you unlock early morning dispatch deliveries, unlimited AI voice adaptations, and priority feed indexing.
            </div>

            <div className="space-y-2 text-xs text-zinc-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Unlimited personalized story explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Exclusive Economic Times & Mint priority indexing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Custom PDF broadsheet printable editions (Coming Soon)</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4 text-center">
              <div className="text-2xl font-bold text-zinc-900 mb-1 font-mono-meta">
                $4.99 <span className="text-xs text-zinc-500 font-normal">/ month</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-4">
                Mock sandbox checkout powered by Dodo Payments API client
              </p>

              <button
                onClick={handleMockCheckout}
                className="w-full py-3 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Test Dodo Payments Mock Checkout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 animate-paper-fade">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 text-base">Patron Supporter Tier Activated!</h4>
            <p className="text-xs text-zinc-600">
              Thank you for supporting Curio Dispatch. Your edition now features priority broadsheet indexing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
