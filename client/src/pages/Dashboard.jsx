import React, { useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateLinkForm } from "@/components/CreateLinkForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserState } from "@/context/userContext";
import axios from "axios";

const dummyLinks = [
  {
    _id: "1",
    qr: "https://via.placeholder.com/150",
    title: "Google",
    longUrl: "https://www.google.com",
    ShortUrl: "https://swap.nishanthks.me/g123",
    CustomeUrl: "https://swap.nishanthks.me/my-google",
  },
  {
    _id: "2",
    qr: "https://via.placeholder.com/150",
    title: "GitHub",
    longUrl: "https://www.github.com",
    ShortUrl: "https://swap.nishanthks.me/gh456",
    CustomeUrl: "https://swap.nishanthks.me/my-github",
  },
];

function Dashboard() {
  const [searchParams] = useSearchParams();
  const { user, loading, logout, refreshTrigger } = useUserState();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const link = searchParams.get("link");
  console.log(user);

  // Authentication and routing check
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch user's links
  useEffect(() => {
    const fetchLinks = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/urls/getUrls`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setLinks(response.data.urls || []);
        } catch (error) {
          console.error("Error fetching links:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLinks();
  }, [user, refreshTrigger]);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="flex flex-col gap-5 my-5">
        {/* Combined welcome and search section */}
        <div className="relative p-6 rounded-lg bg-gradient-to-br from-black/5 via-blue-800/20 to-blue-950 border border-white/3">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                Welcome, {user?.username || "User"}
                Email, {user?.email}
              </h1>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white">
                Logout
              </Button>
            </div>

            <div className="flex gap-3 items-center">
              <Input
                placeholder="Search links..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                <Search className="text-white" />
              </Button>
              <CreateLinkForm />
            </div>
          </div>
        </div>

        {/* Link Cards */}
        <div className="border border-white/5 bg-blue-500/3 rounded-lg flex flex-col lg:grid sm:grid-cols-2 gap-4 p-4">
          {isLoading ? (
            <p className="text-white">Loading links...</p>
          ) : links.length > 0 ? (
            links.map((link) => (
              <LinkCard
                key={link.id}
                qr={link.qr_link}
                title={link.title}
                longUrl={link.OriginalUrl}
                ShortUrl={`https://swap.nishanthks.me/${link.shortUrl}`}
                CustomeUrl={
                  link.customUrl
                    ? `https://swap.nishanthks.me/${link.customUrl}`
                    : "None"
                }
                _id={link.id}
              />
            ))
          ) : (
            dummyLinks.map((link) => (
              <LinkCard
                key={link._id}
                qr={link.qr}
                title={link.title}
                longUrl={link.longUrl}
                ShortUrl={link.ShortUrl}
                CustomeUrl={link.CustomeUrl}
                _id={link._id}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
