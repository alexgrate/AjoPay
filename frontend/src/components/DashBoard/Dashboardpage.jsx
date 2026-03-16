import { useState, useEffect, useCallback } from "react";
import { Coins, Users, Plus, ArrowRight, Clock, Timer, CircleDollarSign, Trophy, RefreshCw, Globe, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AxiosInstance from "../AxiosInstance";

const MotionLink = motion.create(Link);

const coinSeeds = [
    { x: "3%",  size: 20, delay: 0,   dur: 5.2 },
    { x: "11%", size: 14, delay: 1.4, dur: 4.6 },
    { x: "22%", size: 18, delay: 0.7, dur: 5.8 },
    { x: "34%", size: 12, delay: 2.1, dur: 4.4 },
    { x: "47%", size: 16, delay: 0.3, dur: 5.0 },
    { x: "57%", size: 20, delay: 1.8, dur: 4.8 },
    { x: "67%", size: 13, delay: 0.9, dur: 5.4 },
    { x: "77%", size: 18, delay: 2.6, dur: 4.2 },
    { x: "87%", size: 15, delay: 1.1, dur: 5.6 },
    { x: "94%", size: 22, delay: 0.5, dur: 4.9 },
];

const FloatingCoin = ({ x, size, delay, dur }) => (
    <motion.div
        style={{ position: "fixed", left: x, bottom: -50, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1100], opacity: [0, 0.18, 0.18, 0] }}
        transition={{ duration: dur, delay, repeat: Infinity, ease: "linear", times: [0, 0.08, 0.88, 1] }}
    >
        <Coins size={size} color="#d4a843" strokeWidth={1.2} />
    </motion.div>
);

const quickActions = [
    { Icon: Plus,              label: "Create New Group",   href: "/create-group" },
    { Icon: Users,             label: "Browse Public Groups", href: "/groups?tab=available" },
    { Icon: CircleDollarSign,  label: "View All Groups",    href: "/groups" },
];

const fmtCurrency = (n) => `₦${Number(n || 0).toLocaleString()}`;
const capitalize  = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const ACCENT_PAIRS = [
    { accent: "#2d3b1f", btnBg: "#2d3b1f", cardBg: "#fff" },
    { accent: "#d4a843", btnBg: "#d4a843", cardBg: "#fffdf5" },
    { accent: "#7c5cbf", btnBg: "#7c5cbf", cardBg: "#fdfbff" },
    { accent: "#1db893", btnBg: "#1db893", cardBg: "#f5fffc" },
    { accent: "#e8863a", btnBg: "#e8863a", cardBg: "#fffaf5" },
];

const StatCard = ({ icon: Icon, iconBg, label, value, badge, badgeBg, badgeFg, i }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.12)" }}
        style={{ background: "#fff", borderRadius: 22, padding: "24px 20px", flex: "1 1 160px", minWidth: 150, position: "relative", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)", cursor: "default" }}
    >
        {badge && (
            <span style={{ position: "absolute", top: 14, right: 14, background: badgeBg, color: badgeFg, fontSize: "0.7rem", fontWeight: 700, borderRadius: 99, padding: "3px 9px" }}>
                {badge}
            </span>
        )}
        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.65, ease: "easeInOut" }}
            style={{ width: 52, height: 52, borderRadius: 14, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: `0 6px 18px ${iconBg}66` }}>
            <Icon size={24} color="#fff" strokeWidth={1.8} />
        </motion.div>
        <p style={{ fontSize: "0.8rem", color: "#2d3b1f70", marginBottom: 5, fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: "1.45rem", fontWeight: 900, color: "#2d3b1f", lineHeight: 1, fontFamily: "'Fraunces',serif" }}>{value}</p>
    </motion.div>
);

const SkeletonCard = ({ i }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
        style={{ background: "#fff", borderRadius: 22, padding: "24px 20px", flex: "1 1 160px", minWidth: 150, border: "1.5px solid #f0ece4" }}>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 52, height: 52, borderRadius: 14, background: "#f0ece4", marginBottom: 14 }} />
        <div style={{ width: "60%", height: 10, background: "#f0ece4", borderRadius: 6, marginBottom: 8 }} />
        <div style={{ width: "80%", height: 22, background: "#f0ece4", borderRadius: 6 }} />
    </motion.div>
);

