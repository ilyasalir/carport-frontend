"use client";

import { useContext, useEffect, useState } from "react";
import Calendar from "./components/calendar";
import ServiceCard from "./components/service-card";
import { format } from "date-fns";
import { toastError } from "@/components/toast";
import { getWithCredentials } from "@/lib/api";
import { UserContext } from "@/lib/context/user-context";
import { OrderStatus } from "@/lib/interface/orderStatus";

export default function MyCar() {
  const context = useContext(UserContext);
  const [currentDay, setCurrentDay] = useState<Date>(new Date());
  const [data, setData] = useState<Order[]>([]);

  let unusedSchedule = Array.from({ length: 10 }, (_, i) => {
    return {
      time: `${i + 8 < 10 ? "0" : ""}${i + 8}:00`,
      left: false,
    };
  });

  useEffect(() => {
    const getSchedule = async () => {
      try {
        if (context.token) {
          const response = await getWithCredentials(
            "order?date=" + format(currentDay, "yyyy-MM-dd"),
            context.token
          );
          const data = response.data.data as Order[];
          setData(
            data.filter(
              (val) =>
                val.status != OrderStatus.CANCELED &&
                val.status == OrderStatus.GOING
            )
          );
        }
      } catch (error) {
        toastError((error as any).response?.data?.error);
      }
    };
    getSchedule();
  }, [currentDay]);

  return (
    <>
      <div className="w-full min-h-screen pb-[60px] pt-[108px] lg:pt-[40px] px-[4%] lg:px-[40px] xl::px-[80px] bg-white">
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            SCHEDULE
          </h1>
          <p className="font-poppins font-bold text-[14px] md:text-[16px] lg:text-[20px]">
            {format(new Date(), "E, dd MMMM yyyy")}
          </p>
        </div>
        <div className="w-full mt-6 lg:mt-12">
          <Calendar onCurrentDay={(curr) => setCurrentDay(curr)} />
        </div>
        <div className="w-full overflow-auto h-auto">
          <div className="w-full min-w-[640px] lg:min-w-[852px] mt-7 grid grid-cols-[min-content,auto] gap-x-4 relative">
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              8:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              9:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              10:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              11:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              12:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              13:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              14:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              15:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              16:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              17:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-gray-subtext"></div>
            <p className="font-poppins text-[14px] md:text-[16px] lg:text-[20px] text-gray-subtext place-self-center">
              18:00
            </p>
            <div className="w-full h-[88px] lg:h-[100px] border-t-[1px] border-b-[1px] border-gray-subtext"></div>
            <div className="grid grid-cols-2 grid-rows-9 gap-x-10 gap-y-1 py-[44px] h-full w-full absolute col-start-2">
              {data.map((order, index) => {
                const orderStartTime = format(order.order_time, "HH:mm");
                const unusedIndex = unusedSchedule.findIndex(
                  (val) => val.time == orderStartTime
                );

                // Cek apakah kiri sudah terisi
                let i = unusedIndex;
                let possible = true;
                while (i < unusedIndex + order.duration && possible) {
                  if (unusedSchedule[i].left) {
                    possible = false;
                  }
                  i++;
                }

                // mark left true (used)
                if (possible) {
                  for (
                    let i = unusedIndex;
                    i < unusedIndex + order.duration;
                    i++
                  ) {
                    unusedSchedule[i].left = true;
                  }
                }

                return (
                  <ServiceCard
                    key={index}
                    plate={order.car.license_plat}
                    customer={order.user.email}
                    address={order.address ?? undefined}
                    phone={order.user.phone}
                    brand={order.car.car_type.brand.name}
                    type={order.car.car_type.name}
                    frame={order.car.frame_number}
                    engine={order.car.engine_number}
                    kilometer={order.car.kilometer}
                    service={order.services}
                    colStart={possible ? "col-start-1" : "col-start-2"}
                    rowStart={
                      unusedIndex == 0
                        ? "row-start-1"
                        : unusedIndex == 1
                          ? "row-start-2"
                          : unusedIndex == 2
                            ? "row-start-3"
                            : unusedIndex == 3
                              ? "row-start-4"
                              : unusedIndex == 4
                                ? "row-start-5"
                                : unusedIndex == 5
                                  ? "row-start-6"
                                  : unusedIndex == 6
                                    ? "row-start-7"
                                    : unusedIndex == 7
                                      ? "row-start-8"
                                      : unusedIndex == 8
                                        ? "row-start-9"
                                        : "row-start-10"
                    }
                    rowSpan={
                      order.duration == 1
                        ? "row-span-1"
                        : order.duration == 2
                          ? "row-span-2"
                          : order.duration == 3
                            ? "row-span-3"
                            : order.duration == 4
                              ? "row-span-4"
                              : order.duration == 5
                                ? "row-span-5"
                                : order.duration == 6
                                  ? "row-span-6"
                                  : order.duration == 7
                                    ? "row-span-7"
                                    : order.duration == 8
                                      ? "row-span-8"
                                      : order.duration == 9
                                        ? "row-span-9"
                                        : "row-span-10"
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
