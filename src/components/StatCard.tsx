import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: "primary" | "gold" | "earth" | "info";
}

const variantStyles = {
  primary: "gradient-hero shadow-glow-primary text-primary-foreground",
  gold: "gradient-gold shadow-glow-gold text-secondary-foreground",
  earth: "gradient-earth text-accent-foreground",
  info: "bg-info text-info-foreground",
};

const iconBg = {
  primary: "bg-primary-foreground/20",
  gold: "bg-secondary-foreground/15",
  earth: "bg-accent-foreground/20",
  info: "bg-info-foreground/20",
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = "primary" }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className={`rounded-2xl p-5 ${variantStyles[variant]} transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-display font-bold mt-1">{value}</p>
          <p className="text-xs opacity-60 mt-1">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
