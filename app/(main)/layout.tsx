import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import Script from 'next/script';
import { CSPostHogProvider } from './providers';
import FacebookSDK from "@/components/facebook/FacebookSDK";

export const viewport: Viewport = {
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<CSPostHogProvider>
				<ClientLayout>{children}</ClientLayout>
				<Analytics />
			</CSPostHogProvider>
			<FacebookSDK />	
			{/* <Script id="chatbot-config">
				{`
					(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="yVhz5CaPUHo6ii4YWGamn";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
				`}
			</Script> */}
		</>
	);
}
