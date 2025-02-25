"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function CompanyLogos() {
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const firstRow = firstRowRef.current;
    const secondRow = secondRowRef.current;
    
    if (!firstRow || !secondRow) return;
    
    // Clone logos for infinite scroll
    const cloneLogos = (row: HTMLDivElement) => {
      const logos = Array.from(row.children);
      logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        row.appendChild(clone);
      });
    };
    
    cloneLogos(firstRow);
    cloneLogos(secondRow);
    
    // Set animation
    firstRow.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${firstRow.scrollWidth / 2}px)` }
      ],
      {
        duration: 30000,
        iterations: Infinity
      }
    );
    
    secondRow.animate(
      [
        { transform: `translateX(-${secondRow.scrollWidth / 2}px)` },
        { transform: 'translateX(0)' }
      ],
      {
        duration: 30000,
        iterations: Infinity
      }
    );
  }, []);

  const logos = [
    "/logos/logo1.svg",
    "/logos/logo2.svg",
    "/logos/logo3.svg",
    "/logos/logo4.svg",
    "/logos/logo5.svg",
    "/logos/logo6.svg",
    "/logos/logo7.svg",
    "/logos/logo8.svg",
    "/logos/logo9.svg",
    "/logos/logo10.svg"
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8" data-aos="fade-up">
          <h3 className="text-xl font-semibold text-gray-700">Trusted by companies worldwide</h3>
        </div>
        
        <div className="overflow-hidden" data-aos="fade-up">
          <div className="relative w-full overflow-hidden py-6">
            <div ref={firstRowRef} className="flex space-x-16 absolute whitespace-nowrap">
              {logos.slice(0, 5).map((logo, index) => (
                <div key={index} className="flex-shrink-0">
                  <Image
                    src={logo}
                    alt="Company logo"
                    width={120}
                    height={40}
                    className="opacity-60 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative w-full overflow-hidden py-6 mt-4">
            <div ref={secondRowRef} className="flex space-x-16 absolute whitespace-nowrap">
              {logos.slice(5).map((logo, index) => (
                <div key={index} className="flex-shrink-0">
                  <Image
                    src={logo}
                    alt="Company logo"
                    width={120}
                    height={40}
                    className="opacity-60 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 