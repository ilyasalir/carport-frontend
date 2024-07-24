"use client";

import { FormEvent, ReactNode, useContext, useEffect, useState } from "react";
import Button from "@/components/button";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import Table from "@/components/table";
import OrderBook from "@/app/(site)/booking/components/order-book";
import Paginate from "@/components/paginate";
import Modal from "@/components/modal";
import Dropdown from "@/components/dropdown";
import Field from "@/components/field";
import { getWithCredentials, postBotWithJson, updateWithJson } from "@/lib/api";
import { toastError, toastSuccess } from "@/components/toast";
import { format } from "date-fns";
import { FormatRupiah } from "@arismun/format-rupiah";
import { UserContext } from "@/lib/context/user-context";
import { OrderStatus } from "@/lib/interface/orderStatus";

interface DataOrder {
  Customer: string;
  Date: string;
  Time: string;
  Service: string[];
  License: string;
  Brand: string;
  Price: JSX.Element;
  Action?: JSX.Element;
}

export default function MyCar() {
  const context = useContext(UserContext);
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentPageGoing, setCurrentPageGoing] = useState(1);
  const [currentPageDone, setCurrentPageDone] = useState(1);
  const [showPopUpDuration, setShowPopUpDuration] = useState<boolean>(false);
  const [showPopUpPrice, setShowPopUpPrice] = useState<boolean>(false);
  const [showPopUpPriceUpdate, setShowPopUpPriceUpdate] =
    useState<boolean>(false);
  const [showPopUpCreate, setShowPopUpCreate] = useState<boolean>(false);
  const [dataUpcoming, setDataUpcoming] = useState<DataOrder[]>([]);
  const [dataGoing, setDataGoing] = useState<DataOrder[]>([]);
  const [dataDone, setDataDone] = useState<DataOrder[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [duration, setDuration] = useState<{ value: number; label: string }>();
  const [price, setPrice] = useState<string>();

  const option = [
    { label: "1 hour", value: 1 },
    { label: "2 hours", value: 2 },
    { label: "3 hours", value: 3 },
    { label: "4 hours", value: 4 },
    { label: "5 hours", value: 5 },
    { label: "6 hours", value: 6 },
    { label: "7 hours", value: 7 },
  ];
  const header1 = [
    "Customer",
    "Date",
    "Time",
    "Service(s)",
    "License Number",
    "Car Brand",
    "Price",
    "Action",
  ];
  const header2 = [
    "Customer",
    "Date",
    "Time",
    "Service(s)",
    "License Number",
    "Car Brand",
    "Price",
  ];

  const getSchedule = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials("order", context.token);
        const data = response.data.data as Order[];
        setDataUpcoming(
          data
            .filter(
              (val) =>
                val.status == OrderStatus.PENDING ||
                val.status == OrderStatus.ACCEPTED_USER
            )
            .map((order) => {
              return {
                Customer: order.user.email,
                Date: format(order.order_time, "dd/MM/yyy"),
                Time: format(order.order_time, "HH:mm"),
                Service: order.services.map((val) => val.name),
                License: order.car.license_plat,
                Brand: order.car.car_type.brand.name,
                Price:
                  order.price == 0 ? (
                    <></>
                  ) : (
                    <FormatRupiah value={order.price} />
                  ),
                Action: (
                  <>
                    {order.price == 0 ? (
                      addedEstimationPrice(order.ID)
                    ) : order.status == OrderStatus.ACCEPTED_USER ? (
                      <Button
                        type={"button"}
                        text="Add"
                        color="hollow"
                        shape="rounded-small"
                        onClick={() => {
                          setShowPopUpDuration(true);
                          setSelectedId(order.ID);
                        }}
                        fitContent
                      />
                    ) : (
                      <p className="text-gray-subtext text-center">Waiting</p>
                    )}
                  </>
                ),
              };
            })
        );
        setDataGoing(
          data
            .filter((val) => val.status == OrderStatus.GOING)
            .map((order) => {
              return {
                Customer: order.user.email,
                Date: format(order.order_time, "dd/MM/yyy"),
                Time: format(order.order_time, "HH:mm"),
                Service: order.services.map((val) => val.name),
                License: order.car.license_plat,
                Brand: order.car.car_type.brand.name,
                Price: <FormatRupiah value={order.price} />,
                Action: (
                  <Button
                    type={"button"}
                    text="Done"
                    color="hollow"
                    shape="rounded-small"
                    onClick={() => {
                      setShowPopUpPriceUpdate(true);
                      setSelectedId(order.ID);
                      setPrice(order.price.toString());
                    }}
                    fitContent
                  />
                ),
              };
            })
        );
        setDataDone(
          data
            .filter((val) => val.status == OrderStatus.DONE)
            .map((order) => {
              return {
                Customer: order.user.email,
                Date: format(order.order_time, "dd/MM/yyy"),
                Time: format(order.order_time, "HH:mm"),
                Service: order.services.map((val: Service) => val.name),
                License: order.car.license_plat,
                Brand: order.car.car_type.brand.name,
                Price: <FormatRupiah value={order.price} />,
              };
            })
        );

        
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    }
  };
  useEffect(() => {
    getSchedule();
  }, []);

  // paginate
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

  const addedEstimationPrice = (id: number): ReactNode => {
    return (
      <div className="flex gap-1 items-center">
        <div
          className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-white bg-green-accent hover:bg-green-secondary"
          onClick={() => {
            setShowPopUpPrice(true);
            setSelectedId(id);
          }}
        >
          <IoMdCheckmark />
        </div>
        <div
          className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] border-2 border-red-secondary hover:border-red-accent text-red-secondary hover:text-red-accent"
          onClick={() => handleCancle(id)}
        >
          <IoMdClose />
        </div>
      </div>
    );
  };

  const handleCancle = async (id: number) => {
    try {
      if (context.token) {
        await updateWithJson(
          "order/status/" + id,
          {
            status: OrderStatus.CANCELED,
          },
          context.token
        );
        await getSchedule();
        toastSuccess("Order canceled");
      }
    } catch (error) {
      toastError("Cancel order failed");
    }
  };

  const handleUpdateDuration = async (
    e: FormEvent<HTMLFormElement>,
    id: number
  ) => {
    e.preventDefault();
    try {
      if (context.token) {
        await updateWithJson(
          "order/status/" + id,
          {
            status: OrderStatus.GOING,
            duration: duration?.value,
          },
          context.token
        );
        await getSchedule();
        toastSuccess("Update duration successfully");
        setShowPopUpDuration(false);
      }
    } catch (error) {
      toastError("Update duration failed");
    }
  };

  const handleUpdatePrice = async (
    e: FormEvent<HTMLFormElement>,
    id: number,
    isConfirm: boolean
  ) => {
    e.preventDefault();
    try {
      if (context.token) {
        if (isConfirm) {
          await updateWithJson(
            "order/price/" + id,
            {
              price: Number.parseInt(price!),
              status: OrderStatus.DONE,
            },
            context.token
          );
        } else {
          await updateWithJson(
            "order/price/" + id,
            {
              price: Number.parseInt(price!),
              status: OrderStatus.PENDING,
            },
            context.token
          );
        }
        setShowPopUpPriceUpdate(false);
        setShowPopUpPrice(false);
        await getSchedule();
        toastSuccess("Update price successfully");
      }
    } catch (error) {
      toastError("Update price failed");
    }
  };

  return (
    <>
      <Modal
        visible={showPopUpDuration}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpDuration(false)}
      >
        <div>
          <form
            onSubmit={(e) => handleUpdateDuration(e, selectedId)}
            className="flex flex-col gap-5 lg:gap-7"
          >
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Duration"
              id="drop1"
              value={duration}
              onChange={(val) => setDuration(val!)}
            />
            <div className="lg:col-start-2">
              <Button type={"submit"} text="Save" />
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        visible={showPopUpPriceUpdate}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpPriceUpdate(false)}
      >
        <div>
          <form
            onSubmit={(e) => handleUpdatePrice(e, selectedId, true)}
            className="flex flex-col gap-5 lg:gap-7"
          >
            <Field
              id="price"
              type={"field"}
              placeholder={"Confirmation price"}
              useLabel
              labelText="Price"
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(val) => setPrice(val.target.value)}
              value={price}
              required
            />
            <div className="lg:col-start-2">
              <Button type={"submit"} text="Save" />
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        visible={showPopUpPrice}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpPrice(false)}
      >
        <div>
          <form
            onSubmit={(e) => handleUpdatePrice(e, selectedId, false)}
            className="flex flex-col gap-5 lg:gap-7"
          >
            <Field
              id="estimate"
              type={"field"}
              placeholder={"Add price estimation"}
              useLabel
              labelText="Price"
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(val) => setPrice(val.target.value)}
              required
            />
            <div className="lg:col-start-2">
              <Button type={"submit"} text="Save" />
            </div>
          </form>
        </div>
      </Modal>
      {/* <Modal
        visible={showPopUpCreate}
        width="w-[90%] md:w-[87.5%]"
        onClose={() => setShowPopUpCreate(false)}
      >
        <div>
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mb-4">
            NEW APPOINTMENT
          </h1>
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Car License Number"
              id="drop1"
            />
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Date"
              id="drop2"
            />
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Car Brand"
              id="drop3"
            />
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Time"
              id="drop4"
            />
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Car Type"
              id="drop5"
            />
            <Field
              type={"email"}
              placeholder={"Type customer email here"}
              useLabel
              labelText="Customer Email"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
            />
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Color"
              id="drop6"
            />
            <Field
              type={"field"}
              placeholder={"Type customer number here"}
              useLabel
              labelText="Customer Phone"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
            />
            <Dropdown
              placeholder={"Please Select"}
              options={option}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Service"
              id="drop7"
            />
            <div className="w-full place-self-end">
              <Button type={"submit"} text="Create Appoinment" />
            </div>
          </form>
        </div>
      </Modal> */}
      <div className="w-full min-h-screen pb-[60px] pt-[108px] lg:pt-[40px] px-[4%] lg:px-[40px] xl:px-[80px] bg-white">
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            ORDER LIST
          </h1>
          {/* <Button
            type="button"
            text="Create New Order"
            color="primary"
            shape="rounded-small"
            fitContent={true}
            onClick={() => setShowPopUpCreate(true)}
          /> */}
        </div>
        <div className="w-full mt-8 flex flex-col gap-8">
          <OrderBook
            type={"upcoming"}
            summary={"Upcoming"}
            isOpen={false}
            child={
              <div className="flex flex-col gap-6">
                <Table
                  data={currentItemsUpcoming}
                  header={header1}
                  isLoading={false}
                />
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
                <Table
                  data={currentItemsGoing}
                  header={header1}
                  isLoading={false}
                />
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
                <Table
                  data={currentItemsDone}
                  header={header2}
                  isLoading={false}
                />
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
