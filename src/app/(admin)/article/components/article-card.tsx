"use client";

import Button from "@/components/button";
import Field from "@/components/field";
import Modal from "@/components/modal";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import Upload from "../add/components/upload-file";
import { FileRejection, FileWithPath } from "react-dropzone";
import { toastError, toastSuccess } from "@/components/toast";
import { updateCar, updateWithJson } from "@/lib/api";
import { UserContext } from "@/lib/context/user-context";

export default function ArticleCard({
  photo,
  title,
  ID,
}: {
  photo: string | undefined;
  title: string | undefined;
  ID: number | undefined;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(UserContext);
  const router = useRouter();

  return (
    
    <div className="bg-white rounded-[28px] p-5 md:p-6 xl:p-8 border-[1px] border-gray-subtext text-dark-maintext max-w-[30vw] max-h-[40vw]">
      <img
        src={photo}
        alt="My Car Photo"
        className="w-full h-full md:h-[160px] lg:h-[200px] rounded-[14px] object-fit"
      />
      <p className="font-poppins font-bold text-[12px] md:text-[16px] lg:text-[20px] mt-2 mb-5 truncate">{title}</p>
    </div>
  );
}
