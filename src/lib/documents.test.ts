import { describe, expect, it } from 'vitest';
import { splitIntoChunks } from './documents';

describe('splitIntoChunks',()=>{
 it('returns no empty content for blank input',()=>{expect(splitIntoChunks('  \n\n ')).toEqual([]);});
 it('splits long text into bounded chunks while retaining text',()=>{const text='A useful research sentence. '.repeat(250);const chunks=splitIntoChunks(text,400,60);expect(chunks.length).toBeGreaterThan(1);expect(chunks.every(c=>c.length<=401)).toBe(true);expect(chunks.join(' ')).toContain('research sentence');});
 it('creates more chunks when a smaller window is requested',()=>{const text='A sentence with enough words. '.repeat(40);const standard=splitIntoChunks(text,500,80);const smaller=splitIntoChunks(text,180,40);expect(smaller.length).toBeGreaterThan(standard.length);});
});
