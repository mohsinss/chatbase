import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "ChatSa has transformed our customer support. Our response time has decreased by 70% while maintaining high customer satisfaction.",
      author: "Sarah Johnson",
      role: "Customer Success Manager",
      company: "TechFlow Inc.",
      avatar: "/testimonials/avatar1.jpg"
    },
    {
      quote: "Setting up our knowledge base chatbot took less than an hour. The AI accuracy is impressive, and the analytics help us improve continuously.",
      author: "Michael Chen",
      role: "Head of Product",
      company: "Innovate Solutions",
      avatar: "/testimonials/avatar2.jpg"
    },
    {
      quote: "We've tried several chatbot platforms, but ChatSa stands out with its ease of use and powerful customization options.",
      author: "Emma Rodriguez",
      role: "Digital Marketing Director",
      company: "Growth Ventures",
      avatar: "/testimonials/avatar3.jpg"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Innovative Teams</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with ChatSa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              "/logos/logo1.svg",
              "/logos/logo2.svg",
              "/logos/logo3.svg",
              "/logos/logo4.svg",
              "/logos/logo5.svg",
              "/logos/logo6.svg"
            ].map((logo, index) => (
              <Image
                key={index}
                src={logo}
                alt="Company logo"
                width={120}
                height={40}
                className="opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 