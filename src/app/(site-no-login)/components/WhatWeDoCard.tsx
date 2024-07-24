import React from "react";
import Image from "next/image";

function WhatWeDoCard({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl: string;
}) {
  return (
    <div className="w-full border-2 border-black rounded-xl overflow-hidden flex flex-col md:flex-row lg:flex-col">
      <div className="w-full h-[200px] md:w-1/3 md:h-full lg:w-full lg:h-[200px] relative">
        <div className="bg-black bg-opacity-70 w-full h-full absolute"></div>
        <Image
          fill
          src={imageUrl}
          alt={title}
          style={{
            objectFit: "cover",
            zIndex: -1,
          }}
        />
      </div>
      <div className="p-8 text-black md:w-2/3 lg:w-full">
        <h2 className="text-[20px] xl:text-3xl font-bold text-center mb-2 xl:mb-4">
          {title}
        </h2>
        <p className="text-sm xl:text-lg text-justify">{description}</p>
      </div>
    </div>
  );
}

export default WhatWeDoCard;
