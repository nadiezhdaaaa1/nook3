import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function CtaStrip() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-sage-100 px-6 lg:px-10 py-16">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-4xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 px-8 md:px-12 py-8 rounded-card bg-surface-elevated border border-border shadow-card"
      >
        <div>
          <div className="font-display text-2xl lg:text-3xl font-bold text-charcoal-950 leading-tight">
            Your next apartment is{" "}
            <span className="accent-italic">already listed.</span>
          </div>
          <div className="text-sm text-charcoal-600 mt-1">Get the alert before everyone else does.</div>
        </div>
        <Link
          to="/signup"
          className="group inline-flex items-center justify-center gap-2 h-13 px-7 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 transition-colors whitespace-nowrap"
        >
          Get alerts — free
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
