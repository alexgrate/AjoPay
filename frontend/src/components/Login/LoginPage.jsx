import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Coins, User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../AxiosInstance";
import usePageTitle from "../../hooks/usePageTitle";

const MotionLink = motion.create(Link);

const moneyBags = [
    { x: "5%",   y: "15%", size: 38, delay: 0,   duration: 4.5, rotate: -12 },
    { x: "12%",  y: "55%", size: 30, delay: 1.2, duration: 5.0, rotate: 8  },
    { x: "3%",   y: "78%", size: 44, delay: 0.5, duration: 4.2, rotate: -6 },
    { x: "20%",  y: "82%", size: 28, delay: 2.0, duration: 5.4, rotate: 15 },
    { x: "78%",  y: "12%", size: 32, delay: 0.8, duration: 4.8, rotate: -10},
    { x: "88%",  y: "38%", size: 40, delay: 1.5, duration: 4.0, rotate: 6  },
    { x: "82%",  y: "68%", size: 26, delay: 0.3, duration: 5.2, rotate: -8 },
    { x: "72%",  y: "85%", size: 36, delay: 2.4, duration: 4.6, rotate: 12 },
];

const MoneyBag = ({ x, y, size, delay, duration, rotate }) => (
    <motion.div
        style={{
            position: "fixed",
            left: x,
            top: y,
            fontSize: size,
            opacity: 0.18,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
            rotate,
        }}
        animate={{ y: [0, -20, 0], rotate: [rotate - 5, rotate + 5, rotate - 5] }}
        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
        💰
    </motion.div>
);

