"use client";

import Button from "@/components/button";
import router from "next/router";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import WhatWeDoCard from "./WhatWeDoCard";

function HowCarportWorks() {
  return (
    <div className="w-full h-auto bg-[url('/assets/howcarportworks.png')] bg-center bg-cover relative overflow-hidden">
      {/* <img
          src="/assets/car_2.svg"
          alt="Car Picture"
          className="hidden md:block absolute top-0 bottom-0 my-auto w-[75%] md:w-[50.55%] xl:w-auto -right-[11.11%]"
        /> */}
      <div className="bg-black bg-opacity-75 w-full h-auto text-white pt-[36px] lg:pt-[88px] pb-[44px] lg:pb-[100px] px-[6.805%] lg:px-[98px] relative overflow-hidden">
        <h1 className="font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
          HOW CARPORT WORKS
        </h1>
        <div className="w-full md:w-[60%] max-w-[766px]">
          <div className="flex flex-col gap-9 mt-8 lg:mt-10">
            <div className="flex gap-6">
              <div className="flex items-center px-[18px] lg:px-[38px] border-r-[6px] lg:border-r-8 border-yellow-secondary font-poppins font-semibold text-[24px] md:text-[36px] lg:text-[48px] leading-[1.1]">
                {" "}
                1
              </div>
              <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-poppins">
                Book <span className="font-bold">Your</span> Service
              </h3>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center px-[17px] lg:px-[34px] border-r-[6px] lg:border-r-8 border-yellow-secondary font-poppins font-semibold text-[24px] md:text-[36px] lg:text-[48px] leading-[1.1]">
                {" "}
                2
              </div>
              <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-poppins items-center">
                We Come To <span className="font-bold">You</span>
              </h3>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center px-[17px] lg:px-[34px] border-r-[6px] lg:border-r-8 border-yellow-secondary font-poppins font-semibold text-[24px] md:text-[36px] lg:text-[48px] leading-[1.1]">
                {" "}
                3
              </div>
              <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-poppins">
                Relax
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowCarportWorks;
