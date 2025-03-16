import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GetServerSideProps } from "next";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import DoctorHeader from "./DoctorHeader";
import "../globals.css";

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
import ClinicSetting from "./clinicSetting";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MailIcon, PhoneIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  title: "CareQ Queue Management System | Streamline Patient Flow",
  description:
    "Optimize your healthcare facility's patient flow with CareQ's advanced queue management system. Reduce wait times, improve patient satisfaction, and enhance operational efficiency in your clinic or hospital.",
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getActiveMenuName = (path: string) => {};

  return (
    <section className="h-screen overflow-hidden">
      <div className="flex flex-row h-full w-full gap-1 bg-secondary]">
        {/* Code for the Left menu */}
        <Sidebar></Sidebar>

        <div className="flex flex-col bg-gray-50 h-full items-center justify-start rounded-xl w-[100%] border-b-gray-500 border-b-2">
          <div className=" bg-white w-[100%] rounded-tl-lg flex item-center justify-between px-4 h-16 py-1">
            <div className="font-semibold flex items-center text-secondary text-lg">
              Queue Management
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex gap-6 items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      
                      className="text-sm font-medium"
                    >
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" strokeWidth='2.5' />
                      Contact Us
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-secondary">Contact Support</DialogTitle>
                      <DialogDescription>
                        Reach out to us for any assistance
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                      <div className="space-y-3">
                        <h3 className="font-medium">
                          Harsh Swami - Co-Founder
                        </h3>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                          <a
                            href="tel:+918158094184"
                            className="text-sm hover:underline"
                          >
                            +91 81580 94184
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                          <a
                            href="mailto:harshswami138@gmail.com"
                            className="text-sm hover:underline"
                          >
                            harshswami138@gmail.com
                          </a>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h3 className="font-medium">Shahid Mollick- Co-Founder</h3>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                          <a
                            href="tel:+919987179937"
                            className="text-sm hover:underline"
                          >
                            +91 99871 79937
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                          <a
                            href="mailto:jane@careq.com"
                            className="text-sm hover:underline"
                          >
                            shahidmollick13@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <ComboboxDemo />
                <ClinicSetting />
                {/* contact us dialog */}
              </div>
              <DoctorHeader />
            </div>
          </div>
          <div className=" h-full w-full overflow-hidden">{children}</div>
        </div>
      </div>
    </section>
  );
}
