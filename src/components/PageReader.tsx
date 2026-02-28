import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowRight, BookOpen, Loader2, ChevronLeft, ChevronRight, Sun, Moon, Palette, Maximize2, Minimize2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPage, fetchJuz, fetchSurahWithAudio, RECITERS, READING_VERSIONS, type Ayah } from "@/lib/quranApi";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import AyahActionsPopover from "@/components/AyahActionsPopover";

type MushafTheme = "light" | "brown" | "darkblue" | "dark";

const MUSHAF_THEMES: { id: MushafTheme; label: string; icon: React.ReactNode; bg: string; text: string; page: string; border: string; accent: string }[] = [
  { id: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" />, bg: "bg-white", text: "text-gray-900", page: "bg-gray-50 border-gray-200", border: "border-gray-200", accent: "hsl(0 0% 15%)" },
  { id: "brown", label: "Classic", icon: <Palette className="w-3.5 h-3.5" />, bg: "mushaf-bg", text: "text-[hsl(30_30%_15%)]", page: "mushaf-page", border: "border-[hsl(38_30%_82%)]", accent: "hsl(30 30% 15%)" },
  { id: "darkblue", label: "Night", icon: <Moon className="w-3.5 h-3.5" />, bg: "bg-[hsl(220_30%_12%)]", text: "text-[hsl(220_20%_85%)]", page: "bg-[hsl(220_25%_16%)] border-[hsl(220_20%_22%)]", border: "border-[hsl(220_20%_22%)]", accent: "hsl(220 20% 85%)" },
  { id: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" />, bg: "bg-[hsl(0_0%_5%)]", text: "text-[hsl(0_0%_82%)]", page: "bg-[hsl(0_0%_9%)] border-[hsl(0_0%_15%)]", border: "border-[hsl(0_0%_15%)]", accent: "hsl(0 0% 82%)" },
];

interface PageReaderProps {
  pageNumber?: number;
  juzNumber?: number;
  onBack: () => void;
}

const PageReader = ({ pageNumber, juzNumber, onBack }: PageReaderProps) => {
  const [currentPage, setCurrentPage] = useState(pageNumber || 1);
  const [readingVersion, setReadingVersion] = useState(READING_VERSIONS[0].id);
  const [fontSize, setFontSize] = useState(22);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<string>>(new Set());
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const [mushafTheme, setMushafTheme] = useState<MushafTheme>("brown");
  const [immersive, setImmersive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [pageJumpValue, setPageJumpValue] = useState("");
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const { toast } = useToast();

  const isPageMode = pageNumber !== undefined;
  const theme = MUSHAF_THEMES.find(t => t.id === mushafTheme) || MUSHAF_THEMES[1];

  // Immersive mode: tap to show overlay, auto-hide after 2s
  const handleContentTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!immersive) return;
    // Don't trigger on ayah popover interactions
    const target = e.target as HTMLElement;
    if (target.closest('[data-radix-popper-content-wrapper]') || target.closest('[role="dialog"]')) return;
    
    setShowOverlay(true);
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setShowOverlay(false), 2000);
  }, [immersive]);

  useEffect(() => {
    return () => { if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current); };
  }, []);

  // Swipe handlers - improved for horizontal page turning + vertical scroll
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !isPageMode) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Only trigger horizontal swipe if horizontal movement dominates and it's fast enough
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && elapsed < 500) {
      // RTL: swipe right = next page (forward in reading), swipe left = prev
      if (dx > 0) {
        // Swipe right -> next page
        if (currentPage < 604) {
          setSwipeAnim("right");
          setTimeout(() => { setCurrentPage(p => Math.min(604, p + 1)); setSwipeAnim(null); }, 200);
        }
      } else {
        // Swipe left -> prev page
        if (currentPage > 1) {
          setSwipeAnim("left");
          setTimeout(() => { setCurrentPage(p => Math.max(1, p - 1)); setSwipeAnim(null); }, 200);
        }
      }
    }
  }, [isPageMode, currentPage]);

  const goNext = useCallback(() => {
    if (!isPageMode || currentPage >= 604) return;
    setSwipeAnim("left");
    setTimeout(() => { setCurrentPage(p => Math.min(604, p + 1)); setSwipeAnim(null); }, 200);
  }, [isPageMode, currentPage]);

  const goPrev = useCallback(() => {
    if (!isPageMode || currentPage <= 1) return;
    setSwipeAnim("right");
    setTimeout(() => { setCurrentPage(p => Math.max(1, p - 1)); setSwipeAnim(null); }, 200);
  }, [isPageMode, currentPage]);

  const { data, isLoading, error } = useQuery({
    queryKey: isPageMode ? ["page", currentPage, readingVersion] : ["juz", juzNumber, readingVersion],
    queryFn: () => isPageMode ? fetchPage(currentPage, readingVersion) : fetchJuz(juzNumber!, readingVersion),
  });

  // Load bookmarks
  useEffect(() => {
    if (data?.ayahs) {
      const set = new Set<string>();
      data.ayahs.forEach((a) => {
        const sn = a.surah?.number || 0;
        if (isBookmarked(sn, a.numberInSurah)) set.add(`${sn}-${a.numberInSurah}`);
      });
      setBookmarkedAyahs(set);
    }
  }, [data]);

  // Group ayahs by surah
  const groupedAyahs = (data?.ayahs || []).reduce<Record<string, { surahName: string; surahNameAr: string; surahNumber: number; ayahs: Ayah[] }>>((acc, ayah) => {
    const key = ayah.surah?.number?.toString() || "unknown";
    if (!acc[key]) {
      acc[key] = {
        surahName: ayah.surah?.englishName || "",
        surahNameAr: ayah.surah?.name || "",
        surahNumber: ayah.surah?.number || 0,
        ayahs: [],
      };
    }
    acc[key].ayahs.push(ayah);
    return acc;
  }, {});

  const toggleBookmark = (surahNumber: number, ayah: Ayah) => {
    const key = `${surahNumber}-${ayah.numberInSurah}`;
    if (bookmarkedAyahs.has(key)) {
      removeBookmark(surahNumber, ayah.numberInSurah);
      setBookmarkedAyahs((prev) => { const s = new Set(prev); s.delete(key); return s; });
      toast({ title: "Bookmark removed" });
    } else {
      const group = Object.values(groupedAyahs).find(g => g.surahNumber === surahNumber);
      addBookmark({
        surahNumber,
        surahName: group?.surahName || "",
        surahNameAr: group?.surahNameAr || "",
        ayahNumber: ayah.numberInSurah,
        ayahText: ayah.text.substring(0, 80),
        timestamp: Date.now(),
      });
      setBookmarkedAyahs((prev) => new Set(prev).add(key));
      toast({ title: "Verse bookmarked ✓" });
    }
  };

  const playAyahAudio = useCallback(async (surahNumber: number, ayahNumberInSurah: number) => {
    try {
      if (audioRef.current) audioRef.current.pause();
      const result = await fetchSurahWithAudio(surahNumber, readingVersion, reciter);
      const ayahData = result.audio.ayahs.find(a => a.numberInSurah === ayahNumberInSurah);
      if (!ayahData?.audio) return;
      const audio = new Audio(ayahData.audio);
      audioRef.current = audio;
      const key = `${surahNumber}-${ayahNumberInSurah}`;
      setPlayingKey(key);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => { setPlayingKey(null); setIsPlaying(false); };
    } catch {
      toast({ title: "Audio failed", variant: "destructive" });
    }
  }, [reciter, readingVersion, toast]);

  const repeatAyahAudio = useCallback(async (surahNumber: number, ayahNumberInSurah: number) => {
    try {
      if (audioRef.current) audioRef.current.pause();
      const result = await fetchSurahWithAudio(surahNumber, readingVersion, reciter);
      const ayahData = result.audio.ayahs.find(a => a.numberInSurah === ayahNumberInSurah);
      if (!ayahData?.audio) return;
      const audio = new Audio(ayahData.audio);
      audio.loop = true;
      audioRef.current = audio;
      const key = `${surahNumber}-${ayahNumberInSurah}`;
      setPlayingKey(key);
      setIsPlaying(true);
      audio.play();
      toast({ title: "🔂 Repeating ayah" });
    } catch {
      toast({ title: "Audio failed", variant: "destructive" });
    }
  }, [reciter, readingVersion, toast]);

  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  const title = isPageMode ? `Page ${currentPage}` : `Juz ${juzNumber}`;
  const subtitle = isPageMode ? `صفحة ${currentPage}` : `الجزء ${juzNumber}`;

  return (
    <div
      className={`animate-fade-in min-h-screen ${theme.bg}`}
      onClick={handleContentTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header - collapsible in immersive mode */}
      {!immersive && (
        <div className="islamic-gradient text-primary-foreground p-4 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => { if (audioRef.current) audioRef.current.pause(); onBack(); }} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{title}</h1>
              <p className="text-sm opacity-80 font-arabic">{subtitle}</p>
            </div>
            <button
              onClick={() => setImmersive(true)}
              className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition"
              title="Fullscreen reading"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Theme selector */}
          <div className="flex gap-1.5 mb-3">
            {MUSHAF_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setMushafTheme(t.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition ${
                  mushafTheme === t.id
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : "bg-primary-foreground/8 text-primary-foreground/60 hover:bg-primary-foreground/15"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <Select value={reciter} onValueChange={setReciter}>
              <SelectTrigger className="flex-1 h-9 text-xs bg-primary-foreground/10 border-0 text-primary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECITERS.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={readingVersion} onValueChange={setReadingVersion}>
              <SelectTrigger className="w-28 h-9 text-xs bg-primary-foreground/10 border-0 text-primary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {READING_VERSIONS.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs opacity-60">Aa</span>
            <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={16} max={40} step={2} className="flex-1" />
            <span className="text-xs opacity-60 w-6 text-right">{fontSize}</span>
          </div>

          {/* Page navigation */}
          {isPageMode && (
            <div className="flex items-center justify-between mt-3 bg-primary-foreground/10 rounded-xl p-2">
              <button onClick={goPrev} disabled={currentPage <= 1} className="p-2 rounded-lg hover:bg-primary-foreground/10 transition disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium">Page {currentPage} / 604</span>
              <button onClick={goNext} disabled={currentPage >= 604} className="p-2 rounded-lg hover:bg-primary-foreground/10 transition disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Immersive mode overlay - appears on tap */}
      {immersive && showOverlay && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-2 p-3 bg-black/70 backdrop-blur-sm animate-fade-in">
          <button
            onClick={(e) => { e.stopPropagation(); if (audioRef.current) audioRef.current.pause(); setImmersive(false); setShowOverlay(false); }}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition text-white"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <span className="text-white text-sm font-medium flex-1">{title}</span>
          {isPageMode && (
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }} disabled={currentPage <= 1} className="p-1.5 rounded-lg bg-white/15 text-white disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const num = parseInt(pageJumpValue);
                  if (num >= 1 && num <= 604) {
                    setCurrentPage(num);
                    setPageJumpValue("");
                    pageInputRef.current?.blur();
                  }
                }}
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={pageInputRef}
                  type="number"
                  min={1}
                  max={604}
                  value={pageJumpValue}
                  onChange={(e) => setPageJumpValue(e.target.value)}
                  placeholder={`${currentPage}`}
                  className="w-12 h-7 text-center text-xs text-white bg-white/15 rounded-lg border-0 outline-none placeholder:text-white/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onFocus={() => { if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current); }}
                  onBlur={() => { overlayTimerRef.current = setTimeout(() => setShowOverlay(false), 2000); }}
                />
                <span className="text-white/50 text-xs mx-0.5">/604</span>
              </form>
              <button onClick={(e) => { e.stopPropagation(); goNext(); }} disabled={currentPage >= 604} className="p-1.5 rounded-lg bg-white/15 text-white disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setImmersive(false); setShowOverlay(false); }}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition text-white"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mushaf Content */}
      <div
        className={`px-3 py-4 transition-all duration-200 ${
          swipeAnim === "left" ? "translate-x-[-30px] opacity-0" :
          swipeAnim === "right" ? "translate-x-[30px] opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`space-y-2 p-6 mb-4 rounded-xl border ${theme.page}`}>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        ))}

        {error && (
          <div className="text-center py-10 text-destructive">
            <p className="text-sm">Failed to load. Please try again.</p>
          </div>
        )}

        {Object.values(groupedAyahs).map((group) => (
          <div key={group.surahNumber} className="mb-4">
            {/* Surah name header */}
            {group.ayahs[0]?.numberInSurah === 1 && (
              <div className={`rounded-xl px-4 py-3 mb-3 text-center border ${
                mushafTheme === "brown" ? "mushaf-surah-header" : theme.page
              }`}>
                <p className="font-arabic text-xl font-bold" style={{ color: theme.accent }}>
                  سُورَةُ {group.surahNameAr?.replace(/^سُورَةُ\s*/, '') || group.surahName}
                </p>
                {group.surahNumber !== 1 && group.surahNumber !== 9 && (
                  <p className="font-arabic text-base mt-1.5" style={{ color: theme.accent, opacity: 0.7 }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                )}
              </div>
            )}

            {/* Mushaf-style continuous text */}
            <div className={`rounded-xl p-5 border ${theme.page}`} dir="rtl">
              <p
                className="font-arabic text-right"
                style={{ fontSize: `${fontSize}px`, lineHeight: "2.6", color: theme.accent }}
              >
                {group.ayahs.map((ayah) => {
                  const key = `${group.surahNumber}-${ayah.numberInSurah}`;
                  const isCurrentlyPlaying = playingKey === key;

                  return (
                    <AyahActionsPopover
                      key={ayah.numberInSurah}
                      ayahText={ayah.text}
                      ayahNumber={ayah.numberInSurah}
                      surahName={group.surahName}
                      isBookmarked={bookmarkedAyahs.has(key)}
                      onPlay={() => playAyahAudio(group.surahNumber, ayah.numberInSurah)}
                      onRepeat={() => repeatAyahAudio(group.surahNumber, ayah.numberInSurah)}
                      onBookmark={() => toggleBookmark(group.surahNumber, ayah)}
                    >
                      <span
                        className={`cursor-pointer transition-colors rounded-sm px-0.5 ${
                          isCurrentlyPlaying
                            ? "bg-primary/15 text-primary"
                            : "hover:bg-accent/20"
                        }`}
                      >
                        {ayah.text}
                        {" "}
                        <span
                          className="inline-flex items-center justify-center rounded-full text-xs font-bold mx-0.5 align-middle"
                          style={{
                            width: `${Math.max(24, fontSize * 0.9)}px`,
                            height: `${Math.max(24, fontSize * 0.9)}px`,
                            fontSize: `${Math.max(10, fontSize * 0.45)}px`,
                            background: "hsl(var(--gold) / 0.15)",
                            color: "hsl(var(--gold))",
                            border: "1px solid hsl(var(--gold) / 0.3)",
                          }}
                        >
                          {ayah.numberInSurah}
                        </span>
                        {" "}
                      </span>
                    </AyahActionsPopover>
                  );
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}

        {/* Bottom page info */}
        {isPageMode && !isLoading && (
          <div className="flex items-center justify-between text-xs mt-4 px-2" style={{ color: theme.accent, opacity: 0.5 }}>
            <span>الجزء {data?.ayahs?.[0]?.juz || "—"}</span>
            <span>Page {currentPage}</span>
            <span>الحزب {data?.ayahs?.[0]?.hizbQuarter ? Math.ceil(data.ayahs[0].hizbQuarter / 4) : "—"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageReader;
