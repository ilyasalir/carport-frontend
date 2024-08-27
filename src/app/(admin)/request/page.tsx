"use client";

import {
  FormEvent,
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

interface DataStnk {
  name: string;
  photo: JSX.Element;
  status: JSX.Element;
  desc: JSX.Element;
  Action?: JSX.Element;
}

export default function Request() {
  const context = useContext(UserContext);
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataTable, setDataTable] = useState<DataStnk[]>([]);
  const [dataStnk, setDataStnk] = useState<DataStnk[]>([]);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [selectedUserStnk, setSelectedUserStnk] = useState<number>();
  const [showPopUpAddUser, setShowPopUpAddUser] = useState<boolean>(false);
  const [showPopUpReject, setShowPopUpReject] = useState<boolean>(false);
  const [brand, setBrand] = useState<number | undefined>();
  const [type, setType] = useState<string>("");
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [frameNumber, setFrameNumber] = useState<string>("");
  const [engineNumber, setEngineNumber] = useState<string>("");
  const [kilometers, setKilometers] = useState<number>(0);
  const [file, setFile] = useState<FileWithPath>();

  const [formErrors, setFormErrors] = useState<Record<string, string>>();
  const header = ["NAME","PHOTO", "STATUS", "DESCRIPTION", "ACTION"];

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

  const handleAddDesc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (context.token) {
        const response = await updateWithJson(
          "admin/stnk/desc/" + selectedUserStnk,
          {
            description: type
          },context.token
        )
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

  const handleAddCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (context.token) {
        const response = await postWithForm(
          "admin/car",
          {
            user_id: selectedUser,
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

        const acc = await updateWithJson(
          "admin/stnk/acc/" + selectedUserStnk,
          {},context.token
        )
        toastSuccess(response.data.message);
        location.reload();
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStnk = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials("admin/stnk", context.token);
        const data = response.data.data as Stnk[];
        const filteredData = data.filter((item : Stnk) => !item.status)
        setDataStnk(
          filteredData
            .map((item) =>{
              return {
                name: item.user.name,
                photo: (
                  <a href={item.photo_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={item.photo_url}
                      alt="My Car Photo"
                      className="w-full h-[200px] md:h-[160px] lg:h-[200px] rounded-[14px] object-cover cursor-pointer"
                    />
                  </a>
                ),
                status: (
                  item.desc == "" ? <p className="font-poppins font-bold text-red-600">PENDING</p> : <p className="font-poppins font-bold text-red-600">REJECTED</p>
                  
                ),
                desc:( 
                  <p>{item.desc}</p>
                 ),
                Action: (
                  <div
                    key={item.ID}
                    className="min-w-[188px] w-full flex gap-1 object-contain justify-center"
                  >
                    <Button
                      type="button"
                      text="Add Car"
                      shape="rounded-small"
                      fitContent
                      onClick={() => {
                        setSelectedUser(item.user_id);
                        setSelectedUserStnk(item.ID);
                        setShowPopUpAddUser(true);
                      }}
                    />
                    <Button
                      type="button"
                      text="Reject"
                      shape="rounded-small"
                      fitContent
                      onClick={() => {
                        setSelectedUser(item.user_id);
                        setSelectedUserStnk(item.ID);
                        setShowPopUpReject(true);
                      }}
                    />
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

  useEffect(() => {
    getStnk();
  }, []);
  // paginate
  const indexOfLastUser = page * 10;
  const indexOfFirstUser = indexOfLastUser - 10;

  const brandOptions = [
    { label: "BMW", value: 1 },
    { label: "Smart", value: 2 },
    { label: "Mercedes-Benz", value: 3 },
    { label: "Mini", value: 4 },
  ];

  useEffect(() => {
    if (search != undefined && search != "") {
      const filtered = dataStnk.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
      setDataTable(filtered.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(filtered.length / 10));
    } else {
      setDataTable(dataStnk.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(dataStnk.length / 10));
    }
    if (totalPages < page) {
      setPage(1);
    }
  }, [search, page, dataStnk]);

  return (
    <>
    <Modal
        visible={showPopUpReject}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpReject(false)}
      >
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          Reject
        </h1>
        <form onSubmit={(e) => handleAddDesc(e)} className="mt-6 lg:mt-12">
          <Field
            placeholder={"Type here or select"}
            type={"field"}
            required
            useLabel
            labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
            labelText="Description"
            id="field6"
            onChange={(e) => setType(e.target.value)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-[100px] mt-7">
            <div className="lg:col-start-2">
              <Button type={"submit"} text="Reject" />
            </div>
          </div>
        </form>
      </Modal>
    <Modal
        visible={showPopUpAddUser}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpAddUser(false)}
      >
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
      </Modal>
      <div className="w-full min-h-screen pb-[60px] pt-[108px] lg:pt-[40px] px-[4%] lg:px-[40px] xl:px-[80px] bg-white">
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            Request STNK    
          </h1>
        </div>
        <div className="w-full md:w-1/3">
            <Field
              id="Search"
              type={"search"}
              placeholder={"Search"}
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        <div className="w-full mt-8 flex flex-col gap-8">
          <Table data={dataTable} header={header} isLoading={false} />
          {dataStnk.length > 10 && (
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
