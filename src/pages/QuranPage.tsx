import { useState } from "react";
import { BookOpen, Search, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const surahs = [
  { number: 1, name: "الفاتحة", english: "Al-Fatiha", verses: 7, type: "Meccan" },
  { number: 2, name: "البقرة", english: "Al-Baqarah", verses: 286, type: "Medinan" },
  { number: 3, name: "آل عمران", english: "Ali 'Imran", verses: 200, type: "Medinan" },
  { number: 4, name: "النساء", english: "An-Nisa", verses: 176, type: "Medinan" },
  { number: 5, name: "المائدة", english: "Al-Ma'idah", verses: 120, type: "Medinan" },
  { number: 6, name: "الأنعام", english: "Al-An'am", verses: 165, type: "Meccan" },
  { number: 7, name: "الأعراف", english: "Al-A'raf", verses: 206, type: "Meccan" },
  { number: 8, name: "الأنفال", english: "Al-Anfal", verses: 75, type: "Medinan" },
  { number: 9, name: "التوبة", english: "At-Tawbah", verses: 129, type: "Medinan" },
  { number: 10, name: "يونس", english: "Yunus", verses: 109, type: "Meccan" },
  { number: 11, name: "هود", english: "Hud", verses: 123, type: "Meccan" },
  { number: 12, name: "يوسف", english: "Yusuf", verses: 111, type: "Meccan" },
  { number: 13, name: "الرعد", english: "Ar-Ra'd", verses: 43, type: "Medinan" },
  { number: 14, name: "ابراهيم", english: "Ibrahim", verses: 52, type: "Meccan" },
  { number: 15, name: "الحجر", english: "Al-Hijr", verses: 99, type: "Meccan" },
  { number: 16, name: "النحل", english: "An-Nahl", verses: 128, type: "Meccan" },
  { number: 17, name: "الإسراء", english: "Al-Isra", verses: 111, type: "Meccan" },
  { number: 18, name: "الكهف", english: "Al-Kahf", verses: 110, type: "Meccan" },
  { number: 19, name: "مريم", english: "Maryam", verses: 98, type: "Meccan" },
  { number: 20, name: "طه", english: "Taha", verses: 135, type: "Meccan" },
  { number: 36, name: "يس", english: "Ya-Sin", verses: 83, type: "Meccan" },
  { number: 55, name: "الرحمن", english: "Ar-Rahman", verses: 78, type: "Medinan" },
  { number: 56, name: "الواقعة", english: "Al-Waqi'ah", verses: 96, type: "Meccan" },
  { number: 67, name: "الملك", english: "Al-Mulk", verses: 30, type: "Meccan" },
  { number: 112, name: "الإخلاص", english: "Al-Ikhlas", verses: 4, type: "Meccan" },
  { number: 113, name: "الفلق", english: "Al-Falaq", verses: 5, type: "Meccan" },
  { number: 114, name: "الناس", english: "An-Nas", verses: 6, type: "Meccan" },
];

const QuranPage = () => {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState("");

  const filtered = surahs.filter(
    (s) =>
      s.english.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.number.toString() === search
  );

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
        {filtered.map((surah, i) => (
          <button
            key={surah.number}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-200 animate-slide-up group"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
              {surah.number}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground text-sm">{surah.english}</p>
              <p className="text-xs text-muted-foreground">{surah.verses} verses · {surah.type}</p>
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
