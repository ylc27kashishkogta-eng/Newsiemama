import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#e4dcd3] animate-paper-fade">
        <div className="flex items-center justify-between pb-3 border-b border-[#e4dcd3] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#fdf3e7] flex items-center justify-center text-[#8b4513] text-sm font-bold border border-[#f0d4b8]">
              ★
            </span>
            <div>
              <h3 className="font-masthead text-base font-bold text-[#1e1b18]">Patron Supporter Edition</h3>
              <p className="text-xs text-[#6e685f] font-serif-editorial">Dodo Payments Integration (Target: Oct 31)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8f887d] hover:text-[#1e1b18] cursor-pointer" title="Close (Esc)">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="space-y-4">
            <div className="bg-[#fbf4eb] border border-[#edd8be] rounded-xl p-4 text-xs text-[#7a481c] leading-relaxed">
              <strong>Support Independent Journalism:</strong> As a Patron Supporter, you unlock early morning dispatch deliveries, unlimited AI voice adaptations, and priority feed indexing.
            </div>

            <div className="space-y-2 text-xs text-[#3a332a]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4e6c58]" />
                <span>Unlimited personalized story explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4e6c58]" />
                <span>Exclusive Economic Times & Mint priority indexing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4e6c58]" />
                <span>Custom PDF broadsheet printable editions (Coming Soon)</span>
              </div>
            </div>

            <div className="border-t border-[#e4dcd3] pt-4 text-center">
              <div className="text-2xl font-bold text-[#1e1b18] mb-1 font-mono-meta">
                $4.99 <span className="text-xs text-[#8f887d] font-normal">/ month</span>
              </div>
              <p className="text-[11px] text-[#8f887d] mb-4">
                Mock sandbox checkout powered by Dodo Payments API client
              </p>

              <button
                onClick={handleMockCheckout}
                className="w-full py-3 bg-[#1e1b18] hover:bg-[#342f2b] text-[#faf7f2] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#4e6c58]" />
                <span>Test Dodo Payments Mock Checkout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 animate-paper-fade">
            <div className="w-12 h-12 bg-[#edf2ee] text-[#3b5744] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#cbe0d0]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#1e1b18] text-base">Patron Supporter Tier Activated!</h4>
            <p className="text-xs text-[#6e685f]">
              Thank you for supporting Curio Dispatch. Your edition now features priority broadsheet indexing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
