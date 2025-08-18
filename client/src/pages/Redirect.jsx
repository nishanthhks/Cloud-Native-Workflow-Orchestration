import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Redirect() {
  const { shortUrl } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/redirect/get-long-url/${shortUrl}`);
        if (response.data.originalUrl) {
          window.location.href = response.data.originalUrl; // Client-side redirect
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching original URL:", error);
        setError(true);
        setLoading(false);
      }
    };
    
    fetchOriginalUrl();
  }, [shortUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="p-8 bg-card rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Redirect Failed</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the destination for this link.</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="p-8 bg-card rounded-lg shadow-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Redirecting you to your destination...</h1>
        <p className="text-muted-foreground mb-6">You'll be redirected automatically in a moment.</p>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default Redirect;
