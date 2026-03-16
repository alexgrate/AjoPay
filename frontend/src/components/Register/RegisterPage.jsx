import { useRef, useState } from 'react'
import { motion, useInView } from "framer-motion"
import { Coins, User, Mail, Phone, Lock, UserPlus, ShieldCheck, Users, Bell, Headphones } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"
import AxiosInstance from '../AxiosInstance';

const features = [
    { icon: ShieldCheck, label: "Bank-level security with Paystack" },
    { icon: Users,       label: "Join trusted groups instantly" },
    { icon: Bell,        label: "Real-time payout notifications" },
    { icon: Headphones,  label: "24/7 customer support" },
];

const FeatureItem = ({ icon: Icon, label, delay, inView }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover="shake"
        style={{ display: "flex", alignItems: "center", gap: 14 }}
    >
        <motion.div
            variants={{
                shake: {
                rotate: [0, -12, 12, -8, 8, -4, 4, 0],
                transition: { duration: 0.55, ease: "easeInOut" },
                },
            }}
            style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                backdropFilter: "blur(4px)",
            }}
        >
            <Icon size={18} color="#fff" strokeWidth={1.8} />
        </motion.div>
        <span style={{ fontSize: "0.92rem", color: "rgba(255, 255, 255, 0.88)", fontWeight: 500 }}>
            {label}
        </span>
    </motion.div>

)

const MotionLink = motion.create(Link);

