import Image from "next/image";
import ButtonSignin from "./ButtonSignin";

const Hero = () => {
  return (
    <section className="pt-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-20 px-8 pb-0">
      {/* Left side - Text Content */}
      <div className="flex flex-col gap-8 lg:gap-10 items-start justify-start max-w-xl mt-6">
        <h1 className="font-extrabold text-5xl lg:text-7xl tracking-tight">
          Custom ChatGPT for your business
        </h1>
        
        <p className="text-xl opacity-80 leading-relaxed">
          Build a custom GPT, embed it on your website and let it handle customer support, 
          lead generation, engage with your users, and more.
        </p>

        <div className="flex flex-col gap-4 w-full sm:w-auto">
          <ButtonSignin 
            text="Build your Chatbot →"
            extraStyle="btn-primary btn-lg text-lg px-8"
          />
          <p className="text-sm opacity-60">No credit card required</p>
        </div>
      </div>

      {/* Right side - Overlapping Images */}
      <div className="lg:w-[50%] w-full relative h-[800px]">
        {/* Back/Bottom Image - Dashboard View */}
        <div className="absolute -right-10 top-0 w-[110%] h-auto z-0">
          <Image
            src="/dashboard-view.png"
            alt="Dashboard Analytics View"
            width={800}
            height={600}
            className="rounded-xl shadow-xl"
            priority
          />
        </div>

        {/* Front/Top Image - Chat View */}
        <div className="absolute -left-10 top-32 w-[60%] h-auto z-10">
          <Image
            src="/chat-view.png"
            alt="Chat Interface"
            width={380}
            height={280}
            className="rounded-xl shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
