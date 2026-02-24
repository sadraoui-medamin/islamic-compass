import { useState } from "react";
import { BookOpen, Search, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import SurahReader from "@/components/SurahReader";
import { fetchAllSurahs, type Surah } from "@/lib/quranApi";
import { Skeleton } from "@/components/ui/skeleton";

const QuranPage = () => {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

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

  if (selectedSurah) {
    return (
      <SurahReader
        surahNumber={selectedSurah.number}
        surahName={selectedSurah.englishName}
        surahNameAr={selectedSurah.name}
        onBack={() => setSelectedSurah(null)}
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
          <input
            type="number"
            placeholder="Page"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            className="w-16 px-2 py-2.5 rounded-xl bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 text-sm text-center border-0 outline-none focus:bg-primary-foreground/15 transition"
          />
        </div>
      </PageHeader>

      <div className="px-4 py-4 space-y-2">
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
            onClick={() => setSelectedSurah(surah)}
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
      </div>
    </div>
  );
};

export default QuranPage;
