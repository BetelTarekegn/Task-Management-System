import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Note: It says "react-router-don" in the image, assuming a typo and it means "react-router-dom"
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) return;
        if (!user) { // Assuming !user was intended here instead of (fuser) as seen in the image
            clearUser();
            navigate("/login");
        }
    }, [user, loading, clearUser, navigate]);
};
