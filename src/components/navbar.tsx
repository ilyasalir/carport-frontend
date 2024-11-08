"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
// import { postWithAuth } from "../api/api";
// import { toastError } from "./Toast";
import { usePathname } from "next/navigation";
import Link from "next/link";
// import LoadingPage from "./LoadingPage";
// import Logo from "/assets/logo.svg";
// import { UserContext } from "../Context/UserContext";
// import Cookies from "js-cookie";

import { MdOutlinePersonOutline } from "react-icons/md";
import { UserContext } from "@/lib/context/user-context";
import Button from "./button";
import { sendGTMEvent } from "@next/third-parties/google";

function Navbar() {
  const { user } = useContext(UserContext);

  const [navOpen, setNavOpen] = useState(false);
  const [stickyClass, setStickyClass] = useState("absolute bg-white");
  const [isAccount, setAccount] = useState(false);
  const location = usePathname();
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (location == "/") {
      setActive(0);
    } else if (location.includes("/my-car")) {
      setActive(1);
    } else if (location == "/booking") {
      setActive(2);
    } else if (location == "/about-us") {
      setActive(3);
    } else if (location == "/profile") {
      setActive(4);
    } else if (location == "/article-site") {
      setActive(5);
    } else {
      setActive(-1);
    }
  }, [location]);

  const stickNavbar = () => {
    const header = document.querySelector("nav");
    if (header != null) {
      window.scrollY > header.offsetTop
        ? setStickyClass("fixed bg-white bg-opacity-60 backdrop-blur-sm")
        : setStickyClass("absolute bg-white");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);

    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  //   const navigator = useNavigate();
  //   const logout = async () => {
  //     setIsLoading(true);
  //     try {
  //       await postWithAuth("logout", null, user?.token ?? "");
  //     } catch (error) {
  //       toastError((error as any).response.data.meta.message as string);
  //     } finally {
  //       Cookies.remove("access_token");
  //       navigator("/login");
  //       setIsLoading(false);
  //     }
  //   };

  return (
    <>
      {/* <LoadingPage isLoad={isLoading} /> */}
      <nav
        className={`${navOpen ? "fixed bg-white" : stickyClass} z-50 flex h-[80px] lg:h-[120px] w-full items-center justify-between text-dark-maintext px-4 lg:px-14 font-poppins`}
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
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl bg-black duration-300 ease-in-out`}
          ></span>
          <span
            id="span2"
            className={`${
              navOpen ? "h-[2px] scale-0 transition" : "top-[1.2em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl bg-black duration-300 ease-in-out`}
          ></span>
          <span
            id="span3"
            className={`${
              navOpen
                ? "top-[1.2em] h-[2px] rotate-45 transition"
                : "top-[1.7em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl bg-black duration-300 ease-in-out`}
          ></span>
        </button>
        <div className="flex items-end w-full justify-between">
          <Link href="/" className="mx-auto lg:mx-0 flex items-center">
          <img src={"/assets/logo.svg"} alt="Carport" />
        </Link>
        <div
          className={`${
            navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${user ? "pt-20" : "pt-20"} absolute left-0 top-0 h-screen w-[70%] sm:w-[50%] md:w-[40%] bg-white shadow-lg duration-300 ease-in-out lg:static lg:block lg:h-auto lg:w-auto lg:bg-transparent lg:pt-0 lg:shadow-none`}
        >
          {user ? (
            <div className="flex flex-col gap-4 px-7 lg:mt-0 lg:flex-row lg:items-start lg:gap-12 xl:gap-[72px] lg:px-0">
              <div className="flex flex-col w-min group">
                <Link
                  href="/"
                  className={`${
                    active == 0 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  Home
                </Link>
                <div
                  className={`${active == 0 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/my-car"
                  className={`${
                    active == 1 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  My Car
                </Link>
                <div
                  className={`${active == 1 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/booking"
                  className={`${
                    active == 2 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  Booking
                </Link>
                <div
                  className={`${active == 2 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/about-us"
                  className={`${
                    active == 3 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  About Us
                </Link>
                <div
                  className={`${active == 3 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/article-site"
                  className={`${
                    active == 5 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  Articles
                </Link>
                <div
                  className={`${active == 5 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group lg:hidden">
                <Link
                  href="/profile"
                  className={`${
                    active == 4 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  My Profile
                </Link>
                <div
                  className={`${active == 4 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className={`hidden w-min group lg:block group`}>
                <Link
                  href="/profile"
                  className={`${
                    active == 4
                      ? "font-bold text-yellow-secondary"
                      : "font-medium text-dark-maintext"
                  } text-[24px] lg:text-[30px] group-hover:font-bold group-hover:text-yellow-secondary truncate z-10`}
                >
                  <MdOutlinePersonOutline />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-7 md:gap-5 lg:mt-0 lg:flex-row lg:items-center lg:justify-between xl:gap-[48px] lg:px-0">
              <div className="flex flex-col w-min group">
                <Link
                  href="/"
                  className={`${
                    active == 0 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  Home
                </Link>
                <div
                  className={`${active == 0 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/login"
                  className={`${
                    active == 1 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  My Car
                </Link>
                <div
                  className={`${active == 1 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/login"
                  className={`${
                    active == 2 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  Booking
                </Link>
                <div
                  className={`${active == 2 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/about-us"
                  className={`${
                    active == 3 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  About Us
                </Link>
                <div
                  className={`${active == 3 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href="/article-site"
                  className={`${
                    active == 5 ? "font-bold" : "font-medium"
                  } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
                >
                  Articles
                </Link>
                <div
                  className={`${active == 5 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
              <div className="flex flex-col w-min group">
                <Link
                  href=""
                  className={`text-[16px] lg:text-[20px] group-hover:font-bold truncate font-medium`}
                  onClick={() => {
                    sendGTMEvent({ event: 'buttonClicked', value: 'xyz' });
                    window.open("https://wa.link/2mqnx8");
                  }}
                >
                  Book Now
                </Link>
                <div
                  className={`${active == 9 ? "scale-100" : "scale-0"} h-1 bg-yellow-secondary ease-in-out duration-300`}
                ></div>
              </div>
            </div>
          )}
        </div>
        </div>
        
      </nav>
      <div
        className={`${navOpen ? "block lg:hidden" : "hidden"} fixed z-10 bg-black h-screen w-full opacity-50`}
      ></div>
    </>
  );
}

export default Navbar;
