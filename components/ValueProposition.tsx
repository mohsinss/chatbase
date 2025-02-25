import Image from "next/image";
import { Clock, BarChart3, Zap, Shield, Users, Globe } from "lucide-react";

export default function ValueProposition() {
  const values = [
    {
      title: "24/7 Customer Support",
      description: "Provide instant responses to customer inquiries around the clock, without hiring additional staff.",
      icon: <Clock className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Increased Conversion Rates",
      description: "Convert more visitors into customers by providing immediate assistance during the buying process.",
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Reduced Operational Costs",
      description: "Automate routine inquiries and tasks, allowing your team to focus on high-value activities.",
      icon: <Zap className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Enhanced Data Security",
      description: "Keep your sensitive information secure with enterprise-grade encryption and privacy controls.",
      icon: <Shield className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Personalized User Experience",
      description: "Deliver tailored responses based on user behavior, preferences, and history.",
      icon: <Users className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Multilingual Support",
      description: "Communicate with customers in their preferred language with support for over 95 languages.",
      icon: <Globe className="h-8 w-8 text-indigo-600" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Transform Your Business</span> with ChatSa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the tangible benefits that ChatSa brings to your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {values.map((value, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 mr-4">{value.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src="/roi-chart.png"
                alt="ROI Chart"
                width={600}
                height={400}
                className="rounded-xl shadow-md"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Measurable ROI</h3>
              <p className="text-lg text-gray-600 mb-6">
                Our customers see an average of:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-xl">70% reduction</span> in customer support response time
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-xl">35% increase</span> in conversion rates
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-xl">50% decrease</span> in support ticket volume
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-xl">3.5x ROI</span> within the first 6 months
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 