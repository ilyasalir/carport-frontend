import React from "react";
import { DataTable } from "./user-history-page";

function OrderCard({ data }: { data: DataTable }) {
  return (
    <div className="bg-white w-full rounded-[28px] px-8 py-5 border-[1px] border-gray-subtext text-dark-maintext mb-2">
      <div className="flex justify-between">
        <h3 className="font-poppins font-bold text-[20px]">{data.No}</h3>
        <h3 className="font-poppins font-normal text-[14px]">
          {data.Date + " | " + data.Time}
        </h3>
      </div>
      <p className="font-poppins font-medium text-[20px] mt-2">
        {data.Brand} | {data.Type} | {data.License}
      </p>
      <div className="flex justify-between items-end">
        <div>
          <p className="font-poppins text-[14px] mt-2">Services:</p>
          {data.Service.map((item: any, index: number) => (
            <li className="text-[12px]" key={index}>
              {item}
            </li>
          ))}
        </div>
        {data.Element}
      </div>
      <div className="flex justify-end mt-4">{data.Action}</div>
    </div>
  );
}

export default OrderCard;
