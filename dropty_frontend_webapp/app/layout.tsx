import "./globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import { RuntimeEnvProvider } from "./runtime/RuntimeEnvProvider";
import PageReady from "@/components/LoaderFile";

/* ========= METADATA ========= */
export const metadata: Metadata = {
  title: "Dropty",
  description: "Smart home luggage check-in service",
  icons: {
    icon: "/favicon.ico",
  },
};

// Initialize Inter font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W7G8KZHQ');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>

      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W7G8KZHQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* 🔵 SPINNER (VISIBLE INITIALLY) */}
        <div id="global-loader">
          <div className="dot-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* 🔵 HANDLES window.onload */}
        <PageReady />

        {/* 🔴 APP CONTENT (HIDDEN INITIALLY) */}
        <div id="app-content" style={{ visibility: "hidden" }}>
          <RuntimeEnvProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" reverseOrder={false} />
            <Footer />
          </RuntimeEnvProvider>
        </div>
      </body>
    </html>
  );
}
