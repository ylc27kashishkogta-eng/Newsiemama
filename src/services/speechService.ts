export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isEnhanced: boolean;
  label: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public async getVoices(): Promise<VoiceOption[]> {
    if (!this.synth) return [];

    return new Promise((resolve) => {
      let voices = this.synth!.getVoices();
      if (voices.length > 0) {
        resolve(this.formatVoices(voices));
        return;
      }

      this.synth!.onvoiceschanged = () => {
        voices = this.synth!.getVoices();
        resolve(this.formatVoices(voices));
      };

      // Fallback timeout in case onvoiceschanged does not fire
      setTimeout(() => {
        resolve(this.formatVoices(this.synth?.getVoices() || []));
      }, 500);
    });
  }

  private formatVoices(rawVoices: SpeechSynthesisVoice[]): VoiceOption[] {
    // Prioritize English voices, natural/neural/enhanced indicators
    return rawVoices
      .filter((v) => v.lang.startsWith('en') || v.lang.startsWith('hi'))
      .map((v) => {
        const lowerName = v.name.toLowerCase();
        const isEnhanced =
          lowerName.includes('natural') ||
          lowerName.includes('enhanced') ||
          lowerName.includes('neural') ||
          lowerName.includes('google') ||
          lowerName.includes('samantha') ||
          lowerName.includes('karen') ||
          lowerName.includes('daniel') ||
          lowerName.includes('rishi');

        return {
          voice: v,
          name: v.name,
          lang: v.lang,
          isEnhanced,
          label: `${v.name} (${v.lang})${isEnhanced ? ' ★ Enhanced' : ''}`,
        };
      })
      .sort((a, b) => (b.isEnhanced ? 1 : 0) - (a.isEnhanced ? 1 : 0));
  }

  public speak(
    text: string,
    options: {
      voice?: SpeechSynthesisVoice | null;
      rate?: number;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    } = {}
  ): void {
    if (!this.synth) return;

    this.stop(); // Clear any existing speech

    const utterance = new SpeechSynthesisUtterance(text);
    if (options.voice) {
      utterance.voice = options.voice;
    }
    utterance.rate = options.rate || 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options.onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth?.speaking && !this.synth?.paused);
  }

  public isPaused(): boolean {
    return Boolean(this.synth?.paused);
  }
}

export const speechService = new SpeechService();
