import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CompanyLogos from "@/components/CompanyLogos";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import ValueProposition from "@/components/ValueProposition";
import IndustryUseCases from "@/components/IndustryUseCases";
import Dashboard from "@/components/Dashboard";
import AIModels from "@/components/AIModels";
import UseCases from "@/components/UseCases";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Script from 'next/script';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <Hero />
      <CompanyLogos />
      <FeaturesSection />
      <HowItWorks />
      {/* <ValueProposition /> */}
      <IndustryUseCases />
      <Dashboard />
      <AIModels />
      <UseCases />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
   
      
      {/* ChatSa Bubble Scripts */}
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
      
      {/* Removed AOS Scripts */}
    </div>
  );
}
