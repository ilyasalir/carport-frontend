"use client";

import Button from "@/components/button";
import Field from "@/components/field";
import { IoLogoGoogle } from "react-icons/io";
import { toastSuccess, toastError } from "@/components/toast";
import { getWithCredentials, postWithJson } from "@/lib/api";
import React, { useContext, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/context/user-context";
import Cookies from "js-cookie";
import { z } from "zod";
import { RegisterContext } from "@/lib/context/register-context";
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from "../../../../firebase";

function Login() {
  const router = useRouter();
  const {updateWithAppointment} = useContext(RegisterContext)
  const context = useContext(UserContext);
  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string(),
  });
  const [loginData, setLoginData] = useReducer(
    (
      prev: { email: string; password: string },
      next: Partial<{ email: string; password: string }>
    ) => {
      return { ...prev, ...next };
    },
    {
      email: "",
      password: "",
    }
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setFormErrors({});
      const validationResult = schema.safeParse(loginData);

      if (validationResult.success) {
        const response = await postWithJson("auth/login", {
          email: loginData.email,
          password: loginData.password,
        });
        const access_token = response?.data.token;
        const res = await getWithCredentials("auth", access_token);
        Cookies.set("Authorization", access_token, { expires: 7 });
        const dataUser = res.data.data as User;
        context.updateUserandToken(dataUser, access_token);
        toastSuccess(response.data.message);
        if (dataUser.role == "ADMIN") {
          router.replace("/order-list");
        } else {
          router.replace("/");
        }
      } else {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          const field = error.path[0];
          errors[field] = error.message;
        });
        setFormErrors(errors);
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    } finally {
      setIsLoading(false);
    }

  };

  function LoginGoogle (){
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then(async(result) =>  {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user)
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        const response = await postWithJson("auth/logingoogle", {
          email: user.email,
        });
        const access_token = response?.data.token;
        const res = await getWithCredentials("auth", access_token);
        Cookies.set("Authorization", access_token, { expires: 7 });
        const dataUser = res.data.data as User;
        context.updateUserandToken(dataUser, access_token);
        toastSuccess(response.data.message);
        if (dataUser.role == "ADMIN") {
          router.replace("/order-list");
        } else {
          router.replace("/");
        }
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = toastError("Email tidak ditemukan, Silahkan Register");
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    }
  
  return (
    <div className="font-poppins flex min-h-screen w-screen bg-gradient-to-bl from-black from-[10%] to-[#D9D9D9] justify-center lg:justify-end px-[7.5%] py-16 lg:py-0 overflow-hidden relative">
      <img
        src="/assets/bg_car.svg"
        alt="Car Picture"
        className="absolute my-auto top-0 bottom-0 xl:bottom-[17.5%] lg:right-[49%] object-contain min-w-[135%] lg:min-w-0 lg:w-[68%]"
      />
      <form
        onSubmit={(e) => handleLogin(e)}
        className="bg-white px-[7.362%] lg:px-12 pt-[8.589%] lg:pt-14 pb-[16.564%] lg:pb-[108px] flex flex-col gap-14 lg:gap-16 lg:max-w-[652px] w-[90%] lg:w-[52.5%] my-auto rounded-[30px] z-10 "
      >
        <div className="flex flex-col gap-5 lg:gap-7">
          <h1 className="text-dark-maintext text-[24px] lg:text-[48px] font-semibold">
            Sign In
          </h1>
          <Field
            id="email"
            type={"email"}
            placeholder={"Type your email here"}
            useLabel
            labelText="Email"
            labelStyle="font-semibold text-dark-maintext text-[14px] lg:text-[18px]"
            onChange={(val) => setLoginData({ email: val.target.value })}
            invalidMessage={formErrors?.email}
            required
          />
          <Field
            id="password"
            type={"password"}
            placeholder={"Type your password here"}
            useLabel
            labelText="Password"
            labelStyle="font-semibold text-dark-maintext text-[14px] lg:text-[18px]"
            onChange={(val) => setLoginData({ password: val.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2 lg:gap-4">
          <Button type={"submit"} text="Sign In" isLoading={isLoading} onClick={() => updateWithAppointment(false)}/>
          <Button type={"submit"} icon={<IoLogoGoogle/>} iconPosition="left" color="hollow" text="Sign In with Google" isLoading={isLoading} onClick={() => LoginGoogle()}/>
          <p className="text-gray-subtext text-center text-[12px] lg:text-[16px]">
            Don&apos;t have an account?{" "}
            <span className="text-blue-secondary font-semibold">
              <Link href="/register">Register</Link>
            </span>
          </p>
        </div>
        
      </form>
    </div>
  );
}

export default Login;
