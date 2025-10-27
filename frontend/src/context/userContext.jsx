import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New state to track loading

  useEffect(() => {
    // If user is already loaded, no need to fetch again
    if (user) return;

    const accessToken = localStorage.getItem("token");

    // If no access token, user is not authenticated, stop loading
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        // Clear user data if authentication fails
        // clearUser(); // Assuming clearUser is a function to clear user data and token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Run once on component mount

  // Function to update user data (e.g., after login)
  const updateUser = (userData) => {
    setUser(userData);
    if (userData && userData.token) {
      localStorage.setItem("token", userData.token); // Save token to local storage
    }
    setLoading(false); // Stop loading after update
  };

  // Function to clear user data (e.g., on logout)
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token"); // Remove token from local storage
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;