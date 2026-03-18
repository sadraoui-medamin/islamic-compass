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
          <div className="text-center p-6 rounded-2xl bg-card shadow-md">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            {/* Outer glow when aligned */}
            <div className={`relative w-72 h-72 flex items-center justify-center transition-all duration-700 ${
              isAligned ? "drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)]" : ""
            }`}>
              {/* Decorative outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_60s_linear_infinite]" />

              {/* Compass */}
              <div
                className="w-64 h-64 rounded-full bg-card shadow-2xl border-2 border-border flex items-center justify-center transition-transform duration-300 ease-out relative"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Tick marks */}
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1 left-1/2 -translate-x-1/2 origin-[50%_126px]"
                    style={{ transform: `rotate(${i * 10}deg)` }}
                  >
                    <div className={`w-0.5 rounded-full ${
                      i % 9 === 0 ? "h-3 bg-primary" : "h-1.5 bg-border"
                    }`} />
                  </div>
                ))}

                {/* Kaaba indicator at top */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                  <div className={`w-5 h-5 rounded-sm rotate-45 transition-colors duration-500 ${
                    isAligned ? "bg-primary shadow-lg shadow-primary/40" : "bg-foreground"
                  }`} />
                  <span className="text-[9px] font-bold text-foreground mt-1 -rotate-45">{t("qibla.kaaba")}</span>
                </div>

                {/* Cardinal directions */}
                <span className="absolute top-9 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">N</span>
                <span className="absolute bottom-9 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">S</span>
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">W</span>
                <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">E</span>

                {/* Inner circles */}
                <div className="w-36 h-36 rounded-full border border-border/60 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                    isAligned ? "islamic-gradient scale-110" : "islamic-gradient"
                  }`}>
                    <Navigation className={`w-8 h-8 text-primary-foreground transition-transform duration-500 ${
                      isAligned ? "scale-110" : ""
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-8 text-center">
              {isAligned && (
                <div className="mb-3 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25 inline-flex items-center gap-2 animate-fade-in">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary">
                    {lang === "ar" ? "أنت تواجه القبلة ✓" : "Facing Qibla ✓"}
                  </span>
                </div>
              )}
              <p className="font-arabic text-2xl text-primary">القبلة</p>
              <p className="text-sm text-muted-foreground mt-1">
                {hasLocation ? `${Math.round(qiblaAngle)}${t("qibla.fromNorth")}` : t("qibla.gettingLocation")}
              </p>
              <p className="text-xs text-muted-foreground mt-3 max-w-[250px]">
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
