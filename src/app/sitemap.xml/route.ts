import { fetchArticleUrls, generateSitemap } from '@/lib/function';
import { NextResponse } from 'next/server';

export async function GET() {
  const urls = await fetchArticleUrls();
  const sitemap = generateSitemap(urls);

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600' // Adjust as needed
    },
  });
}