const CDN_BASE = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";

export interface TafsirEdition {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export interface TafsirAyah {
  id: number;
  surah: number;
  ayah: number;
  text: string;
}

export const TAFSIR_EDITIONS: TafsirEdition[] = [
  { id: "ar-tafsir-ibn-kathir", name: "Ibn Kathir", nameAr: "ابن كثير", slug: "ar-tafsir-ibn-kathir" },
  { id: "ar-tafseer-al-tabari", name: "Tabari", nameAr: "الطبري", slug: "ar-tafseer-al-tabari" },
  { id: "ar-tafsir-al-baghawi", name: "Baghawi", nameAr: "البغوي", slug: "ar-tafsir-al-baghawi" },
  { id: "ar-tafsir-muyassar", name: "Muyassar", nameAr: "الميسر", slug: "ar-tafsir-muyassar" },
  { id: "ar-tafseer-al-saddi", name: "As-Sa'di", nameAr: "السعدي", slug: "ar-tafseer-al-saddi" },
];

// Cache downloaded tafsirs in localStorage
const CACHE_KEY = "tafsir-cache";

function getCachedTafsir(slug: string, surahNumber: number): TafsirAyah[] | null {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    return cache[`${slug}-${surahNumber}`] || null;
  } catch {
    return null;
  }
}

function setCachedTafsir(slug: string, surahNumber: number, data: TafsirAyah[]) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    cache[`${slug}-${surahNumber}`] = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full, clear old entries
    localStorage.removeItem(CACHE_KEY);
  }
}

export function isTafsirDownloaded(slug: string, surahNumber: number): boolean {
  return getCachedTafsir(slug, surahNumber) !== null;
}

export async function downloadTafsir(slug: string, surahNumber: number): Promise<TafsirAyah[]> {
  const cached = getCachedTafsir(slug, surahNumber);
  if (cached) return cached;

  const res = await fetch(`${CDN_BASE}/${slug}/${surahNumber}.json`);
  if (!res.ok) throw new Error(`Failed to download tafsir`);
  const data = await res.json();
  
  // The API returns { ayahs: [...] } or directly an array
  const ayahs: TafsirAyah[] = data.ayahs || data;
  setCachedTafsir(slug, surahNumber, ayahs);
  return ayahs;
}

export function getTafsirForAyah(slug: string, surahNumber: number, ayahNumber: number): string | null {
  const cached = getCachedTafsir(slug, surahNumber);
  if (!cached) return null;
  const ayah = cached.find(a => a.ayah === ayahNumber);
  return ayah?.text || null;
}

export function getDownloadedEditions(): string[] {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const slugs = new Set<string>();
    Object.keys(cache).forEach(key => {
      const slug = key.replace(/-\d+$/, '');
      slugs.add(slug);
    });
    return Array.from(slugs);
  } catch {
    return [];
  }
}
