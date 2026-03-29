import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AgroConnect from "./pages/AgroConnect";
import WasteMatcher from "./pages/WasteMatcher";
import CarbonCash from "./pages/CarbonCash";
import ViabilityScanner from "./pages/ViabilityScanner";
import SilageBank from "./pages/SilageBank";
import ClaimRocket from "./pages/ClaimRocket";
import IntercropWizard from "./pages/IntercropWizard";
import VoiceAssistant from "./pages/VoiceAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/auth" element={<AuthRoute />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/agroconnect" element={<ProtectedRoute><AgroConnect /></ProtectedRoute>} />
              <Route path="/waste-matcher" element={<ProtectedRoute><WasteMatcher /></ProtectedRoute>} />
              <Route path="/carbon-cash" element={<ProtectedRoute><CarbonCash /></ProtectedRoute>} />
              <Route path="/viability-scanner" element={<ProtectedRoute><ViabilityScanner /></ProtectedRoute>} />
              <Route path="/silage-bank" element={<ProtectedRoute><SilageBank /></ProtectedRoute>} />
              <Route path="/claim-rocket" element={<ProtectedRoute><ClaimRocket /></ProtectedRoute>} />
              <Route path="/intercrop-wizard" element={<ProtectedRoute><IntercropWizard /></ProtectedRoute>} />
              <Route path="/voice-assistant" element={<ProtectedRoute><VoiceAssistant /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
