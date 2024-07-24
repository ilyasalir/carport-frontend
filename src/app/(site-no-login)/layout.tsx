"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { toastError } from "@/components/toast";
import { UserContext } from "@/lib/context/user-context";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(UserContext);
  const router = useRouter()

  useEffect(() => {
    if (context.loading == false) {
      if (context.user) {
        if (context.user.role == "ADMIN") {
          router.push("/order-list");
        }
      }
    }
  }, [context.loading]);
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
