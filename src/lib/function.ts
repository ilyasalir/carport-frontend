import { get } from "./api";

export async function fetchArticleUrls() {

    const url = process.env.NEXT_PUBLIC_API_URL;

    const response = await get("article/get");
    const data = response.data?.data as Article[];
    const filteredData = data.filter((article) => article.status && article.ID && article.publish_date);
    return filteredData;
  }
  
  export function generateSitemap(articles: Article[]) {
    const baseUrl = "https://carporteuro.com";
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}/about-us</loc>
        </url>
        <url>
          <loc>${baseUrl}/login</loc>
        </url>
        <url>
          <loc>${baseUrl}/register</loc>
        </url>
        <url>
          <loc>${baseUrl}/article-site</loc>
        </url>
        ${articles
          .filter(item => item.ID) // Filter out items without an ID
          .map((item) => {
            const lastmod = new Date(item.publish_date).toISOString().split('T')[0]; // Format date to YYYY-MM-DD
            return `
              <url>
                <loc>${baseUrl}/article-site/${item.ID}</loc>
                <lastmod>${lastmod}</lastmod>
              </url>
            `;
          })
          .join("")}
      </urlset>`;
  
    return sitemap;
  }
  