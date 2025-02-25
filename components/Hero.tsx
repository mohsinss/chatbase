import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Build AI Chatbots
              </span>
              <br />
              <span className="text-gray-900">
                Trained on Your Data
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Create custom AI chatbots without coding. Train on your website, documents, or custom data in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <ButtonSignin 
                text="Get started for free"
                extraStyle="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 h-12 px-8 text-lg"
              />
              <Link href="#demo">
                <Button variant="outline" className="h-12 px-8 text-lg">
                  See demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-500">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src="/dashboard-preview.png"
                alt="ChatSa Dashboard"
                width={800}
                height={500}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-violet-600/10"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full z-0"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-100 rounded-full z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
