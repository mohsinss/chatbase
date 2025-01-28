"use client";

import React, { useEffect } from 'react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}
const FacebookSDK = (): React.ReactElement => {
  useEffect(() => {
    if (!window.FB) {
      const loadFacebookSDK = () => {
        window.fbAsyncInit = () => {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0',
          });
        };

        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      };

      loadFacebookSDK();
    }
  }, []);

  return null;
}

export default FacebookSDK;