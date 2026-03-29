import { Users, Recycle, Leaf, ScanLine, Warehouse, FileCheck, Sprout, Mic, TrendingUp, IndianRupee, BarChart3, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FeatureCard } from "@/components/FeatureCard";

const stats = [
  { title: "Waste Converted", value: "2.4T", subtitle: "This month", icon: Recycle, variant: "primary" as const },
  { title: "Revenue Earned", value: "₹18K", subtitle: "+12% from last month", icon: IndianRupee, variant: "gold" as const },
  { title: "Carbon Credits", value: "156", subtitle: "CO₂ saved: 2.1 tons", icon: Leaf, variant: "earth" as const },
  { title: "Active Matches", value: "23", subtitle: "Buyers & cattle owners", icon: BarChart3, variant: "info" as const },
];

const features = [
  { title: "AgroConnect", description: "Connect with cattle owners. Exchange waste for manure.", icon: Users, path: "/agroconnect", color: "primary" as const },
  { title: "Urban Waste Matcher", description: "Sell damaged crops to hotels & industries.", icon: Recycle, path: "/waste-matcher", color: "secondary" as const },
  { title: "Carbon Cash", description: "Earn money from eco-friendly farming practices.", icon: Leaf, path: "/carbon-cash", color: "success" as const },
  { title: "Viability Scanner", description: "AI-powered crop health analysis from photos.", icon: ScanLine, path: "/viability-scanner", color: "info" as const },
  { title: "Silage Bank", description: "Convert waste crops into valuable animal feed.", icon: Warehouse, path: "/silage-bank", color: "accent" as const },
  { title: "Claim Rocket", description: "Fast-track your crop insurance claims.", icon: FileCheck, path: "/claim-rocket", color: "warning" as const },
  { title: "Intercrop Wizard", description: "AI crop suggestions for maximum land use.", icon: Sprout, path: "/intercrop-wizard", color: "primary" as const },
  { title: "Rescuer Voice", description: "Speak in your language, get AI help instantly.", icon: Mic, path: "/voice-assistant", color: "secondary" as const },
];

export default function Index() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="gradient-hero rounded-2xl p-8 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Former Rescue AI</span>
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-bold">
          Convert Crop Loss into Profit
        </h1>
        <p className="text-primary-foreground/70 mt-2 max-w-xl text-sm lg:text-base">
          AI-powered smart farming system connecting farmers, buyers, and cattle owners. 
          Reduce waste, earn income, and protect the environment.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Your farm efficiency increased by 24% this month</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </div>
  );
}
