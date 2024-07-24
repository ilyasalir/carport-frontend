"use client";

import Button from "@/components/button";
import router from "next/router";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import WhatWeDoCard from "./WhatWeDoCard";

function WhatWeDo() {
  return (
    <div className="w-full h-fit gap-5 lg:gap-20 px-[6.805%] lg:px-[98px] pt-[36px] lg:pt-[88px] items-center">
      <h3 className="font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
        WHAT WE DO
      </h3>
      <p className="text-justify font-poppins text-[14px] md:text-[16px] lg:text-[20px] my-4 mb-12">
        Carport offers complete auto repair, services, and maintenance for your
        European cars. From routine maintenance like oil changes and tire
        rotations to complex repairs and diagnostics, our skilled technicians
        are equipped to handle your car efficiently and effectively.
      </p>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 xl:gap-16">
        <WhatWeDoCard
          title={"Convenience"}
          description={
            "We prioritize making vehicle maintenance and repair as effortless as possible by bringing our mechanic directly to your place."
          }
          imageUrl={"/assets/convenience.png"}
        />
        <WhatWeDoCard
          title={"Quality"}
          description={
            "Our team of experienced technicians is dedicated to ensuring that every job is completed with precision and care, providing peace of mind to you."
          }
          imageUrl={"/assets/quality.png"}
        />
        <WhatWeDoCard
          title={"Transparency"}
          description={
            "Carport provide detailed explanations of services to offering transparent pricing, spare parts, and billing, we strive to ensure that you have a complete understanding of the work being done on your vehicle."
          }
          imageUrl={"/assets/transparency.png"}
        />
      </div>
      <div className="flex justify-center">
        <hr className="w-2/3 border-[0.5px] border-black mt-9 lg:mt-[88px]" />
      </div>
    </div>
  );
}

export default WhatWeDo;
