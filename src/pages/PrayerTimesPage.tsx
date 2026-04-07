import { useState, useEffect } from "react";
import { Clock, MapPin, Bell, BellOff, Settings2, Volume2, Smartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { fetchPrayerTimes, CALCULATION_METHODS } from "@/lib/prayerApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/languageContext";

const ALARM_METHODS_KEY = "prayer-alarm-methods";
const PRAYER_NOTIF_KEY = "prayer-notifications";

function getEnabledPrayers(): string[] {
  try { return JSON.parse(localStorage.getItem(PRAYER_NOTIF_KEY) || "[]"); } catch { return []; }
}
function setEnabledPrayers(ids: string[]) {
  localStorage.setItem(PRAYER_NOTIF_KEY, JSON.stringify(ids));
}
function getAlarmMethods(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(ALARM_METHODS_KEY) || "{}"); } catch { return {}; }
}
function setAlarmMethods(m: Record<string, string>) {
  localStorage.setItem(ALARM_METHODS_KEY, JSON.stringify(m));
}

const PrayerTimesPage = () => {
  const { t, lang } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(t("prayer.detectingLocation"));
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [method, setMethod] = useState(2);
  const [enabledPrayers, setEnabledPrayersState] = useState<string[]>(getEnabledPrayers);
  const [alarmMethods, setAlarmMethodsState] = useState<Record<string, string>>(getAlarmMethods);
  const [alarmModalPrayer, setAlarmModalPrayer] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
            );
            const data = await res.json();
            setLocation(data.address?.city || data.address?.town || t("prayer.location"));
          } catch {
            setLocation(t("prayer.location"));
          }
        },
        () => setLocation(t("prayer.locationUnavailable"))
      );
    }
    return () => clearInterval(timer);
  }, []);

  const { data: prayerData, isLoading } = useQuery({
    queryKey: ["prayer-times", coords?.lat, coords?.lon, method],
    queryFn: () => fetchPrayerTimes(coords!.lat, coords!.lon, method),
    enabled: !!coords,
  });

  const timings = prayerData?.data?.timings;
  const hijri = prayerData?.data?.date?.hijri;

  const prayerList = timings
    ? [
        { key: "Fajr", name: "Fajr", arabic: "الفجر", time: timings.Fajr?.split(" ")[0] },
        { key: "Sunrise", name: "Sunrise", arabic: "الشروق", time: timings.Sunrise?.split(" ")[0] },
        { key: "Dhuhr", name: "Dhuhr", arabic: "الظهر", time: timings.Dhuhr?.split(" ")[0] },
        { key: "Asr", name: "Asr", arabic: "العصر", time: timings.Asr?.split(" ")[0] },
        { key: "Maghrib", name: "Maghrib", arabic: "المغرب", time: timings.Maghrib?.split(" ")[0] },
        { key: "Isha", name: "Isha", arabic: "العشاء", time: timings.Isha?.split(" ")[0] },
      ]
    : [];

  const now = currentTime;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let nextPrayerIdx = -1;
  for (let i = 0; i < prayerList.length; i++) {
    if (!prayerList[i].time) continue;
    const [h, m] = prayerList[i].time.split(":").map(Number);
    if (h * 60 + m > nowMinutes) {
      nextPrayerIdx = i;
      break;
    }
  }

  const handleNotifToggle = async (prayerKey: string) => {
    if (enabledPrayers.includes(prayerKey)) {
      // Turn off
      const updated = enabledPrayers.filter(p => p !== prayerKey);
      setEnabledPrayersState(updated);
      setEnabledPrayers(updated);
    } else {
      // Request permission if needed
      if ("Notification" in window && Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
      // Show alarm method modal
      setAlarmModalPrayer(prayerKey);
    }
  };

  const selectAlarmMethod = (methodType: string) => {
    if (!alarmModalPrayer) return;
    const updated = [...enabledPrayers, alarmModalPrayer];
    setEnabledPrayersState(updated);
    setEnabledPrayers(updated);
    const updatedMethods = { ...alarmMethods, [alarmModalPrayer]: methodType };
    setAlarmMethodsState(updatedMethods);
    setAlarmMethods(updatedMethods);
    setAlarmModalPrayer(null);
  };

  // Schedule notifications check
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted" || enabledPrayers.length === 0 || !timings) return;
    const interval = setInterval(() => {
      const n = new Date();
      const h = n.getHours();
      const m = n.getMinutes();
      const todayKey = `${n.toISOString().slice(0, 10)}-${h}-${m}`;
      const lastShown = localStorage.getItem("last-prayer-notif") || "";
      if (lastShown === todayKey) return;

      prayerList.forEach(p => {
        if (!enabledPrayers.includes(p.key) || !p.time) return;
        const [ph, pm] = p.time.split(":").map(Number);
        if (ph === h && pm === m) {
          localStorage.setItem("last-prayer-notif", todayKey);
          const alarmType = alarmMethods[p.key] || "device";
          new Notification(
            `🕌 ${p.arabic} — ${p.name}`,
            {
              body: alarmType === "adhan"
                ? (lang === "ar" ? "حان وقت الصلاة — الأذان" : `Time for ${p.name} prayer — Adhan`)
                : (lang === "ar" ? "حان وقت الصلاة" : `Time for ${p.name} prayer`),
              icon: "/favicon.ico",
            }
          );
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [enabledPrayers, timings, alarmMethods, lang]);

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("prayer.title")} subtitle={t("prayer.subtitle")} icon={<Clock className="w-6 h-6" />}>
        <div className="flex items-center gap-2 text-primary-foreground/60 text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
      </PageHeader>

      <div className="px-4 py-4">
        <div className="mb-4">
          <Select value={method.toString()} onValueChange={(v) => setMethod(Number(v))}>
            <SelectTrigger className="h-10 text-xs bg-card border-border">
              <Settings2 className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder={t("prayer.calculationMethod")} />
            </SelectTrigger>
            <SelectContent>
              {CALCULATION_METHODS.map((m) => (
                <SelectItem key={m.id} value={m.id.toString()}>
                  {m.name} — {m.desc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-5 rounded-2xl bg-card shadow-md text-center mb-4">
          <p className="text-3xl font-bold text-foreground">
            {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          {hijri && (
            <p className="text-xs text-primary mt-1 font-arabic">
              {hijri.day} {hijri.month.ar} {hijri.year} هـ
            </p>
          )}
          {nextPrayerIdx >= 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-light text-primary text-xs font-medium">
              <Bell className="w-3 h-3" />
              {t("prayer.next")} {prayerList[nextPrayerIdx].name} {t("prayer.at")} {prayerList[nextPrayerIdx].time}
            </div>
          )}
        </div>

        {isLoading || !timings ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {prayerList.map((prayer, i) => {
              const isNext = i === nextPrayerIdx;
              const isNotifOn = enabledPrayers.includes(prayer.key);
              const currentAlarmMethod = alarmMethods[prayer.key];

              return (
                <div
                  key={prayer.key}
                  className={`rounded-2xl transition-all animate-slide-up ${
                    isNext ? "islamic-gradient text-primary-foreground shadow-lg" : "bg-card"
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isNext ? "bg-primary-foreground/15" : "bg-emerald-light"
                      }`}>
                        <Clock className={`w-5 h-5 ${isNext ? "text-primary-foreground" : "text-primary"}`} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isNext ? "" : "text-foreground"}`}>{prayer.name}</p>
                        <p className={`font-arabic text-sm ${isNext ? "text-primary-foreground/70" : "text-primary"}`}>{prayer.arabic}</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${isNext ? "" : "text-foreground"}`}>{prayer.time}</span>
                  </div>

                  {/* Notification toggle row */}
                  <div className={`flex items-center justify-between px-4 pb-3 ${isNext ? "" : ""}`}>
                    <button
                      onClick={() => handleNotifToggle(prayer.key)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isNotifOn
                          ? isNext
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary/10 text-primary"
                          : isNext
                            ? "bg-primary-foreground/10 text-primary-foreground/60 hover:bg-primary-foreground/20"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {isNotifOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                      {isNotifOn
                        ? (lang === "ar" ? "التنبيه مفعّل" : "Notification On")
                        : (lang === "ar" ? "تنبيه" : "Notify me")}
                    </button>
                    {isNotifOn && currentAlarmMethod && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isNext ? "bg-primary-foreground/15 text-primary-foreground/80" : "bg-muted text-muted-foreground"
                      }`}>
                        {currentAlarmMethod === "adhan"
                          ? (lang === "ar" ? "🔊 أذان" : "🔊 Adhan")
                          : (lang === "ar" ? "📱 جهاز" : "📱 Device")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alarm Method Modal */}
      <Dialog open={!!alarmModalPrayer} onOpenChange={(open) => !open && setAlarmModalPrayer(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-arabic text-lg">
              {lang === "ar" ? "اختر نوع التنبيه" : "Choose Alarm Type"}
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              {lang === "ar"
                ? `تنبيه صلاة ${prayerList.find(p => p.key === alarmModalPrayer)?.arabic || ""}`
                : `Notification for ${alarmModalPrayer} prayer`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <button
              onClick={() => selectAlarmMethod("adhan")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition group border border-border"
            >
              <div className="w-12 h-12 rounded-xl islamic-gradient flex items-center justify-center shadow-md">
                <Volume2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 text-right" dir="rtl">
                <p className="font-arabic font-bold text-foreground text-base">الأذان</p>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "تنبيه بصوت الأذان" : "Adhan sound alert"}</p>
              </div>
            </button>

            <button
              onClick={() => selectAlarmMethod("device")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition group border border-border"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shadow-md">
                <Smartphone className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 text-right" dir="rtl">
                <p className="font-arabic font-bold text-foreground text-base">صوت الجهاز</p>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "تنبيه بصوت الجهاز الافتراضي" : "Default device sound"}</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrayerTimesPage;
