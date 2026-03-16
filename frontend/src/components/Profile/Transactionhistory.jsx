import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ChevronDown, Check, ArrowRight, X,
    Coins, TrendingUp, TrendingDown, Clock, XCircle,
    Download, Users, Tag, CalendarDays, Wallet,
} from "lucide-react";


const TRANSACTIONS = [
    {
        id: 1,
        group: "Lagos Tech Professionals",
        ref: "PAY-2024-001-XYZ",
        type: "Payout",
        status: "Completed",
        date: "2024-01-15",
        time: "14:30",
        method: "Bank Transfer",
        amount: 500000,
        iconBg: "linear-gradient(135deg,#1db893,#0fa87a)",
        iconEmoji: "🎉",
    },
    {
        id: 2,
        group: "Family Savings Circle",
        ref: "PAY-2024-002-ABC",
        type: "Payment",
        status: "Completed",
        date: "2024-01-10",
        time: "09:15",
        method: "Paystack",
        amount: -50000,
        iconBg: "linear-gradient(135deg,#5b6ef5,#8b5cf6)",
        iconEmoji: "💸",
    },
    {
        id: 3,
        group: "Lagos Tech Professionals",
        ref: "PAY-2024-003-DEF",
        type: "Payment",
        status: "Completed",
        date: "2024-01-05",
        time: "16:45",
        method: "Paystack",
        amount: -100000,
        iconBg: "linear-gradient(135deg,#5b6ef5,#8b5cf6)",
        iconEmoji: "💸",
    },
    {
        id: 4,
        group: "Market Women Association",
        ref: "PAY-2023-045-GHI",
        type: "Payout",
        status: "Completed",
        date: "2023-12-28",
        time: "11:20",
        method: "Bank Transfer",
        amount: 300000,
        iconBg: "linear-gradient(135deg,#1db893,#0fa87a)",
        iconEmoji: "🎉",
    },
    {
        id: 5,
        group: "Young Entrepreneurs Hub",
        ref: "PAY-2024-004-JKL",
        type: "Payment",
        status: "Pending",
        date: "2024-01-18",
        time: "10:00",
        method: "Paystack",
        amount: -75000,
        iconBg: "linear-gradient(135deg,#5b6ef5,#8b5cf6)",
        iconEmoji: "💸",
    },
    {
        id: 6,
        group: "Family Savings Circle",
        ref: "PAY-2024-005-MNO",
        type: "Payment",
        status: "Failed",
        date: "2024-01-12",
        time: "15:30",
        method: "Paystack",
        amount: -50000,
        iconBg: "linear-gradient(135deg,#5b6ef5,#8b5cf6)",
        iconEmoji: "💸",
    },
    {
        id: 7,
        group: "Lagos Tech Professionals",
        ref: "FEE-2024-001-PQR",
        type: "Fee",
        status: "Completed",
        date: "2024-01-05",
        time: "16:46",
        method: "Paystack",
        amount: -2500,
        iconBg: "linear-gradient(135deg,#d4a843,#e8c055)",
        iconEmoji: "💳",
    },
    {
        id: 8,
        group: "Family Savings Circle",
        ref: "REF-2024-001-STU",
        type: "Refund",
        status: "Completed",
        date: "2024-01-13",
        time: "12:00",
        method: "Bank Transfer",
        amount: 50000,
        iconBg: "linear-gradient(135deg,#60a5fa,#3b82f6)",
        iconEmoji: "🔄",
    },
];

const TYPE_OPTIONS = [
    { value: "all",     label: "All Types", emoji: null  },
    { value: "Payment", label: "Payments",  emoji: "💚"  },
    { value: "Payout",  label: "Payouts",   emoji: "🎉"  },
    { value: "Refund",  label: "Refunds",   emoji: "🔄"  },
    { value: "Fee",     label: "Fees",      emoji: "💳"  },
];

