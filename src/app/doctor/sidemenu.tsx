"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings, User, Calendar, Clipboard, Home } from "lucide-react"; // Import Lucid icons
interface SidebarItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
}
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
        <div className="flex items-center justify-between  gap-2">
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

          <Link href="/" passHref>
            <Button variant={"ghost"} size={"icon"}>
              <LogOut size={24} className="text-white font-bold"></LogOut>
            </Button>
          </Link>
        </div>
        {/* menu options */}
        <div className="flex flex-col w-full">
          <SidebarItem
            href="/doctor"
            icon={<Home size={24} className="text-white" />}
            label="Dashboard"
          />

          <div className="text-[13px] cursor-default text-white text-opacity-70 font-bold my-2 ">
            Patient Management
          </div>

          <SidebarItem
            href="/doctor/queue"
            icon={<Calendar size={24} className="text-white" />}
            label="My Queue"
          />
          <SidebarItem
            href="/doctor/appointments"
            icon={<Clipboard size={24} className="text-white" />}
            label="All Appointments"
          />
          <SidebarItem
            href="/doctor/followUp"
            icon={<User size={24} className="text-white" />}
            label="Follow Up Patients"
          />

        
        </div>
      </div>
      <div>
        <Separator className="bg-white bg-opacity-20 mb-2"></Separator>
      <SidebarItem
        href="/doctor/setting"
        icon={<Settings size={24} className="text-white" />}
        label="Settings"
      />
      </div>
      
    </div>
  );
};

export default Sidebar;
