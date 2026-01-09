"use client"

import { motion } from "framer-motion"
import {
    Rocket, Server, Database, Shield, Layout, Settings2, Code2,
    Terminal, Search, ChevronLeft, ArrowRight, UserPlus, Send, CheckCircle2, History, X,
    Zap
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const setupSteps = [
    { id: 1, title: "Fork & Clone", sub: "Clone your forked repository to your local machine.", code: "git clone https://github.com/trix-cli/trix" },
    { id: 2, title: "Install Dependencies", sub: "Install the required node modules.", code: "npm install", warning: "Make sure you are running Node v18 or higher." },
    { id: 3, title: "Local Link", sub: "Link the package locally to test CLI commands.", code: "npm link" },
]

const checklist = [
    "Run linter to ensure code style consistency.",
    "Use Conventional Commits for code quality.",
    "Add tests for all new core features."
]

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState("Setup")

    return (
        <div className="min-h-screen bg-background transition-colors duration-500">
            <header className="h-16 border-b border-border fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50 flex items-center px-6">
                <Link href="/" className="p-2 bg-secondary rounded-xl mr-4 hover:scale-110 transition-transform">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <span className="flex-1 text-center font-extrabold text-sm tracking-tight">Contributing Guide</span>
                <div className="w-9 h-9" />
            </header>

            <main className="pt-24 px-6 pb-32 max-w-xl mx-auto">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-12 p-1.5 bg-secondary/50 border border-border rounded-2xl overflow-x-auto no-scrollbar">
                    {["Setup", "Structure", "Testing"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-[13px] font-black transition-all whitespace-nowrap shadow-sm ${activeTab === tab ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-white/5 shadow-none"
                                }`}
                        >
                            {tab === "Setup" && <Rocket className="w-4 h-4" />}
                            {tab === "Structure" && <Layout className="w-4 h-4" />}
                            {tab === "Testing" && <Shield className="w-4 h-4" />}
                            {tab}
                        </button>
                    ))}
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14"
                >
                    <h1 className="text-3xl font-black tracking-tighter mb-4 text-foreground">Contribution Guide</h1>
                    <p className="text-[14px] text-muted-foreground leading-relaxed font-semibold">
                        We're thrilled you want to grow Trix! This guide covers everything needed to set up your dev environment and submit changes.
                    </p>
                </motion.section>

                <section className="space-y-14 relative">
                    <div>
                        <h2 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-10 pl-1">Development Setup</h2>
                        <div className="space-y-12 relative">
                            {/* Visual Connector Line */}
                            <div className="absolute left-[17px] top-8 bottom-8 w-px bg-border group" />

                            {setupSteps.map((step) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="relative pl-14"
                                >
                                    <div className="absolute left-0 top-0 w-9 h-9 rounded-2xl bg-secondary border border-border flex items-center justify-center text-[13px] font-black z-10 shadow-sm">
                                        {step.id}
                                    </div>
                                    <h3 className="text-base font-extrabold mb-1.5 tracking-tight">{step.title}</h3>
                                    <p className="text-[12px] text-muted-foreground mb-5 font-semibold leading-relaxed">{step.sub}</p>

                                    <div className="group/code relative">
                                        <div className="bg-secondary/50 p-4 pr-12 rounded-2xl text-[11px] font-mono font-bold border border-border overflow-x-auto flex items-center">
                                            <span className="text-primary mr-3 italic">$</span>
                                            <span className="text-cli-text">{step.code}</span>
                                        </div>
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background border border-border rounded-xl opacity-0 group-hover/code:opacity-100 transition-opacity">
                                            <History className="w-3.5 h-3.5 text-muted" />
                                        </button>
                                    </div>

                                    {step.warning && (
                                        <div className="mt-5 p-5 rounded-3xl bg-primary/5 border border-primary/20 flex gap-4">
                                            <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Zap className="w-4 h-4 text-primary" />
                                            </div>
                                            <p className="text-[11px] text-primary leading-relaxed font-bold">{step.warning}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6 pl-1">PR Checklist</h2>
                        <div className="space-y-3">
                            {checklist.map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-5 rounded-3xl bg-card border border-border flex items-center gap-5 stiff-shadow"
                                >
                                    <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span className="text-[12px] font-bold text-muted-foreground">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm z-40">
                    <button className="w-full h-[60px] bg-primary text-white rounded-[1.5rem] font-black text-base flex items-center justify-center shadow-[0_15px_40px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                        <Send className="w-5 h-5 mr-3" />
                        Open Pull Request
                    </button>
                </div>
            </main>
        </div>
    )
}
