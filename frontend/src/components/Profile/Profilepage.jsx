import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    User, Edit2, X, Check, AlertTriangle, ChevronRight,
    Users, MapPin, Mail, Phone, Building2, CreditCard,
    Coins, Star, Zap, LogOut, Eye, EyeOff, Fingerprint,
    CheckCircle, CircleDollarSign, PartyPopper, Lock,
    RefreshCw, ShieldAlert,
} from "lucide-react";
import AxiosInstance from "../AxiosInstance";
import { useLogout } from "../../hooks/useLogout";
import usePageTitle from "../../hooks/usePageTitle";
import CoinLoader from "../CoinLoader";

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0] || "?")[0].toUpperCase();
};

const fmtDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

const flattenErrors = (errData) => {
    if (!errData) return "Something went wrong. Please try again.";
    if (typeof errData === "string") return errData;
    return Object.values(errData).flat().join(" ");
};

const FLOATS = [
    { x: "3%",  s: 18, d: 0,   dr: 5.2 },
    { x: "13%", s: 13, d: 1.9, dr: 4.6 },
    { x: "28%", s: 16, d: 0.7, dr: 5.8 },
    { x: "55%", s: 12, d: 2.4, dr: 4.4 },
    { x: "70%", s: 17, d: 0.5, dr: 5.0 },
    { x: "83%", s: 14, d: 1.3, dr: 4.8 },
    { x: "93%", s: 20, d: 2.9, dr: 5.4 },
];
const FloatCoin = ({ x, s, d, dr }) => (
    <motion.div style={{ position: "fixed", left: x, bottom: -60, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -1300], opacity: [0, 0.10, 0.10, 0] }}
        transition={{ duration: dr, delay: d, repeat: Infinity, ease: "linear", times: [0, 0.07, 0.9, 1] }}>
        <Coins size={s} color="#d4a843" strokeWidth={1.1} />
    </motion.div>
);

const Toast = ({ msg, show, isError }) => (
    <AnimatePresence>
        {show && (
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}
                style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: isError ? "#e84343" : "#1db893", color: "#fff", borderRadius: 14, padding: "11px 20px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: "0.88rem", boxShadow: `0 8px 28px ${isError ? "rgba(232,67,67,0.35)" : "rgba(29,184,147,0.35)"}`, whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)" }}>
                {isError ? <AlertTriangle size={16} strokeWidth={2.5} /> : <CheckCircle size={16} strokeWidth={2.5} />}
                {msg}
            </motion.div>
        )}
    </AnimatePresence>
);

const Toggle = ({ on, onChange }) => (
    <motion.div onClick={onChange} whileTap={{ scale: 0.92 }}
        style={{ width: 50, height: 27, borderRadius: 99, background: on ? "#2d3b1f" : "#d0ccc4", cursor: "pointer", position: "relative", flexShrink: 0 }}>
        <motion.div animate={{ x: on ? 25 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ position: "absolute", top: 2, width: 23, height: 23, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.22)" }} />
    </motion.div>
);

const ProfileField = ({ icon: Icon, label, value, editing, onChange, type = "text", readOnly = false }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Icon size={13} color="#7c5cbf" strokeWidth={2} />
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2d3b1f80" }}>{label}</span>
                {readOnly && <span style={{ fontSize: "0.68rem", color: "#2d3b1f50", background: "#f0ece4", borderRadius: 99, padding: "1px 7px", fontWeight: 600 }}>read-only</span>}
            </div>
            {editing && !readOnly ? (
                <div style={{ border: `1.5px solid ${focused ? "#2d3b1f" : "#e0dbd2"}`, borderRadius: 12, padding: "11px 13px", background: "#fff", boxShadow: focused ? "0 0 0 3px rgba(45,59,31,0.09)" : "none", transition: "border-color .2s, box-shadow .2s" }}>
                    <input type={type} value={value} onChange={onChange}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        style={{ width: "100%", border: "none", outline: "none", fontSize: "0.92rem", color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif" }} />
                </div>
            ) : (
                <div style={{ border: "1.5px solid #e8e2d8", borderRadius: 12, padding: "11px 13px", background: readOnly ? "#f8f6f0" : "#fff", fontSize: "0.92rem", color: readOnly ? "#2d3b1f80" : "#2d3b1f" }}>
                    {value || <span style={{ color: "#b8c0b0" }}>—</span>}
                </div>
            )}
        </div>
    );
};

const PwField = ({ label, value, onChange, showPw, onToggleShow, showToggle }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <p style={{ fontSize: "0.77rem", fontWeight: 600, color: "#2d3b1f80", marginBottom: 5 }}>{label}</p>
            <div style={{ border: `1.5px solid ${focused ? "#2d3b1f" : "#e0dbd2"}`, borderRadius: 10, padding: "9px 12px", background: "#fff", display: "flex", alignItems: "center", gap: 7, transition: "border-color .2s, box-shadow .2s", boxShadow: focused ? "0 0 0 3px rgba(45,59,31,0.09)" : "none" }}>
                <input type={showPw ? "text" : "password"} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ flex: 1, border: "none", outline: "none", fontSize: "0.9rem", color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif" }} />
                {showToggle && (
                    <motion.span whileTap={{ scale: 0.9 }} onClick={onToggleShow} style={{ cursor: "pointer", color: "#2d3b1f80", display: "flex" }}>
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </motion.span>
                )}
            </div>
        </div>
    );
};

const SecCard = ({ bg, icon, title, sub, action }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
        style={{ background: bg || "#fff", border: "1.5px solid #f0ece4", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 100 }}>
            <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.92rem" }}>{title}</p>
            <p style={{ fontSize: "0.76rem", color: "#2d3b1f70", marginTop: 2 }}>{sub}</p>
        </div>
        {action}
    </motion.div>
);

const NotifRow = ({ icon, title, sub, on, onToggle }) => (
    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: "#fff", border: "1.5px solid #f0ece4", borderRadius: 14 }}>
        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.9rem" }}>{title}</p>
            <p style={{ fontSize: "0.74rem", color: "#2d3b1f70", marginTop: 2 }}>{sub}</p>
        </div>
        <Toggle on={on} onChange={onToggle} />
    </motion.div>
);

