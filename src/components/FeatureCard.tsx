import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: "primary" | "secondary" | "accent" | "success" | "info" | "warning";
}

const colorMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", icon: "bg-primary" },
  secondary: { bg: "bg-secondary/20", text: "text-secondary", icon: "bg-secondary" },
  accent: { bg: "bg-accent/10", text: "text-accent", icon: "bg-accent" },
  success: { bg: "bg-success/10", text: "text-success", icon: "bg-success" },
  info: { bg: "bg-info/10", text: "text-info", icon: "bg-info" },
  warning: { bg: "bg-warning/10", text: "text-warning", icon: "bg-warning" },
};

export function FeatureCard({ title, description, icon: Icon, path, color }: FeatureCardProps) {
  const c = colorMap[color];
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
      <Link
        to={path}
        className="block bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated border border-border transition-all group"
      >
        <div className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
        <div className={`flex items-center gap-1.5 mt-4 text-sm font-medium ${c.text}`}>
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
