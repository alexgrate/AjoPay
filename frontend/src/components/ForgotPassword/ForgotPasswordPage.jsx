import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { KeyRound, Mail, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom"

const MotionLink = motion.create(Link);

const floatingIcons = [
    { x: "8%",  size: 36, delay: 0,   duration: 5.0 },
    { x: "18%", size: 28, delay: 1.4, duration: 4.4 },
    { x: "30%", size: 22, delay: 0.7, duration: 5.8 },
    { x: "62%", size: 30, delay: 2.0, duration: 4.6 },
    { x: "74%", size: 24, delay: 0.3, duration: 5.2 },
    { x: "84%", size: 32, delay: 1.1, duration: 4.8 },
    { x: "92%", size: 20, delay: 2.6, duration: 5.4 },
    { x: "46%", size: 26, delay: 1.7, duration: 4.2 },
];

const FloatingMail = ({ x, size, delay, duration }) => (
    <motion.div
        style={{
        position: "fixed",
        left: x,
        bottom: "-60px",
        pointerEvents: "none",
        zIndex: 0,
        }}
        animate={{
        y: [0, -(typeof window !== "undefined" ? window.innerHeight + 80 : 900)],
        opacity: [0, 0.18, 0.18, 0],
        rotate: [-8, 8, -4, 6, 0],
        }}
        transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.08, 0.88, 1],
        }}
    >
        <Mail size={size} color="#2d3b1f" strokeWidth={1.2} />
    </motion.div>
);

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [focused, setFocused] = useState(false);
    const [sent, setSent] = useState(false);

    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 22 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    });

    const handleSubmit = () => {
        if (email.trim()) setSent(true);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(145deg, #f5f0e8 0%, #eef5ee 60%, #e8f0e0 100%)",
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                padding: "40px 16px", 
                position: "relative", 
                overflow: "hidden",
            }}
        >
            {floatingIcons.map((ic, i) => <FloatingMail key={i} {...ic} />)}

            <div 
                style={{
                    position: "fixed", width: 600, height: 600, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(45,59,31,0.05) 0%, transparent 70%)",
                    top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    pointerEvents: "none", zIndex: 0,
                }} 
            />     

            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 48, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    background: "#fff",
                    borderRadius: 28,
                    padding: "clamp(36px, 6vw, 56px) clamp(28px, 6vw, 52px)",
                    width: "100%", maxWidth: 460,
                    position: "relative", zIndex: 1,
                    boxShadow: "0 8px 60px rgba(0,0,0,0.09), 0 2px 12px rgba(0,0,0,0.05)",
                    textAlign: "center",
                }}
            >
                {!sent ? (
                    <>
                        <motion.div {...fadeUp(0)} style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                            <motion.div
                                animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                                style={{
                                    width: 72, 
                                    height: 72, 
                                    borderRadius: 20,
                                    background: "#2d3b1f",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    boxShadow: "0 8px 28px rgba(45,59,31,0.28)",
                                }}
                            >
                                <KeyRound size={32} color="#d4a843" strokeWidth={1.8} />
                            </motion.div>
                        </motion.div>

                        <motion.h1
                            {...fadeUp(0.08)}
                            style={{
                                fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
                                fontWeight: 900, color: "#2d3b1f",
                                marginBottom: 12,
                            }}
                            className="font-display"
                        >
                            Forgot Password?
                        </motion.h1>

                        <motion.p
                            {...fadeUp(0.14)}
                            style={{ 
                                fontSize: "0.93rem", 
                                color: "#2d3b1f80", 
                                lineHeight: 1.7, 
                                marginBottom: 36, 
                                maxWidth: 300, 
                                margin: "0 auto 32px" 
                            }}
                        >
                            No wahala! Enter your email and we'll send you a reset link
                        </motion.p>

                        <motion.div {...fadeUp(0.2)} style={{ textAlign: "left", marginBottom: 16 }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2d3b1f", display: "block", marginBottom: 8 }}>
                                Email Address
                            </label>

                            <motion.div
                                animate={{
                                    borderColor: focused ? "#2d3b1f" : "#e8e2d8",
                                    boxShadow: focused ? "0 0 0 3px rgba(45,59,31,0.1)" : "none",
                                }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 10,
                                    border: "1.5px solid #e8e2d8", 
                                    borderRadius: 12,
                                    padding: "14px 16px", 
                                    background: "#fff",
                                }}
                            >
                                <input
                                    className="fp-input"
                                    type="email"
                                    placeholder=""
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div {...fadeUp(0.26)} style={{ marginBottom: 20 }}>
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#1e2e16" }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleSubmit}
                                style={{
                                    width: "100%", 
                                    background: "#2d3b1f", 
                                    color: "#fff",
                                    border: "none", 
                                    borderRadius: 12, 
                                    padding: "16px",
                                    fontSize: "1rem", 
                                    fontWeight: 700, 
                                    cursor: "pointer",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    gap: 10,
                                    boxShadow: "0 4px 20px rgba(45,59,31,0.28)",
                                    transition: "background 0.2s ease",
                                }}
                            >
                                Send Reset Link
                                <Send size={18} strokeWidth={2} />
                            </motion.button>
                        </motion.div>

                        <motion.div {...fadeUp(0.32)}>
                            <MotionLink
                                to="/login"
                                whileHover={{ x: -3, color: "#2d3b1f" }}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    fontSize: "0.9rem", fontWeight: 600, color: "#2d3b1f99",
                                    textDecoration: "none", transition: "color 0.2s ease",
                                }}
                            >
                                <ArrowLeft size={16} strokeWidth={2} />
                                Back to Login
                            </MotionLink>
                        </motion.div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ padding: "16px 0" }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                width: 72, 
                                height: 72, 
                                borderRadius: 20,
                                background: "#2d3b1f",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                margin: "0 auto 24px",
                                boxShadow: "0 8px 28px rgba(45,59,31,0.28)",
                            }}
                        >
                            <Mail size={32} color="#d4a843" strokeWidth={1.8} />
                        </motion.div>

                        <h2 style={{ fontSize: "1.7rem", fontWeight: 900, color: "#2d3b1f", marginBottom: 12 }} className="font-display">
                            Check Your Email!
                        </h2>
                        <p style={{ fontSize: "0.93rem", color: "#2d3b1f80", lineHeight: 1.7, marginBottom: 28, maxWidth: 280, margin: "0 auto 28px" }}>
                            We sent a password reset link to <strong style={{ color: "#2d3b1f" }}>{email}</strong>
                        </p>
                        <MotionLink
                            to="/login"
                            whileHover={{ x: -3, color: "#2d3b1f" }}
                            style={{
                                display: "inline-flex", 
                                alignItems: "center", 
                                gap: 6,
                                fontSize: "0.9rem", 
                                fontWeight: 600, 
                                color: "#2d3b1f99",
                                textDecoration: "none",
                            }}
                        >
                            <ArrowLeft size={16} strokeWidth={2} />
                            Back to Login
                        </MotionLink>
                    </motion.div>
                )}
            </motion.div>  

            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{
                    marginTop: 28, fontSize: "0.87rem",
                    color: "#2d3b1f70", position: "relative", zIndex: 1,
                }}
            >
                Need help?{" "}
                <MotionLink
                    to="#"
                    whileHover={{ color: "#2d3b1f" }}
                    style={{ color: "#2d3b1f", fontWeight: 700, textDecoration: "none" }}
                >
                    Contact Support
                </MotionLink>
            </motion.p>     
        </div>
    )
}

export default ForgotPasswordPage