 "use client";
 
 import { useState } from "react";
 import Link from "next/link";
 
 interface TutorialCard {
   id: string;
   title: string;
   description: string;
   videoUrl: string;
   thumbnailUrl: string;
 }
 
 const tutorials: TutorialCard[] = [
   {
     id: "customize-font",
     title: "Customizing Chatbot Font",
     description: "Learn how to change the font style, size, and color of your chatbot interface",
     videoUrl: "https://example.com/videos/customize-font.mp4",
     thumbnailUrl: "https://example.com/thumbnails/customize-font.jpg"
   },
   {
     id: "theme-colors",
     title: "Theme Colors",
     description: "Customize your chatbot's color scheme and theme",
     videoUrl: "https://example.com/videos/theme-colors.mp4",
     thumbnailUrl: "https://example.com/thumbnails/theme-colors.jpg"
   },
   {
     id: "layout-customization",
     title: "Layout Customization",
     description: "Adjust the layout and positioning of chat elements",
     videoUrl: "https://example.com/videos/layout-customization.mp4",
     thumbnailUrl: "https://example.com/thumbnails/layout-customization.jpg"
   }
 ];
 
 export default function ChatbotStylingPage() {
   const [selectedTutorial, setSelectedTutorial] = useState<TutorialCard | null>(null);
 
   return (
     <div className="flex-1">
       <div className="flex items-center gap-4 mb-8">
         <Link
           href="/guide/chatsa-academy"
           className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
         >
           <svg
             className="w-5 h-5"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M15 19l-7-7 7-7"
             />
           </svg>
           Back to Academy
         </Link>
         <span className="text-gray-400">/</span>
         <h1 className="text-4xl font-bold">Chatbot Styling</h1>
       </div>
 
       {selectedTutorial ? (
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <button
             onClick={() => setSelectedTutorial(null)}
             className="text-blue-500 hover:text-blue-600 mb-4 flex items-center gap-2"
           >
             <svg
               className="w-5 h-5"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M15 19l-7-7 7-7"
               />
             </svg>
             Back to tutorials
           </button>
           
           <h2 className="text-2xl font-bold mb-4">{selectedTutorial.title}</h2>
           
           <div className="aspect-video mb-6">
             <video
               className="w-full h-full rounded-lg"
               controls
               poster={selectedTutorial.thumbnailUrl}
             >
               <source src={selectedTutorial.videoUrl} type="video/mp4" />
               Your browser does not support the video tag.
             </video>
           </div>
           
           <div className="prose max-w-none">
             <p className="text-gray-600">{selectedTutorial.description}</p>
             {/* Add more detailed content here */}
           </div>
         </div>
       ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {tutorials.map((tutorial) => (
             <button
               key={tutorial.id}
               onClick={() => setSelectedTutorial(tutorial)}
               className="block text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors"
             >
               <div className="aspect-video mb-4">
                 <img
                   src={tutorial.thumbnailUrl}
                   alt={tutorial.title}
                   className="w-full h-full object-cover rounded-lg"
                 />
               </div>
               <h3 className="text-xl font-semibold mb-2">{tutorial.title}</h3>
               <p className="text-gray-600">{tutorial.description}</p>
             </button>
           ))}
         </div>
       )}
     </div>
   );
 } 