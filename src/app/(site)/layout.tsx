"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { toastError } from "@/components/toast";
// import { getWithCredentials } from "@/lib/api";
import { UserContext } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (context.loading == false) {
      if (
        context.user == null ||
        context.token == null ||
        context.token == ""
      ) {
        toastError("Please login first!");
        router.push("/login");
      }
      if (context.user) {
        if (context.user.role == "ADMIN") {
          router.push("/order-list");
        }
      }
    }
  }, [context.loading]);

  if (!context.user || !context.token || context.token == "" || context.user.role == "ADMIN") {
    return null;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
