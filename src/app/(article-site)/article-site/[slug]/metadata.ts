import { get } from "@/lib/api";
    

export async function generateMetadata({
    params,
  }: {
    params: { slug: number };
  }) {
    try {
      // Fetch the article data
      const response = await get(`article/byid/${params.slug}`);
      const data = response.data.data as Article;
  
      // Check if data exists
      if (!data) {
        return {
          title: "Not Found",
          description: "The page you are looking for does not exist",
        };
      }
  
      // Return the metadata object
      return {
        title: data.title,
        description:
          `Read our articles Now! ${data.title}` || "No description available",
        metadataBase: new URL("https://carporteuro.com"),
        openGraph: {
          title: data.title,
          description:
            `Read our article Now ${data.title}` || "No description available",
          icons: [
            {
              url: "https://carporteuro.com/assets/icon.svg", // Path relative to the public directory
              alt: "Site Logo",
            },
          ],
          images: [
            {
              url: data.photo_url,
              alt: data.title,
            },
          ],
        },
      };
    } catch (error) {
      console.log(error);
      return {
        title: "Error",
        description: "There was an error loading this page",
      };
    }
  }