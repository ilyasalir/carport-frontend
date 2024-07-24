"use client";

import Button from "@/components/button";
import Field from "@/components/field";
import Modal from "@/components/modal";
import { toastSuccess, toastError } from "@/components/toast";
import { deleteWithCredentials, postWithJson } from "@/lib/api";
import { useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

export default function Address({
  id,
  number,
  name,
  address,
  postCode,
  throwValueEdit,
  throwValueDelete,
}: {
  id: number;
  number: number;
  name: string;
  address: string;
  postCode: string;
  throwValueEdit: (
    id: number,
    name: string,
    address: string,
    showPopUp: boolean
  ) => void;
  throwValueDelete: (id: number, showPopUp: boolean) => void;
}) {
  return (
    <>
      <div className="bg-white w-full flex justify-between text-dark-maintext items-center">
        <div className="flex gap-5 items-center">
          <h3 className="font-poppins text-[14px] lg:text-[16px]">{number}</h3>
          <div className="flex flex-col">
            <p className="font-poppins font-bold text-[14px] lg:text-[16px]">
              {name}
            </p>
            <p className="font-poppins text-[14px] lg:text-[16px]">{address}</p>
            <p className="font-poppins text-[14px] lg:text-[16px]">
              {postCode}
            </p>
          </div>
        </div>
        <div>
          <div className="flex gap-4">
            <div
              className="cursor-pointer text-[20px] lg:text-[24px] flex justify-center items-center rounded-[4px] text-black hover:text-yellow-secondary active:text-yellow-accent"
              onClick={() => throwValueEdit(id, name, address, true)}
            >
              <FiEdit3 />
            </div>
            <div
              className="cursor-pointer text-[20px] lg:text-[24px] flex justify-center items-center rounded-[4px] text-red-secondary hover:text-red-accent active:text-red-accent"
              onClick={() => throwValueDelete(id, true)}
            >
              <FiTrash2 />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
