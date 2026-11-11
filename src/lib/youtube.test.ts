import { describe, it, expect } from 'vitest';
import { extractYouTubeVideoId, parseTimedCaptions } from './youtube';

describe('YouTube Extractor Utilities', () => {
  it('extracts video ID from standard watch URL', () => {
    const id = extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(id).toBe('dQw4w9WgXcQ');
  });

  it('extracts video ID from youtu.be shortlink', () => {
    const id = extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ?si=abcdef');
    expect(id).toBe('dQw4w9WgXcQ');
  });

  it('extracts video ID from embed URL', () => {
    const id = extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(id).toBe('dQw4w9WgXcQ');
  });

  it('returns null for non-YouTube URLs', () => {
    const id = extractYouTubeVideoId('https://example.com/article');
    expect(id).toBeNull();
  });

  it('parses timed caption XML correctly', () => {
    const sampleXml = `
      <transcript>
        <text start="0.5" dur="2.1">Welcome to Synora</text>
        <text start="2.6" dur="3.0">The intelligent research workspace.</text>
      </transcript>
    `;
    const segments = parseTimedCaptions(sampleXml);
    expect(segments).toHaveLength(2);
    expect(segments[0].text).toBe('Welcome to Synora');
    expect(segments[0].start).toBe(0.5);
    expect(segments[1].text).toBe('The intelligent research workspace.');
  });
});
