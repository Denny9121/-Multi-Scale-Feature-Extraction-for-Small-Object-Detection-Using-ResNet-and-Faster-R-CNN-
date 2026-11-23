import { useEffect, useState } from "react";

const stages = ["Initializing scan...", "Processing pixel matrix...", "Running inference...", "Classifying defect..."];

export default function ScanOverlay({ active }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setIdx((v) => (v + 1) % stages.length), 500);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg/65">
      <div className="absolute left-4 top-4 h-20 w-20 rotate-12 rounded-xl border border-primary/40 bg-[linear-gradient(90deg,rgba(0,240,255,0.2)_1px,transparent_1px),linear-gradient(rgba(0,240,255,0.2)_1px,transparent_1px)] bg-[size:12px_12px] animate-[spin_12s_linear_infinite]" />
      <div className="absolute inset-x-0 top-0 h-1/3 scan-line bg-gradient-to-b from-primary/0 via-primary/60 to-primary/0 blur-sm" />
      <div className="absolute h-28 w-28 rounded-full border border-primary/40 animate-ping" />
      <div className="absolute h-40 w-40 rounded-full border border-primary/30 animate-ping [animation-delay:250ms]" />
      <div className="glass px-5 py-3 text-sm text-primary">{stages[idx]}</div>
    </div>
  );
}
