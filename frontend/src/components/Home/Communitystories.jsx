import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserCircle2, Quote, Star } from "lucide-react";
import { testimonials } from '../../context';


const TestimonialCard = ({t, inView}) => (
    <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: t.delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8, boxShadow: "0 28px 64px rgba(0,0,0,0.11)" }}
        style={{
            background: "#fff",
            borderRadius: 24,
            padding: "32px 28px 36px",
            flex: "1 1 280px",
            maxWidth: 380,
            position: "relative",
            border: "1.5px solid #ede8de",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            transition: "box-shadow 0.3s ease",
            overflow: "hidden",
        }}
    >
        <Quote 
            size={72}
            strokeWidth={1}
            style={{
                position: "absolute",
                bottom: 16,
                right: 20,
                color: "#d4a843",
                opacity: 0.12,
                transform: "rotate(180deg)"
            }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <motion.svg
                    width="72"
                    height="72"
                    viewBox="0 0 72 72"
                    style={{ position: "absolute", top: 0, left: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <circle
                        cx="36"
                        cy="36"
                        r="33"
                        fill='none'
                        stroke={t.dotColor}
                        strokeWidth="2"
                        strokeDasharray="6 5"
                        strokeLinecap='round'
                        opacity="0.85"
                    />
                </motion.svg>

                <div
                    style={{
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        background: t.avatarBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                    }}
                >
                    <UserCircle2 size={28} color='#d4a843' strokeWidth={1.5} />
                </div>
            </div>

            <div>
                <p style={{ fontWeight: 800, fontSize: "0.98rem", color: "#2d3b1f", marginBottom: 2 }} className='font-display'>
                    {t.name}
                </p>
                <p style={{ fontSize: "0.82rem", color: "#2d3b1f99", fontFamily: "'DM Sans' , sans-serif", fontWeight: 500 }}>
                    {t.location}
                </p>
            </div>
        </div>

        <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.07, type: "spring", stiffness: 300 }}
                >
                    <Star size={18} strokeWidth={0} fill={i < t.rating ? "#d4a843" : "#e0d5c0" } />
                </motion.div>
            ))}
        </div>

        <Quote 
            size={16}
            strokeWidth={2}
            style={{ color: "#d4a843", opacity: 0.6, marginBottom: 6 }}
        />

        <p
            style={{
                fontSize: "0.93rem",
                color: "#2d3b1fcc",
                lineHeight: 1.8,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
            }}
        >
            {t.text}
        </p>
    </motion.div>
)

const Communitystories = () => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-100px" })


    return (
        <section
            ref={ref}
            id='community'
            style={{
                background: "#f5f0e8",
                padding: "100px 32px 110px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(212, 168, 67, 0.07) 0%, transparent 70%)",
                    top: "-10%",
                    left: "-10%",
                    pointerEvents: "none"
                }}
            />

            <div style={{
                position: "absolute", 
                width: 400, 
                height: 400, 
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(45,59,31,0.05) 0%, transparent 70%)",
                bottom: "0%", 
                right: "-5%", 
                pointerEvents: "none",
                }} 
            />

            <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
                
                <div style={{ marginBottom: 64 }}>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: "#d4a843",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily: "'DM Sans', sans-serif",
                            marginBottom: 12
                        }}
                    >
                        Testimonials
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 28 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            fontSize: "clamp(2rem, 4.5vw, 3rem)",
                            fontWeight: 900,
                            color: "#2d3b1f",
                            fontFamily: "'Fraunces', serif",
                            lineHeight: 1.1,
                            marginBottom: 14,
                            maxWidth: 520,
                        }}
                    >
                        Stories from Our{" "}
                        <span style={{ color: "#d4a843" }}>Community</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
                        style={{
                            fontSize: "1rem",
                            color: "#2d3b1f99",
                            fontFamily: "'DM Sans', sans-serif",
                            lineHeight: 1.7,
                        }}
                    >
                        Real people, real savings, real celebrations
                    </motion.p> 

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: 1 } : {}}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        style={{
                            height: 3, width: 56, background: "#d4a843",
                            borderRadius: 99, marginTop: 18, transformOrigin: "left",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 24,
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        alignItems: "stretch"
                    }}
                >
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} t={t} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Communitystories