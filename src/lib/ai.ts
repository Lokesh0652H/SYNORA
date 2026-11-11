import { GoogleGenAI } from '@google/genai';

export function genAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Gemini is not configured. Add GEMINI_API_KEY to your server environment.');
  return new GoogleGenAI({ apiKey: key });
}

export const chatModel = () => {
  const m = process.env.GEMINI_CHAT_MODEL;
  if (m && !m.includes('2.5') && !m.includes('2.0') && !m.includes('1.5')) {
    return m;
  }
  return 'gemini-3.5-flash';
};
