const BASE_URL = "https://api.alquran.cloud/v1";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
  translation?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy", nameAr: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahmaan As-Sudais", nameAr: "عبدالرحمن السديس" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)", nameAr: "عبدالباسط عبدالصمد" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", nameAr: "محمود خليل الحصري" },
  { id: "ar.minshawi", name: "Mohamed Siddiq El-Minshawi", nameAr: "محمد صديق المنشاوي" },
];

// Hafs is the default (quran-uthmani), Qalun uses quran-simple
export const READING_VERSIONS = [
  { id: "quran-uthmani", name: "Hafs", nameAr: "حفص" },
  { id: "quran-simple", name: "Qalun", nameAr: "قالون" },
];

export async function fetchAllSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE_URL}/surah`);
  if (!res.ok) throw new Error("Failed to fetch surahs");
  const data = await res.json();
  return data.data;
}

export async function fetchSurah(
  surahNumber: number,
  edition: string = "quran-uthmani"
): Promise<SurahDetail> {
  const res = await fetch(`${BASE_URL}/surah/${surahNumber}/${edition}`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber}`);
  const data = await res.json();
  return data.data;
}

export async function fetchSurahWithAudio(
  surahNumber: number,
  textEdition: string = "quran-uthmani",
  audioEdition: string = "ar.alafasy",
  translationEdition: string = "en.asad"
): Promise<{ text: SurahDetail; audio: SurahDetail; translation: SurahDetail }> {
  const res = await fetch(
    `${BASE_URL}/surah/${surahNumber}/editions/${textEdition},${audioEdition},${translationEdition}`
  );
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber}`);
  const data = await res.json();
  return {
    text: data.data[0],
    audio: data.data[1],
    translation: data.data[2],
  };
}
