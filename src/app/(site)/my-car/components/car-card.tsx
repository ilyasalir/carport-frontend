"use client";

import Button from "@/components/button";
import { useRouter } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";

export default function CarCard({
  brand_id,
  plate,
  brand,
  model,
  color,
  photo,
}: {
  brand_id: number;
  plate: string;
  brand: string;
  model: string;
  color: string;
  photo: string | undefined;
}) {
  const router = useRouter();
  return (
    <div className="bg-white w-full h-full rounded-[28px] p-5 md:p-6 xl:p-8 border-[1px] border-gray-subtext text-dark-maintext">
      {photo ? (
        <img
          src={photo}
          alt="My Car Photo"
          className="w-full h-[200px] md:h-[160px] lg:h-[200px] rounded-[14px] object-cover"
        />
      ) : (
        <div className="w-full h-[200px] md:h-[160px] lg:h-[200px] rounded-[14px] flex justify-center items-center bg-slate-100">
          {brand_id == 1 ? (
            <img
              src="/assets/bmw.svg"
              alt="BMW Logo"
              className="h-[74px] object-contain"
            />
          ) : brand_id == 2 ? (
            <img
              src="/assets/smart_logo_only.png"
              alt="SMART Logo"
              className="h-[74px] object-contain"
            />
          ) : brand_id == 3 ? (
            <img
              src="/assets/mercedes_logo_only.png"
              alt="Mercedes Logo"
              className="h-[74px] object-contain"
            />
          ) : (
            <img
              src="/assets/mini.png"
              alt="Mini Logo"
              className="h-[74px] object-contain"
            />
          )}
        </div>
      )}
      <h3 className="font-poppins font-bold text-[20px] md:text-[24px] lg:text-[28px] mt-2">
        {plate}
      </h3>
      <p className="font-poppins font-normal text-[14px] md:text-[16px] lg:text-[20px] mt-2">
        {brand} | {model} | {color}
      </p>
      <div className="mt-4">
        <Button
          type="button"
          text="See Details"
          color="primary"
          icon={<BsArrowRight />}
          shape="rounded-small"
          fitContent={true}
          onClick={() => router.push(`/my-car/${plate}`)}
        />
      </div>
    </div>
  );
}
