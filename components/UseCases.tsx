import Image from "next/image";

export default function UseCases() {
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
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 100)}
            >
              <div className="h-48 relative">
                <Image
                  src={useCase.image}
                  alt={useCase.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 