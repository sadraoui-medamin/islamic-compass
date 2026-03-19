import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/languageContext";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import QuranPage from "./pages/QuranPage";
import DuaAdhkarPage from "./pages/DuaAdhkarPage";
import TasbihPage from "./pages/TasbihPage";
import QiblaPage from "./pages/QiblaPage";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import AchievementsPage from "./pages/AchievementsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/quran" element={<QuranPage />} />
              <Route path="/dua" element={<DuaAdhkarPage />} />
              <Route path="/tasbih" element={<TasbihPage />} />
              <Route path="/qibla" element={<QiblaPage />} />
              <Route path="/prayer" element={<PrayerTimesPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
