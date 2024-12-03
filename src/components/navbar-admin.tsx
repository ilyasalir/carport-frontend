"use client";

import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEventListener } from "usehooks-ts";
import { UserContext } from "@/lib/context/user-context";
import { toastError, toastSuccess } from "./toast";
import Cookies from "js-cookie";
import {
  IoCalendarOutline,
  IoDocumentText,
  IoNewspaperOutline,
  IoNotifications,
  IoPersonCircle,
  IoPersonOutline,
} from "react-icons/io5";

interface NavbarProps {
  children?: ReactNode;
}

export default function NavbarAdmin({ children }: NavbarProps) {
  const router = useRouter();
  const context = useContext(UserContext);

  const [navOpen, setNavOpen] = useState(false);
  const [stickyClass, setStickyClass] = useState("absolute bg-black");
  const [isAccount, setAccount] = useState(false);
  const [user, setUser] = useState<boolean>(false);
  const location = usePathname();
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location == "/order-list") {
      setActive(0);
    } else if (location == "/schedule") {
      setActive(1);
    } else if (location == "/user-list") {
      setActive(2);
    } else if (location == "/request") {
      setActive(3);
    } else if (location == "/article") {
      setActive(4);
    } else if (location == "/inquiry") {
      setActive(5);
    } else {
      setActive(-1);
    }
  }, [location]);

  const documentRef = useRef<Document | null>(
    typeof document !== "undefined" ? document : null
  );
  const onClickAccount = (event: Event) => {
    let cekAccount = true;
    const doc = document.getElementsByClassName("account-detail");
    for (let index = 0; index < doc.length; index++) {
      cekAccount = cekAccount && event.target != doc[index];
    }
    if (cekAccount) {
      setAccount(false);
    }
  };
  useEventListener("click", onClickAccount, documentRef);
  const onClickHamburger = (event: Event) => {
    let cekHamburger = true;
    const doc = document.getElementsByClassName("hamburger");
    for (let index = 0; index < doc.length; index++) {
      cekHamburger = cekHamburger && event.target != doc[index];
    }
    if (cekHamburger) {
      setNavOpen(false);
    }
  };
  useEventListener("click", onClickHamburger, documentRef);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (context.token) {
        // const response = await PostWithCredentials("auth/logout", context.token);
        // console.log(response);
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

  const stickNavbar = () => {
    const header = document.querySelector("nav");
    if (header != null) {
      window.scrollY > header.offsetTop
        ? setStickyClass("fixed bg-black bg-opacity-80 backdrop-blur-sm")
        : setStickyClass("absolute bg-black");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);

    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  return (
    <div className="lg:flex w-screen min-h-screen lg:h-screen overflow-hidden relative">
      <div
        className={`${navOpen ? "fixed bg-black" : stickyClass} z-50 flex h-[80px] lg:hidden w-full items-center px-4 lg:px-14`}
      >
        <button
          type="button"
          className={`hamburger absolute z-10 h-[40px] w-[40px] cursor-pointer lg:hidden`}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span
            className={`${
              navOpen
                ? "top-[1.2em] h-[2px] rotate-[135deg] transition"
                : "top-[0.7em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl bg-white duration-300 ease-in-out`}
          ></span>
          <span
            id="span2"
            className={`${
              navOpen ? "h-[2px] scale-0 transition" : "top-[1.2em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl bg-white duration-300 ease-in-out`}
          ></span>
          <span
            id="span3"
            className={`${
              navOpen
                ? "top-[1.2em] h-[2px] rotate-45 transition"
                : "top-[1.7em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl bg-white duration-300 ease-in-out`}
          ></span>
        </button>
        <img
          src={"/assets/logo_white.svg"}
          alt="Carport"
          className={`${navOpen ? "hidden" : "block"} mx-auto lg:mx-0 w-[40%] max-w-fit object-contain`}
        />
      </div>
      <nav
        className={`${navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} z-40 ease-in-out duration-300 fixed lg:static font-poppins bg-black pt-[120px] lg:pt-[40px] pb-[80px] flex flex-col justify-between w-56 lg:w-[252px] lg:min-w-[252px] shadow-navbar h-screen overflow-y-auto scroll-hidden`}
      >
        <div className="flex flex-col gap-[24px]">
          <img
            src="/assets/logo_white.svg"
            alt="Logo Carport"
            className="mx-auto w-[60%] lg:w-fit object-contain mb-12 lg:mb-[76px]"
          />
          <div className="flex flex-col gap-[16px]">
            <Link
              href="/order-list"
              className={`${
                active == 0
                  ? "border-r-4 border-yellow-secondary text-yellow-secondary box-border"
                  : "text-white"
              } w-full font-medium text-[20px] lg:text-[24px] pl-[32px] lg:pl-[48px] py-4 hover:text-yellow-accent active:text-yellow-secondary hover:border-yellow-accent active:border-yellow-secondary flex items-center gap-4 cursor-pointer`}
            >
              <LuLayoutDashboard />
              <p className="text-[16px] lg:text-[20px]">Order List</p>
            </Link>
            <Link
              href="/schedule"
              className={`${
                active == 1
                  ? "border-r-4 border-yellow-secondary text-yellow-secondary box-border"
                  : "text-white"
              } w-full font-medium text-[20px] lg:text-[24px] pl-[32px] lg:pl-[48px] py-4 hover:text-yellow-accent active:text-yellow-secondary hover:border-yellow-accent active:border-yellow-secondary flex items-center gap-4 cursor-pointer`}
            >
              <IoCalendarOutline />
              <p className="text-[16px] lg:text-[20px]">Schedule</p>
            </Link>
            <Link
              href="/user-list"
              className={`${
                active == 2
                  ? "border-r-4 border-yellow-secondary text-yellow-secondary box-border"
                  : "text-white"
              } w-full font-medium text-[20px] lg:text-[24px] pl-[32px] lg:pl-[48px] py-4 hover:text-yellow-accent active:text-yellow-secondary hover:border-yellow-accent active:border-yellow-secondary flex items-center gap-4 cursor-pointer`}
            >
              <IoPersonOutline />
              <p className="text-[16px] lg:text-[20px]">User List</p>
            </Link>
            <Link
              href="/request"
              className={`${
                active == 3
                  ? "border-r-4 border-yellow-secondary text-yellow-secondary box-border"
                  : "text-white"
              } w-full font-medium text-[20px] lg:text-[24px] pl-[32px] lg:pl-[48px] py-4 hover:text-yellow-accent active:text-yellow-secondary hover:border-yellow-accent active:border-yellow-secondary flex items-center gap-4 cursor-pointer`}
            >
              <IoNotifications />
              <p className="text-[16px] lg:text-[20px]">Request STNK</p>
            </Link>
            <Link
              href="/article"
              className={`${
                active == 4
                  ? "border-r-4 border-yellow-secondary text-yellow-secondary box-border"
                  : "text-white"
              } w-full font-medium text-[20px] lg:text-[24px] pl-[32px] lg:pl-[48px] py-4 hover:text-yellow-accent active:text-yellow-secondary hover:border-yellow-accent active:border-yellow-secondary flex items-center gap-4 cursor-pointer`}
            >
              <IoNewspaperOutline />
              <p className="text-[16px] lg:text-[20px]">Article</p>
            </Link>
            <Link
              href="/inquiry"
              className={`${
                active == 5
                  ? "border-r-4 border-yellow-secondary text-yellow-secondary box-border"
                  : "text-white"
              } w-full font-medium text-[20px] lg:text-[24px] pl-[32px] lg:pl-[48px] py-4 hover:text-yellow-accent active:text-yellow-secondary hover:border-yellow-accent active:border-yellow-secondary flex items-center gap-4 cursor-pointer`}
            >
              <IoDocumentText />
              <p className="text-[16px] lg:text-[20px]">Inquiry</p>
            </Link>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-white text-[20px] lg:text-[24px] pt-[100px] lg:pt-[0px] pl-[32px] lg:pl-[48px] py-4 text-error flex items-center gap-4 cursor-pointer hover:text-red-secondary"
        >
          <IoIosLogOut />
          <p className="text-[16px] lg:text-[20px] font-medium">Logout</p>
        </button>
      </nav>
      <div
        className={`${navOpen ? "block lg:hidden" : "hidden"} fixed z-10 bg-black h-screen w-full opacity-50`}
      ></div>
      <div className="w-full lg:w-auto lg:grow lg:overflow-auto overflow-y-auto scroll-hidden">
        {children}
      </div>
    </div>
  );
}
