import type { Metadata } from "next/types"; // ✅ Ensure correct metadata import
import { ReduxProvider } from "./redux/ReduxProvider";
import localFont from "next/font/local";
import "./globals.css";
import "./layout.css";

const geistSans = localFont({
  src: "/fonts/GeistVF.woff", // ✅ Ensure this path is inside `public/fonts/`
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff", // ✅ Ensure this path is inside `public/fonts/`
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CareQ",
  description: "Generated by create next app",
};

export default function RootLayout({
  children, // ✅ Removed `pathname`, as it's not automatically available in `layout.tsx`
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
