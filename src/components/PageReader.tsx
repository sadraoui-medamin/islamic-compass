import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowRight, BookOpen, Loader2, ChevronLeft, ChevronRight, Play, Pause, SkipForward, SkipBack, Repeat, Repeat1 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPage, fetchJuz, fetchSurahWithAudio, RECITERS, READING_VERSIONS, type Ayah } from "@/lib/quranApi";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import AyahActionsPopover from "@/components/AyahActionsPopover";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const isPageMode = pageNumber !== undefined;

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
    <div className="animate-fade-in mushaf-bg min-h-screen">
      {/* Header */}
      <div className="islamic-gradient text-primary-foreground p-4 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => { if (audioRef.current) audioRef.current.pause(); onBack(); }} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{title}</h1>
            <p className="text-sm opacity-80 font-arabic">{subtitle}</p>
          </div>
          <BookOpen className="w-6 h-6 opacity-60" />
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
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-2 rounded-lg hover:bg-primary-foreground/10 transition disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">Page {currentPage} / 604</span>
            <button onClick={() => setCurrentPage((p) => Math.min(604, p + 1))} disabled={currentPage >= 604} className="p-2 rounded-lg hover:bg-primary-foreground/10 transition disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Mushaf Content */}
      <div className="px-3 py-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 p-6 mb-4 mushaf-page rounded-xl">
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
            {/* Surah name header - ornamental */}
            {group.ayahs[0]?.numberInSurah === 1 && (
              <div className="mushaf-surah-header rounded-xl px-4 py-3 mb-3 text-center">
                <p className="font-arabic text-xl text-accent-foreground font-bold" style={{ color: "hsl(var(--gold-foreground, 30 20% 25%))" }}>
                  سُورَةُ {group.surahNameAr?.replace(/^سُورَةُ\s*/, '') || group.surahName}
                </p>
                {group.surahNumber !== 1 && group.surahNumber !== 9 && (
                  <p className="font-arabic text-base mt-1.5 text-foreground/70">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                )}
              </div>
            )}

            {/* Mushaf-style continuous text */}
            <div className="mushaf-page rounded-xl p-5" dir="rtl">
              <p
                className="font-arabic text-right text-foreground"
                style={{ fontSize: `${fontSize}px`, lineHeight: "2.6", color: "hsl(30 30% 15%)" }}
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
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 px-2">
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
