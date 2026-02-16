import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Sun, HandHeart, CircleDot, Compass, Clock, Menu } from "lucide-react";

interface BottomNavProps {
  onSettingsClick: () => void;
}

const navItems = [
  { path: "/", icon: BookOpen, label: "Quran" },
  { path: "/adhkar", icon: Sun, label: "Adhkar" },
  { path: "/dua", icon: HandHeart, label: "Dua" },
  { path: "/tasbih", icon: CircleDot, label: "Tasbih" },
  { path: "/qibla", icon: Compass, label: "Qibla" },
  { path: "/prayer", icon: Clock, label: "Prayer" },
];

const BottomNav = ({ onSettingsClick }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

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
              <span className="text-[10px] font-medium">{item.label}</span>
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
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
