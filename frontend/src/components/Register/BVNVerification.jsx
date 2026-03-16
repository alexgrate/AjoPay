import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Fingerprint, ShieldCheck, AlertTriangle,
    ChevronRight, CheckCircle, XCircle, Coins,
} from "lucide-react";
import AxiosInstance from "../AxiosInstance";

// ── Floating coins ─────────────────────────────────────────────────────────────
const COINS = [
    { x: "4%",  d: 0,   dr: 5.2, s: 16 },
    { x: "15%", d: 1.8, dr: 4.6, s: 12 },
    { x: "28%", d: 0.6, dr: 5.8, s: 14 },
    { x: "72%", d: 2.2, dr: 4.3, s: 10 },
    { x: "85%", d: 0.9, dr: 5.0, s: 15 },
    { x: "93%", d: 1.5, dr: 4.8, s: 11 },
];
const FloatCoin = ({ x, d, dr, s }) => (
    <motion.div
        style={{ position: "fixed", left: x, bottom: -50, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1200], opacity: [0, 0.12, 0.12, 0] }}
        transition={{ duration: dr, delay: d, repeat: Infinity, ease: "linear", times: [0, 0.07, 0.9, 1] }}>
        <Coins size={s} color="#d4a843" strokeWidth={1.2} />
    </motion.div>
);

// ── Credit score ring ──────────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
    const radius      = 54;
    const circumference = 2 * Math.PI * radius;
    const pct         = Math.min(100, Math.max(0, score)) / 100;
    const dash        = circumference * pct;

    const color =
        score >= 80 ? "#1db893" :
        score >= 60 ? "#d4a843" :
        score >= 40 ? "#e8863a" : "#e84343";

    const label =
        score >= 80 ? "Excellent" :
        score >= 60 ? "Good"      :
        score >= 40 ? "Fair"      : "Poor";

    return (
        <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#f0ece4" strokeWidth="10" />
                <motion.circle
                    cx="70" cy="70" r={radius}
                    fill="none" stroke={color} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - dash }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <motion.p
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    style={{ fontSize: "2rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", lineHeight: 1 }}>
                    {score}
                </motion.p>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color, marginTop: 2 }}>{label}</p>
            </div>
        </div>
    );
};

// ── Access level card ──────────────────────────────────────────────────────────
const AccessRow = ({ label, allowed }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f4f0ea" }}>
        <span style={{ fontSize: "0.84rem", color: "#2d3b1f80" }}>{label}</span>
        {allowed
            ? <CheckCircle size={16} color="#1db893" strokeWidth={2.5} />
            : <XCircle    size={16} color="#e84343"  strokeWidth={2.5} />
        }
    </div>
);

