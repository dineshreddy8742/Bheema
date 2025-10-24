import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import CropMonitor from "@/pages/CropMonitor";
import CropRecommendation from "@/pages/CropRecommendation";
import DiseaseDetector from "@/pages/DiseaseDetector";
import MarketTrends from "@/pages/MarketTrends";
import GovernmentSchemes from "@/pages/GovernmentSchemes";
import Settings from "@/pages/Settings";
import GroceryMarketplace from "@/pages/GroceryMarketplace";
import Orders from "@/pages/Orders";
import Artifacts from "@/pages/Artifacts";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import ColdStorage from "@/pages/ColdStorage";
import Community from "@/pages/Community";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import eventBus from "@/lib/eventBus";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = (event: CustomEvent<{ path: string }>) => {
      navigate(event.detail.path);
    };

    const handleAutofill = (event: CustomEvent<{ field: string; value: any }>) => {
      const input = document.querySelector(`[name="${event.detail.field}"]`) as HTMLInputElement;
      if (input) {
        input.value = event.detail.value;
      }
    };

    eventBus.on("navigate", handleNavigate);
    eventBus.on("autofill-field", handleAutofill);

    return () => {
      eventBus.remove("navigate", handleNavigate);
      eventBus.remove("autofill-field", handleAutofill);
    };
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PlanProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <VoiceAssistant />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/index" element={<Index />} />
              <Route path="/crop-monitor" element={<CropMonitor />} />
              <Route path="/crop-recommendation" element={<CropRecommendation />} />
              <Route path="/disease-detector" element={<DiseaseDetector />} />
              <Route path="/market-trends" element={<MarketTrends />} />
              <Route path="/government-schemes" element={<GovernmentSchemes />} />
              <Route path="/grocery-marketplace" element={<GroceryMarketplace />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cold-storage" element={<ColdStorage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/help" element={<Help />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </PlanProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
