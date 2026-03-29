import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, MapPin, Star, MessageCircle, Wheat, Bug as Cow, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  user_id: string;
  post_type: string;
  title: string;
  description: string | null;
  quantity_kg: number | null;
  location: string | null;
  status: string;
  created_at: string;
  
}

export default function AgroConnect() {
  const [filter, setFilter] = useState<"all" | "waste_available" | "fodder_needed">("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [loc, setLoc] = useState("");
  const [postType, setPostType] = useState<"waste_available" | "fodder_needed" | "manure_exchange">("waste_available");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    let q = supabase.from("community_posts").select("*").eq("status", "active").order("created_at", { ascending: false });
    if (filter === "waste_available") q = q.eq("post_type", "waste_available");
    if (filter === "fodder_needed") q = q.eq("post_type", "fodder_needed");
    const { data } = await q;
    if (data) setPosts(data as Post[]);
  };

  useEffect(() => { fetchPosts(); }, [filter]);

  const handlePost = async () => {
    if (!user || !title.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      post_type: postType,
      title: title.trim(),
      description: desc.trim() || null,
      quantity_kg: qty ? Number(qty) : null,
      location: loc.trim() || null,
    });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Posted!", description: "Your post is now live." });
      setShowForm(false);
      setTitle(""); setDesc(""); setQty(""); setLoc("");
      fetchPosts();
    }
    setLoading(false);
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  const openWhatsApp = (post: Post) => {
    const msg = encodeURIComponent(`Hi, I'm interested in your post: "${post.title}" on Former Rescue AI.`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> AgroConnect Community
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Exchange crop waste for manure. Build a circular ecosystem.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gradient-hero text-primary-foreground shadow-glow-primary gap-2">
          <Plus className="w-4 h-4" /> Post Availability
        </Button>
      </div>

      {/* Post Form Modal */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-5 shadow-elevated border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-semibold text-foreground">Create Post</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              {(["waste_available", "fodder_needed", "manure_exchange"] as const).map((t) => (
                <button key={t} onClick={() => setPostType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${postType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {t === "waste_available" ? "🌾 Waste" : t === "fodder_needed" ? "🐄 Fodder" : "♻️ Exchange"}
                </button>
              ))}
            </div>
            <Input placeholder="Title (e.g., 50kg weeds available)" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-muted" />
            <Textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-muted" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Quantity (kg)" type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="bg-muted" />
              <Input placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} className="bg-muted" />
            </div>
            <Button onClick={handlePost} disabled={loading || !title.trim()} className="gradient-hero text-primary-foreground w-full">
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {([["all", "All"], ["waste_available", "🌾 Farmers"], ["fodder_needed", "🐄 Cattle Owners"]] as const).map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground shadow-glow-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No posts yet. Be the first to post!</div>
        ) : posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${post.post_type === "fodder_needed" ? "gradient-gold" : "gradient-hero"}`}>
                  {post.post_type === "fodder_needed" ? <Cow className="w-5 h-5 text-secondary-foreground" /> : <Wheat className="w-5 h-5 text-primary-foreground" />}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{post.profiles?.full_name || "Farmer"}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {post.location && <><MapPin className="w-3 h-3" /> {post.location}</>}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.post_type === "waste_available" ? "bg-success/10 text-success"
                : post.post_type === "fodder_needed" ? "bg-warning/10 text-warning"
                : "bg-info/10 text-info"
              }`}>
                {post.post_type === "waste_available" ? "Available" : post.post_type === "fodder_needed" ? "Seeking" : "Exchange"}
              </span>
            </div>
            <p className="text-foreground mt-3 font-medium">{post.title}</p>
            {post.description && <p className="text-sm text-muted-foreground mt-1">{post.description}</p>}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {post.quantity_kg && <span>{post.quantity_kg}kg</span>}
              <span>{timeAgo(post.created_at)}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => openWhatsApp(post)} className="gradient-hero text-primary-foreground gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
