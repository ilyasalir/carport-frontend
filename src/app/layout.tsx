import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import UserProvider from "@/lib/context/user-context";
import DetailsProvider from "@/lib/context/details-context";
import RegisterProvider from "@/lib/context/register-context";
import PopUpProvider from "@/lib/context/popup-order-context";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

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
  icons: "https://carporteuro.com/assets/icon.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="kN_UUw1Kgr3Hfd9zNpmi4MzaVLIHZkyxjJual_vpMTQ"
        />
      </head>
      <GoogleTagManager gtmId="GTM-5S5RPCNS" />
      <body className={`${poppins.variable} ${robotoSlab.variable}`}>
        <ToastContainer />
        <RegisterProvider>
          <DetailsProvider>
            <PopUpProvider>
              <UserProvider>{children}</UserProvider>
            </PopUpProvider>
          </DetailsProvider>
        </RegisterProvider>
        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '565828969135647');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=565828969135647&ev=PageView&noscript=1"
          />
        </noscript>

      </body>
      <GoogleAnalytics gaId="G-W6T6LZKXES" />
    </html>
  );
}
