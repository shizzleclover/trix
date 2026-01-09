"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ChevronRight, Home, Book, Layers, Terminal, Users, Play,
    Menu, X, Search, Settings, ArrowLeft, Boxes, Hash
} from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

const sidebarItems = [
    {
        group: "Concepts", items: [
            { name: "Introduction", href: "/docs", icon: <Home className="w-4 h-4" /> },
            { name: "Core Principles", href: "/docs/principles", icon: <Boxes className="w-4 h-4" /> },
        ]
    },
    {
        group: "Manual", items: [
            { name: "Quick Start", href: "/docs/quick-start", icon: <Play className="w-4 h-4" /> },
            { name: "CLI Commands", href: "/docs/commands", icon: <Terminal className="w-4 h-4" /> },
            { name: "The Manifest", href: "/docs/config", icon: <Layers className="w-4 h-4" /> },
        ]
    },
    {
        group: "Extend", items: [
            { name: "Custom Templates", href: "/docs/advanced/templates", icon: <Hash className="w-4 h-4" /> },
            { name: "Contribution", href: "/docs/contribution", icon: <Users className="w-4 h-4" /> },
        ]
    },
]

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/20">
            {/* Header */}
            <header className={`h-16 border-b border-border sticky top-0 transition-all z-50 px-5 flex items-center justify-between ${scrolled ? "bg-background/80 backdrop-blur-xl border-b shadow-sm" : "bg-transparent border-transparent"
                }`}>
                <div className="flex items-center gap-4">
                    <button className="lg:hidden p-2 bg-secondary rounded-xl hover:bg-primary/10 transition-colors" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Link href="/" className="p-2 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="font-bold text-sm tracking-tight hidden sm:block ml-2">Trix Docs</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Find a command..."
                            className="h-10 w-64 bg-secondary/50 border border-border rounded-xl pl-9 pr-4 text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-8xl mx-auto flex gap-12 px-6">
                {/* Sidebar Desktop: Narrower and Fixed */}
                <aside className="w-64 fixed top-16 bottom-0 hidden lg:block border-r border-border/50 pt-10 pr-6 overflow-y-auto no-scrollbar">
                    {sidebarItems.map((group) => (
                        <div key={group.group} className="mb-8 pl-2">
                            <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">
                                {group.group}
                            </h4>
                            <div className="space-y-1">
                                {sidebarItems.find(g => g.group === group.group)?.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all relative ${isActive
                                                ? "text-primary bg-primary/5 shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                                                }`}
                                        >
                                            {isActive && <motion.div layoutId="doc-active" className="absolute left-0 w-1 h-4 bg-primary rounded-full" />}
                                            <span className={isActive ? "text-primary" : "text-muted"}>{item.icon}</span>
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Sidebar Mobile Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 dark:bg-black/60 bg-black/30 backdrop-blur-sm"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="absolute inset-y-0 left-0 w-[80%] max-w-xs bg-background border-r border-border p-8 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <span className="font-extrabold text-lg tracking-tight">Trix Docs</span>
                                    <button className="p-2 bg-secondary rounded-xl" onClick={() => setSidebarOpen(false)}>
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    {sidebarItems.map((group) => (
                                        <div key={group.group} className="mb-8">
                                            <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">
                                                {group.group}
                                            </h4>
                                            <div className="space-y-1">
                                                {group.items.map((item) => {
                                                    const isActive = pathname === item.href
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setSidebarOpen(false)}
                                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all ${isActive
                                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                                : "text-muted hover:text-foreground hover:bg-secondary"
                                                                }`}
                                                        >
                                                            {item.icon}
                                                            {item.name}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.aside>
                        </div>
                    )}
                </AnimatePresence>

                {/* Content Wrapper: Pushed by fixed sidebar */}
                <main className="flex-1 lg:pl-72 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-5xl py-12">
                        <motion.article
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                        prose-p:text-[15px] prose-p:leading-relaxed prose-p:font-semibold prose-p:text-muted-foreground/80
                        prose-a:no-underline prose-a:font-bold prose-a:text-primary prose-code:text-primary prose-code:font-bold
                        prose-pre:bg-[var(--color-cli-bg)] prose-pre:border prose-pre:border-border/50 prose-pre:rounded-3xl"
                        >
                            {children}
                        </motion.article>

                        {/* Pagination */}
                        <div className="mt-32 pt-12 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <Link href="/" className="group flex items-center gap-4 hover:opacity-80 transition-opacity">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <ArrowLeft className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-muted uppercase tracking-widest block">Home</span>
                                    <span className="text-sm font-bold">Safety Logic</span>
                                </div>
                            </Link>
                            <Link href="/docs/quick-start" className="group flex items-center gap-4 hover:opacity-80 transition-opacity text-right">
                                <div>
                                    <span className="text-[9px] font-black text-muted uppercase tracking-widest block">Next</span>
                                    <span className="text-sm font-bold">Quick Start</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile TabBar Overlay */}
            <div className="lg:hidden fixed bottom-4 left-4 right-4 h-14 glass border border-border/50 rounded-2xl flex items-center justify-around px-8 z-40 stiff-shadow">
                <Link href="/docs" className="flex flex-col items-center gap-0.5 text-primary">
                    <Book className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Docs</span>
                </Link>
                <button className="flex flex-col items-center gap-0.5 text-muted hover:text-foreground">
                    <Search className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Find</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-muted hover:text-foreground">
                    <Settings className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Set</span>
                </button>
            </div>
        </div>
    )
}
