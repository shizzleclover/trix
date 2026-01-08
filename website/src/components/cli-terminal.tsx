"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, History } from "lucide-react"

interface CLITerminalProps {
    command?: string
    animated?: boolean
    showControls?: boolean
    className?: string
}

export function CLITerminal({
    command = "create-trix",
    animated = false,
    showControls = true,
    className = ""
}: CLITerminalProps) {
    const [displayText, setDisplayText] = useState(animated ? "" : command)
    const [copied, setCopied] = useState(false)
    const [isFinished, setIsFinished] = useState(!animated)

    useEffect(() => {
        if (!animated) return

        let i = 0
        const interval = setInterval(() => {
            setDisplayText(command.slice(0, i))
            i++
            if (i > command.length) {
                clearInterval(interval)
                setIsFinished(true)
            }
        }, 50)

        return () => clearInterval(interval)
    }, [animated, command])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`w-full group relative ${className}`}>
            <div className="bg-[#0b0c14] rounded-lg border border-white/5 overflow-hidden stiff-shadow">
                {showControls && (
                    <div className="h-9 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                        <div className="flex-1 text-[10px] text-muted-foreground font-mono text-center uppercase tracking-widest opacity-50">Terminal</div>
                    </div>
                )}
                <div className="p-6 font-mono text-[13px] leading-relaxed relative min-h-[100px]">
                    <div className="flex items-center gap-3">
                        <span className="text-primary font-bold">$</span>
                        <span className="text-foreground font-bold">
                            {displayText}
                            {animated && !isFinished && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="inline-block w-2 h-4 bg-primary ml-1 translate-y-0.5"
                                />
                            )}
                        </span>
                    </div>

                    <AnimatePresence>
                        {isFinished && animated && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 space-y-1.5"
                            >
                                <div className="text-muted-foreground opacity-60">▸ Fetching templates...</div>
                                <div className="text-green-500 font-bold flex items-center gap-2">
                                    <Check className="w-3 h-3" /> Successfully initialized project
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={copyToClipboard}
                        className="absolute right-4 top-4 p-2.5 bg-background border border-border rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-secondary active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