const AchievBadge = ({ icon, title, sub, gold }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        style={{ border: `1.5px solid ${gold ? "#d4a843" : "#e8e2d8"}`, background: gold ? "#fffbe8" : "#fff", borderRadius: 13, padding: "13px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "1.3rem" }}>{icon}</span>
        <div>
            <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.88rem" }}>{title}</p>
            <p style={{ fontSize: "0.74rem", color: "#2d3b1f70", marginTop: 2 }}>{sub}</p>
        </div>
    </motion.div>
);

const StatCard = ({ value, label, icon, bg, textColor, delay }) => (
    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.03, y: -3 }}
        style={{ flex: "1 1 140px", background: bg, borderRadius: 18, padding: "18px 16px", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
        <div style={{ position: "absolute", right: -6, bottom: -6, opacity: 0.12 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                {icon}
            </motion.div>
        </div>
        <p style={{ fontSize: "clamp(1.2rem,2.8vw,1.9rem)", fontWeight: 900, color: textColor || "#fff", fontFamily: "'Fraunces',serif", lineHeight: 1, marginBottom: 5 }}>{value}</p>
        <p style={{ fontSize: "0.78rem", color: textColor ? `${textColor}aa` : "rgba(255,255,255,0.8)", fontWeight: 500 }}>{label}</p>
    </motion.div>
);

const QA = ({ icon, label, onClick }) => (
    <motion.button onClick={onClick} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
        style={{ width: "100%", background: "rgba(255,255,255,0.10)", border: "none", borderRadius: 12, padding: "12px 13px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", flex: 1, textAlign: "left" }}>{label}</span>
        <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
    </motion.button>
);

const DeleteModal = ({ onConfirm, onCancel, loading, error }) => {
    const [pw, setPw] = useState("");
    const [show, setShow] = useState(false);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
                style={{ background: "#fff", borderRadius: 22, padding: "32px 28px", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff5f5", border: "2px solid #ffd0d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <ShieldAlert size={24} color="#e84343" strokeWidth={1.8} />
                </div>
                <h2 style={{ textAlign: "center", fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "1.3rem", color: "#2d3b1f", marginBottom: 8 }}>Delete Account?</h2>
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#2d3b1f80", lineHeight: 1.65, marginBottom: 20 }}>
                    This will permanently delete your account, all group memberships, and transaction history. <strong style={{ color: "#e84343" }}>This cannot be undone.</strong>
                </p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2d3b1f80", marginBottom: 6 }}>Enter your password to confirm</p>
                <div style={{ border: "1.5px solid #e0dbd2", borderRadius: 10, padding: "10px 13px", background: "#f8f6f0", display: "flex", alignItems: "center", gap: 7, marginBottom: error ? 8 : 18 }}>
                    <input type={show ? "text" : "password"} placeholder="Your password" value={pw} onChange={e => setPw(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "0.9rem", background: "transparent", fontFamily: "'DM Sans',sans-serif", color: "#2d3b1f" }} />
                    <motion.span whileTap={{ scale: 0.9 }} onClick={() => setShow(v => !v)} style={{ cursor: "pointer", color: "#2d3b1f60", display: "flex" }}>
                        {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </motion.span>
                </div>
                {error && <p style={{ fontSize: "0.8rem", color: "#e84343", fontWeight: 600, marginBottom: 14, textAlign: "center" }}>{error}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onCancel}
                        style={{ flex: 1, background: "#f0ece4", color: "#2d3b1f", border: "none", borderRadius: 11, padding: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        Cancel
                    </motion.button>
                    <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                        onClick={() => onConfirm(pw)} disabled={!pw || loading}
                        style={{ flex: 1, background: "#e84343", color: "#fff", border: "none", borderRadius: 11, padding: "12px", fontWeight: 700, cursor: (!pw || loading) ? "not-allowed" : "pointer", opacity: (!pw || loading) ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "'DM Sans',sans-serif" }}>
                        {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff" }} />
                        ) : "Delete Forever"}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const BankSelector = ({ value, onChange }) => {
    const [banks,   setBanks]   = useState([]);
    const [search,  setSearch]  = useState(value || "");
    const [open,    setOpen]    = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBanks = async () => {
            setLoading(true);
            try {
                const res = await AxiosInstance.get("api/payments/banks/");
                setBanks(res.data.banks || []);
            } catch {}
            finally { setLoading(false); }
        };
        fetchBanks();
    }, []);

    const filtered = banks.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ position: "relative" }}>
            <div style={{ border: "1.5px solid #e0dbd2", borderRadius: 12, padding: "11px 13px", background: "#fff", display: "flex", alignItems: "center", gap: 8 }}
                onClick={() => setOpen(v => !v)}>
                <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setOpen(true); }}
                    placeholder="Search bank..."
                    style={{ flex: 1, border: "none", outline: "none", fontSize: "0.92rem", color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}
                />
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={14} color="#2d3b1f60" style={{ transform: "rotate(90deg)" }} />
                </motion.span>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", borderRadius: 12, border: "1.5px solid #e0dbd2", boxShadow: "0 8px 28px rgba(0,0,0,0.12)", zIndex: 999, maxHeight: 220, overflowY: "auto" }}>
                        {loading ? (
                            <div style={{ padding: "16px", textAlign: "center", fontSize: "0.82rem", color: "#2d3b1f80" }}>Loading banks…</div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: "16px", textAlign: "center", fontSize: "0.82rem", color: "#2d3b1f80" }}>No bank found</div>
                        ) : filtered.map((bank, i) => (
                            <div key={i}
                                onClick={() => { onChange(bank.name, bank.code); setSearch(bank.name); setOpen(false); }}
                                style={{ padding: "11px 14px", fontSize: "0.88rem", color: "#2d3b1f", cursor: "pointer", borderBottom: i < filtered.length - 1 ? "1px solid #f4f0ea" : "none" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#f8f6f0"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                {bank.name}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};



export default function ProfilePage() {
    const navigate       = useNavigate();
    const { logout }     = useLogout();

    const [user,       setUser]       = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const [tab,         setTab]         = useState("personal");
    const [editing,     setEditing]     = useState(false);
    const [saving,      setSaving]      = useState(false);
    const [toast,       setToast]       = useState({ show: false, msg: "", isError: false });

    const [fullName,  setFullName]  = useState("");
    const [phone,     setPhone]     = useState("");
    const [location,  setLocation]  = useState("");
    const [bankName,  setBankName]  = useState("");
    const [accNumber, setAccNumber] = useState("");
    const [accName,   setAccName]   = useState("");

    const [showPwForm,  setShowPwForm]  = useState(false);
    const [pwSaving,    setPwSaving]    = useState(false);
    const [showPw,      setShowPw]      = useState(false);
    const [currentPw,   setCurrentPw]   = useState("");
    const [newPw,       setNewPw]       = useState("");
    const [confirmPw,   setConfirmPw]   = useState("");
    const [pwErrors,    setPwErrors]    = useState({});

    const [showDelete,    setShowDelete]    = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError,   setDeleteError]   = useState("");

    const [loginAlerts, setLoginAlerts] = useState(true);
    const [twoFA,       setTwoFA]       = useState(false);

    const [bankCode,    setBankCode]    = useState("");
    const [accVerified, setAccVerified] = useState(false);
    const [resolving,   setResolving]   = useState(false);
    const [resolveError,setResolveError]= useState("");
    const [banks,       setBanks]       = useState([]);

    
    usePageTitle("Profile");


    const [notifs, setNotifs] = useState({
        paymentReminders: true, payoutAlerts: true, groupUpdates: true,
        txConfirm: true, marketing: false, sms: false,
    });
    const toggleNotif = useCallback((k) => setNotifs(n => ({ ...n, [k]: !n[k] })), []);

    const showToast = (msg, isError = false) => {
        setToast({ show: true, msg, isError });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
    };

    const populateFields = (u) => {
        setFullName(`${u.first_name} ${u.last_name}`.trim());
        setPhone(u.phone || "");
        setLocation(u.location || "");
        setBankName(u.bank_name || "");
        setAccNumber(u.account_number || "");
        setAccName(u.account_name || "");
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await AxiosInstance.get("api/accounts/profile/");
                setUser(res.data);
                populateFields(res.data);
            } catch {
                showToast("Failed to load profile", true);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    const [stats, setStats] = useState({
        groupsJoined: 0,
        totalSaved: 0,
        payoutsRecieved: 0,
        contributionsThisMonth: 0,
        groupsActive: 0,
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [groupRes] = await Promise.all([
                    AxiosInstance.get("api/groups/"),
                ])

                const groups = groupRes.data
                const activeGroups = groups.filter(g => g.status === "active")

                let totalSaved = 0
                let payoutsRecieved = 0
                let contribsThisMonth = 0

                const now = new Date()
                const thisMonth = now.getMonth()
                const thisYear = now.getFullYear()

                await Promise.all(groups.map(async (g) => {
                    try {
                        const res = await AxiosInstance.get(`api/groups/${g.id}/my-contributions/`);
                        const contribs = res.data.contributions || []

                        contribs.forEach(c => {
                            if (c.status === "paid") {
                                totalSaved += Number(c.amount || 0)
                                const paidDate = new Date(c.paid_at)
                                if (paidDate.getMonth() === thisMonth && paidDate.getFullYear() === thisYear) {
                                    contribsThisMonth += 1
                                }
                            }
                        })
                    } catch {}

                    try {
                        const cyclesRes = await AxiosInstance.get(`api/groups/${g.id}/cycles/`);
                        const cycles = cyclesRes.data || [];
                        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                        cycles.forEach(c => {
                            if (c.status === "paid_out" && c.recipient_name === currentUser.full_name) {
                                payoutsReceived += 1;
                            }
                        });
                    } catch {}
                }))

                setStats({
                    groupsJoined: groups.length,
                    totalSaved,
                    payoutsReceived,
                    contributionsThisMonth: contribsThisMonth,
                    groupsActive: activeGroups.length,
                })
            } catch {}
        }
        fetchStats()
    }, [])

    const resolveAccount = async (accountNumber, bankCode) => {
        setResolving(true);
        setResolveError("");
        try {
            const res = await AxiosInstance.get("api/payments/resolve-account/", {
                params: { account_number: accountNumber, bank_code: bankCode }
            });
            setAccName(res.data.account_name);
            setAccVerified(true);
        } catch (err) {
            setResolveError("Account not found. Check number and bank.");
            setAccVerified(false);
            setAccName("");
        } finally {
            setResolving(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await AxiosInstance.patch("api/accounts/profile/", {
                full_name:      fullName,
                phone,
                location,
                bank_name:      bankName,
                account_number: accNumber,
                account_name:   accName,
            });
            setUser(res.data);
            populateFields(res.data);
            setEditing(false);
            showToast("Profile updated successfully!");
        } catch (err) {
            showToast(flattenErrors(err.response?.data), true);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (user) populateFields(user);
        setEditing(false);
    };

    const handleChangePassword = async () => {
        setPwErrors({});
        setPwSaving(true);
        try {
            const res = await AxiosInstance.post("api/accounts/change-password/", {
                current_password: currentPw,
                new_password:     newPw,
                confirm_password: confirmPw,
            });

            if (res.data?.tokens) {
                localStorage.setItem("access_token",  res.data.tokens.access);
                localStorage.setItem("refresh_token", res.data.tokens.refresh);
            }

            setShowPwForm(false);
            setCurrentPw(""); setNewPw(""); setConfirmPw("");
            showToast("Password updated successfully!");
        } catch (err) {
            const errData = err.response?.data;
            if (!errData) {
                setPwErrors({ non_field_errors: "Something went wrong. Please try again." });
                return;
            }
            if (errData.error) {
                setPwErrors({ non_field_errors: errData.error });
            } else if (typeof errData === "object") {
                setPwErrors(errData);
            } else {
                setPwErrors({ non_field_errors: flattenErrors(errData) });
            }
        } finally {
            setPwSaving(false);
        }
    };

    const handleDeleteAccount = async (password) => {
        setDeleteError("");
        setDeleteLoading(true);
        try {
            const refresh = localStorage.getItem("refresh_token");
            await AxiosInstance.delete("api/accounts/delete-account/", {
                data: { password, refresh },
            });
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            navigate("/register");
        } catch (err) {
            setDeleteError(flattenErrors(err.response?.data));
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loadingUser) {
        return (
            <AnimatePresence>
                <CoinLoader text="Loading profile" />
            </AnimatePresence>
        );
    }

    const initials     = getInitials(fullName || user?.email || "");
    const memberSince  = fmtDate(user?.date_joined);
    const trustScore   = user?.trust_score ?? 100;

    return (
        <>
            <Toast msg={toast.msg} show={toast.show} isError={toast.isError} />

            <AnimatePresence>
                {showDelete && (
                    <DeleteModal
                        onConfirm={handleDeleteAccount}
                        onCancel={() => { setShowDelete(false); setDeleteError(""); }}
                        loading={deleteLoading}
                        error={deleteError}
                    />
                )}
            </AnimatePresence>

            {FLOATS.map((c, i) => <FloatCoin key={i} {...c} />)}

            <div style={{ minHeight: "100vh", background: "#f5f0e8", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(16px,4vw,48px) clamp(12px,3vw,28px) 80px" }}>

                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#2d5a35 55%,#3d6a25 100%)", borderRadius: 20, padding: "clamp(16px,3vw,32px) clamp(14px,3vw,28px)", marginBottom: 18, position: "relative", overflow: "hidden", marginTop: "5rem" }}>
                        {[{ s: 220, t: "-30%", r: "8%" }, { s: 150, t: "20%", r: "24%" }].map((c, i) => (
                            <motion.div key={i} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 5 + i, repeat: Infinity }}
                                style={{ position: "absolute", width: c.s, height: c.s, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.08)", top: c.t, right: c.r, pointerEvents: "none" }} />
                        ))}

                        <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2.5vw,22px)", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <motion.div whileHover={{ scale: 1.05 }}
                                    style={{ width: "clamp(60px,9vw,88px)", height: "clamp(60px,9vw,88px)", borderRadius: "50%", background: "#fff", border: "3.5px solid #d4a843", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 3px rgba(212,168,67,0.25)" }}>
                                    <span style={{ fontWeight: 900, fontSize: "clamp(1rem,2.5vw,1.6rem)", color: "#2d3b1f", fontFamily: "'Fraunces',serif" }}>{initials}</span>
                                </motion.div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    style={{ position: "absolute", bottom: -3, right: -3, width: 26, height: 26, background: "#d4a843", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                                    <Coins size={12} color="#2d3b1f" strokeWidth={2} />
                                </motion.div>
                            </div>

                            <div style={{ flex: 1, minWidth: 180 }}>
                                <h1 style={{ fontSize: "clamp(1.1rem,3.5vw,1.9rem)", fontWeight: 900, color: "#fff", fontFamily: "'Fraunces',serif", marginBottom: 3, lineHeight: 1.15 }}>
                                    {fullName || user?.email}
                                </h1>
                                <p style={{ fontSize: "clamp(0.73rem,2vw,0.88rem)", color: "#d4a843", fontWeight: 600, marginBottom: 10 }}>
                                    Member since {memberSince}
                                </p>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {user?.is_verified && (
                                        <motion.span whileHover={{ scale: 1.05 }}
                                            style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(29,184,147,0.18)", color: "#1db893", borderRadius: 99, padding: "3px 10px", fontSize: "clamp(0.67rem,1.5vw,0.78rem)", fontWeight: 700 }}>
                                            ✓ Verified
                                        </motion.span>
                                    )}
                                    {user?.is_premium && (
                                        <motion.span whileHover={{ scale: 1.05 }}
                                            style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(212,168,67,0.18)", color: "#d4a843", borderRadius: 99, padding: "3px 10px", fontSize: "clamp(0.67rem,1.5vw,0.78rem)", fontWeight: 700 }}>
                                            ★ Premium
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => editing ? handleCancelEdit() : setEditing(true)}
                                style={{ background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 11, padding: "clamp(8px,1.5vw,11px) clamp(12px,2vw,18px)", fontWeight: 700, fontSize: "clamp(0.76rem,1.8vw,0.9rem)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(212,168,67,0.35)", flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>
                                {editing ? <><X size={14} strokeWidth={2.5} />Cancel</> : <><Edit2 size={14} strokeWidth={2} />Edit Profile</>}
                            </motion.button>
                        </div>
                    </motion.div>

                    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                        <StatCard value={stats.groupsJoined} label="Groups Joined" bg="linear-gradient(135deg,#1db893,#0fa87a)" icon={<Users size={64} color="#fff" />} delay={0.08} />
                        <StatCard value={`₦${Number(stats.totalSaved).toLocaleString()}`} label="Total Saved" bg="linear-gradient(135deg,#d4a843,#e8c055)" icon={<CircleDollarSign size={64} color="#fff" />} delay={0.15} />
                        <StatCard value={stats.payoutsRecieved} label="Payouts Received" bg="#fff" textColor="#2d3b1f" icon={<PartyPopper size={64} color="#2d3b1f" />} delay={0.22} />
                        <StatCard value={user?.trust_score ?? 0} label={user?.trust_tier?.label || "New Member"} bg="linear-gradient(135deg,#5b6ef5,#8b5cf6)" icon={<Star size={64} color="#fff" />} delay={0.29} />
                    </div>

                    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>

                        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 18 }}>

                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                                style={{ background: "#fff", borderRadius: 15, padding: 5, display: "flex", gap: 4, border: "1.5px solid #f0ece4", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                                {[{ key: "personal", icon: "👤", label: "Personal Info" }, { key: "security", icon: "🔒", label: "Security" }, { key: "notifs", icon: "🔔", label: "Notifications" }].map(({ key, icon, label }) => (
                                    <button key={key} onClick={() => setTab(key)}
                                        style={{ flex: 1, background: tab === key ? "#2d3b1f" : "transparent", color: tab === key ? "#fff" : "#2d3b1f80", border: "none", borderRadius: 11, padding: "9px 6px", fontWeight: 700, fontSize: "clamp(0.72rem,1.6vw,0.85rem)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'DM Sans',sans-serif", transition: "background 0.2s, color 0.2s" }}>
                                        <span>{icon}</span><span>{label}</span>
                                    </button>
                                ))}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "clamp(16px,3vw,28px)", border: "1.5px solid #f0ece4", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                                <AnimatePresence mode="wait">

                                    {tab === "personal" && (
                                        <motion.div key="personal" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.28 }}>
                                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 16 }}>Personal Information</h3>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 24 }}>
                                                <ProfileField icon={User}  label="Full Name"     value={fullName}  editing={editing} onChange={e => setFullName(e.target.value)} />
                                                <ProfileField icon={Mail}  label="Email Address" value={user?.email || ""} editing={editing} readOnly />
                                                <ProfileField icon={Phone} label="Phone Number"  value={phone}     editing={editing} onChange={e => setPhone(e.target.value)} type="tel" />
                                                <ProfileField icon={MapPin} label="Location"     value={location}  editing={editing} onChange={e => setLocation(e.target.value)} />
                                            </div>

                                            {/* Bank Details */}
                                            <div style={{ borderTop: "1px solid #f4f0ea", paddingTop: 20, marginBottom: 16 }}>
                                                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 16 }}>
                                                    Bank Details
                                                </h3>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>

                                                    {/* Bank selector */}
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                                            <Building2 size={13} color="#7c5cbf" strokeWidth={2} />
                                                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2d3b1f80" }}>Bank Name</span>
                                                        </div>
                                                        {editing ? (
                                                            <BankSelector
                                                                value={bankName}
                                                                onChange={(name, code) => {
                                                                    setBankName(name);
                                                                    setBankCode(code);
                                                                    setAccName("");
                                                                    setAccVerified(false);
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{ border: "1.5px solid #e8e2d8", borderRadius: 12, padding: "11px 13px", background: "#fff", fontSize: "0.92rem", color: "#2d3b1f" }}>
                                                                {bankName || <span style={{ color: "#b8c0b0" }}>—</span>}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Account number with auto-resolve */}
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                                            <CreditCard size={13} color="#7c5cbf" strokeWidth={2} />
                                                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2d3b1f80" }}>Account Number</span>
                                                        </div>
                                                        {editing ? (
                                                            <div style={{ position: "relative" }}>
                                                                <div style={{ border: `1.5px solid ${accVerified ? "#1db893" : "#e0dbd2"}`, borderRadius: 12, padding: "11px 13px", background: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                                                                    <input
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        maxLength={10}
                                                                        value={accNumber}
                                                                        onChange={e => {
                                                                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                            setAccNumber(val);
                                                                            setAccName("");
                                                                            setAccVerified(false);
                                                                            if (val.length === 10 && bankCode) {
                                                                                resolveAccount(val, bankCode);
                                                                            }
                                                                        }}
                                                                        placeholder="10-digit account number"
                                                                        style={{ flex: 1, border: "none", outline: "none", fontSize: "0.92rem", color: "#2d3b1f", background: "transparent", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.08em" }}
                                                                    />
                                                                    {resolving && (
                                                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                                            style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #e0dbd2", borderTopColor: "#d4a843", flexShrink: 0 }} />
                                                                    )}
                                                                    {accVerified && <CheckCircle size={16} color="#1db893" strokeWidth={2.5} />}
                                                                </div>
                                                                {resolveError && (
                                                                    <p style={{ fontSize: "0.78rem", color: "#e84343", marginTop: 4, fontWeight: 600 }}>{resolveError}</p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div style={{ border: "1.5px solid #e8e2d8", borderRadius: 12, padding: "11px 13px", background: "#fff", fontSize: "0.92rem", color: "#2d3b1f" }}>
                                                                {accNumber || <span style={{ color: "#b8c0b0" }}>—</span>}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Account name — auto populated */}
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                                            <User size={13} color="#7c5cbf" strokeWidth={2} />
                                                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2d3b1f80" }}>Account Name</span>
                                                            {accVerified && <span style={{ fontSize: "0.68rem", color: "#1db893", background: "#f0faf6", borderRadius: 99, padding: "1px 7px", fontWeight: 600 }}>Auto-verified ✓</span>}
                                                        </div>
                                                        <div style={{ border: `1.5px solid ${accVerified ? "#1db893" : "#e8e2d8"}`, borderRadius: 12, padding: "11px 13px", background: accVerified ? "#f0faf6" : "#f8f6f0", fontSize: "0.92rem", color: accVerified ? "#1a5c3a" : "#2d3b1f80", fontWeight: accVerified ? 700 : 400 }}>
                                                            {accName || <span style={{ color: "#b8c0b0" }}>{resolving ? "Verifying…" : "Auto-fills after account number"}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {editing && (
                                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                        style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 8, flexWrap: "wrap" }}>
                                                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCancelEdit}
                                                            style={{ background: "#f0ece4", color: "#2d3b1f", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                                                            Cancel
                                                        </motion.button>
                                                        <motion.button whileHover={{ scale: saving ? 1 : 1.03 }} whileTap={{ scale: saving ? 1 : 0.97 }}
                                                            onClick={handleSave} disabled={saving}
                                                            style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(45,59,31,0.22)", fontFamily: "'DM Sans',sans-serif", opacity: saving ? 0.75 : 1 }}>
                                                            {saving
                                                                ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff" }} />Saving…</>
                                                                : <><Check size={14} strokeWidth={2.5} />Save Changes</>
                                                            }
                                                        </motion.button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}

                                    {tab === "security" && (
                                        <motion.div key="security" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.28 }}>
                                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 16 }}>Security Settings</h3>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    style={{ background: user?.bvn_verified ? "#f0faf6" : "#fffbe8", border: `1.5px solid ${user?.bvn_verified ? "#c8ede0" : "#f5e090"}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
                                                    <span style={{ fontSize: "1.3rem" }}>{user?.bvn_verified ? "✅" : "🔐"}</span>
                                                    <div style={{ flex: 1, minWidth: 120 }}>
                                                        <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.92rem" }}>
                                                            BVN Verification
                                                            {user?.bvn_verified && (
                                                                <span style={{ marginLeft: 8, fontSize: "0.7rem", background: "#1db893", color: "#fff", borderRadius: 99, padding: "2px 8px", fontWeight: 700 }}>Verified</span>
                                                            )}
                                                        </p>
                                                        <p style={{ fontSize: "0.76rem", color: "#2d3b1f70", marginTop: 2 }}>
                                                            {user?.bvn_verified
                                                                ? `Credit Score: ${user.credit_score} · ${user.credit_risk_level} risk`
                                                                : "Verify your BVN to unlock group access"}
                                                        </p>
                                                    </div>
                                                    {!user?.bvn_verified && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                                            onClick={() => navigate("/verify-bvn")}
                                                            style={{ background: "#d4a843", color: "#2d3b1f", border: "none", borderRadius: 9, padding: "7px 13px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>
                                                            Verify Now
                                                        </motion.button>
                                                    )}
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    style={{ background: "#fff", border: "1.5px solid #f0ece4", borderRadius: 14, padding: "14px 16px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                            <span style={{ fontSize: "1.1rem" }}>⭐</span>
                                                            <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.92rem" }}>Trust Score</p>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                            <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#2d3b1f", fontFamily: "'Fraunces',serif" }}>{user?.trust_score ?? 0}</span>
                                                            <span style={{ fontSize: "0.72rem", fontWeight: 700, borderRadius: 99, padding: "3px 9px", background: (user?.trust_tier?.color || "#9e9e9e") + "22", color: user?.trust_tier?.color || "#9e9e9e" }}>
                                                                {user?.trust_tier?.label || "New Member"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div style={{ background: "#f4f0ea", borderRadius: 99, height: 8, overflow: "hidden" }}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${user?.trust_score ?? 0}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                                            style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${user?.trust_tier?.color || "#9e9e9e"}, ${user?.trust_tier?.color || "#9e9e9e"}88)` }}
                                                        />
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                                        <span style={{ fontSize: "0.7rem", color: "#2d3b1f50" }}>0</span>
                                                        <span style={{ fontSize: "0.7rem", color: "#2d3b1f50" }}>100</span>
                                                    </div>
                                                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                                                        {[
                                                            { label: "Verify phone number",      done: !!user?.phone,                             points: "+5"       },
                                                            { label: "Complete bank details",    done: !!(user?.bank_name && user?.account_number), points: "+10"    },
                                                            { label: "Pay contribution on time", done: (user?.trust_score ?? 0) >= 20,            points: "+5/cycle" },
                                                            { label: "Complete a full cycle",    done: (user?.trust_score ?? 0) >= 30,            points: "+10"      },
                                                        ].map(({ label, done, points }, i) => (
                                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                                {done
                                                                    ? <CheckCircle size={13} color="#1db893" strokeWidth={2.5} />
                                                                    : <div style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid #d0ccc4", flexShrink: 0 }} />
                                                                }
                                                                <span style={{ fontSize: "0.78rem", color: done ? "#2d3b1f" : "#2d3b1f80", flex: 1 }}>{label}</span>
                                                                <span style={{ fontSize: "0.72rem", color: "#d4a843", fontWeight: 700 }}>{points}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>

                                                <SecCard bg="#f0faf6" icon="🔐" title="Change Password" sub="Update your account password"
                                                    action={
                                                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                                            onClick={() => { setShowPwForm(v => !v); setPwErrors({}); }}
                                                            style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 9, padding: "7px 13px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>
                                                            {showPwForm ? "Close" : "Update"}
                                                        </motion.button>
                                                    }
                                                />

                                                <AnimatePresence>
                                                    {showPwForm && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                                                            <div style={{ background: "#f8f6f0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 11 }}>
                                                                <PwField label="Current Password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} showPw={showPw} onToggleShow={() => setShowPw(v => !v)} showToggle />
                                                                {pwErrors.current_password && <p style={{ fontSize: "0.78rem", color: "#e84343", marginTop: -6, fontWeight: 600 }}>{pwErrors.current_password}</p>}

                                                                <PwField label="New Password" value={newPw} onChange={e => setNewPw(e.target.value)} showPw={showPw} onToggleShow={() => setShowPw(v => !v)} showToggle />
                                                                {pwErrors.new_password && <p style={{ fontSize: "0.78rem", color: "#e84343", marginTop: -6, fontWeight: 600 }}>{[].concat(pwErrors.new_password).join(" ")}</p>}

                                                                <PwField label="Confirm New Password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} showPw={showPw} />
                                                                {pwErrors.confirm_password && <p style={{ fontSize: "0.78rem", color: "#e84343", marginTop: -6, fontWeight: 600 }}>{[].concat(pwErrors.confirm_password).join(" ")}</p>}
                                                                {pwErrors.non_field_errors && <p style={{ fontSize: "0.78rem", color: "#e84343", fontWeight: 600 }}>{[].concat(pwErrors.non_field_errors).join(" ")}</p>}

                                                                <motion.button whileHover={{ scale: pwSaving ? 1 : 1.02 }} whileTap={{ scale: pwSaving ? 1 : 0.97 }}
                                                                    onClick={handleChangePassword} disabled={pwSaving || !currentPw || !newPw || !confirmPw}
                                                                    style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 10, padding: 11, fontWeight: 700, cursor: (pwSaving || !currentPw || !newPw || !confirmPw) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: (pwSaving || !currentPw || !newPw || !confirmPw) ? 0.7 : 1, fontFamily: "'DM Sans',sans-serif" }}>
                                                                    {pwSaving
                                                                        ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff" }} />Updating…</>
                                                                        : <><Lock size={13} strokeWidth={2.5} />Update Password</>
                                                                    }
                                                                </motion.button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <SecCard bg="#fffbe8" icon="📱" title="Two-Factor Authentication" sub="Add an extra layer of security"
                                                    action={
                                                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setTwoFA(v => !v)}
                                                            style={{ background: twoFA ? "#2d3b1f" : "#d4a843", color: twoFA ? "#fff" : "#2d3b1f", border: "none", borderRadius: 9, padding: "7px 13px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", flexShrink: 0, transition: "background 0.2s", fontFamily: "'DM Sans',sans-serif" }}>
                                                            {twoFA ? "Enabled ✓" : "Enable"}
                                                        </motion.button>
                                                    }
                                                />

                                                <div style={{ background: "#f8f6f0", border: "1.5px solid #f0ece4", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 11 }}>
                                                    <span style={{ fontSize: "1.2rem" }}>🔔</span>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 700, color: "#2d3b1f", fontSize: "0.92rem" }}>Login Alerts</p>
                                                        <p style={{ fontSize: "0.76rem", color: "#2d3b1f70", marginTop: 2 }}>Get notified of new login attempts</p>
                                                    </div>
                                                    <Toggle on={loginAlerts} onChange={() => setLoginAlerts(v => !v)} />
                                                </div>

                                                <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                                    style={{ background: "#fff5f5", border: "1.5px solid #ffd0d0", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
                                                    <AlertTriangle size={18} color="#e84343" strokeWidth={2} />
                                                    <div style={{ flex: 1, minWidth: 120 }}>
                                                        <p style={{ fontWeight: 700, color: "#e84343", fontSize: "0.88rem" }}>Delete Account</p>
                                                        <p style={{ fontSize: "0.74rem", color: "#2d3b1f70" }}>Permanently delete your account and all data</p>
                                                    </div>
                                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setShowDelete(true)}
                                                        style={{ background: "#e84343", color: "#fff", border: "none", borderRadius: 9, padding: "7px 13px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>
                                                        Delete
                                                    </motion.button>
                                                </motion.div>

                                            </div>
                                        </motion.div>
                                    )}

                                    {tab === "notifs" && (
                                        <motion.div key="notifs" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.28 }}>
                                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2d3b1f", fontFamily: "'Fraunces',serif", marginBottom: 16 }}>Notification Preferences</h3>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                                                <NotifRow icon="💰" title="Payment Reminders"        sub="Get notified before payment due dates"  on={notifs.paymentReminders} onToggle={() => toggleNotif("paymentReminders")} />
                                                <NotifRow icon="🎉" title="Payout Alerts"            sub="When you receive your payout"           on={notifs.payoutAlerts}     onToggle={() => toggleNotif("payoutAlerts")} />
                                                <NotifRow icon="👥" title="Group Updates"            sub="New members, changes, announcements"    on={notifs.groupUpdates}     onToggle={() => toggleNotif("groupUpdates")} />
                                                <NotifRow icon="✅" title="Transaction Confirmations" sub="Payment success notifications"          on={notifs.txConfirm}        onToggle={() => toggleNotif("txConfirm")} />
                                                <NotifRow icon="📧" title="Marketing Emails"         sub="Tips, offers, and updates"             on={notifs.marketing}        onToggle={() => toggleNotif("marketing")} />
                                                <NotifRow icon="📱" title="SMS Notifications"        sub="Important alerts via SMS"              on={notifs.sms}              onToggle={() => toggleNotif("sms")} />
                                            </div>
                                            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                                style={{ marginTop: 14, background: "#f8f6f0", borderRadius: 13, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 9 }}>
                                                <p style={{ fontSize: "0.82rem", color: "#2d3b1f80" }}>
                                                    {Object.values(notifs).filter(Boolean).length} of {Object.keys(notifs).length} enabled
                                                </p>
                                                <div style={{ display: "flex", gap: 7 }}>
                                                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                        onClick={() => setNotifs(n => Object.fromEntries(Object.keys(n).map(k => [k, false])))}
                                                        style={{ background: "#f0ece4", color: "#2d3b1f80", border: "none", borderRadius: 9, padding: "7px 12px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                                                        Disable All
                                                    </motion.button>
                                                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                        onClick={() => setNotifs(n => Object.fromEntries(Object.keys(n).map(k => [k, true])))}
                                                        style={{ background: "#2d3b1f", color: "#fff", border: "none", borderRadius: 9, padding: "7px 12px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                                                        Enable All
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </motion.div>
                        </div>

                        <div style={{ flex: "0 0 280px", display: "flex", flexDirection: "column", gap: 16 }}>

                            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "20px 18px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                                    <span style={{ fontSize: "1.2rem" }}>🏆</span>
                                    <h3 style={{ fontWeight: 800, color: "#2d3b1f", fontSize: "0.97rem" }}>Achievements</h3>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                                    {[
                                        {
                                            icon:  "🚀",
                                            title: "Early Adopter",
                                            sub:   "Joined AjoPay",
                                            gold:  true,
                                        },
                                        {
                                            icon:  "💎",
                                            title: "Consistent Saver",
                                            sub:   stats.payoutsRecieved > 0 ? `Received ${stats.payoutsReceived} payout${stats.payoutsReceived !== 1 ? "s" : ""}` : "Complete a cycle to unlock",
                                            gold:  stats.payoutsRecieved > 0,
                                        },
                                        {
                                            icon: "🏦",
                                            title: "Bank Verified",
                                            sub: !!(user?.bank_name && user?.account_number) ? "Bank details complete" : "Add bank details to unlock",
                                            gold: !!(user?.bank_name && user?.account_number),
                                        },
                                        {
                                            icon:  "🔐",
                                            title: "Identity Verified",
                                            sub:   user?.bvn_verified ? "BVN verified" : "Verify BVN to unlock",
                                            gold:  !!user?.bvn_verified,
                                        },
                                        {
                                            icon:  "🌟",
                                            title: "Trusted Member",
                                            sub:   (user?.trust_score ?? 0) >= 51 ? `Trust score: ${user.trust_score}` : `Need 51+ trust score (${user?.trust_score ?? 0}/51)`,
                                            gold:  (user?.trust_score ?? 0) >= 51,
                                        },
                                        {
                                            icon:  "👑",
                                            title: "Millionaire Club",
                                            sub:   stats.totalSaved >= 1000000 ? `₦${Number(stats.totalSaved).toLocaleString()} saved` : `₦${Number(stats.totalSaved).toLocaleString()} of ₦1M`,
                                            gold:  stats.totalSaved >= 1000000,
                                        },
                                    ].map((a, i) => (
                                        <AchievBadge key={i} icon={a.icon} title={a.title} sub={a.sub} gold={a.gold} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.07 }}
                                style={{ background: "linear-gradient(145deg,#1a3a2a,#2d5a35)", borderRadius: 20, padding: "20px 18px", boxShadow: "0 8px 28px rgba(45,59,31,0.25)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 13 }}>
                                    <Zap size={15} color="#d4a843" strokeWidth={2} />
                                    <h3 style={{ fontWeight: 800, color: "#fff", fontSize: "0.97rem" }}>Quick Actions</h3>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    <QA icon="📊" label="View History"  onClick={() => navigate("/transaction-history")} />
                                    <QA icon="👥" label="My Groups"     onClick={() => navigate("/groups")} />
                                    <QA icon="➕" label="Create Group"  onClick={() => navigate("/create-group")} />
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.12 }}
                                style={{ background: "#fff", borderRadius: 20, padding: "20px 18px", border: "1.5px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                                <h3 style={{ fontWeight: 800, color: "#2d3b1f", fontSize: "0.95rem", marginBottom: 13 }}>This Month</h3>
                                {[
                                    { icon: "💸", label: "Contributions Made", val: stats.contributionsThisMonth > 0 ? `${stats.contributionsThisMonth}` : "-" },
                                    { icon: "📈", label: "Total Saved",     val: stats.totalSaved > 0 ? `₦${Number(stats.totalSaved).toLocaleString()}` : "-" },
                                    { icon: "🎯", label: "Payouts Recieved",     val: stats.payoutsRecieved > 0 ? stats.payoutsRecieved : "-" },
                                    { icon: "🤝", label: "Groups Active",      val: stats.groupsActive > 0 ? stats.groupsActive : "-" },
                                ].map(({ icon, label, val }, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 3 ? "1px solid #f4f0ea" : "none" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#2d3b1f80" }}>
                                            <span>{icon}</span>{label}
                                        </span>
                                        <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2d3b1f" }}>{val}</span>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                whileHover={{ scale: 1.02, backgroundColor: "#ffeaea" }} whileTap={{ scale: 0.97 }}
                                onClick={logout}
                                style={{ width: "100%", background: "#fff5f5", color: "#e84343", border: "1.5px solid #ffd0d0", borderRadius: 14, padding: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: "0.88rem", fontFamily: "'DM Sans',sans-serif" }}>
                                <LogOut size={15} strokeWidth={2} />Sign Out
                            </motion.button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}