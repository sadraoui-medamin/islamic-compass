import { useState, useMemo } from "react";
import { BookOpen, Search, ChevronRight, Bookmark, Clock, Trash2, X, BookText, Layers, FileText, BookOpenCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import SurahReader from "@/components/SurahReader";
import { fetchAllSurahs, searchQuran, searchQuranArabic, JUZ_DATA, type Surah } from "@/lib/quranApi";
import { getBookmarks, getLastRead, removeBookmark, type Bookmark as BookmarkType } from "@/lib/bookmarks";
import { Skeleton } from "@/components/ui/skeleton";
import PageReader from "@/components/PageReader";

type TabType = "surah" | "juz" | "page";
type DisplayMode = "mushaf" | "list";

const QuranPage = () => {
  const [search, setSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [startAyah, setStartAyah] = useState<number | undefined>();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(getBookmarks);
  const [activeTab, setActiveTab] = useState<TabType>("surah");
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("mushaf");
  const lastRead = getLastRead();

  const { data: surahs = [], isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchAllSurahs,
  });

  // Search in translation
  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["quran-search", search],
    queryFn: () => {
      const isArabic = /[\u0600-\u06FF]/.test(search);
      return isArabic ? searchQuranArabic(search) : searchQuran(search);
    },
    enabled: search.length >= 3,
    staleTime: 60000,
  });

  const filteredSurahs = useMemo(() => {
    if (search.length >= 3 && searchResults) return [];
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(search.toLowerCase()) ||
        s.name.includes(search) ||
        s.number.toString() === search ||
        s.englishNameTranslation.toLowerCase().includes(search.toLowerCase())
    );
  }, [surahs, search, searchResults]);

  const openSurah = (surah: Surah, ayah?: number) => {
    if (displayMode === "mushaf") {
      // In mushaf mode, open the page reader at page 1 of the surah
      // For simplicity, just open surah reader since page mapping isn't available
      setSelectedSurah(surah);
      setStartAyah(ayah);
    } else {
      setSelectedSurah(surah);
      setStartAyah(ayah);
    }
  };

  const handleBack = () => {
    setSelectedSurah(null);
    setSelectedPage(null);
    setSelectedJuz(null);
    setStartAyah(undefined);
    setBookmarks(getBookmarks());
  };

  // Default mushaf mode: show page reader directly
  if (displayMode === "mushaf" && !selectedSurah && selectedPage === null && selectedJuz === null && !search && !showBookmarks) {
    return (
      <div className="animate-fade-in">
        <div className="islamic-gradient text-primary-foreground p-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Al-Quran
              </h1>
              <p className="text-xs opacity-70 font-arabic">القرآن الكريم</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBookmarks(true)}
                className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDisplayMode("list")}
                className="px-3 py-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition text-xs font-medium flex items-center gap-1.5"
              >
                <BookText className="w-3.5 h-3.5" />
                Surah List
              </button>
            </div>
          </div>

          {lastRead && (
            <button
              onClick={() => {
                const s = surahs.find((s) => s.number === lastRead.surahNumber);
                if (s) openSurah(s, lastRead.ayahIndex);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary-foreground/10 text-primary-foreground mb-2"
            >
              <Clock className="w-4 h-4 opacity-70" />
              <div className="flex-1 text-left">
                <p className="text-xs opacity-70">Continue Reading</p>
                <p className="text-sm font-semibold">{lastRead.surahName} <span className="font-arabic opacity-80">{lastRead.surahNameAr}</span></p>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          )}
        </div>

        {/* Directly render the Mushaf page reader */}
        <PageReader pageNumber={1} onBack={() => setDisplayMode("list")} />
      </div>
    );
  }

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

  if (selectedPage !== null) {
    return <PageReader pageNumber={selectedPage} onBack={handleBack} />;
  }

  if (selectedJuz !== null) {
    return <PageReader juzNumber={selectedJuz} onBack={handleBack} />;
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "surah", label: "Surah", icon: <BookText className="w-3.5 h-3.5" /> },
    { id: "juz", label: "Juz", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "page", label: "Page", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Al-Quran" subtitle="القرآن الكريم" icon={<BookOpen className="w-6 h-6" />}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
            <input
              type="text"
              placeholder="Search surah, ayah, or translation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 text-sm border-0 outline-none focus:bg-primary-foreground/15 transition"
            />
          </div>
          <button
            onClick={() => setDisplayMode("mushaf")}
            className="px-3 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition"
            title="Mushaf View"
          >
            <BookOpenCheck className="w-4 h-4 text-primary-foreground" />
          </button>
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
        {lastRead && !showBookmarks && !search && (
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

        {/* Search results */}
        {search.length >= 3 && searchResults && !showBookmarks && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Search Results ({searchResults.count})
            </h3>
            {searchResults.matches?.slice(0, 30).map((match, i) => (
              <button
                key={`${match.surah.number}-${match.numberInSurah}`}
                onClick={() => {
                  const s = surahs.find((s) => s.number === match.surah.number);
                  if (s) openSurah(s, match.numberInSurah);
                }}
                className="w-full flex items-start gap-3 p-4 rounded-2xl bg-card hover:bg-muted transition animate-slide-up text-left"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <div className="w-8 h-8 rounded-lg islamic-gradient flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {match.surah.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{match.surah.englishName} · Ayah {match.numberInSurah}</p>
                  <p className="text-sm text-foreground mt-1 line-clamp-2 font-arabic" dir="rtl">{match.text}</p>
                </div>
              </button>
            ))}
            {isSearching && (
              <div className="text-center py-4 text-muted-foreground text-sm">Searching...</div>
            )}
          </div>
        )}

        {/* Tabs */}
        {!showBookmarks && search.length < 3 && (
          <>
            <div className="flex gap-1 bg-muted rounded-xl p-1 mb-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Surah tab */}
            {activeTab === "surah" && (
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
                {filteredSurahs.map((surah, i) => (
                  <button
                    key={surah.number}
                    onClick={() => openSurah(surah)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-200 animate-slide-up group"
                    style={{ animationDelay: `${Math.min(i, 15) * 20}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      {surah.number}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground text-sm">{surah.englishName}</p>
                      <p className="text-xs text-muted-foreground">
                        {surah.numberOfAyahs} verses · {surah.revelationType === "Meccan" ? "🕋 Meccan" : "🕌 Medinan"}
                      </p>
                    </div>
                    <p className="font-arabic text-xl text-primary">{surah.name}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </>
            )}

            {/* Juz tab */}
            {activeTab === "juz" && (
              <>
                {JUZ_DATA.map((juz, i) => (
                  <button
                    key={juz.number}
                    onClick={() => setSelectedJuz(juz.number)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-200 animate-slide-up group"
                    style={{ animationDelay: `${Math.min(i, 15) * 20}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      {juz.number}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground text-sm">{juz.name}</p>
                      <p className="text-xs text-muted-foreground">Starts at {juz.startSurah}, Ayah {juz.startAyah}</p>
                    </div>
                    <p className="font-arabic text-lg text-primary">{juz.nameAr}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </>
            )}

            {/* Page tab */}
            {activeTab === "page" && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Navigate to a specific Mushaf page (1–604)</p>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setSelectedPage(page)}
                      className="py-2.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-medium transition-all"
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuranPage;
