import { useState, useEffect } from "react";
import { Bell, X, ShoppingBag, Users, FileCheck, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, any> = {
  buyer_match: ShoppingBag,
  fodder_request: Users,
  claim_update: FileCheck,
  carbon_credit: Leaf,
  general: Leaf,
};

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string | null;
  read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetch = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setNotifications(data);
    };
    fetch();

    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-muted text-foreground transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center animate-pulse-glow">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 bg-card rounded-xl shadow-elevated border border-border overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-display font-semibold text-foreground">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">No notifications yet</p>
                ) : notifications.map((n) => {
                  const Icon = iconMap[n.type] || Leaf;
                  return (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 ${n.read ? "bg-card" : "bg-primary/5"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "gradient-hero"}`}>
                        <Icon className={`w-4 h-4 ${n.read ? "text-muted-foreground" : "text-primary-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.description}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
