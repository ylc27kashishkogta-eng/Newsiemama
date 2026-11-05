import React, { useEffect, useRef, useState } from 'react';
import { Newspaper, ArrowUpRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

type NewsimamaIntroProps = {
  onComplete: () => void;
};

const EXIT_MS = 750;

export const NewsimamaIntro: React.FC<NewsimamaIntroProps> = ({ onComplete }) => {
  const { reducedMotion } = useProfile();
  const [leaving, setLeaving] = useState(false);
  const completed = useRef(false);

  useEffect(() => {
    if (!leaving || completed.current) return;
    const timer = window.setTimeout(() => {
      completed.current = true;
      onComplete();
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, onComplete]);

  const enterNow = () => {
    if (completed.current) return;
    if (reducedMotion) {
      completed.current = true;
      onComplete();
    } else if (!leaving) {
      setLeaving(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        enterNow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reducedMotion, leaving]);

  return (
    <div
      className={`newsimama-intro${leaving ? ' newsimama-intro--leaving' : ''}${reducedMotion ? ' newsimama-intro--reduced-motion' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Newsiemama newspaper opening cover"
      onClick={enterNow}
    >
      <div className="newsimama-intro__paper" aria-hidden="true" />
      <div className="newsimama-intro__grain" aria-hidden="true" />
      <div className="newsimama-intro__orbit newsimama-intro__orbit--one" aria-hidden="true" />
      <div className="newsimama-intro__orbit newsimama-intro__orbit--two" aria-hidden="true" />

      <div className="newsimama-intro__content">
        <div className="newsimama-intro__seal" aria-hidden="true">
          <Newspaper strokeWidth={1.4} />
        </div>
        <div className="newsimama-intro__eyebrow">YOUR WORLD, YOUR EDITION</div>
        <h1 className="newsimama-intro__wordmark">Newsiemama</h1>
        <div className="newsimama-intro__rule" aria-hidden="true">
          <span />
        </div>
        <button
          className="newsimama-intro__enter"
          onClick={enterNow}
          type="button"
          aria-label="Enter the edition"
        >
          Enter the edition <ArrowUpRight size={15} aria-hidden="true" />
        </button>
        <span className="newsimama-intro__hint">Take your time - tap anywhere when ready</span>
      </div>
      <span className="sr-only">Opening Newsiemama personalized newspaper.</span>
    </div>
  );
};
