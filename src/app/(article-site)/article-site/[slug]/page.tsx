"use client";

import { useEffect, useState } from 'react';
import { get } from '@/lib/api';
import { toastError } from '@/components/toast';
import Link from 'next/link';
import { IoIosAdd, IoIosArrowForward } from 'react-icons/io';
import router from 'next/router';

const postsPerPage = 6;

export default function ArticleSite({ params }: { params: { slug: string } }) {

  function removeSpecificTags(html: string, tagsToRemove: string[] = []): string {
    // Ensure this code only runs in the browser
    if (typeof document !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      tagsToRemove.forEach(tag => {
        const elements = tempDiv.getElementsByTagName(tag);
        while (elements.length > 0) {
          const element = elements[0];
          element.parentNode?.removeChild(element);
        }
      });

      return tempDiv.innerHTML;
    }
    // If not in the browser, return the original HTML
    return html;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [DataArticle, setDataArticle] = useState<Article>();

  const getArticleDetails = async () => {
    try {
      const response = await get(`article/byid/${params.slug}`);
      const data = response.data.data as Article;
      setDataArticle(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    }
  };

  useEffect(() => {
    getArticleDetails();
  }, [params.slug]);

  // Format the date (assuming ISO string format)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='w-full min-h-screen pt-[108px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white'>
      <div className="flex items-center gap-4 text-[18px] text-gray-subtext font-poppins font-medium pb-[50px]">
        <Link href={`/article-site`} className="underline cursor-pointer">
          Article
        </Link>
        <div className="text-[14px] md:text-[16px] lg:text-[20px]">
          <IoIosArrowForward />
        </div>
        <p className="text-dark-maintext">
        {DataArticle?.title && DataArticle.title.length > 50 
        ? `${DataArticle.title.substring(0, 50)}...` 
        : DataArticle?.title}
        </p>
      </div>
      <div className='flex items-center justify-center flex-col'>
        <h1 className='text-4xl font-semibold text-center pb-[20px] w-[70%]'>{DataArticle?.title}</h1>
        <h2 className='text-lg text-gray-600 pb-[20px]'>Published on {DataArticle?.publish_date ? formatDate(DataArticle.publish_date) : 'N/A'}</h2>
        <img
          src={DataArticle?.photo_url}
          className='lg:w-[30vw] object-cover pb-[60px]'
          alt='Article Image'
        />
        <div className='tiptap prose font-poppins flex flex-col text-justify w-[70%]' dangerouslySetInnerHTML={{ __html: removeSpecificTags(DataArticle?.content || '', ['string']) }} />
        <div className='flex flex-wrap justify-center gap-2 w-[50%] pt-[40px] pb-[20px]'>
          {DataArticle?.tags?.map((tag, index) => (
            <a
              key={index}
              className='inline-block bg-yellow-secondary hover:bg-yellow-accent text-white px-3 py-1 rounded'
              href={`/article-site/tag/${tag.ID}`}
            >
              #{tag.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
