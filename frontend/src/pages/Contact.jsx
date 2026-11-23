import { useState } from "react";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import PageWrapper from "../components/layout/PageWrapper";
import GlowButton from "../components/ui/GlowButton";
import Toast from "../components/ui/Toast";

const successAnim = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 30,
  w: 128,
  h: 128,
  nm: "check",
  ddd: 0,
  assets: [],
  layers: [{ ddd: 0, ind: 1, ty: 4, nm: "shape", sr: 1, ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [64, 64, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } }, shapes: [{ ty: "gr", it: [{ ind: 0, ty: "sh", ks: { a: 0, k: { i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-20, 2], [-6, 16], [24, -18]], c: false } }, nm: "Path 1" }, { ty: "st", c: { a: 0, k: [0, 0.9, 0.46, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 }, lc: 2, lj: 2 }], nm: "Group 1" }], ip: 0, op: 30, st: 0, bm: 0 }],
};

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async () => {
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    setToast("Message sent successfully.");
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    reset();
    setTimeout(() => setStatus("idle"), 1800);
  };

  const shakeIfError = (field) => {
    if (!errors[field]) return;
    gsap.fromTo(`[data-field='${field}']`, { x: -6 }, { x: 6, duration: 0.06, repeat: 5, yoyo: true });
  };

  return (
    <PageWrapper>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 lg:grid-cols-2">
        <div className="glass p-5">
          <div className="mb-4 text-6xl">✉️</div>
          <div className="space-y-3">
            <a className="glass block p-3 animated-link" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            <a className="glass block p-3 animated-link" href="mailto:you@example.com">you@example.com</a>
            <div className="glass p-3">Built with PyTorch + React</div>
          </div>
        </div>
        <motion.form onSubmit={handleSubmit(onSubmit)} className="glass space-y-4 p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {["name", "email", "subject"].map((field) => (
            <label key={field} className="block">
              <span className="mb-1 block text-sm capitalize text-textMuted">{field}</span>
              <input
                type={field === "email" ? "email" : "text"}
                data-field={field}
                className={`w-full rounded-xl border bg-white/5 p-3 outline-none transition focus:border-primary focus:shadow-neon ${errors[field] ? "border-red-500" : "border-white/10"}`}
                {...register(field, { required: true })}
                onBlur={() => shakeIfError(field)}
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-1 block text-sm text-textMuted">Message</span>
            <textarea
              data-field="message"
              className={`min-h-28 w-full rounded-xl border bg-white/5 p-3 outline-none transition focus:border-primary focus:shadow-neon ${errors.message ? "border-red-500" : "border-white/10"}`}
              {...register("message", { required: true })}
              onBlur={() => shakeIfError("message")}
            />
          </label>
          <GlowButton type="submit" loading={status === "loading"}>
            Send Message
          </GlowButton>
          {status === "success" && (
            <div className="flex items-center gap-2 text-success">
              <div className="h-10 w-10">
                <Lottie animationData={successAnim} loop={false} />
              </div>
              Message sent successfully.
            </div>
          )}
        </motion.form>
      </section>
      <Toast message={toast} type="success" onClose={() => setToast("")} />
    </PageWrapper>
  );
}