const RegisterPage = () => {
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [focused, setFocused] = useState(null);
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})


    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        phone: "", 
        password: "", 
        confirm: "",
    });

    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    const handleChange = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));

        setErrors(e => ({ ...e, [field]: null }));
    }

    const handleSubmit = async () => {

        const newErrors = {}
        if (!form.name.trim()) newErrors.name = "Full name is required"
        if (!form.email.trim())    newErrors.email    = "Email is required"
        if (!form.phone.trim())    newErrors.phone    = "Phone number is required"
        if (!form.password.trim()) newErrors.password = "Password is required"
        if (!form.confirm.trim())  newErrors.confirm  = "Please confirm your password"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        
        setLoading(true)
        setErrors({})

        try{
            const response = await AxiosInstance.post('api/accounts/register/', {
                full_name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                confirm_password: form.confirm,
            })

            console.log("Registered:", response.data)
            localStorage.setItem("access_token", response.data.tokens.access)
            localStorage.setItem("refresh_token", response.data.tokens.refresh)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            navigate('/verify-bvn')

        } catch (error) {
            if (error.response?.data) {

                const data = error.response.data
                setErrors({
                    name: data.full_name?.[0],
                    email: data.email?.[0],
                    phone: data.phone?.[0],
                    password: data.password?.[0],
                    confirm: data.confirm_password?.[0],
                    general: data.non_field_errors?.[0],
                })
            } else {
                setErrors({ general: "Something went wrong. Please try again." })
            }
        } finally {
            setLoading(false)
        }
    }

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 22 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    });

    const inputBox = (isFocused) => ({
        display: "flex", alignItems: "center", gap: 10,
        border: `1.5px solid ${isFocused ? "#d4a843" : "#e8e2d8"}`,
        borderRadius: 12,
        padding: "13px 14px",
        background: "#fff",
        boxShadow: isFocused ? "0 0 0 3px rgba(212,168,67,0.12)" : "none",
        transition: "all 0.2s ease",
    });

    return (
        <div style={{ minHeight: "100vh", display: "flex", background: "#f5f0e8", overflow: "hidden" }}>
            <div
                ref={ref}
                style={{
                    flex: "1 1 460px",
                    padding: "clamp(28px, 5vw, 52px) clamp(24px, 5vw, 56px)",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0
                }}
                className='left-panel'
            >
                <motion.div {...fadeUp(0.06)} style={{ marginBottom: 28, marginTop: 40 }}>
                    <h1 style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.2rem)", fontWeight: 900, color: "#2d3b1f",marginBottom: 6 }} className='font-display'>
                        Join AjoPay
                    </h1>
                    <p style={{ fontSize: "0.92rem", color: "#2d3b1f80" }}>Start your savings journey today</p>
                </motion.div>

                {errors.general && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: "#fff0f0",
                            border: "1.5px solid #ffd0d0",
                            borderRadius: 10,
                            padding: "10px 14px",
                            fontSize: "0.84rem",
                            color: "#e84343",
                            fontWeight: 600,
                            marginBottom: 10,
                            maxWidth: 400,
                        }}
                    >
                        {errors.general}
                    </motion.div>

                )}

                <div className="form-wrap" style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
                    <motion.div {...fadeUp(0.12)}>
                        <div style={inputBox(focused === "name")}>
                            <User size={17} color={focused === "name" ? "#d4a843" : "#b8c0b0"} strokeWidth={1.8} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                            <input 
                                className="ri" 
                                placeholder="Full Name" 
                                value={form.name}
                                onChange={handleChange("name")}
                                onFocus={() => setFocused("name")} 
                                onBlur={() => setFocused(null)} 
                            />
                        </div>
                        {errors.name && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4, marginLeft: 4 }}>{errors.name}</p>}
                    </motion.div>

                    <motion.div {...fadeUp(0.17)}>
                        <div style={inputBox(focused === "email")}>
                            <Mail size={17} color={focused === "email" ? "#d4a843" : "#b8c0b0"} strokeWidth={1.8} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                            <input 
                                className="ri" 
                                type="email" 
                                placeholder="Email Address" 
                                value={form.email}
                                onChange={handleChange("email")}
                                onFocus={() => setFocused("email")} 
                                onBlur={() => setFocused(null)} 
                            />
                        </div>
                        {errors.email && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4, marginLeft: 4 }}>{errors.email}</p>}
                    </motion.div>

                    <motion.div {...fadeUp(0.22)}>
                        <div style={inputBox(focused === "phone")}>
                            <Phone size={17} color={focused === "phone" ? "#d4a843" : "#b8c0b0"} strokeWidth={1.8} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2d3b1f80", flexShrink: 0, paddingRight: 6, borderRight: "1px solid #e8e2d8", marginRight: 2 }}>NG +234</span>
                            <input 
                                className="ri" 
                                type="tel" 
                                placeholder="Phone Number" 
                                value={form.phone}
                                onChange={handleChange("phone")}
                                onFocus={() => setFocused("phone")} 
                                onBlur={() => setFocused(null)} 
                            />
                        </div>
                        {errors.phone && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4, marginLeft: 4 }}>{errors.phone}</p>}
                    </motion.div>

                    <motion.div {...fadeUp(0.27)}>
                        <div style={inputBox(focused === "password")}>
                            <Lock size={17} color={focused === "password" ? "#d4a843" : "#b8c0b0"} strokeWidth={1.8} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                            <input 
                                className="ri" 
                                type={showPass ? "text" : "password"} 
                                placeholder="Password" 
                                value={form.password}
                                onChange={handleChange("password")}
                                onFocus={() => setFocused("password")} 
                                onBlur={() => setFocused(null)} 
                            />
                            <motion.button 
                                type="button" 
                                whileTap={{ scale: 0.88 }} 
                                onClick={() => setShowPass(v => !v)}
                                style={{ 
                                    background: "none", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    padding: 0, 
                                    display: "flex", 
                                    flexShrink: 0 
                                }}
                            >
                                {showPass
                                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b8c0b0" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b8c0b0" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                }
                            </motion.button>
                        </div>
                        {errors.password && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4, marginLeft: 4 }}>{errors.password}</p>}
                    </motion.div>

                    <motion.div {...fadeUp(0.32)}>
                        <div style={inputBox(focused === "confirm")}>
                            <Lock size={17} color={focused === "confirm" ? "#d4a843" : "#b8c0b0"} strokeWidth={1.8} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                            <input 
                                className="ri" 
                                type={showConfirm ? "text" : "password"} 
                                placeholder="Confirm Password" 
                                value={form.confirm}
                                onChange={handleChange("confirm")}
                                onFocus={() => setFocused("confirm")} 
                                onBlur={() => setFocused(null)} 
                            />
                            <motion.button 
                                type="button" 
                                whileTap={{ scale: 0.88 }} 
                                onClick={() => setShowConfirm(v => !v)}
                                style={{ 
                                    background: "none", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    padding: 0, 
                                    display: "flex", 
                                    flexShrink: 0 
                                    }}
                            >
                                {showConfirm
                                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b8c0b0" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b8c0b0" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                }
                            </motion.button>
                        </div>
                        {errors.confirm && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4, marginLeft: 4 }}>{errors.confirm}</p>}
                    </motion.div>

                    <motion.div {...fadeUp(0.38)}>
                        <motion.button
                            onClick={handleSubmit}
                            disabled={loading}
                            whileHover={!loading ? { scale: 1.02, backgroundColor: "#c49a35" } : {}}
                            whileTap={!loading ? { scale: 0.97 } : {}}
                            style={{
                                width: "100%", 
                                background: loading ? "#e8c87a" : "#d4a843", 
                                color: "#2d3b1f",
                                border: "none", 
                                borderRadius: 12, 
                                padding: "15px",
                                fontSize: "0.98rem", 
                                fontWeight: 700, 
                                cursor: "pointer",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                gap: 9,
                                boxShadow: "0 4px 20px rgba(212,168,67,0.35)",
                                transition: "background 0.2s ease",
                            }}
                        >
                            <UserPlus size={19} strokeWidth={2} />
                            {loading ? "Creating Account..." : "Create Account"}
                        </motion.button>
                    </motion.div>

                    <motion.p {...fadeUp(0.43)} style={{ textAlign: "center", fontSize: "0.88rem", color: "#2d3b1f80", paddingBottom: 16 }}>
                        Already have an account?{" "}
                        <MotionLink to="/login" whileHover={{ color: "#c49a35" }}
                            style={{ color: "#d4a843", fontWeight: 700, textDecoration: "none" }}>
                            Login
                        </MotionLink>
                    </motion.p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    flex: "1 1 420px",
                    background: "linear-gradient(160deg, #1a3a2a 0%, #2d5a35 50%, #c8a830 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "48px 40px",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 0,
                }}
                className="hidden-mobile"
            >
                {["#d4a843","#2d5a35","#e8863a","#fff","#d4a843","#4a7a2a"].map((c, i) => (
                    <motion.div 
                        key={i}
                        style={{
                            position: "absolute",
                            width: 8 + (i % 3) * 6,
                            height: 8 + (i % 3) * 6,
                            borderRadius: i % 2 === 0 ? "50%" : "2px",
                            background: c,
                            opacity: 0.25,
                            top: `${10 + i * 13}%`,
                            left: `${8 + (i * 17) % 80}%`,
                            rotate: i * 33,
                        }}
                        animate={{ y: [0, -12, 0], rotate: [i * 33, i * 33 + 20, i * 33], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    />
                ))}

                <motion.div
                    animate={{ scale: [1, 1.025, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        width: "100%",
                        maxWidth: 340,
                        borderRadius: 20,
                        overflow: "hidden",
                        marginBottom: 36,
                        boxShadow: "0 16px 48px rgba(0,0,0,0.28)",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            aspectRatio: "4/3",
                            background: "linear-gradient(160deg, #f5d890 0%, #e8a84a 40%, #c87832 80%, #2d3b1f 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {["#2d5a35","#d4a843","#e8863a","#fff","#4a9a55","#f0c040"].map((c, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    position: "absolute",
                                    width: 10 + (i % 4) * 6,
                                    height: 6 + (i % 3) * 4,
                                    borderRadius: "2px",
                                    background: c,
                                    top: `${5 + i * 14}%`,
                                    left: `${(i * 19) % 90}%`,
                                    rotate: i * 45,
                                }}
                                animate={{ y: [0, 8, 0], rotate: [i * 45, i * 45 + 15, i * 45] }}
                                transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                            />
                        ))}
                        
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, paddingBottom: 20, zIndex: 1 }}>
                            {["#5a8a6a","#c87832","#d4a843","#8a6a4a","#4a6a4a"].map((bg, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -6 - i * 2, 0] }}
                                    transition={{ duration: 1.8 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
                                >
                                    <div style={{ width: 22 + i * 2, height: 22 + i * 2, borderRadius: "50%", background: bg, border: "2px solid rgba(255,255,255,0.3)" }} />
                                    <div style={{ width: 28 + i * 2, height: 50 + i * 4, borderRadius: "12px 12px 4px 4px", background: bg, opacity: 0.85 }} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.h3
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                        fontSize: "1.3rem", 
                        fontWeight: 800, 
                        color: "#fff",
                        marginBottom: 24,
                        textAlign: "center",
                    }}
                    className='font-display'
                >
                    Join Our Growing Community
                </motion.h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
                    {features.map((f, i) => (
                        <FeatureItem key={i} {...f} delay={0.6 + i * 0.1} inView={true} />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default RegisterPage