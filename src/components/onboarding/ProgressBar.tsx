import { motion } from "framer-motion";

export function ProgressBar({ step, total = 4 }: { step: number; total?: number }) {
  const pct = Math.max(0, Math.min(1, step / total));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
        <span>Step {step} of {total}</span>
        <span>{Math.round(pct * 100)}%</span>
      </div>
      <div className="h-1.5 w-full bg-charcoal-100 rounded-pill overflow-hidden">
        <motion.div
          className="h-full bg-charcoal-950"
          initial={false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
