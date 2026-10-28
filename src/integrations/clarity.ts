/**
 * Microsoft Clarity Analytics Client (Target: October 31)
 * 
 * Documentation & Setup:
 * 1. Create a project at https://clarity.microsoft.com
 * 2. Copy your Clarity Project ID (alphanumeric string, e.g. "k8q2jx9m")
 * 3. Set `VITE_CLARITY_PROJECT_ID` in your `.env.local` or call `clarity.init("YOUR_ID")`
 * 4. Clarity captures heatmaps, scroll depth, and session replays with zero PII.
 */

interface ClarityFunction {
  (...args: unknown[]): void;
  q?: unknown[];
}

declare global {
  interface Window {
    clarity?: ClarityFunction;
  }
}

export const clarity = {
  isInitialized: false,

  init(projectId?: string): void {
    const id = projectId || (import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined);
    if (!id || this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      const win = window as unknown as Record<string, ClarityFunction | undefined>;
      win.clarity = win.clarity || function (...args: unknown[]) {
        (win.clarity!.q = win.clarity!.q || []).push(args);
      };

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.clarity.ms/tag/' + id;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);

      this.isInitialized = true;
      console.info(`[Clarity] Initialized session recording with ID: ${id}`);
    } catch (e) {
      console.warn('[Clarity] Initialization error:', e);
    }
  },

  trackEvent(eventName: string, data?: Record<string, string | number | boolean>): void {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName, data);
    }
  },

  trackStoryOpened(storyId: string, category: string): void {
    this.trackEvent('story_opened', { storyId, category });
  },

  trackToneChanged(newPreset: string): void {
    this.trackEvent('voice_preset_changed', { preset: newPreset });
  },

  trackProfileSwitched(profileId: string): void {
    this.trackEvent('profile_switched', { profileId });
  },
};
