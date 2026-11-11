export type Notebook = { id: string; title: string; description: string; updatedAt: string; sources: number };
const key = 'synora-notebooks-v1';

export function readNotebooks(): Notebook[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]') as Notebook[]; } catch { return []; }
}

export function writeNotebooks(items: Notebook[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(items));
}

export function renameNotebook(id: string, newTitle: string): void {
  if (typeof window === 'undefined') return;
  const list = readNotebooks().map((b) =>
    b.id === id ? { ...b, title: newTitle.trim(), updatedAt: 'Just now' } : b
  );
  writeNotebooks(list);
  window.dispatchEvent(new Event('synora-data'));
  window.dispatchEvent(new Event('storage'));
}

export function deleteNotebook(id: string): void {
  if (typeof window === 'undefined') return;
  const list = readNotebooks().filter((b) => b.id !== id);
  writeNotebooks(list);
  try {
    localStorage.removeItem(`synora_sources_${id}`);
  } catch {}
  window.dispatchEvent(new Event('synora-data'));
  window.dispatchEvent(new Event('storage'));
}
