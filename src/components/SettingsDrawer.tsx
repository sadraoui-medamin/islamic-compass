import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart, Globe, Palette, Bell, Info, MessageCircle, Star, Shield } from "lucide-react";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { icon: Heart, label: "Donate to Support Us", desc: "Help us keep the app free" },
  { icon: Globe, label: "Language", desc: "العربية · English · Français" },
  { icon: Palette, label: "Theme", desc: "Light, Dark, Eye Care" },
  { icon: Bell, label: "Notifications", desc: "Prayer & Adhkar reminders" },
  { icon: Info, label: "About", desc: "App information" },
  { icon: MessageCircle, label: "Contact Us", desc: "Send feedback" },
  { icon: Star, label: "Rate Our App", desc: "Leave a review" },
  { icon: Shield, label: "Privacy Policy", desc: "Your data & privacy" },
];

const SettingsDrawer = ({ open, onOpenChange }: SettingsDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 bg-card border-border p-0 overflow-y-auto">
        <SheetHeader className="islamic-gradient p-6 pb-8">
          <SheetTitle className="text-primary-foreground text-xl font-bold">Settings</SheetTitle>
          <p className="text-primary-foreground/70 text-sm">Customize your experience</p>
        </SheetHeader>
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-light flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="p-6 text-center text-xs text-muted-foreground">
          <p className="font-arabic text-lg text-primary mb-1">بسم الله الرحمن الرحيم</p>
          <p>Islamic App v1.0</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
