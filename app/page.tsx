import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesGrid from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";
import Announcement from "@/components/Announcement";

export default function Home() {
  return (
    <>
      <Announcement />
      <Header />
      <Hero />
      <FeaturesGrid />
      <Footer />
    </>
  );
}
