"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Github } from "lucide-react"
import LetterGlitch from "@/components/LetterGlitch"
import { CLITerminal } from "@/components/cli-terminal"

export function Hero() {
    return (
        <section className="relative min-h-[76vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-12">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <LetterGlitch
                    glitchSpeed={60}
                    centerVignette={false}
                    outerVignette={true}
                    smooth={true}
                    glitchColors={['#2563eb', '#60a5fa', '#10b981']}
                />
            </div>

            <div className="max-w-6xl w-full relative z-10 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex flex-col items-start text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-semibold text-foreground mb-4 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Stable · v1.0.4
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                            Ship faster with <span className="text-primary">Trix</span>
                        </h1>

                        <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-lg">
                            A fast, extensible CLI engine that scaffolds production-ready projects with sensible defaults — so you can focus on building.
                        </p>

                        <div className="flex flex-row gap-3 items-center">
                            <Link href="/docs" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm shadow-sm hover:scale-105 transition-transform">
                                Get Started
                            </Link>
                            <Link href="https://github.com/your-repo/trix" target="_blank" className="px-3 py-2 bg-card text-foreground rounded-md font-semibold text-sm border border-border hover:bg-card/90 transition-all flex items-center gap-2">
                                <Github className="w-4 h-4 inline" /> GitHub
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="w-full relative"
                    >
                        <div className="relative p-3 rounded-2xl bg-card border border-border max-w-full mx-auto">
                            <CLITerminal animated={true} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
