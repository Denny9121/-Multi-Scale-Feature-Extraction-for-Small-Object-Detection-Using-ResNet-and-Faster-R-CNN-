import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import GlowButton from "../components/ui/GlowButton";
import ParticleBackground from "../components/visual/ParticleBackground";
import { DEFECT_CLASSES, toLabel } from "../utils/defectConfig";

const HeroSphere = lazy(() => import("../three/HeroSphere"));
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const statsRef = useRef([]);
  const dragStripRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(".feature-card", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: ".features", start: "top 75%" } });
    gsap.fromTo(".section-heading", { clipPath: "inset(100% 0 0 0)", opacity: 0 }, { clipPath: "inset(0% 0 0 0)", opacity: 1, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: ".features", start: "top 80%" } });
    gsap.to(".hero-subtitle", { y: 40, ease: "none", scrollTrigger: { trigger: ".hero-shell", start: "top top", end: "bottom top", scrub: true } });
    statsRef.current.forEach((node, i) => {
      const target = [6, 99, 224][i];
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: target,
        duration: 1.6,
        scrollTrigger: { trigger: node, start: "top 80%" },
        onUpdate: () => {
          node.textContent = Math.floor(proxy.val).toString();
        },
      });
    });
    const strip = dragStripRef.current;
    if (strip) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      const down = (e) => {
        isDown = true;
        startX = e.pageX - strip.offsetLeft;
        scrollLeft = strip.scrollLeft;
      };
      const leave = () => {
        isDown = false;
      };
      const move = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - strip.offsetLeft;
        const walk = (x - startX) * 1.2;
        strip.scrollLeft = scrollLeft - walk;
      };
      strip.addEventListener("mousedown", down);
      strip.addEventListener("mouseleave", leave);
      strip.addEventListener("mouseup", leave);
      strip.addEventListener("mousemove", move);
      return () => {
        strip.removeEventListener("mousedown", down);
        strip.removeEventListener("mouseleave", leave);
        strip.removeEventListener("mouseup", leave);
        strip.removeEventListener("mousemove", move);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <PageWrapper>
      <section className="hero-shell relative flex min-h-[85vh] items-center justify-center px-4">
        <ParticleBackground count={3000} />
        <div className="absolute inset-0 h-[85vh]" aria-hidden="true">
          <Canvas camera={{ position: [0, 0, 4] }} aria-hidden="true">
            <Suspense fallback={null}>
              <HeroSphere />
            </Suspense>
          </Canvas>
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-xs tracking-[0.3em] text-textMuted">AI-POWERED SURFACE INTELLIGENCE</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            {["Detect.", "Analyze.", "Perfect."].map((word, i) => (
              <motion.span key={word} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="mr-3 inline-block">
                {word}
              </motion.span>
            ))}
          </h1>
          <p className="hero-subtitle mx-auto mt-4 max-w-2xl text-lg text-textMuted">Industrial-grade defect detection for NEU steel surfaces using EfficientNet deep learning</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/detection">
              <GlowButton>Start Detection →</GlowButton>
            </Link>
            <a href="#features" className="animated-link text-textPrimary">
              Learn More ↓
            </a>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary animate-bounce">⌄</div>
      </section>

      <section id="features" className="features mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-heading mb-8 font-display text-3xl">Core Features</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="feature-card glass p-5 hover:-translate-y-1 hover:shadow-neon transition">
            <h3 className="font-display text-xl text-primary">6 Defect Classes</h3>
            <p className="mt-2 text-textMuted">{Object.keys(DEFECT_CLASSES).join(", ")}</p>
          </div>
          <div className="feature-card glass p-5 hover:-translate-y-1 hover:shadow-neon transition">
            <h3 className="font-display text-xl text-primary">EfficientNet-B0</h3>
            <p className="mt-2 text-textMuted">Compact and reliable CNN backbone fine-tuned for steel defect recognition.</p>
          </div>
          <div className="feature-card glass p-5 hover:-translate-y-1 hover:shadow-neon transition">
            <h3 className="font-display text-xl text-primary">Instant Results</h3>
            <p className="mt-2 text-textMuted">Single-click image analysis with annotated defect visualization and confidence output.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="glass grid gap-4 p-6 md:grid-cols-3">
          {["Defect Classes", "Avg Inference", "Input Resolution"].map((label, i) => (
            <div key={label} className="text-center">
              <div ref={(el) => (statsRef.current[i] = el)} className="font-display text-4xl text-primary">
                0
              </div>
              <div className="text-textMuted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="section-heading mb-5 font-display text-3xl">Defect Showcase</h2>
        <div ref={dragStripRef} className="flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing">
          {Object.entries(DEFECT_CLASSES).map(([name, cfg]) => (
            <article key={name} className="glass min-w-[250px] p-4 transition hover:-translate-y-2" style={{ borderTop: `3px solid ${cfg.color}` }}>
              <h3 className="font-display" style={{ color: cfg.color }}>
                {toLabel(name)}
              </h3>
              <p className="mt-2 text-sm text-textMuted">{cfg.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-7xl px-4">
        <div className="rounded-2xl bg-gradient-to-r from-secondary to-primary p-7 text-center">
          <h3 className="font-display text-2xl">Ready to analyze your steel surface?</h3>
          <Link to="/detection" className="mt-4 inline-block">
            <GlowButton>Start Detection</GlowButton>
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
