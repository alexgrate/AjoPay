import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    Users, ArrowRight, ArrowLeft, Calendar, Coins,
    Shuffle, ListOrdered, Gavel, CheckCircle,
    ClipboardList, Check, ChevronLeft, Globe, Lock,
    Copy, AlertTriangle
} from "lucide-react";
import AxiosInstance from "../AxiosInstance";
import usePageTitle from "../../hooks/usePageTitle";
import CoinLoader from "../CoinLoader";

const FloatingUser = ({ x, size, delay, dur }) => (
    <motion.div
        style={{ position: "fixed", left: x, bottom: -60, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1300], opacity: [0, 0.11, 0.11, 0] }}
        transition={{ duration: dur, delay, repeat: Infinity, ease: "linear", times: [0, 0.07, 0.9, 1] }}
    >
        <Users size={size} color="#d4a843" strokeWidth={1.1} />
    </motion.div>
);

const floats = [
    { x: "4%",  size: 22, delay: 0,   dur: 5.2 },
    { x: "13%", size: 15, delay: 1.9, dur: 4.6 },
    { x: "28%", size: 13, delay: 2.7, dur: 5.8 },
    { x: "55%", size: 17, delay: 0.5, dur: 5.0 },
    { x: "70%", size: 12, delay: 1.3, dur: 4.8 },
    { x: "82%", size: 19, delay: 2.1, dur: 5.4 },
    { x: "93%", size: 14, delay: 0.8, dur: 4.3 },
];

const stepLabels = ["Basic Info", "Contribution", "Rules"];

