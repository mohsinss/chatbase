import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function IndustryUseCases() {
  const industries = [
    {
      name: "Healthcare",
      description: "Provide 24/7 patient support, schedule appointments, answer medical questions, and streamline administrative tasks.",
      icon: "/icons/healthcare.svg",
      image: "/industries/healthcare.jpg",
      benefits: ["Patient pre-screening", "Appointment scheduling", "Medical information", "Insurance inquiries"]
    },
    {
      name: "Legal",
      description: "Automate client intake, answer common legal questions, draft basic documents, and provide case status updates.",
      icon: "/icons/legal.svg",
      image: "/industries/legal.jpg",
      benefits: ["Client intake automation", "Legal FAQ assistance", "Document drafting", "Case status updates"]
    },
    {
      name: "E-commerce",
      description: "Boost sales with product recommendations, handle order inquiries, process returns, and provide personalized shopping assistance.",
      icon: "/icons/ecommerce.svg",
      image: "/industries/ecommerce.jpg",
      benefits: ["Product recommendations", "Order tracking", "Return processing", "Inventory inquiries"]
    },
    {
      name: "Education",
      description: "Support students with course information, assignment help, enrollment assistance, and administrative inquiries.",
      icon: "/icons/education.svg",
      image: "/industries/education.jpg",
      benefits: ["Course information", "Assignment guidance", "Enrollment support", "Administrative assistance"]
    },
    {
      name: "Real Estate",
      description: "Qualify leads, schedule viewings, answer property questions, and provide neighborhood information.",
      icon: "/icons/realestate.svg",
      image: "/industries/realestate.jpg",
      benefits: ["Property matching", "Viewing scheduling", "Neighborhood insights", "Mortgage calculations"]
    },
    {
      name: "Financial Services",
      description: "Assist with account inquiries, explain financial products, provide basic financial advice, and detect fraud.",
      icon: "/icons/finance.svg",
      image: "/industries/finance.jpg",
      benefits: ["Account management", "Product explanations", "Financial guidance", "Fraud detection"]
    }
  ];

  return (
    <section id="industry-use-cases" className="py-20 bg-gray-50" data-aos="fade-up">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Industry Solutions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ChatSa adapts to your industry&apos;s unique needs with specialized AI chatbot solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 100)}
            >
              <div className="h-48 relative">
                <Image
                  src={industry.image}
                  alt={`${industry.name} industry`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                        <Image src={industry.icon} alt="" width={24} height={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{industry.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{industry.description}</p>
                <ul className="space-y-2 mb-4">
                  {industry.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/industries/${industry.name.toLowerCase()}`}>
                  <Button variant="outline" className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50">
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 