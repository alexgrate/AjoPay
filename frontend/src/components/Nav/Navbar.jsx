import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Coins, Menu, X, Plus, User, LayoutDashboard, Users, LogOut, ChevronDown, Bell } from "lucide-react"
import { useLogout } from '../../hooks/useLogout'
import { navLinks } from '../../context'

const MotionLink = motion.create(Link)

const getInitials = (name = "") => {
    const parts = name.trim().split(" ")
    return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0] || "?")[0].toUpperCase()
}

const AvatarMenu = ({ user, onClose }) => {
    const { logout, loading } = useLogout()
    const navigate = useNavigate()

    const menuItems = [
        { Icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard"  },
        { Icon: Users,           label: "My Groups",  href: "/groups"     },
        { Icon: User,            label: "Profile",    href: "/profile"    },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0,
                background: "#fff", borderRadius: 16,
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                border: "1.5px solid #f0ece4",
                minWidth: 220, overflow: "hidden", zIndex: 9999,
            }}
        >

            <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #f4f0ea" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#2d3b1f", marginBottom: 2 }}>
                    {user.full_name || `${user.first_name} ${user.last_name}`.trim() || "User"}
                </p>
                <p style={{ fontSize: "0.76rem", color: "#2d3b1f70", marginBottom: 8 }}>{user.email}</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.72rem", color: "#2d3b1f60" }}>Trust Score</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: user.trust_tier?.color || "#9e9e9e" }}>
                        {user.trust_score ?? 0} — {user.trust_tier?.label || "New Member"}
                    </span>
                </div>
                <div style={{ background: "#f0ece4", borderRadius: 99, height: 4, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: `${user.trust_score ?? 0}%`, height: "100%", borderRadius: 99, background: user.trust_tier?.color || "#9e9e9e", transition: "width 0.6s ease" }} />
                </div>

                {!user.bvn_verified ? (
                    <Link to="/verify-bvn" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fffbe8", border: "1px solid #f5e090", borderRadius: 8, padding: "6px 10px", textDecoration: "none" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e84343", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8a6a00" }}>BVN not verified — tap to verify</span>
                    </Link>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0faf6", border: "1px solid #c8ede0", borderRadius: 8, padding: "6px 10px" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1db893", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1a5c3a" }}>BVN Verified · Score {user.credit_score}</span>
                    </div>
                )}
            </div>

            <div style={{ padding: "6px 0" }}>
                {menuItems.map(({ Icon, label, href }, i) => (
                    <motion.div key={i} whileHover={{ backgroundColor: "#f8f6f0" }}>
                        <Link
                            to={href}
                            onClick={onClose}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "11px 18px",
                                color: "#2d3b1f", fontSize: "0.88rem", fontWeight: 500,
                                textDecoration: "none",
                            }}
                        >
                            <Icon size={15} strokeWidth={2} color="#2d3b1f80" />
                            {label}
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div style={{ borderTop: "1px solid #f4f0ea", padding: "6px 0 4px" }}>
                <motion.button
                    whileHover={{ backgroundColor: "#fff5f5" }}
                    onClick={() => { onClose(); logout(); }}
                    disabled={loading}
                    style={{
                        width: "100%", border: "none", background: "transparent",
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "11px 18px", cursor: loading ? "not-allowed" : "pointer",
                        color: loading ? "#2d3b1f60" : "#e84343",
                        fontSize: "0.88rem", fontWeight: 600, textAlign: "left",
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    {loading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #e8434440", borderTopColor: "#e84343", flexShrink: 0 }}
                        />
                    ) : (
                        <LogOut size={15} strokeWidth={2} />
                    )}
                    {loading ? "Logging out..." : "Log out"}
                </motion.button>
            </div>
        </motion.div>
    )
}

const MobileAuthMenu = ({ user, onClose }) => {
    const { logout, loading } = useLogout()

    const links = [
        { label: "Dashboard",    href: "/dashboard"    },
        { label: "My Groups",    href: "/groups"       },
        { label: "Create Group", href: "/create-group" },
        { label: "Profile",      href: "/profile"      },
    ]

    return (
        <div style={{ padding: "12px 20px 24px", borderTop: "1px solid rgba(45,59,31,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0 16px", borderBottom: "1px solid rgba(45,59,31,0.08)", marginBottom: 8 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#2d3b1f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#d4a843", flexShrink: 0 }}>
                    {getInitials(user.full_name || `${user.first_name} ${user.last_name}`)}
                </div>
                <div>
                    <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.93rem" }}>
                        {user.full_name || `${user.first_name} ${user.last_name}`.trim()}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#2d3b1f70" }}>{user.email}</p>
                </div>
            </div>

            {links.map((link, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                        to={link.href}
                        onClick={onClose}
                        style={{ display: "block", padding: "13px 0", fontSize: "0.95rem", fontWeight: 500, color: "rgba(45,59,31,0.8)", borderBottom: "1px solid rgba(45,59,31,0.06)", textDecoration: "none" }}
                    >
                        {link.label}
                    </Link>
                </motion.div>
            ))}

            <motion.button
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: links.length * 0.05 }}
                onClick={() => { onClose(); logout(); }}
                disabled={loading}
                style={{ width: "100%", marginTop: 16, background: "#fff0f0", border: "1.5px solid #ffd0d0", borderRadius: 12, padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#e84343", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
                {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid #e8434440", borderTopColor: "#e84343" }} />
                ) : <LogOut size={15} strokeWidth={2} />}
                {loading ? "Logging out…" : "Log out"}
            </motion.button>
        </div>
    )
}

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [avatarOpen, setAvatarOpen] = useState(false)
    const avatarRef = useRef(null)

    const location = useLocation()

    const storedUser = localStorage.getItem("user")
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    const isLoggedIn = !!currentUser && !!localStorage.getItem("access_token")

    const isPublicPage = ["/", "/login", "/register", "/forgotten-password"].includes(location.pathname)

    const showAuthNav = isLoggedIn && !isPublicPage

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [mobileOpen])

    useEffect(() => {
        const handler = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    useEffect(() => { setMobileOpen(false); setAvatarOpen(false) },
[location.pathname])

    const initials = currentUser ? getInitials(currentUser.full_name || `${currentUser.first_name || ""}
        ${currentUser.last_name || ""}`)
        : ""

    return (
        <motion.nav
            animate={{
                backgroundColor: scrolled ? "rgba(255,255,255,1)" : "rgba(245,240,232,0)",
                boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.08)" : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
        >
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 3vw, 48px)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>

                    <Link to={isLoggedIn ? "/dashboard" : "/"} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#d4a843,#2d3b1f)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Coins color="#fff" size={20} />
                        </motion.div>
                        <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
                            <span style={{ color: "#2d3b1f" }}>Ajo</span>
                            <span style={{ color: "#d4a843" }}>Pay</span>
                        </span>
                    </Link>

                    <div style={{ display: "none" }} className='md-flex-row'>
                        {showAuthNav ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <MotionLink
                                    to="/create-group"
                                    whileHover={{ scale: 1.04, backgroundColor: "#1a2c10" }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{ display: "flex", alignItems: "center", gap: 7, background: "#2d3b1f", color: "#fff", borderRadius: 12, padding: "9px 18px", fontSize: "0.87rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(45,59,31,0.22)" }}
                                >
                                    <motion.span>
                                        <Plus size={15} strokeWidth={2.5} />
                                    </motion.span>
                                    New Group
                                </MotionLink>

                                <motion.button
                                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                                    title="Notifications — coming soon"
                                    style={{ position: "relative", width: 42, height: 42, borderRadius: 12, border: "1.5px solid #e8e2d8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                >
                                    <Bell size={17} color="#2d3b1f80" strokeWidth={2} />
                                </motion.button>

                                <div ref={avatarRef} style={{ position: "relative" }}>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        onClick={() => setAvatarOpen(v => !v)}
                                        style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e8e2d8", borderRadius: 12, padding: "6px 10px 6px 6px", cursor: "pointer", position: "relative" }}
                                    >
                                        <div style={{ width: 32, height: 32, borderRadius: 9, background: "#2d3b1f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.72rem", color: "#d4a843", flexShrink: 0 }}>
                                            {initials}
                                        </div>
                                        {currentUser && !currentUser.bvn_verified && (
                                            <div style={{ position: "absolute", top: -3, right: -3, width: 10, height: 10, borderRadius: "50%", background: "#e84343", border: "2px solid #fff" }} />
                                        )}
                                        <motion.span animate={{ rotate: avatarOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "inline-flex" }}>
                                            <ChevronDown size={14} color="#2d3b1f80" strokeWidth={2.5} />
                                        </motion.span>
                                    </motion.button>

                                    <AnimatePresence>
                                        {avatarOpen && (
                                            <AvatarMenu user={currentUser} onClose={() => setAvatarOpen(false)} />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ): (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <MotionLink to="/login"
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                    style={{ padding: "9px 20px", fontSize: "0.87rem", fontWeight: 700, color: "#2d3b1f", border: "2px solid #2d3b1f", borderRadius: 12, textDecoration: "none" }}>
                                    Login
                                </MotionLink>

                                <MotionLink to="/register"
                                    whileHover={{ scale: 1.05, backgroundColor: "#c49a35" }} whileTap={{ scale: 0.97 }}
                                    style={{ padding: "9px 20px", fontSize: "0.87rem", fontWeight: 700, color: "#fff", background: "#d4a843", border: "2px solid #d4a843", borderRadius: 12, textDecoration: "none" }}>
                                    Get Started
                                </MotionLink>
                            </div>
                        )}
                    </div>

                    <motion.button
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#2d3b1f", padding: 6, display: "none" }}
                        className='md-hide-show'
                        onClick={() => setMobileOpen(v => !v)}
                        whileTap={{ scale: 0.9 }}
                        aria-label='Toggle menu'
                    >
                        {mobileOpen ? <X size={28} /> : <Menu size={28} /> }
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        style={{ overflow: "hidden", background: "rgba(255,255,255,0.98)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(45,59,31,0.08)" }}
                    >
                        {showAuthNav ? (
                            <MobileAuthMenu user={currentUser} onClose={() => setMobileOpen(false)} />
                        ) : (
                            <div style={{ padding: "12px 20px 24px" }}>
                                {/* Landing page anchor links */}
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.label}
                                        href={link.href}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06, duration: 0.2 }}
                                        onClick={() => setMobileOpen(false)}
                                        style={{ display: "block", padding: "13px 0", fontSize: "0.95rem", fontWeight: 500, color: "rgba(45,59,31,0.8)", borderBottom: "1px solid rgba(45,59,31,0.06)", textDecoration: "none" }}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                                    <MotionLink to="/login" onClick={() => setMobileOpen(false)}
                                        style={{ width: "100%", padding: "13px", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, color: "#2d3b1f", border: "2px solid #2d3b1f", borderRadius: 12, textDecoration: "none", display: "block" }}>
                                        Login
                                    </MotionLink>
                                    <MotionLink to="/register" onClick={() => setMobileOpen(false)}
                                        style={{ width: "100%", padding: "13px", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, color: "#fff", background: "#d4a843", borderRadius: 12, textDecoration: "none", display: "block" }}>
                                        Get Started
                                    </MotionLink>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar