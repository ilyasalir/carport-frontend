"use client";

import {
  FormEvent,
  JSXElementConstructor,
  ReactNode,
  use,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Button from "@/components/button";
import Table from "@/components/table";
import Link from "next/link";
import Paginate from "@/components/paginate";
import Modal from "@/components/modal";
import Field from "@/components/field";
import {
  deleteUser,
  getWithCredentials,
  postWithCredentialsJson,
  postWithForm,
  postWithJson,
  updateWithJson,
} from "@/lib/api";
import { toastError, toastSuccess } from "@/components/toast";
import { UserContext } from "@/lib/context/user-context";
import { any, z } from "zod";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { tr } from "date-fns/locale";
import { IoIosAdd, IoIosBrush, IoIosTrash } from "react-icons/io";
import Dropdown from "@/components/dropdown";
import { FiTrash2 } from "react-icons/fi";
import { auth } from "../../../../firebase";
import { getAuth } from "firebase/auth";
import { FileRejection, FileWithPath } from "react-dropzone";
import Upload from "../user-list/[id]/add/components/upload-file";
import ArticleCard from "./components/article-card";
import MultiCreatableDropdown from "@/components/mulit-dropdown-creatable";
import TextEditor from "@/components/Tiptap";

interface DataArticle {
  photo: JSX.Element;
  status: JSX.Element;
  Action?: JSX.Element;
}

interface DataCategory {
  Name: string;
  Action?: JSX.Element;
}

interface Option {
  label: string;
  value: any;
}

export default function Article() {
  const context = useContext(UserContext);
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataTable, setDataTable] = useState<DataArticle[]>([]);
  const [tagOption, setTagOption] = useState<Tag[]>([]);
  const [DataArticle, setDataArticle] = useState<DataArticle[]>([]);
  const [DataArticleUpdate, setDataArticleUpdate] = useState<Article[]>([]);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [showPopUpEdit, setShowPopUpEdit] = useState<boolean>(false);
  const [showPopUpCategory, setShowPopUpCategory] = useState<boolean>(false);
  const [file, setFile] = useState<FileWithPath>();
  const [showPopUpDelete, setShowPopUpDelete] = useState<boolean>(false);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [articleDetail, setArticleDetail] = useState<Article>();
  const [formErrors, setFormErrors] = useState<Record<string, string>>();
  const header = ["ARTICLE", "STATUS", "ACTION"];
  const headerCategory = ["CATEGORY","ACTION"];
  const [Status, setStatus] = useState<boolean>(false);
  const [Title, setTitle] = useState<string>("");
  const [Content, setContent] = useState<string>("");
  const [Tag, setTag] = useState<string[]>([]);
  const [Category, setCategory] = useState<number>(0);
  const [dataCategory, setDataCategory] = useState<DataCategory[]>([]);
  const [addCategory, setAddCategory] = useState<string>("");
  const [CategoryOptions, setCategoryOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const [tagOptions, setTagOptions] = useState<
    { value: string; label: string }[]
  >([
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
    { label: "Draft", value: false },
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
        const response = await getWithCredentials(
          "admin/article/tag",
          context.token
        );
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
          data.map((item) => ({
            label: item.name,
            value: item.ID,
          }))
        );
        setDataCategory(
          data.map((item) => {
            return {
              Name: item.name,
              Action: (
                <div
                  className="min-w-[188px] w-full flex gap-1 object-contain justify-center"
                >
                  <div
                    className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-white bg-red-600 hover:bg-red-secondary cursor-pointer"
                    onClick={() => {
                      handleDeleteCategory(item.ID)
                    }}
                  >
                    <IoIosTrash />
                  </div>
                </div>
              )
            };
          })
        )
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

  const getArticle = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials(
          "admin/article",
          context.token
        );
        const data = response.data.data as Article[];
        setDataArticleUpdate(data);
        setDataArticle(
          data.map((item) => {
            return {
              photo: (
                <ArticleCard
                  photo={item.photo_url}
                  title={item.title}
                  ID={item.ID}
                />
              ),
              status:
                item.status == true ? (
                  <p className="font-poppins font-bold text-green-600">
                    PUBLISHED
                  </p>
                ) : (
                  <p className="font-poppins font-bold text-blue-600">DRAFT</p>
                ),
              Action: (
                <div
                  key={item.ID}
                  className="min-w-[188px] w-full flex gap-1 object-contain justify-center"
                >
                  <Button
                    type="button"
                    text="Update"
                    shape="rounded-small"
                    fitContent
                    onClick={() => {
                      setSelectedUser(item.user_id);
                      handleUpdateStnk(item.ID);
                    }}
                  />
                  <Button
                    type="button"
                    text="Edit"
                    shape="rounded-small"
                    fitContent
                    onClick={() => {
                      setSelectedUser(item.ID);
                      setShowPopUpEdit(true);
                      getDetailArticle(item.ID);
                    }}
                  />
                  <div
                    className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-white bg-red-600 hover:bg-red-secondary cursor-pointer"
                    onClick={() => {
                      setSelectedUser(item.ID);
                      setShowPopUpDelete(true);
                    }}
                  >
                    <IoIosTrash />
                  </div>
                </div>
              ),
            };
          })
        );
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    }
  };

  const handleDeleteCategory = async (id:number) => {
    setIsLoadingButton(true);
    try {
      if (context.token) {
        const response = await deleteUser(
          `admin/category/${id}`,
          context.token
        );
        await getCategory()
        toastSuccess(response.data.message)
      }
    } catch (error) {
      console.error("Error Deleting Category:", error);
      const errorMessage =
        (error as any).response?.data?.error || "Failed to Delete Category.";
      toastError(errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleDeleteArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token && selectedUser) {
        const response = await deleteUser(
          `admin/article/${selectedUser}`,
          context.token
        );
        await getArticle()
        setShowPopUpDelete(false)
        toastSuccess(response.data.message)
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        (error as any).response?.data?.error || "Failed to delete user.";
      toastError(errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token) {
        const response = await postWithForm(
          `admin/category/add`,{
            category: addCategory
          },
          context.token
        );
        toastSuccess(response.data.message)
        location.reload();
      }
    } catch (error) {
      console.error("Error Adding Category:", error);
      const errorMessage =
        (error as any).response?.data?.error || "Failed to Add Category.";
      toastError(errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleUpdateStnk = async (id: number) => {
    setIsLoading(true);
    try {
      if (context.token) {
        const response = await updateWithJson(
          "admin/article/status/" + id,
          {},
          context.token
        );
        toastSuccess(response.data.message);
        location.reload();
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDetailArticle = async (id: number) => {
    try {
      if (context.user && context.token) {
        const response = await getWithCredentials(
          `admin/article/${id}`,
          context.token
        );
        const data = response.data.data as Article[];
        setArticleDetail(response.data?.data);
        // toastSuccess(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleEditArticle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (context.user && context.token) {
        const requestData = {
          title: Title,
          content: Content,
          status: Status,
          photo: file,
          category: Category,
          tags: Tag,
        };

        const response = await updateWithJson(
          `admin/article/edit/${selectedUser}`,
          requestData,
          context.token
        );
        toastSuccess(response.data.message);
        location.reload()
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArticle();
  }, [articleDetail]);
  // paginate
  const indexOfLastUser = page * 10;
  const indexOfFirstUser = indexOfLastUser - 10;

  useEffect(() => {
    if (search != undefined && search != "") {
      const filtered = DataArticle.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
      setDataTable(filtered.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(filtered.length / 10));
    } else {
      setDataTable(DataArticle.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(DataArticle.length / 10));
    }
    if (totalPages < page) {
      setPage(1);
    }
  }, [search, page, DataArticle]);

  return (
    <>
      <Modal
        visible={showPopUpEdit}
        onClose={() => setShowPopUpEdit(false)}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
      >
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          Edit Article
        </h1>
        <form onSubmit={(e) => handleEditArticle(e)} className="mt-6 lg:mt-12">
          <div className="flex flex-col gap-y-5 gap-x-14 xl:gap-x-[100px]">
            <div className="">
              <Dropdown
                placeholder={articleDetail?.category.name}
                options={CategoryOptions}
                useLabel
                required
                labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
                label="Category"
                id="drop1"
                onChange={(selectedOption) =>
                  setCategory(selectedOption?.value)
                }
              />
            </div>
            <Field
              placeholder={articleDetail?.title}
              type={"field"}
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Title"
              id="field6"
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="w-full font-poppins lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <p className="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px] after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary">
                Content
              </p>
              <TextEditor
                content={articleDetail?.content as string}
                onChange={(Content) => setContent(Content)}
              />
            </div>
            <MultiCreatableDropdown
              placeholder={"Type here or select"}
              options={tagOptions}
              value={articleDetail?.tags.map((item) => ({
                value: item.name,
                label: item.name,
              }))} // Display existing tags as selected options
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Tags" // Change label to "Tags" for clarity
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
                placeholder={
                  articleDetail?.status == false ? "DRAFT" : "PUBLISH"
                }
                options={statusOptions}
                required
                useLabel
                labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
                label="Status"
                id="drop1"
                onChange={(selectedOption) => {
                  if (
                    selectedOption !== undefined &&
                    selectedOption?.value !== undefined
                  ) {
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
                  placeholder={"Change Photo"}
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
              <Button type={"submit"} text="Edit Article" />
            </div>
          </div>
        </form>
      </Modal>
      <Modal
        visible={showPopUpCategory}
        onClose={() => setShowPopUpCategory(false)}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
      >
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          Category
        </h1>
        <div className="w-full mt-8 flex flex-col gap-8 pb-[20px]">
          <Table data={dataCategory} header={headerCategory} isLoading={false} />
          {dataCategory.length > 10 && (
            <Paginate
              totalPages={totalPages}
              current={(page: number) => setPage(page)}
            />
          )}
        </div>
        <form 
          onSubmit={(e) => handleAddCategory(e)}
          className="w-full flex flex-col gap-3"
        >
          <Field
              placeholder={"Type here"}
              type={"field"}
              useLabel
              required
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Add New Category"
              id="field6"
              onChange={(e) => setAddCategory(e.target.value)}
            />
            <Button type={"submit"} text="Add Category" />
        </form>
      </Modal>
      <Modal
        visible={showPopUpDelete}
        onClose={() => setShowPopUpDelete(false)}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
      >
        <div className="flex items-center justify-center text-[40px] mx-auto w-20 h-20 rounded-full text-red-secondary border-2 border-red-secotext-red-secondary">
          <FiTrash2 />
        </div>
        <h3 className="text-[24px] md:text-[28px] lg:text-[32px] text-center text-red-secondary mt-5 font-poppins font-bold">
          Are you sure?
        </h3>
        <p className="text-center text-dark-maintext mt-3 font-poppins">
          Do you really want to delete this item? <br /> This action cannot be
          undone
        </p>
        <form
          onSubmit={(e) => handleDeleteArticle(e)}
          className="w-full flex flex-col lg:flex-row gap-5 mt-5"
        >
          <div className="w-full lg:w-1/2">
            <Button
              type={"submit"}
              text="YES"
              color="red"
              isLoading={isLoadingButton}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <Button
              type={"button"}
              text="NO"
              onClick={() => setShowPopUpDelete(false)}
            />
          </div>
        </form>
      </Modal>
      <div className="w-full min-h-screen pb-[60px] pt-[108px] lg:pt-[40px] px-[4%] lg:px-[40px] xl:px-[80px] bg-white">
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            ARTICLE
          </h1>
        </div>
        <div className="flex flex-row justify-between mt-3 mb-3 items-center">
          <div className="w-[50%] md:w-1/3">
            <Field
              id="Search"
              type={"search"}
              placeholder={"Search"}
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
            type="button"
            text="Category"
            color="hollow"
            shape="normal"
            fitContent
            onClick={() => setShowPopUpCategory(true)}
            />
            <Button
              type="button"
              text="Write an Article"
              color="hollow"
              shape="normal"
              fitContent
              onClick={() => router.push(`article/add`)}
            />
          </div>
        </div>
        <div className="w-full mt-8 flex flex-col gap-8">
          <Table data={dataTable} header={header} isLoading={false} />
          {DataArticle.length > 10 && (
            <Paginate
              totalPages={totalPages}
              current={(page: number) => setPage(page)}
            />
          )}
        </div>
      </div>
    </>
  );
}
