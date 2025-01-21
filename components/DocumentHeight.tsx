'use client'

import React, { useEffect } from 'react';

const DocumentHeight = (): React.ReactElement => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const documentHeight = () => {
        if (timeoutId) clearTimeout(timeoutId); // avoid execution of previous timeouts
        timeoutId = setTimeout(() => {
          const doc = document.documentElement;
          doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
        }, 200);
      };
      window.addEventListener('resize', documentHeight);
      documentHeight();

      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener('resize', documentHeight);
      };
    }
  }, []);

  return null;
}

export default DocumentHeight;