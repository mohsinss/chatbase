import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";
import Script from 'next/script';

const font = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			data-theme={config.colors.theme}
			className={font.className}
		>
			<head>
				{/* other head elements */}
			</head>
			<body>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
