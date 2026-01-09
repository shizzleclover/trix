"use client"

import Link from "next/link"
import { Boxes } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/50 pt-16 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Boxes className="w-8 h-8 text-primary" />
            <div>
              <div className="text-lg font-extrabold">Trix</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">CLI Engine</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Scaffold production-ready apps quickly. Open source and focused on developer experience.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold">Quick Links</h4>
          <Link href="/docs/quick-start" className="text-sm text-muted-foreground hover:text-foreground">Quick Start</Link>
          <Link href="/docs/commands" className="text-sm text-muted-foreground hover:text-foreground">CLI Reference</Link>
          <Link href="/examples" className="text-sm text-muted-foreground hover:text-foreground">Examples</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold">Connect</h4>
          <div className="flex items-center gap-3">
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.2-3.37-1.2-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.21 2.38.11 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.72 0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg></Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.36 8.56 8.56 0 0 1-2.72 1.04A4.26 4.26 0 0 0 11 9.6a12.1 12.1 0 0 1-8.78-4.45 4.25 4.25 0 0 0 1.32 5.68 4.2 4.2 0 0 1-1.93-.53v.05c0 2.04 1.45 3.74 3.37 4.13a4.27 4.27 0 0 1-1.92.07 4.27 4.27 0 0 0 3.99 2.96A8.56 8.56 0 0 1 2 19.54a12.07 12.07 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.19 0-.19-.01-.39-.02-.58A8.7 8.7 0 0 0 22.46 6z"/></svg>
            </Link>
          </div>
          <div className="mt-2">
            <label className="text-sm font-semibold mb-1 block">Subscribe</label>
            <div className="flex gap-2">
              <input aria-label="email" placeholder="you@company.com" className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none" />
              <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 pt-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div>© 2026 Trix Labs Inc.</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
