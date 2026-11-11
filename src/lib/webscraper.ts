import * as cheerio from 'cheerio';

export interface WebScrapeResult {
  title: string;
  description: string;
  author?: string;
  domain: string;
  content: string;
  wordCount: number;
}

export async function scrapeWebPage(url: string): Promise<WebScrapeResult> {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname.replace('www.', '');

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(12000), // 12 second timeout
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch web page (HTTP ${response.status}: ${response.statusText})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove unwanted decorative or navigational tags
  $(
    'script, style, noscript, nav, header, footer, iframe, svg, [role="banner"], [role="navigation"], .ads, .ad, .social-share, .cookie-banner, .comment-section'
  ).remove();

  // Extract metadata
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('h1').first().text().trim() ||
    $('title').text().trim() ||
    domain;

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';

  const author =
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    undefined;

  // Find the primary article container
  const mainSelectors = ['article', 'main', '[role="main"]', '.post-content', '.article-body', '.entry-content', '#content'];
  let articleEl: any = null;

  for (const selector of mainSelectors) {
    const el = $(selector);
    if (el.length > 0 && el.text().trim().length > 300) {
      articleEl = el;
      break;
    }
  }

  const target = articleEl || $('body');

  // Extract structured paragraphs, headings, and list items
  const extractedLines: string[] = [];

  target.find('h1, h2, h3, h4, p, li, blockquote').each((_: number, elem: any) => {
    const tagName = elem.tagName.toLowerCase();
    const text = $(elem).text().replace(/\s+/g, ' ').trim();

    if (!text || text.length < 5) return;

    if (tagName.startsWith('h')) {
      extractedLines.push(`\n### ${text}\n`);
    } else if (tagName === 'li') {
      extractedLines.push(`• ${text}`);
    } else if (tagName === 'blockquote') {
      extractedLines.push(`> ${text}`);
    } else {
      extractedLines.push(text);
    }
  });

  const content = extractedLines.join('\n\n').trim();

  if (content.length < 100) {
    throw new Error('Extracted content is too sparse or blocked by bot protection.');
  }

  const wordCount = content.split(/\s+/).length;

  return {
    title: title.replace(/\s+/g, ' ').trim(),
    description,
    author,
    domain,
    content,
    wordCount,
  };
}
