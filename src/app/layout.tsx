import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import './layout.css';
import { ComboboxDemo } from "@/components/ui/combobox";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-screen overflow-hidden antialiased`}
      >
        <div className="flex flex-row h-full">
          <div className="left-menu">
          <Image src="/circle-logo.svg" alt="icon" width={45} height={45} />

          <Link href="/dashboard" passHref>
            <Image
              src="/dashboard.svg"
              alt="logo"
              width={45}
              height={45}
              className="icon"
            />
          </Link>
          <Link href="/appointment" passHref>
            {" "}
            <Image
              src="/appointmentIcon.svg"
              alt="logo"
              width={45}
              height={45}
              className="icon"
            />{" "}
          </Link>
          </div>
          <div className="flex flex-col w-full">
          <div className="nav-bar item-center">
          <div className="text-xl font-bold">Appointment Management</div>
          <div className="right">
            <div className="clinic-option">
              <ComboboxDemo />
              <Image src="/bell.svg" alt="bell" width={30} height={30} />
            </div>
            <div className="doctor-profile">
              <Image src="/doctor.svg" alt="doctor" width={40} height={40} />
              <div className="doctor-name">
                <p>Dr. John Doe</p>
                <p>Doctor</p>
              </div>
            </div>
          </div>
        </div>
        <div>{children}</div>
          
          </div>
          
        </div>
      </body>
    </html>
  );
}
