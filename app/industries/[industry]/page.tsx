import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

const industryData = {
  healthcare: {
    name: "Healthcare",
    description: "Provide 24/7 patient support, schedule appointments, answer medical questions, and streamline administrative tasks.",
    icon: "/icons/healthcare.svg",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1100&q=80",
    benefits: ["Patient pre-screening", "Appointment scheduling", "Medical information", "Insurance inquiries"],
    detailedDescription: "Healthcare providers face increasing demands with limited resources. ChatSa's AI chatbots help healthcare organizations provide better patient experiences while reducing staff workload. From answering common medical questions to scheduling appointments and handling insurance inquiries, our chatbots are available 24/7 to support your patients.",
    useCases: [
      {
        title: "Patient Pre-screening",
        description: "Collect symptoms and medical history before appointments to save time and improve diagnosis accuracy.",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Appointment Management",
        description: "Allow patients to schedule, reschedule, or cancel appointments without calling your office.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Medical Information",
        description: "Provide accurate information about conditions, medications, and procedures from your approved content.",
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80"
      }
    ],
    testimonial: {
      quote: "ChatSa has transformed how we handle patient inquiries. Our staff now focuses on complex cases while routine questions are handled automatically.",
      author: "Dr. Sarah Johnson",
      position: "Medical Director, Northside Health"
    }
  },
  legal: {
    name: "Legal",
    description: "Automate client intake, answer common legal questions, draft basic documents, and provide case status updates.",
    icon: "/icons/legal.svg",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1100&q=80",
    benefits: ["Client intake automation", "Legal FAQ assistance", "Document drafting", "Case status updates"],
    detailedDescription: "Law firms and legal departments can leverage ChatSa to streamline client interactions and automate routine tasks. Our AI chatbots can handle initial client intake, answer frequently asked legal questions, and provide updates on case status, allowing your legal team to focus on high-value work.",
    useCases: [
      {
        title: "Client Intake Automation",
        description: "Collect client information and case details before the first consultation to improve efficiency.",
        image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Legal FAQ Assistance",
        description: "Answer common legal questions instantly using your firm's knowledge base and expertise.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Document Preparation",
        description: "Help clients complete standard legal forms and documents with guided assistance.",
        image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=800&q=80"
      }
    ],
    testimonial: {
      quote: "Our client satisfaction has increased dramatically since implementing ChatSa. Clients appreciate getting immediate answers to their questions at any time.",
      author: "Michael Reynolds",
      position: "Managing Partner, Reynolds Legal Group"
    }
  },
  ecommerce: {
    name: "E-commerce",
    description: "Boost sales with product recommendations, handle order inquiries, process returns, and provide personalized shopping assistance.",
    icon: "/icons/ecommerce.svg",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=80",
    benefits: ["Product recommendations", "Order tracking", "Return processing", "Inventory inquiries"],
    detailedDescription: "E-commerce businesses can enhance customer experience and increase sales with ChatSa's AI chatbots. From personalized product recommendations to handling order inquiries and processing returns, our chatbots help you provide 24/7 customer service while reducing support costs.",
    useCases: [
      {
        title: "Personalized Shopping",
        description: "Recommend products based on customer preferences, browsing history, and purchase patterns.",
        image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Order Management",
        description: "Allow customers to track orders, modify shipping details, and get delivery updates.",
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Return Assistance",
        description: "Guide customers through the return process and answer questions about policies.",
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80"
      }
    ],
    testimonial: {
      quote: "Since implementing ChatSa, our conversion rate has increased by 23% and our customer service costs have decreased by 35%.",
      author: "Jennifer Liu",
      position: "E-commerce Director, StyleHub"
    }
  },
  education: {
    name: "Education",
    description: "Support students with course information, assignment help, enrollment assistance, and administrative inquiries.",
    icon: "/icons/education.svg",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1100&q=80",
    benefits: ["Course information", "Assignment guidance", "Enrollment support", "Administrative assistance"],
    detailedDescription: "Educational institutions can improve student support and streamline administrative processes with ChatSa's AI chatbots. From providing course information to offering assignment guidance and handling enrollment inquiries, our chatbots help you support students 24/7.",
    useCases: [
      {
        title: "Academic Support",
        description: "Answer questions about courses, assignments, and learning resources to help students succeed.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Enrollment Assistance",
        description: "Guide prospective and current students through the enrollment process and course registration.",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Administrative Support",
        description: "Handle inquiries about deadlines, procedures, and campus resources to reduce staff workload.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
      }
    ],
    testimonial: {
      quote: "ChatSa has revolutionized how we support our students. They can get answers to their questions instantly, any time of day or night.",
      author: "Dr. Robert Chen",
      position: "Dean of Student Affairs, Westlake University"
    }
  },
  realestate: {
    name: "Real Estate",
    description: "Qualify leads, schedule viewings, answer property questions, and provide neighborhood information.",
    icon: "/icons/realestate.svg",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1100&q=80",
    benefits: ["Property matching", "Viewing scheduling", "Neighborhood insights", "Mortgage calculations"],
    detailedDescription: "Real estate professionals can enhance client engagement and streamline property transactions with ChatSa's AI chatbots. From qualifying leads to scheduling viewings and answering property questions, our chatbots help you provide responsive service to potential buyers and sellers.",
    useCases: [
      {
        title: "Property Matching",
        description: "Help clients find properties that match their criteria and preferences.",
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Viewing Coordination",
        description: "Schedule property viewings and send reminders to clients and agents.",
        image: "https://images.unsplash.com/photo-1560518883-3d4d00def399?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Neighborhood Information",
        description: "Provide details about schools, amenities, and market trends in different neighborhoods.",
        image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80"
      }
    ],
    testimonial: {
      quote: "ChatSa has transformed our lead qualification process. We now focus our time on serious buyers while providing excellent service to all inquiries.",
      author: "David Martinez",
      position: "Broker, Elite Properties"
    }
  },
  finance: {
    name: "Financial Services",
    description: "Assist with account inquiries, explain financial products, provide basic financial advice, and detect fraud.",
    icon: "/icons/finance.svg",
    image: "https://images.unsplash.com/photo-1565514020179-026b92b2d70b?auto=format&fit=crop&w=1100&q=80",
    benefits: ["Account management", "Product explanations", "Financial guidance", "Fraud detection"],
    detailedDescription: "Financial institutions can improve customer service and operational efficiency with ChatSa's AI chatbots. From handling account inquiries to explaining financial products and providing basic financial advice, our chatbots help you deliver personalized service at scale.",
    useCases: [
      {
        title: "Account Management",
        description: "Help customers check balances, review transactions, and manage account settings.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Financial Product Guidance",
        description: "Explain features, benefits, and requirements of different financial products.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Financial Planning Assistance",
        description: "Provide basic financial advice and calculators for budgeting, saving, and investing.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
      }
    ],
    testimonial: {
      quote: "Our customer satisfaction scores have increased by 40% since implementing ChatSa. Clients appreciate getting immediate answers to their financial questions.",
      author: "Amanda Wilson",
      position: "VP of Digital Banking, First National Bank"
    }
  }
};

