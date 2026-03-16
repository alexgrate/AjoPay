import { useRef } from 'react'
import { motion, useInView } from "framer-motion"
import { Circle, BadgeCheck, HeartPlus, Users, ShieldCheck, CircleDollarSign, Smile } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MotionCircle = motion.create(Circle)

const CX = 190, CY =185, HR = 130;
const hexPts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI /180) * (60 * i - 90)
    return { x: CX + HR * Math.cos(a), y: CY + HR * Math.sin(a) } 
})
const hexPath = hexPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z"

const MoneyBag = ({ style, delay = 0, amplitude = 18 }) => (
    <motion.div
        style={{ position: "absolute", fontSize: 28, opacity: 0.18, ...style }}
        animate={{ y: [0, -amplitude, 0], rotate: [-6, 6, -6] }}
        transition={{ duration: 3.8 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
    >
        💰
    </motion.div>
);

const SmileyNode =({ x, y, delay = 0 }) => (
    <motion.div
        style={{
            position: "absolute",
            left: x - 26,
            top: y - 26,
            width: 52,
            height: 52,
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
    >
        <motion.div 
            style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: "1.5px solid #d4a843",
                opacity: 0.5,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
        />
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: `linear-gradient(135deg, #fff 60%, #f5f0d8)`,
                border: "2px solid #d4a843",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 14px 2px rgba(212, 168, 67, 0.3)`,
            }}
        >
            <Smile size={20} color='#2d3b1f' />
        </div>
    </motion.div>
)

const HexViz = () => {
    return (
        <div style={{ position: "relative", width: 380, height: 370, flexShrink: 0 }}>
            <svg
                width="380"
                height="370"
                style={{ position: "absolute", top: 0, left: 0 }}
            >
                <defs>
                    <filter id='glow'>
                        <feGaussianBlur stdDeviation="3" result='coloredBlur' />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <motion.path 
                    d={hexPath}
                    fill="none"
                    stroke="#d4a843"
                    strokeWidth="1.8"
                    filter="url(#glow)"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            </svg>

            <div
                style={{
                    position: "absolute",
                    left: CX - 50,
                    top: CY - 50,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 35%, #4a5e2a, #2d3b1f)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 30px rgba(212,168,67,0.4), 0 8px 32px rgba(0,0,0,0.25)`,
                    zIndex: 2,
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <CircleDollarSign className='w-12 h-12' style={{ color: "#d4a843" }} />
                </motion.div>
            </div>

            {hexPts.map((pt, i) => (
                <SmileyNode key={i} x={pt.x} y={pt.y} delay={i * 0.38} />
            ))}
        </div>
    )
}


const HeroSection = () => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    const navigate = useNavigate()
    const isLoggedIn = !!localStorage.getItem("access_token")

    const handleStartGroup = () => {
        navigate(isLoggedIn ? "/create-group" : "/register")
    }

    const handleJoinGroup = () => {
        navigate(isLoggedIn ? "/groups" : "/register")
    }

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 36 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    })

    const fadeRight = (delay = 0) => ({
        initial: { opacity: 0, x: 60 },
        animate: inView ? { opacity: 1, x: 0 } : {},
        transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
    })


    return (
        <section
            ref={ref}
            style={{
                background: "#f5f0e8",
                minHeight: "100vh",
                position: "relative",
                overflow: 'hidden',
                display: 'flex',
                alignItems: "center",
                padding: "80px 0 40px",
            }}
        >
            <MotionCircle 
                size={90}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "8%",
                    left: "5%",
                    opacity: 0.10,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={55}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "22%",
                    left: "18%",
                    opacity: 0.08,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={130}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "60%",
                    left: "2%",
                    opacity: 0.07,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={70}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "75%",
                    left: "22%",
                    opacity: 0.09,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={50}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "15%",
                    left: "48%",
                    opacity: 0.08,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={100}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "55%",
                    opacity: 0.06,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={60}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "80%",
                    left: "72%",
                    opacity: 0.08,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={80}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "78%",
                    opacity: 0.07,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={45}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "88%",
                    opacity: 0.10,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MotionCircle 
                size={110}
                strokeWidth={1.5}
                color="#2d3b1f"
                style={{
                    position: "absolute",
                    top: "68%",
                    left: "85%",
                    opacity: 0.06,
                }}
                animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.1, 0.16, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <MoneyBag style={{ top: "12%",  left: "10%"  }} delay={0}   amplitude={20} />
            <MoneyBag style={{ top: "30%",  left: "40%"  }} delay={0.7} amplitude={14} />
            <MoneyBag style={{ top: "65%",  left: "14%"  }} delay={1.4} amplitude={22} />
            <MoneyBag style={{ top: "70%",  left: "48%"  }} delay={0.3} amplitude={16} />
            <MoneyBag style={{ top: "18%",  left: "68%"  }} delay={1.1} amplitude={18} />
            <MoneyBag style={{ top: "55%",  left: "80%"  }} delay={0.5} amplitude={24} />
            <MoneyBag style={{ top: "82%",  left: "62%"  }} delay={1.8} amplitude={12} />
            <MoneyBag style={{ top: "8%",   left: "88%"  }} delay={2.2} amplitude={20} />
            
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "0 32px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 48,
                    flexWrap: "wrap",
                }}
            >
                <div style={{ flex: "1 1 400px", maxWidth: 600 }}>
                    <motion.div {...fadeUp(0)} style={{ 
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#fff",
                        borderRadius: 999,
                        padding: "6px 16px 6px 8px",
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                        marginBottom: 28
                    }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <BadgeCheck style={{
                                color: "#d4a843"
                            }} />
                        </motion.div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#2d3b1f" }}>
                            Trusted by 12,000+ Nigerians
                        </span>
                    </motion.div>

                    <motion.h1
                        {...fadeUp(0.12)}
                        style={{
                            fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                            lineHeight: 1.08, 
                            fontWeight: 900, 
                            color: "#2d3b1f",
                            marginBottom: 4
                        }}
                    >
                        Save Together,
                    </motion.h1>

                    <motion.h1
                        {...fadeUp(0.2)}
                        style={{ 
                            fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                            lineHeight: 1.08,
                            fontWeight: 900,
                            color: "#d4a843",
                            marginBottom: 4
                        }}
                    >
                        Celebrate
                    </motion.h1>

                    <motion.h1
                        {...fadeUp(0.28)}
                        style={{
                            fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                            lineHeight: 1.08,
                            fontWeight: 900,
                            color: "#d4a843",
                            marginBottom: 24
                        }}
                    >
                        Together
                    </motion.h1>

                    <motion.p
                        {...fadeUp(0.36)}
                        style={{
                            fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
                            color: "#2d3b1ffc",
                            lineHeight: 1.7, 
                            maxWidth: 480,
                            marginBottom: 36
                        }}
                    >
                        Join trusted Ajo groups, contribute monthly, and recieve your payout automatically. No stress, pure celebration.
                    </motion.p>

                    <motion.div
                        {...fadeUp(0.44)}
                        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}
                    >
                        <motion.button
                            onClick={handleStartGroup}
                            whileHover={{ scale: 1.04, backgroundColor: "#C49A35" }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: "#C49A35",
                                color: "#fff",
                                border: "none",
                                borderRadius: 14,
                                padding: "15px 28px",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                boxShadow: "0 4px 20px rgba(212, 168, 67, 0.4)",
                            }}
                        >
                            <span ><Users className='w-6 h-6' /></span> Start Your Group
                        </motion.button>

                        <motion.button
                            onClick={handleJoinGroup}
                            whileHover={{ scale: 1.04, background: "#2d3b1f1a" }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: "transparent",
                                color: "#2d3b1f",
                                border: `2px solid #2d3b1f`,
                                borderRadius: 14,
                                padding: "15px 28px",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                            }}
                        >
                            <span ><HeartPlus className='w-6 h-6' /></span> Join Existing Group
                        </motion.button>
                    </motion.div>

                    <motion.div
                        {...fadeUp(0.52)}
                        style={{ display: "flex", gap: 32, flexWrap: "wrap" }}
                    >
                        {[
                            { icon: "₦", value: "₦2.4B+", label: "Saved Together" },
                            { icon: <Users />, value: "12,000+", label: "Active Groups" },
                            { icon: <ShieldCheck />, value: "Paystack", label: "Secure Payments" },

                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -2 }}
                                style={{ display: "flex", flexDirection: "column" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {stat.icon !== "₦" && <motion.span style={{ fontSize: 16, display: "inline-block" }} animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>{stat.icon}</motion.span>}
                                    <span
                                        style={{
                                            fontSize: "1.35rem", 
                                            fontWeight: 800,
                                            color: "#2d3b1f"
                                        }}
                                    >
                                        {stat.value}
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: "0.8rem",
                                    color: "#2d3b1fcc",
                                    fontWeight: 500,
                                    marginTop: 2,
                                }}>
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    {...fadeRight(0.3)}
                    style={{
                        flex: "1 1 340px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative"
                    }}
                >
                    <div 
                        style={{
                            position: "absolute",
                            width: 360,
                            height: 360,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            pointerEvents: "none",
                        }}
                    />
                    <HexViz />
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection