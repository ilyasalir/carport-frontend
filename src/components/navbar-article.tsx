"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdOutlinePersonOutline } from "react-icons/md";
import { UserContext } from "@/lib/context/user-context";
import { get } from "@/lib/api";
import { useRouter } from "next/navigation";

function NavbarArticle() {
  const router = useRouter();

  const [navOpen, setNavOpen] = useState(false);
  const [stickyClass, setStickyClass] = useState("absolute bg-white");
  const [isAccount, setAccount] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = usePathname();
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [category, setCategory] = useState<Category[]>([]);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const documentRef = useRef<Document | null>(
    typeof document !== "undefined" ? document : null
  );

  const getCategory = async () => {
    try {
      const response = await get(`article/category`);
      const data = response.data?.data as Category[];
      setCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

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

    const targetElement = event.target as HTMLElement;

    // Check if the click is not on the category button
    if (
      cekHamburger &&
      !targetElement.closest(".dropdown-item") &&
      targetElement !== categoryButtonRef.current
    ) {
      setNavOpen(false);
    }
  };
  useEventListener("click", onClickHamburger, documentRef);

  useEffect(() => {
    if (location == "/article-site") {
      setActive(0);
      setActiveCategory(null); // No active category on the homepage
    } else if (location.includes("/article-site/category/")) {
      const categoryName = location.split("/").pop(); // Extract category name from URL
      setActive(1);
      setActiveCategory(categoryName || null);
    } else {
      setActive(-1);
      setActiveCategory(null);
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

  return (
    <>
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
        <Link href="/" className="mx-auto lg:mx-0">
          <img src={"/assets/logo.svg"} alt="Carport" />
        </Link>
        <div
          className={`${
            navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } pt-20 absolute left-0 top-0 h-screen w-[70%] sm:w-[50%] md:w-[40%] bg-white shadow-lg duration-300 ease-in-out lg:static lg:block lg:h-auto lg:w-auto lg:bg-transparent lg:pt-0 lg:shadow-none`}
        >
          <div className="flex flex-col gap-4 px-7 lg:mt-0 lg:flex-row lg:items-start lg:gap-12 xl:gap-[72px] lg:px-0">
            <div className="flex flex-col w-min group">
              <Link
                href="/article-site"
                className={`${
                  active == 0 ? "font-bold" : "font-medium"
                } text-[16px] lg:text-[20px] group-hover:font-bold truncate`}
              >
                Home
              </Link>
              <div
                className={`${
                  active == 0 ? "scale-100" : "scale-0"
                } h-1 bg-yellow-secondary ease-in-out duration-300`}
              ></div>
            </div>
            <div className="relative flex flex-col w-min group">
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                ref={categoryButtonRef}
                className={`${active == 1 ? "font-bold" : "font-medium"} text-[16px] lg:text-[20px] group-hover:font-bold truncate flex flex-row items-center`}
              >
                Category
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div
                className={`${
                  active == 1 ? "scale-100" : "scale-0"
                } h-1 bg-yellow-secondary ease-in-out duration-300`}
              ></div>
              <div
                id="dropdownNavbar"
                className="hidden bg-white text-base z-10 list-none divide-y divide-gray-100 rounded shadow my-4 w-44 max-h-60 overflow-y-auto"
              >
                <ul className="py-1" aria-labelledby="dropdownLargeButton">
                  {category.map((cat) => (
                    <li key={cat.ID}>
                      <a
                        href={`/article-site/category/${cat.name}`}
                        className={`${
                          activeCategory === cat.name
                            ? "font-bold"
                            : "font-medium"
                        } block px-4 py-2 text-dark-maintext hover:bg-gray-200 text-sm`}
                      >
                        {cat.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div
        className={`${navOpen ? "block lg:hidden" : "hidden"} fixed z-10 bg-black h-screen w-full opacity-50`}
      ></div>
      <script src="https://unpkg.com/@themesberg/flowbite@1.1.1/dist/flowbite.bundle.js"></script>
    </>
  );
}

export default NavbarArticle;
