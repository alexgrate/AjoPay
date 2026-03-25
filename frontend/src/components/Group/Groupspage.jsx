import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, LayoutGrid, Search, Calendar, ArrowRight, Coins, Globe, Lock, UserPlus, Check, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from "../AxiosInstance";
import usePageTitle from "../../hooks/usePageTitle";
import CoinLoader from "../CoinLoader";

const MotionLink = motion.create(Link);

const coinSeeds = [
    { x: "6%",  size: 18, delay: 0,   dur: 5.2 },
    { x: "18%", size: 13, delay: 1.6, dur: 4.6 },
    { x: "33%", size: 16, delay: 0.8, dur: 5.8 },
    { x: "52%", size: 12, delay: 2.2, dur: 4.4 },
    { x: "67%", size: 20, delay: 0.4, dur: 5.0 },
    { x: "79%", size: 14, delay: 1.3, dur: 4.8 },
    { x: "88%", size: 18, delay: 2.7, dur: 5.4 },
    { x: "95%", size: 11, delay: 0.9, dur: 4.2 },
];

export const FloatingCoin = ({ x, size, delay, dur }) => (
    <motion.div
        style={{ position: "fixed", left: x, bottom: -50, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1100], opacity: [0, 0.13, 0.13, 0] }}
        transition={{ duration: dur, delay, repeat: Infinity, ease: "linear", times: [0, 0.08, 0.88, 1] }}
    >
        <Coins size={size} color="#d4a843" strokeWidth={1.2} />
    </motion.div>
);

const tabs = [
    { key: "all",       label: "All Groups", Icon: LayoutGrid },
    { key: "my",        label: "My Groups",  Icon: Users      },
    { key: "available", label: "Available",  Icon: Globe      },
];

const FillBar = ({ pct, color }) => (
    <div style={{ background: "#ede8de", borderRadius: 99, height: 7, overflow: "hidden" }}>
        <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", borderRadius: 99, background: color }}
        />
    </div>
);


