"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";

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
    <div className="left-menu flex flex-col gap-8 w-full justify-start">
      <div className="flex flex-col gap-8 ">
        <div className="mainlogo flex items-center gap-2">
          <Image src="/circle-logo.svg" alt="icon" width={35} height={35} />
          <div className="carelogo text-white font-bold text-lg">
            Care<span className="qlogo">Q</span>
          </div>
        </div>
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
          <SidebarItem
            href="/doctor/queue"
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
            label="My Queue"
          />
          <SidebarItem
            href="/doctor/appointments"
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
            label="My Appointments"
          />


          
        </div>
      </div>

      <Button
        variant="ghost"
        className="flex justify-start hover:bg-white/5 p-4 w-full"
      >
        <Link href="/" passHref>
          <div className="dashboardIcons flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 25 25"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.78627 2.28711C7.35233 2.28711 7.00056 2.63889 7.00056 3.07282C7.00056 3.50676 7.35233 3.85854 7.78627 3.85854H19.572V21.1443H7.78627C7.35233 21.1443 7.00056 21.496 7.00056 21.93C7.00056 22.3639 7.35233 22.7157 7.78627 22.7157H19.572C20.4399 22.7157 21.1434 22.0121 21.1434 21.1443V3.85854C21.1434 2.99066 20.4399 2.28711 19.572 2.28711H7.78627ZM11.0919 8.4101C10.785 8.10326 10.2875 8.10326 9.98069 8.4101C9.67385 8.71694 9.67385 9.21442 9.98069 9.52127L12.1751 11.7157H1.50056C1.06662 11.7157 0.714844 12.0675 0.714844 12.5014C0.714844 12.9353 1.06662 13.2871 1.50056 13.2871H12.1751L9.98069 15.4815C9.67385 15.7884 9.67385 16.2859 9.98069 16.5927C10.2875 16.8995 10.785 16.8995 11.0919 16.5927L14.6276 13.057C14.9344 12.7501 14.9344 12.2527 14.6276 11.9458L11.0919 8.4101Z"
                fill="white"
              />
            </svg>
            <p className="text-sm text-white">Log out</p>
          </div>
        </Link>
      </Button>
    </div>
  );
};

export default Sidebar;
