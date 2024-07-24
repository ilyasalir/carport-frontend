// import Logo from "/assets/logo.svg";

import { MdOutlinePersonOutline } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { LuPhone } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { FaRegCopyright } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

function Footer() {
  return (
    <>
      <div className="bg-black text-white font-poppins w-full pt-9 pb-16 px-12 flex flex-col gap-7">
        <div className="flex flex-wrap lg:flex-nowrap gap-7 sm:gap-[15%] sm:gap-y-7 lg:gap-y-0 xl:gap-[20%]">
          <div className="w-full lg:w-fit h-fit">
            {" "}
            {/*picture*/}
            <img
              src="/assets/logo_white.svg"
              alt="Logo Carport"
              className="w-fit h-fit"
            />
          </div>
          <div className="flex flex-col gap-2 sm:shrink-0">
            {" "}
            {/*first element*/}
            <p className="text-[16px] font-bold text-white">Head Office</p>
            <div className="flex gap-3 text-[24px]">
              <GrLocation />
              <p className="text-[14px]">
                Bandung, Jawa Barat
              </p>
            </div>
            <div className="flex gap-3 text-[24px] items-center">
              <LuPhone />
              <p className="text-[14px]">+62 852 10924085</p>
            </div>
            <div className="flex gap-3 text-[24px] items-center">
              <MdOutlineEmail />
              <p className="text-[14px]">marketing@carporteuro.com</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:shrink-0">
            <p className="text-[16px] font-bold text-white">Get In Touch</p>
            <a
              href="https://www.instagram.com/carport.euro/"
              className="flex gap-3 text-[24px] items-center group cursor-pointer"
            >
              <FaInstagram />
              <p className="text-[14px] group-hover:text-yellow-secondary">@carport.euro</p>
            </a>
            <a 
              href="https://www.tiktok.com/@carport.euro"
              className="flex gap-3 text-[24px] items-center group cursor-pointer"
              >
                <img src="/assets/logo_tiktok.png" alt="Logo X" />
                <p className="text-[14px] group-hover:text-yellow-secondary">@carport.euro</p>
            </a>
          </div>
        </div>
        <div className="flex gap-3 text-[24px] items-center">
          <FaRegCopyright />
          <p className="text-[14px]">Carport All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}

export default Footer;
