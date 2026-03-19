import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Home, HandHeart, Clock, Compass, CircleDot } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import type { TranslationKey } from "@/lib/translations";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

interface BottomNavProps {
  onSettingsClick: () => void;
}

const leftItems: { path: string; icon: typeof BookOpen; labelKey: TranslationKey }[] = [
  { path: "/quran", icon: BookOpen, labelKey: "nav.quran" },
  { path: "/dua", icon: HandHeart, labelKey: "nav.dua" },
];

const rightItems: { path: string; icon: typeof BookOpen; labelKey: TranslationKey }[] = [
  { path: "/tasbih", icon: CircleDot, labelKey: "nav.tasbih" },
  { path: "/prayer", icon: Clock, labelKey: "nav.prayer" },
];

const BottomNav = ({ onSettingsClick }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const visible = useScrollDirection();

  const renderItem = (item: { path: string; icon: typeof BookOpen; labelKey: TranslationKey }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[3.2rem] ${
          isActive
            ? "text-primary scale-105"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${isActive ? "islamic-gradient text-primary-foreground shadow-md" : ""}`}>
          <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
        </div>
        <span className="text-[9px] font-medium leading-tight">{t(item.labelKey)}</span>
      </button>
    );
  };

  const isHomeActive = location.pathname === "/";
  const isQiblaActive = location.pathname === "/qibla";

  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="mx-2 mb-2 rounded-2xl border border-border/40"
        style={{
          background: "hsl(var(--card) / 0.65)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          boxShadow: "0 -4px 30px hsl(var(--primary) / 0.06), 0 2px 16px hsl(0 0% 0% / 0.1)",
        }}
      >
        <div className="flex items-center justify-around py-1 relative">
          {leftItems.map(renderItem)}

          {/* Qibla */}
          <button
            onClick={() => navigate("/qibla")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[3.2rem] ${
              isQiblaActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isQiblaActive ? "islamic-gradient text-primary-foreground shadow-md" : ""}`}>
              <Compass className="w-[18px] h-[18px]" strokeWidth={isQiblaActive ? 2.2 : 1.8} />
            </div>
            <span className="text-[9px] font-medium leading-tight">{t("nav.qibla")}</span>
          </button>

          {/* Center Home button */}
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-0.5 -mt-6"
          >
            <div
              className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isHomeActive
                  ? "islamic-gradient scale-110"
                  : "islamic-gradient opacity-85 hover:opacity-100 hover:scale-105"
              }`}
              style={{
                boxShadow: isHomeActive
                  ? "0 4px 20px hsl(var(--primary) / 0.45), 0 0 0 3px hsl(var(--card) / 0.5)"
                  : "0 4px 14px hsl(var(--primary) / 0.2), 0 0 0 3px hsl(var(--card) / 0.5)",
              }}
            >
              <Home className="w-5 h-5 text-primary-foreground" strokeWidth={2.2} />
            </div>
            <span className={`text-[9px] font-semibold mt-0.5 ${isHomeActive ? "text-primary" : "text-muted-foreground"}`}>
              {t("nav.home")}
            </span>
          </button>

          {rightItems.map(renderItem)}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
