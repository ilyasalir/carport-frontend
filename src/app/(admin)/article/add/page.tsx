"use client";

import Button from "@/components/button";
import { IoIosArrowForward } from "react-icons/io";
import { useContext, useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { toastError, toastSuccess } from "@/components/toast";
import { get, getWithCredentials, postWithCredentialsJson, postWithForm, postWithMixedData } from "@/lib/api";
import Dropdown from "@/components/dropdown";
import Field from "@/components/field";
import Upload from "./components/upload-file";
import { FileRejection, FileWithPath } from "react-dropzone";
import { UserContext } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import MultiCreatableDropdown from "@/components/mulit-dropdown-creatable";
import RichTextEditor, { TextEditor } from "@/components/Tiptap";


export default function AddCar() {
  const router = useRouter();
  const context = useContext(UserContext);
  const [Status, setStatus] = useState<boolean>(false);
  const [Title, setTitle] = useState<string>("");
  const [Content, setContent] = useState<string>("");
  const [Tag, setTag] = useState<string[]>([]);
  const [Category, setCategory] = useState<number>(0);
  const [file, setFile] = useState<FileWithPath>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [CategoryOptions, setCategoryOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const [tagOptions, setTagOptions] = useState<{ value: string; label: string }[]>([
    {
      value: "Flud Checks",
      label: "Flud Checks",
    },
    {
      value: "Oil Changes",
      label: "Oil Changes",
    },
    {
      value: "Mobil",
      label: "Mobil",
    },
    {
      value: "Carporteuro",
      label: "Carporteuro",
    },
  ]);

  const statusOptions = [
    { label: "Publish", value: true },
    { label: "Draft", value: false }
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

  const getTags = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials("admin/article/tag", context.token);
        const data = response.data.data as Service[];
        const uniqueData = data.filter(
          (service, index, self) =>
            index === self.findIndex((s) => s.name === service.name)
        );
        setTagOptions(
          (prevServices) => {
            const uniqueServices = uniqueData.filter((service) => {
              return !prevServices.some(
                (prevService) =>
                  prevService.value === service.name ||
                  prevService.label === service.name
              );
            });
            // Map the unique services to the new array
            const newServices = uniqueServices.map((val) => {
              return { value: val.name, label: val.name };
            });
            return [...prevServices, ...newServices];
          }
          // data.map((val) => {
          //   return { value: val.name, label: val.name };
          // })
        );
        // toastSuccess(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTags();
  }, [context.loading]);

  const getCategory = async () => {
    try {
      if (context.token) {
        setIsLoading(true);
        const response = await getWithCredentials(
          `admin/category`,
          context.token
        );
        const data = response.data?.data as Category[];
        setCategoryOptions(
          data
          .map((item) => ({
            label: item.name,
            value: item.ID
          }))
        );
        console.log(response.data.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleAddArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Status : ",Status)
    try {
      if (context.token) {
        const formData = new FormData();
        formData.append("title", Title);
        formData.append("content", Content);
        formData.append("status", JSON.stringify(Status));
        formData.append("category", Category.toString());
        formData.append("tags", JSON.stringify(Tag));
        if (file) {
          formData.append("photo", file);
        }

        const response = await postWithMixedData(
          "admin/article/add",
          formData,
          context.token
        );
        toastSuccess(response.data.message);
        router.push('/article')
        console.log(Tag)
        console.log(file)
      }
    } catch (error) {
      console.log(error);
      console.log(file)
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen h-auto pb-[60px] pt-[108px] lg:pt-[40px] px-[4%] lg:px-[40px] xl:px-[80px] bg-white">
        <div className="flex items-center gap-4 text-[18px] text-gray-subtext font-poppins font-medium">
          <Link href={`/article/`} className="underline cursor-pointer">
            Article
          </Link>
          <div className="text-[14px] md:text-[16px] lg:text-[20px]">
            <IoIosArrowForward />
          </div>
          <p className="text-dark-maintext">Write an Article</p>
        </div>
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          Write an Article
        </h1>
        <form onSubmit={(e) => handleAddArticle(e)} className="mt-6 lg:mt-12">
          <div className="flex flex-col gap-y-5 gap-x-14 xl:gap-x-[100px]">
            <div className="">
              <Dropdown
                placeholder={"Please Select"}
                options={CategoryOptions}
                required
                useLabel
                labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
                label="Category"
                id="drop1"
                onChange={(selectedOption) => setCategory(selectedOption?.value)}
              />
            </div>
            <Field
              placeholder={"Type here"}
              type={"field"}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Title"
              id="field6"
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="w-full font-poppins lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <p className="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px] after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary">Content</p>
              <TextEditor content="type here" onChange={(Content) => setContent(Content)} />
            </div>
            
            <MultiCreatableDropdown
              options={tagOptions}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Tag"
              id="drop6"
              onChange={(selectedOption) =>
                setTag(selectedOption.map((item) => item.value))
              }
              throwValue={(selectedOption) =>
                setTag(selectedOption.map((item) => item.value))
              }
            />
            <div className="">
              <Dropdown
                placeholder={"Please Select"}
                options={statusOptions}
                required
                useLabel
                labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
                label="Status"
                id="drop1"
                onChange={(selectedOption) => {
                  if (selectedOption !== undefined && selectedOption?.value !== undefined) {
                    setStatus(selectedOption.value);
                  } else {
                    setStatus(false); // Default to Draft if no selection is made
                  }
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-[100px] mt-5 lg:mt-7">
            <div className="flex gap-3 items-end">
              <div className="w-[85%]">
                <Field
                  id="upload"
                  type={"field"}
                  placeholder={"Upload Photo"}
                  useLabel
                  labelText="Thumbnail"
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
              <Button type={"submit"} text="Create Article" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
