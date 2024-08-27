"use client";

import Button from "@/components/button";

import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { BsArrowRightCircle } from "react-icons/bs";
import Table from "@/components/table";
import Paginate from "@/components/paginate";
import { useContext, useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { toastError, toastSuccess } from "@/components/toast";
import { get, getWithCredentials, postWithForm } from "@/lib/api";
import Dropdown from "@/components/dropdown";
import Field from "@/components/field";
import Upload from "./components/upload-file";
import { FileRejection, FileWithPath } from "react-dropzone";
import CreatableDropdown from "@/components/dropdown-creatable";
import LoadingPage from "@/components/loading";
import { UserContext } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";

export default function AddCar() {
  const router = useRouter();
  const context = useContext(UserContext);
  const [file, setFile] = useState<FileWithPath>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFileRejected = (fileRejections: FileRejection[]) => {
    const rejectedFiles = fileRejections.map(
      (rejectedFile) => rejectedFile.file
    );

    const largeFiles = rejectedFiles.filter(
      (file) => file.size > 500 * 1024 * 1024
    );

    const pdfFiles = rejectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length > 0) {
      toastError("PDF files are not allowed. Please upload image files only.");
    }
    if (largeFiles.length > 0) {
      toastError("Files are too large. Please upload files under 500MB.");
    }
  };

  const handleAddCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (context.token) {
        const response = await postWithForm(
          "stnk",
          {
            photo: file,
          },
          context.token
        );
        toastSuccess(response.data.message);
        router.push("/my-car");
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="w-full min-h-screen h-auto pt-[108px] pb-[60px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white">
        <div className="flex items-center gap-4 text-[18px] text-gray-subtext font-poppins font-medium">
          <Link href={"/my-car"} className="underline cursor-pointer">
            My Car
          </Link>
          <div className="text-[14px] md:text-[16px] lg:text-[20px]">
            <IoIosArrowForward />
          </div>
          <p className="text-dark-maintext">Add Car</p>
        </div>
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          ADD NEW CAR BY STNK
        </h1>
        <form onSubmit={(e) => handleAddCar(e)} className="mt-6 lg:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-[100px] mt-5 lg:mt-7">
            <div className="flex gap-3 items-end">
              <div className="w-[85%]">
                <Field
                  id="upload"
                  type={"field"}
                  placeholder={"Upload Car Picture (optional)"}
                  useLabel
                  labelText="STNK Photo"
                  labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
                  isDisabled
                  readOnly
                  value={file ? file.name : undefined}
                />
              </div>
              <div className="grow">
                <Upload
                  onFileSelected={(file: FileWithPath) => setFile(file)}
                  onFileRejected={handleFileRejected}
                  onFileDeleted={() => setFile(undefined)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-[100px] mt-7">
            <div className="lg:col-start-2">
              <Button type={"submit"} text="Add Car by STNK" />
            </div>
          </div>
        </form>     
      </div>
    </>
  );
}
