"use client"

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import PostCard from "./PostCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { get } from "@/lib/api";
import { toastError } from "@/components/toast";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";

export default function PostCarousel() {
  const [DataArticle, setDataArticle] = useState<Article[]>([]);
  const [recentArticle, setRecentArticle] = useState<Article>();

  // Create a ref for the Slider component
  const sliderRef = useRef<Slider>(null);

  const getArticle = async () => {
    try {
      const response = await get("article/get");
      const data = response.data?.data as Article[];

      const filteredData = data.filter((item: Article) => item.status);
      const filteredRecentData = data.filter((item: Article) => item.status);

      const sortedData = filteredRecentData.sort((a, b) => {
        const dateA = new Date(a.publish_date).getTime();
        const dateB = new Date(b.publish_date).getTime();
        return dateB - dateA; // Newest first
      });

      setDataArticle(filteredData);
      setRecentArticle(sortedData[0]); // Set the most recent article
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="relative">
      {/* Previous Slide button */}
      <button
        className="absolute text-5xl top-1/2 left-4 transform -translate-y-1/2 text-yellow-accent bg-white bg-opacity-70 text-white rounded-full hover:text-white hover:bg-yellow-accent z-10"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <IoIosArrowDropleftCircle/>
      </button>

      <Slider {...settings} ref={sliderRef}>
        {DataArticle.map((item: Article, idx: number) => (
          <div
            key={idx}
            className="px-1" // Add padding to each slide
          >
            <div className="p-4 overflow-hidden rounded-lg shadow-md mx-auto" style={{ margin: '0 10px' }}> {/* Add margin for spacing */}
              <PostCard
                photo={item.photo_url}
                title={item.title}
                category={item.category.name}
                id={item.ID}
              />
            </div>
          </div>
        ))}
      </Slider>

      {/* Next Slide button */}
      <button
        className="absolute text-5xl top-1/2 right-4 transform -translate-y-1/2 text-yellow-accent bg-white bg-opacity-70 text-white rounded-full hover:text-white hover:bg-yellow-accent z-10"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <IoIosArrowDroprightCircle/>
      </button>
    </div>
  );
}
