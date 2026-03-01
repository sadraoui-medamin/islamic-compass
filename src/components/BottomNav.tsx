import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Sun, HandHeart, CircleDot, Compass, Clock, Menu } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import type { TranslationKey } from "@/lib/translations";

interface BottomNavProps {
  onSettingsClick: () => void;
}

const navItems: { path: string; icon: typeof BookOpen; labelKey: TranslationKey }[] = [
  { path: "/", icon: BookOpen, labelKey: "nav.quran" },
  { path: "/adhkar", icon: Sun, labelKey: "nav.adhkar" },
  { path: "/dua", icon: HandHeart, labelKey: "nav.dua" },
  { path: "/tasbih", icon: CircleDot, labelKey: "nav.tasbih" },
  { path: "/qibla", icon: Compass, labelKey: "nav.qibla" },
  { path: "/prayer", icon: Clock, labelKey: "nav.prayer" },
];

const BottomNav = ({ onSettingsClick }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[3rem] ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? "islamic-gradient text-primary-foreground shadow-md" : ""}`}>
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
              </div>
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
            </button>
          );
        })}
        <button
          onClick={onSettingsClick}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-muted-foreground hover:text-foreground transition-all min-w-[3rem]"
        >
          <div className="p-1.5">
            <Menu className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-medium">{t("nav.more")}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
