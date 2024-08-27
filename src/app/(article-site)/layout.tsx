"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import NavbarArticle from "@/components/navbar-article";
import { toastError } from "@/components/toast";
import { UserContext } from "@/lib/context/user-context";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavbarArticle />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