const STATUS_OPTIONS = [
    { value: "all",       label: "All Status", emoji: null },
    { value: "Completed", label: "Completed",  emoji: "✅" },
    { value: "Pending",   label: "Pending",    emoji: "⏳" },
    { value: "Failed",    label: "Failed",     emoji: "❌" },
];

const fmt = (n) => "₦" + Math.abs(n).toLocaleString("en-NG");

const typeBadge = (type) => {
    const map = {
        Payout:  { bg: "#e8faf3", color: "#1db893", emoji: "🎉" },
        Payment: { bg: "#edf8ee", color: "#3daa5c", emoji: "💚" },
        Fee:     { bg: "#fff8e0", color: "#b8860b", emoji: "💳" },
        Refund:  { bg: "#e8f0ff", color: "#5b6ef5", emoji: "🔄" },
    };
    return map[type] || { bg: "#f4f0ea", color: "#2d3b1f", emoji: "📋" };
};

const statusBadge = (status) => {
    const map = {
        Completed: { bg: "#e8faf3", color: "#1db893", emoji: "✅" },
        Pending:   { bg: "#fff8e0", color: "#d4a843", emoji: "⏳" },
        Failed:    { bg: "#fff0f0", color: "#e84343", emoji: "❌" },
    };
    return map[status] || { bg: "#f4f0ea", color: "#888", emoji: "❓" };
};

const methodIcon = (method) =>
    method === "Bank Transfer" ? "🏦" : "💳";

const FloatCoin = ({ x, s, d, dr }) => (
    <motion.div
        style={{ position: "fixed", left: x, bottom: -60, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1300], opacity: [0, 0.09, 0.09, 0] }}
        transition={{ duration: dr, delay: d, repeat: Infinity, ease: "linear", times: [0, 0.07, 0.9, 1] }}
    >
        <Coins size={s} color="#d4a843" strokeWidth={1.1} />
    </motion.div>
);

const FLOATS = [
    { x: "4%",  s: 18, d: 0,   dr: 5.2 },
    { x: "14%", s: 13, d: 1.8, dr: 4.6 },
    { x: "29%", s: 16, d: 0.9, dr: 5.8 },
    { x: "56%", s: 12, d: 2.3, dr: 4.4 },
    { x: "71%", s: 17, d: 0.4, dr: 5.1 },
    { x: "84%", s: 14, d: 1.4, dr: 4.9 },
    { x: "94%", s: 20, d: 2.8, dr: 5.5 },
];

const StatCard = ({ value, label, icon, bg, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.03, y: -3 }}
        className="stat-card"
        style={{
            background: bg,
            borderRadius: 18,
            padding: "22px 20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
    >
        <div style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.13 }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {icon}
            </motion.div>
        </div>
        <p
            style={{
                fontSize: "clamp(1.4rem,3vw,2rem)",
                fontWeight: 900,
                color: "#fff",
                fontFamily: "'Fraunces',serif",
                lineHeight: 1,
                marginBottom: 6,
            }}
        >
            {value}
        </p>
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
            {label}
        </p>
    </motion.div>
);

