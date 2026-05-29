import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Bed, DollarSign } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatedHeading } from "./anim/AnimatedHeading";
import { Eyebrow } from "./Eyebrow";

export function HeroSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 pattern-dots pattern-fade-mask opacity-70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-12 items-center">
          <div>
            <Eyebrow>NYC · Rent-stabilized first</Eyebrow>

            <AnimatedHeading
              as="h1"
              className="font-display font-bold text-[44px] sm:text-[64px] lg:text-[88px] leading-[0.95] tracking-[-0.025em] text-charcoal-950"
            >
              Be first to every{" "}
              <span className="accent-italic">apartment.</span>
            </AnimatedHeading>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 text-lg lg:text-xl text-charcoal-600 max-w-xl leading-relaxed"
            >
              Stop refreshing StreetEasy. New listings, rent-stabilized units, and
              price drops sent the minute they appear.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              onSubmit={(e) => e.preventDefault()}
              className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-14 pl-11 pr-4 rounded-pill bg-surface-elevated border border-border text-sm text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 transition-all"
                />
              </div>
              <Link
                to="/signup"
                className="group inline-flex h-14 items-center justify-center gap-2 px-8 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 transition-colors whitespace-nowrap"
              >
                Get alerts
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.form>

            <p className="mt-4 text-xs font-mono uppercase tracking-[0.15em] text-charcoal-500">
              Join 53,000+ NYC renters · No credit card required
            </p>
          </div>

          <HeroAlertMockup />
        </div>
      </div>
    </section>
  );
}

function HeroAlertMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="absolute inset-0 pattern-cross pattern-fade-mask opacity-50 -m-12 pointer-events-none" />

      <div className="relative animate-float-y">
        <div className="bg-surface-elevated rounded-card shadow-elevated border border-border overflow-hidden max-w-md mx-auto">
          {/* Mail header */}
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-pill bg-sage-100 flex items-center justify-center">
              <Mail className="h-4 w-4 text-sage-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-charcoal-950 truncate">
                New listing: 245 Bedford Ave
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
                Nook · just now
              </div>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-sage-700 bg-sage-100 px-2 py-1 rounded-tight">
              Match
            </div>
          </div>

          {/* Listing card */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-display text-xl font-bold text-charcoal-950 leading-tight">
                  245 Bedford Ave, Apt 3R
                </div>
                <div className="text-xs text-charcoal-500 mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Williamsburg, Brooklyn
                </div>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-cream-500 bg-cream-100 px-2 py-1 rounded-tight whitespace-nowrap">
                RS Building
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <div className="font-display text-3xl font-bold text-charcoal-950">$2,850</div>
              <div className="text-xs text-sage-700 font-semibold">11% below median</div>
            </div>

            <div className="flex items-center gap-4 text-xs text-charcoal-600 mb-4 pb-4 border-b border-border">
              <span className="inline-flex items-center gap-1.5"><Bed className="h-3.5 w-3.5" /> 2 Beds</span>
              <span>·</span>
              <span>1 Bath</span>
              <span>·</span>
              <span>875 ft²</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <div className="font-mono uppercase tracking-wider text-charcoal-400 mb-1.5">Walk to</div>
                <div className="space-y-1 text-charcoal-700">
                  <div>Trader Joe's · 4 min</div>
                  <div>McCarren Park · 6 min</div>
                </div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-wider text-charcoal-400 mb-1.5">Building</div>
                <div className="space-y-1 text-charcoal-700">
                  <div className="text-sage-700">✓ Clean record</div>
                  <div>2 violations</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 bg-paper-warm border-t border-border flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
              <DollarSign className="h-3 w-3" /> Sent 2 sec ago
            </div>
            <button className="text-[11px] font-semibold text-sage-700 hover:text-sage-900 transition-colors">
              View →
            </button>
          </div>
        </div>

        {/* Floating second card */}
        <div className="absolute -top-6 -right-4 lg:-right-12 w-48 bg-surface-elevated rounded-card shadow-card border border-border p-3 animate-float-soft hidden sm:block">
          <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500 mb-1">Price drop</div>
          <div className="text-sm font-bold text-charcoal-950">$3,100 → $2,750</div>
          <div className="text-[11px] text-sage-700 mt-0.5">East Village · 1BR</div>
        </div>
      </div>
    </motion.div>
  );
}
