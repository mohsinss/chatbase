import Image from "next/image";

export default function AIModels() {
  const aiModels = [
    {
      name: "OpenAI GPT-4",
      description: "Leverage OpenAI's most advanced model for human-like conversations and complex reasoning.",
      logo: "/ai-models/openai.svg",
      features: ["Advanced reasoning", "Complex problem solving", "Nuanced understanding", "Creative content generation"]
    },
    {
      name: "Anthropic Claude",
      description: "Utilize Anthropic's Claude for helpful, harmless, and honest AI interactions.",
      logo: "/ai-models/anthropic.svg",
      features: ["Constitutional AI approach", "Reduced hallucinations", "Longer context windows", "Thoughtful responses"]
    },
    {
      name: "Google Gemini",
      description: "Harness Google's multimodal AI for understanding text, images, and more.",
      logo: "/ai-models/google.svg",
      features: ["Multimodal capabilities", "Strong reasoning", "Factual responses", "Multilingual excellence"]
    },
    {
      name: "DeepSeek",
      description: "Implement DeepSeek's specialized models for domain-specific applications.",
      logo: "/ai-models/deepseek.svg",
      features: ["Domain specialization", "Efficient processing", "Research-backed", "Continuous improvement"]
    },
    {
      name: "Grok-3",
      description: "Deploy xAI's Grok for witty, informative, and real-time responses.",
      logo: "/ai-models/grok.svg",
      features: ["Real-time information", "Witty interactions", "Broad knowledge base", "Engaging personality"]
    }
  ];

  return (
    <section id="ai-models" className="py-20 bg-gradient-to-r from-indigo-50 to-violet-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Powered by Advanced AI Models</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from the world's most sophisticated AI models to power your chatbot experience.
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
                  <Image src={model.logo} alt={model.name} width={48} height={48} />
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