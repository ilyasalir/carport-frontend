import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://carporteuro.com"
    return{
        rules:{
            userAgent: "*",
            allow: ["/", "/article-site"],
            disallow: []
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
};