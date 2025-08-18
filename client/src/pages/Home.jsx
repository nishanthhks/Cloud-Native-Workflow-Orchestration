import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateLinkForm } from "@/components/CreateLinkForm";
import { useUserState } from "@/context/userContext";

function Home() {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const { user } = useUserState();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard/?link=" + link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900/20 to-blue-950">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-white">SWAPURL</div>
            <div className="flex gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate("/login")}
                    variant="ghost" 
                    className="text-white hover:bg-white/10"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate("/signup")}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Shorten Your Links with <span className="text-blue-400">SWAPURL</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create short, memorable links and QR codes for your URLs. Track clicks and analyze your audience.
          </p>
        </div>

        {/* URL Shortener Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter your long URL here"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
              >
                Shorten URL
              </Button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">QR Code Generation</h3>
            <p className="text-gray-300">Generate QR codes for your shortened links instantly.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Link Analytics</h3>
            <p className="text-gray-300">Track clicks and analyze your audience with detailed statistics.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Custom URLs</h3>
            <p className="text-gray-300">Create custom, branded short links for your business.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
