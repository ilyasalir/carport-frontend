// Remove "use client"

import { get } from "@/lib/api";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

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
            url: "https://carporteuro.com/assets/logo.svg", // Path relative to the public directory
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

export default async function ArticleSite({
  params,
}: {
  params: { slug: number };
}) {
  // Fetch the article data for rendering the page content
  const response = await get(`article/byid/${params.slug}`);
  const data = response.data.data as Article;

  // Format the date (assuming ISO string format)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen pt-[108px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white overflow-x-hidden">
      <div className="flex items-center gap-4 text-[18px] text-gray-subtext font-poppins font-medium pb-[50px]">
        <Link href={`/article-site`} className="underline cursor-pointer">
          Article
        </Link>
        <div className="text-[14px] md:text-[16px] lg:text-[20px]">
          <IoIosArrowForward />
        </div>
        <p className="text-dark-maintext">
          {data?.title && data.title.length > 50
            ? `${data.title.substring(0, 50)}...`
            : data?.title}
        </p>
      </div>
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-4xl font-semibold text-center pb-[20px] w-[70%]">
          {data?.title}
        </h1>
        <h2 className="text-lg text-gray-600 pb-[20px]">
          Published on{" "}
          {data?.publish_date ? formatDate(data.publish_date) : "N/A"}
        </h2>
        <img
          src={data?.photo_url}
          className="lg:w-[30vw] object-cover pb-[60px]"
          alt="Article Image"
        />
        <div className="tiptap prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl w-[70%] max-w-full overflow-x-auto">
          {/* Ensure content wraps and prevents overflow */}
          <div className="max-w-full break-words">
            {/* This will apply Tailwind's prose styling to the content */}
            <div dangerouslySetInnerHTML={{ __html: data?.content || "" }} />
          </div>
        </div>
        <div className='flex flex-wrap justify-center gap-2 w-[50%] pt-[40px] pb-[20px]'>
          {data?.tags?.map((tag, index) => (
            <a
              key={index}
              className='inline-block bg-yellow-secondary hover:bg-yellow-accent text-white px-3 py-1 rounded'
              href={`article-site/tag/${tag.ID}`}
            >
              #{tag.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
