import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!touchDevice);
    if (touchDevice) return undefined;
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="pointer-events-none fixed z-[80] h-3 w-3 rounded-full bg-primary" animate={{ x: pos.x - 6, y: pos.y - 6 }} transition={{ type: "spring", damping: 30 }} />
      <motion.div
        className="pointer-events-none fixed z-[79] h-7 w-7 rounded-full border border-primary/60"
        animate={{ x: pos.x - 14, y: pos.y - 14 }}
        transition={{ type: "spring", damping: 20, stiffness: 160 }}
      />
    </>
  );
}
