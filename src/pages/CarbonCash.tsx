import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, TrendingUp, Award, ArrowUpRight, Recycle, Flame, TreePine, Droplets, Sprout as SproutIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const activityIcons: Record<string, any> = {
  composting: Recycle,
  no_burning: Flame,
  tree_planting: TreePine,
  water_conservation: Droplets,
  organic_farming: SproutIcon,
};

const co2Defaults: Record<string, number> = {
  composting: 800,
  no_burning: 1200,
  tree_planting: 500,
  water_conservation: 300,
  organic_farming: 600,
};

interface Activity {
  id: string;
  activity_type: string;
  co2_saved_kg: number;
  credits_earned: number;
  description: string | null;
  created_at: string;
}

export default function CarbonCash() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [actType, setActType] = useState<string>("composting");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActivities = async () => {
    if (!user) return;
    const { data } = await supabase.from("carbon_activities").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setActivities(data);
  };

  useEffect(() => { fetchActivities(); }, [user]);

  const totalCredits = activities.reduce((s, a) => s + a.credits_earned, 0);
  const totalCo2 = activities.reduce((s, a) => s + a.co2_saved_kg, 0);
  const earnings = totalCredits * 50; // ₹50 per credit

  const logActivity = async () => {
    if (!user) return;
    setLoading(true);
    const co2 = co2Defaults[actType] || 500;
    const credits = Math.round(co2 / 25);
    const { error } = await supabase.from("carbon_activities").insert({
      user_id: user.id,
      activity_type: actType,
      co2_saved_kg: co2,
      credits_earned: credits,
      description: desc.trim() || null,
    });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Activity Logged!", description: `Earned ${credits} carbon credits` });
      setShowForm(false);
      setDesc("");
      fetchActivities();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Leaf className="w-7 h-7 text-success" /> Carbon Cash
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Earn money for eco-friendly farming practices.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <p className="text-sm text-muted-foreground">Total Credits</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">{totalCredits}</p>
          <div className="flex items-center gap-1 text-success text-sm mt-2"><TrendingUp className="w-4 h-4" /> Lifetime</div>
        </div>
        <div className="gradient-hero rounded-2xl p-5 text-primary-foreground">
          <p className="text-sm opacity-80">CO₂ Saved</p>
          <p className="font-display text-3xl font-bold mt-1">{(totalCo2 / 1000).toFixed(1)} tons</p>
          <p className="text-xs opacity-60 mt-2">≈ {Math.round(totalCo2 / 25)} trees equivalent</p>
        </div>
        <div className="gradient-gold rounded-2xl p-5 text-secondary-foreground">
          <p className="text-sm opacity-80">Estimated Earnings</p>
          <p className="font-display text-3xl font-bold mt-1">₹{earnings.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-sm opacity-80 mt-2"><Award className="w-4 h-4" /> Ready to withdraw</div>
        </div>
      </div>

      <Button onClick={() => setShowForm(!showForm)} className="gradient-hero text-primary-foreground shadow-glow-primary gap-2">
        {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {showForm ? "Cancel" : "Log Eco Activity"}
      </Button>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card border border-border space-y-3">
          <h3 className="font-display font-semibold text-foreground">Log Activity</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(co2Defaults).map((t) => {
              const Icon = activityIcons[t];
              return (
                <button key={t} onClick={() => setActType(t)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${actType === t ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="w-3.5 h-3.5" /> {t.replace("_", " ")}
                </button>
              );
            })}
          </div>
          <Input placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-muted" />
          <Button onClick={logActivity} disabled={loading} className="bg-success text-success-foreground w-full">
            {loading ? "Logging..." : `Log & Earn ~${Math.round((co2Defaults[actType] || 500) / 25)} Credits`}
          </Button>
        </motion.div>
      )}

      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Activity History</h2>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No activities yet. Start logging eco-friendly actions!</p>
        ) : (
          <div className="space-y-3">
            {activities.map((a, i) => {
              const Icon = activityIcons[a.activity_type] || Leaf;
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground capitalize">{a.activity_type.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()} • {(a.co2_saved_kg / 1000).toFixed(1)}T CO₂</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-success flex items-center gap-1">+{a.credits_earned} <ArrowUpRight className="w-3.5 h-3.5" /></p>
                    <p className="text-xs text-muted-foreground">credits</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
