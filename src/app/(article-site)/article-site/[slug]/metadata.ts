import { get } from '@/lib/api';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  console.log('Params:', params.slug);  // Ensure correct slug is being passed

  const data = await fetchArticleData(params.slug);

  if (!data) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist",
    };
  }

  console.log('Generated Metadata:', data.title);  // Log the metadata details

  return {
    title: data.title,
    description: data.content || "No description available",
    metadataBase: new URL('https://carporteuro.com'),
    openGraph: {
      title: data.title,
      description: `Read our article Now ${data.title}` || "No description available",
      icons: [
        {
          url: '/assets/logo.svg',
          alt: 'Site Logo',
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
}

async function fetchArticleData(slug: string) {
  try {
    const response = await get(`article/byid/${slug}`);
    return response.data.data as Article;
  } catch (error) {
    console.error(error);
    return null;
  }
}
