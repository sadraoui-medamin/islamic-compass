import { fetchSurahWithAudio, RECITERS, type Surah } from "./quranApi";

const DB_NAME = "quran-offline-audio";
const STORE_NAME = "surah-audio";
const DB_VERSION = 1;

export interface OfflineSurah {
  surahNumber: number;
  surahName: string;
  surahNameAr: string;
  reciterId: string;
  reciterName: string;
  downloadedAt: number;
  audioBlobs: { ayahNumber: number; blob: Blob }[];
  totalAyahs: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: ["surahNumber", "reciterId"] });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveOfflineSurah(surah: OfflineSurah): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(surah);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineSurah(surahNumber: number, reciterId: string): Promise<OfflineSurah | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get([surahNumber, reciterId]);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllOfflineSurahs(): Promise<OfflineSurah[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteOfflineSurah(surahNumber: number, reciterId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete([surahNumber, reciterId]);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function downloadSurahForOffline(
  surahNumber: number,
  surahName: string,
  surahNameAr: string,
  reciterId: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const reciter = RECITERS.find(r => r.id === reciterId);
  const result = await fetchSurahWithAudio(surahNumber, "quran-uthmani", reciterId);
  const ayahs = result.audio.ayahs.filter(a => a.audio);
  const total = ayahs.length;
  const audioBlobs: { ayahNumber: number; blob: Blob }[] = [];

  for (let i = 0; i < ayahs.length; i++) {
    const res = await fetch(ayahs[i].audio!);
    const blob = await res.blob();
    audioBlobs.push({ ayahNumber: ayahs[i].numberInSurah, blob });
    onProgress?.(i + 1, total);
  }

  await saveOfflineSurah({
    surahNumber,
    surahName,
    surahNameAr,
    reciterId,
    reciterName: reciter?.name || reciterId,
    downloadedAt: Date.now(),
    audioBlobs,
    totalAyahs: total,
  });
}
