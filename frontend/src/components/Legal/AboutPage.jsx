import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Coins, Users, ArrowRight, Star, CheckCircle } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";
import { team, stats, values, timeline } from "../../context";

const FLOATS = [
    { x: "3%",  s: 18, d: 0,   dr: 5.2 },
    { x: "8%",  s: 12, d: 1.9, dr: 4.6 },
    { x: "18%", s: 16, d: 0.7, dr: 5.8 },
    { x: "55%", s: 10, d: 2.4, dr: 4.4 },
    { x: "70%", s: 15, d: 0.5, dr: 5.0 },
    { x: "83%", s: 12, d: 1.3, dr: 4.8 },
    { x: "93%", s: 18, d: 2.9, dr: 5.4 },
];

const FloatCoin = ({ x, s, d, dr }) => (
    <motion.div style={{ position: "fixed", left: x, bottom: -60, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1300], opacity: [0, 0.10, 0.10, 0] }}
        transition={{ duration: dr, delay: d, repeat: Infinity, ease: "linear", times: [0, 0.07, 0.9, 1] }}>
        <Coins size={s} color="#d4a843" strokeWidth={1.1} />
    </motion.div>
);

const Section = ({ children, id, style = {} }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.15 });
    return (
        <section ref={ref} id={id} style={style}>
            {typeof children === "function" ? children(inView) : children}
        </section>
    );
};

