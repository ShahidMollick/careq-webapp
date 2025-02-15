"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChartLine } from "lucide-react";
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
      className={`flex justify-start items-center p-2 ${
        isActive ? "bg-white/10" : "hover:bg-white/5"
      }`}
      size="icon"
    >
      <Link href={href} passHref>
        <div className="flex justify-center items-center">
          {icon}
        </div>
      </Link>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-[70px] justify-between align-middle items-center px-2 py-4 pb-6 flex flex-col gap-8 ">
      <div className="flex flex-col gap-8 ">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-row items-center">
            <Image
              src="/circle-logo.svg"
              alt="icon"
              className="mr-2"
              width={32}
              height={32}
            />
          </div>
        </div>

        {/* Menu options */}
        <div className="flex flex-col w-full">
          <SidebarItem
            href="/admin"
            icon={<Home width={32} height={32} className="text-white w-full" />}
            label=""
          />
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"ghost"} size="icon" >
            <LogOut size={32} className="text-white font-bold" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              You will be signed out and returned to the login page. Any unsaved
              work might be lost.
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
  );
};

export default Sidebar;
