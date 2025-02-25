import { Button } from "@/components/ui/button";
import Link from "next/link";
import ButtonSignin from "./ButtonSignin";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using ChatSa to provide instant, accurate support and engage with their customers 24/7.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <ButtonSignin 
              text="Get started for free"
              extraStyle="bg-white text-indigo-600 hover:bg-gray-100 h-12 px-8 text-lg"
            />
            <Link href="/demo">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8 text-lg">
                Request a demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80">No credit card required • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
