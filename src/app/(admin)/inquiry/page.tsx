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
import { format } from "date-fns";
import {
  deleteUser,
  getWithCredentials,
  updateWithJson,
} from "@/lib/api";
import { toastError, toastSuccess } from "@/components/toast";
import { UserContext } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { IoIosTrash } from "react-icons/io";
import { MdRotateLeft } from "react-icons/md";

interface DataInquiry {
    date: string;
    cars_brand: string;
    status: JSX.Element;
    problem: JSX.Element;
    phone: string;
    action: JSX.Element;
}

export default function Article() {
  const context = useContext(UserContext);
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataTable, setDataTable] = useState<DataInquiry[]>([]);
  const [DataInquiry, setDataInquiry] = useState<DataInquiry[]>([]);
  const [DataInquiryUpdate, setDataInquiryUpdate] = useState<Inquiry[]>([]);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [showPopUpDelete, setShowPopUpDelete] = useState<boolean>(false);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const header = ["DATE", "CAR'S BRAND", "PROBLEM", "PHONE", "STATUS", "ACTION"];
  const [Status, setStatus] = useState<boolean>(false);
  

  const handleUpdateStatus = async (id: number) => {
    setIsLoading(true);
    try {
      if (context.token) {
        const response = await updateWithJson(
          "inquiry/status/" + id,
          {},
          context.token
        );
        toastSuccess(response.data.message);
        await getInquiry();
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInquiry = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials(
          "inquiry",
          context.token
        );
        const data = response.data.data as Inquiry[];
        console.log("inquiry data : ",data)
        setDataInquiry(
          data.map((item) => {
            return {
              date: format(new Date(item.CreatedAt), "MMMM, d yyyy"),
              cars_brand: item.cars_brand + `, ${item.cars_year}`,
              problem: (
                <div
                  style={{
                    maxWidth: "100%",  // Adjust the max width as needed
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                  className="flex min-w-[188px] w-full justify-center items-center" // Flexbox centering
                >
                  {item.problem}
                </div>
              ),
              phone: item.phone,
              status: 
              item.status ? (
                <div className="w-full flex gap-1 object-contain justify-center">
                  <p className="font-poppins font-bold text-[#17B77B] px-2 py-1 bg-[#17B77B14] rounded inline-block ">
                    Replied
                  </p>
                  <div
                    className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-[#AEB9BE] hover:text-yellow-300 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(item.ID);
                      handleUpdateStatus(item.ID);
                    }}
                  >
                    <MdRotateLeft />
                  </div>
                </div>
              ) : (
                <div className="w-full flex gap-1 object-contain justify-center">
                  <p className="font-poppins font-bold text-[#0561FC] px-2 py-1 bg-[#DFF0FF] rounded inline-block">
                    Not Replied
                  </p>
                  <div
                    className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-[#AEB9BE] hover:text-yellow-300 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(item.ID);
                      handleUpdateStatus(item.ID);
                    }}
                  >
                    <MdRotateLeft />
                  </div>
                </div>
              ),
              action: (
                <div
                    key={item.ID}
                    className="w-full flex gap-1 object-contain justify-center"
                  >
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
              )
            };
          })
        );
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    }
  };

  const handleDeleteInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token && selectedUser) {
        const response = await deleteUser(
          `inquiry/${selectedUser}`,
          context.token
        );
        await getInquiry()
        setShowPopUpDelete(false)
        toastSuccess(response.data.message)
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      const errorMessage =
        (error as any).response?.data?.error || "Failed to delete inquiry.";
      toastError(errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    getInquiry();
  }, []);

  // paginate
  const indexOfLastUser = page * 10;
  const indexOfFirstUser = indexOfLastUser - 10;

  useEffect(() => {
    if (search != undefined && search != "") {
      const filtered = DataInquiry.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
      setDataTable(filtered.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(filtered.length / 10));
    } else {
      setDataTable(DataInquiry.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(DataInquiry.length / 10));
    }
    if (totalPages < page) {
      setPage(1);
    }
  }, [search, page, DataInquiry]);

  return (
    <>
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
          onSubmit={(e) => handleDeleteInquiry(e)}
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
            INQUIRY
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
        </div>
        <div className="w-full mt-8 flex flex-col gap-8">
          <Table data={dataTable} header={header} isLoading={false} />
          {DataInquiry.length > 10 && (
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
