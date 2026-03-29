import { useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, Upload, Camera, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockClaims = [
  { id: "#CR-1234", crop: "Paddy", status: "processing", date: "Mar 25", amount: "₹15,000" },
  { id: "#CR-1201", crop: "Cotton", status: "approved", date: "Mar 10", amount: "₹28,500" },
  { id: "#CR-1189", crop: "Sugarcane", status: "submitted", date: "Feb 28", amount: "₹12,000" },
];

export default function ClaimRocket() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <FileCheck className="w-7 h-7 text-warning" /> Claim Rocket
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Simplify insurance claims with AI-powered documentation.</p>
      </div>

      {/* New Claim Form */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4">File New Claim</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="Full Name" className="bg-muted border-border" />
          <Input placeholder="Mobile Number" className="bg-muted border-border" />
          <Input placeholder="Aadhar Number" className="bg-muted border-border" />
          <Input placeholder="Date of Birth" type="date" className="bg-muted border-border" />
          <Input placeholder="Crop Type" className="bg-muted border-border" />
          <Input placeholder="Estimated Loss (₹)" className="bg-muted border-border" />
        </div>
        <div className="flex gap-3 mt-4">
          <Button className="gradient-gold text-secondary-foreground gap-2">
            <Camera className="w-4 h-4" /> Upload Damage Photo
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Auto-fill from Scan
          </Button>
        </div>
        <Button className="mt-4 gradient-hero text-primary-foreground shadow-glow-primary w-full sm:w-auto">
          Submit Claim
        </Button>
      </div>

      {/* Existing Claims */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Your Claims</h2>
        <div className="space-y-3">
          {mockClaims.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                c.status === "approved" ? "bg-success/10" : c.status === "processing" ? "bg-warning/10" : "bg-info/10"
              }`}>
                {c.status === "approved" ? <CheckCircle className="w-5 h-5 text-success" />
                  : c.status === "processing" ? <Clock className="w-5 h-5 text-warning" />
                  : <AlertCircle className="w-5 h-5 text-info" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{c.id} • {c.crop}</p>
                <p className="text-xs text-muted-foreground">{c.date}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-foreground">{c.amount}</p>
                <p className={`text-xs font-medium capitalize ${
                  c.status === "approved" ? "text-success" : c.status === "processing" ? "text-warning" : "text-info"
                }`}>{c.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
