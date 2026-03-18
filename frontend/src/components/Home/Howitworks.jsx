import { useRef } from 'react'
import { motion, useInView } from "framer-motion"
import { ArrowRight } from 'lucide-react'
import { steps } from '../../context'

const StepCard = ({ step, index, inView }) => {
    const Icon = step.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, boxShadow: `0 24px 60px rgba(0,0,0,0.10)` }}
            style={{
                background: "#fff",
                borderRadius: 24,
                padding: "36px 32px 40px",
                flex: "1 1 280px",
                maxWidth: 380,
                position: "relative",
                cursor: "default",
                border: "1.5px solid #f0ece4",
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.3s ease",
                overflow: "hidden",
            }}
            className="group"
        >
            <span
                style={{
                    position: "absolute",
                    top: 18,
                    right: 24,
                    fontSize: "3.5rem",
                    fontWeight: 900,
                    color: `${step.accent}0f`,
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none"
                }}
                className='font-display'
            >
                {step.step}
            </span>

            <motion.div 
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 3,
                    width: "0%",
                    background: step.bg,
                    borderRadius: "0 0 0 24px",
                }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />

            <motion.div
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: step.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 28,
                    boxShadow: `0 8px 24px ${step.bg}55`,
                }}
                whileHover={{ rotate: [0, -8, 8, -4, 4, 0], scale: 1.08 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                <Icon size={32} color={step.iconColor} strokeWidth={1.8} />
            </motion.div>

            <h3
                style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "#2d3b1f",
                    marginBottom: 12,
                    lineHeight: 1.2
                }}
                className='font-display'
            >
                {step.title}
            </h3>
            <p
                style={{
                    fontSize: "0.93rem",
                    color: "#2d3b1faa",
                    lineHeight: 1.75,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400
                }}
            >
                {step.description}
            </p>
        </motion.div>
    )
}

const Howitworks = () => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section
            id='how-it-works'
            ref={ref}
            style={{
                background: "#fafaf7",
                padding: "100px 32px 110px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div 
                style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                }}
            />

            <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
                <div style={{ textAlign: "center", marginBottom: 72 }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={inView ? { opacity: 1, y: 0 }: {}}
                        transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1]}}

                        style={{
                            fontSize: "clamp(2rem, 4vw, 3.2rem)",
                            fontWeight: 900,
                            color: "#2d3b1f",
                            marginBottom: 16,
                            lineHeight: 1.1
                        }}
                        className='font-display'
                    >
                        How{" "}
                        <span>AjoPay</span>{" "}
                        Works
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1]}}

                        style={{
                            fontSize: "1rem",
                            color: "#2d3b1f99",
                            maxWidth: 480,
                            margin: "0 auto",
                            lineHeight: 1.7,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Three simple steps to financial freedom with your community
                    </motion.p>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: 1 } : {}}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        style={{
                            height: 3,
                            width: 60,
                            background: "#d4a843",
                            borderRadius: 99,
                            margin: "20px auto 0",
                            transformOrigin: "left",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 28,
                        justifyContent: "center",
                        flexWrap: "wrap",
                        alignItems: "stretch",
                        position: "relative"
                    }}
                >
                    {steps.map((step, i) => (
                        <StepCard key={i} step={step} index={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Howitworks