export default function IndustryPage({ params }: { params: { industry: string } }) {
  // Convert industry param to lowercase and handle special cases
  const industryParam = params.industry.toLowerCase();
  
  // Map URL parameters to industry keys
  const industryKeyMap: Record<string, keyof typeof industryData> = {
    'healthcare': 'healthcare',
    'legal': 'legal',
    'e-commerce': 'ecommerce',
    'ecommerce': 'ecommerce', // Handle both forms
    'education': 'education',
    'real-estate': 'realestate',
    'realestate': 'realestate', // Handle both forms
    'financial-services': 'finance',
    'financial': 'finance', // Handle shortened form
    'finance': 'finance' // Handle direct form
  };
  
  const industryKey = industryKeyMap[industryParam];
  const data = industryData[industryKey];
  
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Industry not found</h1>
        <p className="mb-8">The industry you're looking for doesn't exist or has been moved.</p>
        <Link href="/#industry-use-cases">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Industries
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <Link href="/#industry-use-cases" className="inline-flex items-center text-white/80 hover:text-white mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Industries
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.name} AI Chatbot Solutions</h1>
              <p className="text-xl mb-8">{data.description}</p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                  Get Started
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={data.image} 
                  alt={data.name} 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Why Choose ChatSa for {data.name}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {data.detailedDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit}</h3>
                <p className="text-gray-600">
                  Enhance your {data.name.toLowerCase()} operations with our specialized AI solutions.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {data.name} Use Cases
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how ChatSa can transform your {data.name.toLowerCase()} operations with these specific applications.
            </p>
          </div>

          <div className="space-y-16">
            {data.useCases.map((useCase, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img 
                      src={useCase.image}
                      alt={useCase.title}
                      className="w-full h-auto hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold">{useCase.title}</h3>
                  <p className="text-gray-600 text-lg">{useCase.description}</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">24/7 availability</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Personalized interactions</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Seamless integration</span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <svg className="w-12 h-12 text-indigo-600 mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-xl md:text-2xl font-medium text-gray-800 mb-6">
                "{data.testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-indigo-600">{data.testimonial.author}</p>
                <p className="text-gray-600">{data.testimonial.position}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your {data.name} operations?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of {data.name.toLowerCase()} organizations already using ChatSa to improve efficiency and customer satisfaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-indigo-600 hover:bg-gray-100">
              Get Started Free
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 