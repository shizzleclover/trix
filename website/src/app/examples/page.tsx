"use client"

import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import {
    Rocket, Server, Database, Shield, Layout, Settings2, Code2,
    Terminal, Search, ChevronLeft, ArrowRight, History, Zap, CheckCircle2, Send
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const examples = [
    {
        name: "The Modern Pro Stack",
        desc: "Full-stack type-safety with maximum developer experience. Perfect for SaaS products.",
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800",
        command: "trix init --template modern-pro",
        stack: [
            { name: "Framework", val: "Next.js" },
            { name: "Database", val: "PostgreSQL" },
            { name: "ORM", val: "Prisma" },
            { name: "UI", val: "Tailwind" }
        ],
        status: "SECURITY"
    },
    {
        name: "The Fast Backend Stack",
        desc: "High-performance API server with minimal overhead. Ideal for microservices.",
        image: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=800",
        command: "trix init --template fast-backend",
        stack: [
            { name: "Runtime", val: "Bun" },
            { name: "Framework", val: "Elysia" },
            { name: "Database", val: "SQLite" },
            { name: "ORM", val: "Drizzle" }
        ],
        status: "PERFORMANCE"
    }
]

export default function ExamplesPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="h-16 border-b border-border fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50 flex items-center px-6">
                <Link href="/" className="p-2 bg-secondary rounded-xl mr-4 hover:scale-110 transition-transform">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <span className="flex-1 text-center font-extrabold text-sm tracking-tight">Project Examples</span>
                <button className="p-2 ml-4">
                    <Search className="w-5 h-5 text-muted" />
                </button>
            </header>

            <main className="pt-24 px-6 pb-32 max-w-xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-3xl font-black tracking-tighter mb-4 text-foreground">Premium Stacks</h1>
                    <p className="text-[14px] text-muted-foreground leading-relaxed font-semibold">
                        Explore battle-tested configurations used by top-tier engineering teams.
                    </p>
                </div>

                <div className="space-y-10">
                    {examples.map((ex, i) => (
                        <motion.div
                            key={ex.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group p-1 rounded-[2.5rem] bg-card border border-border/50 overflow-hidden stiff-shadow hover:border-primary/50 transition-all cursor-pointer"
                        >
                            <div className="relative aspect-[16/10] rounded-[2.25rem] overflow-hidden mb-6">
                                <img src={ex.image} alt={ex.name} className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                <div className="absolute top-4 right-4">
                                    <span className="text-[9px] font-black bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest">
                                        {ex.status}
                                    </span>
                                </div>

                                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-lg font-black text-white tracking-tight">{ex.name}</span>
                                </div>
                            </div>

                            <div className="px-6 pb-8">
                                <p className="text-[13px] text-muted-foreground font-semibold leading-relaxed mb-6">
                                    {ex.desc}
                                </p>

                                <div className="bg-secondary/50 p-4 rounded-2xl border border-border flex items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Terminal className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-[11px] font-bold font-mono text-muted-foreground truncate">{ex.command}</span>
                                    </div>
                                    <div className="flex bg-background border border-border p-2 rounded-xl">
                                        <History className="w-3.5 h-3.5 text-muted hover:text-primary transition-colors cursor-pointer shrink-0" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-8 px-2">
                                    {ex.stack.map(s => (
                                        <div key={s.name}>
                                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">{s.name}</span>
                                            <h5 className="text-[12px] font-bold text-foreground mt-1.5">{s.val}</h5>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm z-40">
                    <button className="w-full h-[60px] bg-primary text-white rounded-[1.5rem] font-black text-base flex items-center justify-center shadow-[0_15px_40px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                        Try Trix Now
                        <ArrowRight className="w-5 h-5 ml-2.5" />
                    </button>
                </div>
            </main>
        </div>
    )
}
