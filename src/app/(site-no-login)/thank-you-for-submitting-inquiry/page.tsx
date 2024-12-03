"use client";

import Button from "@/components/button";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Image from "next/image";

import { BsArrowRightCircle } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { RegisterContext } from "@/lib/context/register-context";
import { useContext, useEffect } from "react";
import { UserContext } from "@/lib/context/user-context";
import { PopUpContext } from "@/lib/context/popup-order-context";

export default function Home() {
  const { updateWithAppointment } = useContext(RegisterContext);
  const { updateIsOpen } = useContext(PopUpContext);
  const context = useContext(UserContext);
  const router = useRouter();
  const location = usePathname();

  useEffect(() => {
    if (location === "/") {
      updateWithAppointment(false);
    }
  }, [location]);
  return (
    <>
      <div className="w-full h-auto lg:h-screen bg-[url('/assets/quality.png')] bg-cover  bg-center relative overflow-hidden">
        <div className="bg-black bg-opacity-75 w-full h-full flex flex-col gap-5 lg:gap-10 justify-center pt-[120px] lg:pt-0 pb-[96px] lg:pb-0 px-[7.5%] lg:px-[92px]">
          <h1 className="text-white font-robotoSlab font-bold text-[24px] md:text-[40px] lg:text-[56px]">
            Thank You, <br /> For Submitting Inquiry, <br /> We Will Contact You Soon!
          </h1>
          <div className="">
            <Button
              type={"button"}
              text="Back To Home"
              color="yellow"
              shape="rounded-medium"
              fitContent={true}
              onClick={() => {
                router.push("/")
              }}
              // onClick={() => {
              //   if (context.user) {
              //     updateIsOpen(true);
              //     router.push("/booking");
              //   } else {
              //     updateWithAppointment(true);
              //     router.push("/register");
              //   }
              // }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
