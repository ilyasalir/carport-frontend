import { fetchArticleUrls, generateSitemap } from '@/lib/function';
import { NextResponse } from 'next/server';

export async function GET() {
  const urls = await fetchArticleUrls();
  const sitemap = generateSitemap(urls);

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate' // Adjust as needed
    },
  });
}