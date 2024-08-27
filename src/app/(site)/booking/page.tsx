"use client";

import Button from "@/components/button";
import OrderBook from "./components/order-book";
import Table from "@/components/table";
import Modal from "@/components/modal";
import {
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Dropdown from "@/components/dropdown";
import { toastError, toastSuccess } from "@/components/toast";
import {
  getWithCredentials,
  postBotWithJson,
  postWithCredentialsJson,
  updateWithJson,
} from "@/lib/api";
import { format, parse } from "date-fns";
import { UserContext } from "@/lib/context/user-context";
import { FormatRupiah } from "@arismun/format-rupiah";
import { useMediaQuery } from "usehooks-ts";
import OrderCard from "./components/order-card";
import Paginate from "@/components/paginate";
import MultiCreatableDropdown from "@/components/mulit-dropdown-creatable";
import Datepicker from "@/components/datepicker";
import LoadingPage from "@/components/loading";
import { IoIosAdd, IoMdCheckmark, IoMdClose } from "react-icons/io";
import { OrderStatus } from "@/lib/interface/orderStatus";
import { DetailsContext } from "@/lib/context/details-context";
import { PopUpContext } from "@/lib/context/popup-order-context";
import { useRouter } from "next/navigation";
import Field from "@/components/field";

export interface DataTable {
  No: number;
  Date: string;
  Time: string;
  Service: string;
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
  Services: string | undefined;
  ServiceType: { value: string; label: string } | undefined;
}

export default function MyCar() {
  const router = useRouter();
  const context = useContext(UserContext);
  const popUpContext = useContext(PopUpContext);
  const { isOpen, updateIsOpen } = useContext(DetailsContext);
  const tabletWidth = useMediaQuery("(min-width: 768px)");

  const [dataUpcoming, setDataUpcoming] = useState<DataTable[]>([]);
  const [dataGoing, setDataGoing] = useState<DataTable[]>([]);
  const [dataDone, setDataDone] = useState<DataTable[]>([]);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataUser, setUser] = useState<User>();

  const [booking, setBooking] = useReducer(
    (prev: Booking, next: Partial<Booking>) => {
      return { ...prev, ...next };
    },
    {
      Car: undefined,
      Date: undefined,
      Time: undefined,
      Address: undefined,
      Services: undefined,
      ServiceType: undefined,
    }
  );

  const acceptedOrder = (id: number): ReactNode => {
    return (
      <div className="flex gap-1 justify-center">
        <div
          className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-white bg-green-accent hover:bg-green-secondary"
          onClick={() => handleAccept(id)}
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

  // GET
  const getSchedule = async () => {
    try {
      if (context.user && context.token) {
        const res = await getWithCredentials(
          `order?user_id=${context.user ? context.user.ID : ""}`,
          context.token
        );
        const data = res.data.data as Order[];
        console.log(data)
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
              Service: order.services,
              License: order.car.license_plat,
              Brand: order.car.car_type.brand.name,
              Type: order.car.car_type.name,
              Element:
                order.price == 0 ? (
                  <p className="text-gray-subtext">Pending</p>
                ) : (
                  <FormatRupiah value={order.price} />
                ),
              Action: (
                <>
                  {order.price == 0 ? (
                    <Button
                      onClick={() => handleCancle(order.ID)}
                      color="hollow"
                      shape="rounded-small"
                      type={"button"}
                      text="Cancel"
                      fitContent
                    />
                  ) : (
                    <>
                      {order.status == OrderStatus.ACCEPTED_USER ? (
                        <p className="text-gray-subtext text-center">Waiting</p>
                      ) : (
                        acceptedOrder(order.ID)
                      )}
                    </>
                  )}
                </>
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
              Service: order.services,
              License: order.car.license_plat,
              Brand: order.car.car_type.brand.name,
              Type: order.car.car_type.name,
              Element: <FormatRupiah value={order.price} />,
              Action: (
                <p className="text-[14px]">
                  {"Estimation " + order.duration + " hours"}
                </p>
              ),
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
              Service: order.services,
              License: order.car.license_plat,
              Brand: order.car.car_type.brand.name,
              Type: order.car.car_type.name,
              Element: (
                <>
                  <FormatRupiah value={order.price} />
                </>
              ),
              Action: (
                <>
                  {order.status == OrderStatus.CANCELED ? (
                    <p className="text-red-secondary text-[14px]">Canceled</p>
                  ) : (
                    <p className="text-green-secondary text-[14px]">Finished</p>
                  )}
                </>
              ),
            }))
        );
      }
      console.log(booking.Services)
    } catch (error) {
      // toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dropdown
  const [addresses, setAddresses] = useState<
    { value: string; label: string }[]
  >([]);
  const [cars, setCars] = useState<{ value: number; label: string }[]>([]);
  const [dataCars, setDataCars] = useState<Car[]>([]);
  const [services, setServices] = useState<{ value: string; label: string }[]>([
    {
      value: "Oil Changes",
      label: "Oil Changes",
    },
    {
      value: "Fluid Checks",
      label: "Fluid Checks",
    },
    {
      value: "Check Engine Light Diagnostics",
      label: "Check Engine Light Diagnostics",
    },
    {
      value: "Electrical System Checks",
      label: "Electrical System Checks",
    },
    {
      value: "Brake Repairs",
      label: "Brake Repairs",
    },
    {
      value: "Engine-Out Services",
      label: "Engine-Out Services",
    },
  ]);
  const [time, setTime] = useState<
    { value: string; label: string; attribute: boolean }[]
  >([]);

  const getAddresses = () => {
    if (context.user && context.user.addresses) {
      setAddresses(
        context.user.addresses.map((value) => {
          return {
            value: value.location,
            label: value.title + " | " + value.location,
          };
        })
      );
    }
  };

  const getCars = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials("car", context.token);
        const data = response.data.data as Car[];
        setDataCars(data)
        setCars(
          data.map((value) => {
            return {
              value: value.ID,
              label:
                value.car_type.brand.name +
                " " +
                value.car_type.name +
                " | " +
                value.license_plat,
            };
          })
        );
      }
    } catch (error) {
      toastError("Get cars data failed");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAddresses();
    getCars();
  }, [context.loading]);

  const getTimeAvailable = async () => {
    try {
      if (context.user && context.token && booking.Date) {
        const res = await getWithCredentials(
          `order?date=${format(booking.Date, "yyyy-MM-dd")}`,
          context.token
        );
        const orderData = res.data.data as Order[];
        let time = Array.from({ length: 10 }, (_, i) => {
          return {
            value: `${i + 8 < 10 ? "0" : ""}${i + 8}:00`,
            label: `${i + 8 < 10 ? "0" : ""}${i + 8}:00`,
            posible: 2,
          };
        });
        orderData.forEach((order) => {
          const idx = time.findIndex(
            (val) => val.value == format(order.order_time, "HH:mm")
          );

          let i = idx;
          while (i < idx + order.duration) {
            if (time[i].posible > 0 && order.status != "CANCELED") {
              time[i].posible--;
            }
            i++;
          }
        });
        setTime(
          time.map((data) => {
            return {
              label: data.label,
              value: data.value,
              attribute: data.posible != 0,
            };
          })
        );
      }
    } catch (error) {
      toastError("Get time available data failed");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTimeAvailable();
  }, [context.loading, booking.Date]);

  const serviceType = [
    { label: "Home Service", value: "Home Service" },
    { label: "Pick-Up Service", value: "Pick-Up Service" },
    { label: "Drop n' Go", value: "Drop n' Go" },
  ];

  useEffect(() => {
    getSchedule();
  }, [context.loading]);
  useEffect(() => {
    getCurretUser();
  }, [context.loading]);

  // POST
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
        toastSuccess("Booking canceled");
      }
    } catch (error) {
      toastError("Cancel booking failed");
    }
  };

  const handleAccept = async (id: number) => {
    try {
      if (context.token) {
        await updateWithJson(
          "order/status/" + id,
          {
            status: OrderStatus.ACCEPTED_USER,
          },
          context.token
        );
        await getSchedule();
        toastSuccess("Booking accepted");
      }
    } catch (error) {
      toastError("Accept booking failed");
    }
  };

  const getCurretUser = async () => {
    try {
      if (context.user && context.token) {
        setIsLoading(true);
        const response = await getWithCredentials(
          `auth`,
          context.token
        );
        const data = response.data?.data as User[];
        console.log(response.data?.data)
        setUser(response.data?.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const handleAddAppointment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingAdd(true);
    try {
      const parsedTime = parse(
        booking.Time?.value!,
        "HH:mm",
        new Date(
          booking.Date!.getFullYear(),
          booking.Date!.getMonth(),
          booking.Date!.getDate()
        )
      );
      const response = await postWithCredentialsJson(
        "order",
        {
          car_id: booking.Car?.value,
          service_type: "Home Service",
          address: booking.Address?.value,
          order_time: parsedTime,
          services: booking.Services,
        },
        context.token!
      );
      const message = "🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔\n"+"New Order By " + dataUser?.name +"\n" +
      "\n" +
      "Email : " + dataUser?.email + "\n" +
      "No HP : " + dataUser?.phone + "\n" +
      "\n" +
      "Car : " + booking.Car?.label + booking.Car?.value + "\n" +
      "Address : " + booking.Address?.label + "\n" +
      "Service Type : " + booking.ServiceType?.label + "\n" +
      "Services : " + booking.Services;
      const bot = await postBotWithJson(
        "message",
        {
          phoneNumber: '120363315179404140@g.us',
          message: message
        }
      );
      toastSuccess(bot.data.message);
      console.log("service : ", booking.Services)
      router.replace("/booking");
    } catch (error) {
      toastError("Create booking failed");
      console.log(error)
    } finally {
      setIsLoadingAdd(false);
      updateIsOpen(true);
      getSchedule();
      setShowPopUp(false);
    }
  };

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
    "Action",
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
      <Modal
        visible={showPopUp || popUpContext.isOpen}
        width="w-[90%] md:w-[87.5%]"
        onClose={() => {
          popUpContext.updateIsOpen(false);
          setShowPopUp(false);
        }}
      >
        <div>
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mb-4">
            NEW APPOINTMENT
          </h1>
          <form
            onSubmit={(e) => handleAddAppointment(e)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7"
          >
            <Dropdown
              placeholder={"Please Select"}
              options={cars.length > 0 ? cars : [{ label: "Please Add Your Carr in My Car Page",}]}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Your Car"
              id="drop1"
              // value={booking.Car}
              onChange={(value) => {
                if (cars.length > 0) {
                  setBooking({ Car: value! });
                } else if (cars.length <= 0) {
                  router.push("/my-car/add");
                }
              }}
            />
            <Datepicker
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Date"
              id="drop2"
              text={"Select booking date"}
              // defaultValue={booking.Date}
              onChange={(val) => setBooking({ Date: val })}
            />
            <Dropdown
              placeholder={"Home Service"}
              options={serviceType}
              disabled
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Service Type"
              id="drop3"
              // value={booking.ServiceType}
            />
            <Dropdown
              placeholder={"Please Select"}
              options={time}
              required
              useLabel
              guideText="**Please select date first"
              guideStyle="text-gray-subtext text-[12px] lg:text-[14px] font-poppins"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Time"
              id="drop4"
              // value={booking.Time}
              onChange={(value) => setBooking({ Time: value! })}
            />
            <Dropdown
              placeholder={"Please Select"}
              options={addresses.length > 0 ? addresses : [{ label: "Please Add Address in Your Profile",}]}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Address"
              id="drop5"
              onChange={(value) => {
                if (addresses.length > 0) {
                  setBooking({ Address: value! });
                } else if (addresses.length <= 0) {
                  router.push("/profile");
                }
              }}
            />
            <Field
              id="field4"
              required
              type={"field"}
              placeholder={"Type Your Problem Here..."}
              useLabel
              labelText="Service"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setBooking({ Services: e.target.value })}
            />
            <div className="mt-5 lg:mt-7 lg:col-start-2">
              <Button
                type={"submit"}
                text="Create Appointment"
                isLoading={isLoadingAdd}
              />
            </div>
          </form>
        </div>
      </Modal>
      <div className="w-full min-h-screen pt-[108px] pb-[60px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white">
        <div
          className="md:hidden fixed top-5 right-4 cursor-pointer text-[40px] hover:text-yellow-secondary text-black"
          style={{ zIndex: 51 }}
          onClick={() => setShowPopUp(true)}
        >
          <IoIosAdd />
        </div>
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            MY BOOKING
          </h1>
          <div className="hidden md:block">
            <Button
              type="button"
              text="Create Appointment"
              color="primary"
              shape="rounded-small"
              fitContent={true}
              onClick={() => setShowPopUp(true)}
            />
          </div>
        </div>
        <p className="mt-2 text-dark-maintext font-poppins text-[14px] md:text-[16px] lg:text-[20px]">
          Explore your upcoming booking or history{" "}
        </p>
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
