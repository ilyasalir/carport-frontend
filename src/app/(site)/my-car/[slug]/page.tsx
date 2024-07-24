"use client";

import Button from "@/components/button";

import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { BsArrowRightCircle } from "react-icons/bs";
import Table from "@/components/table";
import Paginate from "@/components/paginate";
import {
  FormEvent,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { toastError, toastSuccess } from "@/components/toast";
import { get, getWithCredentials, postBotWithJson, postWithCredentialsJson, updateCar, updateWithJson } from "@/lib/api";
import { UserContext } from "@/lib/context/user-context";
import { format, parse } from "date-fns";
import { FormatRupiah } from "@arismun/format-rupiah";
import LoadingPage from "@/components/loading";
import Modal from "@/components/modal";
import Dropdown from "@/components/dropdown";
import Datepicker from "@/components/datepicker";
import MultiCreatableDropdown from "@/components/mulit-dropdown-creatable";
import { OrderStatus } from "@/lib/interface/orderStatus";
import Field from "@/components/field";
import Upload from "../add/components/upload-file";
import { FileRejection, FileWithPath } from "react-dropzone";
import { useRouter } from "next/navigation";
import { number } from "zod";
import axios, { AxiosError } from "axios";

interface EditCar{
  license_plat: string;
  car_type_name: string;
  color_name: string;
  frame_number: string;
  engine_number: string;
  kilometers: number;
  brand_id: number;
  photo:string
}

export interface Booking {
  Car: { value: number; label: string } | undefined;
  Date: Date | undefined;
  Time: { value: string; label: string } | undefined;
  Address: { value: string; label: string } | undefined;
  Services: string[] | undefined;
  ServiceType: { value: string; label: string } | undefined;
}

export default function MyCar({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const context = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const dataLimit = 2;
  const [dataCar, setDataCar] = useState<Car>();
  const [dataRepair, setDataRepair] = useState<any[]>([]);
  const [paginateddataRepair, setPaginatedDataRepair] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [file, setFile] = useState<FileWithPath | undefined>();
  const [brand, setBrand] = useState<number | undefined>();
  const [isCarTypeRequired, setIsCarTypeRequired] = useState<boolean>(false);

  const [editData, setEditData] = useReducer(
    (prev: EditCar, next: Partial<EditCar>) => {
      return { ...prev, ...next };
    },
    {
      license_plat: "",
      car_type_name: "",
      color_name: "",
      frame_number: "",
      engine_number: "",
      kilometers: 0,
      brand_id: 0,
      photo: "",
    }
  );

  const brandOptions = [
    { label: "BMW", value: 1 },
    { label: "Smart", value: 2 },
    { label: "Mercedes-Benz", value: 3 },
    { label: "Mini", value: 4 },
  ];

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

  

  const getDetailCar = async () => {
    try {
      if (context.user && context.token) {
        setIsLoading(true);
        const response = await getWithCredentials(
          `car/${params.slug}`,
          context.token
        );
        const res = await getWithCredentials(
          `order?user_id=${context.user ? context.user.ID : ""}&car_id=${response.data?.data.ID}`,
          context.token
        );
        const data = res.data?.data as Order[];
        console.log(response.data?.data)
        setDataCar(response.data?.data);
        setDataRepair(
          data
            .filter((val) => val.status == OrderStatus.DONE)
            .map((item, idx: number) => ({
              No: idx + 1,
              Date: format(item.order_time, "dd/MM/yyyy"),
              Service: item.services.map((service) => service.name),
              Price: (
                <div>
                  <FormatRupiah value={item.price} />
                </div>
              ),
            }))
        );
        // toastSuccess(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDetailCar();
  }, [context.user]);

  const handleEditCar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (context.user && context.token) {
        const requestData = {
          license_plat: editData.license_plat,
          car_type_name: editData.car_type_name,
          color_name: editData.color_name,
          brand_id: editData.brand_id === 0 ? dataCar?.car_type.brand_id : editData.brand_id,
          frame_number: editData.frame_number,
          engine_number: editData.engine_number,
          kilometer: editData.kilometers,
          photo: file
        };
  
        const response = await updateCar(`car/${dataCar?.ID}`, requestData, context.token);
        toastSuccess(response.data.message);
        router.push("/my-car");
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // const indexOfLastItem = currentPage * dataLimit
    // const indexOfFirstItem = indexOfLastItem - dataLimit
    setPaginatedDataRepair(
      dataRepair.slice((currentPage - 1) * dataLimit, currentPage * dataLimit)
    );
    setTotalPages(
      dataRepair.length % dataLimit === 0
        ? dataRepair.length / dataLimit
        : Math.floor(dataRepair.length / dataLimit) + 1
    );
    if (totalPages < currentPage) {
      setCurrentPage(1);
    }
  }, [dataRepair]);

  const header = ["No", "Date", "Service(s)", "Price"];

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
  // Dropdown
  const [addresses, setAddresses] = useState<
    { value: string; label: string }[]
  >([]);
  const [cars, setCars] = useState<{ value: number; label: string }[]>([]);
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
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [showPopUpEdit, setShowPopUpEdit] = useState<boolean>(false);
  const [dataUser, setUser] = useState<User>();

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
  useEffect(() => {
    getAddresses();
    getCurretUser();
  }, [context.user]);

  useEffect(() => {
    if (dataCar) {
      setCars([
        {
          value: dataCar.ID,
          label:
            dataCar.car_type.brand.name +
            " " +
            dataCar.car_type.name +
            " | " +
            dataCar.license_plat,
        },
      ]);
      setBooking({
        Car: {
          value: dataCar.ID,
          label:
            dataCar.car_type.brand.name +
            " " +
            dataCar.car_type.name +
            " | " +
            dataCar.license_plat,
        },
      });
    }
  }, [dataCar]);

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
    }
  };
  useEffect(() => {
    getTimeAvailable();
  }, [context.user, booking.Date]);

  const serviceType = [
    { label: "Home Service", value: "Home Service" },
    { label: "Pick-Up Service", value: "Pick-Up Service" },
    { label: "Drop n' Go", value: "Drop n' Go" },
  ];

  const getServices = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials("service", context.token);
        const data = response.data.data as Service[];
        const uniqueData = data.filter(
          (service, index, self) =>
            index === self.findIndex((s) => s.name === service.name)
        );
        setServices(
          (prevServices) => {
            const uniqueServices = uniqueData.filter((service) => {
              return !prevServices.some(
                (prevService) =>
                  prevService.value === service.name ||
                  prevService.label === service.name
              );
            });
            // Map the unique services to the new array
            const newServices = uniqueServices.map((val) => {
              return { value: val.name, label: val.name };
            });
            return [...prevServices, ...newServices];
          }
          // data.map((val) => {
          //   return { value: val.name, label: val.name };
          // })
        );
        // toastSuccess(response.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    getServices();
  }, []);

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
          service_type: booking.ServiceType?.value,
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
      "Services : " + booking.Services?.map(service => service).join(", ");
      const bot = await postBotWithJson(
        "message",
        {
          phoneNumber: '120363315179404140@g.us',
          message: message
        }
      );
      toastSuccess(response.data.message);
      location.reload()
    } catch (error) {
      toastError("Create booking failed");
    } finally {
      setIsLoadingAdd(false);
      window.location.reload();
    }
  };

  const tableRef = useRef<HTMLDivElement>(null);

  const handleSeeRepairHistoryClick = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <LoadingPage isLoad={isLoading} />
      <Modal
        visible={showPopUp}
        width="w-[90%] md:w-[87.5%]"
        onClose={() => setShowPopUp(false)}
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
              options={cars}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Your Car"
              id="drop1"
              disabled
              value={booking.Car}
              // onChange={(val) => setBooking({ Car: val! })}
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
              placeholder={"Please Select"}
              options={serviceType}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Service Type"
              id="drop3"
              // value={booking.ServiceType}
              onChange={(value) => setBooking({ ServiceType: value! })}
            />
            <div className="flex flex-col gap-1">
              <Dropdown
                placeholder={"Please Select"}
                options={time}
                required
                useLabel
                labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
                label="Time"
                id="drop4"
                // value={booking.Time}
                onChange={(value) => setBooking({ Time: value! })}
              />

              <p className="text-gray-subtext text-[12px] lg:text-[14px] font-poppins">
                *Please select date first
              </p>
            </div>
            <Dropdown
              placeholder={"Please Select"}
              options={addresses.length > 0 ? addresses : [{ label: "Please Add Address in Your Profile",}]}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Address"
              id="drop5"
              // value={booking.Address}
              onChange={(value) => {
                if (addresses.length > 0) {
                  setBooking({ Address: value! });
                } else if (addresses.length <= 0) {
                  router.push("/profile");
                }
              }}
            />
            <MultiCreatableDropdown
              placeholder={"Type here or select"}
              options={services}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Service"
              id="drop6"
              onChange={(selectedOption) =>
                setBooking({
                  Services: selectedOption.map((item) => item.value),
                })
              }
              throwValue={(selectedOption) =>
                setBooking({
                  Services: selectedOption.map((item) => item.value),
                })
              }
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
      <Modal
        visible={showPopUpEdit}
        width="w-[90%] md:w-[87.5%]"
        onClose={() => setShowPopUpEdit(false)}
      >
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          Edit Car
        </h1>
        <form onSubmit={(e) => handleEditCar(e)} className="mt-6 lg:mt-12">
          <div className="grid lg:grid-flow-col grid-cols-1 lg:grid-cols-2 lg:grid-rows-4 gap-y-5 gap-x-14 xl:gap-x-[100px]">
            <Dropdown
              placeholder={dataCar?.car_type.brand.name}
              options={brandOptions}
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Brand Name"
              id="drop1"
              onChange={(selectedOption) => {
                const brandId = selectedOption?.value || dataCar?.car_type.brand_id;
                setEditData({ ...editData, brand_id: brandId });
                setIsCarTypeRequired(brandId !== undefined && brandId !== 0);
              }}
            />

            <Field
              placeholder={dataCar?.car_type.name || "Type here"}
              type={"field"}
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Type"
              id="field6"
              onChange={(e) => {
                const value = e.target.value.trim(); // Trim whitespace
                setEditData({
                  car_type_name: value ? value : dataCar?.car_type.name
                });
              }}
              required={isCarTypeRequired}
            />
            
            <Field
              id="field1"
              type={"field"}
              placeholder={dataCar?.license_plat}
              useLabel
              labelText="License Plate"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEditData({license_plat: e.target.value})}
            />
            <Field
              placeholder={dataCar?.color.name}
              type={"field"}
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Color"
              id="field7"
              onChange={(e) => {
                const value = e.target.value.trim(); // Trim whitespace
                setEditData({
                  color_name: value ? value : dataCar?.color.name
                });
              }}
            />
            <Field
              id="field2"
              type={"field"}
              placeholder={dataCar?.frame_number}
              useLabel
              labelText="Frame Number"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEditData({frame_number: e.target.value})}
            />
            <Field
              id="field3"
              type={"field"}
              placeholder={dataCar?.engine_number}
              useLabel
              labelText="Engine Number"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEditData({engine_number: e.target.value})}
            />
            <Field
              id="field4"
              type={"field"}
              placeholder={dataCar?.kilometer}
              useLabel
              labelText="Kilometer(s)"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEditData({kilometers: Number(e.target.value)})}
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
              <Button type={"submit"} text="Edit Car" />
            </div>
          </div>
        </form>
      </Modal>
      <div className="w-full min-h-screen h-auto pt-[108px] pb-[60px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white">
        <div className="flex items-center gap-4 text-[18px] text-gray-subtext font-poppins font-medium">
          <Link href={"/my-car"} className="underline cursor-pointer">
            My Car
          </Link>
          <div className="text-[14px] md:text-[16px] lg:text-[20px]">
            <IoIosArrowForward />
          </div>
          <p className="text-dark-maintext">{dataCar?.license_plat}</p>
        </div>
        <div className="flex justify-between items-center md:items-start mt-6">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            {dataCar?.car_type.name}
            <br />
            Model
          </h1>
          {dataCar?.car_type.brand_id == 1 ? (
            <img
              src="/assets/bmw_color.svg"
              alt="BMW Logo"
              className="h-[48px] lg:h-[74px] object-contain"
            />
          ) : dataCar?.car_type.brand_id == 2 ? (
            <img
              src="/assets/smart_color.png"
              alt="SMART Logo"
              className="h-[48px] lg:h-[74px] object-contain"
            />
          ) : dataCar?.car_type.brand_id == 3 ? (
            <img
              src="/assets/mercedes_color.png"
              alt="Mercedes Logo"
              className="h-[48px] lg:h-[74px] object-contain"
            />
          ) : (
            <img
              src="/assets/mini_color.png"
              alt="Mini Logo"
              className="h-[48px] lg:h-[74px] object-contain"
            />
          )}
        </div>
        <div className="flex lg:flex-row flex-col-reverse justify-between gap-3 mt-2">
          <div className="flex flex-col gap-3 lg:gap-6">
            <p className="text-dark-maintext text-justify font-poppins text-[14px] md:text-[16px] lg:text-[20px]">
              {dataCar?.license_plat} | {dataCar?.color.name}
            </p>
            <Button
              type={"button"}
              text="Edit Car"
              color="hollow"
              shape="rounded-medium"
              fitContent={true}
              onClick={() => setShowPopUpEdit(true)}
            />
            <Button
              type={"button"}
              text="Repair"
              icon={<BsArrowRightCircle />}
              shape="rounded-medium"
              fitContent={true}
              onClick={() => setShowPopUp(true)}
            />
          </div>
          {dataCar?.photo_url && (
            <img
              src={dataCar?.photo_url}
              alt="Car Photo"
              className="object-cover w-full lg:w-[600px] xl:w-[800px] h-[320px] lg:h-[360px] xl:h-[450px] rounded-[20px] border-[1px] border-gray-subtext"
            />
          )}
        </div>
        <div
          className="mt-12 lg:mt-16 flex flex-col gap-1 items-center w-fit mx-auto text-gray-subtext cursor-pointer"
          onClick={handleSeeRepairHistoryClick}
        >
          <p className="text-justify font-poppins text-[14px] md:text-[16px] lg:text-[20px]">
            See Repair History
          </p>
          <div className="text-[16px] md:text-[20px] lg:text-[24px] animate-bounce">
            <IoIosArrowDown />
          </div>
        </div>
        <div className="mt-12 lg:mt-16 mb-5 lg:mb-9" ref={tableRef}>
          <Table
            data={paginateddataRepair}
            header={header}
            isLoading={isLoading}
          />
        </div>
        {dataRepair.length > 5 && (
          <Paginate
            totalPages={totalPages}
            current={(page: number) => setCurrentPage(page)}
          />
        )}
      </div>
    </>
  );
}
