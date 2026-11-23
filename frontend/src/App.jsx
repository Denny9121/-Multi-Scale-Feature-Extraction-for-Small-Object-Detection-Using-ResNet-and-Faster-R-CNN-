import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import CustomCursor from "./components/visual/CustomCursor";

const Home = lazy(() => import("./pages/Home"));
const Detection = lazy(() => import("./pages/Detection"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

export default function App() {
  const location = useLocation();

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none fixed inset-0 z-[90] bg-black"
      />
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="pt-24 text-center text-textMuted">Loading...</div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}
