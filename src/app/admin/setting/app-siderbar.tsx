"use client"; // Ensure this is client-side

import { usePathname } from "next/navigation";
import { UserRoundPen, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Helper function to normalize URLs (remove trailing slash and query parameters)
const normalizePath = (path: string) => {
  // Remove trailing slash
  let normalized = path.endsWith("/") ? path.slice(0, -1) : path;
  
  // Optionally, you could remove query parameters here if necessary
  const url = new URL(normalized, "https://example.com"); // Use a dummy base URL for URL manipulation
  normalized = url.pathname; // Get only the pathname
  
  return normalized;
};

// SidebarItem component
interface SidebarItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname); // Normalize the pathname
  const normalizedHref = normalizePath(href); // Normalize the href

  const isActive = normalizedPathname === normalizedHref; // Compare the normalized paths

  return (
    <Button
      variant="ghost"
      className={`flex justify-start py-[6px] px-2 w-full ${
        isActive ? "bg-primary-accent" : "hover:bg-white/5"
      }`}
    >
      <Link href={href} passHref>
        <div className="dashboardIcons flex items-center">
          {icon}
          <p className="text-black text-sm ml-3">{label}</p>
        </div>
      </Link>
    </Button>
  );
};

// Sidebar component
const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 sticky w-[12%] mr-8">
      <div className="flex flex-col gap-1">
        <SidebarItem
          href="/doctor/setting/"
          icon={<UserRoundPen />}
          label="Profile"
        />
        <SidebarItem
          href="/doctor/setting/account"
          icon={<KeyRound />}
          label="Account"
        />
      </div>
    </div>
  );
};

export default Sidebar;