const Dropdown = ({ label, icon, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selected = options.find((o) => o.value === value) || options[0];

    return (
        <div ref={ref} style={{ position: "relative", flex: "1 1 180px", minWidth: 0 }}>
        <p
            style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#2d3b1f80",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 5,
            }}
        >
            {icon} {label}
        </p>

        <motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.98 }}
            style={{
                width: "100%",
                background: "#fff",
                border: `1.5px solid ${open ? "#2d3b1f" : "#e0dbd2"}`,
                borderRadius: 12,
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                fontSize: "0.92rem",
                color: "#2d3b1f",
                fontWeight: 500,
                boxShadow: open ? "0 0 0 3px rgba(45,59,31,0.08)" : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
            }}
        >
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {selected.emoji && <span>{selected.emoji}</span>}
                {selected.label}
            </span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} color="#2d3b1f80" />
            </motion.span>
        </motion.button>

        <AnimatePresence>
            {open && (
            <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1.5px solid #e0dbd2",
                    borderRadius: 13,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
                    zIndex: 999,
                    overflow: "hidden",
                }}
            >
                {options.map((opt) => (
                <motion.button
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    whileHover={{ background: "#f5f0e8" }}
                    style={{
                        width: "100%",
                        background: opt.value === value ? "#eef5ee" : "transparent",
                        border: "none",
                        padding: "11px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        color: opt.value === value ? "#2d3b1f" : "#2d3b1fcc",
                        fontWeight: opt.value === value ? 700 : 500,
                        textAlign: "left",
                        transition: "background 0.15s",
                    }}
                >
                    {opt.emoji ? (
                        <span style={{ fontSize: "1rem" }}>{opt.emoji}</span>
                    ) : (
                        <span
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: "#2d3b1f",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Check size={11} color="#fff" strokeWidth={3} />
                        </span>
                        )}
                        {opt.label}
                        {opt.value === value && (
                        <span style={{ marginLeft: "auto" }}>
                            <Check size={14} color="#2d3b1f" strokeWidth={2.5} />
                        </span>
                    )}
                </motion.button>
                ))}
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
};

const TxModal = ({ tx, onClose }) => {
    const isPositive = tx.amount > 0;
    const sBadge = statusBadge(tx.status);
    const tBadge = typeBadge(tx.type);

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const rows = [
        {
            icon: <Users size={15} color="#7c5cbf" strokeWidth={2} />,
            label: "Group",
            value: tx.group,
            },
            {
            icon: <Tag size={15} color="#7c5cbf" strokeWidth={2} />,
            label: "Reference",
            value: tx.ref,
            mono: true,
        },
        {
            icon: <span style={{ fontSize: "0.95rem" }}>{tBadge.emoji}</span>,
            label: "Type",
            value: tx.type,
            },
            {
            icon: <span style={{ fontSize: "0.95rem" }}>{sBadge.emoji}</span>,
            label: "Status",
            value: tx.status,
            statusColor: sBadge.color,
        },
        {
            icon: <CalendarDays size={15} color="#7c5cbf" strokeWidth={2} />,
            label: "Date",
            value: `${tx.date} at ${tx.time}`,
            },
            {
            icon: <Wallet size={15} color="#7c5cbf" strokeWidth={2} />,
            label: "Payment Method",
            value: tx.method,
        },
    ];

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            background: "rgba(10,20,10,0.55)",
            backdropFilter: "blur(7px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 16px",
        }}
        >
        <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
            background: "#fff",
            borderRadius: 26,
            width: "100%",
            maxWidth: 460,
            overflow: "hidden",
            boxShadow: "0 28px 72px rgba(0,0,0,0.28)",
            }}
        >
            <div style={{ padding: "28px 24px 0", textAlign: "center", position: "relative" }}>

            <motion.button
                whileHover={{ scale: 1.08, background: "#f0ece4" }}
                whileTap={{ scale: 0.94 }}
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#f4f0ea",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s",
                }}
            >
                <X size={16} color="#2d3b1f" strokeWidth={2.5} />
            </motion.button>

            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 20 }}
                style={{
                    width: 66,
                    height: 66,
                    borderRadius: 20,
                    background: tx.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.9rem",
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
                }}
            >
                {tx.iconEmoji}
            </motion.div>

            <h2
                style={{
                    fontSize: "1.2rem",
                    fontWeight: 900,
                    color: "#2d3b1f",
                    marginBottom: 8,
                }}
                className="font-display"
            >
                Transaction Details
            </h2>

            <motion.p
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.14, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    fontSize: "clamp(1.7rem,5vw,2.1rem)",
                    fontWeight: 900,
                    color: isPositive ? "#1db893" : "#2d3b1f",
                    marginBottom: 22,
                    letterSpacing: "-0.02em",
                }}
                className="font-display"
            >
                {isPositive ? "+" : "-"}{fmt(tx.amount)}
            </motion.p>
            </div>

            <div style={{ padding: "0 18px 10px" }}>
            {rows.map(({ icon, label, value, mono, statusColor }, i) => (
                <motion.div
                key={label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.055, duration: 0.3 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: i % 2 === 0 ? "#f8f6f2" : "#fff",
                    borderRadius: 12,
                    marginBottom: 5,
                    gap: 12,
                }}
                >
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {icon}
                    <span style={{ fontSize: "0.83rem", color: "#2d3b1f80", fontWeight: 600 }}>
                    {label}
                    </span>
                </div>
                <span
                    style={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: statusColor || "#2d3b1f",
                    fontFamily: mono ? "monospace" : "'DM Sans',sans-serif",
                    textAlign: "right",
                    wordBreak: "break-all",
                    }}
                >
                    {value}
                </span>
                </motion.div>
            ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ padding: "10px 18px 22px", display: "flex", gap: 10 }}
            >
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#1a4a2a" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        flex: 1,
                        background: "#2d3b1f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 13,
                        padding: "13px",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: "0 4px 16px rgba(45,59,31,0.28)",
                    }}
                >
                    <Download size={16} strokeWidth={2.5} />
                    Download Receipt
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, background: "#e8e0d4" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    style={{
                        flex: "0 0 96px",
                        background: "#f0ece4",
                        color: "#2d3b1f",
                        border: "none",
                        borderRadius: 13,
                        padding: "13px",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        cursor: "pointer",
                        transition: "background 0.15s",
                    }}
                >
                    Close
                </motion.button>
            </motion.div>
        </motion.div>
        </motion.div>
    );
};

