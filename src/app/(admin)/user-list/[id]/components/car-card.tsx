"use client";

import { useRouter, usePathname } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import Button from "@/components/button";
import {
  FormEvent,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { toastError, toastSuccess } from "@/components/toast";
import { getWithCredentials, postBotWithJson, postWithCredentialsJson, updateCar } from "@/lib/api";
import { UserContext } from "@/lib/context/user-context";
import { format, parse } from "date-fns";
import Modal from "@/components/modal";
import Dropdown from "@/components/dropdown";
import Datepicker from "@/components/datepicker";
import MultiCreatableDropdown from "@/components/mulit-dropdown-creatable";
import Field from "@/components/field";
import { FileRejection, FileWithPath } from "react-dropzone";
import Upload from "../add/components/upload-file";
import { useNavigate } from 'react-router'

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
  Services: string | undefined;
  ServiceType: { value: string; label: string } | undefined;
}
export default function CarCard({
  user_id,
  car_id,
  brand_id,
  plate,
  brand,
  model,
  color,
  photo,
  frame_number,
  engine_number,
  kilometer,
}: {
  user_id: number;
  brand_id: number;
  car_id: number;
  plate: string;
  brand: string;
  model: string;
  color: string;
  photo: string | undefined;
  frame_number: string;
  engine_number: string;
  kilometer: number;
}) {
  const router = useRouter();
  const context = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const dataLimit = 2;
  const [dataCar, setDataCar] = useState<Car>();
  const [dataRepair, setDataRepair] = useState<any[]>([]);
  const [paginateddataRepair, setPaginatedDataRepair] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPopUpBooking, setShowPopUpBooking] = useState<boolean>(false);
  const [cartype, setCarType] = useState<string>("");
  const [dataUser, setDataUser] = useState<User>();
  const [file, setFile] = useState<FileWithPath | undefined>();
  const [showPopUpEdit, setShowPopUpEdit] = useState<boolean>(false);
  const pathname = usePathname();
  const [isCarTypeRequired, setIsCarTypeRequired] = useState<boolean>(false);

  const brandOptions = [
    { label: "BMW", value: 1 },
    { label: "Smart", value: 2 },
    { label: "Mercedes-Benz", value: 3 },
    { label: "Mini", value: 4 },
  ];

  const getDataUser = async () => {
    try {
      if (context.token) {
        setIsLoading(true);
        const response = await getWithCredentials(
          `admin/usersbyid?user_id=${user_id}`,
          context.token
        );
        const data = response.data?.data
        setDataUser(data[0]);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    getDataUser();
  }, []);

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
      brand_id: brand_id,
      photo: "",
    }
  );

  const handleEditCar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (context.user && context.token) {
        // Ensure required fields are included in the request
        const requestData = {
          license_plat: editData.license_plat,
          car_type_name: editData.car_type_name,
          color_name: editData.color_name,
          brand_id: editData.brand_id,
          frame_number: editData.frame_number,
          engine_number: editData.engine_number,
          kilometers: editData.kilometers,
          photo: editData.photo
        };
  
        const response = await updateCar(`car/${car_id}`, requestData, context.token);
        toastSuccess(response.data.message);
        location.reload();
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
      console.log(brand_id)
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

  // const getAddresses = () => {
  //   if (context.user && context.user.ID === user_id && context.user.addresses) {
  //     setAddresses(
  //       context.user.addresses.map((value) => {
  //         return {
  //           value: value.location,
  //           label: value.title + " | " + value.location,
  //         };
  //       })
  //     );
  //   }
  // };

  // const getAddresses = async (userId: number) => {
  //   try {
  //     if (context.token) {
  //       // Call the function/API endpoint to fetch all users
  //       const response = await getWithCredentials("admin/users", context.token);
  //       console.log(response);

  //       // Find the user with the specified user_id
  //       const user = response.data

  //       // Check if the user with the specified user_id exists
  //       if (user && user.addresses) {
  //         // If addresses exist, setAddresses
  //         setAddresses(
  //           user.addresses.map((address: any) => ({
  //             value: address.location,
  //             label: address.title + " | " + address.location,
  //           }))
  //         );
  //       } else {
  //         console.error("User not found or addresses not available");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     // Handle error if needed
  //   }
  // };


  const getAddresses = async () => {
    try {
      if (context.token) {
        // Call the function/API endpoint to fetch all users
        const response = await getWithCredentials("admin/users", context.token);
        const users = response.data.data; // Assuming the data is an array of user objects
        // console.log(users);
        // Find the user with the specified user_id
        const userByID = users.find((user: User) => user.ID == user_id);
        // console.log(userByID);

        // Check if the userByID with the specified userByID_id exists
        if (userByID && userByID.addresses) {
          // If addresses exist, setAddresses
          setAddresses(
            userByID.addresses.map((address: any) => ({
              value: address.location,
              label: address.title + " | " + address.location,
            }))
          );
        } else {
          console.error("User not found or addresses not available");
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error if needed
    }
  };

  useEffect(() => {
    getAddresses();
  }, [showPopUpBooking]);

  useEffect(() => {
      setBooking({
        Car: {
          value: car_id,
          label:
            brand +
            " " +
            model +
            " | " +
            plate,
        },
      });
  }, []);

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
          service_type: "Home Service",
          address: booking.Address?.value,
          order_time: parsedTime,
          services: booking.Services,
        },
        context.token!
      );
      const message = "🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔\n"+"Admin Added New Order\n" +
      "\n" +
      "Name : " + dataUser?.name + "\n" +
      "Email : " + dataUser?.email + "\n" +
      "No HP : " + dataUser?.phone + "\n" +
      "\n" +
      "Car : " + booking.Car?.label + booking.Car?.value + "\n" +
      "Address : " + booking.Address?.label + "\n" +
      "Service Type : " + "Home Service" + "\n" +
      "Services : " + booking.Services
      const bot = await postBotWithJson(
        "message",
        {
          phoneNumber: '120363315179404140@g.us',
          message: message
        }
      );
      toastSuccess(response.data.message);
      location.reload();
    } catch (error) {
      toastError("Create booking failed");
      console.log(error)
    } finally {
      setIsLoadingAdd(false);
      // window.location.reload();
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
      <Modal
        visible={showPopUpBooking}
        width="w-[90%] md:w-[87.5%]"
        onClose={() => setShowPopUpBooking(false)}
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
              options={brand}
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
              placeholder={"Home Service"}
              options={serviceType}
              disabled
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Service Type"
              id="drop3"
              // value={booking.ServiceType}
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
              options={addresses.length > 0 ? addresses : [{ value: "", label: "This user has no Address" }]}
              required
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Address"
              id="drop5"
              onChange={(value) => setBooking({ Address: value! })}
              isOptionDisabled={(option) => option.value === ""}
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
              placeholder={brand}
              options={brandOptions}
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              label="Brand Name"
              id="drop1"
              onChange={(selectedOption) => {
                const brandId = selectedOption?.value;
                setEditData({ ...editData, brand_id: brandId });
                setIsCarTypeRequired(brandId !== undefined && brandId !== 0);
                console.log(editData.brand_id)
              }}
            />

            <Field
              placeholder={editData.brand_id ? "" : model}
              type={"field"}
              useLabel
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Car Type"
              id="field6"
              onChange={(e) => {
                const value = e.target.value.trim(); // Trim whitespace
                setEditData({
                  ...editData,
                  car_type_name: value ? value : model,
                });
              }}
              required={isCarTypeRequired} // Make car type required based on state
            />
            
            <Field
              id="field1"
              type={"field"}
              placeholder={editData.brand_id ? "" : plate}
              useLabel
              required={isCarTypeRequired}
              labelText="License Plate"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEditData({license_plat: e.target.value})}
            />
            <Field
              placeholder={editData.brand_id ? "" : color}
              type={"field"}
              useLabel
              required={isCarTypeRequired}
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Color"
              id="field7"
              onChange={(e) => {
                const value = e.target.value.trim(); // Trim whitespace
                setEditData({
                  color_name: value ? value : color
                });
              }}
            />
            <Field
              id="field2"
              type={"field"}
              placeholder={editData.brand_id ? "" : frame_number}
              useLabel
              labelText="Frame Number"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEditData({frame_number: e.target.value})}
            />
            <Field
              id="field3"
              type={"field"}
              placeholder={editData.brand_id ? "" : engine_number}
              useLabel
              labelText="Engine Number"
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setEditData({engine_number: e.target.value})}
            />
            <Field
              id="field4"
              type={"field"}
              placeholder={editData.brand_id ? "" : kilometer}
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

      <div className="bg-white w-full h-full rounded-[28px] p-5 md:p-6 xl:p-8 border-[1px] border-gray-subtext text-dark-maintext">
        {photo ? (
          <img
            src={photo}
            alt="My Car Photo"
            className="w-full h-[200px] md:h-[160px] lg:h-[200px] rounded-[14px] object-cover"
          />
        ) : (
          <div className="w-full h-[200px] md:h-[160px] lg:h-[200px] rounded-[14px] flex justify-center items-center bg-slate-100">
            {brand_id == 1 ? (
              <img
                src="/assets/bmw.svg"
                alt="BMW Logo"
                className="h-[74px] object-contain"
              />
            ) : brand_id == 2 ? (
              <img
                src="/assets/smart_logo_only.png"
                alt="SMART Logo"
                className="h-[74px] object-contain"
              />
            ) : brand_id == 3 ? (
              <img
                src="/assets/mercedes_logo_only.png"
                alt="Mercedes Logo"
                className="h-[74px] object-contain"
              />
            ) : (
              <img
                src="/assets/mini.png"
                alt="Mini Logo"
                className="h-[74px] object-contain"
              />
            )}
          </div>
        )}
        <h3 className="font-poppins font-bold text-[20px] md:text-[24px] lg:text-[28px] mt-2">
          {plate}
        </h3>
        <p className="font-poppins font-normal text-[14px] md:text-[16px] lg:text-[20px] mt-2">
          {brand} | {model} | {color}
        </p>
        <div className="flex flex-col gap-1 mt-4">
          <Button
            type="button"
            text="Edit Car"
            color="hollow"
            shape="rounded-small"
            fitContent={true}
            onClick={() => setShowPopUpEdit(true)}
          />
          <Button
            type="button"
            text="Book Services"
            color="primary"
            icon={<BsArrowRight />}
            shape="rounded-small"
            fitContent={true}
            onClick={() => setShowPopUpBooking(true)}
          />
        </div>
      </div>
    </>
  );
}
