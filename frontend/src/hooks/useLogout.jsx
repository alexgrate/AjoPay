import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../components/AxiosInstance";

export const useLogout = () => {
    const navigate  = useNavigate();
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        try {
            const refresh = localStorage.getItem("refresh_token");
            if (refresh) {
                await AxiosInstance.post("api/auth/logout/", { refresh });
            }
        } catch {
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            setLoading(false);
            navigate("/login");
        }
    };

    return { logout, loading };
};


import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export const LogoutButton = ({ variant = "default" }) => {
    const { logout, loading } = useLogout();

    if (variant === "text") {
        return (
            <motion.button
                onClick={logout}
                disabled={loading}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                    background: "none",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: loading ? "#2d3b1f60" : "#e84343",
                    fontFamily: "'DM Sans', sans-serif",
                    padding: "8px 4px",
                }}
            >
                {loading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #e8434455", borderTopColor: "#e84343" }}
                    />
                ) : (
                    <LogOut size={14} strokeWidth={2} />
                )}
                {loading ? "Logging out…" : "Log out"}
            </motion.button>
        );
    }

    return (
        <motion.button
            onClick={logout}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03, backgroundColor: loading ? "#f4f0ea" : "#ffe8e8" }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            style={{
                background: "#f4f0ea",
                border: "1.5px solid #e8e2d8",
                borderRadius: 12,
                padding: "11px 20px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.88rem",
                fontWeight: 700,
                color: loading ? "#2d3b1f60" : "#e84343",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s, color 0.2s",
            }}
        >
            {loading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid #e8434455", borderTopColor: "#e84343" }}
                />
            ) : (
                <LogOut size={15} strokeWidth={2} />
            )}
            {loading ? "Logging out…" : "Log out"}
        </motion.button>
    );
};