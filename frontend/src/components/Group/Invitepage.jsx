import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
    Users, CircleDollarSign, Calendar, Trophy,
    ShieldCheck, Eye, Clock, UserPlus, Coins,
    Search, ArrowRight, AlertCircle, CheckCircle,
    Lock, Globe,
} from "lucide-react";
import AxiosInstance from "../AxiosInstance";
import usePageTitle from "../../hooks/usePageTitle";
import CoinLoader from "../CoinLoader";

const floats = [
    { x: "3%",  s: 18, d: 0,   dr: 5.2 },
    { x: "12%", s: 13, d: 1.7, dr: 4.6 },
    { x: "25%", s: 16, d: 0.8, dr: 5.8 },
    { x: "55%", s: 12, d: 2.3, dr: 4.4 },
    { x: "70%", s: 17, d: 0.4, dr: 5.0 },
    { x: "83%", s: 14, d: 1.2, dr: 4.8 },
    { x: "93%", s: 20, d: 2.8, dr: 5.4 },
];
const FloatCoin = ({ x, s, d, dr }) => (
    <motion.div style={{ position: "fixed", left: x, bottom: -50, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1200], opacity: [0, 0.12, 0.12, 0] }}
        transition={{ duration: dr, delay: d, repeat: Infinity, ease: "linear", times: [0, 0.07, 0.9, 1] }}>
        <Coins size={s} color="#d4a843" strokeWidth={1.1} />
    </motion.div>
);

