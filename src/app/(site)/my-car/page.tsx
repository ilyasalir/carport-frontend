"use client";

import Button from "@/components/button";
import CarCard from "./components/car-card";
import { useContext, useEffect, useState } from "react";
import { getWithCredentials } from "@/lib/api";
import { IoIosAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/loading";
import { UserContext } from "@/lib/context/user-context";
import { toastError } from "@/components/toast";
import StnkCard from "./components/stnk-card";

export default function MyCar() {
  const context = useContext(UserContext);
  const router = useRouter();
  const [dataCar, setDataCar] = useState<Car[]>([]);
  const [dataStnk, setDataStnk] = useState<Stnk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getDataCar = async () => {
    try {
      if (context.token) {
        setIsLoading(true);
        const response = await getWithCredentials("car", context.token);
        setDataCar(response.data?.data);
        // toastSuccess(response.data?.message);
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataStnk = async () => {
    try {
      if (context.token) {
        setIsLoading(true);
        const response = await getWithCredentials("stnk", context.token);
        const stnkData = response.data?.data
        const filteredData = stnkData.filter((item : Stnk) => !item.status)
        setDataStnk(filteredData);
        console.log(stnkData)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataCar();
    getDataStnk();
  }, []);
  return (
    <>
      <LoadingPage isLoad={isLoading} />
      <div className="w-full min-h-screen pt-[108px] pb-[60px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white">
        <div
          className="md:hidden fixed top-5 right-4 cursor-pointer text-[40px] hover:text-yellow-secondary text-black"
          style={{ zIndex: 51 }}
          onClick={() => router.push("/my-car/add")}
        >
          <IoIosAdd />
        </div>
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            {dataCar.length > 1 ? "MY CARS" : "MY CAR"}
          </h1>
          <div className="flex flex-row gap-2">
            <Button
              type="button"
              text="Add New Car"
              color="primary"
              shape="rounded-small"
              fitContent={true}
              onClick={() => router.push("/my-car/add")}
            />
            <Button
              type="button"
              text="Add New Car by STNK"
              color="primary"
              shape="rounded-small"
              fitContent={true}
              onClick={() => router.push("/my-car/add-stnk")}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full flex justify-center mt-20 font-poppins">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-orange-primary animate-spin dark:text-gray-600 fill-yellow-secondary"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : dataCar.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between gap-y-9 sm:gap-x-8 xl:gap-x-14 place-items-center mt-6">
            {dataCar.map((item: Car, idx: number) => {
              return (
                <CarCard
                  key={idx}
                  brand_id={item.car_type.brand.ID}
                  plate={item.license_plat}
                  brand={item.car_type.brand.name}
                  model={item.car_type.name}
                  color={item.color.name}
                  photo={item.photo_url}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-subtext lg:text-2xl font-bold font-poppins mt-6">
            Data Tidak Ada!
          </p>
        )}

        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            {dataStnk.length > 0 ? "Request STNK" : null }
          </h1>
          {dataStnk.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between gap-y-9 sm:gap-x-8 xl:gap-x-14 place-items-center mt-6">
            {dataStnk.map((item: Stnk, idx: number) => {       
              return (
                <StnkCard
                  key={idx}
                  photo={item.photo_url}
                  desc={item.desc}
                  ID={item.ID}
                />
              );
            })}
          </div>
        ) : (
          null
        )}
        </div>
      </div>
      
    </>
  );
}
