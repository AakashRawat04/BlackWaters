// app/layout.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import localFont from "next/font/local";
import "./globals.css";
import { useEffect, useState } from "react";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mouseOverSidebar, setMouseOverSidebar] = useState(false);

  const handleMouseEnterSidebar = () => {
    setMouseOverSidebar(true);
  };

  const handleMouseLeaveSidebar = () => {
    setMouseOverSidebar(false);
  };

  useEffect(() => {
    const handleMouseEnter = (event: MouseEvent) => {
      if (event.clientX < 50) {
        setSidebarOpen(true);
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (!mouseOverSidebar && sidebarOpen && event.clientX >= 50) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousemove", handleMouseEnter);
    document.addEventListener("mousemove", handleMouseLeave);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseEnter);
      document.removeEventListener("mousemove", handleMouseLeave);
    };
  }, [sidebarOpen, mouseOverSidebar]);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-[#1a1a1a] text-[#e0e0e0]`}
      >
        <div className={`flex`}>
          <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            onMouseEnter={handleMouseEnterSidebar} 
            onMouseLeave={handleMouseLeaveSidebar} 
          />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
