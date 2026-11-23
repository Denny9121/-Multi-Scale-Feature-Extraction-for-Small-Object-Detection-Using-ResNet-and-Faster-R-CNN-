import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/detection", label: "Detection" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all ${scrolled ? "backdrop-blur-xl border-b border-primary/20 bg-bg/70" : "bg-transparent"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="font-display text-xl text-primary neon-glow">
          NEU·SCAN
          <span className="block h-0.5 w-full animate-pulse bg-primary/70" />
        </NavLink>

        <div className="hidden gap-2 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `animated-link rounded-full px-4 py-2 ${isActive ? "bg-primary/15 text-primary neon-glow" : "text-textMuted hover:text-textPrimary"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button onClick={() => setOpen((v) => !v)} className="md:hidden">
          <span className="text-primary">{open ? "✕" : "☰"}</span>
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass mx-4 mb-3 p-3 md:hidden"
          >
            {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? "bg-primary/20 text-primary" : "text-textPrimary hover:bg-primary/10"}`}
            >
              {link.label}
            </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
