"use client";
import { ReactNode, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
export default function OrderBook({
  type,
  summary,
  child,
  isOpen,
  onClose
}: {
  type: "upcoming" | "pending" | "done";
  summary: string;
  child: ReactNode;
  isOpen: boolean;
  onClose?: (open: boolean) => void
}) {
  const handleClick = () => {
    if (onClose) {
      onClose(false);
    }
  };
  return (
    <details className="cursor-pointer rounded-xl group font-poppins" open={isOpen} onClick={() => handleClick}>
      <summary className="w-full h-auto py-2 lg:py-0 text-[20px] bg-white text-dark-maintext pr-8 flex items-center justify-between group-open:mb-6 ease-in-out duration-300">
        <div className="flex gap-4 items-center">
          <div
            className={`h-4 lg:h-5 w-4 lg:w-5 ${type == "upcoming" ? "bg-green-secondary" : type == "pending" ? "bg-yellow-secondary" : "bg-blue-secondary"} rounded-full`}
          ></div>
          <p className="text-[14px] md:text-[16px] lg:text-[20px]">{summary}</p>
        </div>
        <div className="text-[20px] md:text-[24px] lg:text-[28px] group-open:rotate-180 ease-in-out duration-300">
          <IoIosArrowDown />
        </div>
      </summary>
      {child}
    </details>
  );
}
