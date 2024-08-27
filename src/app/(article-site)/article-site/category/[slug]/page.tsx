"use client";

import { Post } from "@/lib/interface/post";
import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import { toastError } from "@/components/toast";
import PostCard from "../../components/PostCard";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

const postsPerPage = 6;

export default function Category({ params }: { params: { slug: string } }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [DataArticle, setDataArticle] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category>();
  const router = useRouter();
  const { slug } = useParams();

  const decodedSlug = typeof slug === 'string' ? decodeURIComponent(slug) : '';

  const getCategoryById = async () => {
    try {
      const response = await get(`article/category/${decodedSlug}`);
      const data = response.data?.data;
      setCategory(data);
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    }
  };

  useEffect(() => {
    getCategoryById();
  }, [decodedSlug]);

  const getArticle = async () => {
    if (!category?.ID) return; // Ensure category ID is available
    try {
      const response = await get(`article/categorybyid/${category.ID}`);
      const data = response.data?.data as Article[];
      const filteredData = data.filter((item: Article) => item.status);
      setDataArticle(filteredData);
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    }
  };

  useEffect(() => {
    getArticle();
  }, [category]);

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
    <div className="w-full min-h-screen pt-[108px] pb-[60px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white">
      <div className="flex items-center gap-4 text-[18px] text-gray-subtext font-poppins font-medium pb-[50px]">
        <Link href={`/article-site`} className="cursor-pointer">
          Article
        </Link>
        <div className="text-[14px] md:text-[16px] lg:text-[20px]">
          <IoIosArrowForward />
        </div>
        <a>
          Category
        </a>
        <div className="text-[14px] md:text-[16px] lg:text-[20px]">
          <IoIosArrowForward />
        </div>
        <p className="text-dark-maintext">
          {decodedSlug}
        </p>
      </div>
      <h1 className="text-4xl font-bold mb-6">{decodedSlug}</h1>
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
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-yellow-secondary hover:bg-yellow-accent text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
