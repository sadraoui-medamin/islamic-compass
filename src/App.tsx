import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import QuranPage from "./pages/QuranPage";
import AdhkarPage from "./pages/AdhkarPage";
import DuaPage from "./pages/DuaPage";
import TasbihPage from "./pages/TasbihPage";
import QiblaPage from "./pages/QiblaPage";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<QuranPage />} />
            <Route path="/adhkar" element={<AdhkarPage />} />
            <Route path="/dua" element={<DuaPage />} />
            <Route path="/tasbih" element={<TasbihPage />} />
            <Route path="/qibla" element={<QiblaPage />} />
            <Route path="/prayer" element={<PrayerTimesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
