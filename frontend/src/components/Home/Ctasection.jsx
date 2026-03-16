import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bell } from 'lucide-react';
import { useNavigate } from "react-router-dom"

const dots = [
    { x: "8%",  size: 7,  delay: 0,    duration: 4.2, startY: "75%" },
    { x: "14%", size: 5,  delay: 1.8,  duration: 3.6, startY: "85%" },
    { x: "22%", size: 4,  delay: 0.6,  duration: 5.0, startY: "70%" },
    { x: "5%",  size: 6,  delay: 2.4,  duration: 4.5, startY: "90%" },
    { x: "32%", size: 4,  delay: 1.1,  duration: 3.8, startY: "80%" },
    { x: "38%", size: 5,  delay: 0.3,  duration: 4.0, startY: "95%" },
    { x: "50%", size: 4,  delay: 2.9,  duration: 5.2, startY: "88%" },
    { x: "58%", size: 6,  delay: 0.9,  duration: 3.9, startY: "72%" },
    { x: "65%", size: 4,  delay: 1.5,  duration: 4.6, startY: "92%" },
    { x: "72%", size: 5,  delay: 0.2,  duration: 4.1, startY: "78%" },
    { x: "80%", size: 7,  delay: 2.1,  duration: 3.7, startY: "83%" },
    { x: "88%", size: 4,  delay: 1.3,  duration: 5.1, startY: "68%" },
    { x: "92%", size: 6,  delay: 0.7,  duration: 4.3, startY: "90%" },
    { x: "95%", size: 4,  delay: 3.2,  duration: 3.5, startY: "76%" },
    { x: "45%", size: 3,  delay: 1.7,  duration: 4.8, startY: "94%" },
    { x: "28%", size: 5,  delay: 0.4,  duration: 4.4, startY: "86%" },
    { x: "76%", size: 4,  delay: 2.6,  duration: 3.6, startY: "82%" },
];

const FloatingDot = ({ x, size, delay, duration, startY }) => (
    <motion.div 
        style={{
            position: "absolute",
            left: x,
            top: startY,
            width: size,
            height: size,
            borderRadius: "50%",
            background: "#d4a843",
            pointerEvents: "none",
        }}
        animate={{
            y: ["0%", "-900%"], 
            opacity: [0, 1, 1, 0]
        }}
        transition={{
            duration, 
            delay, 
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.8, 1],
        }}
    />
)

const Ctasection = () => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    const navigate = useNavigate()
    const isLoggedIn = !!localStorage.getItem("access_token")

    const handleStartGroup = () => {
        navigate(isLoggedIn ? "/create-group" : "/register")
    }

    return (
        <section
            ref={ref}
            style={{
                position: "relative",
                overflow: "hidden",
                padding: "100px 32px 110px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 420,
                background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a35 40%, #4a7a2a 70%, #c8a830 100%)",
            }}
        >
            {dots.map((dot, i) => (
                <FloatingDot key={i} {...dot} />
            ))}

            <div 
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.22) 100%)",
                    pointerEvents: "none",
                }}      
            />

            <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 700 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ marginBottom: 20 }}
                >
                    <motion.h2
                        animate={{
                            scale: [1, 1.03, 1],
                            textShadow: [
                                "0 0 0px rgba(255,255,255,0)",
                                "0 0 28px rgba(255,255,255,0.18)",
                                "0 0 0px rgba(255,255,255,0)",
                            ],
                        }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            fontFamily: "'Fraunces', serif",
                            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                            fontWeight: 900,
                            color: "#ffffff",
                            lineHeight: 1.1,
                            margin: 0,
                        }}
                    >
                        Ready to Start Saving?
                    </motion.h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
                        color: "rgba(255, 255, 255, 0.78)",
                        lineHeight: 1.75,
                        marginBottom: 44,
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                    }}
                >
                    Join thousands of Nigerian building wealth together
                    <br />
                    through trusted community savings
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ marginBottom: 28 }}
                >
                    <motion.button
                        onClick={handleStartGroup}
                        whileHover={{ scale: 1.05, backgroundColor: "#e8bc50" }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            background: "#d4a843",
                            color: "#2d3b1f",
                            border: "none",
                            borderRadius: 16,
                            padding: "18px 42px",
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: "0 8px 32px rgba(212,168,67,0.35)",
                            transition: "background 0.2s ease",
                        }}
                    >
                        <Bell size={20} strokeWidth={2} />
                        Create Your First Group
                    </motion.button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.42 }}
                    style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    No credit card required &nbsp;•&nbsp; Free to start &nbsp;•&nbsp; Secure with Paystack
                </motion.p>
            </div>
        </section>
    )
}

export default Ctasection