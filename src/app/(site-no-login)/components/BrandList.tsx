import React from "react";

function BrandList() {
  return (
    <div className="bg-black w-full h-[100px] md:h-[148px] lg:h-[216px] px-[5%] lg:px-[140px] flex justify-between items-center">
      <img
        src="/assets/bmw.png"
        alt="BMW Logo"
        className="h-[35px] sm:h-[50px] md:h-[65px] lg:h-[80px] xl:h-[100px] object-contain"
      />
      <img
        src={"/assets/mercedes.png"}
        alt="Mercedes Logo"
        className="hidden h-[35px] sm:h-[50px] md:h-[65px] lg:h-[80px] xl:h-[100px] xl:block object-contain"
      />

      <img
        src={"/assets/mercedes_logo_only.png"}
        alt="Mercedes Logo"
        className="h-[35px] sm:h-[50px] md:h-[65px] lg:h-[80px] xl:h-[100px] xl:hidden object-contain"
      />
      <img
        src={"/assets/smart.png"}
        alt="SMART Logo"
        className="hidden h-[35px] sm:h-[50px] md:h-[65px] lg:h-[80px] xl:h-[100px] xl:block object-contain"
      />
      <img
        src={"/assets/smart_logo_only.png"}
        alt="SMART Logo"
        className="h-[35px] sm:h-[50px] md:h-[65px] lg:h-[80px] xl:h-[100px] xl:hidden object-contain"
      />
      <img
        src="/assets/mini.png"
        alt="Mini Logo"
        className="h-[35px] sm:h-[50px] md:h-[65px] lg:h-[80px] xl:h-[100px] object-contain"
      />
    </div>
  );
}

export default BrandList;