const ProgressBar = ({ pct, color }) => (
    <div style={{ background: "#ede8de", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", borderRadius: 99, background: color }}
        />
    </div>
);

const GroupCard = ({ g, i, myMembership }) => {
    const pair    = ACCENT_PAIRS[i % ACCENT_PAIRS.length];
    const fillPct = Math.round((g.member_count / g.max_members) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: "0 16px 44px rgba(0,0,0,0.10)" }}
            style={{ background: pair.cardBg, borderRadius: 22, padding: "26px 26px 22px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8, flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: pair.accent, fontFamily: "'Fraunces',serif" }}>
                            {g.name}
                        </h3>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: g.is_public ? "#f0fff4" : "#f4f0ea", color: g.is_public ? "#1a7a3a" : "#2d3b1f80", fontSize: "0.65rem", fontWeight: 700, borderRadius: 99, padding: "2px 7px", flexShrink: 0 }}>
                            {g.is_public ? <Globe size={9} strokeWidth={2.5} /> : <Lock size={9} strokeWidth={2.5} />}
                            {g.is_public ? "Public" : "Private"}
                        </span>
                        <span style={{ background: g.status === "active" ? "#e2f8ec" : "#fff8e0", color: g.status === "active" ? "#1a7a3a" : "#8a6a00", fontSize: "0.65rem", fontWeight: 700, borderRadius: 99, padding: "2px 7px" }}>
                            {g.status}
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        {[
                            { Icon: Users,  txt: `${g.member_count}/${g.max_members} members` },
                            { Icon: Coins,  txt: fmtCurrency(g.contribution_amount) },
                            { Icon: Timer,  txt: myMembership ? `Position #${myMembership.payout_order}` : "—" },
                        ].map(({ Icon, txt }, idx) => (
                            <motion.span key={idx} whileHover={{ scale: 1.05 }}
                                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "#2d3b1f80" }}>
                                <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                    <Icon size={12} strokeWidth={2} color="#2d3b1f80" />
                                </motion.span>
                                {txt}
                            </motion.span>
                        ))}
                    </div>
                </div>

                <MotionLink to={`/groups/${g.id}`}
                    whileHover={{ scale: 1.15, rotate: -12 }} whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 350 }}
                    style={{ width: 44, height: 44, borderRadius: "50%", background: pair.btnBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 12, textDecoration: "none", boxShadow: `0 4px 16px ${pair.btnBg}55` }}>
                    <ArrowRight size={20} color="#fff" strokeWidth={2.2} />
                </MotionLink>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: "0.8rem", color: "#2d3b1f70" }}>Group Capacity</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2d3b1f" }}>{fillPct}%</span>
            </div>
            <ProgressBar pct={fillPct} color={pair.accent} />

            <div style={{ marginTop: 14, background: "rgba(45,59,31,0.04)", borderRadius: 12, padding: "13px 15px", display: "flex", justifyContent: "space-between" }}>
                <div>
                    <p style={{ fontSize: "0.73rem", color: "#2d3b1f60", marginBottom: 3 }}>Contribution</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2d3b1f" }}>
                        {fmtCurrency(g.contribution_amount)} / {g.frequency}
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.73rem", color: "#2d3b1f60", marginBottom: 3 }}>Total Pool</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#d4a843" }}>
                        {fmtCurrency(g.total_pool)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const GroupSkeleton = ({ i }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
        style={{ background: "#fff", borderRadius: 22, padding: "26px", border: "1.5px solid #f0ece4" }}>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <div style={{ width: "55%", height: 18, background: "#f0ece4", borderRadius: 6, marginBottom: 14 }} />
            <div style={{ width: "80%", height: 12, background: "#f0ece4", borderRadius: 6, marginBottom: 20 }} />
            <div style={{ height: 8, background: "#f0ece4", borderRadius: 99, marginBottom: 14 }} />
            <div style={{ height: 58, background: "#f0ece4", borderRadius: 12 }} />
        </motion.div>
    </motion.div>
);

const EmptyGroups = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "#fff", borderRadius: 22, padding: "44px 28px", textAlign: "center", border: "1.5px dashed #e0dbd2" }}>
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <Users size={44} color="#d4a84355" strokeWidth={1.2} style={{ margin: "0 auto 14px" }} />
        </motion.div>
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#2d3b1f80", marginBottom: 6 }}>No groups yet</p>
        <p style={{ fontSize: "0.84rem", color: "#2d3b1f60", marginBottom: 20 }}>Create or join a savings circle to get started</p>
        <MotionLink to="/create-group" whileHover={{ scale: 1.03 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#2d3b1f", color: "#fff", borderRadius: 12, padding: "11px 22px", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            <Plus size={15} strokeWidth={2.5} />Create your first group
        </MotionLink>
    </motion.div>
);

const Dashboardpage = () => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user") || "{}")
    );
    const firstName = currentUser.full_name?.split(" ")[0] || currentUser.first_name || "there";

    const [groups,       setGroups]       = useState([]);
    const [groupsLoading,setGroupsLoading]= useState(true);
    const [groupsError,  setGroupsError]  = useState(null);

    const fetchGroups = useCallback(async () => {
        setGroupsLoading(true);
        setGroupsError(null);
        try {
            const res = await AxiosInstance.get("api/groups/");
            setGroups(res.data);
        } catch {
            setGroupsError("Failed to load groups.");
        } finally {
            setGroupsLoading(false);
        }
    }, []);

    useEffect(() => { fetchGroups(); }, [fetchGroups]);

    useEffect(() => {
        const refreshProfile = async () => {
            try {
                const res = await AxiosInstance.get("api/accounts/profile/");
                localStorage.setItem("user", JSON.stringify(res.data));
                setCurrentUser(res.data);
            } catch {
            }
        };
        refreshProfile();
    }, []);

    const totalPool     = groups.reduce((sum, g) => sum + Number(g.total_pool || 0), 0);
    const activeGroups  = groups.filter(g => g.status === "active").length;
    const pendingGroups = groups.filter(g => g.status === "pending").length;
    const adminGroups   = groups.filter(g => {
        return g.creator === currentUser.id;
    }).length;

    const statCards = [
        {
            icon: CircleDollarSign,
            iconBg: "#d4a843",
            label: "Total Savings Pool",
            value: fmtCurrency(totalPool),
            badge: groups.length > 0 ? `${groups.length} group${groups.length !== 1 ? "s" : ""}` : null,
            badgeBg: "#fff8e0",
            badgeFg: "#8a6a00",
        },
        {
            icon: Users,
            iconBg: "#2d3b1f",
            label: "Active Groups",
            value: groupsLoading ? "—" : String(activeGroups),
            badge: pendingGroups > 0 ? `${pendingGroups} pending` : null,
            badgeBg: "#fff0e0",
            badgeFg: "#a05a00",
        },
        {
            icon: Trophy,
            iconBg: "#7c5cbf",
            label: "Groups as Admin",
            value: groupsLoading ? "—" : String(adminGroups),
            badge: adminGroups > 0 ? "Admin" : null,
            badgeBg: "#f0ecff",
            badgeFg: "#7c5cbf",
        },
        {
            icon: Trophy,
            iconBg: currentUser.trust_score >= 75 ? "#1db893" :
                    currentUser.trust_score >= 50 ? "#d4a843" :
                    currentUser.trust_score >= 20 ? "#e8863a" : "#9e9e9e",
            label: "Trust Score",
            value: currentUser.trust_score ?? 0,
            badge: currentUser.trust_tier?.label || "New Member",
            badgeBg: (currentUser.trust_tier?.color || "#9e9e9e") + "22",
            badgeFg: currentUser.trust_tier?.color || "#9e9e9e",
        },
    ];


    const activities = groups.slice(0, 4).map((g, i) => ({
        Icon: i === 0 ? Users : i === 1 ? Coins : i === 2 ? Trophy : RefreshCw,
        bg: ["#fff8e0", "#eef5ee", "#f0ecff", "#fff0f0"][i % 4],
        ic: ["#d4a843", "#2d3b1f", "#7c5cbf", "#e84343"][i % 4],
        text: `You are a member of "${g.name}"`,
        time: capitalize(g.status) + " · " + capitalize(g.frequency),
    }));

    return (
        <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", overflow: "hidden" }}>
            {coinSeeds.map((c, i) => <FloatingCoin key={i} {...c} />)}

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(32px, 5vw, 64px) clamp(16px, 3vw, 40px) 60px", position: "relative", zIndex: 1 }}>

                <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ marginBottom: 36, marginTop: 20 }}>
                    <h1 style={{ fontSize: "clamp(1.7rem,4vw,2.5rem)", fontWeight: 900, color: "#2d3b1f", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontFamily: "'Fraunces',serif" }}>
                        Welcome back, {firstName}!
                        <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                            style={{ display: "inline-block" }}>👋</motion.span>
                    </h1>
                    <p style={{ fontSize: "0.95rem", color: "#2d3b1f80", marginTop: 8 }}>
                        {groupsLoading
                            ? "Loading your savings overview…"
                            : groups.length > 0
                                ? `You're part of ${groups.length} group${groups.length !== 1 ? "s" : ""} · Keep it up!`
                                : "Start your savings journey by creating or joining a group"
                        }
                    </p>
                </motion.div>

                {!currentUser.bvn_verified && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ background: "#fffbe8", border: "1.5px solid #f5e090", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>⚠️</span>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <p style={{ fontWeight: 700, color: "#8a6a00", fontSize: "0.9rem", marginBottom: 2 }}>
                                BVN Not Verified
                            </p>
                            <p style={{ fontSize: "0.8rem", color: "#8a6a00" }}>
                                Verify your BVN to unlock group joining and creation.
                            </p>
                        </div>
                        <MotionLink
                            to="/verify-bvn"
                            whileHover={{ scale: 1.03 }}
                            style={{ background: "#d4a843", color: "#2d3b1f", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", flexShrink: 0 }}>
                            Verify Now →
                        </MotionLink>
                    </motion.div>
                )}

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
                    {groupsLoading
                        ? [0, 1, 2, 3].map(i => <SkeletonCard key={i} i={i} />)
                        : statCards.map((s, i) => <StatCard key={i} {...s} i={i} />)
                    }
                </div>

                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

                    <div style={{ flex: "1 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d3b1f", display: "flex", alignItems: "center", gap: 8 }}>
                                <motion.span whileHover={{ rotate: 20 }} style={{ display: "inline-flex" }}>
                                    <Users size={19} color="#d4a843" strokeWidth={2} />
                                </motion.span>
                                My Active Groups
                            </h2>
                            <MotionLink to="/create-group"
                                whileHover={{ scale: 1.04, backgroundColor: "#1a2c10" }} whileTap={{ scale: 0.95 }}
                                style={{ background: "#2d3b1f", color: "#fff", borderRadius: 12, padding: "10px 20px", fontSize: "0.87rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 4px 16px rgba(45,59,31,0.25)", textDecoration: "none" }}>
                                <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                                    <Plus size={15} strokeWidth={2.5} />
                                </motion.span>
                                Create Group
                            </MotionLink>
                        </motion.div>

                        {groupsLoading ? (
                            [0, 1].map(i => <GroupSkeleton key={i} i={i} />)
                        ) : groupsError ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ background: "#fff0f0", borderRadius: 16, padding: "24px", textAlign: "center", border: "1.5px solid #ffd0d0" }}>
                                <p style={{ color: "#e84343", fontWeight: 600, marginBottom: 12 }}>{groupsError}</p>
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchGroups}
                                    style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: "0.86rem" }}>
                                    Try Again
                                </motion.button>
                            </motion.div>
                        ) : groups.length === 0 ? (
                            <EmptyGroups />
                        ) : (
                            groups.map((g, i) => (
                                <GroupCard
                                    key={g.id}
                                    g={g}
                                    i={i}
                                    myMembership={null}  
                                />
                            ))
                        )}

                        {!groupsLoading && groups.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                                <MotionLink to="/groups"
                                    whileHover={{ backgroundColor: "#ece6da", x: 2 }}
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", border: "1.5px solid #e8e2d8", borderRadius: 16, padding: "15px", fontSize: "0.93rem", fontWeight: 700, color: "#2d3b1f", textDecoration: "none" }}>
                                    View All Groups
                                    <motion.span whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                                        <ArrowRight size={17} strokeWidth={2.2} />
                                    </motion.span>
                                </MotionLink>
                            </motion.div>
                        )}
                    </div>

                    <div style={{ flex: "0 1 300px", minWidth: 260, display: "flex", flexDirection: "column", gap: 20 }}>

                        <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            style={{ background: "#fff", borderRadius: 22, padding: "24px 20px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                            <h3 style={{ fontSize: "0.97rem", fontWeight: 800, color: "#2d3b1f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                    <Clock size={17} color="#d4a843" strokeWidth={2} />
                                </motion.span>
                                Recent Activity
                            </h3>

                            {groupsLoading ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {[0, 1, 2].map(i => (
                                        <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                                            style={{ display: "flex", gap: 11 }}>
                                            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f0ece4", flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ height: 12, background: "#f0ece4", borderRadius: 6, marginBottom: 6, width: "90%" }} />
                                                <div style={{ height: 10, background: "#f0ece4", borderRadius: 6, width: "55%" }} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : activities.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "20px 0" }}>
                                    <Clock size={32} color="#d4a84340" strokeWidth={1.2} style={{ margin: "0 auto 10px" }} />
                                    <p style={{ fontSize: "0.84rem", color: "#2d3b1f70" }}>No activity yet</p>
                                    <p style={{ fontSize: "0.75rem", color: "#2d3b1f50", marginTop: 4 }}>Transactions will appear here</p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {activities.map(({ Icon, bg, ic, text, time }, i) => (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, amount: 0.5 }}
                                            transition={{ delay: i * 0.1, duration: 0.45 }}
                                            style={{ display: "flex", gap: 11 }}>
                                            <motion.div whileHover={{ rotate: 20, scale: 1.12 }} transition={{ type: "spring", stiffness: 300 }}
                                                style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Icon size={15} color={ic} strokeWidth={2} />
                                            </motion.div>
                                            <div>
                                                <p style={{ fontSize: "0.81rem", color: "#2d3b1f", fontWeight: 500, lineHeight: 1.55, marginBottom: 3 }}>{text}</p>
                                                <p style={{ fontSize: "0.73rem", color: "#2d3b1f55" }}>{time}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <p style={{ fontSize: "0.72rem", color: "#2d3b1f50", textAlign: "center", paddingTop: 4, borderTop: "1px solid #f4f0ea", marginTop: 4 }}>
                                        Full transaction history coming soon
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                            style={{ background: "linear-gradient(150deg, #2d3b1f 0%, #3d5228 55%, #4a6838 100%)", borderRadius: 22, padding: "24px 20px", boxShadow: "0 8px 32px rgba(45,59,31,0.28)", position: "relative", overflow: "hidden" }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                style={{ position: "absolute", right: -20, top: -20, opacity: 0.06, pointerEvents: "none" }}>
                                <Coins size={110} color="#d4a843" strokeWidth={0.8} />
                            </motion.div>

                            <h3 style={{ fontSize: "0.97rem", fontWeight: 800, color: "#fff", marginBottom: 14, position: "relative", zIndex: 1 }}>Quick Actions</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 9, position: "relative", zIndex: 1 }}>
                                {quickActions.map(({ Icon, label, href }, i) => (
                                    <MotionLink key={i} to={href}
                                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        transition={{ delay: 0.1 + i * 0.09, duration: 0.4 }}
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.15)", x: 4 }}
                                        whileTap={{ scale: 0.96 }}
                                        style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.09)", borderRadius: 12, padding: "13px 15px", color: "#fff", fontSize: "0.88rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none" }}>
                                        <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5, ease: "easeInOut" }} style={{ display: "inline-flex" }}>
                                            <Icon size={16} color="#d4a843" strokeWidth={2} />
                                        </motion.span>
                                        {label}
                                    </MotionLink>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboardpage;