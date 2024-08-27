"use client";

import Modal from "@/components/modal";
import { useState } from "react";

export default function ServiceCard({
  plate,
  customer,
  phone,
  address,
  brand,
  type,
  frame,
  engine,
  kilometer,
  service,
  fitContent = false,
  colStart,
  rowStart,
  rowSpan,
}: {
  plate: string;
  customer: string;
  phone: string;
  brand: string;
  type: string;
  frame: string;
  engine: string;
  kilometer: number;
  service: string;
  address?: string;
  fitContent?: boolean;
  colStart: string;
  rowStart: string;
  rowSpan: string;
}) {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  return (
    <>
      <Modal
        visible={showPopUp}
        width="w-[90%] md:w-[87.5%]"
        onClose={() => setShowPopUp(false)}
      >
        <div>
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mb-4">
            {plate}
          </h1>
          <div className="grid lg:grid-flow-col grid-cols-1 lg:grid-cols-[min-content,auto,auto] lg:grid-rows-3 gap-4 lg:gap-6 font-poppins">
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Customer
              </p>
              <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold break-words">
                {customer}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Customer Phone
              </p>
              <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold">
                {phone}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {address && (
                <>
                  <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                    Customer Address
                  </p>
                  <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold">
                    {address}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Car Brand
              </p>
              <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold">
                {brand}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Car Type
              </p>
              <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold">
                {type}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Frame Number
              </p>
              <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold">
                {frame}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Engine Number
              </p>
              <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold">
                {engine}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Kilometer(s)
              </p>
              <p className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold">
                {kilometer}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-subtext text-[12px] md:text-[14px] lg:text-[18px]">
                Service(s)
              </p>
              <ul className="list-disc pl-5">
                    <li className="text-dark-maintext text-[14px] md:text-[16px] lg:text-[20px] font-semibold" >{service}</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
      <div
        className={`w-full cursor-pointer bg-[#C5EAC4] grid grid-cols-2 gap-x-1 pl-2 lg:pl-8 pr-1 lg:pr-2 py-1 lg:py-2 border-l-4 border-green-secondary font-poppins ${colStart} ${rowStart} ${rowSpan}`}
        onClick={() => setShowPopUp(true)}
      >
        <div className="flex flex-col">
          <p className="text-dark-maintext text-[16px] md:text-[20px] lg:text-[24px] font-bold">
            {plate}
          </p>
          <p className="text-gray-subtext text-[12px] lg:text-[14px]">
            Customer
          </p>
          <p className="text-dark-maintext text-[14px] lg:text-[16px] overflow-hidden text-ellipsis">
            {customer}
          </p>
        </div>
        <div
          className={`${address != undefined ? "" : "invisible"} flex flex-col shrink`}
        >
          <p className="text-gray-subtext text-[12px] lg:text-[14px]">
            Address
          </p>
          <p className="text-dark-maintext text-[14px] lg:text-[16px] overflow-hidden text-ellipsis line-clamp-2">
            {address}
          </p>
        </div>
      </div>
    </>
  );
}
