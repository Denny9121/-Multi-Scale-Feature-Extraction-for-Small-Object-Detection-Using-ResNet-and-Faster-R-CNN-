import { motion } from "framer-motion";

export default function GlowButton({ children, onClick, type = "button", loading, className = "" }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-xl px-5 py-3 font-semibold text-bg bg-gradient-to-r from-primary to-accent neon-glow ${className}`}
      disabled={loading}
    >
      <span className="absolute inset-0 rounded-xl border border-white/40" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-bg border-t-transparent" /> : children}
      </span>
    </motion.button>
  );
}
