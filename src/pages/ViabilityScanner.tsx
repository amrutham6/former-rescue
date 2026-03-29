import { useState } from "react";
import { motion } from "framer-motion";
import { ScanLine, Upload, Camera, CheckCircle, AlertTriangle, XCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockHistory = [
  { id: 1, crop: "Paddy", usable: 72, damage: "Low", date: "Mar 27", suggestion: "Sell to local market" },
  { id: 2, crop: "Ragi", usable: 35, damage: "High", date: "Mar 22", suggestion: "Send to silage bank" },
  { id: 3, crop: "Wheat", usable: 88, damage: "Minimal", date: "Mar 18", suggestion: "Store for sale" },
];

function DamageIndicator({ usable }: { usable: number }) {
  const color = usable >= 70 ? "text-success" : usable >= 40 ? "text-warning" : "text-destructive";
  const bg = usable >= 70 ? "bg-success/10" : usable >= 40 ? "bg-warning/10" : "bg-destructive/10";
  const Icon = usable >= 70 ? CheckCircle : usable >= 40 ? AlertTriangle : XCircle;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bg} ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{usable}% Usable</span>
    </div>
  );
}

export default function ViabilityScanner() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-info" /> Viability Scanner
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Upload crop images to check health and get smart suggestions.</p>
      </div>

      {/* Scanner */}
      <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
        <div className="w-20 h-20 rounded-2xl bg-info/10 flex items-center justify-center mx-auto mb-4">
          <Camera className="w-9 h-9 text-info" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">Scan Your Crop</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
          Take a photo or upload an image of your crop. AI will analyze the condition and suggest the best course of action.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button className="bg-info text-info-foreground gap-2">
            <Camera className="w-4 h-4" /> Take Photo
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Upload Image
          </Button>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" /> Scan History
        </h2>
        <div className="space-y-3">
          {mockHistory.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-foreground">{h.crop}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.date}</p>
                </div>
                <DamageIndicator usable={h.usable} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Suggestion:</span>
                <span className="text-foreground font-medium">{h.suggestion}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
