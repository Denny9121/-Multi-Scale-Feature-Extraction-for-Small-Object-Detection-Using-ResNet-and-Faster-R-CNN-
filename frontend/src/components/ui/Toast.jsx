import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ message, type = "error", onClose }) {
  const color = type === "error" ? "border-red-400/60 text-red-200" : "border-emerald-400/60 text-emerald-200";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className={`fixed right-4 top-20 z-[85] rounded-xl border bg-bg/90 px-4 py-3 shadow-neon ${color}`}
        >
          <div className="flex items-center gap-3">
            <p className="text-sm">{message}</p>
            <button onClick={onClose} className="text-xs text-textMuted hover:text-textPrimary">
              dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
