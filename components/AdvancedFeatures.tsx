import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdvancedFeatures() {
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

  const useCases = [
    {
      title: "Customer Support Automation",
      description: "Handle common customer inquiries, troubleshoot issues, and escalate complex problems to human agents when necessary.",
      image: "/use-cases/customer-support.png"
    },
    {
      title: "Lead Generation & Qualification",
      description: "Engage website visitors, collect contact information, and qualify leads before routing them to your sales team.",
      image: "/use-cases/lead-generation.png"
    },
    {
      title: "Appointment Scheduling",
      description: "Allow customers to book, reschedule, or cancel appointments through natural conversation with your chatbot.",
      image: "/use-cases/scheduling.png"
    },
    {
      title: "Document Creation & Processing",
      description: "Generate contracts, forms, and other documents based on user inputs and your business templates.",
      image: "/use-cases/document-creation.png"
    },
    {
      title: "Product Recommendations",
      description: "Suggest relevant products or services based on customer preferences, history, and current needs.",
      image: "/use-cases/recommendations.png"
    },
    {
      title: "Knowledge Base Assistant",
      description: "Provide instant answers from your knowledge base, documentation, or internal resources.",
      image: "/use-cases/knowledge-base.png"
    }
  ];

  return (
    <section id="advanced-features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Advanced Capabilities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of AI with ChatSa's cutting-edge features and integrations.
          </p>
        </div>

        <Tabs defaultValue="ai-models" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="ai-models" className="text-lg py-3">AI Models</TabsTrigger>
            <TabsTrigger value="use-cases" className="text-lg py-3">Use Cases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-models">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiModels.map((model, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
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
          </TabsContent>
          
          <TabsContent value="use-cases">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="h-48 relative">
                    <Image
                      src={useCase.image}
                      alt={useCase.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
} 