const GroupCard = ({ g, idx, mode = "member", onRequestJoin, requestState }) => {
    const fillPct     = Math.round((g.member_count / g.max_members) * 100);
    const accentColor = "#d4a843";
    const iconBg      = g.status === "active" ? "#2d3b1f" : "#7c5cbf";

    const isSent    = requestState === "sent";
    const isLoading = requestState === "loading";

    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, boxShadow: "0 20px 52px rgba(0,0,0,0.10)" }}
            style={{ background: "#fff", borderRadius: 22, padding: "26px 24px 22px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 0, position: "relative" }}
        >
            <span style={{ position: "absolute", top: 18, right: 18, background: g.status === "active" ? "#e2f8ec" : "#fff8e0", color: g.status === "active" ? "#1a7a3a" : "#8a6a00", fontSize: "0.72rem", fontWeight: 700, borderRadius: 99, padding: "4px 11px" }}>
                {g.status}
            </span>

            {g.is_public !== undefined && (
                <span style={{ position: "absolute", top: 48, right: 18, display: "flex", alignItems: "center", gap: 4, background: g.is_public ? "#f0fff4" : "#f4f0ea", color: g.is_public ? "#1a7a3a" : "#2d3b1f80", fontSize: "0.68rem", fontWeight: 700, borderRadius: 99, padding: "3px 9px" }}>
                    {g.is_public ? <Globe size={10} strokeWidth={2.5} /> : <Lock size={10} strokeWidth={2.5} />}
                    {g.is_public ? "Public" : "Private"}
                </span>
            )}

            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.65, ease: "easeInOut" }}
                style={{ width: 56, height: 56, borderRadius: 16, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: `0 6px 18px ${iconBg}55` }}>
                <Users size={26} color="#fff" strokeWidth={1.8} />
            </motion.div>

            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces', serif", marginBottom: 6 }}>
                {g.name}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#2d3b1f80", lineHeight: 1.6, marginBottom: 18 }}>
                {g.description || "No description provided"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, borderTop: "1px solid #f4f0ea", paddingTop: 14 }}>
                {[
                    { Icon: Users,    label: "Members",      val: `${g.member_count}/${g.max_members}` },
                    { Icon: Coins,    label: "Contribution", val: `₦${Number(g.contribution_amount).toLocaleString()}` },
                    { Icon: Calendar, label: "Frequency",    val: g.frequency?.charAt(0).toUpperCase() + g.frequency?.slice(1), bold: true },
                ].map(({ Icon, label, val, bold }, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <motion.span whileHover="spin" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.82rem", color: "#2d3b1f80" }}>
                            <motion.span variants={{ spin: { rotate: 360, transition: { duration: 0.5 } } }} style={{ display: "inline-flex" }}>
                                <Icon size={13} strokeWidth={1.8} color="#2d3b1f80" />
                            </motion.span>
                            {label}
                        </motion.span>
                        <span style={{ fontSize: "0.82rem", fontWeight: bold ? 700 : 500, color: "#2d3b1f" }}>{val}</span>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.78rem", color: "#2d3b1f80" }}>
                        {g.is_full ? "Group is full" : "Filling up"}
                    </span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: g.is_full ? "#e84343" : "#2d3b1f" }}>{fillPct}%</span>
                </div>
                <FillBar pct={fillPct} color={g.is_full ? "#e8634399" : accentColor} />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f4f0ea" }}>
                <span style={{ fontSize: "0.78rem", color: "#2d3b1f80" }}>
                    By <strong style={{ color: "#2d3b1f" }}>{g.creator_name}</strong>
                </span>

                {mode === "member" ? (
                    <MotionLink to={`/groups/${g.id}`}
                        whileHover={{ x: 3 }}
                        style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", fontWeight: 700, color: accentColor, textDecoration: "none" }}>
                        View Group
                        <motion.span whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                            <ArrowRight size={14} strokeWidth={2.5} />
                        </motion.span>
                    </MotionLink>
                ) : (
                    <motion.button
                        whileHover={{ scale: isSent || isLoading || g.is_full ? 1 : 1.04 }}
                        whileTap={{ scale: isSent || isLoading || g.is_full ? 1 : 0.96 }}
                        onClick={() => !isSent && !isLoading && !g.is_full && onRequestJoin(g.id)}
                        disabled={isSent || isLoading || g.is_full}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: isSent ? "#e2f8ec" : g.is_full ? "#f4f0ea" : "#2d3b1f",
                            color:      isSent ? "#1a7a3a" : g.is_full ? "#2d3b1f60" : "#fff",
                            border: "none", borderRadius: 10, padding: "8px 14px",
                            fontSize: "0.8rem", fontWeight: 700, cursor: isSent || g.is_full ? "default" : "pointer",
                            transition: "background 0.2s",
                        }}>
                        {isLoading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
                        ) : isSent ? (
                            <><Check size={13} strokeWidth={2.5} />Requested</>
                        ) : g.is_full ? (
                            <><Users size={13} strokeWidth={2} />Full</>
                        ) : (
                            <><UserPlus size={13} strokeWidth={2} />Request to Join</>
                        )}
                    </motion.button>
                )}
            </div>

            {requestState === "error" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontSize: "0.74rem", color: "#e84343", marginTop: 8, textAlign: "right", fontWeight: 600 }}>
                    Failed to send request. Try again.
                </motion.p>
            )}

            {requestState === "credit_low" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: "#fff5f5", border: "1.5px solid #ffd0d0", borderRadius: 10, padding: "10px 12px", marginTop: 10 }}>
                    <p style={{ fontSize: "0.78rem", color: "#e84343", fontWeight: 700, marginBottom: 2 }}>
                        Credit score too low
                    </p>
                    <p style={{ fontSize: "0.74rem", color: "#e84343" }}>
                        Your credit score doesn't meet the requirement for this public group. You can still join private groups via invite code.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

const EmptyState = ({ tab, query }) => {
    const isAvailable = tab === "available";
    const isFiltered  = query.length > 0;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px" }}>
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ marginBottom: 16 }}>
                {isAvailable
                    ? <Globe size={48} color="#d4a84360" strokeWidth={1.2} style={{ margin: "0 auto" }} />
                    : <Search size={48} color="#d4a84360" strokeWidth={1.2} style={{ margin: "0 auto" }} />
                }
            </motion.div>
            <p style={{ fontSize: "1rem", color: "#2d3b1f80", fontWeight: 600, marginBottom: 6 }}>
                {isAvailable && isFiltered ? "No public groups match your search"
                    : isAvailable              ? "No public groups available right now"
                    : isFiltered               ? "No groups match your search"
                    :                           "No groups yet"}
            </p>
            <p style={{ fontSize: "0.84rem", color: "#2d3b1f60", marginBottom: 18 }}>
                {isAvailable
                    ? "When someone creates a public group, it'll appear here."
                    : "Groups you join or create will show up here."}
            </p>
            {!isAvailable && (
                <MotionLink to="/create-group" whileHover={{ scale: 1.03 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#2d3b1f", color: "#fff", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                    <Plus size={15} strokeWidth={2.5} />Create your first group
                </MotionLink>
            )}
        </motion.div>
    );
};

const ErrorState = ({ message, onRetry }) => (
    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
        <p style={{ color: "#e84343", fontWeight: 600, marginBottom: 12 }}>{message}</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRetry}
            style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontWeight: 700, cursor: "pointer" }}>
            Try Again
        </motion.button>
    </div>
);

