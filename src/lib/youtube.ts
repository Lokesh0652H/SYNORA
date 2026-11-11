/**
 * Robust YouTube video transcript and metadata extractor without external API keys.
 * Fetches the initial player response from YouTube watch page and extracts timed captions.
 */

export interface YouTubeTranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface YouTubeExtractionResult {
  title: string;
  author: string;
  transcript: string;
  segments: YouTubeTranscriptSegment[];
}

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0];
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2];
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2];
      }
    }
  } catch {
    // Regex fallback
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  }
  return null;
}

/**
 * Parse XML timed text captions into structured segments
 */
export function parseTimedCaptions(xml: string): YouTubeTranscriptSegment[] {
  const segments: YouTubeTranscriptSegment[] = [];
  const textRegex = /<text start="([\d.]+)" dur="([\d.]+)"[^>]*>([^<]+)<\/text>/g;
  let match: RegExpExecArray | null;

  while ((match = textRegex.exec(xml)) !== null) {
    const start = parseFloat(match[1]);
    const duration = parseFloat(match[2]);
    // Decode HTML entities
    const text = match[3]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    if (text) {
      segments.push({ text, start, duration });
    }
  }

  return segments;
}

export async function fetchYouTubeTranscript(videoId: string): Promise<YouTubeExtractionResult> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const response = await fetch(watchUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch YouTube page (Status: ${response.status})`);
  }

  const html = await response.text();

  // Extract title
  let title = 'YouTube Video';
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    title = titleMatch[1].replace(' - YouTube', '').trim();
  }

  let author = 'YouTube Creator';
  const authorMatch = html.match(/"author":"([^"]+)"/);
  if (authorMatch) {
    author = authorMatch[1];
  }

  // Extract captions JSON from ytInitialPlayerResponse
  const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({[\s\S]+?});(?:var|\n|<\/script>)/);
  let captionUrl: string | null = null;

  if (playerResponseMatch) {
    try {
      const playerResponse = JSON.parse(playerResponseMatch[1]);
      const captionTracks =
        playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (Array.isArray(captionTracks) && captionTracks.length > 0) {
        // Prioritize English or first available track
        const englishTrack =
          captionTracks.find((t: any) => t.languageCode === 'en' || t.vssId?.includes('en')) ||
          captionTracks[0];
        captionUrl = englishTrack.baseUrl;
      }
    } catch {
      // Fallback
    }
  }

  if (!captionUrl) {
    // Attempt fallback regex on timedtext url
    const timedTextMatch = html.match(/https:\/\/www\.youtube\.com\/api\/timedtext[^"'\s]+/);
    if (timedTextMatch) {
      captionUrl = timedTextMatch[0].replace(/\\u0026/g, '&');
    }
  }

  if (!captionUrl) {
    throw new Error('No closed captions or transcript tracks found for this video.');
  }

  // Fetch the XML transcript
  const captionRes = await fetch(captionUrl);
  if (!captionRes.ok) {
    throw new Error('Failed to retrieve caption stream.');
  }

  const xml = await captionRes.text();
  const segments = parseTimedCaptions(xml);

  if (segments.length === 0) {
    throw new Error('Transcript XML contained no readable text.');
  }

  // Group into readable timestamped paragraphs every ~45 seconds
  const formattedParagraphs: string[] = [];
  let currentBlock: string[] = [];
  let blockStartTime = 0;

  segments.forEach((seg, idx) => {
    if (idx === 0) blockStartTime = seg.start;
    currentBlock.push(seg.text);

    if (seg.start - blockStartTime > 45 || idx === segments.length - 1) {
      const minutes = Math.floor(blockStartTime / 60);
      const seconds = Math.floor(blockStartTime % 60);
      const timecode = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
      formattedParagraphs.push(`${timecode} ${currentBlock.join(' ')}`);
      currentBlock = [];
      blockStartTime = seg.start;
    }
  });

  return {
    title,
    author,
    transcript: formattedParagraphs.join('\n\n'),
    segments,
  };
}
