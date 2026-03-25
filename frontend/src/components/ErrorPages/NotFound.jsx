import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Coins, Home, ArrowLeft } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

const floats = [
    { x: "5%",  size: 22, delay: 0,   dur: 5.2 },
    { x: "15%", size: 15, delay: 1.4, dur: 4.6 },
    { x: "28%", size: 18, delay: 0.7, dur: 5.8 },
    { x: "55%", size: 12, delay: 2.1, dur: 4.4 },
    { x: "70%", size: 20, delay: 0.4, dur: 5.0 },
    { x: "82%", size: 14, delay: 1.8, dur: 4.8 },
    { x: "93%", size: 16, delay: 0.9, dur: 5.4 },
];

const FloatCoin = ({ x, size, delay, dur }) => (
    <motion.div
        style={{ position: "fixed", left: x, bottom: -50, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1100], opacity: [0, 0.13, 0.13, 0] }}
        transition={{ duration: dur, delay, repeat: Infinity, ease: "linear", times: [0, 0.08, 0.88, 1] }}>
        <Coins size={size} color="#d4a843" strokeWidth={1.2} />
    </motion.div>
);

export default function NotFound() {
    usePageTitle("Page Not Found");
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
            {floats.map((c, i) => <FloatCoin key={i} {...c} />)}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 480 }}>

                <motion.div
                    animate={{ rotate: [0, 10, -10, 6, 0], y: [0, -12, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1 }}
                    style={{ width: 100, height: 100, background: "linear-gradient(135deg,#2d3b1f,#4a6030)", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 16px 48px rgba(45,59,31,0.28)" }}>
                    <Coins size={48} color="#d4a843" strokeWidth={1.4} />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
                    style={{ fontSize: "clamp(5rem,15vw,8rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", lineHeight: 1, marginBottom: 8 }}>
                    404
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}>
                    <h2 style={{ fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 12 }}>
                        Page Not Found
                    </h2>
                    <p style={{ fontSize: "0.95rem", color: "#2d3b1f80", lineHeight: 1.7, marginBottom: 32, maxWidth: 360, margin: "0 auto 32px" }}>
                        Looks like this coin got lost. The page you're looking for doesn't exist or has been moved.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(-1)}
                        style={{ display: "flex", alignItems: "center", gap: 7, background: "#f0ece4", color: "#2d3b1f", border: "none", borderRadius: 13, padding: "13px 22px", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        <ArrowLeft size={16} strokeWidth={2.5} />Go Back
                    </motion.button>

                    <Link to="/dashboard">
                        <motion.div
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            style={{ display: "flex", alignItems: "center", gap: 7, background: "#2d3b1f", color: "#fff", borderRadius: 13, padding: "13px 22px", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 18px rgba(45,59,31,0.28)" }}>
                            <Home size={16} strokeWidth={2.5} />Go to Dashboard
                        </motion.div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#d4a843,#2d3b1f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Coins size={15} color="#fff" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: "1rem", fontWeight: 700 }}>
                        <span style={{ color: "#2d3b1f" }}>Ajo</span>
                        <span style={{ color: "#d4a843" }}>Pay</span>
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
}