const Spinner = () => (
    <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", padding: "80px 20px" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #e0dbd2", borderTopColor: "#2d3b1f" }} />
    </div>
);

const Groupspage = () => {
    const [initLoading, setInitLoading] = useState(true);
    const navigate = useNavigate();

    const [activeTab,    setActiveTab]    = useState("all");
    const [query,        setQuery]        = useState("");
    const [searchFocused,setSearchFocused]= useState(false);

    const [groups,      setGroups]      = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);

    const [publicGroups,  setPublicGroups]  = useState([]);
    const [pubLoading,    setPubLoading]    = useState(false);
    const [pubError,      setPubError]      = useState(null);
    const [pubFetched,    setPubFetched]    = useState(false); 

    usePageTitle("My Groups");

    const [requestStates, setRequestStates] = useState({});

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await AxiosInstance.get("api/groups/");
            setGroups(res.data);
        } catch {
            setError("Failed to load groups. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPublicGroups = useCallback(async () => {
        setPubLoading(true);
        setPubError(null);
        try {
            const res = await AxiosInstance.get("api/groups/public/");
            setPublicGroups(res.data);
            setPubFetched(true);
        } catch {
            setPubError("Failed to load public groups. Please try again.");
        } finally {
            setPubLoading(false);
        }
    }, []);

    useEffect(() => { fetchGroups(); }, [fetchGroups]);

    useEffect(() => {
        if (activeTab === "available" && !pubFetched) {
            fetchPublicGroups();
        }
    }, [activeTab, fetchPublicGroups, pubFetched]);

    const handleRequestJoin = async (groupId) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.bvn_verified) {
            navigate("/verify-bvn");
            return;
        }

        setRequestStates(prev => ({ ...prev, [groupId]: "loading" }));
        try {
            await AxiosInstance.post(`api/groups/${groupId}/request-join/`);
            setRequestStates(prev => ({ ...prev, [groupId]: "sent" }));
        } catch (err) {
            const msg = err.response?.data?.error || "";

            if (msg.includes("already")) {
                setRequestStates(prev => ({ ...prev, [groupId]: "sent" }));
                return;
            }

            if (msg.includes("BVN") || msg.toLowerCase().includes("verify your bvn")) {
                navigate("/verify-bvn");
                return;
            }

            if (msg.includes("credit score")) {
                setRequestStates(prev => ({ ...prev, [groupId]: "credit_low" }));
                return;
            }

            setRequestStates(prev => ({ ...prev, [groupId]: "error" }));
            setTimeout(() => {
                setRequestStates(prev => ({ ...prev, [groupId]: undefined }));
            }, 3000);
        }
    };

    const applyQuery = (list) =>
        list.filter(g =>
            g.name.toLowerCase().includes(query.toLowerCase()) ||
            (g.description || "").toLowerCase().includes(query.toLowerCase())
        );

    const myGroupIds = new Set(groups.map(g => g.id));

    const displayGroups = (() => {
        if (activeTab === "available") return applyQuery(publicGroups);
        if (activeTab === "my") return applyQuery(groups);
        return applyQuery(groups);   // "all"
    })();

    const handleTabChange = (key) => {
        setActiveTab(key);
        setQuery("");
    };

    return (
        <>
            <AnimatePresence>
                {initLoading && <CoinLoader key="loader" onDone={() => setInitLoading(false)} text="Loading groups..." />}
            </AnimatePresence>

            {!initLoading && (
                <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", overflow: "hidden" }}>
                    {coinSeeds.map((c, i) => <FloatingCoin key={i} {...c} />)}

                    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(28px,5vw,64px) clamp(16px,3vw,40px) 80px", position: "relative", zIndex: 1 }}>

                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32, marginTop: 20 }}>
                            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
                                <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "#2d3b1f", lineHeight: 1.1, marginBottom: 8, fontFamily: "'Fraunces',serif" }}>
                                    Ajo Groups
                                </h1>
                                <p style={{ fontSize: "0.95rem", color: "#2d3b1f80" }}>Join or create savings circles with your community</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
                                <MotionLink to="/create-group"
                                    whileHover={{ scale: 1.04, backgroundColor: "#1a2c10" }} whileTap={{ scale: 0.96 }}
                                    style={{ background: "#2d3b1f", color: "#fff", borderRadius: 14, padding: "13px 24px", fontSize: "0.92rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(45,59,31,0.28)", textDecoration: "none" }}>
                                    <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                                        <Plus size={17} strokeWidth={2.5} />
                                    </motion.span>
                                    Create New Group
                                </MotionLink>
                            </motion.div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ marginBottom: 20 }}>
                            <motion.div
                                animate={{ borderColor: searchFocused ? "#d4a843" : "#e8e2d8", boxShadow: searchFocused ? "0 0 0 3px rgba(212,168,67,0.12)" : "0 2px 12px rgba(0,0,0,0.05)" }}
                                transition={{ duration: 0.2 }}
                                style={{ background: "#fff", border: "1.5px solid #e8e2d8", borderRadius: 16, padding: "15px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                                <motion.span whileHover={{ rotate: 20 }} style={{ display: "inline-flex", flexShrink: 0 }}>
                                    <Search size={18} color={searchFocused ? "#d4a843" : "#b8c0b0"} strokeWidth={2} />
                                </motion.span>
                                <input
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: "0.93rem", color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif" }}
                                    placeholder={activeTab === "available" ? "Search public groups..." : "Search groups by name or description..."}
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                />
                                {query && (
                                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                        onClick={() => setQuery("")}
                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#2d3b1f60", fontSize: "1rem", lineHeight: 1, padding: "0 2px" }}>
                                        ✕
                                    </motion.button>
                                )}
                            </motion.div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
                            style={{ background: "#fff", borderRadius: 16, padding: "6px", display: "flex", gap: 4, marginBottom: 32, border: "1.5px solid #f0ece4", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                            {tabs.map(({ key, label, Icon }) => {
                                const active = activeTab === key;
                                const showBadge = key === "available" && pubFetched && publicGroups.length > 0;
                                return (
                                    <motion.button key={key} onClick={() => handleTabChange(key)} whileTap={{ scale: 0.97 }}
                                        style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 12, padding: "12px 10px", background: active ? "#2d3b1f" : "transparent", color: active ? "#fff" : "#2d3b1f99", fontSize: "0.88rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "background 0.2s, color 0.2s", position: "relative" }}>
                                        <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} style={{ display: "inline-flex" }}>
                                            <Icon size={15} strokeWidth={2} />
                                        </motion.span>
                                        {label}
                                        {showBadge && (
                                            <span style={{ background: active ? "#d4a843" : "#2d3b1f", color: active ? "#2d3b1f" : "#fff", fontSize: "0.65rem", fontWeight: 800, borderRadius: 99, padding: "1px 6px", marginLeft: 2 }}>
                                                {publicGroups.length}
                                            </span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>

                        <AnimatePresence>
                            {activeTab === "available" && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                    style={{ marginBottom: 20 }}>

                                    {!JSON.parse(localStorage.getItem("user") || "{}").bvn_verified && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            style={{ background: "#fffbe8", border: "1.5px solid #f5e090", borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
                                            <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
                                            <p style={{ fontSize: "0.82rem", color: "#8a6a00", lineHeight: 1.55 }}>
                                                <strong>BVN not verified.</strong> You need to verify your BVN before joining any group.{" "}
                                                <Link to="/verify-bvn" style={{ color: "#d4a843", fontWeight: 700 }}>Verify now →</Link>
                                            </p>
                                        </motion.div>
                                    )}

                                    <div style={{ background: "#f0fff4", border: "1.5px solid #b2dfcc", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                                        <Globe size={15} color="#1a7a3a" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
                                        <p style={{ fontSize: "0.82rem", color: "#1a7a3a", lineHeight: 1.55 }}>
                                            <strong>Public groups</strong> are open to join requests. Send a request and the group admin will review it.
                                            Already have an invite code?{" "}
                                            <MotionLink to="/invite" whileHover={{ color: "#d4a843" }} style={{ color: "#1a7a3a", fontWeight: 700, textDecoration: "underline" }}>Use invite link</MotionLink> to join directly.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab + query}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>

                                {(activeTab === "all" || activeTab === "my") && (
                                    <>
                                        {loading && <Spinner />}
                                        {error && !loading && <ErrorState message={error} onRetry={fetchGroups} />}
                                        {!loading && !error && (
                                            displayGroups.length > 0
                                                ? displayGroups.map((g, i) => <GroupCard key={g.id} g={g} idx={i} mode="member" />)
                                                : <EmptyState tab={activeTab} query={query} />
                                        )}
                                    </>
                                )}

                                {activeTab === "available" && (
                                    <>
                                        {pubLoading && <Spinner />}
                                        {pubError && !pubLoading && (
                                            <ErrorState message={pubError} onRetry={() => { setPubFetched(false); fetchPublicGroups(); }} />
                                        )}
                                        {!pubLoading && !pubError && (
                                            displayGroups.length > 0
                                                ? displayGroups.map((g, i) => (
                                                    <GroupCard
                                                        key={g.id}
                                                        g={g}
                                                        idx={i}
                                                        mode="public"
                                                        onRequestJoin={handleRequestJoin}
                                                        requestState={requestStates[g.id]}
                                                    />
                                                ))
                                                : <EmptyState tab="available" query={query} />
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </>
    );
};

export default Groupspage;