const LoginPage = () => {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    usePageTitle("Login");

    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 24 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    });

    const handleLogin = async () => {
        if (!email.trim()) return setError("Email is required")
        if (!password.trim()) return setError("Password is required")

        setLoading(true)
        setError("")

        try {
            const response = await AxiosInstance.post("api/accounts/login/", {
                email: email.trim().toLowerCase(),
                password: password,
            })

            const { tokens, user } = response.data

            localStorage.setItem("access_token", tokens.access)
            localStorage.setItem("refresh_token", tokens.refresh)

            localStorage.setItem("user", JSON.stringify(user))

            if(!remember) {
                sessionStorage.setItem("access_token", tokens.access)
                sessionStorage.setItem("refresh_token", tokens.refresh)
            }

            navigate("/dashboard")
        } catch (err) {
            if (err.response?.data) {
                const data = err.response.data

                setError(
                    data.error ||
                    data.non_field_errors?.[0] ||
                    data.email?.[0] ||
                    data.detail ||
                    "Invalid email or password"
                )
            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }


    return (
        <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", overflow: "hidden" }}>
            
            {moneyBags.map((b, i) => <MoneyBag key={i} {...b} />)}

            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    background: "#ffffff",
                    borderRadius: 28,
                    padding: "48px 40px 40px",
                    width: "100%",
                    maxWidth: 440,
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 8px 60px rgba(0,0,0,0.10), 0 2px 12px rgba(0,0,0,0.06)",
                }}
            >
                <motion.div {...fadeUp(0)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        style={{
                            width: 44, 
                            height: 44, 
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #d4a843, #2d3b1f)",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                        }}
                    >
                        <Coins size={22} color="#fff" strokeWidth={1.8} />
                    </motion.div>
                    <span style={{ fontSize: "1.3rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                        <span style={{ color: "#2d3b1f" }}>Ajo</span>
                        <span style={{ color: "#d4a843" }}>Pay</span>
                    </span>
                </motion.div>

                <motion.div {...fadeUp(0.08)} style={{ textAlign: "center", marginBottom: 32 }}>
                    <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "#2d3b1f", marginBottom: 8 }} className="font-display">
                        Welcome Back
                    </h1>
                    <p style={{ fontSize: "0.93rem", color: "#2d3b1f80", fontWeight: 400 }}>
                        Continue your savings journey
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: "#fff0f0",
                            border: "1.5px solid #fff0d0",
                            borderRadius: 10,
                            padding: "10px 14px",
                            fontSize: "0.84rem",
                            color: "#e84343",
                            fontWeight: 600,
                            marginBottom: 16,
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <motion.div {...fadeUp(0.16)} style={{ marginBottom: 16 }}>
                    <motion.div
                        animate={{ borderColor: emailFocused ? "#d4a843" : "#e8e2d8", boxShadow: emailFocused ? "0 0 0 3px rgba(212,168,67,0.12)" : "none" }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e8e2d8", borderRadius: 14, padding: "14px 16px", background: "#fff" }}
                    >
                    <User size={18} color={emailFocused ? "#d4a843" : "#b0b8a8"} strokeWidth={1.8} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Email Address"
                        value={email}
                        onChange={e =>{ setEmail(e.target.value); setError(" "); }}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                    />
                    </motion.div>
                </motion.div>

                <motion.div {...fadeUp(0.22)} style={{ marginBottom: 16 }}>
                    <motion.div
                        animate={{ borderColor: passwordFocused ? "#d4a843" : "#e8e2d8", boxShadow: passwordFocused ? "0 0 0 3px rgba(212,168,67,0.12)" : "none" }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e8e2d8", borderRadius: 14, padding: "14px 16px", background: "#fff" }}
                    >
                        <Lock size={18} color={passwordFocused ? "#d4a843" : "#b0b8a8"} strokeWidth={1.8} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                        <input
                            className="login-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(""); }}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                        />
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowPassword(v => !v)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}
                        >
                            {showPassword
                            ? <EyeOff size={18} color="#b0b8a8" strokeWidth={1.8} />
                            : <Eye size={18} color="#b0b8a8" strokeWidth={1.8} />}
                        </motion.button>
                    </motion.div>
                </motion.div>

                <motion.div {...fadeUp(0.28)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div
                        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                        onClick={() => setRemember(v => !v)}
                    >
                        <motion.div
                            className={`checkbox-custom ${remember ? "checked" : ""}`}
                            animate={{ scale: remember ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.25 }}
                        >
                            {remember && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </motion.div>
                        <span style={{ fontSize: "0.87rem", color: "#2d3b1f99", userSelect: "none" }}>Remember me</span>
                    </div>
                    <MotionLink
                        to="/forgotten-password"
                        whileHover={{ color: "#c49a35" }}
                        style={{ fontSize: "0.87rem", fontWeight: 600, color: "#d4a843", textDecoration: "none" }}
                    >
                        Forgot Password?
                    </MotionLink>
                </motion.div>

                <motion.div {...fadeUp(0.34)} style={{ marginBottom: 20 }}>
                    <motion.button
                        onClick={handleLogin}
                        disabled={loading}
                        whileHover={loading ? { scale: 1.02, backgroundColor: "#c49a35" } : {}}
                        whileTap={loading ? { scale: 0.97 } : {}}
                        style={{
                            width: "100%",
                            background: loading ? "#e8c87a" : "#d4a843",
                            color: "#2d3b1f",
                            border: "none",
                            borderRadius: 14,
                            padding: "16px",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            boxShadow: "0 4px 20px rgba(212,168,67,0.35)",
                            transition: "background 0.2s ease",
                        }}
                    >
                        <LogIn size={20} strokeWidth={2} />
                        {loading ? "Logging in..." : "Login to Dashboard"}
                    </motion.button>
                </motion.div>

                <motion.p {...fadeUp(0.46)} style={{ textAlign: "center", fontSize: "0.9rem", color: "#2d3b1f80" }}>
                    Don't have an account?{" "}
                    <MotionLink
                        to="/register"
                        whileHover={{ color: "#c49a35" }}
                        style={{ color: "#d4a843", fontWeight: 700, textDecoration: "none" }}
                    >
                        Register
                    </MotionLink>
                </motion.p>

            </motion.div>
        </div>
    )
}

export default LoginPage