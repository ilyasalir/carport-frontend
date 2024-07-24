"use client";

import Button from "@/components/button";
import Field from "@/components/field";
import Address from "./components/address";
import { useContext, useEffect, useReducer, useState } from "react";
import LoadingPage from "@/components/loading";
import { UserContext } from "@/lib/context/user-context";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/components/toast";
import {
  deleteWithCredentials,
  postWithCredentialsJson,
  updateWithJson,
} from "@/lib/api";
import { type } from "os";
import Modal from "@/components/modal";
import { FiTrash2 } from "react-icons/fi";
import Cookies from "js-cookie";
import { z } from "zod";

interface Edit {
  name: string;
  phone: string;
  email: string;
  password?: string;
  confirm_password?: string;
}

export default function Profile() {
  const router = useRouter();
  const context = useContext(UserContext);
  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().refine((data) => data == "" || data.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
    confirm_password: z
      .string()
      .refine((data) => data === editData.password, {
        message: "Confirm password must match with your password",
      })
      .nullable(),
    phone: z
      .string()
      .min(10, "Invalid phone number")
      .max(15, "Invalid phone number")
      .refine((data) => /^08[0-9]{9,}$/.test(data), {
        message: "Please use 08XXXXXXXXXX format",
      }),
  });

  const [editData, setEditData] = useReducer(
    (prev: Edit, next: Partial<Edit>) => {
      return { ...prev, ...next };
    },
    {
      name: context.user?.name!,
      email: context.user?.email!,
      password: "",
      confirm_password: "",
      phone: context.user?.phone!,
    }
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>();
  // const [email, setEmail] = useState<string | undefined>(context.user?.email);
  // const [password, setPassword] = useState<string | undefined>("");
  // const [confirm_password, setConfirm_password] = useState<string | undefined>(
  //   ""
  // );
  // const [phone, setPhone] = useState<string | undefined>(context.user?.phone);
  const [addressTitle, setAddressTitle] = useState<string | undefined>("");
  const [address, setAddress] = useState<string | undefined>("");
  const [addressTitleEdit, setAddressTitleEdit] = useState<string | undefined>(
    ""
  );
  const [addressEdit, setAddressEdit] = useState<string | undefined>("");
  const [idEdit, setIdEdit] = useState<number | undefined>(0);
  const [idDelete, setIdDelete] = useState<number | undefined>(0);

  const defaultEmail = context.user?.email;
  const defaultPhone = context.user?.phone;
  const defaultPassword = "";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [showPopUpEdit, setShowPopUpEdit] = useState<boolean>(false);
  const [showPopUpDelete, setShowPopUpDelete] = useState<boolean>(false);
  const [showPopUpLogout, setShowPopUpLogout] = useState<boolean>(false);

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token) {
        setFormErrors({});
        const validationResult = schema.safeParse(editData);
        if (validationResult.success) {
          let payload: Edit = {
            name: context.user?.name!,
            phone: editData.phone,
            email: editData.email,
          };

          // Include password and confirm_password if they are not null, undefined, or empty strings
          if (
            editData.password &&
            editData.confirm_password &&
            editData.password !== "" &&
            editData.confirm_password !== ""
          ) {
            payload.password = editData.password;
            payload.confirm_password = editData.confirm_password;
          }
          const response = await updateWithJson(
            "auth/edit",
            payload,
            context.token
          );
          toastSuccess(response.data.message);
          window.location.reload();
        } else {
          const errors: Record<string, string> = {};
          validationResult.error.errors.forEach((error) => {
            const field = error.path[0];
            errors[field] = error.message;
          });
          setFormErrors(errors);
        }
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token) {
        const response = await postWithCredentialsJson(
          "address",
          {
            title: addressTitle,
            location: address,
          },
          context.token
        );
        toastSuccess(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoadingButton(false);
      window.location.reload();
    }
  };

  const handleEditAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token) {
        const response = await updateWithJson(
          `address/${idEdit}`,
          {
            title: addressTitleEdit,
            location: addressEdit,
          },
          context.token
        );
        toastSuccess(response.data.message);
        setShowPopUpEdit(false);
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoadingButton(false);
      window.location.reload();
    }
  };

  const handleDeleteAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token) {
        const response = await deleteWithCredentials(
          `address/${idDelete}`,
          context.token
        );
        toastSuccess(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoadingButton(false);
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (context.token) {
        // const response = await PostWithCredentials("auth/logout", context.token);
        Cookies.remove("Authorization");
        context.updateUserandToken(null, null);
        toastSuccess("User logged out successfully");
        router.push("/");
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (context.user !== undefined) {
      setEditData({ email: context.user?.email, phone: context.user?.phone });
      setIsLoading(false);
    }
  }, [context.user]);
  return (
    <>
      <LoadingPage isLoad={isLoading} />
      <Modal
        visible={showPopUp}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => {
          setShowPopUp(false);
        }}
      >
        <div>
          <form
            onSubmit={(e) => handleAddAddress(e)}
            className="flex flex-col gap-5 lg:gap-7"
          >
            <Field
              id="addressName"
              type={"field"}
              placeholder={"Ex: Rumah"}
              useLabel
              labelText="Address Name"
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(val) => setAddressTitle(val.target.value)}
              required
            />
            <Field
              id="address"
              type={"area"}
              placeholder={"Type your address here"}
              useLabel
              labelText="Address"
              guideText="Ex: Jl. Gelap Nyawang no. 45, RT 5, RW 10, Lebak Gede, Coblong, Kota Bandung"
              guideStyle="text-dark-maintext text-[12px] lg:text-[14px]"
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChangeArea={(val) => setAddress(val.target.value)}
              required
            />
            <div className="lg:col-start-2">
              <Button type={"submit"} text="Save" isLoading={isLoadingButton} />
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        visible={showPopUpEdit}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpEdit(false)}
      >
        <div>
          <form
            onSubmit={(e) => handleEditAddress(e)}
            className="flex flex-col gap-5 lg:gap-7"
          >
            <Field
              id="AddressName"
              type={"field"}
              placeholder={"Ex: Rumah"}
              useLabel
              labelText="Address Name"
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(val) => setAddressTitleEdit(val.target.value)}
              required
              value={addressTitleEdit}
            />
            <Field
              id="address"
              type={"area"}
              placeholder={"Type your address here"}
              useLabel
              labelText="Address"
              guideText="Ex: Jl. Gelap Nyawang no. 45, RT 5, RW 10, Lebak Gede, Coblong, Kota Bandung"
              guideStyle="text-dark-maintext text-[12px] lg:text-[14px]"
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChangeArea={(val) => setAddressEdit(val.target.value)}
              required
              value={addressEdit}
            />
            <div className="lg:col-start-2">
              <Button type={"submit"} text="Save" isLoading={isLoadingButton} />
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        visible={showPopUpDelete}
        onClose={() => setShowPopUpDelete(false)}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
      >
        <div className="flex items-center justify-center text-[40px] mx-auto w-20 h-20 rounded-full text-red-secondary border-2 border-red-secotext-red-secondary">
          <FiTrash2 />
        </div>
        <h3 className="text-[24px] md:text-[28px] lg:text-[32px] text-center text-red-secondary mt-5 font-poppins font-bold">
          Are you sure?
        </h3>
        <p className="text-center text-dark-maintext mt-3 font-poppins">
          Do you really want to delete this item? <br /> This action cannot be
          undone
        </p>
        <form
          onSubmit={(e) => handleDeleteAddress(e)}
          className="w-full flex flex-col lg:flex-row gap-5 mt-5"
        >
          <div className="w-full lg:w-1/2">
            <Button
              type={"submit"}
              text="YES"
              color="red"
              isLoading={isLoadingButton}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <Button
              type={"button"}
              text="NO"
              onClick={() => setShowPopUpDelete(false)}
            />
          </div>
        </form>
      </Modal>
      <Modal
        visible={showPopUpLogout}
        onClose={() => setShowPopUpLogout(false)}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
      >
        <div className="flex items-center justify-center text-[40px] mx-auto w-20 h-20 rounded-full text-red-secondary border-2 border-red-secotext-red-secondary">
          <IoIosLogOut />
        </div>
        <h3 className="text-[24px] md:text-[28px] lg:text-[32px] text-center text-red-secondary mt-5 font-poppins font-bold">
          Are you sure you want to Logout?
        </h3>
        <div className="w-full flex flex-col lg:flex-row gap-5 mt-5">
          <div className="w-full lg:w-1/2">
            <Button
              type={"button"}
              text="YES"
              color="red"
              isLoading={isLoadingButton}
              onClick={handleLogout}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <Button
              type={"button"}
              text="NO"
              onClick={() => setShowPopUpLogout(false)}
            />
          </div>
        </div>
      </Modal>
      <div className="w-full min-h-screen pt-[108px] pb-[60px] lg:pt-[140px] px-[4%] lg:px-[88px] bg-white">
        <div
          className="lg:hidden fixed top-5 right-4 cursor-pointer text-[40px] text-red-secondary"
          style={{ zIndex: 51 }}
          onClick={() => setShowPopUpLogout(true)}
        >
          <IoIosLogOut />
        </div>
        <form
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          onSubmit={(e) => handleEditProfile(e)}
          className=""
        >
          <div className="w-full flex flex-col lg:flex-row justify-between gap-10 lg:gap-[78px] xl:gap-[156px]">
            <div className="flex flex-col gap-5 lg:gap-7 grow">
              <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mb-2 leading-none">
                MY PROFILE
              </h1>
              <Field
                id="email"
                type={"edit"}
                placeholder={"Type your email here"}
                value={editData.email}
                useLabel
                labelText="Email"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(e) => setEditData({ email: e.target.value })}
                invalidMessage={formErrors?.email}
              />
              <Field
                id="number"
                type={"edit"}
                placeholder={"Type your number here"}
                value={editData.phone}
                useLabel
                labelText="Telephone Number"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(e) => setEditData({ phone: e.target.value })}
                invalidMessage={formErrors?.phone}
              />
              <Field
                id="password"
                type={"edit-password"}
                placeholder={"Type your new password here"}
                useLabel
                labelText="Password"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(e) => setEditData({ password: e.target.value })}
                invalidMessage={formErrors?.password}
              />
              <Field
                id="confirm"
                type={"password"}
                placeholder={"Type your password again"}
                useLabel
                labelText="Confirm Password"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(e) =>
                  setEditData({ confirm_password: e.target.value })
                }
                invalidMessage={formErrors?.confirm_password}
              />
              <div
                className={`${editData.password != defaultPassword || editData.email != defaultEmail || editData.phone != defaultPhone ? "block lg:hidden" : "hidden"} w-full`}
              >
                <Button
                  type={"submit"}
                  text="Save Changes"
                  isLoading={isLoadingButton}
                />
              </div>
            </div>
            <div className="w-full lg:w-[45%] lg:max-w-[504px] flex flex-col gap-2 lg:gap-4">
              <div className="flex justify-between">
                <p className="text-dark-maintext font-poppins font-medium text-[14px] md:text-[18px]">
                  {context.user?.addresses != undefined &&
                    (context.user?.addresses.length > 1
                      ? "Addresses"
                      : "Address")}
                </p>
                <Button
                  type={"button"}
                  text="Add Address"
                  shape="rounded-small"
                  fitContent
                  onClick={() => setShowPopUp(true)}
                />
              </div>
              {context.user?.addresses?.map((item: any, idx: number) => {
                return (
                  <Address
                    key={item.ID}
                    id={item.ID}
                    number={idx + 1}
                    name={item.title}
                    address={item.location}
                    postCode={""}
                    throwValueEdit={(id, title, defaultAddress, show) => {
                      setIdEdit(id);
                      setAddressTitleEdit(title);
                      setAddressEdit(defaultAddress);
                      setShowPopUpEdit(show);
                    }}
                    throwValueDelete={(id, showDelete) => {
                      setIdDelete(id);
                      setShowPopUpDelete(showDelete);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex justify-between gap-10 lg:gap-[78px] xl:gap-[156px] mt-6">
            <div
              className={`text-red-secondary hidden lg:flex text-[36px] items-center gap-4 cursor-pointer h-fit`}
              onClick={() => setShowPopUpLogout(true)}
            >
              <IoIosLogOut />
              <p className="text-[16px] lg:text-[20px] font-medium">Logout</p>
            </div>
            <div
              className={`${editData.password != defaultPassword || editData.email != defaultEmail || editData.phone != defaultPhone ? "hidden lg:block" : "hidden"} w-[45%] max-w-[504px] order-first lg:order-last`}
            >
              <Button
                type={"submit"}
                text="Save Changes"
                isLoading={isLoadingButton}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
