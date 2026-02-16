import { useState, useEffect } from "react";
import { Clock, MapPin, Bell } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface PrayerTime {
  name: string;
  arabic: string;
  time: string;
  isNext: boolean;
}

const PrayerTimesPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("Detecting location...");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
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

  // Demo prayer times
  const prayers: PrayerTime[] = [
    { name: "Fajr", arabic: "الفجر", time: "05:12", isNext: false },
    { name: "Sunrise", arabic: "الشروق", time: "06:38", isNext: false },
    { name: "Dhuhr", arabic: "الظهر", time: "12:45", isNext: false },
    { name: "Asr", arabic: "العصر", time: "15:52", isNext: true },
    { name: "Maghrib", arabic: "المغرب", time: "18:21", isNext: false },
    { name: "Isha", arabic: "العشاء", time: "19:45", isNext: false },
  ];

  const nextPrayer = prayers.find((p) => p.isNext);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Prayer Times" subtitle="أوقات الصلاة" icon={<Clock className="w-6 h-6" />}>
        <div className="flex items-center gap-2 text-primary-foreground/60 text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
      </PageHeader>

      <div className="px-4 py-4">
        {/* Current time card */}
        <div className="p-5 rounded-2xl bg-card shadow-md text-center mb-4">
          <p className="text-3xl font-bold text-foreground">
            {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          {nextPrayer && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-light text-primary text-xs font-medium">
              <Bell className="w-3 h-3" />
              Next: {nextPrayer.name} at {nextPrayer.time}
            </div>
          )}
        </div>

        {/* Prayer times list */}
        <div className="space-y-2">
          {prayers.map((prayer, i) => (
            <div
              key={prayer.name}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all animate-slide-up ${
                prayer.isNext
                  ? "islamic-gradient text-primary-foreground shadow-lg"
                  : "bg-card"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  prayer.isNext ? "bg-primary-foreground/15" : "bg-emerald-light"
                }`}>
                  <Clock className={`w-5 h-5 ${prayer.isNext ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${prayer.isNext ? "" : "text-foreground"}`}>{prayer.name}</p>
                  <p className={`font-arabic text-sm ${prayer.isNext ? "text-primary-foreground/70" : "text-primary"}`}>{prayer.arabic}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${prayer.isNext ? "" : "text-foreground"}`}>{prayer.time}</span>
                <button className={`p-1.5 rounded-lg transition-colors ${
                  prayer.isNext ? "hover:bg-primary-foreground/10" : "hover:bg-muted"
                }`}>
                  <Bell className={`w-4 h-4 ${prayer.isNext ? "text-primary-foreground/60" : "text-muted-foreground"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesPage;
