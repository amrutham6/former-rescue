import { useEffect, useState } from "react";
import { Users, Recycle, Leaf, ScanLine, Warehouse, FileCheck, Sprout, Mic, TrendingUp, IndianRupee, BarChart3, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FeatureCard } from "@/components/FeatureCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [stats, setStats] = useState({ posts: 0, credits: 0, scans: 0, claims: 0 });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [posts, carbon, scans, claims] = await Promise.all([
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("carbon_activities").select("credits_earned").eq("user_id", user.id),
        supabase.from("viability_scans").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("insurance_claims").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      const totalCredits = carbon.data?.reduce((s, a) => s + a.credits_earned, 0) || 0;
      setStats({
        posts: posts.count || 0,
        credits: totalCredits,
        scans: scans.count || 0,
        claims: claims.count || 0,
      });
    };
    load();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="gradient-hero rounded-2xl p-8 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Former Rescue AI</span>
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-bold">
          Welcome, {user?.user_metadata?.full_name || "Farmer"}! 🌾
        </h1>
        <p className="text-primary-foreground/70 mt-2 max-w-xl text-sm lg:text-base">
          Convert crop loss into profit using AI, community collaboration, and sustainability.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">You've earned {stats.credits} carbon credits so far</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Community Posts" value={String(stats.posts)} subtitle="Your active posts" icon={Users} variant="primary" />
        <StatCard title="Carbon Credits" value={String(stats.credits)} subtitle={`≈ ₹${stats.credits * 50}`} icon={Leaf} variant="gold" />
        <StatCard title="Crop Scans" value={String(stats.scans)} subtitle="AI analyses done" icon={ScanLine} variant="earth" />
        <StatCard title="Insurance Claims" value={String(stats.claims)} subtitle="Claims filed" icon={FileCheck} variant="info" />
      </div>

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
