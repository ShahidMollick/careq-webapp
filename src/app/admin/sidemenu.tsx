"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LogOut,
  Settings,
  User,
  Calendar,
  Clipboard,
  Home,
  UsersRound,
  Stethoscope,
} from "lucide-react"; // Import Lucid icons
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Import Dialog components
import { useState } from "react";

interface SidebarItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      variant="ghost"
      className={`flex justify-start px-2 py-[6px] w-full ${
        isActive ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <Link href={href} passHref>
        <div className="dashboardIcons flex items-center">
          {icon}
          <p className="text-white text-sm ">{label}</p>
        </div>
      </Link>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-[250px] justify-between px-2 py-4 pb-6 flex flex-col gap-8 ">
      <div className="flex flex-col gap-8 ">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-row items-center">
            <Image
              src="/circle-logo.svg"
              alt="icon"
              className="mr-2"
              width={28}
              height={28}
            />
            <div className=" text-white font-black text-2xl">
              Care<span className="text-2xl text-primary">Q</span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <LogOut size={24} className="text-white font-bold" />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to log out?</DialogTitle>
                <DialogDescription>
                  You will be signed out and returned to the login page. Any
                  unsaved work might be lost.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Link href="/" passHref>
                  <Button variant="destructive">Log out</Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Menu options */}
        <div className="flex flex-col w-full">
          <SidebarItem
            href="/admin"
            icon={<Home size={24} className="text-white" />}
            label="Dashboard"
          />

          <div className="text-[13px] cursor-default text-white text-opacity-70 font-bold my-2 ">
            Patient Management
          </div>

          <SidebarItem
            href="/admin/queue"
            icon={<UsersRound size={24} className="text-white" />}
            label="My Queue"
          />
          <SidebarItem
            href="/admin/appointments"
            icon={<Stethoscope size={24} className="text-white" />}
            label="All Appointments"
          />
          <SidebarItem
            href="/admin/followUp"
            icon={<Calendar size={24} className="text-white" />}
            label="Follow Up Patients"
          />
          <div className="text-[13px] cursor-default text-white text-opacity-70 font-bold my-2 ">
            Staff Management
          </div>
          <SidebarItem
            href="/admin/doctor"
            icon={<Calendar size={24} className="text-white" />}
            label="Doctor"
          />
          <SidebarItem
            href="/admin/receptionist"
            icon={<Calendar size={24} className="text-white" />}
            label="Receptionist"
          />
        </div>
      </div>
      <div>
        <Separator className="bg-white bg-opacity-20 mb-2" />
        <SidebarItem
          href="/admin/setting"
          icon={<Settings size={24} className="text-white" />}
          label="Settings"
        />
      </div>
    </div>
  );
};

export default Sidebar;