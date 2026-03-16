import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://societymaintenanceapi.onrender.com";

export const BackendWaker = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const wakeUp = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/health`);
        if (response.ok) setIsReady(true);
        else throw new Error();
      } catch {
        setTimeout(wakeUp, 3000);
      }
    };
    wakeUp();
  }, []);

  if (!isReady) {
    return (
      <div className="loader-overlay">
        <div className="loader-content">

          {/* The Fancy Spinner */}
          <div className="fancy-spinner">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>

          <p className="loading-text">Please wait... <span className="coffee-icon">☕</span></p>
        </div>

        <style>{`
          .loader-overlay {
            height: 100vh; width: 100vw; display: flex;
            justify-content: center; align-items: center;
            background: #ffffff; font-family: 'Inter', system-ui, sans-serif;
          }
          .loader-content { text-align: center; position: relative; }

          /* Coffee Symbol Styling */
          .coffee-icon {
            display: block;
            font-size: 64px; /* Adjust this to make it even bigger */
            margin-bottom: 20px;
            animation: bounce 2s ease-in-out infinite;
          }

          /* Fancy Triple-Ring Spinner */
          .fancy-spinner {
            position: relative; width: 80px; height: 80px; margin: 0 auto;
          }
          .ring {
            position: absolute; width: 100%; height: 100%;
            border: 4px solid transparent;
            border-top-color: #3498db; border-radius: 50%;
            animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          }
          .ring:nth-child(1) { border-top-color: #3498db; animation-delay: -0.45s; }
          .ring:nth-child(2) { border-top-color: #2ecc71; animation-delay: -0.3s; }
          .ring:nth-child(3) { border-top-color: #e74c3c; animation-delay: -0.15s; }

          .loading-text {
            margin-top: 30px; font-weight: 500; color: #555;
            letter-spacing: 0.5px;
          }

          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};