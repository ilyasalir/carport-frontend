"use client";

import Button from "@/components/button";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Card from "../../components/card";
import Image from "next/image";

import { BsArrowRightCircle } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { RegisterContext } from "@/lib/context/register-context";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "@/lib/context/user-context";
import { PopUpContext } from "@/lib/context/popup-order-context";
import WhatWeDo from "./components/WhatWeDo";
import ServiceWeOffer from "./components/ServiceWeOffer";
import HowCarportWorks from "./components/HowCarportWorks";
import BrandList from "./components/BrandList";
import PostCarousel from "./components/Carousel";
import sendGTMEvent from "@/components/sendGTM";
import Field from "@/components/field";
import TextAreaField from "@/components/text-area-field";
import InquiryForm from "./components/InquiryForm";

export default function Home() {
  const { updateWithAppointment } = useContext(RegisterContext);
  const { updateIsOpen } = useContext(PopUpContext);
  const context = useContext(UserContext);
  const router = useRouter();
  const location = usePathname();

  useEffect(() => {
    if (location === "/") {
      updateWithAppointment(false);
    }
  }, [location]);

  const inquiryFormRef = useRef<HTMLDivElement | null>(null); // Reference to InquiryForm

  const handleScrollToInquiryForm = () => {
    if (inquiryFormRef.current) {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
      const yOffset = -navbarHeight; // Offset to account for sticky navbar
      const yPosition =
        inquiryFormRef.current.getBoundingClientRect().top +
        window.scrollY +
        yOffset;
  
      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
    }
  };
  

  return (
    <>
      <div className="w-full h-auto lg:h-screen bg-[url('/assets/jumbotron.png')] bg-cover  bg-center relative overflow-hidden">
        <div className="bg-black bg-opacity-75 w-full h-full flex flex-col gap-5 lg:gap-10 justify-center pt-[120px] lg:pt-0 pb-[96px] lg:pb-0 px-[7.5%] lg:px-[92px]">
          <h1 className="text-white font-robotoSlab font-bold text-[24px] md:text-[40px] lg:text-[56px]">
            AUTO REPAIR, <br /> ANYTIME, <br /> ANYPLACE
          </h1>
          <div className="">
            <Button
              type={"button"}
              text="Book Service"
              color="yellow"
              icon={<BsArrowRightCircle />}
              shape="rounded-medium"
              fitContent={true}
              onClick={handleScrollToInquiryForm}
              // onClick={() => {
              //   if (context.user) {
              //     updateIsOpen(true);
              //     router.push("/booking");
              //   } else {
              //     updateWithAppointment(true);
              //     router.push("/register");
              //   }
              // }}
            />
          </div>
        </div>
      </div>
      <BrandList />
      <WhatWeDo />
      <ServiceWeOffer />
      <div className="w-full h-auto bg-[url('/assets/jumbotron2.png')] bg-center bg-cover relative overflow-hidden">
        <div className="bg-black bg-opacity-75 w-full h-fit flex flex-col gap-5 lg:gap-10 pt-[120px] lg:pt-[244px] pb-[96px] px-[7.5%] lg:px-[92px]">
          <h1 className="text-white font-robotoSlab font-bold text-[24px] md:text-[40px] lg:text-[56px]">
            NOT SURE WHAT <br /> YOU NEED?
          </h1>
          <Button
            type={"button"}
            text={
              <p>
                Try <span className="font-bold">Diagnostic</span> Tool
              </p>
            }
            color="yellow"
            icon={<BsArrowRightCircle />}
            shape="rounded-medium"
            fitContent={true}
            onClick={() => {
              if (context.user) {
                updateIsOpen(true);
                router.push("/booking");
              } else {
                updateWithAppointment(true);
                router.push("/register");
              }
            }}
          />
        </div>
      </div>
      <HowCarportWorks />
      <div className="relative w-full h-fit px-[6.805%] lg:px-[98px] lg:pt-[88px] items-center pb-[64px]">
        <h1 className="text-black font-robotoSlab font-bold text-[24px] md:text-[40px] lg:text-[56px]">
          Articles
        </h1>
        <a
          className="text-yellow-accent font-robotoSlab font-bold text-[12px] md:text-[16px] lg:text-[20px] pb-[24px]"
          href="/article-site"
        >
          Read more...
        </a>
        <PostCarousel />
      </div>
      <div ref={inquiryFormRef}>
        <InquiryForm />
      </div>
    </>
  );
}
