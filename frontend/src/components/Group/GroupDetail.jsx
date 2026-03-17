import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    Share2, Settings, Edit, Users, Calendar, Trash2,
    CheckCircle, Clock, Download, MoreVertical,
    Send, Lock, Percent, CreditCard, CircleDollarSign,
    Trophy, Bell, ChevronRight, X, Coins, AlertTriangle,
    RefreshCw, Eye, LogOut, Copy, Check, UserCheck,
    UserX, UserPlus, Globe, Play, AlertCircle, XCircle,
    TrendingUp, ArrowBigRight
} from "lucide-react";
import AxiosInstance from "../AxiosInstance";
import usePageTitle from "../../hooks/usePageTitle";
import CoinLoader from "../CoinLoader";

const MotionLink = motion.create(Link);

const allCoins = [
    { x: "3%",  size: 16, delay: 0,   dur: 5.2 },
    { x: "10%", size: 12, delay: 1.8, dur: 4.6 },
    { x: "22%", size: 14, delay: 0.6, dur: 5.8 },
    { x: "36%", size: 10, delay: 2.2, dur: 4.3 },
    { x: "50%", size: 15, delay: 0.9, dur: 5.0 },
    { x: "63%", size: 11, delay: 1.5, dur: 4.8 },
    { x: "75%", size: 17, delay: 2.7, dur: 5.4 },
    { x: "85%", size: 13, delay: 0.3, dur: 4.2 },
    { x: "92%", size: 16, delay: 1.2, dur: 5.6 },
];

const FloatingCoin = ({ x, size, delay, dur }) => (
    <motion.div
        style={{ position: "fixed", left: x, bottom: -50, zIndex: 1, pointerEvents: "none" }}
        animate={{ y: [0, -1200], opacity: [0, 0.13, 0.13, 0] }}
        transition={{ duration: dur, delay, repeat: Infinity, ease: "linear", times: [0, 0.07, 0.9, 1] }}>
        <Coins size={size} color="#d4a843" strokeWidth={1.2} />
    </motion.div>
);

const MEMBER_COLORS = ["#2d3b1f","#d4a843","#e8863a","#7c5cbf","#1db893","#e84393","#2d9a4a","#c0392b"];
const getColor    = (i) => MEMBER_COLORS[i % MEMBER_COLORS.length];
const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : (parts[0] || "?")[0].toUpperCase();
};
const fmtCurrency = (n) => `₦${Number(n || 0).toLocaleString()}`;
const capitalize  = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
const fmtDate     = (d) => d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";
const timeAgo = (d) => {
    if (!d) return "";
    const mins = Math.floor((Date.now() - new Date(d)) / 60000);
    if (mins < 1)   return "just now";
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const CircleViz = ({ members = [] }) => {
    const SIZE = 360;
    const cx = SIZE / 2, cy = SIZE / 2, R = 130;
    const nodeColors = { received: "#1db893", current: "#d4a843", upnext: "#7c5cbf", awaiting: "#d0ccc4" };

    const vizMembers = members.map((m, i) => ({
        ...m,
        initials: getInitials(m.full_name),
        status:   i === 0 ? "current" : "awaiting",
    }));

    const nodes = vizMembers.map((m, i) => {
        const angle = (2 * Math.PI * i) / Math.max(vizMembers.length, 1) - Math.PI / 2;
        return { ...m, x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
    });

    const currentMember = vizMembers[0];

    return (
        <div style={{ width: "100%", maxWidth: 380, margin: "0 auto", aspectRatio: "1/1", position: "relative" }}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e8e2d8" strokeWidth="1.5" strokeDasharray="4 4" />
                {nodes.map((n, i) => {
                    const isCurrent = n.status === "current";
                    const r = isCurrent ? 26 : 18;
                    return (
                        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                            transition={{ delay: i * 0.07, type: "spring", stiffness: 260 }}>
                            <circle cx={n.x} cy={n.y} r={r} fill={nodeColors[n.status]}
                                stroke={isCurrent ? "#d4a843" : "none"} strokeWidth={isCurrent ? 3 : 0}
                                style={{ filter: isCurrent ? "drop-shadow(0 0 10px rgba(212,168,67,0.55))" : "none" }} />
                            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                                fill="#fff" fontSize={isCurrent ? 11 : 9} fontWeight="700" fontFamily="DM Sans, sans-serif">
                                {n.initials}
                            </text>
                        </motion.g>
                    );
                })}
                {currentMember && (<>
                    <text x={cx} y={cy - 28} textAnchor="middle" fill="#2d3b1f99" fontSize="9" fontFamily="DM Sans" fontWeight="600" letterSpacing="0.08em">PAYOUT ORDER</text>
                    <text x={cx} y={cy - 8}  textAnchor="middle" fill="#2d3b1f" fontSize="13" fontFamily="Fraunces, serif" fontWeight="900">{currentMember.full_name?.split(" ")[0]}</text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fill="#2d3b1f99" fontSize="10" fontFamily="DM Sans">{currentMember.full_name?.split(" ").slice(1).join(" ")}</text>
                    <text x={cx} y={cy + 28} textAnchor="middle" fill="#d4a84399" fontSize="10" fontFamily="DM Sans" fontWeight="600">Position #1</text>
                </>)}
            </svg>
        </div>
    );
};

const PaymentModal = ({ onClose, contribution, group }) => {
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");

    const handlePay = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await AxiosInstance.post(
                `api/payments/contribution/${contribution.id}/initialize/`,
                { callback_url: `${window.location.origin}/groups/${group.id}?payment=success` }
            );
            window.location.href = res.data.authorization_url;
        } catch (err) {
            setError(err.response?.data?.error || "Failed to initialize payment. Try again.");
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                style={{ background: "#fff", borderRadius: 24, padding: "clamp(24px,4vw,36px) clamp(20px,4vw,32px)", width: "100%", maxWidth: 420, position: "relative", margin: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                    <div>
                        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2d3b1f80", letterSpacing: "0.1em" }}>CYCLE {contribution?.cycle_number}</p>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif" }}>Pay Contribution</h3>
                    </div>
                    <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
                        style={{ width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #e8e2d8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <X size={15} color="#2d3b1f" />
                    </motion.button>
                </div>

                <div style={{ background: "linear-gradient(135deg,#2d3b1f,#4a6030)", borderRadius: 16, padding: "22px 18px", marginBottom: 22, textAlign: "center" }}>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", marginBottom: 6 }}>CONTRIBUTING TO</p>
                    <p style={{ fontWeight: 700, color: "#fff", marginBottom: 10 }}>{group?.name}</p>
                    <p style={{ fontSize: "2rem", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif", marginBottom: 10 }}>
                        {fmtCurrency(contribution?.amount || group?.contribution_amount)}
                    </p>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "4px 12px", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1db893" }} />Secured by Paystack
                    </span>
                </div>

                {[
                    { Icon: CreditCard, label: "Payment Method", val: "Card via Paystack" },
                    { Icon: Calendar,   label: "Due Date",       val: fmtDate(contribution?.cycle_due_date) },
                    { Icon: Percent,    label: "Processing Fee", val: "₦250" },
                ].map(({ Icon, label, val }, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f4f0ea" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.86rem", color: "#2d3b1f80" }}>
                            <Icon size={14} strokeWidth={1.8} />{label}
                        </span>
                        <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "#2d3b1f" }}>{val}</span>
                    </div>
                ))}

                <div style={{ background: "#f8f6f0", borderRadius: 12, padding: "13px 15px", display: "flex", justifyContent: "space-between", margin: "14px 0 18px" }}>
                    <span style={{ fontWeight: 700, color: "#2d3b1f" }}>Total Debit</span>
                    <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "#2d3b1f", fontFamily: "'Fraunces',serif" }}>
                        {fmtCurrency(Number(contribution?.amount || group?.contribution_amount || 0) + 200)}
                    </span>
                </div>

                {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ color: "#e84343", fontSize: "0.82rem", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
                        {error}
                    </motion.p>
                )}

                <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02, backgroundColor: loading ? undefined : "#c49a35" }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    onClick={handlePay}
                    disabled={loading}
                    style={{ width: "100%", background: loading ? "#e8c87a" : "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 13, padding: "15px", fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(212,168,67,0.35)" }}>
                    {loading
                        ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(45,59,31,0.3)", borderTopColor: "#2d3b1f" }} />Redirecting to Paystack...</>
                        : <><CircleDollarSign size={18} strokeWidth={2} />Pay Now via Paystack</>
                    }
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

