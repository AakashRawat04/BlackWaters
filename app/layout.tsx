import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
	title: "Black Waters",
	description: "The Realtime Telemetry Monitoring System You Love",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-[#1a1a1a] text-[#e0e0e0]`}
			>
				<Sidebar />
				<main className="flex-1 p-8">{children}</main>
			</body>
		</html>
	);
}
