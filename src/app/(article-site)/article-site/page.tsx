"use client";

import { Post } from '@/lib/interface/post';
import { useEffect, useState } from 'react';
import PostCard from './components/PostCard';
import { get } from '@/lib/api';
import { toastError } from '@/components/toast';
import Dropdown from '@/components/dropdown';
import router from 'next/router';
import { useRouter } from 'next/navigation';

const postsPerPage = 6;

export default function ArticleSite() {
  const [currentPage, setCurrentPage] = useState(1);
  const [DataArticle, setDataArticle] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [recentArticle, setRecentArticle] = useState<Article>();
  const router = useRouter();


  const getCategory = async () => {
    try {
      const response = await get(`article/category`);
      const data = response.data?.data; // Check the structure of data
      console.log("Category data:", data); // Debugging purpose
      setCategory(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getArticle = async () => {
    try {
      const response = await get("article/get");
      const data = response.data?.data as Article[];
      
      // Filter articles based on status
      const filteredData = data.filter((item: Article) => item.status);
      const filteredRecentData = data.filter((item: Article) => item.status);
      
      // Sort articles by publish date in descending order
      const sortedData = filteredRecentData.sort((a, b) => {
        const dateA = new Date(a.publish_date).getTime();
        const dateB = new Date(b.publish_date).getTime();
        return dateB - dateA; // Newest first
      });
      
      // Set the sorted articles and recent article
      setDataArticle(filteredData);
      setRecentArticle(sortedData[0]); // Set the most recent article
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    }
  };

  useEffect(() => {
    getArticle();
  },[]);

  const categoryOptions = Array.isArray(category)
  ? category.map(cat => ({ value: cat.ID, label: cat.name }))
  : [];

  // Calculate start and end index based on the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedArticles = DataArticle.slice(startIndex, endIndex);

  const totalPages = Math.ceil(DataArticle.length / postsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className='w-full min-h-screen pt-[108px] pb-[60px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white'>
      <div className='pb-[60px] flex justify-center'>
        {recentArticle ? (
          <a className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-4xl relative" href={`/article-site/${recentArticle?.ID}`}>
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            <h1>Recent Post</h1>
          </div>
          <img
            src={recentArticle?.photo_url}
            alt="gambar"
            className="w-full h-72 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold truncate">{recentArticle?.title}</h2>
          </div>
        </a>
        ):(
          null
        ) }
      </div>
      <div className='flex flex-row justify-between'>
        <h1 className="text-4xl font-bold mb-6">Articles</h1>
        <div>
          <Dropdown
              placeholder={"Select Category"}
              options={categoryOptions}
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              id="drop4"
              onChange={(selectedOption) => {
                if (selectedOption && selectedOption.label) {
                  router.push(`/article-site/category/${selectedOption.label}`);
                }
              }}
            />
        </div>
      </div>
      {paginatedArticles.length > 0 ? (
        <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedArticles.map((item: Article, idx: number) => (
          <PostCard
            key={idx}
            photo={item.photo_url}
            title={item.title}
            category={item.category.name}
            id={item.ID}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-yellow-secondary hover:bg-yellow-accent text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-yellow-secondary hover:bg-yellow-accent text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </div>
      ):(
        <p className='flex justify-center items-center text-center text-gray-500 py-[100px] text-xl'>Please wait a moment...</p>
      )}
    </div>
  );
}
