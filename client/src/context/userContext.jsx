import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    if (token && !user) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            "http://localhost:3000/api/auth/get-user-details",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (isMounted) setUser(response.data.user);
        } catch (err) {
          console.error("Error fetching user data:", err);
          localStorage.removeItem("token");
          if (isMounted) setError(err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const logout = () => {
    setUser(null);
    setLoading(false);
    setError(null);
    localStorage.removeItem("token");
  };

  const refreshLinks = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        setUser,
        refreshLinks,
        refreshTrigger,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserState = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
