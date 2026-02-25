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
  surah?: { number: number; name: string; englishName: string };
  page?: number;
  juz?: number;
  hizbQuarter?: number;
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

export interface JuzInfo {
  number: number;
  name: string;
  nameAr: string;
  startSurah: string;
  startAyah: number;
}

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy", nameAr: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahmaan As-Sudais", nameAr: "عبدالرحمن السديس" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)", nameAr: "عبدالباسط عبدالصمد" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", nameAr: "محمود خليل الحصري" },
  { id: "ar.minshawi", name: "Mohamed Siddiq El-Minshawi", nameAr: "محمد صديق المنشاوي" },
  { id: "ar.mahermuaiqly", name: "Maher Al-Muaiqly", nameAr: "ماهر المعيقلي" },
  { id: "ar.saaborehab", name: "Saab Or Rehab", nameAr: "صعب أو رحاب" },
  { id: "ar.hanirifai", name: "Hani Ar-Rifai", nameAr: "هاني الرفاعي" },
];

export const READING_VERSIONS = [
  { id: "quran-uthmani", name: "Hafs", nameAr: "حفص" },
  { id: "quran-simple", name: "Qalun", nameAr: "قالون" },
];

// Static Juz data
export const JUZ_DATA: JuzInfo[] = [
  { number: 1, name: "Alif Lam Mim", nameAr: "الٓمٓ", startSurah: "Al-Fatiha", startAyah: 1 },
  { number: 2, name: "Sayaqool", nameAr: "سَيَقُولُ", startSurah: "Al-Baqarah", startAyah: 142 },
  { number: 3, name: "Tilka Ar-Rusul", nameAr: "تِلْكَ ٱلرُّسُلُ", startSurah: "Al-Baqarah", startAyah: 253 },
  { number: 4, name: "Lan Tanaloo", nameAr: "لَن تَنَالُوا", startSurah: "Aal-Imran", startAyah: 92 },
  { number: 5, name: "Wal Muhsanat", nameAr: "وَٱلْمُحْصَنَٰتُ", startSurah: "An-Nisa", startAyah: 24 },
  { number: 6, name: "La Yuhibbu", nameAr: "لَا يُحِبُّ", startSurah: "An-Nisa", startAyah: 148 },
  { number: 7, name: "Wa Iza Sami'oo", nameAr: "وَإِذَا سَمِعُوا", startSurah: "Al-Ma'idah", startAyah: 82 },
  { number: 8, name: "Wa Lau Annana", nameAr: "وَلَوْ أَنَّنَا", startSurah: "Al-An'am", startAyah: 111 },
  { number: 9, name: "Qal Al-Mala'u", nameAr: "قَالَ ٱلْمَلَأُ", startSurah: "Al-A'raf", startAyah: 88 },
  { number: 10, name: "Wa A'lamoo", nameAr: "وَٱعْلَمُوا", startSurah: "Al-Anfal", startAyah: 41 },
  { number: 11, name: "Ya'tazeroon", nameAr: "يَعْتَذِرُونَ", startSurah: "At-Tawbah", startAyah: 93 },
  { number: 12, name: "Wa Ma Min Dabbah", nameAr: "وَمَا مِن دَابَّةٍ", startSurah: "Hud", startAyah: 6 },
  { number: 13, name: "Wa Ma Ubarri'u", nameAr: "وَمَا أُبَرِّئُ", startSurah: "Yusuf", startAyah: 53 },
  { number: 14, name: "Rubama", nameAr: "رُبَمَا", startSurah: "Al-Hijr", startAyah: 1 },
  { number: 15, name: "Subhanalladhi", nameAr: "سُبْحَٰنَ ٱلَّذِى", startSurah: "Al-Isra", startAyah: 1 },
  { number: 16, name: "Qal Alam", nameAr: "قَالَ أَلَمْ", startSurah: "Al-Kahf", startAyah: 75 },
  { number: 17, name: "Iqtaraba", nameAr: "ٱقْتَرَبَ", startSurah: "Al-Anbiya", startAyah: 1 },
  { number: 18, name: "Qad Aflaha", nameAr: "قَدْ أَفْلَحَ", startSurah: "Al-Mu'minun", startAyah: 1 },
  { number: 19, name: "Wa Qalalladeena", nameAr: "وَقَالَ ٱلَّذِينَ", startSurah: "Al-Furqan", startAyah: 21 },
  { number: 20, name: "A'man Khalaq", nameAr: "أَمَّنْ خَلَقَ", startSurah: "An-Naml", startAyah: 56 },
  { number: 21, name: "Otlu Ma Oohi", nameAr: "ٱتْلُ مَا أُوحِيَ", startSurah: "Al-Ankabut", startAyah: 45 },
  { number: 22, name: "Wa Man Yaqnut", nameAr: "وَمَن يَقْنُتْ", startSurah: "Al-Ahzab", startAyah: 31 },
  { number: 23, name: "Wa Mali", nameAr: "وَمَا لِيَ", startSurah: "Ya-Sin", startAyah: 22 },
  { number: 24, name: "Faman Azlamu", nameAr: "فَمَنْ أَظْلَمُ", startSurah: "Az-Zumar", startAyah: 32 },
  { number: 25, name: "Ilayhi Yuraddu", nameAr: "إِلَيْهِ يُرَدُّ", startSurah: "Fussilat", startAyah: 47 },
  { number: 26, name: "Ha Mim", nameAr: "حمٓ", startSurah: "Al-Ahqaf", startAyah: 1 },
  { number: 27, name: "Qala Fama Khatbukum", nameAr: "قَالَ فَمَا خَطْبُكُمْ", startSurah: "Adh-Dhariyat", startAyah: 31 },
  { number: 28, name: "Qad Sami'a", nameAr: "قَدْ سَمِعَ", startSurah: "Al-Mujadila", startAyah: 1 },
  { number: 29, name: "Tabaraka Alladhi", nameAr: "تَبَٰرَكَ ٱلَّذِى", startSurah: "Al-Mulk", startAyah: 1 },
  { number: 30, name: "Amma Yatasaa'aloon", nameAr: "عَمَّ يَتَسَاءَلُونَ", startSurah: "An-Naba", startAyah: 1 },
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

export async function fetchJuz(
  juzNumber: number,
  edition: string = "quran-uthmani"
): Promise<{ number: number; ayahs: Ayah[] }> {
  const res = await fetch(`${BASE_URL}/juz/${juzNumber}/${edition}`);
  if (!res.ok) throw new Error(`Failed to fetch juz ${juzNumber}`);
  const data = await res.json();
  return data.data;
}

export async function fetchPage(
  pageNumber: number,
  edition: string = "quran-uthmani"
): Promise<{ number: number; ayahs: Ayah[] }> {
  const res = await fetch(`${BASE_URL}/page/${pageNumber}/${edition}`);
  if (!res.ok) throw new Error(`Failed to fetch page ${pageNumber}`);
  const data = await res.json();
  return data.data;
}

export async function searchQuran(
  query: string,
  edition: string = "en.asad"
): Promise<{ count: number; matches: Array<{ number: number; text: string; surah: { number: number; name: string; englishName: string }; numberInSurah: number; edition: { identifier: string } }> }> {
  const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}/${edition}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return data.data;
}

export async function searchQuranArabic(
  query: string,
  edition: string = "quran-uthmani"
): Promise<{ count: number; matches: Array<{ number: number; text: string; surah: { number: number; name: string; englishName: string }; numberInSurah: number }> }> {
  const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}/${edition}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return data.data;
}
