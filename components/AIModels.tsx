import Image from "next/image";

export default function AIModels() {
  const aiModels = [
    {
      name: "OpenAI",
      description: "Leverage OpenAI's most advanced model for human-like conversations and complex reasoning.",
      features: ["Advanced reasoning", "Complex problem solving", "Nuanced understanding", "Creative content generation"]
    },
    {
      name: "Anthropic Claude",
      description: "Utilize Anthropic's Claude for helpful, harmless, and honest AI interactions.",
      features: ["Constitutional AI approach", "Reduced hallucinations", "Longer context windows", "Thoughtful responses"]
    },
    {
      name: "Google Gemini",
      description: "Harness Google's multimodal AI for understanding text, images, and more.",
      features: ["Multimodal capabilities", "Strong reasoning", "Factual responses", "Multilingual excellence"]
    },
    {
      name: "DeepSeek",
      description: "Implement DeepSeek's specialized models for domain-specific applications.",
      features: ["Domain specialization", "Efficient processing", "Research-backed", "Continuous improvement"]
    },
    {
      name: "Grok-3",
      description: "Deploy xAI's Grok for witty, informative, and real-time responses.",
      features: ["Real-time information", "Witty interactions", "Broad knowledge base", "Engaging personality"]
    }
  ];

  // Function to render the appropriate logo based on model name
  const renderLogo = (modelName: string) => {
    switch(modelName) {
      case "OpenAI":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" fill="#412991"/>
          </svg>
        );
      case "Anthropic Claude":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#6B5CE7" />
            <circle cx="12" cy="12" r="4.5" fill="white" />
          </svg>
        );
      case "Google Gemini":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#8AB4F8" />
            <path d="M12 7v10l-4.5-5L12 7z" fill="#4285F4" />
            <path d="M12 7v10l4.5-5L12 7z" fill="#1967D2" />
          </svg>
        );
      case "DeepSeek":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#00A67E" />
            <path d="M8 12l4-4 4 4-4 4-4-4z" fill="white" />
          </svg>
        );
      case "Grok-3":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#FF3366" />
            <path d="M12 4L5 8v8l7 4 7-4V8l-7-4z" fill="white" />
            <path d="M12 8v8" stroke="#FF3366" strokeWidth="1.5" />
            <path d="M8 10v4" stroke="#FF3366" strokeWidth="1.5" />
            <path d="M16 10v4" stroke="#FF3366" strokeWidth="1.5" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2" />
            <circle cx="12" cy="12" r="5" fill="#4285F4" />
          </svg>
        );
    }
  };

  return (
    <section id="ai-models" className="py-20 bg-gradient-to-r from-indigo-50 to-violet-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Powered by Advanced AI Models</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from the world&apos;s most sophisticated AI models to power your chatbot experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiModels.map((model, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 100)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4">
                  {renderLogo(model.name)}
                </div>
                <h3 className="text-xl font-bold">{model.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{model.description}</p>
              <ul className="space-y-2">
                {model.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 