import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import ParticleBackground from "../components/visual/ParticleBackground";
import GlowButton from "../components/ui/GlowButton";
import ScanOverlay from "../components/visual/ScanOverlay";
import ConfidenceMeter from "../components/ui/ConfidenceMeter";
import ProbabilityBar from "../components/ui/ProbabilityBar";
import Toast from "../components/ui/Toast";
import { DEFECT_CLASSES, toLabel } from "../utils/defectConfig";
import { predictImage } from "../utils/api";

const minScanMs = 1500;

export default function Detection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const abortRef = useRef(null);
  const fileInputRef = useRef(null);

  const sortedProb = useMemo(() => {
    if (!result?.probabilities) return [];
    return Object.entries(result.probabilities).sort((a, b) => b[1] - a[1]);
  }, [result]);

  const onPickFile = (picked) => {
    if (!picked) return;
    if (!["image/jpeg", "image/png", "image/bmp", "image/jpg"].includes(picked.type)) {
      setError("Invalid file. Please upload JPG, PNG or BMP.");
      return;
    }
    setError("");
    setResult(null);
    setFile(picked);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(picked);
    });
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const analyze = async () => {
    if (!file) return setError("Please choose an image first.");
    setLoading(true);
    setError("");
    const started = Date.now();
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const dataPromise = predictImage({ file, signal: abortRef.current.signal });
      const minDelay = new Promise((resolve) => setTimeout(resolve, minScanMs));
      const [data] = await Promise.all([dataPromise, minDelay]);
      setResult(data);
    } catch (e) {
      if (e.name !== "CanceledError") setError("API error: backend unavailable or request failed.");
    } finally {
      const elapsed = Date.now() - started;
      if (elapsed < minScanMs) await new Promise((r) => setTimeout(r, minScanMs - elapsed));
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <section className="relative mx-auto grid max-w-7xl gap-6 px-4 pb-20 lg:grid-cols-2">
        <ParticleBackground count={2000} />
        <div className="glass p-5">
          <h2 className="font-display text-2xl">Upload & Scan</h2>
          <label
            className={`dash-border mt-4 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl p-4 text-center transition ${
              dragOver ? "scale-[1.02] bg-primary/10 border-primary" : "hover:bg-primary/10"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              onPickFile(e.dataTransfer.files?.[0]);
            }}
          >
            <p className="text-primary">Drop your steel surface image here</p>
            <p className="text-sm text-textMuted">Supports JPG, PNG, BMP</p>
            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
          </label>
          <div className="my-3 text-center text-textMuted">OR</div>
          <GlowButton onClick={() => fileInputRef.current?.click()}>Browse File</GlowButton>

          {preview && (
            <div className="relative mt-5 overflow-hidden rounded-xl border border-primary/20">
              <img src={preview} alt="preview" className="h-72 w-full object-cover" loading="lazy" />
              <button
                onClick={() => {
                  if (preview) URL.revokeObjectURL(preview);
                  setPreview("");
                  setFile(null);
                  setResult(null);
                }}
                className="absolute right-2 top-2 rounded bg-bg/70 px-2"
              >
                ×
              </button>
              <div className="absolute left-2 top-2 rounded bg-bg/80 px-2 py-1 text-xs">{file?.name}</div>
              <ScanOverlay active={loading} />
            </div>
          )}
          <div className="mt-5 flex gap-3">
            <GlowButton onClick={analyze} loading={loading} className="flex-1">
              Analyze Defect
            </GlowButton>
            <button
              onClick={() => {
                if (preview) URL.revokeObjectURL(preview);
                setResult(null);
                setPreview("");
                setFile(null);
                setError("");
              }}
              className="glass px-4 py-2 transition hover:-translate-y-0.5"
            >
              Analyze Another
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={result ? "result" : "empty"} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass p-5">
            {!result ? (
              <p className="text-textMuted">Run analysis to see defect class, confidence meter, annotated detections, and probabilities.</p>
            ) : (
              <div className="space-y-5">
                <div className="inline-flex rounded-full px-4 py-2 font-display" style={{ background: `${DEFECT_CLASSES[result.class]?.color}33`, color: DEFECT_CLASSES[result.class]?.color }}>
                  {toLabel(result.class)}
                </div>
                <ConfidenceMeter value={result.confidence} color={DEFECT_CLASSES[result.class]?.color} />
                <div className="relative overflow-hidden rounded-xl border border-primary/20">
                  <img src={result.annotated_image} alt="Annotated detection" className="w-full object-cover transition hover:scale-[1.02]" loading="lazy" />
                  <div className="absolute right-2 top-2 rounded bg-bg/85 px-2 py-1 text-xs">{result?.detections?.length || 0} objects detected</div>
                </div>
                <div className="space-y-3">
                  {sortedProb.map(([name, val], i) => (
                    <ProbabilityBar key={name} name={name} value={val} color={DEFECT_CLASSES[name]?.color || "#00F0FF"} delay={i * 0.1} />
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(result.detections || []).map((det, i) => (
                    <motion.div key={`${det.label}-${i}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="font-display" style={{ color: DEFECT_CLASSES[det.label]?.color }}>{toLabel(det.label)} ({det.confidence.toFixed(1)}%)</p>
                      <p className="font-mono text-xs text-textMuted">x1:{det.box.x1} y1:{det.box.y1} x2:{det.box.x2} y2:{det.box.y2}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
      <Toast message={error} type="error" onClose={() => setError("")} />
    </PageWrapper>
  );
}
