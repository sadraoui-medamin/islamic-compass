import { useState, useMemo, useRef, useEffect } from "react";
import { BookOpen, Search, ChevronRight, Bookmark, Clock, Trash2, X, BookText, Layers, FileText, BookOpenCheck, WifiOff, Hash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import SurahReader from "@/components/SurahReader";
import { fetchAllSurahs, searchQuran, searchQuranArabic, JUZ_DATA, type Surah } from "@/lib/quranApi";
import { getBookmarks, getLastRead, removeBookmark, type Bookmark as BookmarkType } from "@/lib/bookmarks";
import { Skeleton } from "@/components/ui/skeleton";
import PageReader from "@/components/PageReader";
import OfflineAudioList from "@/components/OfflineAudioList";
import { useLanguage } from "@/lib/languageContext";

type TabType = "surah" | "juz" | "page";
type DisplayMode = "mushaf" | "list";
type SearchMode = "text" | "number";

const QuranPage = () => {
  const { t } = useLanguage();
  const { setIsFullscreenReading } = useOutletContext<{ setIsFullscreenReading: (v: boolean) => void }>();
  const [search, setSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [startAyah, setStartAyah] = useState<number | undefined>();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(getBookmarks);
  const [activeTab, setActiveTab] = useState<TabType>("surah");
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("mushaf");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showOffline, setShowOffline] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("number");
  // Quick jump fields
  const [jumpSurah, setJumpSurah] = useState("");
  const [jumpAyah, setJumpAyah] = useState("");
  const [jumpJuz, setJumpJuz] = useState("");
  const [jumpPage, setJumpPage] = useState("");
  const lastScrollY = useRef(0);
  const lastRead = getLastRead();

  const handleEnterFullscreen = () => setIsFullscreenReading(true);
  const handleExitFullscreen = () => setIsFullscreenReading(false);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const onScroll = () => {
      const y = main.scrollTop;
      if (y < 10) setHeaderVisible(true);
      else if (y > lastScrollY.current + 8) setHeaderVisible(false);
      else if (y < lastScrollY.current - 8) setHeaderVisible(true);
      lastScrollY.current = y;
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  const { data: surahs = [], isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchAllSurahs,
  });

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["quran-search", search],
    queryFn: () => {
      const isArabic = /[\u0600-\u06FF]/.test(search);
      return isArabic ? searchQuranArabic(search) : searchQuran(search);
    },
    enabled: searchMode === "text" && search.length >= 3,
    staleTime: 60000,
  });

  const filteredSurahs = useMemo(() => {
    if (searchMode === "text" && search.length >= 3 && searchResults) return [];
    if (searchMode === "text") {
      return surahs.filter(
        (s) =>
          s.englishName.toLowerCase().includes(search.toLowerCase()) ||
          s.name.includes(search) ||
          s.number.toString() === search ||
          s.englishNameTranslation.toLowerCase().includes(search.toLowerCase())
      );
    }
    return surahs;
  }, [surahs, search, searchResults, searchMode]);

  const openSurah = (surah: Surah, ayah?: number) => {
    setSelectedSurah(surah);
    setStartAyah(ayah);
  };

  const handleBack = () => {
    setSelectedSurah(null);
    setSelectedPage(null);
    setSelectedJuz(null);
    setStartAyah(undefined);
    setBookmarks(getBookmarks());
  };

  const handleQuickJump = (type: "surah" | "ayah" | "juz" | "page") => {
    if (type === "page") {
      const num = parseInt(jumpPage);
      if (num >= 1 && num <= 604) { setSelectedPage(num); setJumpPage(""); }
    } else if (type === "juz") {
      const num = parseInt(jumpJuz);
      if (num >= 1 && num <= 30) { setSelectedJuz(num); setJumpJuz(""); }
    } else if (type === "surah") {
      const num = parseInt(jumpSurah);
      const ayahNum = parseInt(jumpAyah) || undefined;
      if (num >= 1 && num <= 114) {
        const s = surahs.find(s => s.number === num);
        if (s) { openSurah(s, ayahNum); setJumpSurah(""); setJumpAyah(""); }
      }
    }
  };

  // Show offline page
  if (showOffline) {
    return <OfflineAudioList onBack={() => setShowOffline(false)} />;
  }

  if (displayMode === "mushaf" && !selectedSurah && selectedPage === null && selectedJuz === null && !search && !showBookmarks) {
    return (
      <div className="animate-fade-in">
        <div className={`islamic-gradient text-primary-foreground p-4 pb-3 transition-all duration-300 overflow-hidden ${headerVisible ? "max-h-60 opacity-100" : "max-h-0 opacity-0 p-0 pb-0"}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> {t("quran.title")}
              </h1>
              <p className="text-xs opacity-70 font-arabic">{t("quran.subtitle")}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowOffline(true)}
                className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition"
                title="Offline Audio"
              >
                <WifiOff className="w-4 h-4" />
              </button>
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
                {t("quran.surahList")}
              </button>
            </div>
          </div>

          {/* Quick Jump in Mushaf mode */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("surah"); }} className="relative">
              <input
                type="number" min={1} max={114} value={jumpSurah}
                onChange={(e) => setJumpSurah(e.target.value)}
                placeholder="سورة"
                className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] opacity-40">1-114</span>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("surah"); }} className="relative">
              <input
                type="number" min={1} max={286} value={jumpAyah}
                onChange={(e) => setJumpAyah(e.target.value)}
                placeholder="آية"
                className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] opacity-40">آية</span>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("juz"); }} className="relative">
              <input
                type="number" min={1} max={30} value={jumpJuz}
                onChange={(e) => setJumpJuz(e.target.value)}
                placeholder="جزء"
                className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] opacity-40">1-30</span>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("page"); }} className="relative">
              <input
                type="number" min={1} max={604} value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                placeholder="صفحة"
                className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] opacity-40">1-604</span>
            </form>
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
                <p className="text-xs opacity-70">{t("quran.continueReading")}</p>
                <p className="text-sm font-semibold">{lastRead.surahName} <span className="font-arabic opacity-80">{lastRead.surahNameAr}</span></p>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          )}
        </div>

        <PageReader pageNumber={1} onBack={() => setDisplayMode("list")} onFullscreenChange={(v) => v ? handleEnterFullscreen() : handleExitFullscreen()} />
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
        onBack={() => { handleExitFullscreen(); handleBack(); }}
        onFullscreenChange={(v) => v ? handleEnterFullscreen() : handleExitFullscreen()}
      />
    );
  }

  if (selectedPage !== null) {
    return <PageReader pageNumber={selectedPage} onBack={() => { handleExitFullscreen(); handleBack(); }} onFullscreenChange={(v) => v ? handleEnterFullscreen() : handleExitFullscreen()} />;
  }

  if (selectedJuz !== null) {
    return <PageReader juzNumber={selectedJuz} onBack={() => { handleExitFullscreen(); handleBack(); }} onFullscreenChange={(v) => v ? handleEnterFullscreen() : handleExitFullscreen()} />;
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "surah", label: t("quran.surah"), icon: <BookText className="w-3.5 h-3.5" /> },
    { id: "juz", label: t("quran.juz"), icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "page", label: t("quran.page"), icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("quran.title")} subtitle={t("quran.subtitle")} icon={<BookOpen className="w-6 h-6" />}>
        {/* Search mode toggle + fields */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => setSearchMode("number")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                searchMode === "number" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary-foreground/10 text-primary-foreground/60 hover:bg-primary-foreground/15"
              }`}
            >
              <Hash className="w-3 h-3" /> انتقال سريع
            </button>
            <button
              onClick={() => setSearchMode("text")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                searchMode === "text" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary-foreground/10 text-primary-foreground/60 hover:bg-primary-foreground/15"
              }`}
            >
              <Search className="w-3 h-3" /> بحث نصي
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowOffline(true)}
              className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition"
              title="Offline Audio"
            >
              <WifiOff className="w-4 h-4 text-primary-foreground" />
            </button>
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

          {searchMode === "number" ? (
            <div className="grid grid-cols-4 gap-2">
              <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("surah"); }} className="relative">
                <input
                  type="number" min={1} max={114} value={jumpSurah}
                  onChange={(e) => setJumpSurah(e.target.value)}
                  placeholder="سورة"
                  className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary-foreground/30">1-114</span>
              </form>
              <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("surah"); }} className="relative">
                <input
                  type="number" min={1} max={286} value={jumpAyah}
                  onChange={(e) => setJumpAyah(e.target.value)}
                  placeholder="آية"
                  className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary-foreground/30">آية</span>
              </form>
              <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("juz"); }} className="relative">
                <input
                  type="number" min={1} max={30} value={jumpJuz}
                  onChange={(e) => setJumpJuz(e.target.value)}
                  placeholder="جزء"
                  className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary-foreground/30">1-30</span>
              </form>
              <form onSubmit={(e) => { e.preventDefault(); handleQuickJump("page"); }} className="relative">
                <input
                  type="number" min={1} max={604} value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  placeholder="صفحة"
                  className="w-full h-9 text-center text-xs bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg border-0 outline-none focus:bg-primary-foreground/20 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-primary-foreground/30">1-604</span>
              </form>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <input
                type="text"
                placeholder={t("quran.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 text-sm border-0 outline-none focus:bg-primary-foreground/15 transition"
              />
            </div>
          )}
        </div>
      </PageHeader>

      <div className="px-4 py-4 space-y-2">
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
              <p className="text-xs opacity-70">{t("quran.continueReading")}</p>
              <p className="font-semibold text-sm">{lastRead.surahName}</p>
              <p className="text-xs opacity-80 font-arabic">{lastRead.surahNameAr} · {t("quran.ayah")} {lastRead.ayahIndex + 1}</p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        )}

        {showBookmarks && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{t("quran.bookmarks")} ({bookmarks.length})</h3>
              <button onClick={() => setShowBookmarks(false)} className="p-1">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {bookmarks.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t("quran.noBookmarks")}</p>
                <p className="text-xs">{t("quran.tapBookmark")}</p>
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
                  <p className="text-sm font-semibold text-foreground">{bm.surahName} · {t("quran.ayah")} {bm.ayahNumber}</p>
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

        {searchMode === "text" && search.length >= 3 && searchResults && !showBookmarks && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              {t("quran.searchResults")} ({searchResults.count})
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
                  <p className="text-xs text-muted-foreground">{match.surah.englishName} · {t("quran.ayah")} {match.numberInSurah}</p>
                  <p className="text-sm text-foreground mt-1 line-clamp-2 font-arabic" dir="rtl">{match.text}</p>
                </div>
              </button>
            ))}
            {isSearching && (
              <div className="text-center py-4 text-muted-foreground text-sm">{t("quran.searching")}</div>
            )}
          </div>
        )}

        {!showBookmarks && !(searchMode === "text" && search.length >= 3) && (
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
                        {surah.numberOfAyahs} {t("quran.verses")} · {surah.revelationType === "Meccan" ? `🕋 ${t("quran.meccan")}` : `🕌 ${t("quran.medinan")}`}
                      </p>
                    </div>
                    <p className="font-arabic text-xl text-primary">{surah.name}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </>
            )}

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
                      <p className="text-xs text-muted-foreground">{t("quran.startsAt")} {juz.startSurah}, {t("quran.ayah")} {juz.startAyah}</p>
                    </div>
                    <p className="font-arabic text-lg text-primary">{juz.nameAr}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </>
            )}

            {activeTab === "page" && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">{t("quran.navigatePage")}</p>
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
