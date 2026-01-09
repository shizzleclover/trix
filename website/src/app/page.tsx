"use client"

import { motion } from "framer-motion"
import { FeatureCard } from "@/components/feature-card"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import {
  Rocket, Code2, Puzzle, Settings2, Github, Boxes, ChevronRight, Terminal as TerminalIcon
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
  { name: "Quick Start", sub: "Installation and first steps", href: "/docs/quick-start", icon: <Rocket className="w-5 h-5" /> },
  { name: "CLI Reference", sub: "All available commands and flags", href: "/docs/commands", icon: <TerminalIcon className="w-5 h-5" /> },
  { name: "Configuration", sub: "trix.config.js options", href: "/docs/config", icon: <Settings2 className="w-5 h-5" /> },
  { name: "Plugins", sub: "Browse official plugins", href: "/docs/advanced/templates", icon: <Puzzle className="w-5 h-5" /> },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-primary/30 relative overflow-hidden bg-background text-foreground">
      <Navbar />

      <Hero />

      <main className="max-w-[1200px] mx-auto relative z-10 px-6 pb-24">
        {/* Features Content Sections */}
        <div className="w-full relative z-10 pt-20">
          {/* Features Grid */}
          <section id="features" className="mb-40">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="h-1 w-20 bg-primary rounded-full mb-4" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Why Trix</h2>
              <p className="text-white/60 font-medium max-w-md">Engineered for performance and developer happiness.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <FeatureCard key={f.title} {...f} index={i} className="backdrop-blur-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-all" />
              ))}
            </div>
          </section>

          {/* Documentation Portal */}
          <section className="mb-40">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="h-1 w-20 bg-primary rounded-full mb-4" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Documentation</h2>
              <p className="text-white/60 font-medium max-w-md">Master the CLI with our concise, practical guides.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {docLinks.map((doc, i) => (
                <Link key={doc.name} href={doc.href} className="group p-8 rounded-[3rem] bg-white/5 border border-white/10 flex flex-col justify-between hover:border-primary/50 transition-all hover:bg-white/10 min-h-[200px] backdrop-blur-2xl shadow-2xl">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-white/50 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                    {doc.icon}
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xl tracking-tight">{doc.name}</h4>
                      <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-primary translate-x-0 group-hover:translate-x-2 transition-all" />
                    </div>
                    <p className="text-sm font-bold text-white/40 mt-2">{doc.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Brand Footer */}
        <footer className="w-full border-t border-white/5 pt-20 flex flex-col items-center text-center mt-20">
          <div className="flex items-center gap-4 font-bold mb-8 opacity-60">
            <Boxes className="w-8 h-8 text-primary" />
            <span className="text-[14px] tracking-[0.4em] font-black uppercase">Trix CLI Engine</span>
          </div>
          <p className="text-lg text-white/60 max-w-xl mb-12 leading-relaxed font-bold">
            The next generation of boilerplate generation. <br />
            Open source and built for absolute speed.
          </p>
          <div className="flex items-center gap-12 mb-16">
            <Link href="https://github.com" className="text-white/40 hover:text-white transition-all hover:scale-125"><Github className="w-8 h-8" /></Link>
            <Link href="https://twitter.com" className="text-white/40 hover:text-white transition-all hover:scale-125">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
          <p className="text-[11px] text-white/20 font-black uppercase tracking-[0.5em] mb-10">© 2026 Trix Labs Inc.</p>
        </footer>
      </main>
    </div>
  )
}
