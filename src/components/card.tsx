import Image from "next/image";
export default function Card({
  title,
  paragraph,
  src_picture,
  alt_pic, 
  index
}: {
  title: string;
  paragraph: string;
  src_picture: string;
  alt_pic: string;
  index: number;
}) {
  return (
      <div className={`flex flex-col gap-8 lg:gap-16 items-center ${index == 1 ? "lg:col-span-2" : ""}`}>
        <div className={`relative h-[120px] lg:h-[200px] w-full`}>
          <Image
            src={src_picture}
            alt={alt_pic}
            className="object-contain"
            fill
          />
        </div>
        <div className={`${index == 1 ? "w-full lg:w-1/2" : "w-full"}`}>
          <h3 className="font-poppins font-bold text-[20px] md:text-[24px] lg:text-[28px] text-center">
            {title}
          </h3>
          <p className={`font-poppins font-normal text-justify text-[14px] md:text-[16px] lg:text-[20px] mt-2`}>
            {paragraph}
          </p>
        </div>
      </div>
  );
}
