import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/lib/languageContext";

const QiblaPage = () => {
  const { t } = useLanguage();
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

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("qibla.title")} subtitle={t("qibla.subtitle")} icon={<Compass className="w-6 h-6" />} />

      <div className="px-4 py-8 flex flex-col items-center">
        {error ? (
          <div className="text-center p-6 rounded-2xl bg-card">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <div className="relative w-64 h-64">
              <div
                className="w-full h-full rounded-full bg-card shadow-xl border-4 border-border flex items-center justify-center transition-transform duration-200"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-sm bg-foreground rotate-45" />
                  <span className="text-[10px] font-bold text-foreground mt-1">{t("qibla.kaaba")}</span>
                </div>
                <span className="absolute top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">N</span>
                <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">S</span>
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">W</span>
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">E</span>

                <div className="w-32 h-32 rounded-full border-2 border-border flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full islamic-gradient flex items-center justify-center shadow-md">
                    <Compass className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
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
