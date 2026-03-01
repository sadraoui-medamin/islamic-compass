import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Heart,
  Globe,
  Palette,
  Bell,
  Info,
  MessageCircle,
  Star,
  Shield,
  ChevronRight,
  ArrowLeft,
  Sun,
  Moon,
  Eye,
  Check,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/languageContext";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SubPage = null | "theme" | "language" | "notifications" | "about" | "contact" | "donate";

const languages = [
  { code: "ar" as const, label: "العربية", flag: "🇸🇦" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
  { code: "fr" as const, label: "Français", flag: "🇫🇷" },
];

const SettingsDrawer = ({ open, onOpenChange }: SettingsDrawerProps) => {
  const [subPage, setSubPage] = useState<SubPage>(null);
  const { lang, setLang, t } = useLanguage();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("app-theme") || "light";
    }
    return "light";
  });
  const [notifs, setNotifs] = useState({
    prayer: true,
    adhkar: true,
    morning: true,
    evening: true,
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "eyecare");
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "eyecare") root.classList.add("eyecare");
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const handleClose = () => {
    setSubPage(null);
    onOpenChange(false);
  };

  const menuItems = [
    { icon: Heart, label: t("settings.donate"), desc: t("settings.donateDesc"), page: "donate" as SubPage },
    // Hide language option when Arabic is selected
    ...(lang !== "ar" ? [{ icon: Globe, label: t("settings.language"), desc: languages.find((l) => l.code === lang)?.label || "English", page: "language" as SubPage }] : []),
    { icon: Palette, label: t("settings.theme"), desc: theme === "dark" ? t("settings.themeDark") : theme === "eyecare" ? t("settings.themeEyecare") : t("settings.themeLight"), page: "theme" as SubPage },
    { icon: Bell, label: t("settings.notifications"), desc: t("settings.notificationsDesc"), page: "notifications" as SubPage },
    { icon: Info, label: t("settings.about"), desc: t("settings.aboutDesc"), page: "about" as SubPage },
    { icon: MessageCircle, label: t("settings.contact"), desc: t("settings.contactDesc"), page: "contact" as SubPage },
    { icon: Star, label: t("settings.rate"), desc: t("settings.rateDesc"), page: null as SubPage },
    { icon: Shield, label: t("settings.privacy"), desc: t("settings.privacyDesc"), page: null as SubPage },
  ];

  const SubPageHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 p-4 border-b border-border">
      <button onClick={() => setSubPage(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
  );

  const renderSubPage = () => {
    switch (subPage) {
      case "theme":
        return (
          <div>
            <SubPageHeader title={t("settings.theme")} />
            <div className="p-4 space-y-2">
              {[
                { key: "light", label: t("settings.themeLight"), desc: t("settings.themeLightDesc"), icon: Sun },
                { key: "dark", label: t("settings.themeDark"), desc: t("settings.themeDarkDesc"), icon: Moon },
                { key: "eyecare", label: t("settings.themeEyecare"), desc: t("settings.themeEyecareDesc"), icon: Eye },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTheme(item.key)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all ${
                    theme === item.key ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    theme === item.key ? "islamic-gradient text-primary-foreground" : "bg-emerald-light"
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {theme === item.key && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        );

      case "language":
        return (
          <div>
            <SubPageHeader title={t("settings.language")} />
            <div className="p-4 space-y-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all ${
                    lang === l.code ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <p className="text-sm font-medium text-foreground flex-1 text-left">{l.label}</p>
                  {lang === l.code && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div>
            <SubPageHeader title={t("settings.notifications")} />
            <div className="p-4 space-y-3">
              {[
                { key: "prayer" as const, label: t("settings.prayerTimes"), desc: t("settings.prayerTimesDesc") },
                { key: "adhkar" as const, label: t("settings.dailyAdhkar"), desc: t("settings.dailyAdhkarDesc") },
                { key: "morning" as const, label: t("settings.morningReminder"), desc: t("settings.morningReminderDesc") },
                { key: "evening" as const, label: t("settings.eveningReminder"), desc: t("settings.eveningReminderDesc") },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch
                    checked={notifs[n.key]}
                    onCheckedChange={(val) => setNotifs((prev) => ({ ...prev, [n.key]: val }))}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "about":
        return (
          <div>
            <SubPageHeader title={t("settings.about")} />
            <div className="p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl islamic-gradient mx-auto flex items-center justify-center shadow-lg">
                <span className="text-3xl text-primary-foreground font-arabic">﷽</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{t("settings.aboutTitle")}</h3>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("settings.aboutBody")}
              </p>
              <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
                <p className="font-arabic text-lg text-primary">بسم الله الرحمن الرحيم</p>
                <p>© 2026 Islamic App. All rights reserved.</p>
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div>
            <SubPageHeader title={t("settings.contact")} />
            <div className="p-4 space-y-3">
              <div className="p-4 rounded-xl bg-muted/50 text-center space-y-2">
                <Mail className="w-8 h-8 text-primary mx-auto" />
                <p className="text-sm text-foreground font-medium">{t("settings.contactBody")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.contactSubtext")}</p>
              </div>
              <a
                href="mailto:support@islamicapp.com"
                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-muted transition-colors border border-border"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">support@islamicapp.com</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
              </a>
            </div>
          </div>
        );

      case "donate":
        return (
          <div>
            <SubPageHeader title={t("settings.donate")} />
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t("settings.supportApp")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("settings.donateBody")}
              </p>
              <p className="font-arabic text-primary text-base">جزاكم الله خيراً</p>
              <div className="space-y-2 pt-2">
                {["$5", "$10", "$25", "$50"].map((amount) => (
                  <button
                    key={amount}
                    className="w-full p-3 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium text-foreground"
                  >
                    {t("settings.donateAmount")} {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-80 bg-card border-border p-0 overflow-y-auto">
        {subPage ? (
          renderSubPage()
        ) : (
          <>
            <SheetHeader className="islamic-gradient p-6 pb-8">
              <SheetTitle className="text-primary-foreground text-xl font-bold">{t("settings.title")}</SheetTitle>
              <p className="text-primary-foreground/70 text-sm">{t("settings.customize")}</p>
            </SheetHeader>
            <div className="p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.page && setSubPage(item.page)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-light flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                  </div>
                  {item.page && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>
              ))}
            </div>
            <div className="p-6 text-center text-xs text-muted-foreground">
              <p className="font-arabic text-lg text-primary mb-1">بسم الله الرحمن الرحيم</p>
              <p>Islamic App v1.0</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
