import { useState } from "react";
import { Bell, X, ShoppingBag, Users, FileCheck, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockNotifications = [
  { id: 1, type: "buyer", title: "New Buyer Match", desc: "Hotel Grand needs 200kg damaged ragi", time: "2 min ago", read: false, icon: ShoppingBag },
  { id: 2, type: "fodder", title: "Fodder Request", desc: "Cattle owner Ramesh needs 50kg weeds", time: "15 min ago", read: false, icon: Users },
  { id: 3, type: "claim", title: "Insurance Update", desc: "Your claim #1234 is being processed", time: "1 hr ago", read: false, icon: FileCheck },
  { id: 4, type: "carbon", title: "Carbon Credits Earned", desc: "You earned 12 credits from composting", time: "3 hr ago", read: true, icon: Leaf },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
      >
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
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors ${
                      n.read ? "bg-card" : "bg-primary/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      n.read ? "bg-muted" : "gradient-hero"
                    }`}>
                      <n.icon className={`w-4 h-4 ${n.read ? "text-muted-foreground" : "text-primary-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.desc}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
