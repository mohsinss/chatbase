"use client";

import { useState } from 'react';
const WhatsAppConnectButton = (): React.ReactElement => {
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    setLoading(true);
    
    window.FB.login((response: any) => {
      if (response.authResponse) {
        const { accessToken } = response.authResponse;
        // Send token to backend
        handleAuthCallback(accessToken);
      }
    }, {
      scope: 'business_management,whatsapp_business_management',
    });
  };

  const handleAuthCallback = async (token: string) => {
    try {
      const res = await fetch('/api/auth/facebook', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      console.log(data)
      // Handle business account selection
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleFacebookLogin}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect WhatsApp'}
    </button>
  );
}

export default WhatsAppConnectButton;