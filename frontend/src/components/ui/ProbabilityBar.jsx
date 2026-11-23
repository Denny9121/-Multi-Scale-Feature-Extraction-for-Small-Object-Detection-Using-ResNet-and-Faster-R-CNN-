import { motion } from "framer-motion";
import { toLabel } from "../../utils/defectConfig";

export default function ProbabilityBar({ name, value, color, delay = 0 }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{toLabel(name)}</span>
        <span className="font-mono">{value.toFixed(2)}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.7, delay }} className="h-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
