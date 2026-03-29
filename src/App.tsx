import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout><Index /></DashboardLayout>} path="/" />
          <Route element={<DashboardLayout><AgroConnect /></DashboardLayout>} path="/agroconnect" />
          <Route element={<DashboardLayout><WasteMatcher /></DashboardLayout>} path="/waste-matcher" />
          <Route element={<DashboardLayout><CarbonCash /></DashboardLayout>} path="/carbon-cash" />
          <Route element={<DashboardLayout><ViabilityScanner /></DashboardLayout>} path="/viability-scanner" />
          <Route element={<DashboardLayout><SilageBank /></DashboardLayout>} path="/silage-bank" />
          <Route element={<DashboardLayout><ClaimRocket /></DashboardLayout>} path="/claim-rocket" />
          <Route element={<DashboardLayout><IntercropWizard /></DashboardLayout>} path="/intercrop-wizard" />
          <Route element={<DashboardLayout><VoiceAssistant /></DashboardLayout>} path="/voice-assistant" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
