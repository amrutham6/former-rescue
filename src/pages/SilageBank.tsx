import { motion } from "framer-motion";
import { Warehouse, MapPin, Clock, Truck, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const centers = [
  { id: 1, name: "Green Silage Center", distance: "5 km", price: "₹2/kg", pickup: "Tomorrow 9 AM", capacity: "Available" },
  { id: 2, name: "FarmFeed Hub", distance: "12 km", price: "₹2.5/kg", pickup: "Today 4 PM", capacity: "Limited" },
  { id: 3, name: "AgriStore Network", distance: "20 km", price: "₹1.8/kg", pickup: "Mar 31, 10 AM", capacity: "Available" },
];

export default function SilageBank() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Warehouse className="w-7 h-7 text-accent" /> Silage Bank Network
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Convert waste crops into valuable animal feed. Zero waste.</p>
      </div>

      <div className="grid gap-4">
        {centers.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-semibold text-foreground">{c.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.distance}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{c.price}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.pickup}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                c.capacity === "Available" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>{c.capacity}</span>
            </div>
            <Button size="sm" className="mt-4 gradient-earth text-accent-foreground gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Book Pickup
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
