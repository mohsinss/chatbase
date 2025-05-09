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
import dynamic from 'next/dynamic';

const ChatbotScripts = dynamic(() => import('@/components/ChatbotScripts'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <Hero />
      {/* <CompanyLogos /> */}
      <FeaturesSection />
      <HowItWorks />
      {/* <ValueProposition /> */}
      <IndustryUseCases />
      <Dashboard />
      <AIModels />
      <UseCases />
      {/* <Testimonials /> */}
      <FAQ />
      <CTA />
      <Footer />
      <ChatbotScripts />
    </div>
  );
}
