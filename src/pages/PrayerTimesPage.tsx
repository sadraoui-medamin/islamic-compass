import { useState, useEffect } from "react";
import { Clock, MapPin, Bell, Settings2, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { fetchPrayerTimes, CALCULATION_METHODS } from "@/lib/prayerApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PrayerTimesPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("Detecting location...");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [method, setMethod] = useState(2);

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
            setLocation(data.address?.city || data.address?.town || "Your Location");
          } catch {
            setLocation("Your Location");
          }
        },
        () => setLocation("Location unavailable")
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
        { name: "Fajr", arabic: "الفجر", time: timings.Fajr?.split(" ")[0] },
        { name: "Sunrise", arabic: "الشروق", time: timings.Sunrise?.split(" ")[0] },
        { name: "Dhuhr", arabic: "الظهر", time: timings.Dhuhr?.split(" ")[0] },
        { name: "Asr", arabic: "العصر", time: timings.Asr?.split(" ")[0] },
        { name: "Maghrib", arabic: "المغرب", time: timings.Maghrib?.split(" ")[0] },
        { name: "Isha", arabic: "العشاء", time: timings.Isha?.split(" ")[0] },
      ]
    : [];

  // Determine next prayer
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

  return (
    <div className="animate-fade-in">
      <PageHeader title="Prayer Times" subtitle="أوقات الصلاة" icon={<Clock className="w-6 h-6" />}>
        <div className="flex items-center gap-2 text-primary-foreground/60 text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
      </PageHeader>

      <div className="px-4 py-4">
        {/* Method selector */}
        <div className="mb-4">
          <Select value={method.toString()} onValueChange={(v) => setMethod(Number(v))}>
            <SelectTrigger className="h-10 text-xs bg-card border-border">
              <Settings2 className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Calculation method" />
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

        {/* Current time card */}
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
              Next: {prayerList[nextPrayerIdx].name} at {prayerList[nextPrayerIdx].time}
            </div>
          )}
        </div>

        {/* Prayer times list */}
        {isLoading || !timings ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {prayerList.map((prayer, i) => (
              <div
                key={prayer.name}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all animate-slide-up ${
                  i === nextPrayerIdx
                    ? "islamic-gradient text-primary-foreground shadow-lg"
                    : "bg-card"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    i === nextPrayerIdx ? "bg-primary-foreground/15" : "bg-emerald-light"
                  }`}>
                    <Clock className={`w-5 h-5 ${i === nextPrayerIdx ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${i === nextPrayerIdx ? "" : "text-foreground"}`}>{prayer.name}</p>
                    <p className={`font-arabic text-sm ${i === nextPrayerIdx ? "text-primary-foreground/70" : "text-primary"}`}>{prayer.arabic}</p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${i === nextPrayerIdx ? "" : "text-foreground"}`}>{prayer.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimesPage;