const ReleaseModal = ({ onClose, cycle, groupId, onSuccess }) => {
    const [loading,  setLoading]  = useState(false);
    const [released, setReleased] = useState(false);
    const [error,    setError]    = useState("");
    const [result,   setResult]   = useState(null);

    const handleRelease = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await AxiosInstance.post(
                `api/groups/${groupId}/cycles/${cycle.id}/release/`
            );
            setResult(res.data);
            setReleased(true);
            onSuccess(); 
        } catch (err) {
            setError(err.response?.data?.error || "Failed to release payout.");
        } finally {
            setLoading(false);
        }
    };

    const canRelease  = cycle?.status === "contributions_complete";
    const blocking    = cycle?.blocking_members || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px", overflowY: "auto" }}>
            <motion.div initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                style={{ background: released ? "linear-gradient(160deg,#1a3a2a,#2d5a35,#3d6a25)" : "#fff", borderRadius: 26, padding: "clamp(24px,4vw,40px) clamp(20px,4vw,36px)", width: "100%", maxWidth: 480, position: "relative", textAlign: "center", marginTop: 20, marginBottom: 20 }}>

                {!released ? (<>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                        style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #e8e2d8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <X size={15} color="#2d3b1f" />
                    </motion.button>

                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: canRelease ? "#f0faf6" : "#fff8e0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: `2px solid ${canRelease ? "#c8ede0" : "#f5e090"}` }}>
                        {canRelease
                            ? <Send size={26} color="#1db893" strokeWidth={2} />
                            : <AlertTriangle size={26} color="#d4a843" strokeWidth={2} />
                        }
                    </div>

                    <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 10 }}>
                        {canRelease ? "Release Payout?" : "Payout Blocked"}
                    </h3>

                    {canRelease ? (
                        <>
                            <p style={{ fontSize: "0.88rem", color: "#2d3b1f80", lineHeight: 1.7, marginBottom: 8 }}>
                                All {cycle?.contributions_summary?.total} members have paid.
                            </p>
                            <div style={{ background: "#f8f6f0", borderRadius: 13, padding: "14px", marginBottom: 18, textAlign: "left" }}>
                                <p style={{ fontSize: "0.72rem", color: "#2d3b1f60", letterSpacing: "0.1em", marginBottom: 6 }}>PAYOUT DETAILS</p>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                    <span style={{ fontSize: "0.85rem", color: "#2d3b1f80" }}>Recipient</span>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2d3b1f" }}>{cycle?.recipient_name}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "0.85rem", color: "#2d3b1f80" }}>Amount</span>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#d4a843" }}>{fmtCurrency(cycle?.payout_amount)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: "0.88rem", color: "#2d3b1f80", lineHeight: 1.7, marginBottom: 12 }}>
                                Waiting for {blocking.length} member{blocking.length !== 1 ? "s" : ""} to pay before payout can be released.
                            </p>
                            <div style={{ background: "#fff8f8", border: "1.5px solid #ffd0d0", borderRadius: 13, padding: "12px 14px", marginBottom: 18, textAlign: "left" }}>
                                <p style={{ fontSize: "0.72rem", color: "#e84343", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>BLOCKING MEMBERS</p>
                                {blocking.map((b, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < blocking.length - 1 ? 7 : 0 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e84343", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.62rem", color: "#fff", flexShrink: 0 }}>
                                            {getInitials(b.name)}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "#2d3b1f" }}>{b.name}</p>
                                            <p style={{ fontSize: "0.72rem", color: "#2d3b1f60" }}>{b.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ color: "#e84343", fontSize: "0.82rem", fontWeight: 600, marginBottom: 12 }}>
                            {error}
                        </motion.p>
                    )}

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                            style={{ flex: 1, background: "#f0ece4", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, cursor: "pointer" }}>
                            {canRelease ? "Cancel" : "Close"}
                        </motion.button>
                        {canRelease && (
                            <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                                onClick={handleRelease} disabled={loading}
                                style={{ flex: 2, background: loading ? "#e8c87a" : "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(212,168,67,0.35)" }}>
                                {loading
                                    ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(45,59,31,0.3)", borderTopColor: "#2d3b1f" }} />Releasing...</>
                                    : <><Send size={15} strokeWidth={2} />Release Payout</>
                                }
                            </motion.button>
                        )}
                    </div>
                </>) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6 }}
                            style={{ fontSize: "3rem", marginBottom: 14 }}>🎉</motion.div>
                        <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 900, color: "#fff", marginBottom: 10, fontFamily: "'Fraunces',serif" }}>
                            Payout Released!
                        </h2>
                        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                            {fmtCurrency(result?.payout_amount)} sent to <strong style={{ color: "#d4a843" }}>{result?.recipient}</strong>
                        </p>
                        {result?.next_cycle && (
                            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", marginBottom: 22 }}>
                                Cycle {result.next_cycle} is now open for contributions
                            </p>
                        )}
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                            style={{ background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 13, padding: "13px 32px", fontWeight: 700, cursor: "pointer" }}>
                            Back to Group
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

const SettingsMenu = ({ onClose, onDelete, onLeave, isCreator, onCopyInvite }) => {
    const items = [
        { Icon: Edit,   label: "Edit Group",       color: "#2d3b1f", action: onClose      },
        { Icon: Users,  label: "Manage Members",   color: "#2d3b1f", action: onClose      },
        { Icon: Share2, label: "Copy Invite Code", color: "#7c5cbf", action: onCopyInvite },
        ...(isCreator
            ? [{ Icon: Trash2, label: "Delete Group", color: "#e84343", action: onDelete }]
            : [{ Icon: LogOut, label: "Leave Group",  color: "#e84343", action: onLeave  }]
        ),
    ];
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}
            style={{ position: "absolute", left: 0, top: "calc(100% + 8px)", background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.22)", border: "1.5px solid #f0ece4", zIndex: 9999, minWidth: 210, overflow: "hidden", whiteSpace: "nowrap" }}>
            {items.map(({ Icon, label, color, action }, i) => (
                <motion.button key={i} whileHover={{ backgroundColor: "#f8f6f0" }}
                    onClick={() => { action?.(); onClose(); }}
                    style={{ width: "100%", border: "none", background: "transparent", padding: "13px 18px", display: "flex", alignItems: "center", gap: 11, cursor: "pointer", color, fontSize: "0.9rem", fontWeight: i === items.length - 1 ? 600 : 500, borderTop: i === items.length - 1 ? "1px solid #f0ece4" : "none", textAlign: "left" }}>
                    <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><Icon size={15} strokeWidth={2} /></motion.span>
                    {label}
                </motion.button>
            ))}
        </motion.div>
    );
};

