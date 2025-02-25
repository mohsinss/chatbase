import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      title: "Train on Your Data",
      description: "Upload documents, connect to your website, or use custom data to train your AI chatbot.",
      icon: "/icons/data.svg"
    },
    {
      title: "Customizable Widget",
      description: "Fully customize the appearance of your chatbot to match your brand.",
      icon: "/icons/customize.svg"
    },
    {
      title: "Analytics Dashboard",
      description: "Track user interactions, popular questions, and chatbot performance.",
      icon: "/icons/analytics.svg"
    },
    {
      title: "Multiple Language Support",
      description: "Create chatbots that can communicate in over 95 languages.",
      icon: "/icons/language.svg"
    },
    {
      title: "Easy Integration",
      description: "Add your chatbot to any website with a simple code snippet.",
      icon: "/icons/integration.svg"
    },
    {
      title: "Advanced AI Models",
      description: "Powered by the latest AI models for accurate and natural responses.",
      icon: "/icons/ai.svg"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white" data-aos="fade-up">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Build
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> Powerful AI Chatbots</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ChatSa provides all the tools you need to create, customize, and deploy AI chatbots without any coding.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 50)}
            >
              <div className="w-12 h-12 mb-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Image src={feature.icon} alt={feature.title} width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Advanced Features for Power Users</h3>
              <p className="text-gray-600 mb-6">
                ChatSa offers advanced capabilities for users who need more from their AI chatbots.
              </p>
              <ul className="space-y-3">
                {[
                  "API access for custom integrations",
                  "Webhook support for real-time notifications",
                  "Role-based access control",
                  "Custom training data preprocessing",
                  "Advanced analytics and reporting"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/advanced-features.png"
                  alt="Advanced Features"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 