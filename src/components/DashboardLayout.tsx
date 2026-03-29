import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Recycle, Leaf, ScanLine, Warehouse,
  FileCheck, Sprout, Mic, Bell, Menu, X, ChevronRight, Globe, LogOut
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationBell } from "./NotificationBell";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agroconnect", label: "AgroConnect", icon: Users },
  { path: "/waste-matcher", label: "Waste Matcher", icon: Recycle },
  { path: "/carbon-cash", label: "Carbon Cash", icon: Leaf },
  { path: "/viability-scanner", label: "Viability Scanner", icon: ScanLine },
  { path: "/silage-bank", label: "Silage Bank", icon: Warehouse },
  { path: "/claim-rocket", label: "Claim Rocket", icon: FileCheck },
  { path: "/intercrop-wizard", label: "Intercrop Wizard", icon: Sprout },
  { path: "/voice-assistant", label: "Rescuer Voice", icon: Mic },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Leaf className="w-5 h-5 text-sidebar" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-sidebar-foreground">Rescue AI</h1>
              <p className="text-xs text-sidebar-foreground/60">Smart Farming</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-sidebar-foreground/60">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"}`} />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-sidebar-primary" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user?.email?.[0]?.toUpperCase() || "F"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.user_metadata?.full_name || user?.email || "Farmer"}</p>
                <p className="text-xs text-sidebar-foreground/50">{user?.email}</p>
              </div>
              <button onClick={signOut} className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <LanguageSelector />
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
