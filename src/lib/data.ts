export type Notebook = { id: string; title: string; description: string; updatedAt: string; sources: number };
const key = 'synora-notebooks-v1';
export function readNotebooks(): Notebook[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]') as Notebook[]; } catch { return []; }
}
export function writeNotebooks(items: Notebook[]) { localStorage.setItem(key, JSON.stringify(items)); }
