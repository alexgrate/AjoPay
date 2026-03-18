import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom';
import { Coins, Heart } from 'lucide-react';
import { socials, footerLinks } from '../../context';

const floatingBags = [
    { x: "42%",  y: "12%", size: 28, delay: 0,   duration: 5.0 },
    { x: "61%",  y: "52%", size: 22, delay: 1.2, duration: 4.4 },
    { x: "30%",  y: "70%", size: 24, delay: 2.1, duration: 5.6 },
    { x: "78%",  y: "25%", size: 20, delay: 0.6, duration: 4.8 },
    { x: "88%",  y: "68%", size: 26, delay: 1.8, duration: 5.2 },
    { x: "52%",  y: "88%", size: 22, delay: 0.9, duration: 4.2 },
];

const MoneyBagFloat = ({ x, y, size, delay, duration }) => (
    <motion.div
        style={{
            position: "absolute",
            left: x,
            top: y,
            fontSize: size,
            opacity: 0.07,
            pointerEvents: "none",
            userSelect: "none"
        }}
        animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
        💰
    </motion.div>
)

const Footer = () => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-60px" })

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 28 },
        animate: inView ? { opacity: 1, y: 0 }: {},
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    })


    return (
        <footer
            ref={ref}
            style={{
                background: "#151e2d",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {floatingBags.map((b, i) => <MoneyBagFloat key={i} {...b} />)}

            <motion.div 
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                    height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.4), transparent)",
                    transformOrigin: "left",
                }}
            />

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "64px 32px 48px",
                    display: "flex",
                    gap: 48,
                    flexWrap: "wrap",
                }}
            >
                <motion.div {...fadeUp(0)} style={{ flex: "1 1 220px", maxWidth: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #d4a843, #2d3b1f)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Coins size={20} color="#fff" strokeWidth={1.8} />
                        </motion.div>
                        <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                            <span style={{ color: "#ffffff" }}>Ajo</span>
                            <span style={{ color: "#d4a843" }}>Pay</span>
                        </span>
                    </div>

                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 28, maxWidth: 240 }}>
                        Bringing Nigerian communities together for rotating savings with trust, transparency, and celebration.
                    </p>

                    <div style={{ display: "flex", gap: 10 }}>
                        {socials.map(({ icon: Icon, href }, i) => (
                            <motion.a
                                key={i}
                                href={href}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300 }}
                                whileHover={{ scale: 1.15, backgroundColor: "#d4a843", borderColor: "#d4a843" }}
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "50%",
                                    border: "1.5px solid rgba(255,255,255,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "rgba(255,255,255,0.6)",
                                    transition: "all 0.2s ease",
                                    textDecoration: "none",
                                }}
                            >
                                <Icon size={16} strokeWidth={1.8} />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                <div style={{ flex: "1 1 40px" }} />

                {Object.entries(footerLinks).map(([title, links], colIdx) => (
                    <motion.div
                        key={title}
                        {...fadeUp(0.12 *colIdx * 0.1)}
                        style={{ flex: "1 1 140px" }}
                    >
                        <p className='footer-col-title'>{title}</p>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0, 
                                margin: 0, 
                                display: "flex",
                                flexDirection: "column",
                                gap: 12
                            }}
                        >
                            {links.map((link, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.25 + colIdx * 0.1 + i * 0.06, duration: 0.45, ease: "easeOut" }}
                                >

                                    {link.href === null ? (
                                        <span className='footer-link' style={{ opacity: 0.35, cursor: "default" }}>
                                            {link.label}
                                            <span style={{ fontSize: "0.62rem", marginLeft: 6, color: "#d4a843", opacity: 0.7 }}>Soon</span>
                                        </span>
                                    ) : link.href.startsWith("/") && !link.href.includes("#") ? (
                                        <Link to={link.href} className='footer-link'>
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a href={link.href} className='footer-link'>
                                            {link.label}
                                        </a>
                                    )}

                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                    height: 1,
                    background: "rgba(255,255,255,0.07)",
                    maxWidth: 1200,
                    margin: "0 auto",
                }}
            />

            <motion.div
                {...fadeUp(0.55)}
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "24px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                <p
                    style={{ 
                        fontSize: "0.83rem", 
                        color: "rgba(255,255,255,0.35)" 
                    }}
                >
                    © 2026 AjoPay. All rights reserved.
                </p>
            </motion.div>
        </footer>
    )
}

export default Footer