"use client";

import { useEffect, useRef } from "react";

export default function CompanyLogos() {
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  
  // Updated logos with better visibility
  const firstRowLogos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", alt: "Amazon" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg", alt: "Spotify" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg", alt: "Dropbox" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", alt: "Airbnb" }
  ];
  
  const secondRowLogos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png", alt: "Google" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", alt: "Netflix" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png", alt: "Slack" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", alt: "Stripe" }
  ];
  
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
        duration: 50000,
        iterations: Infinity
      }
    );
    
    secondRow.animate(
      [
        { transform: `translateX(-${secondRow.scrollWidth / 2}px)` },
        { transform: 'translateX(0)' }
      ],
      {
        duration: 80000,
        iterations: Infinity
      }
    );
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold py-2 px-6 bg-purple-100 text-purple-800 inline-block rounded-lg">
            Trusted by companies worldwide
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <div className="relative w-full overflow-hidden py-6 h-32">
            <div ref={firstRowRef} className="flex absolute whitespace-nowrap">
              {firstRowLogos.map((logo, index) => (
                <div key={index} className="flex-shrink-0 w-64 mx-16 h-32 flex items-center justify-center">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-auto w-auto max-h-28 max-w-[220px] object-contain opacity-100 hover:opacity-80 transition-opacity duration-300 filter drop-shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative w-full overflow-hidden py-6 mt-8 h-32">
            <div ref={secondRowRef} className="flex absolute whitespace-nowrap">
              {secondRowLogos.map((logo, index) => (
                <div key={index} className="flex-shrink-0 w-64 mx-16 h-32 flex items-center justify-center">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-auto w-auto max-h-28 max-w-[220px] object-contain opacity-100 hover:opacity-80 transition-opacity duration-300 filter drop-shadow-sm"
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