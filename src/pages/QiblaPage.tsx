import { useState, useEffect } from "react";
import { Compass, Navigation } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/lib/languageContext";

const QiblaPage = () => {
  const { t, lang } = useLanguage();
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const kaabaLat = 21.4225;
          const kaabaLng = 39.8262;
          const latRad = (lat * Math.PI) / 180;
          const lngRad = (lng * Math.PI) / 180;
          const kaabaLatRad = (kaabaLat * Math.PI) / 180;
          const kaabaLngRad = (kaabaLng * Math.PI) / 180;
          const dLng = kaabaLngRad - lngRad;
          const x = Math.sin(dLng) * Math.cos(kaabaLatRad);
          const y = Math.cos(latRad) * Math.sin(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(dLng);
          let angle = (Math.atan2(x, y) * 180) / Math.PI;
          if (angle < 0) angle += 360;
          setQiblaAngle(angle);
          setHasLocation(true);
        },
        () => setError(t("qibla.enableLocation"))
      );
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) setHeading(e.alpha);
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const rotation = qiblaAngle - heading;
  const isAligned = Math.abs(rotation % 360) < 15 || Math.abs(rotation % 360) > 345;

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("qibla.title")} subtitle={t("qibla.subtitle")} icon={<Compass className="w-6 h-6" />} />

      <div className="px-4 py-8 flex flex-col items-center">
        {error ? (
          <div className="text-center p-8 rounded-3xl bg-card shadow-lg border border-border">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            {/* Compass container */}
            <div className={`relative w-[280px] h-[280px] flex items-center justify-center transition-all duration-700 ${
              isAligned ? "drop-shadow-[0_0_60px_hsl(var(--primary)/0.35)]" : ""
            }`}>
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full">
                <svg viewBox="0 0 280 280" className="w-full h-full animate-[spin_120s_linear_infinite]">
                  {Array.from({ length: 72 }).map((_, i) => {
                    const angle = i * 5;
                    const r = 138;
                    const cx = 140 + r * Math.cos((angle - 90) * Math.PI / 180);
                    const cy = 140 + r * Math.sin((angle - 90) * Math.PI / 180);
                    const isMajor = i % 18 === 0;
                    const isMid = i % 6 === 0;
                    return (
                      <circle
                        key={i}
                        cx={cx} cy={cy}
                        r={isMajor ? 2 : isMid ? 1.2 : 0.6}
                        fill={isMajor ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        opacity={isMajor ? 0.8 : 0.4}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Main compass body */}
              <div
                className="w-[256px] h-[256px] rounded-full bg-card shadow-2xl border border-border/50 flex items-center justify-center transition-transform duration-300 ease-out relative overflow-hidden"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Subtle radial gradient background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/[0.03] to-transparent" />

                {/* Degree tick marks */}
                {Array.from({ length: 72 }).map((_, i) => {
                  const isMajor = i % 18 === 0;
                  const isMid = i % 6 === 0;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 left-1/2 -translate-x-1/2 origin-[50%_128px]"
                      style={{ transform: `rotate(${i * 5}deg)` }}
                    >
                      <div className={`w-[1px] rounded-full ${
                        isMajor ? "h-4 bg-primary/70 w-[2px]" : isMid ? "h-2.5 bg-muted-foreground/30" : "h-1.5 bg-border/60"
                      }`} />
                    </div>
                  );
                })}

                {/* Kaaba indicator */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                  <div className={`relative transition-all duration-500`}>
                    {/* Glow behind kaaba */}
                    {isAligned && (
                      <div className="absolute -inset-2 rounded-lg bg-primary/20 blur-md animate-pulse" />
                    )}
                    <div className={`w-6 h-6 rounded-[4px] rotate-45 transition-all duration-500 ${
                      isAligned ? "bg-primary shadow-lg shadow-primary/50 scale-110" : "bg-foreground/80"
                    }`}>
                      <div className="absolute inset-[2px] rounded-[2px] border border-primary-foreground/20" />
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-foreground/70 mt-1.5 tracking-wider uppercase">
                    {t("qibla.kaaba")}
                  </span>
                </div>

                {/* Cardinal directions */}
                <span className="absolute top-11 left-1/2 -translate-x-1/2 text-[11px] font-bold text-primary tracking-widest">N</span>
                <span className="absolute bottom-11 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-muted-foreground/60">S</span>
                <span className="absolute left-11 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground/60">W</span>
                <span className="absolute right-11 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground/60">E</span>

                {/* Inner rings */}
                <div className="w-[140px] h-[140px] rounded-full border border-border/30 flex items-center justify-center">
                  <div className="w-[100px] h-[100px] rounded-full border border-border/20 flex items-center justify-center">
                    {/* Center orb */}
                    <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-500 ${
                      isAligned
                        ? "islamic-gradient shadow-xl shadow-primary/30 scale-110"
                        : "islamic-gradient shadow-lg"
                    }`}>
                      <div className="relative">
                        <Navigation className={`w-7 h-7 text-primary-foreground transition-all duration-500 ${
                          isAligned ? "scale-110" : ""
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status section */}
            <div className="mt-8 text-center space-y-3">
              {isAligned && (
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-primary tracking-wide">
                    {lang === "ar" ? "أنت تواجه القبلة ✓" : "Facing Qibla ✓"}
                  </span>
                </div>
              )}

              <div>
                <p className="font-arabic text-3xl text-primary font-bold">القبلة</p>
                <p className="text-sm text-muted-foreground mt-2 tabular-nums">
                  {hasLocation ? `${Math.round(qiblaAngle)}${t("qibla.fromNorth")}` : t("qibla.gettingLocation")}
                </p>
              </div>

              <p className="text-xs text-muted-foreground/70 max-w-[220px] mx-auto leading-relaxed">
                {t("qibla.pointPhone")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QiblaPage;
