import React, { useEffect, useRef, useState } from 'react';
import { Newspaper, ArrowUpRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

type NewsimamaIntroProps = {
  onComplete: () => void;
};

const INTRO_HOLD_MS = 2100;
const EXIT_MS = 750;

export const NewsimamaIntro: React.FC<NewsimamaIntroProps> = ({ onComplete }) => {
  const { reducedMotion } = useProfile();
  const [leaving, setLeaving] = useState(false);
  const completed = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      // In reduced-motion mode, transition swiftly without prolonged animation delays
      const timer = window.setTimeout(() => {
        if (!completed.current) {
          completed.current = true;
          onComplete();
        }
      }, 900);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setLeaving(true), INTRO_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, onComplete]);

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

  return (
    <div
      className={`newsimama-intro${leaving ? ' newsimama-intro--leaving' : ''}${reducedMotion ? ' newsimama-intro--reduced-motion' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Newsimama newspaper opening cover"
      onClick={enterNow}
    >
      <div className="newsimama-intro__paper" aria-hidden="true" />
      <div className="newsimama-intro__grain" aria-hidden="true" />
      <div className="newsimama-intro__orbit newsimama-intro__orbit--one" aria-hidden="true" />
      <div className="newsimama-intro__orbit newsimama-intro__orbit--two" aria-hidden="true" />

      <div className="newsimama-intro__content" onClick={(event) => event.stopPropagation()}>
        <div className="newsimama-intro__seal" aria-hidden="true">
          <Newspaper strokeWidth={1.4} />
        </div>
        <div className="newsimama-intro__eyebrow">YOUR WORLD, YOUR EDITION</div>
        <h1 className="newsimama-intro__wordmark">Newsimama</h1>
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
      </div>
      <span className="sr-only">Opening Newsimama personalized newspaper.</span>
    </div>
  );
};
