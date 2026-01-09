import { Rocket, Terminal as TerminalIcon, Settings2, Puzzle, ChevronLeft } from "lucide-react"
import Link from "next/link"

const docs = [
  { name: "Quick Start", href: "/docs/quick-start", desc: "Installation and first steps", icon: <Rocket className="w-5 h-5" /> },
  { name: "CLI Reference", href: "/docs/commands", desc: "All available commands and flags", icon: <TerminalIcon className="w-5 h-5" /> },
  { name: "Configuration", href: "/docs/config", desc: "trix.config.js options", icon: <Settings2 className="w-5 h-5" /> },
  { name: "Plugins", href: "/docs/advanced/templates", desc: "Browse official plugins", icon: <Puzzle className="w-5 h-5" /> },
]

export default function DocsIndex() {
  return (
    <div className="min-h-screen text-foreground bg-background selection:bg-primary/30">
      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-semibold mb-4">
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold">Documentation</h1>
            <p className="text-muted-foreground mt-3">Guides, references, and recipes to get more from Trix.</p>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {docs.map((d) => (
            <Link key={d.name} href={d.href} className="group p-5 rounded-lg bg-card border border-border hover:border-primary transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-primary">{d.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">{d.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-12 text-sm text-muted-foreground">
          <p>Can't find what you need? Open an issue on GitHub or reach out in the community.</p>
        </section>
      </main>
    </div>
  )
}