const TxRow = ({ tx, index, onClick }) => {
    const isPositive = tx.amount > 0;
    const tBadge = typeBadge(tx.type);
    const sBadge = statusBadge(tx.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(0,0,0,0.09)" }}
            onClick={onClick}
            style={{
                background: "#fff",
                borderRadius: 18,
                padding: "clamp(14px,2vw,20px) clamp(14px,2vw,22px)",
                display: "flex",
                alignItems: "center",
                gap: "clamp(12px,2vw,18px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                border: "1.5px solid #f4f0ea",
                transition: "box-shadow 0.2s",
                flexWrap: "wrap",
                cursor: "pointer",
            }}
        >
        <div
            style={{
                width: "clamp(48px,7vw,60px)",
                height: "clamp(48px,7vw,60px)",
                borderRadius: 15,
                background: tx.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(1.3rem,2.5vw,1.7rem)",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
        >
            {tx.iconEmoji}
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
            <p
                style={{
                    fontWeight: 800,
                    color: "#2d3b1f",
                    fontSize: "clamp(0.9rem,2vw,1.02rem)",
                    marginBottom: 2,
                }}
            >
                {tx.group}
            </p>
            <p
                style={{
                    fontSize: "0.76rem",
                    color: "#2d3b1f60",
                    marginBottom: 8,
                    fontFamily: "monospace",
                }}
            >
                {tx.ref}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>

            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: tBadge.bg,
                    color: tBadge.color,
                    borderRadius: 99,
                    padding: "3px 10px",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    border: `1px solid ${tBadge.color}33`,
                }}
            >
                <span>{tBadge.emoji}</span>
                {tx.type}
            </span>

            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: sBadge.bg,
                    color: sBadge.color,
                    borderRadius: 99,
                    padding: "3px 10px",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    border: `1px solid ${sBadge.color}33`,
                }}
            >
                <span>{sBadge.emoji}</span>
                {tx.status}
            </span>

            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "0.74rem",
                    color: "#2d3b1f70",
                }}
            >
                <span>📅</span>
                {tx.date} • {tx.time}
            </span>

            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "0.74rem",
                    color: "#2d3b1f70",
                }}
            >
                <span>{methodIcon(tx.method)}</span>
                {tx.method}
            </span>
            </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <p
                style={{
                    fontSize: "clamp(1rem,2.2vw,1.25rem)",
                    fontWeight: 900,
                    color: isPositive ? "#1db893" : "#2d3b1f",
                    letterSpacing: "-0.02em",
                }}
                className="font-display"
            >
                {isPositive ? "+" : "-"}{fmt(tx.amount)}
            </p>
            <motion.div whileHover={{ x: 4 }}>
                <ArrowRight size={16} color="#2d3b1f40" />
            </motion.div>
        </div>
        </motion.div>
    );
};

