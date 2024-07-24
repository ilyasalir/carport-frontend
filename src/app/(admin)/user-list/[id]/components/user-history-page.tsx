"use client";

import OrderBook from "./order-book";
import Table from "@/components/table";
import { useContext, useEffect, useState } from "react";
import { getWithCredentials } from "@/lib/api";
import { format } from "date-fns";
import { UserContext } from "@/lib/context/user-context";
import { FormatRupiah } from "@arismun/format-rupiah";
import { useMediaQuery } from "usehooks-ts";
import OrderCard from "./order-card";
import Paginate from "@/components/paginate";
import LoadingPage from "@/components/loading";
import { OrderStatus } from "@/lib/interface/orderStatus";
import { DetailsContext } from "@/lib/context/details-context";

export interface DataTable {
  No: number;
  Date: string;
  Time: string;
  Service: string[];
  License: string;
  Brand: string;
  Type: string;
  Element: JSX.Element;
  Action?: JSX.Element;
}

export interface Booking {
  Car: { value: number; label: string } | undefined;
  Date: Date | undefined;
  Time: { value: string; label: string } | undefined;
  Address: { value: string; label: string } | undefined;
  Services: string[] | undefined;
  ServiceType: { value: string; label: string } | undefined;
}

export default function MyCar({ user_id }: { user_id: number }) {
  const context = useContext(UserContext);
  const { isOpen, updateIsOpen } = useContext(DetailsContext);
  const tabletWidth = useMediaQuery("(min-width: 768px)");
  const [dataUpcoming, setDataUpcoming] = useState<DataTable[]>([]);
  const [dataGoing, setDataGoing] = useState<DataTable[]>([]);
  const [dataDone, setDataDone] = useState<DataTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // GET
  const getSchedule = async () => {
    try {
      if (context.token) {
        const res = await getWithCredentials(
          `order?user_id=${user_id}`,
          context.token
        );
        const data = res.data.data as Order[];
        setDataUpcoming(
          data
            .filter(
              (val) =>
                val.status == OrderStatus.PENDING ||
                val.status == OrderStatus.ACCEPTED_USER
            )
            .map((order, idx: number) => ({
              No: idx + 1,
              Date: format(order.order_time, "dd/MM/yyyy"),
              Time: format(order.order_time, "HH:mm"),
              Service: order.services.map((val) => val.name),
              License: order.car.license_plat,
              Brand: order.car.car_type.brand.name,
              Type: order.car.car_type.name,
              Element:
                order.price == 0 ? (
                  <p className="text-gray-subtext">Pending</p>
                ) : (
                  <FormatRupiah value={order.price} />
                ),
            }))
        );
        setDataGoing(
          data
            .filter((val) => val.status == OrderStatus.GOING)
            .map((order, idx: number) => ({
              No: idx + 1,
              Date: format(order.order_time, "dd/MM/yyyy"),
              Time: format(order.order_time, "HH:mm"),
              Service: order.services.map((val) => val.name),
              License: order.car.license_plat,
              Brand: order.car.car_type.brand.name,
              Type: order.car.car_type.name,
              Element: <FormatRupiah value={order.price} />,
            }))
        );
        setDataDone(
          data
            .filter(
              (val) =>
                val.status == OrderStatus.DONE ||
                val.status == OrderStatus.CANCELED
            )
            .map((order, idx: number) => ({
              No: idx + 1,
              Date: format(order.order_time, "dd/MM/yyyy"),
              Time: format(order.order_time, "HH:mm"),
              Service: order.services.map((val) => val.name),
              License: order.car.license_plat,
              Brand: order.car.car_type.brand.name,
              Type: order.car.car_type.name,
              Element: (
                <>
                  <FormatRupiah value={order.price} />
                </>
              ),
            }))
        );
      }
    } catch (error) {
      // toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSchedule();
  }, [context.loading]);

  // Header
  const header = [
    "No",
    "Date",
    "Time",
    "Service(s)",
    "License Number",
    "Car Brand",
    "Car Type",
    "Price",
  ];
  const headerGoing = [
    "No",
    "Date",
    "Time",
    "Service(s)",
    "License Number",
    "Car Brand",
    "Car Type",
    "Price",
    "Status",
  ];

  // paginate
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentPageGoing, setCurrentPageGoing] = useState(1);
  const [currentPageDone, setCurrentPageDone] = useState(1);
  const indexOfLastItemUpcoming = currentPageUpcoming * 10;
  const indexOfFirstItemUpcoming = indexOfLastItemUpcoming - 10;
  const currentItemsUpcoming = dataUpcoming.slice(
    indexOfFirstItemUpcoming,
    indexOfLastItemUpcoming
  );
  const indexOfLastItemGoing = currentPageGoing * 10;
  const indexOfFirstItemGoing = indexOfLastItemGoing - 10;
  const currentItemsGoing = dataGoing.slice(
    indexOfFirstItemGoing,
    indexOfLastItemGoing
  );
  const indexOfLastItemDone = currentPageDone * 10;
  const indexOfFirstItemDone = indexOfLastItemDone - 10;
  const currentItemsDone = dataDone.slice(
    indexOfFirstItemDone,
    indexOfLastItemDone
  );

  return (
    <>
      <LoadingPage isLoad={isLoading} />
      <div className="w-full pt-[108px] pb-[60px] lg:pt-[48px] bg-white">
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            USER BOOKING
          </h1>
        </div>
        <div className="w-full mt-4 lg:mt-8 flex flex-col gap-8">
          <OrderBook
            type={"upcoming"}
            summary={"Upcoming"}
            isOpen={isOpen}
            onClose={(open) => updateIsOpen(open)}
            child={
              <div className="flex flex-col gap-6">
                {tabletWidth ? (
                  <Table
                    data={currentItemsUpcoming}
                    header={header}
                    isLoading={false}
                  />
                ) : (
                  <>
                    {dataUpcoming.map((value, idx) => (
                      <OrderCard key={idx} data={value} />
                    ))}
                    {dataUpcoming.length == 0 && (
                      <p className="text-center text-[12px]">
                        Data tidak ditemukan
                      </p>
                    )}
                  </>
                )}
                {dataUpcoming.length > 10 && (
                  <Paginate
                    totalPages={dataUpcoming.length / 10}
                    current={(page: number) => setCurrentPageUpcoming(page)}
                  />
                )}
              </div>
            }
          />
          <OrderBook
            type={"pending"}
            summary={"On-Going"}
            isOpen={false}
            child={
              <div className="flex flex-col gap-6">
                {tabletWidth ? (
                  <Table
                    data={currentItemsGoing}
                    header={headerGoing}
                    isLoading={false}
                  />
                ) : (
                  <>
                    {dataGoing.map((value, idx) => (
                      <OrderCard key={idx} data={value} />
                    ))}
                    {dataGoing.length == 0 && (
                      <p className="text-center text-[12px]">
                        Data tidak ditemukan
                      </p>
                    )}
                  </>
                )}
                {dataGoing.length > 10 && (
                  <Paginate
                    totalPages={dataGoing.length / 10}
                    current={(page: number) => setCurrentPageGoing(page)}
                  />
                )}
              </div>
            }
          />
          <OrderBook
            type={"done"}
            summary={"Done"}
            isOpen={false}
            child={
              <div className="flex flex-col gap-6">
                {tabletWidth ? (
                  <Table
                    data={currentItemsDone}
                    header={headerGoing}
                    isLoading={false}
                  />
                ) : (
                  <>
                    {dataDone.map((value, idx) => (
                      <OrderCard key={idx} data={value} />
                    ))}
                    {dataDone.length == 0 && (
                      <p className="text-center text-[12px]">
                        Data tidak ditemukan
                      </p>
                    )}
                  </>
                )}
                {dataDone.length > 10 && (
                  <Paginate
                    totalPages={dataDone.length / 10}
                    current={(page: number) => setCurrentPageDone(page)}
                  />
                )}
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}
