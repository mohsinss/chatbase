import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UseCases() {
  const useCases = [
    {
      title: "Customer Support Automation",
      description: "Handle common customer inquiries, troubleshoot issues, and escalate complex problems to human agents when necessary.",
      image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1100&q=80",
      benefits: ["24/7 availability", "Instant responses", "Reduced support costs", "Consistent service"],
      link: "https://www.zendesk.com/blog/chatbots-for-customer-service/"
    },
    {
      title: "Lead Generation & Qualification",
      description: "Engage website visitors, collect contact information, and qualify leads before routing them to your sales team.",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Automated lead capture", "Intelligent qualification", "Higher conversion rates", "Sales team efficiency"],
      link: "https://www.hubspot.com/marketing/chatbots-lead-generation"
    },
    {
      title: "Appointment Scheduling",
      description: "Allow customers to book, reschedule, or cancel appointments through natural conversation with your chatbot.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Seamless booking", "Calendar integration", "Automated reminders", "Reduced no-shows"],
      link: "https://www.calendly.com/blog/ai-scheduling-assistants"
    },
    {
      title: "Document Creation & Processing",
      description: "Generate contracts, forms, and other documents based on user inputs and your business templates.",
      image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Automated document generation", "Template customization", "Reduced errors", "Faster processing"],
      link: "https://www.docusign.com/products/ai-agreement-cloud"
    },
    {
      title: "Product Recommendations",
      description: "Suggest relevant products or services based on customer preferences, history, and current needs.",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Personalized suggestions", "Increased sales", "Enhanced customer experience", "Cross-selling opportunities"],
      link: "https://www.shopify.com/retail/product-recommendation"
    },
    {
      title: "Knowledge Base Assistant",
      description: "Provide instant answers from your knowledge base, documentation, or internal resources.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Instant information access", "Reduced support tickets", "Consistent answers", "Self-service enablement"],
      link: "https://www.intercom.com/features/knowledge-base"
    }
  ];

  return (
    <section id="use-cases" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Versatile Use Cases</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the many ways ChatSa can transform your business operations and customer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Link 
              key={index}
              href={`/use-cases/${useCase.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 100)}
            >
              <div className="h-48 relative">
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2 mb-4">
                  {useCase.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="w-full text-indigo-600 border border-indigo-600 rounded-md py-2 px-4 text-center hover:bg-indigo-50 transition-colors">
                  Learn more
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 