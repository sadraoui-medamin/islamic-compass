import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

const REMINDER_TIMES = [
  { id: "fajr", timeAr: "الفجر", timeEn: "Fajr (5:00 AM)", hour: 5, min: 0 },
  { id: "morning", timeAr: "أذكار الصباح", timeEn: "Morning Adhkar (7:00 AM)", hour: 7, min: 0 },
  { id: "dhuhr", timeAr: "الظهر", timeEn: "Dhuhr (12:30 PM)", hour: 12, min: 30 },
  { id: "evening", timeAr: "أذكار المساء", timeEn: "Evening Adhkar (5:00 PM)", hour: 17, min: 0 },
  { id: "night", timeAr: "قراءة ليلية", timeEn: "Night Reading (9:00 PM)", hour: 21, min: 0 },
];

function getEnabledReminders(): string[] {
  return JSON.parse(localStorage.getItem("reminders-enabled") || "[]");
}

function setEnabledReminders(ids: string[]) {
  localStorage.setItem("reminders-enabled", JSON.stringify(ids));
}

const DailyReminder = () => {
  const { lang } = useLanguage();
  const [enabled, setEnabled] = useState<string[]>([]);
  const [permGranted, setPermGranted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setEnabled(getEnabledReminders());
    if ("Notification" in window) {
      setPermGranted(Notification.permission === "granted");
    }
    // Show banner if no reminders set yet
    const dismissed = localStorage.getItem("reminder-banner-dismissed");
    if (!dismissed && getEnabledReminders().length === 0) {
      setShowBanner(true);
    }
  }, []);

  // Schedule check every minute
  useEffect(() => {
    if (!permGranted || enabled.length === 0) return;
    const interval = setInterval(() => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const lastShown = localStorage.getItem("last-reminder-shown") || "";
      const todayKey = `${now.toISOString().slice(0, 10)}-${h}-${m}`;
      if (lastShown === todayKey) return;

      REMINDER_TIMES.forEach((r) => {
        if (enabled.includes(r.id) && r.hour === h && r.min === m) {
          localStorage.setItem("last-reminder-shown", todayKey);
          new Notification(lang === "ar" ? "تذكير 🕌" : "Reminder 🕌", {
            body: lang === "ar" ? r.timeAr : r.timeEn,
            icon: "/favicon.ico",
          });
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [permGranted, enabled, lang]);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermGranted(result === "granted");
  };

  const toggleReminder = async (id: string) => {
    if (!permGranted) {
      await requestPermission();
    }
    const updated = enabled.includes(id)
      ? enabled.filter((e) => e !== id)
      : [...enabled, id];
    setEnabled(updated);
    setEnabledReminders(updated);
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem("reminder-banner-dismissed", "true");
  };

  return (
    <div>
      {/* Suggestion banner */}
      {showBanner && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-3">
          <Bell className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">
              {lang === "ar" ? "فعّل التذكيرات اليومية" : "Enable daily reminders"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {lang === "ar" ? "لا تنسَ أذكارك وقراءتك" : "Never miss your adhkar & reading"}
            </p>
          </div>
          <button onClick={dismissBanner} className="p-1 rounded-lg hover:bg-muted transition">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">
          {lang === "ar" ? "التذكيرات" : "Reminders"}
        </h2>
      </div>

      <div className="space-y-1.5">
        {REMINDER_TIMES.map((r) => {
          const isOn = enabled.includes(r.id);
          return (
            <button
              key={r.id}
              onClick={() => toggleReminder(r.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                isOn ? "bg-primary/10 border border-primary/20" : "bg-card hover:bg-muted"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all ${isOn ? "islamic-gradient" : "bg-muted"}`}>
                {isOn ? (
                  <Bell className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <BellOff className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <span className="flex-1 text-xs font-medium text-foreground text-left">
                {lang === "ar" ? r.timeAr : r.timeEn}
              </span>
              <div className={`w-8 h-4.5 rounded-full transition-all flex items-center px-0.5 ${
                isOn ? "bg-primary justify-end" : "bg-muted-foreground/30 justify-start"
              }`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all`} />
              </div>
            </button>
          );
        })}
      </div>

      {!permGranted && enabled.length > 0 && (
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          {lang === "ar"
            ? "⚠️ يجب السماح بالإشعارات من المتصفح"
            : "⚠️ Allow browser notifications for reminders to work"}
        </p>
      )}
    </div>
  );
};

export default DailyReminder;
