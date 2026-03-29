import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, MapPin, Star, MessageCircle, Wheat, Bug as Cow } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockPosts = [
  { id: 1, user: "Ramesh K.", location: "Hyderabad", type: "farmer", item: "50kg weeds available", rating: 4.5, time: "2 hrs ago", status: "available" },
  { id: 2, user: "Suresh M.", location: "Warangal", type: "cattle", item: "Need 100kg fodder", rating: 4.8, time: "4 hrs ago", status: "seeking" },
  { id: 3, user: "Lakshmi P.", location: "Vijayawada", type: "farmer", item: "Damaged paddy - 200kg", rating: 4.2, time: "6 hrs ago", status: "available" },
  { id: 4, user: "Venkat R.", location: "Guntur", type: "cattle", item: "Can exchange manure", rating: 4.9, time: "1 day ago", status: "exchange" },
];

export default function AgroConnect() {
  const [filter, setFilter] = useState<"all" | "farmer" | "cattle">("all");

  const filtered = filter === "all" ? mockPosts : mockPosts.filter((p) => p.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> AgroConnect Community
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Exchange crop waste for manure. Build a circular ecosystem.</p>
        </div>
        <Button className="gradient-hero text-primary-foreground shadow-glow-primary gap-2">
          <Plus className="w-4 h-4" /> Post Availability
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "farmer", "cattle"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground shadow-glow-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f === "all" ? "All" : f === "farmer" ? "🌾 Farmers" : "🐄 Cattle Owners"}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="grid gap-4">
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  post.type === "farmer" ? "gradient-hero" : "gradient-gold"
                }`}>
                  {post.type === "farmer" ? (
                    <Wheat className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Cow className="w-5 h-5 text-secondary-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{post.user}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {post.location}
                    <span>•</span>
                    <Star className="w-3 h-3 text-secondary" /> {post.rating}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.status === "available" ? "bg-success/10 text-success"
                : post.status === "seeking" ? "bg-warning/10 text-warning"
                : "bg-info/10 text-info"
              }`}>
                {post.status === "available" ? "Available" : post.status === "seeking" ? "Seeking" : "Exchange"}
              </span>
            </div>
            <p className="text-foreground mt-3 font-medium">{post.item}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>{post.time}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="gradient-hero text-primary-foreground gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" /> Connect
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                View Profile
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
