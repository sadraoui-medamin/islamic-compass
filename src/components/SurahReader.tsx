import { useState, useRef, useEffect } from "react";
import { ArrowRight, Play, Pause, SkipForward, SkipBack, Volume2, Type, BookOpen, Loader2, Bookmark, BookmarkCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSurahWithAudio, RECITERS, READING_VERSIONS, type SurahDetail } from "@/lib/quranApi";
import { addBookmark, removeBookmark, isBookmarked, setLastRead } from "@/lib/bookmarks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface SurahReaderProps {
  surahNumber: number;
  surahName: string;
  surahNameAr: string;
  startAyah?: number;
  onBack: () => void;
}

const SurahReader = ({ surahNumber, surahName, surahNameAr, startAyah, onBack }: SurahReaderProps) => {
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [readingVersion, setReadingVersion] = useState(READING_VERSIONS[0].id);
  const [fontSize, setFontSize] = useState(24);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["surah", surahNumber, readingVersion, reciter],
    queryFn: () => fetchSurahWithAudio(surahNumber, readingVersion, reciter),
  });

  // Load bookmark state
  useEffect(() => {
    if (data?.text?.ayahs) {
      const set = new Set<number>();
      data.text.ayahs.forEach((a) => {
        if (isBookmarked(surahNumber, a.numberInSurah)) set.add(a.numberInSurah);
      });
      setBookmarkedAyahs(set);
    }
  }, [data, surahNumber]);

  // Scroll to startAyah
  useEffect(() => {
    if (startAyah !== undefined && data?.text?.ayahs) {
      setTimeout(() => {
        ayahRefs.current[startAyah]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [startAyah, data]);

  // Save last read on scroll
  useEffect(() => {
    if (!data?.text?.ayahs) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-ayah-idx"));
            if (!isNaN(idx)) {
              setLastRead({
                surahNumber,
                surahName,
                surahNameAr,
                ayahIndex: idx,
                timestamp: Date.now(),
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    Object.values(ayahRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [data, surahNumber, surahName, surahNameAr]);

  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const toggleBookmark = (ayah: { numberInSurah: number; text: string }) => {
    if (bookmarkedAyahs.has(ayah.numberInSurah)) {
      removeBookmark(surahNumber, ayah.numberInSurah);
      setBookmarkedAyahs((prev) => { const s = new Set(prev); s.delete(ayah.numberInSurah); return s; });
      toast({ title: "Bookmark removed" });
    } else {
      addBookmark({
        surahNumber,
        surahName,
        surahNameAr,
        ayahNumber: ayah.numberInSurah,
        ayahText: ayah.text.substring(0, 80),
        timestamp: Date.now(),
      });
      setBookmarkedAyahs((prev) => new Set(prev).add(ayah.numberInSurah));
      toast({ title: "Verse bookmarked ✓" });
    }
  };

  const playAyah = (ayahIndex: number) => {
    if (!data?.audio?.ayahs[ayahIndex]?.audio) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(data.audio.ayahs[ayahIndex].audio);
    audioRef.current = audio;
    setPlayingAyah(ayahIndex);
    setIsPlaying(true);
    audio.play();
    audio.onended = () => {
      if (ayahIndex < data.audio.ayahs.length - 1) {
        playAyah(ayahIndex + 1);
      } else {
        setPlayingAyah(null);
        setIsPlaying(false);
      }
    };
  };

  const togglePlay = () => {
    if (isPlaying && audioRef.current) { audioRef.current.pause(); setIsPlaying(false); }
    else if (playingAyah !== null) { audioRef.current?.play(); setIsPlaying(true); }
    else { playAyah(0); }
  };

  const stopPlayback = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlayingAyah(null);
    setIsPlaying(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="islamic-gradient text-primary-foreground p-4 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { stopPlayback(); onBack(); }} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{surahName}</h1>
            <p className="text-sm opacity-80">{surahNameAr} · Surah {surahNumber}</p>
          </div>
          <BookOpen className="w-6 h-6 opacity-60" />
        </div>

        <div className="flex gap-2">
          <Select value={reciter} onValueChange={(v) => { stopPlayback(); setReciter(v); }}>
            <SelectTrigger className="flex-1 h-9 text-xs bg-primary-foreground/10 border-0 text-primary-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECITERS.map((r) => (<SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={readingVersion} onValueChange={(v) => { stopPlayback(); setReadingVersion(v); }}>
            <SelectTrigger className="w-28 h-9 text-xs bg-primary-foreground/10 border-0 text-primary-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {READING_VERSIONS.map((r) => (<SelectItem key={r.id} value={r.id}>{r.name} ({r.nameAr})</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 mt-3 bg-primary-foreground/10 rounded-xl p-2.5">
          <button onClick={() => playingAyah !== null && playingAyah > 0 && playAyah(playingAyah - 1)} className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={togglePlay} className="p-2.5 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={() => data && playingAyah !== null && playingAyah < data.audio.ayahs.length - 1 && playAyah(playingAyah + 1)} className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition">
            <SkipForward className="w-4 h-4" />
          </button>
          <div className="flex-1 text-xs opacity-70 text-center">
            {playingAyah !== null ? `Ayah ${playingAyah + 1}` : "Tap play to listen"}
          </div>
          <Volume2 className="w-4 h-4 opacity-50" />
        </div>

        <div className="flex items-center gap-3 mt-3">
          <Type className="w-4 h-4 opacity-60" />
          <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={16} max={40} step={2} className="flex-1" />
          <span className="text-xs opacity-60 w-8 text-right">{fontSize}</span>
        </div>
      </div>

      {/* Verses */}
      <div className="px-4 py-4 space-y-4">
        {surahNumber !== 1 && surahNumber !== 9 && (
          <p className="font-arabic text-center text-primary text-xl py-3">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}

        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 rounded-2xl bg-card">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}

        {error && (
          <div className="text-center py-10 text-destructive">
            <p>Failed to load surah. Please try again.</p>
          </div>
        )}

        {data?.text?.ayahs.map((ayah, i) => (
          <div
            key={ayah.numberInSurah}
            ref={(el) => { ayahRefs.current[ayah.numberInSurah] = el; }}
            data-ayah-idx={i}
            className={`p-4 rounded-2xl transition-all duration-200 ${
              playingAyah === i ? "bg-primary/10 ring-2 ring-primary/30" : "bg-card hover:bg-muted"
            }`}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => playAyah(i)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition ${
                    playingAyah === i ? "islamic-gradient text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  {playingAyah === i && isPlaying ? <Pause className="w-3.5 h-3.5" /> : ayah.numberInSurah}
                </button>
                <button
                  onClick={() => toggleBookmark(ayah)}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                >
                  {bookmarkedAyahs.has(ayah.numberInSurah) ? (
                    <BookmarkCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p
                className="font-arabic text-right leading-loose flex-1 text-foreground"
                style={{ fontSize: `${fontSize}px`, lineHeight: "2.2" }}
                dir="rtl"
              >
                {ayah.text}
              </p>
            </div>
            {data.translation?.ayahs[i] && (
              <p className="text-sm text-muted-foreground pl-11 leading-relaxed">
                {data.translation.ayahs[i].text}
              </p>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading surah...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahReader;
