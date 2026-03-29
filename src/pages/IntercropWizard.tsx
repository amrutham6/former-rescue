import { motion } from "framer-motion";
import { Sprout, Sun, Droplets, ThermometerSun, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  { crop: "Moong Dal", growth: "45 days", season: "Summer", water: "Low", income: "₹12,000/acre", compatibility: 92 },
  { crop: "Sunflower", growth: "90 days", season: "Kharif", water: "Medium", income: "₹18,000/acre", compatibility: 85 },
  { crop: "Mustard", growth: "120 days", season: "Rabi", water: "Low", income: "₹15,000/acre", compatibility: 78 },
];

export default function IntercropWizard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Sprout className="w-7 h-7 text-primary" /> Intercrop Wizard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">AI suggests alternative crops for maximum land utilization.</p>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-2">Your Soil Analysis</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <ThermometerSun className="w-4 h-4 text-warning" />
            <span className="text-muted-foreground">Temp:</span>
            <span className="font-medium text-foreground">32°C</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4 text-info" />
            <span className="text-muted-foreground">Moisture:</span>
            <span className="font-medium text-foreground">45%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground">pH:</span>
            <span className="font-medium text-foreground">6.8</span>
          </div>
        </div>
      </div>

      <h2 className="font-display text-lg font-semibold text-foreground">Recommended Crops</h2>
      <div className="grid gap-4">
        {suggestions.map((s, i) => (
          <motion.div
            key={s.crop}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-semibold text-foreground text-lg">{s.crop}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    {s.compatibility}% match
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span>🌱 {s.growth}</span>
                  <span>🌤️ {s.season}</span>
                  <span>💧 {s.water} water</span>
                  <span className="font-medium text-success">{s.income}</span>
                </div>
              </div>
              <Button size="sm" className="gradient-hero text-primary-foreground gap-1">
                Plant <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
