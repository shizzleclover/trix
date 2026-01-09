"use client"

import Link from "next/link"
import { Github, Menu, Boxes } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"
import { motion } from "framer-motion"

const navItems = [
    { name: "Features", href: "/#features" },
    { name: "Docs", href: "/docs" },
    { name: "Examples", href: "/examples" },
    { name: "Community", href: "/community" },
]

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-6 mt-6">
                <div className="h-16 px-8 glass rounded-2xl border border-white/10 stiff-shadow flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-tight hover:scale-105 transition-transform shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-sm shadow-lg shadow-primary/20">
                            <Boxes className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span>Trix</span>
                            <span className="text-[10px] font-black text-muted tracking-[0.1em] mt-0.5">CLI ENGINE</span>
                        </div>
                    </Link>

                    {/* Desktop Nav - Centered */}
                    <div className="hidden md:flex items-center gap-10 text-[14px] font-bold">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href} className="text-muted hover:text-foreground transition-all hover:translate-y-[-1px]">
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <ThemeToggle />
                        <button className="md:hidden p-2 text-muted" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="h-5 w-px bg-border mx-2 hidden md:block" />
                        <Link href="https://github.com/your-repo/trix" target="_blank" className="hidden md:block p-2.5 text-muted hover:text-foreground transition-all hover:scale-110">
                            <Github className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-24 left-4 right-4 p-6 glass border border-white/10 rounded-2xl stiff-shadow flex flex-col gap-5 text-sm font-bold md:hidden"
                >
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                            {item.name}
                            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Menu className="w-3 h-3" />
                            </div>
                        </Link>
                    ))}
                    <div className="h-px bg-border" />
                    <Link href="https://github.com/your-repo/trix" target="_blank" className="flex items-center gap-3 text-primary">
                        <Github className="w-5 h-5" /> Source Code
                    </Link>
                </motion.div>
            )}
        </nav>
    )
}
