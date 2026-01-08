"use client"

import { motion } from "framer-motion"
import { FeatureCard } from "@/components/feature-card"
import { CLITerminal } from "@/components/cli-terminal"
import { Navbar } from "@/components/navbar"
import {
  Rocket, Code2, Puzzle, Settings2, Github, ArrowRight, Boxes, ChevronRight, Terminal as TerminalIcon
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    title: "Instant Setup",
    description: "Spin up a new app in under 2 seconds. No configuration needed.",
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    title: "TypeScript Ready",
    description: "First-class TS support out of the box with strict typing enabled.",
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    title: "Plugin System",
    description: "Extend functionality with 50+ official and community plugins.",
    icon: <Puzzle className="w-5 h-5" />,
  },
  {
    title: "Zero Config",
    description: "Sensible defaults that just work, so you can focus on code.",
    icon: <Settings2 className="w-5 h-5" />,
  }
]

const docLinks = [
  { name: "Quick Start", sub: "Installation and first steps", href: "/docs/quick-start", icon: <Rocket className="w-4 h-4" /> },
  { name: "CLI Reference", sub: "All available commands and flags", href: "/docs/commands", icon: <TerminalIcon className="w-4 h-4" /> },
  { name: "Configuration", sub: "trix.config.js options", href: "/docs/config", icon: <Settings2 className="w-4 h-4" /> },
  { name: "Plugins", sub: "Browse official plugins", href: "/docs/advanced/templates", icon: <Puzzle className="w-4 h-4" /> },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="pt-40 pb-24 px-8 max-w-[1400px] mx-auto overflow-hidden">
        {/* Responsive Hero Layout: Stacked on small, Grid on medium+ */}
        <section className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              Stable Release v1.0.4
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1] tracking-tighter mb-10">
              Ship faster with <span className="text-primary">Trix</span><span className="text-primary">.</span>
            </h1>
            <p className="text-[18px] md:text-[22px] text-muted-foreground font-semibold leading-relaxed mb-12 lg:max-w-lg">
              The ultimate CLI engine for full-stack velocity. Generate production-ready projects in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/docs" className="h-[60px] px-12 bg-primary text-white rounded-[1.25rem] font-black text-lg flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/25">
                Get Started
              </Link>
              <Link href="https://github.com/your-repo/trix" target="_blank" className="h-[60px] px-8 bg-secondary rounded-[1.25rem] font-bold flex items-center justify-center border border-border hover:bg-accent transition-colors">
                <Github className="w-5 h-5 mr-3" /> GitHub
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:scale-110 lg:pl-10"
          >
            <div className="relative group p-2 rounded-[3rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 blur-[100px] -z-10" />
              <CLITerminal animated={true} className="scale-105" />
            </div>
          </motion.div>
        </section>

        {/* Features Grid: 1 col on mobile, 3 col on large desktop */}
        <section id="features" className="mb-32">
          <div className="flex items-center gap-4 mb-14">
            <div className="h-1.5 w-16 bg-primary rounded-full" />
            <h2 className="text-2xl font-black tracking-tighter uppercase">Why Trix?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </section>

        {/* Documentation Portal Portal */}
        <section className="mb-40">
          <div className="flex items-center gap-4 mb-14">
            <div className="h-1.5 w-16 bg-primary rounded-full" />
            <h2 className="text-2xl font-black tracking-tighter uppercase">Documentation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {docLinks.map((doc, i) => (
              <Link key={doc.name} href={doc.href} className="group p-7 rounded-[2.5rem] bg-card border border-border flex flex-col justify-between hover:border-primary/40 transition-all stiff-shadow min-h-[160px]">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                  {doc.icon}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-base tracking-tight">{doc.name}</h4>
                    <ChevronRight className="w-5 h-5 text-muted/30 group-hover:text-primary translate-x-0 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-[12px] font-bold text-muted mt-1.5">{doc.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Brand Footer */}
        <footer className="border-t border-border pt-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 font-bold mb-5 opacity-40">
            <Boxes className="w-5 h-5 text-primary" />
            <span className="text-[11px] tracking-widest font-black uppercase">Trix CLI Engine</span>
          </div>
          <p className="text-[12px] text-muted-foreground max-w-sm mb-10 leading-relaxed font-semibold">
            The next generation of boilerplate generation. Open source and built for absolute speed.
          </p>
          <div className="flex items-center gap-8 mb-12">
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-6 h-6" /></Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
          <p className="text-[10px] text-muted font-black uppercase tracking-widest opacity-20">© 2026 Trix Labs Inc.</p>
        </footer>
      </main>
    </div>
  )
}
