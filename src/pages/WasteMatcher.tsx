import { motion } from "framer-motion";
import { Recycle, Upload, MapPin, IndianRupee, ArrowRight, Building2, Factory, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockMatches = [
  { id: 1, buyer: "Grand Hotel", type: "hotel", crop: "Damaged Ragi", qty: "200kg", price: "₹8/kg", distance: "12 km", icon: Hotel },
  { id: 2, buyer: "AgroProcess Ltd.", type: "industry", crop: "Spoiled Rice", qty: "500kg", price: "₹5/kg", distance: "25 km", icon: Factory },
  { id: 3, buyer: "Green Foods Co.", type: "industry", crop: "Mixed Waste", qty: "1000kg", price: "₹3/kg", distance: "8 km", icon: Building2 },
];

export default function WasteMatcher() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Recycle className="w-7 h-7 text-secondary" /> Urban Waste Matcher
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Sell damaged crops to hotels, industries, and local buyers.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border border-dashed">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-secondary-foreground" />
          </div>
          <h3 className="font-display font-semibold text-foreground">Upload Crop Details</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            Add photos and details of your damaged crops. We'll find the best buyers near you.
          </p>
          <Button className="mt-4 gradient-gold text-secondary-foreground shadow-glow-gold gap-2">
            <Upload className="w-4 h-4" /> Upload Now
          </Button>
        </div>
      </div>

      {/* Matches */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Your Matches</h2>
        <div className="grid gap-4">
          {mockMatches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                    <match.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">{match.buyer}</p>
                    <p className="text-sm text-muted-foreground">{match.crop} • {match.qty}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{match.price}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match.distance}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="gradient-hero text-primary-foreground gap-1">
                  Sell <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
