import { useState } from "react";
import { BookOpen, Search, ChevronRight, Loader2, Bookmark, Clock, Trash2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import SurahReader from "@/components/SurahReader";
import { fetchAllSurahs, type Surah } from "@/lib/quranApi";
import { getBookmarks, getLastRead, removeBookmark, type Bookmark as BookmarkType } from "@/lib/bookmarks";
import { Skeleton } from "@/components/ui/skeleton";

const QuranPage = () => {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [startAyah, setStartAyah] = useState<number | undefined>();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(getBookmarks);
  const lastRead = getLastRead();

  const { data: surahs = [], isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchAllSurahs,
  });

  const filtered = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.number.toString() === search
  );

  const openSurah = (surah: Surah, ayah?: number) => {
    setSelectedSurah(surah);
    setStartAyah(ayah);
  };

  const handleBack = () => {
    setSelectedSurah(null);
    setStartAyah(undefined);
    setBookmarks(getBookmarks());
  };

  if (selectedSurah) {
    return (
      <SurahReader
        surahNumber={selectedSurah.number}
        surahName={selectedSurah.englishName}
        surahNameAr={selectedSurah.name}
        startAyah={startAyah}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Al-Quran" subtitle="القرآن الكريم" icon={<BookOpen className="w-6 h-6" />}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
            <input
              type="text"
              placeholder="Search surah or ayah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 text-sm border-0 outline-none focus:bg-primary-foreground/15 transition"
            />
          </div>
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`px-3 rounded-xl transition ${showBookmarks ? "bg-primary-foreground/20" : "bg-primary-foreground/10 hover:bg-primary-foreground/15"}`}
          >
            <Bookmark className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </PageHeader>

      <div className="px-4 py-4 space-y-2">
        {/* Last read card */}
        {lastRead && !showBookmarks && (
          <button
            onClick={() => {
              const s = surahs.find((s) => s.number === lastRead.surahNumber);
              if (s) openSurah(s, lastRead.ayahIndex);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl islamic-gradient text-primary-foreground shadow-lg mb-2 animate-slide-up"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs opacity-70">Continue Reading</p>
              <p className="font-semibold text-sm">{lastRead.surahName}</p>
              <p className="text-xs opacity-80 font-arabic">{lastRead.surahNameAr} · Ayah {lastRead.ayahIndex + 1}</p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        )}

        {/* Bookmarks view */}
        {showBookmarks && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Bookmarked Verses ({bookmarks.length})</h3>
              <button onClick={() => setShowBookmarks(false)} className="p-1">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {bookmarks.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No bookmarks yet</p>
                <p className="text-xs">Tap the bookmark icon on any verse to save it</p>
              </div>
            )}
            {bookmarks.map((bm, i) => (
              <div key={`${bm.surahNumber}-${bm.ayahNumber}`} className="flex items-center gap-3 p-4 rounded-2xl bg-card animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                <button
                  onClick={() => {
                    const s = surahs.find((s) => s.number === bm.surahNumber);
                    if (s) { setShowBookmarks(false); openSurah(s, bm.ayahNumber); }
                  }}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-semibold text-foreground">{bm.surahName} · Ayah {bm.ayahNumber}</p>
                  <p className="text-xs text-muted-foreground font-arabic mt-1" dir="rtl">{bm.ayahText}...</p>
                </button>
                <button
                  onClick={() => {
                    removeBookmark(bm.surahNumber, bm.ayahNumber);
                    setBookmarks(getBookmarks());
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Surah list */}
        {!showBookmarks && (
          <>
            {isLoading && Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}

            {filtered.map((surah, i) => (
              <button
                key={surah.number}
                onClick={() => openSurah(surah)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-200 animate-slide-up group"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {surah.number}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground text-sm">{surah.englishName}</p>
                  <p className="text-xs text-muted-foreground">{surah.numberOfAyahs} verses · {surah.revelationType}</p>
                </div>
                <p className="font-arabic text-xl text-primary">{surah.name}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default QuranPage;
