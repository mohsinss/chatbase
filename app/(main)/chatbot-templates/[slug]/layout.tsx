import { Metadata } from 'next';

// Template data for metadata generation
const templates = [
  {
    slug: 'instagram-bot-for-lawyers-and-law-firms',
    title: 'Instagram Bot for Lawyers and Law Firms',
    description: 'Present your law services in an impressive way and generate more qualified leads on Instagram with this multifunctional bot. Perfect for attorneys and legal professionals.',
    keywords: 'instagram bot, lawyer chatbot, law firm automation, legal lead generation, attorney marketing, instagram marketing for lawyers'
  }
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const template = templates.find(t => t.slug === params.slug);
  
  if (!template) {
    return {
      title: 'Template Not Found | ChatSa',
      description: 'The requested chatbot template could not be found.',
    };
  }

  return {
    title: `${template.title} | ChatSa Chatbot Templates`,
    description: template.description,
    keywords: template.keywords,
    openGraph: {
      title: `${template.title} | ChatSa`,
      description: template.description,
      type: 'website',
      url: `https://chatsa.com/chatbot-templates/${template.slug}`,
      images: [
        {
          url: '/api/placeholder/1200/630',
          width: 1200,
          height: 630,
          alt: template.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${template.title} | ChatSa`,
      description: template.description,
      images: ['/api/placeholder/1200/630'],
    },
    alternates: {
      canonical: `https://chatsa.com/chatbot-templates/${template.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 