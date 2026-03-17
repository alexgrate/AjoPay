import { useEffect } from "react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";

const CoinLoader = ({ onDone, text = "Loading…" }) => {
    useEffect(() => {
        if (onDone) {
            const t = setTimeout(onDone, 2000);
            return () => clearTimeout(t);
        }
    }, [onDone]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "linear-gradient(145deg,#1a3a2a,#2d5a35,#3d6a25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
            <div style={{ position: "relative", width: 120, height: 120 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2.5px dashed rgba(212,168,67,0.35)" }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", inset: 0 }}>
                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", width: 28, height: 28, borderRadius: "50%", background: "#d4a843", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(212,168,67,0.6)" }}>
                        <Coins size={14} color="#2d3b1f" strokeWidth={2} />
                    </div>
                </motion.div>
                <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 15, -15, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#d4a843,#f0c84a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 28px rgba(212,168,67,0.55)" }}>
                        <Coins size={28} color="#2d3b1f" strokeWidth={1.8} />
                    </div>
                </motion.div>
            </div>
            <div style={{ width: 160, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 99, overflow: "hidden" }}>
                <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.8, ease: "easeInOut" }}
                    style={{ height: "100%", background: "#d4a843", borderRadius: 99 }} />
            </div>
            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>
                {text}
            </motion.p>
        </motion.div>
    );
};

export default CoinLoader;