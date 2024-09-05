import { get } from "@/lib/api";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { generateMetadata } from './metadata';

export { generateMetadata };

export default async function ArticleSite({
  params,
}: {
  params: { slug: number };
}) {
  // Fetch the article data for rendering the page content
  const response = await get(`article/byid/${params.slug}`);
  const data = response.data.data as Article;

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
          <div className="max-w-full break-words">
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