const StatCard = ({ value, label, sub, i, inView }) => (
    <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.12)" }}
        style={{ flex: "1 1 160px", background: "#fff", borderRadius: 20, padding: "28px 22px", border: "1.5px solid #f0ece4", textAlign: "center", boxShadow: "0 2px 14px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,168,67,0.04), transparent)", pointerEvents: "none" }} />
        <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 260 }}
            style={{ fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif", lineHeight: 1, marginBottom: 8 }}>
            {value}
        </motion.p>
        <p style={{ fontWeight: 800, color: "#2d3b1f", fontSize: "0.95rem", marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: "0.78rem", color: "#2d3b1f60" }}>{sub}</p>
    </motion.div>
);

const ValueCard = ({ icon: Icon, color, bg, title, desc, i, inView }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8, boxShadow: "0 24px 56px rgba(0,0,0,0.10)" }}
        style={{ flex: "1 1 240px", background: "#fff", borderRadius: 22, padding: "32px 28px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
        <motion.div
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: color, opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        />
        <motion.div
            whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
            style={{ width: 58, height: 58, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Icon size={26} color={color} strokeWidth={1.8} />
        </motion.div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: "0.88rem", color: "#2d3b1f80", lineHeight: 1.75 }}>{desc}</p>
    </motion.div>
);

const TimelineItem = ({ year, title, desc, color, i, inView, isLast }) => (
    <motion.div
        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: isLast ? 0 : 40 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <motion.div
                whileHover={{ scale: 1.2 }}
                style={{ width: 48, height: 48, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${color}44`, zIndex: 1 }}>
                <CheckCircle size={22} color="#fff" strokeWidth={2.5} />
            </motion.div>
            {!isLast && <div style={{ width: 2, height: 40, background: "linear-gradient(to bottom, " + color + ", #f0ece4)", marginTop: 4 }} />}
        </div>
        <div style={{ flex: 1, paddingTop: 8 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{year}</span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces',serif", margin: "4px 0 8px" }}>{title}</h3>
            <p style={{ fontSize: "0.88rem", color: "#2d3b1f80", lineHeight: 1.7 }}>{desc}</p>
        </div>
    </motion.div>
);

const TeamCard = ({ name, role, image, socials: memberSocials, i, inView }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8 }}
        style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1.5px solid #f0ece4", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", maxWidth: 320, width: "100%" }}>

        <div style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a35)", padding: "40px 32px 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {[{ s: 80, t: "10%", r: "8%", o: 0.08 }, { s: 60, t: "40%", r: "20%", o: 0.06 }].map((c, ci) => (
                <motion.div key={ci} animate={{ rotate: 360 }} transition={{ duration: 20 + ci * 5, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", top: c.t, right: c.r, opacity: c.o, pointerEvents: "none" }}>
                    <Coins size={c.s} color="#d4a843" strokeWidth={1} />
                </motion.div>
            ))}

            <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid #d4a843", margin: "0 auto 18px", boxShadow: "0 0 0 4px rgba(212,168,67,0.25), 0 8px 28px rgba(0,0,0,0.35)", overflow: "hidden", position: "relative", zIndex: 1, background: "#2d5a35" }}>
                {image ? (
                    <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#2d3b1f,#4a6030)" }}>
                        <Users size={36} color="#d4a843" strokeWidth={1.5} />
                    </div>
                )}
            </motion.div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", fontFamily: "'Fraunces',serif", marginBottom: 6, position: "relative", zIndex: 1 }}>{name}</h3>
            <p style={{ fontSize: "0.8rem", color: "#d4a843", fontWeight: 600, position: "relative", zIndex: 1 }}>{role}</p>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", gap: 12, justifyContent: "center" }}>
            {memberSocials.map(({ icon: SocialIcon, href, label }, si) => (
                <motion.a
                    key={si}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    whileHover={{ scale: 1.15, backgroundColor: "#2d3b1f", color: "#d4a843" }}
                    whileTap={{ scale: 0.92 }}
                    style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #e8e2d8", background: "#f8f6f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#2d3b1f80", textDecoration: "none", transition: "all 0.2s" }}>
                    <SocialIcon size={17} strokeWidth={2} />
                </motion.a>
            ))}
        </div>
    </motion.div>
);

const AboutPage = () => {
    usePageTitle("About Us");

    return (
        <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", overflow: "hidden" }}>
            {FLOATS.map((c, i) => <FloatCoin key={i} {...c} />)}

            <div style={{ background: "linear-gradient(135deg,#0d2218 0%,#1a3a2a 40%,#2d5a35 70%,#3d6a25 100%)", position: "relative", overflow: "hidden", paddingBottom: 100 }}>

                {[
                    { s: 400, t: "-20%", l: "-8%", o: 0.06 },
                    { s: 300, t: "30%",  l: "15%", o: 0.04 },
                    { s: 350, t: "-10%", r: "5%",  o: 0.05 },
                    { s: 200, t: "50%",  r: "20%", o: 0.07 },
                ].map((c, i) => (
                    <motion.div key={i} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                        style={{ position: "absolute", width: c.s, height: c.s, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)", top: c.t, left: c.l, right: c.r, opacity: c.o, pointerEvents: "none" }} />
                ))}

                {["₦", "₦", "₦", "₦", "₦"].map((n, i) => (
                    <motion.div key={i}
                        animate={{ y: [0, -20, 0], opacity: [0.05, 0.12, 0.05] }}
                        transition={{ duration: 4 + i, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
                        style={{ position: "absolute", fontSize: `${40 + i * 12}px`, color: "#d4a843", fontWeight: 900, left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 20}%`, pointerEvents: "none", userSelect: "none", opacity: 0.08, fontFamily: "'Fraunces',serif" }}>
                        {n}
                    </motion.div>
                ))}

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(100px,12vw,140px) clamp(20px,4vw,48px) 0", position: "relative", zIndex: 2 }}>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.3)", borderRadius: 99, padding: "6px 16px", marginBottom: 28, backdropFilter: "blur(8px)" }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                            <Coins size={14} color="#d4a843" strokeWidth={2} />
                        </motion.div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#d4a843" }}>Our Story</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{ fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 900, color: "#fff", fontFamily: "'Fraunces',serif", lineHeight: 1.05, marginBottom: 24, maxWidth: 700 }}>
                        Ajo. Reimagined.{" "}
                        <span style={{ color: "#d4a843" }}>For Every Nigerian.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        style={{ fontSize: "clamp(1rem,1.8vw,1.15rem)", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, maxWidth: 580, marginBottom: 44 }}>
                        AjoPay digitizes Nigeria's most powerful savings tradition. We took the centuries-old practice of rotating savings — Ajo, Esusu, Adashe — and gave it the security, transparency, and automation it always deserved.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <motion.a
                            href="/register"
                            whileHover={{ scale: 1.04, backgroundColor: "#c49a35" }}
                            whileTap={{ scale: 0.97 }}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#d4a843", color: "#2d3b1f", borderRadius: 13, padding: "14px 26px", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(212,168,67,0.4)" }}>
                            Start Saving Today <ArrowRight size={16} strokeWidth={2.5} />
                        </motion.a>
                        <motion.a
                            href="/#how-it-works"
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 13, padding: "14px 26px", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                            See How It Works
                        </motion.a>
                    </motion.div>
                </div>

                <Section style={{ maxWidth: 1100, margin: "60px auto 0", padding: "0 clamp(20px,4vw,48px)", position: "relative", zIndex: 2 }}>
                    {(inView) => (
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                            {stats.map((s, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.1 + i * 0.1, duration: 0.55 }}
                                    style={{ flex: "1 1 130px", background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 16px", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                                    <p style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif", lineHeight: 1, marginBottom: 6 }}>{s.value}</p>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{s.label}</p>
                                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>{s.sub}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Section>
            </div>

            <Section style={{ background: "#fff", padding: "clamp(64px,8vw,100px) clamp(20px,4vw,48px)" }}>
                {(inView) => (
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>

                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                            style={{ flex: "1 1 320px" }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d4a843", letterSpacing: "0.12em", textTransform: "uppercase" }}>What We Built</span>
                            <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", lineHeight: 1.1, margin: "12px 0 20px" }}>
                                Nigeria's First Fully Automated Ajo Platform
                            </h2>
                            <p style={{ fontSize: "0.95rem", color: "#2d3b1f80", lineHeight: 1.8, marginBottom: 16 }}>
                                Traditional Ajo worked on trust and social pressure. It still does — but now backed by BVN verification, credit scoring, and automatic cycle management.
                            </p>
                            <p style={{ fontSize: "0.95rem", color: "#2d3b1f80", lineHeight: 1.8, marginBottom: 28 }}>
                                Create a group, invite your circle, start contributing. When your cycle comes, your payout is released automatically — directly to your verified bank account.
                            </p>
                            {[
                                "BVN-verified members only",
                                "Credit-scored before joining",
                                "Contributions tracked in real-time",
                                "Automatic payout release via Paystack",
                                "Trust score rewards good behavior",
                                "Defaulters flagged and suspended",
                            ].map((feat, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.3 + i * 0.07 }}
                                    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <CheckCircle size={16} color="#1db893" strokeWidth={2.5} />
                                    <span style={{ fontSize: "0.88rem", color: "#2d3b1f", fontWeight: 500 }}>{feat}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            style={{ flex: "1 1 320px", position: "relative" }}>

                            <div style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a35)", borderRadius: 24, padding: "32px", boxShadow: "0 24px 64px rgba(45,59,31,0.3)", position: "relative", overflow: "hidden" }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{ position: "absolute", right: -20, top: -20, opacity: 0.08 }}>
                                    <Coins size={120} color="#d4a843" strokeWidth={0.8} />
                                </motion.div>

                                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 20 }}>LIVE CYCLE EXAMPLE</p>

                                {[
                                    { name: "Ada O.", order: 1, status: "paid_out", amount: "₦50,000" },
                                    { name: "Chidi M.", order: 2, status: "paid", amount: "₦5,000" },
                                    { name: "Ngozi B.", order: 3, status: "paid", amount: "₦5,000" },
                                    { name: "Emeka T.", order: 4, status: "pending", amount: "₦5,000" },
                                    { name: "Kemi A.", order: 5, status: "pending", amount: "₦5,000" },
                                ].map((m, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.4 + i * 0.08 }}
                                        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 4 ? 12 : 0, padding: "10px 12px", background: "rgba(255,255,255,0.07)", borderRadius: 10, border: m.order === 2 ? "1px solid rgba(212,168,67,0.4)" : "1px solid transparent" }}>
                                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.status === "paid_out" ? "#d4a843" : m.status === "paid" ? "#1db893" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.65rem", color: m.status === "paid_out" ? "#2d3b1f" : "#fff", flexShrink: 0 }}>
                                            #{m.order}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>{m.name}</p>
                                            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{m.status.replace("_", " ")}</p>
                                        </div>
                                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: m.status === "paid_out" ? "#d4a843" : m.status === "paid" ? "#1db893" : "rgba(255,255,255,0.4)" }}>
                                            {m.status === "paid_out" ? m.amount : m.amount}
                                        </span>
                                    </motion.div>
                                ))}

                                <div style={{ marginTop: 16, background: "rgba(29,184,147,0.15)", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Pool Size</span>
                                    <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif" }}>₦50,000</span>
                                </div>
                            </div>

                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                style={{ position: "absolute", top: -16, right: -16, background: "#1db893", borderRadius: 12, padding: "8px 14px", boxShadow: "0 8px 24px rgba(29,184,147,0.4)" }}>
                                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>✓ Paystack Secured</span>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </Section>

            <Section style={{ background: "#f5f0e8", padding: "clamp(64px,8vw,100px) clamp(20px,4vw,48px)" }}>
                {(inView) => (
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: 60 }}>
                            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                                style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d4a843", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                                What We Stand For
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 24 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.65, delay: 0.1 }}
                                style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 16 }}>
                                Built on Uncompromising Values
                            </motion.h2>
                            <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
                                style={{ fontSize: "0.97rem", color: "#2d3b1f80", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                                Every feature we built, every decision we made — guided by one purpose: making Ajo safe enough for every Nigerian to use.
                            </motion.p>
                        </div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                            {values.map((v, i) => <ValueCard key={i} {...v} i={i} inView={inView} />)}
                        </div>
                    </div>
                )}
            </Section>

            <Section style={{ background: "#fff", padding: "clamp(64px,8vw,100px) clamp(20px,4vw,48px)" }}>
                {(inView) => (
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 64, alignItems: "flex-start", flexWrap: "wrap" }}>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            style={{ flex: "1 1 280px", position: "sticky", top: 100 }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d4a843", letterSpacing: "0.12em", textTransform: "uppercase" }}>Our Journey</span>
                            <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", lineHeight: 1.1, margin: "12px 0 20px" }}>
                                From Idea to Infrastructure
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "#2d3b1f80", lineHeight: 1.8 }}>
                                AjoPay didn't start with funding or a team. It started with a problem every Nigerian knows — and a determination to solve it properly.
                            </p>

                            <motion.div
                                animate={{ scale: [1, 1.04, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{ marginTop: 32, background: "linear-gradient(135deg,#1a3a2a,#2d5a35)", borderRadius: 16, padding: "20px", display: "inline-block" }}>
                                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>BUILT SOLO IN</p>
                                <p style={{ fontSize: "2rem", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif", lineHeight: 1 }}>2025–26</p>
                                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Django + React + Paystack</p>
                            </motion.div>
                        </motion.div>

                        <div style={{ flex: "1 1 320px" }}>
                            {timeline.map((t, i) => (
                                <TimelineItem key={i} {...t} i={i} inView={inView} isLast={i === timeline.length - 1} />
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            <Section style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a35)", padding: "clamp(64px,8vw,100px) clamp(20px,4vw,48px)", position: "relative", overflow: "hidden" }}>
                {(inView) => (
                    <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            style={{ position: "absolute", right: -60, top: -60, opacity: 0.06, pointerEvents: "none" }}>
                            <Coins size={300} color="#d4a843" strokeWidth={0.6} />
                        </motion.div>

                        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
                            <div style={{ textAlign: "center", marginBottom: 56 }}>
                                <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                                    style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d4a843", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                                    The Trust System
                                </motion.p>
                                <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
                                    style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, color: "#fff", fontFamily: "'Fraunces',serif", marginBottom: 14 }}>
                                    Every Member Earns Their Position
                                </motion.h2>
                                <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
                                    style={{ fontSize: "0.97rem", color: "rgba(255,255,255,0.65)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                                    Trust isn't assumed — it's built. AjoPay scores every member and rewards reliability.
                                </motion.p>
                            </div>

                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                                {[
                                    { tier: "New Member",     score: "0–20",   color: "#9e9e9e", perks: ["Join private groups", "Contribute to cycles", "Build your score"] },
                                    { tier: "Building Trust", score: "21–50",  color: "#d4a843", perks: ["All above", "+5 per on-time payment", "Join public groups"] },
                                    { tier: "Trusted Member", score: "51–75",  color: "#1db893", perks: ["All above", "Priority in group selection", "Create public groups"] },
                                    { tier: "Highly Trusted", score: "76–100", color: "#7c5cbf", perks: ["All above", "+10 cycle completion bonus", "Top of group rankings"] },
                                ].map((t, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 32 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 0.15 + i * 0.1 }}
                                        whileHover={{ y: -6, boxShadow: `0 20px 48px rgba(0,0,0,0.3)` }}
                                        style={{ flex: "1 1 200px", background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px 20px", border: `1.5px solid ${t.color}44`, backdropFilter: "blur(8px)" }}>
                                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${t.color}22`, border: `2px solid ${t.color}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                                            <Star size={20} color={t.color} strokeWidth={2} />
                                        </div>
                                        <p style={{ fontWeight: 800, color: "#fff", fontSize: "0.95rem", marginBottom: 4 }}>{t.tier}</p>
                                        <p style={{ fontSize: "0.72rem", color: t.color, fontWeight: 700, marginBottom: 14 }}>Score: {t.score}</p>
                                        {t.perks.map((p, pi) => (
                                            <div key={pi} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                                                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>{p}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </Section>

            <Section id="team" style={{ background: "#f5f0e8", padding: "clamp(64px,8vw,100px) clamp(20px,4vw,48px)" }}>
                {(inView) => (
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: 60 }}>
                            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                                style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d4a843", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                                The People
                            </motion.p>
                            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
                                style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 14 }}>
                                Built by Nigerians, for Nigerians
                            </motion.h2>
                            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
                                style={{ fontSize: "0.97rem", color: "#2d3b1f80", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
                                AjoPay was conceived, designed, and built completely in-house. Every line of code, every pixel — by someone who understands the problem firsthand.
                            </motion.p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 28 }}>
                            {team.map((member, i) => (
                                <TeamCard key={i} {...member} i={i} inView={inView} />
                            ))}
                        </div>
                    </div>
                )}

            </Section>

            <Section style={{ background: "#2d3b1f", padding: "clamp(64px,8vw,90px) clamp(20px,4vw,48px)", position: "relative", overflow: "hidden" }}>
                {(inView) => (
                    <>
                        {["₦", "₦", "₦"].map((n, i) => (
                            <motion.div key={i}
                                animate={{ y: [0, -15, 0], opacity: [0.04, 0.09, 0.04] }}
                                transition={{ duration: 4 + i, delay: i * 1.2, repeat: Infinity }}
                                style={{ position: "absolute", fontSize: `${60 + i * 20}px`, color: "#d4a843", fontWeight: 900, left: `${15 + i * 30}%`, top: "20%", pointerEvents: "none", userSelect: "none", fontFamily: "'Fraunces',serif" }}>
                                {n}
                            </motion.div>
                        ))}

                        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                            <motion.div animate={{ rotate: [0, 8, -8, 4, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                style={{ fontSize: "3.5rem", marginBottom: 20 }}>🎉</motion.div>
                            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                                style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, color: "#fff", fontFamily: "'Fraunces',serif", marginBottom: 16 }}>
                                Ready to Save <span style={{ color: "#d4a843" }}>Together?</span>
                            </motion.h2>
                            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
                                style={{ fontSize: "0.97rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 36 }}>
                                Join thousands of Nigerians already saving smarter. Create your first group today — it takes less than 2 minutes.
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
                                style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                                <motion.a href="/register" whileHover={{ scale: 1.04, backgroundColor: "#c49a35" }} whileTap={{ scale: 0.97 }}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#d4a843", color: "#2d3b1f", borderRadius: 13, padding: "15px 30px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", boxShadow: "0 6px 24px rgba(212,168,67,0.4)" }}>
                                    Create Free Account <ArrowRight size={17} strokeWidth={2.5} />
                                </motion.a>
                                <motion.a href="/invite" whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "#fff", borderRadius: 13, padding: "15px 30px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                                    Join with Invite Code
                                </motion.a>
                            </motion.div>
                        </div>
                    </>
                )}
            </Section>
        </div>
    );
}

export default AboutPage;