import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import UserProvider from "@/lib/context/user-context";
import DetailsProvider from "@/lib/context/details-context";
import RegisterProvider from "@/lib/context/register-context";
import PopUpProvider from "@/lib/context/popup-order-context";
import { GoogleAnalytics } from '@next/third-parties/google'

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-slab",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carport Euro",
  category: "Car Home Service",
  description:
    "Carport redefine the way you experience auto repair. Our mobile service is designed with you in mind, providing unmatched convenience and expertise. Discover how we bring the shop to your doorstep, making car maintenance and repairs a hassle-free experience.",
  icons: "./assets/icon.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="kN_UUw1Kgr3Hfd9zNpmi4MzaVLIHZkyxjJual_vpMTQ" />
      </head>
      <body className={`${poppins.variable} ${robotoSlab.variable}`}>
        <ToastContainer />
        <RegisterProvider>
          <DetailsProvider>
            <PopUpProvider>
              <UserProvider>{children}</UserProvider>
            </PopUpProvider>
          </DetailsProvider>
        </RegisterProvider>
      </body>
      <GoogleAnalytics gaId="G-W6T6LZKXES"/>
    </html>
  );
}
