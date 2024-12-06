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

          {/* Code for the Left menu */}

          <div className="left-menu">
            <div className="mainlogo">
              <Image src="/circle-logo.svg" alt="icon" width={45} height={45} />
              <div className="carelogo">Care<span className="qlogo">Q</span></div>
            </div>

            <div className="left-menuoptions">

              <Link href="/dashboard" passHref>
                <div className="dashboardIcons">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2.08984C9.35397 2.08984 6.80359 4.64022 6.80359 7.78627C6.80359 10.3837 8.54197 12.575 10.9187 13.2604C9.04241 13.489 7.43306 14.1527 6.2207 15.3475C4.67769 16.8681 3.89648 19.132 3.89648 22.0862C3.89648 22.4984 4.23067 22.8326 4.64291 22.8326C5.05515 22.8326 5.38934 22.4984 5.38934 22.0862C5.38934 19.3833 6.10094 17.5615 7.26858 16.4107C8.43843 15.2578 10.1849 14.6613 12.4999 14.6613C14.815 14.6613 16.5615 15.2578 17.7314 16.4108C18.8991 17.5615 19.6107 19.3833 19.6107 22.0862C19.6107 22.4984 19.9448 22.8326 20.3571 22.8326C20.7693 22.8326 21.1035 22.4984 21.1035 22.0862C21.1036 19.132 20.3223 16.8681 18.7793 15.3475C17.5669 14.1527 15.9576 13.489 14.0813 13.2604C16.458 12.575 18.1964 10.3837 18.1964 7.78627C18.1964 4.64022 15.6461 2.08984 12.5 2.08984ZM8.29645 7.78627C8.29645 5.4647 10.1784 3.5827 12.5 3.5827C14.8216 3.5827 16.7036 5.4647 16.7036 7.78627C16.7036 10.1078 14.8216 11.9898 12.5 11.9898C10.1784 11.9898 8.29645 10.1078 8.29645 7.78627Z" fill="white" />
                  </svg>
                  <div className="dashboardfont">Dashboard</div>
                </div>
              </Link>

              <Link href="/queue" passHref>
                <div className="dashboardIcons">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2.08984C9.35397 2.08984 6.80359 4.64022 6.80359 7.78627C6.80359 10.3837 8.54197 12.575 10.9187 13.2604C9.04241 13.489 7.43306 14.1527 6.2207 15.3475C4.67769 16.8681 3.89648 19.132 3.89648 22.0862C3.89648 22.4984 4.23067 22.8326 4.64291 22.8326C5.05515 22.8326 5.38934 22.4984 5.38934 22.0862C5.38934 19.3833 6.10094 17.5615 7.26858 16.4107C8.43843 15.2578 10.1849 14.6613 12.4999 14.6613C14.815 14.6613 16.5615 15.2578 17.7314 16.4108C18.8991 17.5615 19.6107 19.3833 19.6107 22.0862C19.6107 22.4984 19.9448 22.8326 20.3571 22.8326C20.7693 22.8326 21.1035 22.4984 21.1035 22.0862C21.1036 19.132 20.3223 16.8681 18.7793 15.3475C17.5669 14.1527 15.9576 13.489 14.0813 13.2604C16.458 12.575 18.1964 10.3837 18.1964 7.78627C18.1964 4.64022 15.6461 2.08984 12.5 2.08984ZM8.29645 7.78627C8.29645 5.4647 10.1784 3.5827 12.5 3.5827C14.8216 3.5827 16.7036 5.4647 16.7036 7.78627C16.7036 10.1078 14.8216 11.9898 12.5 11.9898C10.1784 11.9898 8.29645 10.1078 8.29645 7.78627Z" fill="white" />
                  </svg>
                  <div className="dashboardfont">Queue</div>
                </div>
              </Link>

              <Link href="/appointment" passHref>
                <div className="dashboardIcons">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.91557 2.28711C5.32035 2.28711 4.77622 2.6234 4.51004 3.15577L2.37006 7.43573C2.31551 7.54483 2.28711 7.66513 2.28711 7.78711V21.1443C2.28711 22.0121 2.99067 22.7157 3.85854 22.7157H21.1443C22.0121 22.7157 22.7157 22.0121 22.7157 21.1443V7.78711C22.7157 7.66513 22.6873 7.54482 22.6327 7.43572L20.4928 3.15581C20.2266 2.62344 19.6824 2.28716 19.0872 2.28715L12.5014 2.28713L5.91557 2.28711ZM5.91556 3.85854L11.7157 3.85856V7.00139H4.34414L5.91556 3.85854ZM13.2871 7.00139V3.85856L19.0872 3.85858L20.6586 7.00139H13.2871ZM12.5014 8.57282H21.1443V21.1443L3.85854 21.1443V8.57282H12.5014ZM9.35854 11.7157C8.9246 11.7157 8.57282 12.0675 8.57282 12.5014C8.57282 12.9353 8.9246 13.2871 9.35854 13.2871H15.6443C16.0782 13.2871 16.43 12.9353 16.43 12.5014C16.43 12.0675 16.0782 11.7157 15.6443 11.7157H9.35854Z" fill="white" />
                  </svg>
                  <div className="dashboardfont">Appointments</div>
                </div>
              </Link>

              <Link href="/settings" passHref>
                <div className="dashboardIcons">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8263 1.73633C11.2024 1.73633 10.6616 2.16825 10.5237 2.77672L10.1496 4.42698C9.55399 4.60018 8.98583 4.83737 8.45314 5.13045L7.02156 4.22801C6.49376 3.89529 5.80594 3.97228 5.36477 4.41346L4.41234 5.36589C3.97117 5.80706 3.89418 6.49488 4.22689 7.02267L5.12966 8.45477C4.83684 8.98732 4.59986 9.55529 4.42683 10.1507L2.77672 10.5247C2.16825 10.6627 1.73633 11.2035 1.73633 11.8274V13.1743C1.73633 13.7983 2.16825 14.3391 2.77672 14.477L4.42702 14.8511C4.60015 15.4467 4.83726 16.0148 5.13025 16.5474L4.22763 17.9793C3.89492 18.5071 3.97191 19.1949 4.41308 19.6361L5.36551 20.5885C5.80668 21.0297 6.4945 21.1067 7.0223 20.774L8.45425 19.8713C8.98662 20.1641 9.55439 20.4011 10.1496 20.5741L10.5237 22.2244C10.6616 22.8329 11.2024 23.2648 11.8263 23.2648H13.1733C13.7972 23.2648 14.338 22.8329 14.4759 22.2244L14.8499 20.5748C15.4456 20.4017 16.0139 20.1646 16.5467 19.8717L17.9785 20.7743C18.5063 21.107 19.1941 21.03 19.6353 20.5888L20.5877 19.6364C21.0289 19.1952 21.1059 18.5074 20.7732 17.9796L19.8709 16.5483C20.1641 16.0153 20.4014 15.4469 20.5746 14.851L22.2244 14.477C22.8329 14.3391 23.2648 13.7983 23.2648 13.1743V11.8274C23.2648 11.2035 22.8329 10.6627 22.2244 10.5247L20.5748 10.1508C20.4017 9.55504 20.1645 8.98675 19.8715 8.45393L20.7739 7.02235C21.1066 6.49456 21.0296 5.80674 20.5885 5.36557L19.636 4.41314C19.1949 3.97196 18.507 3.89497 17.9792 4.22769L16.5478 5.13007C16.0146 4.83682 15.446 4.59955 14.8499 4.42638L14.4759 2.77672C14.338 2.16825 13.7972 1.73633 13.1733 1.73633H11.8263ZM8.44713 6.70561C9.2748 6.12557 10.2325 5.71833 11.2677 5.53628L11.8263 3.07204H13.1733L13.7319 5.53592C14.7676 5.71775 15.7258 6.12498 16.5538 6.70518L18.6915 5.35763L19.644 6.31006L18.2964 8.4478C18.8763 9.27564 19.2835 10.2334 19.4653 11.2688L21.9291 11.8274V13.1743L19.4652 13.7329C19.2832 14.7685 18.8759 15.7264 18.2957 16.5543L19.6432 18.6919L18.6908 19.6443L16.5529 18.2966C15.725 18.8765 14.7672 19.2835 13.7319 19.4652L13.1733 21.9291H11.8263L11.2677 19.4649C10.2329 19.2829 9.27556 18.8759 8.44811 18.2962L6.31001 19.644L5.35758 18.6916L6.70536 16.5535C6.12545 15.7259 5.71834 14.7682 5.5364 13.733L3.07204 13.1743V11.8274L5.53628 11.2687C5.7181 10.2337 6.12502 9.27619 6.70469 8.44854L5.35684 6.31038L6.30927 5.35795L8.44713 6.70561ZM14.897 12.5004C14.897 13.8238 13.8241 14.8967 12.5007 14.8967C11.1773 14.8967 10.1044 13.8238 10.1044 12.5004C10.1044 11.1769 11.1773 10.1041 12.5007 10.1041C13.8241 10.1041 14.897 11.1769 14.897 12.5004ZM16.3113 12.5004C16.3113 14.6049 14.6052 16.3109 12.5007 16.3109C10.3962 16.3109 8.69011 14.6049 8.69011 12.5004C8.69011 10.3958 10.3962 8.68979 12.5007 8.68979C14.6052 8.68979 16.3113 10.3958 16.3113 12.5004Z" fill="white" />
                  </svg>
                  <div className="dashboardfont">Settings</div>
                </div>
              </Link>


              <Link href="/" passHref>
                <div className="dashboardIcons">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.78627 2.28711C7.35233 2.28711 7.00056 2.63889 7.00056 3.07282C7.00056 3.50676 7.35233 3.85854 7.78627 3.85854H19.572V21.1443H7.78627C7.35233 21.1443 7.00056 21.496 7.00056 21.93C7.00056 22.3639 7.35233 22.7157 7.78627 22.7157H19.572C20.4399 22.7157 21.1434 22.0121 21.1434 21.1443V3.85854C21.1434 2.99066 20.4399 2.28711 19.572 2.28711H7.78627ZM11.0919 8.4101C10.785 8.10326 10.2875 8.10326 9.98069 8.4101C9.67385 8.71694 9.67385 9.21442 9.98069 9.52127L12.1751 11.7157H1.50056C1.06662 11.7157 0.714844 12.0675 0.714844 12.5014C0.714844 12.9353 1.06662 13.2871 1.50056 13.2871H12.1751L9.98069 15.4815C9.67385 15.7884 9.67385 16.2859 9.98069 16.5927C10.2875 16.8995 10.785 16.8995 11.0919 16.5927L14.6276 13.057C14.9344 12.7501 14.9344 12.2527 14.6276 11.9458L11.0919 8.4101Z" fill="white" />
                  </svg>
                  <div className="dashboardfont">Log out</div>
                </div>
              </Link>

            </div>

          </div>

          <div className="flex flex-col w-full">

            {/* Code for Navbar */}
            <div className="nav-bar item-center">
              <div className="text-xl font-bold appointmentmanagement">Appointment Management</div>
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
