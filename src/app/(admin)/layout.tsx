"use client";

import Footer from "@/components/footer";
import NavbarAdmin from "@/components/navbar-admin";
import { toastError, toastSuccess } from "@/components/toast";
// import { getWithCredentials } from "@/lib/api";
import { UserContext } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(UserContext);
  const router = useRouter()
  // const getUser = async () => {
  //   try {
  //     const response = await getWithCredentials("auth");
  //     // console.log(response)
  //     const user = response.data.data as User;
  //     if (user) {
  //       if (user.role != "ADMIN") {
  //         toastError("You are not authorized!");
  //         redirect("/");
  //       }
  //     } else {
  //       toastError("Please login first!");
  //       redirect("/login");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getUser();
  // }, []);

  useEffect(() => {
    if (context.loading == false) {
      if (context.user && context.token && context.token != "") {
        if (context.user.role != "ADMIN") {
          toastError("You are not authorized!");
          router.push("/");
        }
      } else {
        toastError("Please login first!");
        router.push("/login");
      }
    }
  }, [context.loading]);

  if (!context.user || !context.token || context.token == "" || context.user.role != "ADMIN") {
    return null;
  }

  return (
    <div>
      <NavbarAdmin>
        {children}
      </NavbarAdmin>
    </div>
  );
};

export default Layout;
