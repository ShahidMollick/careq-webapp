"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
}
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      variant="ghost"
      className={`flex justify-start p-4 w-full ${
        isActive ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <Link href={href} passHref>
        <div className="dashboardIcons flex items-center">
          {icon}
          <p className="text-white text-sm ml-3">{label}</p>
        </div>
      </Link>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className=" flex flex-col gap-8 w-fit mr-4 justify-start">
      <div className="flex flex-col gap-8 ">
        
        <div className="flex flex-col gap-2 w-full">
          <SidebarItem
            href="/doctor"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.5 2.08984C9.35397 2.08984 6.80359 4.64022 6.80359 7.78627C6.80359 10.3837 8.54197 12.575 10.9187 13.2604C9.04241 13.489 7.43306 14.1527 6.2207 15.3475C4.67769 16.8681 3.89648 19.132 3.89648 22.0862C3.89648 22.4984 4.23067 22.8326 4.64291 22.8326C5.05515 22.8326 5.38934 22.4984 5.38934 22.0862C5.38934 19.3833 6.10094 17.5615 7.26858 16.4107C8.43843 15.2578 10.1849 14.6613 12.4999 14.6613C14.815 14.6613 16.5615 15.2578 17.7314 16.4108C18.8991 17.5615 19.6107 19.3833 19.6107 22.0862C19.6107 22.4984 19.9448 22.8326 20.3571 22.8326C20.7693 22.8326 21.1035 22.4984 21.1035 22.0862C21.1036 19.132 20.3223 16.8681 18.7793 15.3475C17.5669 14.1527 15.9576 13.489 14.0813 13.2604C16.458 12.575 18.1964 10.3837 18.1964 7.78627C18.1964 4.64022 15.6461 2.08984 12.5 2.08984ZM8.29645 7.78627C8.29645 5.4647 10.1784 3.5827 12.5 3.5827C14.8216 3.5827 16.7036 5.4647 16.7036 7.78627C16.7036 10.1078 14.8216 11.9898 12.5 11.9898C10.1784 11.9898 8.29645 10.1078 8.29645 7.78627Z"
                  fill="white"
                />
              </svg>
            }
            label="Dashboard"
          />
          
        </div>
      </div>

      
    </div>
  );
};

export default Sidebar;
