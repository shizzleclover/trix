import { ReactNode } from "react"
import { motion } from "framer-motion"

interface FeatureCardProps {
    title: string
    description: string
    icon: ReactNode
    index?: number
    className?: string
}

export function FeatureCard({ title, description, icon, index = 0, className = "" }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
            viewport={{ once: true }}
            className={`p-7 rounded-[2rem] bg-card border border-border/50 stiff-shadow hover:scale-[1.02] hover:border-primary/30 transition-all group ${className}`}
        >
            <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-foreground transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-2 tracking-tight">{title}</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-semibold">{description}</p>
        </motion.div>
    )
}
