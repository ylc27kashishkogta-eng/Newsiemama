import { CustomVoiceProfile } from '../types';

export const voiceAnalyzer = {
  /**
   * Evaluates a user's ~100-word writing sample to derive tone markers.
   * Deterministic client-side analysis measuring sentence length, vocabulary register,
   * and structural tendencies.
   */
  analyzeWritingSample(sample: string): CustomVoiceProfile {
    const text = sample.trim();
    if (!text) {
      return {
        brevity: 'balanced',
        formality: 'semi-formal',
        useAnalogies: true,
        bulletPreference: false,
        rawSample: '',
      };
    }

    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 12;

    // Brevity detection
    let brevity: 'concise' | 'balanced' | 'detailed' = 'balanced';
    if (avgWordsPerSentence < 11 || text.includes('brief') || text.includes('short') || text.includes('quick')) {
      brevity = 'concise';
    } else if (avgWordsPerSentence > 19) {
      brevity = 'detailed';
    }

    // Formality heuristic
    const lower = text.toLowerCase();
    const formalWords = ['moreover', 'subsequently', 'furthermore', 'therefore', 'consequently', 'indicates', 'paramount'];
    const casualWords = ['like', 'basically', 'cool', 'super', 'guess', 'pretty', 'actually', 'kind of'];

    let formalHits = formalWords.filter((w) => lower.includes(w)).length;
    let casualHits = casualWords.filter((w) => lower.includes(w)).length;

    let formality: 'casual' | 'semi-formal' | 'formal' = 'semi-formal';
    if (casualHits > formalHits) {
      formality = 'casual';
    } else if (formalHits > 1 || lower.includes('executive') || lower.includes('formal')) {
      formality = 'formal';
    }

    // Analogy and bullet preferences
    const useAnalogies = lower.includes('analogy') || lower.includes('like') || lower.includes('imagine') || formality === 'casual';
    const bulletPreference = lower.includes('bullet') || lower.includes('points') || lower.includes('list') || brevity === 'concise';

    return {
      brevity,
      formality,
      useAnalogies,
      bulletPreference,
      rawSample: text.slice(0, 300),
      analyzedAt: new Date().toISOString(),
    };
  }
};
