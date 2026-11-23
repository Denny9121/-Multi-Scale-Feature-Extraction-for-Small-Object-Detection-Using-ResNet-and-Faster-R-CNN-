import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageWrapper from "../components/layout/PageWrapper";

const MetalCubeGrid = lazy(() => import("../three/MetalCubeGrid"));
gsap.registerPlugin(ScrollTrigger);

const timeline = [
  "Dataset — NEU Steel Surface Defect Dataset",
  "Model — EfficientNet-B0 pretrained on ImageNet, fine-tuned on 6 classes",
  "Backend — FastAPI inference server",
  "Detection — Heuristic region extraction using connected components",
  "Frontend — React + Three.js visualization layer",
];

export default function About() {
  useEffect(() => {
    gsap.fromTo(".timeline-item", { opacity: 0, x: (i) => (i % 2 === 0 ? -40 : 40) }, { opacity: 1, x: 0, stagger: 0.15, scrollTrigger: { trigger: ".timeline", start: "top 75%" } });
    gsap.fromTo(".about-heading", { clipPath: "inset(100% 0 0 0)", opacity: 0 }, { clipPath: "inset(0% 0 0 0)", opacity: 1, duration: 0.8, scrollTrigger: { trigger: ".about-heading", start: "top 90%" } });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <PageWrapper>
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <h1 className="about-heading bg-gradient-to-r from-primary to-secondary bg-clip-text font-display text-5xl text-transparent">About the Project</h1>
        <p className="mt-3 max-w-3xl text-textMuted">NEU steel defect analysis solution powered by EfficientNet-B0 and FastAPI inference services.</p>

        <div className="glass mt-8 h-[300px]">
          <Canvas aria-hidden="true" camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <MetalCubeGrid />
            </Suspense>
          </Canvas>
        </div>

        <div className="timeline mt-10 space-y-4 border-l border-primary/40 pl-5">
          {timeline.map((item) => (
            <div key={item} className="timeline-item glass p-3">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {["React", "Three.js", "FastAPI", "PyTorch", "Tailwind"].map((tech) => (
            <div key={tech} className="glass p-4 text-center transition hover:-translate-y-1 hover:shadow-neon">
              {tech}
            </div>
          ))}
        </div>

        <div className="glass mt-8 grid gap-4 p-5 md:grid-cols-2">
          <p>Architecture: EfficientNet-B0</p>
          <p>Input: 224x224 normalized</p>
          <p>Output: 6-class softmax</p>
          <p>Dataset: NEU-DET (1800 images, 6 classes)</p>
        </div>
      </section>
    </PageWrapper>
  );
}
