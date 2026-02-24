const BASE_URL = "https://api.aladhan.com/v1";

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerApiResponse {
  data: {
    timings: PrayerTimings;
    date: {
      hijri: {
        day: string;
        month: { en: string; ar: string };
        year: string;
      };
      gregorian: {
        date: string;
        weekday: { en: string };
      };
    };
    meta: {
      method: { id: number; name: string };
    };
  };
}

export const CALCULATION_METHODS = [
  { id: 2, name: "ISNA", desc: "Islamic Society of North America" },
  { id: 1, name: "University of Islamic Sciences, Karachi" , desc: "Karachi" },
  { id: 3, name: "MWL", desc: "Muslim World League" },
  { id: 4, name: "Umm Al-Qura", desc: "Makkah" },
  { id: 5, name: "Egyptian", desc: "Egyptian General Authority" },
  { id: 7, name: "Tehran", desc: "Institute of Geophysics, Tehran" },
  { id: 9, name: "Kuwait", desc: "Kuwait" },
  { id: 12, name: "UOIF", desc: "Union des Organisations Islamiques de France" },
  { id: 15, name: "Diyanet", desc: "Diyanet İşleri Başkanlığı, Turkey" },
];

export async function fetchPrayerTimes(
  lat: number,
  lon: number,
  method: number = 2
): Promise<PrayerApiResponse> {
  const res = await fetch(
    `${BASE_URL}/timings?latitude=${lat}&longitude=${lon}&method=${method}`
  );
  if (!res.ok) throw new Error("Failed to fetch prayer times");
  return res.json();
}
