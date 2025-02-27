import type { Metadata } from "next";
import { GetServerSideProps } from "next";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../layout.css";
import { ComboboxDemo } from "@/components/ui/clinic-select";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidemenu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Stringifier } from "postcss";
import path from "path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ParentComponent from './parent';

type Props = {
  pathname: string;
  children: React.ReactNode;
};

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CareQ",
  description: "Fikar Kyu jab h CareQ",
};

export default function DoctorLayout({
  pathname,
  children,
}: Readonly<{
  pathname: string;
  children: React.ReactNode;
}>) {
  const getActiveMenuName = (path: string) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/queue":
        return "My Queue";
      case "/appointment":
        return "Appointments";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard"; // Default case if no match
    }
  };

  return (
    <section>
      <div className="flex flex-row h-[100vh] gap-1 bg-secondary]">
        {/* Code for the Left menu */}

        <Sidebar></Sidebar>

        <div className="flex flex-col bg-gray-50 h-[100%] items-center justify-start rounded-xl w-[100%] border-b-gray-500 border-b-2">
          <div className=" bg-white w-[100%] rounded-tl-lg flex item-center justify-between px-4 py-1">
            <div className="font-bold flex items-center text-secondary text-xl">
              {getActiveMenuName(pathname)}
            </div>
            <div className="flex gap-6 items-center">
              <div className=" flex gap-6">
                <ComboboxDemo />
                <Image src="/bell.svg" alt="bell" width={20} height={20} />
              </div>
              <div className="flex mr-2 gap-2">
                <Image src="/doctor.svg" alt="doctor" width={40} height={40} />
                <DropdownMenu>
                  <DropdownMenuTrigger className=" p-1 px-2 flex gap-4 h-fit">
                    {" "}
                    <div className="flex justify-start h-full flex-col">
                      <div className="text-sm  font-semibold">Dr. John Doe</div>
                      <div className="text-sm text-start font-normal">
                        Doctor
                      </div>
                    </div>
                    <Image
                      src="/chevron-down.svg"
                      alt="down-arrow"
                      width={16}
                      height={16}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Doctor</DropdownMenuItem>
                    <DropdownMenuItem>Admin</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="h-[100%] w-full overflow-scroll">
			<ParentComponent>{children}</ParentComponent>
			</div>
        </div>
      </div>
    </section>
  );
}
