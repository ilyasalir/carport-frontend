"use client";

import Button from "@/components/button";
import { IoIosArrowForward } from "react-icons/io";
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

export default function AddCar({ params }: { params: { id: number } }) {
  const router = useRouter();
  const context = useContext(UserContext);
  const id = params.id;
  const [brand, setBrand] = useState<number | undefined>();
  const [type, setType] = useState<string>("");
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [frameNumber, setFrameNumber] = useState<string>("");
  const [engineNumber, setEngineNumber] = useState<string>("");
  const [kilometers, setKilometers] = useState<number>(0);
  const [file, setFile] = useState<FileWithPath>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const brandOptions = [
    { label: "BMW", value: 1 },
    { label: "Smart", value: 2 },
    { label: "Mercedes-Benz", value: 3 },
    { label: "Mini", value: 4 },
  ];

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
    console.log("brand",brand)
    try {
      if (context.token) {
        const response = await postWithForm(
          "admin/car",
          {
            user_id: id,
            license_plat: licenseNumber,
            car_type_name: type,
            color_name: color,
            frame_number: frameNumber,
            engine_number: engineNumber,
            kilometer: kilometers,
            brand_id: brand,
            photo: file,
          },
          context.token
        );
        toastSuccess(response.data.message);
        router.back();
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
      <div className="w-full min-h-screen h-auto pb-[60px] pt-[108px] lg:pt-[40px] px-[4%] lg:px-[40px] xl:px-[80px] bg-white">
        <div className="flex items-center gap-4 text-[18px] text-gray-subtext font-poppins font-medium">
          <Link href={`/user-list/`} className="underline cursor-pointer">
            User List
          </Link>
          <div className="text-[14px] md:text-[16px] lg:text-[20px]">
            <IoIosArrowForward />
          </div>
          <Link href={`/user-list/${id}`} className="underline cursor-pointer">
            My Car
          </Link>
          <div className="text-[14px] md:text-[16px] lg:text-[20px]">
            <IoIosArrowForward />
          </div>
          <p className="text-dark-maintext">Add Car</p>
        </div>
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          ADD NEW CAR
        </h1>
        <form onSubmit={(e) => handleAddCar(e)} className="mt-6 lg:mt-12">
          <div className="grid lg:grid-flow-col grid-cols-1 lg:grid-cols-2 lg:grid-rows-4 gap-y-5 gap-x-14 xl:gap-x-[100px]">
            <Dropdown
              placeholder={"Please Select"}
              options={brandOptions}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Brand Name"
              id="drop1"
              onChange={(selectedOption) => setBrand(selectedOption?.value)}
            />
            <div className="flex flex-col gap-1">
              <Field
                placeholder={"Type here or select"}
                type={"field"}
                required
                useLabel
                labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
                labelText="Type"
                id="field6"
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <Field
              id="field1"
              type={"field"}
              placeholder={"Type here"}
              useLabel
              labelText="License Plate"
              required
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            <Field
              placeholder={"Type here or select"}
              type={"field"}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Color"
              id="field7"
              onChange={(e) => setColor(e.target.value)}
            />
            <Field
              id="field2"
              type={"field"}
              placeholder={"Type here"}
              useLabel
              labelText="Frame Number"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setFrameNumber(e.target.value)}
            />
            <Field
              id="field3"
              type={"field"}
              placeholder={"Type here"}
              useLabel
              labelText="Engine Number"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEngineNumber(e.target.value)}
            />
            <Field
              id="field4"
              type={"field"}
              placeholder={"Type here"}
              useLabel
              labelText="Kilometer(s)"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setKilometers(parseInt(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-[100px] mt-5 lg:mt-7">
            <div className="flex gap-3 items-end">
              <div className="w-[85%]">
                <Field
                  id="upload"
                  type={"field"}
                  placeholder={"Upload Car Picture (optional)"}
                  useLabel
                  labelText="Car Photo"
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
              <Button type={"submit"} text="Add Car" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
