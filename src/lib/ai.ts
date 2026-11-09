import { GoogleGenAI } from '@google/genai';
export function genAI() {
 const key=process.env.GEMINI_API_KEY;
 if(!key) throw new Error('Gemini is not configured. Add GEMINI_API_KEY to your server environment.');
 return new GoogleGenAI({apiKey:key});
}
export const chatModel=()=>process.env.GEMINI_CHAT_MODEL||'gemini-2.5-flash';