// ── BVN input ──────────────────────────────────────────────────────────────────
const BVNInput = ({ value, onChange, disabled }) => {
    const [focused, setFocused] = useState(false);
    return (
        <motion.div
            animate={{ borderColor: focused ? "#d4a843" : "#e8e2d8", boxShadow: focused ? "0 0 0 3px rgba(212,168,67,0.12)" : "none" }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e8e2d8", borderRadius: 14, padding: "14px 16px", background: "#fff" }}>
            <Fingerprint size={20} color={focused ? "#d4a843" : "#b0b8a8"} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            <input
                type="text"
                inputMode="numeric"
                maxLength={11}
                placeholder="Enter your 11-digit BVN"
                value={value}
                onChange={onChange}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{ flex: 1, border: "none", outline: "none", fontSize: "1.1rem", letterSpacing: "0.15em", fontWeight: 700, color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif" }}
            />
            {value.length > 0 && (
                <span style={{ fontSize: "0.75rem", color: value.length === 11 ? "#1db893" : "#2d3b1f50", fontWeight: 700, flexShrink: 0 }}>
                    {value.length}/11
                </span>
            )}
        </motion.div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const BVNVerification = () => {
    const navigate = useNavigate();

    const [bvn,       setBvn]       = useState("");
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState("");
    const [result,    setResult]    = useState(null); // { credit_score, risk_level, access_level }
    const [step,      setStep]      = useState("input"); // "input" | "verifying" | "result"

    const handleVerify = async () => {
        if (bvn.length !== 11) return setError("BVN must be exactly 11 digits");
        if (!/^\d+$/.test(bvn)) return setError("BVN must contain only numbers");

        setLoading(true);
        setError("");
        setStep("verifying");

        try {
            const res = await AxiosInstance.post("api/accounts/verify-bvn/", { bvn });

            // Update user in localStorage with new data
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            const updated = { ...stored, ...res.data.user };
            localStorage.setItem("user", JSON.stringify(updated));

            setResult(res.data);
            setStep("result");
        } catch (err) {
            const msg = err.response?.data?.error || "Verification failed. Please try again.";
            setError(msg);
            setStep("input");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => navigate("/dashboard");
    const handleSkip     = () => navigate("/dashboard");

    const accessLevel = result?.access_level;
    const score       = result?.credit_score;
    const riskColor   =
        score >= 80 ? "#1db893" :
        score >= 60 ? "#d4a843" :
        score >= 40 ? "#e8863a" : "#e84343";

    return (
        <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", overflow: "hidden" }}>

            {COINS.map((c, i) => <FloatCoin key={i} {...c} />)}

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: "#fff", borderRadius: 28, padding: "44px 36px 36px", width: "100%", maxWidth: 460, position: "relative", zIndex: 1, boxShadow: "0 8px 60px rgba(0,0,0,0.10)" }}>

                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 28 }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#d4a843,#2d3b1f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Coins size={20} color="#fff" strokeWidth={1.8} />
                    </motion.div>
                    <span style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                        <span style={{ color: "#2d3b1f" }}>Ajo</span><span style={{ color: "#d4a843" }}>Flow</span>
                    </span>
                </div>

                <AnimatePresence mode="wait">

                    {/* ── INPUT STEP ─────────────────────────────────────── */}
                    {step === "input" && (
                        <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>

                            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0faf6", border: "2px solid #d4f0e8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                                <Fingerprint size={26} color="#1db893" strokeWidth={1.8} />
                            </div>

                            <h1 style={{ textAlign: "center", fontSize: "1.7rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 8 }}>
                                Verify Your BVN
                            </h1>
                            <p style={{ textAlign: "center", fontSize: "0.88rem", color: "#2d3b1f80", lineHeight: 1.7, marginBottom: 24 }}>
                                Your BVN is used to verify your identity and determine your group access level. It is never shared with other members.
                            </p>

                            {/* Info box */}
                            <div style={{ background: "#fffbe8", border: "1.5px solid #f5e090", borderRadius: 13, padding: "12px 14px", marginBottom: 22, display: "flex", gap: 10 }}>
                                <AlertTriangle size={16} color="#d4a843" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                                <p style={{ fontSize: "0.8rem", color: "#8a6a00", lineHeight: 1.6 }}>
                                    Your BVN is an 11-digit number. Dial <strong>*565*0#</strong> on your registered phone to retrieve it.
                                </p>
                            </div>

                            <BVNInput
                                value={bvn}
                                onChange={e => { setBvn(e.target.value.replace(/\D/g, "").slice(0, 11)); setError(""); }}
                                disabled={loading}
                            />

                            {error && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ color: "#e84343", fontSize: "0.8rem", fontWeight: 600, marginTop: 8, marginLeft: 4 }}>
                                    {error}
                                </motion.p>
                            )}

                            <motion.button
                                whileHover={{ scale: bvn.length === 11 ? 1.02 : 1, backgroundColor: bvn.length === 11 ? "#c49a35" : undefined }}
                                whileTap={{ scale: bvn.length === 11 ? 0.97 : 1 }}
                                onClick={handleVerify}
                                disabled={bvn.length !== 11 || loading}
                                style={{ width: "100%", background: bvn.length === 11 ? "#d4a843" : "#e8e2d8", color: bvn.length === 11 ? "#2d3b1f" : "#2d3b1f50", border: "none", borderRadius: 13, padding: "15px", fontSize: "0.97rem", fontWeight: 700, cursor: bvn.length === 11 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, boxShadow: bvn.length === 11 ? "0 4px 20px rgba(212,168,67,0.35)" : "none", transition: "background 0.2s, box-shadow 0.2s", fontFamily: "'DM Sans',sans-serif" }}>
                                <ShieldCheck size={18} strokeWidth={2} />
                                Verify BVN
                            </motion.button>

                            <motion.button
                                whileHover={{ color: "#c49a35" }}
                                onClick={handleSkip}
                                style={{ width: "100%", background: "none", border: "none", color: "#2d3b1f60", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", marginTop: 12, fontFamily: "'DM Sans',sans-serif" }}>
                                Skip for now — verify later from profile
                            </motion.button>
                        </motion.div>
                    )}

                    {/* ── VERIFYING STEP ─────────────────────────────────── */}
                    {step === "verifying" && (
                        <motion.div key="verifying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                            style={{ textAlign: "center", padding: "20px 0" }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid #f0ece4", borderTopColor: "#d4a843", margin: "0 auto 24px" }}
                            />
                            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 8 }}>
                                Verifying BVN
                            </h2>
                            <p style={{ fontSize: "0.88rem", color: "#2d3b1f80", lineHeight: 1.7 }}>
                                Checking your identity and pulling your credit profile...
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24, textAlign: "left" }}>
                                {["Validating BVN format", "Confirming identity", "Fetching credit profile", "Calculating access level"].map((s, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.35 }}
                                        style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", background: "#f8f6f0", borderRadius: 9 }}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                                            style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #e0dbd2", borderTopColor: "#d4a843", flexShrink: 0 }}
                                        />
                                        <span style={{ fontSize: "0.82rem", color: "#2d3b1f80" }}>{s}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── RESULT STEP ────────────────────────────────────── */}
                    {step === "result" && result && (
                        <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>

                            <div style={{ textAlign: "center", marginBottom: 20 }}>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0faf6", border: "1.5px solid #c8ede0", borderRadius: 99, padding: "5px 14px", marginBottom: 14 }}>
                                    <CheckCircle size={14} color="#1db893" strokeWidth={2.5} />
                                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1db893" }}>BVN Verified Successfully</span>
                                </motion.div>

                                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 6 }}>
                                    Your Credit Score
                                </h2>
                                <p style={{ fontSize: "0.84rem", color: "#2d3b1f80", marginBottom: 20 }}>
                                    Based on your BVN credit history
                                </p>

                                <ScoreRing score={score} />

                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${riskColor}18`, borderRadius: 99, padding: "5px 14px", marginTop: 12 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: riskColor }} />
                                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: riskColor, textTransform: "capitalize" }}>
                                        {result.risk_level} Credit Risk
                                    </span>
                                </motion.div>
                            </div>

                            {/* Access level */}
                            {accessLevel && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                                    style={{ background: "#f8f6f0", borderRadius: 14, padding: "16px", marginBottom: 18 }}>
                                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2d3b1f80", letterSpacing: "0.1em", marginBottom: 10 }}>
                                        ACCESS LEVEL — {accessLevel.label?.toUpperCase()}
                                    </p>
                                    <AccessRow label="Join Public Groups"   allowed={accessLevel.can_join_public} />
                                    <AccessRow label="Join Private Groups"  allowed={accessLevel.can_join_private} />
                                    <AccessRow label="Create Public Groups" allowed={accessLevel.can_create_public} />
                                    <div style={{ paddingTop: 9 }}>
                                        <AccessRow label="Create Private Groups" allowed={accessLevel.can_create_private} />
                                    </div>
                                    <p style={{ fontSize: "0.78rem", color: "#2d3b1f80", marginTop: 10, lineHeight: 1.6, fontStyle: "italic" }}>
                                        {accessLevel.description}
                                    </p>
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#c49a35" }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleContinue}
                                style={{ width: "100%", background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 13, padding: "15px", fontSize: "0.97rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(212,168,67,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
                                Continue to Dashboard
                                <ChevronRight size={18} strokeWidth={2.5} />
                            </motion.button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default BVNVerification;