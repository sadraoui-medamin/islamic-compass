import { useState } from "react";
import { ArrowRight, BookOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPage, fetchJuz, type Ayah } from "@/lib/quranApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { READING_VERSIONS } from "@/lib/quranApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";

interface PageReaderProps {
  pageNumber?: number;
  juzNumber?: number;
  onBack: () => void;
}

const PageReader = ({ pageNumber, juzNumber, onBack }: PageReaderProps) => {
  const [currentPage, setCurrentPage] = useState(pageNumber || 1);
  const [readingVersion, setReadingVersion] = useState(READING_VERSIONS[0].id);
  const [fontSize, setFontSize] = useState(22);

  const isPageMode = pageNumber !== undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: isPageMode ? ["page", currentPage, readingVersion] : ["juz", juzNumber, readingVersion],
    queryFn: () => isPageMode ? fetchPage(currentPage, readingVersion) : fetchJuz(juzNumber!, readingVersion),
  });

  // Group ayahs by surah for display
  const groupedAyahs = (data?.ayahs || []).reduce<Record<string, { surahName: string; surahNumber: number; ayahs: Ayah[] }>>((acc, ayah) => {
    const key = ayah.surah?.number?.toString() || "unknown";
    if (!acc[key]) {
      acc[key] = {
        surahName: ayah.surah?.englishName || "",
        surahNumber: ayah.surah?.number || 0,
        ayahs: [],
      };
    }
    acc[key].ayahs.push(ayah);
    return acc;
  }, {});

  const title = isPageMode ? `Page ${currentPage}` : `Juz ${juzNumber}`;
  const subtitle = isPageMode ? `صفحة ${currentPage}` : `الجزء ${juzNumber}`;

  return (
    <div className="animate-fade-in">
      <div className="islamic-gradient text-primary-foreground p-4 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{title}</h1>
            <p className="text-sm opacity-80 font-arabic">{subtitle}</p>
          </div>
          <BookOpen className="w-6 h-6 opacity-60" />
        </div>

        <div className="flex gap-2 items-center">
          <Select value={readingVersion} onValueChange={setReadingVersion}>
            <SelectTrigger className="w-32 h-9 text-xs bg-primary-foreground/10 border-0 text-primary-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {READING_VERSIONS.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.name} ({r.nameAr})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs opacity-60">Aa</span>
            <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={16} max={40} step={2} className="flex-1" />
          </div>
        </div>

        {/* Page navigation */}
        {isPageMode && (
          <div className="flex items-center justify-between mt-3 bg-primary-foreground/10 rounded-xl p-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">Page {currentPage} of 604</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(604, p + 1))}
              disabled={currentPage >= 604}
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-4 space-y-6">
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 rounded-2xl bg-card">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}

        {error && (
          <div className="text-center py-10 text-destructive">
            <p className="text-sm">Failed to load. Please try again.</p>
          </div>
        )}

        {Object.values(groupedAyahs).map((group) => (
          <div key={group.surahNumber} className="space-y-3">
            <div className="flex items-center gap-2 py-2">
              <div className="w-7 h-7 rounded-lg islamic-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
                {group.surahNumber}
              </div>
              <span className="text-sm font-semibold text-foreground">{group.surahName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-card" dir="rtl">
              <p
                className="font-arabic text-right leading-loose text-foreground"
                style={{ fontSize: `${fontSize}px`, lineHeight: "2.4" }}
              >
                {group.ayahs.map((ayah) => (
                  <span key={ayah.numberInSurah}>
                    {ayah.text}{" "}
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold mx-1 align-middle">
                      {ayah.numberInSurah}
                    </span>{" "}
                  </span>
                ))}
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
      </div>
    </div>
  );
};

export default PageReader;
