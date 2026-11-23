import { motion } from "framer-motion";

export default function ConfidenceMeter({ value = 0, color = "#00F0FF" }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2 }}
        />
      </svg>
      <div className="absolute text-center font-display text-xl">{value.toFixed(1)}%</div>
    </div>
  );
}