const StatTile = ({ icon: Icon, iconBg, iconColor, label, value, sub, subColor, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
        style={{ flex: "1 1 180px", background: "#fff", borderRadius: 18, padding: "20px 18px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
            style={{ width: 46, height: 46, borderRadius: 13, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: `0 4px 14px ${iconBg}66` }}>
            <Icon size={22} color={iconColor} strokeWidth={1.8} />
        </motion.div>
        <p style={{ fontSize: "0.77rem", color: "#2d3b1f80", marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: "1.15rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: "0.78rem", fontWeight: 600, color: subColor || "#d4a843", marginTop: 5 }}>{sub}</p>}
    </motion.div>
);

const avatarColors = ["#2d3b1f","#d4a843","#e8863a","#7c5cbf","#1db893","#e84393","#2d9a4a","#e84343"];
const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : (parts[0] || "?")[0].toUpperCase();
};

const MemberAvatar = ({ name, i }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ delay: i * 0.06, type: "spring", stiffness: 280 }}
        title={name}
        style={{ width: 42, height: 42, borderRadius: "50%", background: avatarColors[i % avatarColors.length], border: "2.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.7rem", color: "#fff", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", marginLeft: i > 0 ? -10 : 0, position: "relative", zIndex: 10 - i }}>
        {getInitials(name)}
    </motion.div>
);

const EmptySlot = ({ i }) => (
    <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 260 }}
        style={{ width: 42, height: 42, borderRadius: "50%", background: "#f4f0ea", border: "2px dashed #d4a843", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: -10 }}>
        <UserPlus size={15} color="#d4a84380" strokeWidth={1.8} />
    </motion.div>
);

const fmtCurrency = (n) => `₦${Number(n || 0).toLocaleString()}`;
const capitalize  = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
const fmtDate     = (d) => d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const CodeInputScreen = ({ onSubmit, loading, error }) => {
    const [code, setCode] = useState("");
    const [focused, setFocused] = useState(false);

    const handleSubmit = () => {
        const trimmed = code.trim();
        if (trimmed) onSubmit(trimmed);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 40px rgba(0,0,0,0.08)", border: "1.5px solid #f0ece4" }}>

            <div style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#2d5a35 55%,#3d6a25 100%)", padding: "36px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                {[{ top: "10%", right: "8%", s: 80 }, { top: "40%", right: "22%", s: 60 }, { top: "5%", right: "32%", s: 45 }].map((c, i) => (
                    <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "linear" }}
                        style={{ position: "absolute", top: c.top, right: c.right, opacity: 0.09, pointerEvents: "none" }}>
                        <Coins size={c.s} color="#d4a843" strokeWidth={1} />
                    </motion.div>
                ))}
                <motion.div animate={{ rotate: [0, 10, -10, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
                    style={{ width: 64, height: 64, background: "rgba(212,168,67,0.2)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px solid rgba(212,168,67,0.4)" }}>
                    <Lock size={28} color="#d4a843" strokeWidth={1.8} />
                </motion.div>
                <h2 style={{ fontSize: "clamp(1.3rem,4vw,1.8rem)", fontWeight: 900, color: "#fff", fontFamily: "'Fraunces',serif", marginBottom: 8, position: "relative", zIndex: 1 }}>
                    Private Group Access
                </h2>
                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", position: "relative", zIndex: 1 }}>
                    Enter your invite code to preview and join the group
                </p>
            </div>

            <div style={{ padding: "32px 28px" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2d3b1f80", letterSpacing: "0.08em", marginBottom: 10 }}>INVITE CODE</p>

                <motion.div
                    animate={{ borderColor: error ? "#e84343" : focused ? "#2d3b1f" : "#e0dbd2", boxShadow: error ? "0 0 0 3px rgba(232,67,67,0.1)" : focused ? "0 0 0 3px rgba(45,59,31,0.09)" : "none" }}
                    transition={{ duration: 0.2 }}
                    style={{ border: "1.5px solid #e0dbd2", borderRadius: 14, padding: "14px 16px", background: "#fafaf8", marginBottom: 12 }}>
                    <input
                        type="text"
                        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                        style={{ width: "100%", border: "none", outline: "none", fontSize: "0.9rem", color: "#2d3b1f", background: "transparent", fontFamily: "monospace", letterSpacing: "0.04em" }}
                    />
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff0f0", border: "1.5px solid #ffd0d0", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                            <AlertCircle size={15} color="#e84343" strokeWidth={2} />
                            <p style={{ fontSize: "0.83rem", color: "#e84343", fontWeight: 600 }}>{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: loading || !code.trim() ? 1 : 1.02, backgroundColor: loading || !code.trim() ? "#2d3b1f" : "#1a2c10" }}
                    whileTap={{ scale: loading || !code.trim() ? 1 : 0.97 }}
                    onClick={handleSubmit}
                    disabled={loading || !code.trim()}
                    style={{ width: "100%", background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 13, padding: "15px", fontSize: "0.95rem", fontWeight: 700, cursor: loading || !code.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, opacity: !code.trim() ? 0.6 : 1, boxShadow: "0 4px 20px rgba(45,59,31,0.25)" }}>
                    {loading ? (
                        <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                                style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
                            Looking up group…
                        </>
                    ) : (
                        <><Search size={17} strokeWidth={2.5} />Find Group</>
                    )}
                </motion.button>

                <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#2d3b1f60", marginTop: 14, lineHeight: 1.6 }}>
                    Invite codes are shared by group admins.<br />Check your messages or email if you were invited.
                </p>
            </div>
        </motion.div>
    );
};

const GroupPreviewScreen = ({ group, inviteCode, onJoined }) => {
    const navigate = useNavigate();
    const [joining,  setJoining]  = useState(false);
    const [joined,   setJoined2]  = useState(false);
    const [joinErr,  setJoinErr]  = useState(null);

    const members    = group.members || [];
    const spotsLeft  = group.max_members - group.member_count;
    const fillPct    = Math.round((group.member_count / group.max_members) * 100);

    const handleJoin = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.bvn_verified) {
            setJoinErr("You need to verify your BVN before joining a group. Please verify from your profile.");
            return;
        }

        setJoining(true);
        setJoinErr(null);
        try {
            await AxiosInstance.post("api/groups/join/", { invite_code: inviteCode });
            setJoined2(true);
            setTimeout(() => navigate(`/groups/${group.id}`), 1800);
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to join. Please try again.";
            setJoinErr(msg);
        } finally {
            setJoining(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 40px rgba(0,0,0,0.08)", border: "1.5px solid #f0ece4" }}>

            <div style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#2d5a35 55%,#3d6a25 100%)", padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                {[{ top: "10%", right: "8%", s: 80 }, { top: "40%", right: "22%", s: 60 }, { top: "5%", right: "32%", s: 45 }].map((c, i) => (
                    <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "linear" }}
                        style={{ position: "absolute", top: c.top, right: c.right, opacity: 0.09, pointerEvents: "none" }}>
                        <Coins size={c.s} color="#d4a843" strokeWidth={1} />
                    </motion.div>
                ))}

                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "5px 12px", marginBottom: 14, backdropFilter: "blur(8px)" }}>
                    {group.is_public
                        ? <><Globe size={11} color="#d4a843" strokeWidth={2.5} /><span style={{ fontSize: "0.74rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Public Group</span></>
                        : <><Lock  size={11} color="#d4a843" strokeWidth={2.5} /><span style={{ fontSize: "0.74rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Private Group</span></>
                    }
                </div>

                <motion.h2 initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 900, color: "#fff", marginBottom: 10, position: "relative", zIndex: 1, fontFamily: "'Fraunces',serif" }}>
                    {group.name}
                </motion.h2>
                {group.description && (
                    <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
                        style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, maxWidth: 480, position: "relative", zIndex: 1 }}>
                        {group.description}
                    </motion.p>
                )}
            </div>

            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ padding: "18px 28px", borderBottom: "1px solid #f4f0ea", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#d4a843,#f0c84a)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.78rem", color: "#2d3b1f", border: "2.5px solid #fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    {getInitials(group.creator_name || "")}
                </div>
                <div>
                    <p style={{ fontSize: "0.74rem", color: "#2d3b1f70", marginBottom: 3 }}>Created by</p>
                    <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.97rem" }}>{group.creator_name}</p>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <p style={{ fontSize: "0.74rem", color: "#2d3b1f70", marginBottom: 3 }}>Start date</p>
                    <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.87rem" }}>{fmtDate(group.start_date)}</p>
                </div>
            </motion.div>

            <div style={{ padding: "22px 28px", display: "flex", gap: 14, flexWrap: "wrap", borderBottom: "1px solid #f4f0ea" }}>
                <StatTile icon={CircleDollarSign} iconBg="#fff8e0" iconColor="#d4a843"
                    label="Contribution"
                    value={fmtCurrency(group.contribution_amount)}
                    sub={`${capitalize(group.frequency)} payments`}
                    delay={0} />
                <StatTile icon={Users} iconBg="#eef5ee" iconColor="#2d3b1f"
                    label="Members"
                    value={`${group.member_count} / ${group.max_members}`}
                    sub={group.is_full ? "Group is full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                    subColor={group.is_full ? "#e84343" : "#2d3b1f80"}
                    delay={0.08} />
                <StatTile icon={Trophy} iconBg="#f4f0ea" iconColor="#2d3b1f80"
                    label="Total Payout"
                    value={fmtCurrency(group.total_pool)}
                    sub="When group is full"
                    subColor="#2d3b1f60"
                    delay={0.16} />
            </div>

            <div style={{ padding: "16px 28px", borderBottom: "1px solid #f4f0ea" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.8rem", color: "#2d3b1f80" }}>{group.is_full ? "Group is full" : "Group capacity"}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: group.is_full ? "#e84343" : "#2d3b1f" }}>{fillPct}%</span>
                </div>
                <div style={{ background: "#ede8de", borderRadius: 99, height: 9, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${fillPct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: "100%", borderRadius: 99, background: group.is_full ? "#e8634399" : "linear-gradient(90deg,#2d3b1f,#d4a843)" }} />
                </div>
            </div>

            {members.length > 0 && (
                <div style={{ padding: "20px 28px", borderBottom: "1px solid #f4f0ea" }}>
                    <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.93rem", marginBottom: 14 }}>Current Members</p>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        {members.map((m, i) => <MemberAvatar key={m.id} name={m.full_name} i={i} />)}
                        {Array.from({ length: Math.min(spotsLeft, 5) }).map((_, i) => <EmptySlot key={i} i={i} />)}
                        {spotsLeft > 5 && (
                            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f4f0ea", border: "1.5px solid #e0dbd2", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: -10, fontSize: "0.72rem", fontWeight: 700, color: "#2d3b1f80" }}>
                                +{spotsLeft - 5}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ padding: "24px 28px" }}>
                <AnimatePresence>
                    {joinErr && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff0f0", border: "1.5px solid #ffd0d0", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                            <AlertCircle size={15} color="#e84343" strokeWidth={2} />
                            <p style={{ fontSize: "0.83rem", color: "#e84343", fontWeight: 600 }}>{joinErr}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {joined ? (
                        <motion.div key="joined"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 280 }}
                            style={{ background: "#eef5ee", border: "2px solid #2d3b1f", borderRadius: 16, padding: "18px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>
                                <CheckCircle size={22} color="#2d3b1f" strokeWidth={2.5} />
                            </motion.div>
                            <span style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "1rem" }}>Joined! Redirecting you… 🎉</span>
                        </motion.div>
                    ) : group.is_full ? (
                        <div key="full" style={{ background: "#f4f0ea", borderRadius: 16, padding: "18px", textAlign: "center" }}>
                            <p style={{ fontWeight: 700, color: "#2d3b1f80", fontSize: "0.95rem" }}>This group is currently full</p>
                            <p style={{ fontSize: "0.8rem", color: "#2d3b1f60", marginTop: 4 }}>Check back later if a spot opens up</p>
                        </div>
                    ) : (
                        <motion.button key="join"
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            whileHover={{ scale: joining ? 1 : 1.02, backgroundColor: joining ? "#d4a843" : "#c49a35" }}
                            whileTap={{ scale: joining ? 1 : 0.97 }}
                            onClick={handleJoin}
                            disabled={joining}
                            style={{ width: "100%", background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 16, padding: "18px", fontSize: "1.05rem", fontWeight: 700, cursor: joining ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 6px 24px rgba(212,168,67,0.4)" }}>
                            {joining ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                                        style={{ width: 20, height: 20, borderRadius: "50%", border: "2.5px solid rgba(45,59,31,0.3)", borderTopColor: "#2d3b1f" }} />
                                    Joining…
                                </>
                            ) : (
                                <>
                                    <motion.span whileHover={{ rotate: 20 }} style={{ display: "inline-flex" }}>
                                        <Users size={20} strokeWidth={2} />
                                    </motion.span>
                                    Join This Group
                                </>
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>

                {!joined && !group.is_full && !JSON.parse(localStorage.getItem("user") || "{}").bvn_verified && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fffbe8", border: "1.5px solid #f5e090", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                        <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
                        <p style={{ fontSize: "0.8rem", color: "#8a6a00", lineHeight: 1.55 }}>
                            <strong>BVN not verified.</strong> Verify your BVN from your profile before joining any group.
                        </p>
                    </motion.div>
                )}
                
                {!joined && !group.is_full && (
                    <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#2d3b1f60", marginTop: 12 }}>
                        By joining, you agree to contribute {fmtCurrency(group.contribution_amount)} {group.frequency}
                    </p>
                )}
            </div>

            <div style={{ borderTop: "1px solid #f4f0ea", display: "flex" }}>
                {[
                    { Icon: ShieldCheck, label: "Secure Payments",    sub: "Powered by Paystack" },
                    { Icon: Eye,         label: "Full Transparency",   sub: "Track every transaction" },
                    { Icon: Clock,       label: "Auto Payouts",        sub: "On-time, every time" },
                ].map(({ Icon, label, sub }, i) => (
                    <div key={i} style={{ flex: 1, padding: "18px 12px", textAlign: "center", borderRight: i < 2 ? "1px solid #f4f0ea" : "none" }}>
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                            style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid #d4a843", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                            <Icon size={17} color="#d4a843" strokeWidth={1.8} />
                        </motion.div>
                        <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.8rem", marginBottom: 3 }}>{label}</p>
                        <p style={{ fontSize: "0.72rem", color: "#2d3b1f70" }}>{sub}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const Invitepage = () => {
    const { code: urlCode } = useParams(); 

    const [initLoading, setInitLoading] = useState(true);

    const [inputCode,   setInputCode]   = useState(urlCode || "");
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupError,   setLookupError]   = useState(null);

    const [group,      setGroup]      = useState(null);
    const [activeCode, setActiveCode] = useState(null); 
    
    usePageTitle("Join Group");


    const fetchGroup = async (code) => {
        setLookupLoading(true);
        setLookupError(null);
        try {
            const res = await AxiosInstance.get(`api/groups/invite/${code}/`);
            setGroup(res.data);
            setActiveCode(code);
        } catch (err) {
            const status = err.response?.status;
            if (status === 404) {
                setLookupError("No group found with that invite code. Please double-check and try again.");
            } else {
                setLookupError("Something went wrong. Please try again.");
            }
            setGroup(null);
            setActiveCode(null);
        } finally {
            setLookupLoading(false);
        }
    };

    useEffect(() => {
        if (!initLoading && urlCode) {
            fetchGroup(urlCode);
        }
    }, [initLoading, urlCode]);

    const handleCodeSubmit = (code) => {
        fetchGroup(code);
    };

    return (
        <>
            <AnimatePresence>
                {initLoading && <CoinLoader key="loader" onDone={() => setInitLoading(false)} />}
            </AnimatePresence>

            {!initLoading && (
                <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", overflowX: "hidden" }}>
                    {floats.map((c, i) => <FloatCoin key={i} {...c} />)}

                    <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,59,31,0.04),transparent 70%)", top: "5%", left: "-10%", pointerEvents: "none", zIndex: 0 }} />
                    <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,168,67,0.07),transparent 70%)", bottom: "8%", right: "-8%", pointerEvents: "none", zIndex: 0 }} />

                    <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(32px,5vw,64px) clamp(16px,3vw,28px) 80px", position: "relative", zIndex: 1 }}>

                        <motion.div initial={{ opacity: 0, y: -22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            style={{ textAlign: "center", marginBottom: 36 }}>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 5, 0], scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
                                style={{ width: 72, height: 72, background: "linear-gradient(135deg,#d4a843,#f0c84a)", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 8px 28px rgba(212,168,67,0.4)" }}>
                                <Users size={32} color="#2d3b1f" strokeWidth={1.8} />
                            </motion.div>
                            <h1 style={{ fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 10 }}>
                                {group ? "You're Invited!" : "Join a Savings Group"}
                            </h1>
                            <p style={{ fontSize: "0.97rem", color: "#2d3b1f80", lineHeight: 1.6 }}>
                                {group
                                    ? "Review the group details below and join to start saving together"
                                    : "Enter your invite code to find and join a private savings circle"}
                            </p>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {group ? (
                                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <GroupPreviewScreen
                                        group={group}
                                        inviteCode={activeCode}
                                        onJoined={() => {}}
                                    />
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                        style={{ textAlign: "center", marginTop: 20 }}>
                                        <button onClick={() => { setGroup(null); setActiveCode(null); setLookupError(null); }}
                                            style={{ background: "none", border: "none", fontSize: "0.83rem", color: "#2d3b1f80", cursor: "pointer", fontWeight: 500, textDecoration: "underline", fontFamily: "'DM Sans',sans-serif" }}>
                                            ← Try a different invite code
                                        </button>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <CodeInputScreen
                                        onSubmit={handleCodeSubmit}
                                        loading={lookupLoading}
                                        error={lookupError}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </>
    );
};

export default Invitepage;