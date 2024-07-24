"use client";

import Button from "@/components/button";
import Field from "@/components/field";
import { toastSuccess, toastError } from "@/components/toast";
import { get, postWithFormOnly } from "@/lib/api";
import { format, parse } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { z } from "zod";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FileRejection, FileWithPath } from "react-dropzone";
import { RegisterContext } from "@/lib/context/register-context";
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from "../../../../firebase";
import Modal from "@/components/modal";
import { PopUpContext } from "@/lib/context/popup-order-context";
import { IoLogoGoogle } from "react-icons/io";

interface RegisterData {
  name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  phone?: string;
  date?: Date | undefined;
  time?: { value: string; label: string } | undefined;
}

function Register() {
  const { withAppointment, updateWithAppointment } =
    useContext(RegisterContext);
  const router = useRouter();
  const schema = z.object({
    name: z.string().min(3, "Please register using fullname"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .refine((data) => data === registerData.password, {
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

  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [googleUserData, setGoogleUserData] = useState<RegisterData>({name : "",
    email : "",
    password : "",
    confirm_password : "",
    phone : ""})

  const popUpContext = useContext(PopUpContext);

  const handleSetPhone = async () => {

    try {
      const minLength = 10;
      const maxLength = 15;
      const phoneFormat = /^08[0-9]{9,}$/;

      console.log("USER DATA : ", googleUserData)

      if (phone.length < minLength) {
        toastError("Invalid phone number: Too short");
        return;
      }

      if (phone.length > maxLength) {
        toastError("Invalid phone number: Too long");
        return;
      }

      if (!phoneFormat.test(phone)) {
        toastError("Please use 08XXXXXXXXXX format");
        return;
      }

      const response = await postWithFormOnly("auth/register", {
        name: googleUserData.name,
        email: googleUserData.email,
        password: googleUserData.password,
        confirm_password: googleUserData.confirm_password,
        phone: phone,
        role: "USER",
      });
      router.replace("/login");
      updateWithAppointment(false);
      toastSuccess(response.data.message);

    } catch (e) {
      toastError("Email Terdaftar Silahkan Login");
      router.replace("/login");
    }



  };

  const [registerData, setRegisterData] = useReducer(
    (prev: RegisterData, next: Partial<RegisterData>) => {
      return { ...prev, ...next };
    },
    {
      name: undefined,
      email: undefined,
      password: undefined,
      confirm_password: undefined,
      phone: undefined,
    }
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register button clicked");
    setIsLoading(true);
    try {
      setFormErrors({});
      const validationResult = schema.safeParse(registerData);
      let parsedTime = undefined;
      if (validationResult.success) {
        console.log("Validation success");
        if (registerData.date) {
          parsedTime = parse(
            registerData.time?.value!,
            "HH:mm",
            new Date(
              registerData.date!.getFullYear(),
              registerData.date!.getMonth(),
              registerData.date!.getDate()
            )
          );
        }
        const response = await postWithFormOnly("auth/register", {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          confirm_password: registerData.confirm_password,
          phone: registerData.phone,
          role: "USER"
        });
        router.replace("/login");
        updateWithAppointment(false);
        toastSuccess(response.data.message);
      } else {
        console.log("Validation errors", validationResult.error.errors);
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          const field = error.path[0];
          errors[field] = error.message;
        });
        setFormErrors(errors);
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
      console.error("Error during registration", error);
    } finally {
      setIsLoading(false);
    }
  };

  function RegisterGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        
        const userData : RegisterData = {
          name : user.displayName!,
          email : user.email!,
          password : user.uid,
          confirm_password : user.uid
        }

        setGoogleUserData(userData)

        console.log(user);
        setShowPopUp(true)
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <>
      <Modal
        visible={showPopUp || popUpContext.isOpen}
        width="w-[90%] md:w-[87.5%]"
        onClose={() => {
          popUpContext.updateIsOpen(true);
          setShowPopUp(true);
        }}
      >
        <div>
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mb-4">
            SET YOUR PHONE NUMBER
          </h1>
          <form
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7"
          >
            <Field
              id="number"
              type={"field"}
              placeholder={"Type your number here"}
              value={phone}
              useLabel
              labelText="Telephone Number"
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setPhone(e.target.value)}
              invalidMessage={formErrors?.phone}
            />
            <div className="mt-5 lg:mt-7 lg:col-start-2">
              <Button
                type={"button"}
                onClick={() => handleSetPhone()}

                text="Register"
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>
      </Modal>
      <div className="font-poppins flex min-h-screen w-screen bg-gradient-to-bl from-black from-[10%] to-[#D9D9D9] justify-center items-center px-[7.5%] py-14 lg:py-0">
        <form
          onSubmit={(e) => handleRegister(e)}
          className="bg-white px-[7.362%] lg:px-[44px] pt-[8.589%] lg:pt-2 pb-[6.748%] lg:pb-4 w-full rounded-[30px]"
        >
          <h1 className="text-dark-maintext text-[24px] lg:text-[48px] font-semibold mb-5 lg:mb-3">
            Register{" "}
          </h1>

          <div className="w-full h-fit px-[2px]"></div>
          <div className="w-full h-fit px-[2px]">
            <div className=" flex flex-col gap-6 ">
              <div className="flex flex-col gap-6 w-full">
                <Field
                  id="name"
                  type={"field"}
                  placeholder={"Type your name here"}
                  useLabel
                  labelText="Name"
                  labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                  value={registerData.name ? registerData.name : undefined}
                  onChange={(val) =>
                    setRegisterData({ name: val.target.value })
                  }
                  invalidMessage={formErrors?.name}
                  required
                />
                <Field
                  id="email"
                  type={"email"}
                  placeholder={"Type your email here"}
                  useLabel
                  labelText="Email"
                  labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                  value={registerData.email ? registerData.email : undefined}
                  onChange={(val) =>
                    setRegisterData({ email: val.target.value })
                  }
                  invalidMessage={formErrors?.email}
                  required
                />
                <Field
                  id="number"
                  type={"field"}
                  placeholder={"Ex: 0811123939"}
                  useLabel
                  labelText="Telephone Number"
                  labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                  value={registerData.phone ? registerData.phone : undefined}
                  onChange={(val) =>
                    setRegisterData({ phone: val.target.value })
                  }
                  invalidMessage={formErrors?.phone}
                  required
                />
                <div className="w-full flex flex-col gap-5 lg:gap-7">
                  <Field
                    id="password"
                    type={"password"}
                    placeholder={"Type your password here"}
                    useLabel
                    labelText="Password"
                    labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                    value={
                      registerData.password ? registerData.password : undefined
                    }
                    onChange={(val) =>
                      setRegisterData({ password: val.target.value })
                    }
                    invalidMessage={formErrors?.password}
                    required
                  />
                  <Field
                    id="confirm"
                    type={"password"}
                    placeholder={"Type your password again"}
                    useLabel
                    labelText="Confirm Password"
                    labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                    value={
                      registerData.confirm_password
                        ? registerData.confirm_password
                        : undefined
                    }
                    onChange={(val) =>
                      setRegisterData({ confirm_password: val.target.value })
                    }
                    invalidMessage={formErrors?.confirm_password}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-6 w-full mt-6 lg:mt-2">
            <div className="flex flex-col lg:gap-4 w-full">
              <div className="w-full flex flex-col gap-2 lg:gap-4">
                <Button type={"submit"} text="Register" isLoading={isLoading} />
                <Button
                  type={"button"}
                  text="Register with Google"
                  icon={<IoLogoGoogle/>} iconPosition="left" color="hollow"
                  isLoading={isLoading}
                  onClick={() => RegisterGoogle()}
                />
              </div>
              <p className="text-gray-subtext text-center text-[12px] lg:text-[16px]">
                Already have an account?{" "}
                <span className="text-blue-secondary font-semibold">
                  <Link href="/login">Sign In</Link>
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