const MemberMenu = ({ onClose, onRemove, isAdmin }) => {
    const items = [
        { Icon: Eye,  label: "View Profile",  color: "#2d3b1f", action: onClose  },
        { Icon: Bell, label: "Send Reminder", color: "#2d3b1f", action: onClose  },
        ...(isAdmin ? [{ Icon: Trash2, label: "Remove Member", color: "#e84343", action: onRemove }] : []),
    ];
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}
            style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#fff", borderRadius: 13, boxShadow: "0 12px 40px rgba(0,0,0,0.18)", border: "1.5px solid #f0ece4", zIndex: 9999, minWidth: 180, overflow: "hidden" }}>
            {items.map(({ Icon, label, color, action }, i) => (
                <motion.button key={i} whileHover={{ backgroundColor: "#f8f6f0" }}
                    onClick={() => { action?.(); onClose(); }}
                    style={{ width: "100%", border: "none", background: "transparent", padding: "12px 15px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", color, fontSize: "0.87rem", fontWeight: 500, textAlign: "left" }}>
                    <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><Icon size={14} strokeWidth={2} /></motion.span>
                    {label}
                </motion.button>
            ))}
        </motion.div>
    );
};

const CountTile = ({ val, label, delay }) => (
    <div style={{ textAlign: "center", minWidth: 0, flex: 1 }}>
        <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1, repeat: Infinity, delay }}
            style={{ background: "#2d3b1f", borderRadius: 10, padding: "8px 6px" }}>
            <p style={{ fontSize: "clamp(1.1rem,3vw,1.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: "'Fraunces',serif" }}>{val}</p>
        </motion.div>
        <p style={{ fontSize: "0.6rem", color: "#2d3b1f80", marginTop: 4, fontWeight: 600, letterSpacing: "0.06em" }}>{label}</p>
    </div>
);

const ErrorScreen = ({ type, onRetry }) => (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fff", borderRadius: 24, padding: "44px 36px", textAlign: "center", maxWidth: 400, width: "100%", boxShadow: "0 4px 40px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>{type === "403" ? "🔒" : type === "404" ? "🔍" : "⚠️"}</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 10 }}>
                {type === "403" ? "Access Denied" : type === "404" ? "Group Not Found" : "Something Went Wrong"}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#2d3b1f80", marginBottom: 24, lineHeight: 1.7 }}>
                {type === "403" ? "You're not a member of this group." : type === "404" ? "This group doesn't exist or has been deleted." : "Failed to load the group. Please try again."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <MotionLink to="/groups" whileHover={{ scale: 1.03 }}
                    style={{ background: "#f0ece4", color: "#2d3b1f", borderRadius: 12, padding: "11px 22px", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                    Back to Groups
                </MotionLink>
                {type === "failed" && (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRetry}
                        style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 12, padding: "11px 22px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
                        Try Again
                    </motion.button>
                )}
            </div>
        </motion.div>
    </div>
);

const JoinRequestsPanel = ({ groupId, onAccepted, pendingCount, setPendingCount }) => {
    const [requests,    setRequests]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [actionState, setActionState] = useState({}); 

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await AxiosInstance.get(`api/groups/${groupId}/requests/`);
            const pending = res.data.filter(r => r.status === "pending");
            setRequests(pending);
            setPendingCount(pending.length);
        } catch {
            setError("Failed to load requests.");
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const handleAction = async (rid, action) => {
        setActionState(prev => ({ ...prev, [rid]: action === "accept" ? "accepting" : "rejecting" }));
        try {
            await AxiosInstance.post(`api/groups/${groupId}/requests/${rid}/${action}/`);
            setActionState(prev => ({ ...prev, [rid]: "done" }));
            setTimeout(() => {
                setRequests(prev => {
                    const updated = prev.filter(r => r.id !== rid);
                    setPendingCount(updated.length);
                    return updated;
                });
                if (action === "accept") onAccepted(); 
            }, 600);
        } catch (err) {
            setActionState(prev => ({ ...prev, [rid]: "error" }));
            setTimeout(() => setActionState(prev => ({ ...prev, [rid]: undefined })), 2500);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.1 }}
            style={{ background: "#fff", borderRadius: 20, padding: "20px 18px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: "0.93rem", fontWeight: 800, color: "#2d3b1f", display: "flex", alignItems: "center", gap: 7 }}>
                    <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                        <UserPlus size={15} color="#d4a843" strokeWidth={2} />
                    </motion.span>
                    Join Requests
                    {pendingCount > 0 && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                            style={{ background: "#e84343", color: "#fff", fontSize: "0.65rem", fontWeight: 800, borderRadius: 99, padding: "2px 7px", marginLeft: 2 }}>
                            {pendingCount}
                        </motion.span>
                    )}
                </h3>
                <motion.button whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }} onClick={fetchRequests}
                    style={{ width: 28, height: 28, border: "1.5px solid #e8e2d8", background: "#fff", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <RefreshCw size={13} color="#2d3b1f80" strokeWidth={2} />
                </motion.button>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e0dbd2", borderTopColor: "#2d3b1f" }} />
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <p style={{ color: "#e84343", fontSize: "0.82rem", marginBottom: 10 }}>{error}</p>
                    <motion.button whileHover={{ scale: 1.03 }} onClick={fetchRequests}
                        style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 9, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem" }}>
                        Retry
                    </motion.button>
                </div>
            ) : requests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                    <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                        <UserCheck size={34} color="#d4a84355" strokeWidth={1.2} style={{ margin: "0 auto 10px" }} />
                    </motion.div>
                    <p style={{ fontSize: "0.84rem", fontWeight: 600, color: "#2d3b1f80" }}>No pending requests</p>
                    <p style={{ fontSize: "0.74rem", color: "#2d3b1f55", marginTop: 4 }}>New requests will appear here</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <AnimatePresence>
                        {requests.map((req) => {
                            const state    = actionState[req.id];
                            const isDone   = state === "done";
                            const isAcc    = state === "accepting";
                            const isRej    = state === "rejecting";
                            const isErr    = state === "error";
                            const busy     = isAcc || isRej;

                            return (
                                <motion.div key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: isDone ? 0 : 1, y: isDone ? -8 : 0, scale: isDone ? 0.95 : 1 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.35 }}
                                    style={{ background: isErr ? "#fff8f8" : "#fafaf8", border: `1.5px solid ${isErr ? "#ffd0d0" : "#f0ece4"}`, borderRadius: 14, padding: "13px 13px 11px" }}>

                                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: req.message ? 8 : 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2d3b1f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.68rem", color: "#d4a843", flexShrink: 0 }}>
                                            {getInitials(req.full_name)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2d3b1f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {req.full_name}
                                            </p>
                                            <p style={{ fontSize: "0.71rem", color: "#2d3b1f60", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {req.email} · {timeAgo(req.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {req.message && (
                                        <div style={{ background: "#f4f0ea", borderRadius: 9, padding: "8px 10px", marginBottom: 10 }}>
                                            <p style={{ fontSize: "0.77rem", color: "#2d3b1f", lineHeight: 1.5, fontStyle: "italic" }}>
                                                "{req.message}"
                                            </p>
                                        </div>
                                    )}

                                    {isErr && (
                                        <p style={{ fontSize: "0.74rem", color: "#e84343", marginBottom: 8, fontWeight: 600 }}>
                                            Action failed. Please try again.
                                        </p>
                                    )}

                                    <div style={{ display: "flex", gap: 7 }}>
                                        <motion.button whileHover={{ scale: busy ? 1 : 1.03 }} whileTap={{ scale: busy ? 1 : 0.97 }}
                                            onClick={() => !busy && handleAction(req.id, "accept")}
                                            disabled={busy}
                                            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: isAcc ? "#e8f5ee" : "#2d3b1f", color: isAcc ? "#1a7a3a" : "#fff", border: "none", borderRadius: 9, padding: "9px 8px", fontWeight: 700, fontSize: "0.78rem", cursor: busy ? "default" : "pointer", transition: "background 0.2s" }}>
                                            {isAcc ? (
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                    style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid #1a7a3a55", borderTopColor: "#1a7a3a" }} />
                                            ) : <UserCheck size={13} strokeWidth={2.5} />}
                                            Accept
                                        </motion.button>

                                        <motion.button whileHover={{ scale: busy ? 1 : 1.03 }} whileTap={{ scale: busy ? 1 : 0.97 }}
                                            onClick={() => !busy && handleAction(req.id, "reject")}
                                            disabled={busy}
                                            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: isRej ? "#fff0f0" : "#f4f0ea", color: isRej ? "#e84343" : "#2d3b1f80", border: "none", borderRadius: 9, padding: "9px 8px", fontWeight: 700, fontSize: "0.78rem", cursor: busy ? "default" : "pointer", transition: "background 0.2s" }}>
                                            {isRej ? (
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                    style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid #e8434355", borderTopColor: "#e84343" }} />
                                            ) : <UserX size={13} strokeWidth={2.5} />}
                                            Reject
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

const GroupDetail = () => {
    const { id: groupId } = useParams();
    const navigate = useNavigate();

    const [group,        setGroup]        = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [copied,       setCopied]       = useState(false);
    const [pendingCount, setPendingCount] = useState(0);  

    const [showSettings, setShowSettings] = useState(false);
    const [showPay,      setShowPay]      = useState(false);
    const [showRelease,  setShowRelease]  = useState(false);
    const [memberMenuId, setMemberMenuId] = useState(null);
    const [memberTab,    setMemberTab]    = useState("all");
    const [cycles, setCycles] = useState([])
    const [myContributions, setMyContributions] = useState([])
    const [cyclesLoading,   setCyclesLoading]   = useState(false);
    const [activeCycle,     setActiveCycle]     = useState(null);     
    const [myPendingContrib, setMyPendingContrib] = useState(null);
    const [showReleaseCycle, setShowReleaseCycle] = useState(null);   
    const [startingGroup,   setStartingGroup]   = useState(false);
    const [restartingGroup, setRestartingGroup] = useState(false);


    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const members   = group?.members || [];
    const isAdmin   = members.some(m => m.user_id === currentUser.id && m.role === "admin");
    const isCreator = group?.creator === currentUser.id;
    const myMember  = members.find(m => m.user_id === currentUser.id);

    usePageTitle(group?.name || "Group");

    const fetchGroup = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await AxiosInstance.get(`api/groups/${groupId}/`);
            setGroup(res.data);
        } catch (err) {
            const status = err.response?.status;
            setError(status === 403 ? "403" : status === 404 ? "404" : "failed");
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    const fetchCycles = useCallback(async () => {
        setCyclesLoading(true);
        try {
            const res = await AxiosInstance.get(`api/groups/${groupId}/cycles/`);
            setCycles(res.data);
            const collecting = res.data.find(c => c.status === "collecting" || c.status === "contributions_complete");
            setActiveCycle(collecting || null);
        } catch {
        } finally {
            setCyclesLoading(false);
        }
    }, [groupId]);

    const fetchMyContributions = useCallback(async () => {
        try {
            const res = await AxiosInstance.get(`api/groups/${groupId}/my-contributions/`);
            setMyContributions(res.data.contributions || []);
            const pending = res.data.contributions?.find(c => c.status === "pending");
            setMyPendingContrib(pending || null);
        } catch {
        }
    }, [groupId]);

    useEffect(() => {
        if (group && group.status === "active") {
            fetchCycles();
            fetchMyContributions();
        }
    }, [group, fetchCycles, fetchMyContributions]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref    = params.get("reference");
        if (ref) {
            AxiosInstance.get(`api/payments/verify/${ref}/`)
                .then(() => {
                    fetchMyContributions();
                    fetchCycles();
                    window.history.replaceState({}, "", window.location.pathname);
                })
                .catch(() => {});
        }
    }, []);

    useEffect(() => { fetchGroup(); }, [fetchGroup]);

    useEffect(() => {
        const close = () => { setShowSettings(false); setMemberMenuId(null); };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const handleLeave = async () => {
        if (!window.confirm(`Leave "${group.name}"? You will need a new invite code to rejoin.`)) return;
        try {
            await AxiosInstance.post(`api/groups/${groupId}/leave/`);
            navigate("/groups");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to leave group.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${group.name}"? This is permanent and cannot be undone.`)) return;
        try {
            await AxiosInstance.delete(`api/groups/${groupId}/`);
            navigate("/groups");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete group.");
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("Remove this member from the group?")) return;
        try {
            await AxiosInstance.delete(`api/groups/${groupId}/members/${userId}/`);
            fetchGroup();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to remove member.");
        }
    };

    const handleCopyInvite = () => {
        if (!group?.invite_code) return;
        navigator.clipboard.writeText(group.invite_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStartGroup = async () => {
        if (!window.confirm("Start this group? This will open Cycle 1 for contributions.")) return;
        setStartingGroup(true);
        try {
            await AxiosInstance.post(`api/groups/${groupId}/start/`);
            await fetchGroup();
            await fetchCycles();
            await fetchMyContributions();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to start group.");
        } finally {
            setStartingGroup(false);
        }
    };

    const handleRestartGroup = async () => {
        if (!window.confirm(`Restart "${group.name}"? The payout order will rotate — the last recipient now goes first.`)) return;
        setRestartingGroup(true);
        try {
            await AxiosInstance.post(`api/groups/${groupId}/restart/`);
            await fetchGroup();
            await fetchCycles();
            await fetchMyContributions();
        } catch (err) {

            await fetchGroup();
            await fetchCycles();
            await fetchMyContributions();
            const msg = err.response?.data?.error;
            if (msg) alert(msg); 
        } finally {
            setRestartingGroup(false);
        }
    };

    const filteredMembers =
        memberTab === "admins"  ? members.filter(m => m.role === "admin")  :
        memberTab === "members" ? members.filter(m => m.role === "member") :
        members;

    const roleLabel = (role) => role === "admin"
        ? { label: "Admin",  bg: "#fff8e0", color: "#8a6a00",   Icon: Trophy }
        : { label: "Member", bg: "#f4f0ea", color: "#2d3b1f99", Icon: Users  };

    if (loading) return (
        <AnimatePresence>
            <CoinLoader text="Loading group..." />
        </AnimatePresence>
    );
    if (error)   return <ErrorScreen type={error} onRetry={fetchGroup} />;
    if (!group)  return null;


    const creatorInitials = getInitials(group.creator_name || "");
    const fillPct         = Math.round((group.member_count / group.max_members) * 100);
    const adminCount      = members.filter(m => m.role === "admin").length;
    const memberOnlyCount = members.filter(m => m.role === "member").length;

    return (
        <>
            <AnimatePresence>
                {showPay && (
                    <PaymentModal
                        onClose={() => setShowPay(false)}
                        contribution={myPendingContrib}
                        group={group}
                    />
                )}
                {showReleaseCycle && (
                    <ReleaseModal
                        onClose={() => { setShowReleaseCycle(null); }}
                        cycle={showReleaseCycle}
                        groupId={groupId}
                        onSuccess={() => { fetchGroup(); fetchCycles(); fetchMyContributions(); setShowReleaseCycle(null); }}
                    />
                )}
            </AnimatePresence>

            <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative" }}>
                {allCoins.map((c, i) => <FloatingCoin key={i} {...c} />)}

                <div style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#2d5a35 55%,#3d6a25 100%)", position: "relative", overflow: "visible", paddingBottom: 90 }}>
                    {[{ s: 280, t: "-18%", l: "-6%", o: .07 }, { s: 200, t: "28%", l: "18%", o: .05 }, { s: 320, t: "-12%", r: "4%", o: .06 }].map((c, i) => (
                        <motion.div key={i} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                            style={{ position: "absolute", width: c.s, height: c.s, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.14)", top: c.t, left: c.l, right: c.r, opacity: c.o, pointerEvents: "none" }} />
                    ))}

                    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(20px,4vw,44px) clamp(16px,3vw,40px) 0", position: "relative", zIndex: 2 }}>

                        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18, marginTop: 14, flexWrap: "wrap" }}>
                            {[{ label: "Dashboard", to: "/dashboard" }, { label: "Groups", to: "/groups" }, { label: group.name, to: null }].map(({ label, to }, i, arr) => (
                                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {to ? (
                                        <MotionLink to={to} whileHover={{ color: "#d4a843" }}
                                            style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 400, textDecoration: "none" }}>
                                            {label}
                                        </MotionLink>
                                    ) : (
                                        <span style={{ fontSize: "0.8rem", color: "#fff", fontWeight: 600 }}>{label}</span>
                                    )}
                                    {i < arr.length - 1 && <ChevronRight size={12} color="rgba(255,255,255,0.35)" />}
                                </span>
                            ))}
                        </motion.div>

                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>

                            <div style={{ flex: "1 1 360px", minWidth: 0 }}>
                                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.11)", borderRadius: 99, padding: "6px 14px", marginBottom: 18, backdropFilter: "blur(8px)" }}>
                                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                                        style={{ width: 7, height: 7, borderRadius: "50%", background: group.status === "active" ? "#1db893" : "#d4a843" }} />
                                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>
                                        {capitalize(group.status)} · {capitalize(group.frequency)} Contributions
                                    </span>
                                    {group.is_public !== undefined && (
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "2px 8px", fontSize: "0.72rem", color: "rgba(255,255,255,0.8)", marginLeft: 4 }}>
                                            {group.is_public ? <Globe size={10} strokeWidth={2.5} /> : <Lock size={10} strokeWidth={2.5} />}
                                            {group.is_public ? "Public" : "Private"}
                                        </span>
                                    )}
                                </motion.div>

                                <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                                    style={{ fontSize: "clamp(1.9rem,5vw,3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: 14, fontFamily: "'Fraunces',serif" }}>
                                    {group.name}
                                </motion.h1>

                                {group.description && (
                                    <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                        style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 460, marginBottom: 22 }}>
                                        {group.description}
                                    </motion.p>
                                )}

                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                                    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#d4a843", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.72rem", color: "#2d3b1f" }}>
                                        {creatorInitials}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}>Created by</p>
                                        <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#fff" }}>{group.creator_name}</p>
                                    </div>
                                    <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
                                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>Started {fmtDate(group.start_date)}</span>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                                    style={{ display: "flex", gap: 10, position: "relative", zIndex: 10, flexWrap: "wrap" }}>
                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleCopyInvite}
                                        style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 16px", color: "#fff", fontSize: "0.87rem", fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)" }}>
                                        <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                            {copied ? <Check size={15} strokeWidth={2} /> : <Share2 size={15} strokeWidth={2} />}
                                        </motion.span>
                                        {copied ? "Copied!" : "Invite"}
                                    </motion.button>

                                    <div style={{ position: "relative", zIndex: 10 }} onClick={e => e.stopPropagation()}>
                                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            onClick={() => setShowSettings(v => !v)}
                                            style={{ width: 42, height: 42, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)", color: "#fff", position: "relative" }}>
                                            <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}><Settings size={17} strokeWidth={2} /></motion.span>
                                            {/* Badge on settings button */}
                                            {isAdmin && pendingCount > 0 && (
                                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                                                    style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: "#e84343", borderRadius: "50%", fontSize: "0.58rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid transparent" }}>
                                                    {pendingCount}
                                                </motion.span>
                                            )}
                                        </motion.button>
                                        <AnimatePresence>
                                            {showSettings && (
                                                <SettingsMenu
                                                    onClose={() => setShowSettings(false)}
                                                    onDelete={handleDelete}
                                                    onLeave={handleLeave}
                                                    onCopyInvite={handleCopyInvite}
                                                    isCreator={isCreator}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>

                            {isAdmin && (
                                <motion.div initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.18 }}
                                    style={{ flex: "0 1 330px", background: "rgba(10,22,40,0.88)", borderRadius: 20, padding: "22px 20px", backdropFilter: "blur(16px)", border: "1.5px solid rgba(255,255,255,0.1)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#d4a843", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Send size={15} color="#2d3b1f" strokeWidth={2} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>Admin Panel</p>
                                            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>Group management</p>
                                        </div>
                                        {pendingCount > 0 && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                                                style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(232,67,67,0.18)", borderRadius: 99, padding: "4px 10px" }}>
                                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e84343" }} />
                                                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff8080" }}>
                                                    {pendingCount} request{pendingCount !== 1 ? "s" : ""}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 13, padding: "13px", marginBottom: 14 }}>
                                        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 4 }}>INVITE CODE</p>
                                        <p style={{ fontWeight: 700, color: "#fff", fontSize: "0.85rem", fontFamily: "monospace", wordBreak: "break-all" }}>
                                            {group.invite_code}
                                        </p>
                                    </div>

                                    {[
                                        { c: "#1db893", t: `${group.member_count} of ${group.max_members} members joined` },
                                        { c: group.is_full ? "#1db893" : "#d4a843", t: group.is_full ? "Group is full" : `${group.max_members - group.member_count} spots remaining` },
                                        ...(pendingCount > 0 ? [{ c: "#e84343", t: `${pendingCount} join request${pendingCount !== 1 ? "s" : ""} awaiting review` }] : []),
                                        { c: group.status === "completed" ? "#1db893" : "#d4a843", t: group.status === "completed" ? "Full cycle complete — ready to restart" : `Cycle ${group.current_cycle || 0} of ${group.max_members} active` },
                                    ].map(({ c, t }, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                                            <CheckCircle size={12} color={c} strokeWidth={2.5} />
                                            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.68)" }}>{t}</span>
                                        </div>
                                    ))}

                                    <motion.button whileHover={{ scale: 1.02, backgroundColor: "#c49a35" }} whileTap={{ scale: 0.97 }}
                                        onClick={() => activeCycle ? setShowReleaseCycle(activeCycle) : null}
                                        disabled={!activeCycle || activeCycle?.status !== "contributions_complete"}
                                        style={{ width: "100%", background: activeCycle?.status === "contributions_complete" ? "#d4a843" : "#6a7a60", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, cursor: activeCycle?.status === "contributions_complete" ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 14, fontSize: "0.9rem", boxShadow: activeCycle?.status === "contributions_complete" ? "0 4px 18px rgba(212,168,67,0.35)" : "none" }}>
                                        <Send size={15} strokeWidth={2} />
                                        {activeCycle?.status === "contributions_complete" ? "Release Payout" : "Waiting for contributions"}
                                    </motion.button>
                                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 7 }}>
                                        {activeCycle?.status === "contributions_complete"
                                            ? `Ready to pay ${activeCycle.recipient_name}`
                                            : activeCycle
                                                ? `${activeCycle.contributions_summary?.paid || 0}/${activeCycle.contributions_summary?.total || 0} contributions received`
                                                : group.status === "pending" ? "Start the group first" : "No active cycle"
                                        }
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
                            {[
                                { Icon: CircleDollarSign, iC: "#2d3b1f", iB: "#d4a843",               label: "Total Pool",   val: fmtCurrency(group.total_pool) },
                                { Icon: Users,            iC: "#d4a843", iB: "rgba(212,168,67,0.18)", label: "Members",     val: `${group.member_count}/${group.max_members}` },
                                { Icon: RefreshCw,        iC: "#e8863a", iB: "rgba(232,134,58,0.18)", label: "Frequency",   val: capitalize(group.frequency) },
                                { Icon: Trophy,           iC: "#7c5cbf", iB: "rgba(124,92,191,0.18)", label: "My Position", val: myMember ? `#${myMember.payout_order}` : "—" },
                            ].map(({ Icon, iC, iB, label, val }, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + i * 0.08 }}
                                    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.22)" }}
                                    style={{ flex: "1 1 130px", background: "rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 16px", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.12)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                                            style={{ width: 32, height: 32, borderRadius: 9, background: iB, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Icon size={15} color={iC} strokeWidth={1.8} />
                                        </motion.div>
                                        <span style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.55)" }}>{label}</span>
                                    </div>
                                    <p style={{ fontSize: "clamp(1.2rem,3vw,1.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: "'Fraunces',serif" }}>{val}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px clamp(16px,3vw,40px) 80px", position: "relative", zIndex: 2 }}>

                    <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
                        style={{ background: "#fff", borderRadius: 20, padding: "22px 26px", marginBottom: 26, border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                            <div>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2d3b1f80", letterSpacing: "0.1em", marginBottom: 3 }}>GROUP CAPACITY</p>
                                <p style={{ fontSize: "0.97rem", fontWeight: 700, color: "#2d3b1f" }}>
                                    {group.member_count} of {group.max_members} members — <span style={{ color: "#d4a843" }}>{fillPct}% Full</span>
                                </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: "0.72rem", color: "#2d3b1f80", marginBottom: 3 }}>Total Pool</p>
                                <p style={{ fontSize: "1.15rem", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif" }}>{fmtCurrency(group.total_pool)}</p>
                            </div>
                        </div>
                        <div style={{ position: "relative", marginBottom: 10 }}>
                            <div style={{ background: "#ede8de", borderRadius: 99, height: 11, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} whileInView={{ width: `${fillPct}%` }} viewport={{ once: true }}
                                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#2d3b1f,#d4a843,#e8863a)" }} />
                            </div>
                            <motion.div initial={{ left: 0 }} whileInView={{ left: `${fillPct}%` }} viewport={{ once: true }}
                                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                                style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", width: 17, height: 17, borderRadius: "50%", background: "#e8863a", border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {["0%", "25%", "50%", "75%", "100%"].map((l, i) => <span key={i} style={{ fontSize: "0.7rem", color: "#2d3b1f55" }}>{l}</span>)}
                        </div>
                    </motion.div>

                    <div style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap" }}>

                        <div style={{ flex: "1 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>

                            {isAdmin && group.status === "pending" && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a35)", borderRadius: 20, padding: "20px 22px", border: "1.5px solid rgba(255,255,255,0.1)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#d4a843", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Play size={16} color="#2d3b1f" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, color: "#fff", fontSize: "0.92rem" }}>Group Ready to Start</p>
                                            <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.5)" }}>{group.member_count} of {group.max_members} members joined</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: startingGroup ? 1 : 1.02, backgroundColor: startingGroup ? undefined : "#c49a35" }}
                                        whileTap={{ scale: startingGroup ? 1 : 0.97 }}
                                        onClick={handleStartGroup}
                                        disabled={startingGroup || group.member_count < 2}
                                        style={{ width: "100%", background: group.member_count >= 2 ? "#d4a843" : "#6a7a60", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, cursor: (startingGroup || group.member_count < 2) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: "0.92rem" }}>
                                        {startingGroup
                                            ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(45,59,31,0.3)", borderTopColor: "#2d3b1f" }} />Starting...</>
                                            : group.member_count < 2
                                                ? "Need at least 2 members to start"
                                                : <><Play size={16} strokeWidth={2.5} />Start Group & Open Cycle 1</>
                                        }
                                    </motion.button>
                                </motion.div>
                            )}

                            {isAdmin && group.status === "completed" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a35)", borderRadius: 20, padding: "20px 22px", border: "1.5px solid rgba(255,255,255,0.1)" }}>

                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#d4a843", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Trophy size={16} color="#2d3b1f" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, color: "#fff", fontSize: "0.92rem" }}>
                                                🎉 Full Cycle Complete!
                                            </p>
                                            <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.5)" }}>
                                                Everyone has received their payout
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                                        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: 8 }}>
                                            NEW PAYOUT ORDER AFTER RESTART
                                        </p>
                                        {group.members
                                            ?.filter(m => !m.is_suspended)
                                            .sort((a, b) => a.payout_order - b.payout_order)
                                            .map((m, i, arr) => {
                                                const rotated = [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
                                                const newPosition = rotated.findIndex(r => r.id === m.id) + 1;
                                                return (
                                                    <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 6 : 0 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(212,168,67,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: "#d4a843" }}>
                                                                {newPosition}
                                                            </div>
                                                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>{m.full_name}</span>
                                                        </div>
                                                        {i === arr.length - 1 && (
                                                            <span style={{ fontSize: "0.65rem", background: "#d4a843", color: "#2d3b1f", borderRadius: 99, padding: "2px 7px", fontWeight: 700 }}>
                                                                Goes First
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: restartingGroup ? 1 : 1.02, backgroundColor: restartingGroup ? undefined : "#c49a35" }}
                                        whileTap={{ scale: restartingGroup ? 1 : 0.97 }}
                                        onClick={handleRestartGroup}
                                        disabled={restartingGroup}
                                        style={{ width: "100%", background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, cursor: restartingGroup ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: "0.92rem" }}>
                                        {restartingGroup
                                            ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(45,59,31,0.3)", borderTopColor: "#2d3b1f" }} />Restarting...</>
                                            : <><RefreshCw size={16} strokeWidth={2.5} />Restart Group — New Round</>
                                        }
                                    </motion.button>

                                    <p style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
                                        Last recipient goes first in the new round
                                    </p>
                                </motion.div>
                            )}

                            {group.status === "active" && (
                                <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                                    style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
                                        <h3 style={{ fontSize: "0.97rem", fontWeight: 800, color: "#2d3b1f", display: "flex", alignItems: "center", gap: 7 }}>
                                            <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                                <TrendingUp size={16} color="#d4a843" strokeWidth={2} />
                                            </motion.span>
                                            Cycles
                                        </h3>
                                        <motion.button whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}
                                            onClick={() => { fetchCycles(); fetchMyContributions(); }}
                                            style={{ width: 28, height: 28, border: "1.5px solid #e8e2d8", background: "#fff", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <RefreshCw size={13} color="#2d3b1f80" strokeWidth={2} />
                                        </motion.button>
                                    </div>

                                    {cyclesLoading ? (
                                        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e0dbd2", borderTopColor: "#2d3b1f" }} />
                                        </div>
                                    ) : cycles.length === 0 ? (
                                        <div style={{ textAlign: "center", padding: "24px 0" }}>
                                            <RefreshCw size={32} color="#d4a84355" strokeWidth={1.2} style={{ margin: "0 auto 10px" }} />
                                            <p style={{ fontSize: "0.84rem", color: "#2d3b1f80" }}>No cycles yet</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            {cycles.map((cycle, i) => {
                                                const statusColors = {
                                                    collecting:             { bg: "#fffbe8", border: "#f5e090",  color: "#8a6a00",  dot: "#d4a843" },
                                                    contributions_complete: { bg: "#f0faf6", border: "#c8ede0",  color: "#1a5c3a",  dot: "#1db893" },
                                                    paid_out:               { bg: "#f4f0ea", border: "#e0dbd2",  color: "#2d3b1f80", dot: "#2d3b1f" },
                                                    pending:                { bg: "#f8f6f0", border: "#e8e2d8",  color: "#2d3b1f60", dot: "#b0b8a8" },
                                                };
                                                const s = statusColors[cycle.status] || statusColors.pending;
                                                const summary = cycle.contributions_summary;
                                                const isCurrentCycle = cycle.status === "collecting" || cycle.status === "contributions_complete";
                                                const myContribForCycle = myContributions.find(c => c.cycle_number === cycle.cycle_number);

                                                return (
                                                    <motion.div key={cycle.id}
                                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 14, padding: "14px 16px" }}>

                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                                            <div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                                                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                                                                    <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#2d3b1f" }}>
                                                                        Cycle {cycle.cycle_number}
                                                                    </span>
                                                                    {isCurrentCycle && (
                                                                        <span style={{ fontSize: "0.66rem", fontWeight: 700, background: s.dot + "22", color: s.color, borderRadius: 99, padding: "2px 7px" }}>
                                                                            {cycle.status === "contributions_complete" ? "Ready to Release" : "Active"}
                                                                        </span>
                                                                    )}
                                                                    {cycle.status === "paid_out" && (
                                                                        <span style={{ fontSize: "0.66rem", fontWeight: 700, background: "#f0ece4", color: "#2d3b1f80", borderRadius: 99, padding: "2px 7px" }}>
                                                                            Paid Out
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p style={{ fontSize: "0.74rem", color: "#2d3b1f70" }}>
                                                                    Recipient: <strong style={{ color: "#2d3b1f" }}>{cycle.recipient_name || "TBD"}</strong>
                                                                </p>
                                                                <p style={{ fontSize: "0.72rem", color: "#2d3b1f60", marginTop: 2 }}>
                                                                    Due: {fmtDate(cycle.due_date)}
                                                                </p>
                                                            </div>
                                                            <div style={{ textAlign: "right" }}>
                                                                <p style={{ fontSize: "1rem", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif" }}>
                                                                    {fmtCurrency(cycle.payout_amount)}
                                                                </p>
                                                                <p style={{ fontSize: "0.7rem", color: "#2d3b1f60" }}>payout</p>
                                                            </div>
                                                        </div>

                                                        {summary && (
                                                            <div style={{ marginBottom: 10 }}>
                                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                                                    <span style={{ fontSize: "0.73rem", color: "#2d3b1f80" }}>
                                                                        {summary.paid} of {summary.total} paid
                                                                    </span>
                                                                    <span style={{ fontSize: "0.73rem", color: summary.pending > 0 ? "#e84343" : "#1db893", fontWeight: 700 }}>
                                                                        {summary.pending > 0 ? `${summary.pending} pending` : "All paid ✓"}
                                                                    </span>
                                                                </div>
                                                                <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${summary.total > 0 ? (summary.paid / summary.total) * 100 : 0}%` }}
                                                                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                                                        style={{ height: "100%", borderRadius: 99, background: summary.pending === 0 ? "#1db893" : "#d4a843" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {myContribForCycle && (
                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                                                    {myContribForCycle.status === "paid" ? (
                                                                        <CheckCircle size={13} color="#1db893" strokeWidth={2.5} />
                                                                    ) : myContribForCycle.status === "pending" ? (
                                                                        <Clock size={13} color="#d4a843" strokeWidth={2} />
                                                                    ) : (
                                                                        <XCircle size={13} color="#e84343" strokeWidth={2.5} />
                                                                    )}
                                                                    <span style={{ fontSize: "0.75rem", color: "#2d3b1f80" }}>
                                                                        My contribution: <strong style={{ color: myContribForCycle.status === "paid" ? "#1db893" : myContribForCycle.status === "pending" ? "#d4a843" : "#e84343" }}>
                                                                            {capitalize(myContribForCycle.status)}
                                                                        </strong>
                                                                    </span>
                                                                </div>
                                                                {myContribForCycle.status === "pending" && (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                                                        onClick={() => { setMyPendingContrib(myContribForCycle); setShowPay(true); }}
                                                                        style={{ background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 8, padding: "6px 12px", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                                                        <CreditCard size={11} strokeWidth={2.5} />Pay Now
                                                                    </motion.button>
                                                                )}
                                                            </div>
                                                        )}

                                                        {isAdmin && cycle.status === "contributions_complete" && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.02, backgroundColor: "#c49a35" }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={() => setShowReleaseCycle(cycle)}
                                                                style={{ width: "100%", background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: "0.85rem", marginTop: 10, boxShadow: "0 3px 12px rgba(212,168,67,0.35)" }}>
                                                                <Send size={14} strokeWidth={2.5} />Release Payout to {cycle.recipient_name}
                                                            </motion.button>
                                                        )}

                                                        {isAdmin && cycle.status === "collecting" && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={async () => {
                                                                    try {
                                                                        const res = await AxiosInstance.post(`api/groups/${groupId}/cycles/${cycle.id}/process-defaulters/`);
                                                                        alert(res.data.message);
                                                                        fetchCycles();
                                                                    } catch (err) {
                                                                        alert(err.response?.data?.error || "Cannot process defaulters yet.");
                                                                    }
                                                                }}
                                                                style={{ width: "100%", background: "#f4f0ea", color: "#2d3b1f80", border: "none", borderRadius: 10, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.76rem", marginTop: 8 }}>
                                                                Process Defaulters (after due date)
                                                            </motion.button>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                                    <h3 style={{ fontSize: "0.97rem", fontWeight: 800, color: "#2d3b1f", display: "flex", alignItems: "center", gap: 7 }}>
                                        <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><RefreshCw size={16} color="#d4a843" strokeWidth={2} /></motion.span>
                                        Payout Order
                                    </h3>
                                    <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#2d3b1f80", background: "#f4f0ea", borderRadius: 99, padding: "4px 12px" }}>{group.member_count} Members</span>
                                </div>
                                <CircleViz members={members} />
                                <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
                                    {[{ c: "#1db893", l: "Received" }, { c: "#d4a843", l: "Current" }, { c: "#7c5cbf", l: "Upcoming" }, { c: "#d0ccc4", l: "Pending" }].map(({ c, l }, i) => (
                                        <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.76rem", color: "#2d3b1f80" }}>
                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />{l}
                                        </span>
                                    ))}
                                </div>
                                <p style={{ textAlign: "center", fontSize: "0.74rem", color: "#2d3b1f60", marginTop: 10 }}>
                                    Cycle status updates when transactions module is live
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
                                    <h3 style={{ fontSize: "0.97rem", fontWeight: 800, color: "#2d3b1f", display: "flex", alignItems: "center", gap: 7 }}>
                                        <motion.span whileHover={{ rotate: 20 }}><Users size={16} color="#d4a843" strokeWidth={2} /></motion.span>
                                        Members
                                        <span style={{ background: "#f4f0ea", borderRadius: 99, padding: "2px 9px", fontSize: "0.8rem", marginLeft: 4 }}>{group.member_count}</span>
                                    </h3>
                                    <span style={{ fontSize: "0.8rem", color: "#2d3b1f80" }}>
                                        {adminCount} admin{adminCount !== 1 ? "s" : ""} · {memberOnlyCount} member{memberOnlyCount !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                <div style={{ display: "flex", gap: 3, background: "#f4f0ea", borderRadius: 10, padding: 3, marginBottom: 14 }}>
                                    {[
                                        ["all",     `All (${group.member_count})`  ],
                                        ["admins",  `Admins (${adminCount})`       ],
                                        ["members", `Members (${memberOnlyCount})` ],
                                    ].map(([key, label]) => (
                                        <motion.button key={key} onClick={() => setMemberTab(key)} whileTap={{ scale: 0.97 }}
                                            style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 8, padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, background: memberTab === key ? "#fff" : "transparent", color: memberTab === key ? "#2d3b1f" : "#2d3b1f80", boxShadow: memberTab === key ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }}>
                                            {label}
                                        </motion.button>
                                    ))}
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <AnimatePresence>
                                        {filteredMembers.map((m, i) => {
                                            const st       = roleLabel(m.role);
                                            const initials = getInitials(m.full_name);
                                            const color    = getColor(members.indexOf(m));
                                            const isMe     = m.user_id === currentUser.id;
                                            return (
                                                <motion.div key={m.id}
                                                    initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                    transition={{ delay: i * 0.04 }}
                                                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", borderRadius: 11, background: isMe ? "#f8fdf5" : "transparent", borderLeft: isMe ? "3px solid #2d3b1f" : "3px solid transparent", position: "relative", flexWrap: "wrap" }}>
                                                    <div style={{ position: "relative", flexShrink: 0 }}>
                                                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.72rem", color: "#fff" }}>
                                                            {initials}
                                                        </div>
                                                        {m.role === "admin" && (
                                                            <div style={{ position: "absolute", bottom: -2, right: -2, width: 13, height: 13, borderRadius: "50%", background: "#d4a843", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <Trophy size={7} color="#2d3b1f" strokeWidth={3} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 100 }}>
                                                        <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2d3b1f" }}>
                                                            {m.full_name}{isMe && <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2d3b1f80", marginLeft: 6 }}>(You)</span>}
                                                        </p>
                                                        <p style={{ fontSize: "0.72rem", color: "#2d3b1f80" }}>
                                                            #{m.payout_order ?? "—"} in queue · {m.email}
                                                        </p>
                                                    </div>
                                                    <span style={{ background: st.bg, color: st.color, fontSize: "0.7rem", fontWeight: 700, borderRadius: 99, padding: "4px 9px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                                        <st.Icon size={10} strokeWidth={2.5} />{st.label}
                                                    </span>
                                                    {!isMe && (
                                                        <div style={{ position: "relative", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                                                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                                onClick={() => setMemberMenuId(memberMenuId === m.id ? null : m.id)}
                                                                style={{ width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 7 }}>
                                                                <MoreVertical size={14} color="#2d3b1f80" />
                                                            </motion.button>
                                                            <AnimatePresence>
                                                                {memberMenuId === m.id && (
                                                                    <MemberMenu
                                                                        onClose={() => setMemberMenuId(null)}
                                                                        onRemove={() => handleRemoveMember(m.user_id)}
                                                                        isAdmin={isAdmin}
                                                                    />
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                        <div style={{ flex: "0 1 310px", minWidth: 270, display: "flex", flexDirection: "column", gap: 18 }}>

                            <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "18px 16px", border: "2px solid #e8e2d8", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
                                    <Clock size={15} color="#2d3b1f80" strokeWidth={2} />
                                    <span style={{ fontSize: "0.77rem", fontWeight: 700, color: "#2d3b1f", letterSpacing: "0.05em" }}>NEXT PAYOUT IN</span>
                                    <span style={{ background: "#f4f0ea", color: "#2d3b1f80", fontSize: "0.62rem", fontWeight: 700, borderRadius: 99, padding: "3px 7px" }}>COMING SOON</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 4, width: "100%" }}>
                                    {[["--","DAYS"],["--","HRS"],["--","MINS"],["--","SECS"]].map(([val, label], i) => (
                                        <div key={i} style={{ display: "contents" }}>
                                            <CountTile val={val} label={label} delay={i * 0.25} />
                                            {i < 3 && <div style={{ paddingTop: 8, fontSize: "1.4rem", fontWeight: 900, color: "#2d3b1f", lineHeight: 1 }}>:</div>}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.1 }}
                                style={{ background: "linear-gradient(145deg,#2d3b1f,#3d5228)", borderRadius: 20, padding: "20px 18px", boxShadow: "0 8px 30px rgba(45,59,31,0.26)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                                    <Bell size={15} color="#d4a843" strokeWidth={2} />
                                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>Contribution</span>
                                </div>
                                <p style={{ fontSize: "1.9rem", fontWeight: 900, color: "#d4a843", fontFamily: "'Fraunces',serif", marginBottom: 4 }}>
                                    {fmtCurrency(group.contribution_amount)}
                                </p>
                                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", marginBottom: 18 }}>
                                    Per {group.frequency} · {capitalize(group.status)}
                                </p>
                                <motion.button whileHover={{ scale: 1.03, backgroundColor: "#c49a35" }} whileTap={{ scale: 0.97 }}
                                    onClick={async () => {
                                        try {
                                            const res = await AxiosInstance.get(`api/groups/${groupId}/my-contributions/`);
                                            console.log("All contributions:", res.data.contributions);
                                            const contributions = res.data.contributions || [];
                                            const pending = contributions.find(c => c.status === "pending");
                                            console.log("Pending found:", pending);
                                            if (pending) {
                                                setMyPendingContrib(pending);
                                                setShowPay(true);
                                            } else {
                                                alert("No pending contribution found for this cycle.");
                                            }
                                        } catch {
                                            alert("Failed to load contribution details. Please try again.");
                                        }
                                    }}
                                    style={{ width: "100%", background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: "0.92rem" }}>
                                    <CreditCard size={16} strokeWidth={2} />Pay Now
                                </motion.button>
                                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 7, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                    <Lock size={9} color="rgba(255,255,255,0.3)" />Your card details are encrypted and never stored
                                </p>
                            </motion.div>

                            {isAdmin && (
                                <JoinRequestsPanel
                                    groupId={groupId}
                                    onAccepted={fetchGroup}
                                    pendingCount={pendingCount}
                                    setPendingCount={setPendingCount}
                                />
                            )}

                            <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.18 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "20px 18px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d4a843", letterSpacing: "0.1em", marginBottom: 13 }}>INVITE CODE</p>
                                <div style={{ background: "#f8f6f0", borderRadius: 11, padding: "13px", marginBottom: 12 }}>
                                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2d3b1f", fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.6 }}>
                                        {group.invite_code}
                                    </p>
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleCopyInvite}
                                    style={{ width: "100%", background: copied ? "#2d3b1f" : "#f0ece4", color: copied ? "#d4a843" : "#2d3b1f", border: "none", borderRadius: 11, padding: "11px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: "0.88rem", transition: "background 0.2s" }}>
                                    {copied ? <><Check size={15} strokeWidth={2.5} />Copied!</> : <><Copy size={15} strokeWidth={2} />Copy Invite Code</>}
                                </motion.button>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.24 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "20px 18px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d4a843", letterSpacing: "0.1em", marginBottom: 14 }}>GROUP INFO</p>
                                {[
                                    { Icon: Coins,    label: "Contribution",  val: `${fmtCurrency(group.contribution_amount)}/${group.frequency}` },
                                    { Icon: Calendar, label: "Frequency",     val: capitalize(group.frequency) },
                                    { Icon: Users,    label: "Total Members", val: `${group.max_members} people` },
                                    { Icon: Trophy,   label: "Total Payout",  val: fmtCurrency(group.total_pool) },
                                    { Icon: Calendar, label: "Start Date",    val: fmtDate(group.start_date) },
                                    ...(group.is_public !== undefined ? [{ Icon: group.is_public ? Globe : Lock, label: "Visibility", val: group.is_public ? "Public" : "Private" }] : []),
                                ].map(({ Icon, label, val }, i, arr) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < arr.length - 1 ? "1px solid #f4f0ea" : "none" }}>
                                        <motion.span whileHover="spin" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", color: "#2d3b1f80" }}>
                                            <motion.span variants={{ spin: { rotate: 360, transition: { duration: 0.5 } } }} style={{ display: "inline-flex" }}><Icon size={13} strokeWidth={1.8} /></motion.span>
                                            {label}
                                        </motion.span>
                                        <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "#2d3b1f" }}>{val}</span>
                                    </div>
                                ))}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.3 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "20px 18px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                    <h3 style={{ fontSize: "0.93rem", fontWeight: 800, color: "#2d3b1f", display: "flex", alignItems: "center", gap: 7 }}>
                                        <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                            <CircleDollarSign size={15} color="#d4a843" strokeWidth={2} />
                                        </motion.span>
                                        Transaction Ledger
                                    </h3>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #e8e2d8", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: "0.73rem", fontWeight: 600, color: "#2d3b1f80" }}>
                                        <Download size={11} />Export
                                    </motion.button>
                                </div>
                                <div style={{ textAlign: "center", padding: "32px 0" }}>
                                    <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ marginBottom: 10 }}>
                                        <CircleDollarSign size={36} color="#d4a84355" strokeWidth={1.2} style={{ margin: "0 auto" }} />
                                    </motion.div>
                                    <p style={{ fontSize: "0.84rem", fontWeight: 600, color: "#2d3b1f80" }}>No transactions yet</p>
                                    <p style={{ fontSize: "0.75rem", color: "#2d3b1f55", marginTop: 4 }}>Transactions will appear once payments begin</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupDetail;