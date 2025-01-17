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
              chatbotId: "${process.env.NEXT_PUBLIC_DEFAULT_CHATBOT_ID}",
              domain: "${process.env.NEXT_PUBLIC_DOMAIN}"
            }
          `
        }}
      />
      <Script 
        src={`http://${process.env.NEXT_PUBLIC_DOMAIN}/embed.min.js`}
        defer
      />
    </>
  );
}
