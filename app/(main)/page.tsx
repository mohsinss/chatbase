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
      
      {/* Chat Bubble Scripts 1*/}
      <Script
        id="chatbot-config"
        dangerouslySetInnerHTML={{
          __html: `
            window.embeddedChatbotConfig = {
              chatbotId: "3Fio_IIfzQDKTGsjEKwil",
              domain: "${process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'chatsa.co'}",
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
