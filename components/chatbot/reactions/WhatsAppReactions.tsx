"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";

const WhatsAppReactions = () => {
  return (
    <div className="p-0 h-full">
      {/* Fixed WhatsApp header */}
      <div className="fixed top-[120px] left-[70px] md:left-48 right-0 z-10">
        <div className="bg-[#25D366] text-white p-6">
          <div className="flex items-center gap-3">
            <IconBrandWhatsapp className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">WhatsApp Reactions</h1>
              <p className="mt-1 text-white/80">Manage your WhatsApp chatbot reactions and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content with top padding for fixed header */}
      <div className="flex flex-col gap-6 p-6 bg-[#F7F9F9] mt-[120px]">
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default WhatsAppReactions; 