const StepBar = ({ current }) => (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%", maxWidth: 640, margin: "0 auto 40px" }}>
        {stepLabels.map((label, i) => {
            const done   = i < current;
            const active = i === current;
            return (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? 1 : "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <motion.div
                            animate={{ background: done || active ? "#2d3b1f" : "#e0dbd2", scale: active ? 1.1 : 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: active ? "0 0 0 5px rgba(45,59,31,0.13)" : "none", position: "relative", zIndex: 2 }}
                        >
                            {done
                                ? <Check size={18} color="#d4a843" strokeWidth={3} />
                                : <span style={{ fontSize: "0.9rem", fontWeight: 800, color: active ? "#fff" : "#b0a898", fontFamily: "'DM Sans',sans-serif" }}>{i + 1}</span>
                            }
                        </motion.div>
                        <span style={{ fontSize: "0.76rem", fontWeight: active ? 700 : done ? 500 : 400, color: active ? "#2d3b1f" : "#2d3b1f60", whiteSpace: "nowrap" }}>{label}</span>
                    </div>
                    {i < stepLabels.length - 1 && (
                        <div style={{ flex: 1, height: 3, background: "#e0dbd2", borderRadius: 99, margin: "0 8px", marginTop: -22, overflow: "hidden" }}>
                            <motion.div
                                animate={{ width: current > i ? "100%" : current === i ? "40%" : "0%" }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                style={{ height: "100%", background: "#2d3b1f", borderRadius: 99 }}
                            />
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);

const Field = ({ label, required, hint, children }) => (
    <div>
        <label style={{ fontSize: "0.87rem", fontWeight: 600, color: "#2d3b1f", marginBottom: 8, display: "block" }}>
            {label}{required && <span style={{ color: "#e84343", marginLeft: 3 }}>*</span>}
        </label>
        {children}
        {hint && <p style={{ fontSize: "0.76rem", color: "#2d3b1f70", marginTop: 5 }}>{hint}</p>}
    </div>
);

const TInput = ({ value, onChange, placeholder, type = "text" }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ border: `1.5px solid ${focused ? "#2d3b1f" : "#e0dbd2"}`, borderRadius: 12, padding: "13px 15px", background: "#fff", boxShadow: focused ? "0 0 0 3px rgba(45,59,31,0.09)" : "none", transition: "border-color 0.2s, box-shadow 0.2s" }}>
            <input
                type={type} placeholder={placeholder} value={value} onChange={onChange}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{ width: "100%", border: "none", outline: "none", fontSize: "0.93rem", color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif" }}
            />
        </div>
    );
};

const TArea = ({ value, onChange, placeholder }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ border: `1.5px solid ${focused ? "#2d3b1f" : "#e0dbd2"}`, borderRadius: 12, padding: "13px 15px", background: "#fff", boxShadow: focused ? "0 0 0 3px rgba(45,59,31,0.09)" : "none", transition: "border-color 0.2s, box-shadow 0.2s" }}>
            <textarea
                placeholder={placeholder} value={value} onChange={onChange} rows={3}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{ width: "100%", border: "none", outline: "none", fontSize: "0.93rem", color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif", resize: "vertical", minHeight: 90 }}
            />
        </div>
    );
};

const OptionCard = ({ icon: Icon, title, subtitle, selected, onClick, accentColor = "#d4a843" }) => (
    <motion.div
        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} onClick={onClick}
        style={{ border: `2px solid ${selected ? "#2d3b1f" : "#e0dbd2"}`, borderRadius: 14, padding: "15px 17px", cursor: "pointer", background: selected ? "#f4f8f0" : "#fff", display: "flex", alignItems: "center", gap: 13 }}
    >
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: selected ? "#2d3b1f" : "#f0ece4", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
            <Icon size={20} color={selected ? accentColor : "#2d3b1f80"} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.95rem" }}>{title}</p>
            <p style={{ fontSize: "0.77rem", color: "#2d3b1f80", marginTop: 2 }}>{subtitle}</p>
        </div>
        <AnimatePresence>
            {selected && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <Check size={18} color="#2d3b1f" strokeWidth={2.5} />
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const PrimaryBtn = ({ label, icon, onClick, disabled }) => (
    <motion.button onClick={onClick} disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.03, backgroundColor: "#1a2c10" }} whileTap={{ scale: disabled ? 1 : 0.97 }}
        style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 12, padding: "13px 26px", fontSize: "0.93rem", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(45,59,31,0.22)", opacity: disabled ? 0.7 : 1 }}>
        {label}{icon}
    </motion.button>
);

const SecondaryBtn = ({ label, icon, onClick }) => (
    <motion.button onClick={onClick}
        whileHover={{ scale: 1.03, backgroundColor: "#e4dfd6" }} whileTap={{ scale: 0.97 }}
        style={{ background: "#eee9e0", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px 26px", fontSize: "0.93rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans',sans-serif" }}>
        {icon}{label}
    </motion.button>
);

const GoldBtn = ({ label, icon, onClick, disabled }) => (
    <motion.button onClick={onClick} disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.03, backgroundColor: "#c49a35" }} whileTap={{ scale: disabled ? 1 : 0.97 }}
        style={{ background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 12, padding: "13px 26px", fontSize: "0.93rem", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(212,168,67,0.35)", opacity: disabled ? 0.7 : 1 }}>
        {icon}{label}
    </motion.button>
);

const ErrorBanner = ({ message }) => (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "#fff0f0", border: "1.5px solid #ffd0d0", borderRadius: 10, padding: "10px 14px", fontSize: "0.84rem", color: "#e84343", fontWeight: 600, marginBottom: 18 }}>
        {message}
    </motion.div>
);

export default function CreateGroup() {
    const [initLoading, setInitLoading] = useState(true);
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [dir,  setDir]  = useState("forward");
    const [done, setDone] = useState(false);

    const [name,        setName]        = useState("");
    const [description, setDescription] = useState("");
    const [members,     setMembers]     = useState("");
    const [isPublic,    setIsPublic]    = useState(false);
    const [amount,      setAmount]      = useState("");
    const [frequency,   setFrequency]   = useState("monthly");
    const [startDate,   setStartDate]   = useState("");

    const [loading,      setLoading]      = useState(false);
    const [errors,       setErrors]       = useState({});
    const [createdGroup, setCreatedGroup] = useState(null);
    const [copied,       setCopied]       = useState(false);

    usePageTitle("Create Group");

    const goNext = () => { setDir("forward"); setStep(s => s + 1); };
    const goBack = () => { setDir("back");    setStep(s => s - 1); };

    const totalPayout = amount && members
        ? `₦${(Number(amount) * Number(members)).toLocaleString()}`
        : "—";

    const validateStep0 = () => {
        const e = {};
        if (!name.trim())           e.name    = "Group name is required";
        if (!members)               e.members = "Number of members is required";
        if (Number(members) < 2)    e.members = "Minimum 2 members";
        if (Number(members) > 50)   e.members = "Maximum 50 members";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep1 = () => {
        const e = {};
        if (!amount)              e.amount    = "Contribution amount is required";
        if (Number(amount) <= 0)  e.amount    = "Amount must be greater than 0";
        if (!startDate)           e.startDate = "Start date is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext0 = () => { if (validateStep0()) goNext(); };
    const handleNext1 = () => { if (validateStep1()) goNext(); };

    // ── Submit ──────────────────────────────────────────────────────────────────
    const handleCreate = async () => {
        setLoading(true);
        setErrors({});
        try {
            const response = await AxiosInstance.post("api/groups/", {
                name:                name.trim(),
                description:         description.trim(),
                max_members:         Number(members),
                contribution_amount: Number(amount),
                frequency,
                start_date:          startDate,
                is_public:           isPublic,      
            });
            setCreatedGroup(response.data.group);
            setDone(true);
        } catch (error) {
            if (error.response?.data) {
                const d = error.response.data;

                const generalMsg = 
                    d.non_field_errors?.[0] ||
                    d.detail ||
                    d.error ||
                    null;

                setErrors({
                    name:      d.name?.[0],
                    members:   d.max_members?.[0],
                    amount:    d.contribution_amount?.[0],
                    startDate: d.start_date?.[0],
                    general:   generalMsg,
                });
            } else {
                setErrors({ general: "Something went wrong. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = () => {
        if (!createdGroup?.invite_code) return;
        navigator.clipboard.writeText(createdGroup.invite_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const slideVariants = {
        enter:  (d) => ({ opacity: 0, x: d === "forward" ? 48 : -48 }),
        center: { opacity: 1, x: 0 },
        exit:   (d) => ({ opacity: 0, x: d === "forward" ? -48 : 48 }),
    };

    return (
        <>
            <AnimatePresence>
                {initLoading && <CoinLoader key="loader" onDone={() => setInitLoading(false)} text="Setting up..." />}
            </AnimatePresence>

            {!initLoading && (
                <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", overflowX: "hidden" }}>
                    {floats.map((c, i) => <FloatingUser key={i} {...c} />)}

                    <div style={{ position: "fixed", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,59,31,0.04),transparent 70%)", top: "5%", left: "-12%", pointerEvents: "none", zIndex: 0 }} />
                    <div style={{ position: "fixed", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,168,67,0.06),transparent 70%)", bottom: "8%", right: "-8%", pointerEvents: "none", zIndex: 0 }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "clamp(32px,5vw,64px) clamp(16px,3vw,32px) 80px" }}>

                        <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            style={{ textAlign: "center", marginBottom: 36 }}>
                            <motion.div
                                animate={{ rotate: [0, 8, -8, 4, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 3 }}
                                style={{ width: 68, height: 68, background: "#2d3b1f", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 28px rgba(45,59,31,0.24)" }}>
                                <Users size={30} color="#d4a843" strokeWidth={1.8} />
                            </motion.div>
                            <h1 style={{ fontSize: "clamp(1.9rem,5vw,3rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 10 }}>
                                Create Your Ajo Group
                            </h1>
                            <p style={{ fontSize: "0.97rem", color: "#2d3b1f80" }}>Start a savings circle with your trusted community</p>
                        </motion.div>

                        {!done && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                                <StepBar current={step} />
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            style={{ background: "#fff", borderRadius: 24, padding: "clamp(24px,4vw,44px)", boxShadow: "0 4px 40px rgba(0,0,0,0.07)", border: "1.5px solid #f0ece4", overflow: "hidden" }}>

                            {errors.general && <ErrorBanner message={errors.general} />}

                            <AnimatePresence mode="wait" custom={dir}>

                                {done ? (
                                    <motion.div key="done"
                                        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ textAlign: "center", padding: "20px 0" }}>
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], rotate: [0, 6, -6, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
                                            style={{ width: 80, height: 80, background: "#2d3b1f", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 8px 28px rgba(45,59,31,0.28)" }}>
                                            <CheckCircle size={40} color="#d4a843" strokeWidth={1.8} />
                                        </motion.div>

                                        <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 10 }}>
                                            Group Created! 🎉
                                        </h2>
                                        <p style={{ fontSize: "0.95rem", color: "#2d3b1f80", marginBottom: 28, lineHeight: 1.7 }}>
                                            <strong style={{ color: "#2d3b1f" }}>{createdGroup?.name}</strong> is live.{" "}
                                            {isPublic
                                                ? "It's public — people can discover and request to join."
                                                : "Share the invite code with people you want to join."}
                                        </p>

                                        {createdGroup?.invite_code && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                                style={{ background: "#f5f8f2", border: "1.5px solid #d8ecd4", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
                                                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2d3b1f70", letterSpacing: "0.1em", marginBottom: 6 }}>INVITE CODE</p>
                                                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2d3b1f", fontFamily: "monospace", marginBottom: 12, wordBreak: "break-all" }}>
                                                    {createdGroup.invite_code}
                                                </p>
                                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCopyCode}
                                                    style={{ background: copied ? "#2d3b1f" : "#eee9e0", color: copied ? "#d4a843" : "#2d3b1f", border: "none", borderRadius: 9, padding: "9px 18px", fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, transition: "background 0.2s" }}>
                                                    {copied ? <><Check size={14} strokeWidth={2.5} />Copied!</> : <><Copy size={14} strokeWidth={2} />Copy Code</>}
                                                </motion.button>
                                            </motion.div>
                                        )}

                                        <div style={{ background: "linear-gradient(135deg,#f5f8f2,#eef5ee)", border: "1.5px solid #d8ecd4", borderRadius: 18, padding: "20px 22px", marginBottom: 28, textAlign: "left" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                                <ClipboardList size={15} color="#d4a843" strokeWidth={2} />
                                                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#2d3b1f" }}>Group Summary</span>
                                            </div>
                                            {[
                                                ["Group Name",    createdGroup?.name || "—",                                                                               false],
                                                ["Visibility",    createdGroup?.is_public ? "Public" : "Private",                                                          false],
                                                ["Max Members",   createdGroup?.max_members || "—",                                                                        false],
                                                ["Contribution",  createdGroup ? `₦${Number(createdGroup.contribution_amount).toLocaleString()} / ${createdGroup.frequency}` : "—", false],
                                                ["Total Payout",  createdGroup ? `₦${Number(createdGroup.total_pool).toLocaleString()}` : "—",                             true ],
                                                ["Start Date",    createdGroup?.start_date || "—",                                                                         false],
                                            ].map(([k, v, gold], i) => (
                                                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 6 ? "1px solid rgba(45,59,31,0.07)" : "none" }}>
                                                    <span style={{ fontSize: "0.84rem", color: "#2d3b1f70" }}>{k}:</span>
                                                    <span style={{ fontSize: "0.84rem", fontWeight: 700, color: gold ? "#d4a843" : "#2d3b1f" }}>{v}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <PrimaryBtn
                                            label="Go to Group"
                                            icon={<ArrowRight size={17} strokeWidth={2.5} />}
                                            onClick={() => navigate(`/groups/${createdGroup?.id}`)}  
                                        />
                                    </motion.div>

                                ) : step === 0 ? (
                                    <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
                                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                                            <Field label="Group Name" required>
                                                <TInput
                                                    value={name}
                                                    onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: null })); }}
                                                    placeholder="e.g. Lagos Hustlers Circle"
                                                />
                                                {errors.name && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4 }}>{errors.name}</p>}
                                            </Field>

                                            <Field label="Description">
                                                <TArea
                                                    value={description}
                                                    onChange={e => setDescription(e.target.value)}
                                                    placeholder="Tell members what this group is about..."
                                                />
                                            </Field>

                                            <Field label="Total Members" required hint="Minimum 2 members, maximum 50 members">
                                                <TInput
                                                    type="number"
                                                    value={members}
                                                    onChange={e => { setMembers(e.target.value); setErrors(v => ({ ...v, members: null })); }}
                                                    placeholder="e.g. 10"
                                                />
                                                {errors.members && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4 }}>{errors.members}</p>}
                                            </Field>

                                            <Field
                                                label="Group Visibility"
                                                required
                                                hint={isPublic
                                                    ? "Anyone can find and request to join. You approve or reject each request."
                                                    : "Hidden from discovery. Only people with your invite code can join directly."}
                                            >
                                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                                    <div style={{ flex: "1 1 180px" }}>
                                                        <OptionCard
                                                            icon={Globe}
                                                            title="Public"
                                                            subtitle="Listed & open to requests"
                                                            selected={isPublic === true}
                                                            onClick={() => setIsPublic(true)}
                                                        />
                                                    </div>
                                                    <div style={{ flex: "1 1 180px" }}>
                                                        <OptionCard
                                                            icon={Lock}
                                                            title="Private"
                                                            subtitle="Invite code only"
                                                            selected={isPublic === false}
                                                            onClick={() => setIsPublic(false)}
                                                        />
                                                    </div>
                                                </div>
                                            </Field>

                                            <motion.div
                                                key={isPublic ? "pub" : "priv"}
                                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                                                style={{ background: isPublic ? "#f0fff4" : "#fafafa", border: `1.5px solid ${isPublic ? "#b2dfcc" : "#e8e2d8"}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                                                {isPublic
                                                    ? <Globe size={15} color="#1a7a3a" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
                                                    : <Lock   size={15} color="#2d3b1f80" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
                                                }
                                                <p style={{ fontSize: "0.79rem", color: isPublic ? "#1a7a3a" : "#2d3b1f80", lineHeight: 1.55 }}>
                                                    {isPublic
                                                        ? <><strong>Public group:</strong> Appears in the "Available" tab. New members send a request — you decide who gets in. Invite links still work for direct joins.</>
                                                        : <><strong>Private group:</strong> Not listed anywhere. New members must have your invite code. No requests — invite-only access.</>
                                                    }
                                                </p>
                                            </motion.div>

                                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                                                <PrimaryBtn label="Next" icon={<ArrowRight size={17} strokeWidth={2.5} />} onClick={handleNext0} />
                                            </div>
                                        </div>
                                    </motion.div>

                                ) : step === 1 ? (
                                    <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
                                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                                            <Field label="Contribution Amount (₦)" required hint="Amount each member contributes per cycle">
                                                <TInput
                                                    type="number"
                                                    value={amount}
                                                    onChange={e => { setAmount(e.target.value); setErrors(v => ({ ...v, amount: null })); }}
                                                    placeholder="e.g. 50000"
                                                />
                                                {errors.amount && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4 }}>{errors.amount}</p>}
                                            </Field>

                                            <Field label="Contribution Frequency" required>
                                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                                    <div style={{ flex: "1 1 180px" }}>
                                                        <OptionCard icon={Coins} title="Weekly" subtitle="Contributions every week" selected={frequency === "weekly"} onClick={() => setFrequency("weekly")} />
                                                    </div>
                                                    <div style={{ flex: "1 1 180px" }}>
                                                        <OptionCard icon={Calendar} title="Monthly" subtitle="Contributions every month" selected={frequency === "monthly"} onClick={() => setFrequency("monthly")} />
                                                    </div>
                                                </div>
                                            </Field>

                                            <Field label="Start Date" required>
                                                <div style={{ border: "1.5px solid #e0dbd2", borderRadius: 12, padding: "13px 15px", background: "#fff" }}>
                                                    <input
                                                        type="date" value={startDate}
                                                        onChange={e => { setStartDate(e.target.value); setErrors(v => ({ ...v, startDate: null })); }}
                                                        style={{ width: "100%", border: "none", outline: "none", fontSize: "0.93rem", color: startDate ? "#2d3b1f" : "#b8c0b0", background: "transparent", fontFamily: "'DM Sans',sans-serif" }}
                                                    />
                                                </div>
                                                {errors.startDate && <p style={{ color: "#e84343", fontSize: "0.78rem", marginTop: 4 }}>{errors.startDate}</p>}
                                            </Field>

                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, flexWrap: "wrap", gap: 10 }}>
                                                <SecondaryBtn label="Back" icon={<ArrowLeft size={17} strokeWidth={2.5} />} onClick={goBack} />
                                                <PrimaryBtn   label="Next" icon={<ArrowRight size={17} strokeWidth={2.5} />} onClick={handleNext1} />
                                            </div>
                                        </div>
                                    </motion.div>

                                ) : (
                                    <motion.div key="step3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
                                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                                            <Field label="Payout Order" required>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                    <OptionCard
                                                        icon={ListOrdered}
                                                        title="Sequential"
                                                        subtitle="Members receive payouts in join order"
                                                        selected={true}
                                                        onClick={() => setPayoutOrder("sequential")}
                                                    />
                                                    <div style={{ background: "#f8f6f0", border: "1.5px solid #f0ece4", borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, opacity: 0.6 }}>
                                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0ece4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                            <Shuffle size={20} color="#2d3b1f50" strokeWidth={1.8} />
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: 700, color: "#2d3b1f80", fontSize: "0.95rem" }}>Random</p>
                                                            <p style={{ fontSize: "0.77rem", color: "#2d3b1f50" }}>Coming soon</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ background: "#f8f6f0", border: "1.5px solid #f0ece4", borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, opacity: 0.6 }}>
                                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0ece4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                            <Gavel size={20} color="#2d3b1f50" strokeWidth={1.8} />
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: 700, color: "#2d3b1f80", fontSize: "0.95rem" }}>Bidding</p>
                                                            <p style={{ fontSize: "0.77rem", color: "#2d3b1f50" }}>Coming soon</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Field>

                                            {(() => {
                                                const user = JSON.parse(localStorage.getItem("user") || "{}")
                                                if (!user.bvn_verified) {
                                                    return (
                                                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                                            style={{ background: "#fffbe8", border: "1.5px solid #f5e090", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 9 }}>
                                                            <AlertTriangle size={15} color="#d4a843" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
                                                            <div>
                                                                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#8a6a00", marginBottom: 3 }}>BVN Not Verified</p>
                                                                <p style={{ fontSize: "0.77rem", color: "#8a6a00", lineHeight: 1.55 }}>
                                                                    You need to verify your BVN before creating a group.{" "}
                                                                    <Link to="/verify-bvn" style={{ color: "#d4a843", fontWeight: 700 }}>Verify now →</Link>
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                }
                                                if (isPublic && user.credit_score < 60) {
                                                    return (
                                                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                                            style={{ background: "#fff5f5", border: "1.5px solid #ffd0d0", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 9 }}>
                                                            <AlertTriangle size={15} color="#e84343" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
                                                            <p style={{ fontSize: "0.8rem", color: "#e84343", lineHeight: 1.55 }}>
                                                                <strong>Credit score too low for public groups.</strong> Your score is {user.credit_score}. Need 60+ to create a public group. Switch to Private or improve your credit score.
                                                            </p>
                                                        </motion.div>
                                                    );
                                                }
                                                return null;
                                            })()}

                                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                                style={{ background: "linear-gradient(135deg,#f5f8f2,#eef5ee)", border: "1.5px solid #d8ecd4", borderRadius: 16, padding: "18px 20px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                                    <ClipboardList size={15} color="#d4a843" strokeWidth={2} />
                                                    <span style={{ fontWeight: 800, color: "#2d3b1f", fontSize: "0.95rem" }}>Group Summary</span>
                                                </div>
                                                {[
                                                    ["Group Name",    name    || "—",                                                          false],
                                                    ["Visibility",    isPublic ? "Public" : "Private",                                         false],
                                                    ["Members",       members || "—",                                                          false],
                                                    ["Contribution",  amount ? `₦${Number(amount).toLocaleString()} / ${frequency}` : "—",    false],
                                                    ["Total Payout",  totalPayout,                                                             true ],
                                                ].map(([k, v, gold], i) => (
                                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(45,59,31,0.07)" : "none" }}>
                                                        <span style={{ fontSize: "0.84rem", color: "#2d3b1f70" }}>{k}:</span>
                                                        <span style={{ fontSize: "0.84rem", fontWeight: 700, color: gold ? "#d4a843" : "#2d3b1f", display: "flex", alignItems: "center", gap: 5 }}>
                                                            {k === "Visibility" && (
                                                                isPublic
                                                                    ? <Globe size={11} color="#1a7a3a" strokeWidth={2.5} />
                                                                    : <Lock  size={11} color="#2d3b1f80" strokeWidth={2.5} />
                                                            )}
                                                            {v}
                                                        </span>
                                                    </div>
                                                ))}
                                            </motion.div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, flexWrap: "wrap", gap: 10 }}>
                                                <SecondaryBtn label="Back" icon={<ArrowLeft size={17} strokeWidth={2.5} />} onClick={goBack} />
                                                <GoldBtn
                                                    label={loading ? "Creating..." : "Create Group"}
                                                    icon={loading ? null : <Check size={17} strokeWidth={2.5} />}
                                                    onClick={handleCreate}
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {!done && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ textAlign: "center", marginTop: 20 }}>
                                <Link to="/groups" style={{ fontSize: "0.84rem", color: "#2d3b1f80", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                    <ChevronLeft size={14} />Back to Groups
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}