const Transactionhistory = () => {
    const [search,       setSearch]       = useState("");
    const [typeFilter,   setTypeFilter]   = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchFocused, setSearchFocused] = useState(false);
    const [selectedTx,   setSelectedTx]  = useState(null);

    const filtered = useMemo(() => {
        return TRANSACTIONS.filter((tx) => {
        const matchSearch =
            search === "" ||
            tx.group.toLowerCase().includes(search.toLowerCase()) ||
            tx.ref.toLowerCase().includes(search.toLowerCase());

        const matchType =
            typeFilter === "all" || tx.type === typeFilter;

        const matchStatus =
            statusFilter === "all" || tx.status === statusFilter;

        return matchSearch && matchType && matchStatus;
        });
    }, [search, typeFilter, statusFilter]);

    const net = useMemo(
        () => filtered.reduce((sum, tx) => sum + tx.amount, 0),
        [filtered]
    );

    const totalPaid     = TRANSACTIONS.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalReceived = TRANSACTIONS.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const pendingCount  = TRANSACTIONS.filter((t) => t.status === "Pending").length;
    const failedCount   = TRANSACTIONS.filter((t) => t.status === "Failed").length;

    const closeModal = useCallback(() => setSelectedTx(null), []);

    return (
        <>

            <AnimatePresence>
                {selectedTx && (
                    <TxModal key="modal" tx={selectedTx} onClose={closeModal} />
                )}
            </AnimatePresence>

            {FLOATS.map((c, i) => <FloatCoin key={i} {...c} />)}

            <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", zIndex: 1 }}>
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "clamp(24px,4vw,52px) clamp(14px,3vw,28px) 80px",
                    }}
                >

                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ textAlign: "center", marginBottom: 36 }}
                >
                    <motion.div
                    animate={{ rotate: [0, 8, -8, 4, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 3 }}
                    style={{
                        fontSize: "clamp(2.5rem,5vw,3.5rem)",
                        marginBottom: 14,
                        display: "inline-block",
                    }}
                    >
                    📊
                    </motion.div>
                    <h1
                        style={{
                            fontSize: "clamp(1.8rem,5vw,3rem)",
                            fontWeight: 900,
                            color: "#2d3b1f",
                            fontFamily: "'Fraunces',serif",
                            marginBottom: 10,
                            lineHeight: 1.1,
                        }}
                    >
                        Transaction History
                    </h1>
                    <p style={{ fontSize: "clamp(0.85rem,2vw,1rem)", color: "#2d3b1f80" }}>
                        Track all your payments, payouts, and transactions
                    </p>
                </motion.div>

                <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
                    <StatCard
                        value={`₦${(totalPaid / 1000).toFixed(0)}K`}
                        label="Total Paid"
                        bg="linear-gradient(135deg,#5b6ef5,#8b5cf6)"
                        icon={<TrendingDown size={72} color="#fff" />}
                        delay={0.05}
                    />
                    <StatCard
                        value={`₦${(totalReceived / 1000).toFixed(0)}K`}
                        label="Total Received"
                        bg="linear-gradient(135deg,#1db893,#0fa87a)"
                        icon={<TrendingUp size={72} color="#fff" />}
                        delay={0.12}
                    />
                    <StatCard
                        value={pendingCount}
                        label="Pending"
                        bg="linear-gradient(135deg,#d4a843,#e8c055)"
                        icon={<Clock size={72} color="#fff" />}
                        delay={0.19}
                    />
                    <StatCard
                        value={failedCount}
                        label="Failed"
                        bg="linear-gradient(135deg,#f05a7e,#e84343)"
                        icon={<XCircle size={72} color="#fff" />}
                        delay={0.26}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55 }}
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        padding: "clamp(18px,3vw,28px)",
                        marginBottom: 22,
                        border: "1.5px solid #f0ece4",
                        boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
                    }}
                >
                    <div className="filter-row">

                    <div style={{ flex: "2 1 240px", minWidth: 0 }}>
                        <p
                            style={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "#2d3b1f80",
                                marginBottom: 6,
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            🔍 Search
                        </p>
                        <div
                            style={{
                                border: `1.5px solid ${searchFocused ? "#2d3b1f" : "#e0dbd2"}`,
                                borderRadius: 12,
                                padding: "11px 14px",
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                background: "#fff",
                                boxShadow: searchFocused ? "0 0 0 3px rgba(45,59,31,0.08)" : "none",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                        >
                        <Search size={15} color="#2d3b1f60" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Group name or reference..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                fontSize: "0.92rem",
                                color: "#2d3b1f",
                                background: "transparent",
                            }}
                        />
                        {search && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setSearch("")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#2d3b1f60",
                                    padding: 0,
                                    display: "flex",
                                }}
                            >
                                <XCircle size={15} />
                            </motion.button>
                        )}
                        </div>
                    </div>

                    <Dropdown
                        label="Type"
                        icon="📋"
                        options={TYPE_OPTIONS}
                        value={typeFilter}
                        onChange={setTypeFilter}
                    />

                    <Dropdown
                        label="Status"
                        icon="⚡"
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={setStatusFilter}
                    />
                    </div>

                    <motion.div
                        layout
                        style={{
                            background: "linear-gradient(135deg,#1a3a2a,#2d5a35)",
                            borderRadius: 14,
                            padding: "14px 20px",
                            marginTop: 18,
                        }}
                    >
                    <div className="summary-bar">
                        <p style={{ fontWeight: 700, color: "#fff", fontSize: "clamp(0.85rem,2vw,0.97rem)" }}>
                            Showing{" "}
                            <span style={{ color: "#d4a843" }}>{filtered.length}</span>{" "}
                            transaction{filtered.length !== 1 ? "s" : ""}
                        </p>
                        <p style={{ fontWeight: 800, fontSize: "clamp(0.88rem,2vw,1rem)", color: "#fff" }}>
                            Net:{" "}
                            <span
                                style={{
                                    color: "#d4a843",
                                    fontSize: "clamp(0.95rem,2.2vw,1.1rem)",
                                }}
                                className="font-display"
                            >
                                {net >= 0 ? "+" : "-"}₦{Math.abs(net).toLocaleString("en-NG")}
                            </span>
                        </p>
                    </div>
                    </motion.div>
                </motion.div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        filtered.map((tx, i) => (
                        <TxRow
                            key={tx.id}
                            tx={tx}
                            index={i}
                            onClick={() => setSelectedTx(tx)}
                        />
                        ))
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                background: "#fff",
                                borderRadius: 20,
                                padding: "52px 24px",
                                textAlign: "center",
                                border: "1.5px solid #f0ece4",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                            }}
                        >
                            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🔍</div>
                            <p
                                style={{
                                    fontWeight: 800,
                                    color: "#2d3b1f",
                                    fontSize: "1.1rem",
                                    marginBottom: 8,
                                }}
                                className="font-display"
                            >
                                No transactions found
                            </p>
                            <p style={{ fontSize: "0.88rem", color: "#2d3b1f70" }}>
                                Try adjusting your filters or search term
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                setSearch("");
                                setTypeFilter("all");
                                setStatusFilter("all");
                                }}
                                style={{
                                    marginTop: 20,
                                    background: "#2d3b1f",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 11,
                                    padding: "10px 22px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontSize: "0.88rem",
                                }}
                            >
                                Clear Filters
                            </motion.button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                </div>
            </div>
        </>
    )
}

export default Transactionhistory