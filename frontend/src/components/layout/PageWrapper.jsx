import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen pt-24"
    >
      {children}
    </motion.main>
  );
}
