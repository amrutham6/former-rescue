import { motion } from "framer-motion";
import { Leaf, TrendingUp, Award, ArrowUpRight, Recycle, Flame, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";

const activities = [
  { id: 1, action: "Composting", co2: "0.8 tons", credits: 32, date: "Mar 25", icon: Recycle },
  { id: 2, action: "No Crop Burning", co2: "1.2 tons", credits: 48, date: "Mar 20", icon: Flame },
  { id: 3, action: "Tree Planting", co2: "0.5 tons", credits: 20, date: "Mar 15", icon: TreePine },
];

export default function CarbonCash() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Leaf className="w-7 h-7 text-success" /> Carbon Cash
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Earn money for eco-friendly farming practices.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <p className="text-sm text-muted-foreground">Total Credits</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">156</p>
          <div className="flex items-center gap-1 text-success text-sm mt-2">
            <TrendingUp className="w-4 h-4" /> +24 this month
          </div>
        </div>
        <div className="gradient-hero rounded-2xl p-5 text-primary-foreground">
          <p className="text-sm opacity-80">CO₂ Saved</p>
          <p className="font-display text-3xl font-bold mt-1">2.5 tons</p>
          <p className="text-xs opacity-60 mt-2">Equivalent to 100 trees planted</p>
        </div>
        <div className="gradient-gold rounded-2xl p-5 text-secondary-foreground">
          <p className="text-sm opacity-80">Earnings</p>
          <p className="font-display text-3xl font-bold mt-1">₹7,800</p>
          <div className="flex items-center gap-1 text-sm opacity-80 mt-2">
            <Award className="w-4 h-4" /> Ready to withdraw
          </div>
        </div>
      </div>

      {/* Log Activity */}
      <Button className="gradient-hero text-primary-foreground shadow-glow-primary gap-2">
        <Leaf className="w-4 h-4" /> Log Eco Activity
      </Button>

      {/* Recent Activities */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {activities.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <a.icon className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.date} • {a.co2} CO₂ saved</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-success flex items-center gap-1">
                  +{a.credits} <ArrowUpRight className="w-3.5 h-3.5" />
                </p>
                <p className="text-xs text-muted-foreground">credits</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
