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

export default function StnkCard({
  photo,
  desc,
  ID,
}: {
  photo: string | undefined;
  desc: string | undefined;
  ID: number | undefined;
}) {
  const [showPopUpEdit, setShowPopUpEdit] = useState<boolean>(false); 
  const [file, setFile] = useState<FileWithPath>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(UserContext);
  const router = useRouter();

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

  const handleUpdateStnk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(file)
    try {
      if (context.token) {
        const response = await updateCar(
          "stnk/update/" + ID,
          {
            photo: file,
          },context.token
        )

        const del = await updateWithJson(
          "stnk/desc/delete/" + ID,
          {},context.token
        )
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
  return (
    
    <div className="bg-white w-full h-full rounded-[28px] p-5 md:p-6 xl:p-8 border-[1px] border-gray-subtext text-dark-maintext">
      <Modal
        visible={showPopUpEdit}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpEdit(false)}
      >
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
        Update STNK
        </h1>
        <form onSubmit={(e) => handleUpdateStnk(e)} className="mt-6 lg:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-[100px] mt-5 lg:mt-7">
            <div className="flex gap-1 items-end">
              <div className="w-[100%]">
                <Field
                  id="upload"
                  type={"field"}
                  placeholder={"Upload STNK Picture"}
                  useLabel
                  labelText="Update STNK"
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
              <Button type={"submit"} text="Update STNK" />
            </div>
          </div>
        </form>
      </Modal>
      <img
        src={photo}
        alt="My Car Photo"
        className="w-full h-[200px] md:h-[160px] lg:h-[200px] rounded-[14px] object-cover"
      />
      {desc == "" ? (<h3 className="font-poppins font-bold text-[20px] md:text-[24px] lg:text-[28px] mt-2 text-red-600">
        PENDING
      </h3>) : (
        <h3 className="font-poppins font-bold text-[20px] md:text-[24px] lg:text-[28px] mt-2 text-red-600">
        REJECTED
        </h3>
      )}

      <p className="font-poppins font-bold text-[12px] md:text-[16px] lg:text-[20px] mt-2 mb-5">{desc}</p>

      {desc == "" ? null : (
        <Button
        type={"button"}
        text="Upload New STNK"
        color="hollow"
        shape="normal"
        fitContent={true}
        onClick={() => setShowPopUpEdit(true)}
      />
      ) }
    </div>
  );
}
