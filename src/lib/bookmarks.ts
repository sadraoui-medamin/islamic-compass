export interface Bookmark {
  surahNumber: number;
  surahName: string;
  surahNameAr: string;
  ayahNumber: number;
  ayahText: string;
  timestamp: number;
}

export interface LastRead {
  surahNumber: number;
  surahName: string;
  surahNameAr: string;
  ayahIndex: number;
  timestamp: number;
}

const BOOKMARKS_KEY = "quran-bookmarks";
const LAST_READ_KEY = "quran-last-read";

export function getBookmarks(): Bookmark[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addBookmark(bookmark: Bookmark): Bookmark[] {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some(
    (b) => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber
  );
  if (!exists) {
    bookmarks.unshift(bookmark);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
  return bookmarks;
}

export function removeBookmark(surahNumber: number, ayahNumber: number): Bookmark[] {
  const bookmarks = getBookmarks().filter(
    (b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
  );
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return bookmarks;
}

export function isBookmarked(surahNumber: number, ayahNumber: number): boolean {
  return getBookmarks().some(
    (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
  );
}

export function getLastRead(): LastRead | null {
  try {
    const stored = localStorage.getItem(LAST_READ_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setLastRead(lastRead: LastRead): void {
  localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
}
