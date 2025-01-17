import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesGrid from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";
import Announcement from "@/components/Announcement";
import Script from 'next/script';

export default function Home() {
  return (
    <>
      {/* <Announcement /> */}
      <Header />
      <Hero />
      <FeaturesGrid />
      <Footer />
      
      {/* Chat Bubble Scripts */}
      <Script
        id="chatbot-config"
        dangerouslySetInnerHTML={{
          __html: `
            window.embeddedChatbotConfig = {
              chatbotId: "S4EYnRPPPh8H479N6dKJH",
              domain: "${process.env.NEXT_PUBLIC_DOMAIN}",
              protocol: "${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}"
            }
          `
        }}
      />
      <Script 
        src={`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.NEXT_PUBLIC_DOMAIN}/embed.min.js`}
        defer
      />
    </>
  );
}
