import { useState, useEffect } from "react";
import { Trophy, Flame, BookOpen, Sun, CircleDot, Brain, Star, Lock, Check } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

interface Badge {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: typeof Trophy;
  check: () => boolean;
  gradient: string;
}

const BADGES: Badge[] = [
  {
    id: "streak3", nameAr: "مبتدئ متحمس", nameEn: "Eager Starter",
    descAr: "سجّل 3 أيام متتالية", descEn: "3-day login streak",
    icon: Flame, check: () => getStreak() >= 3, gradient: "from-orange-400 to-red-500",
  },
  {
    id: "streak7", nameAr: "ملتزم أسبوعي", nameEn: "Weekly Devotee",
    descAr: "سجّل 7 أيام متتالية", descEn: "7-day login streak",
    icon: Flame, check: () => getStreak() >= 7, gradient: "from-orange-500 to-rose-600",
  },
  {
    id: "streak30", nameAr: "ثابت على الطاعة", nameEn: "Steadfast",
    descAr: "سجّل 30 يوماً متتالياً", descEn: "30-day login streak",
    icon: Star, check: () => getStreak() >= 30, gradient: "from-yellow-400 to-amber-600",
  },
  {
    id: "tasbih100", nameAr: "مسبّح", nameEn: "Remembrance",
    descAr: "100 تسبيحة", descEn: "100 tasbih counts",
    icon: CircleDot, check: () => getStat("tasbih-total") >= 100, gradient: "from-emerald-400 to-teal-600",
  },
  {
    id: "tasbih1000", nameAr: "ذاكر كثير", nameEn: "Devoted Dhakir",
    descAr: "1000 تسبيحة", descEn: "1000 tasbih counts",
    icon: CircleDot, check: () => getStat("tasbih-total") >= 1000, gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "adhkar10", nameAr: "محافظ على الأذكار", nameEn: "Adhkar Keeper",
    descAr: "أكمل 10 أذكار", descEn: "Complete 10 adhkar",
    icon: Sun, check: () => getStat("adhkar-done") >= 10, gradient: "from-sky-400 to-blue-600",
  },
  {
    id: "pages10", nameAr: "قارئ نشيط", nameEn: "Active Reader",
    descAr: "اقرأ 10 صفحات", descEn: "Read 10 Quran pages",
    icon: BookOpen, check: () => getStat("quran-pages-read") >= 10, gradient: "from-violet-400 to-purple-600",
  },
  {
    id: "pages50", nameAr: "جزء كامل", nameEn: "Full Juz",
    descAr: "اقرأ 50 صفحة", descEn: "Read 50 Quran pages",
    icon: BookOpen, check: () => getStat("quran-pages-read") >= 50, gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "quiz_all", nameAr: "عالم بالدين", nameEn: "Scholar",
    descAr: "أكمل جميع فئات الاختبار", descEn: "Complete all quiz categories",
    icon: Brain, check: () => {
      const done = JSON.parse(localStorage.getItem("quiz-completed") || "[]");
      return ["quran", "sunnah", "prophets", "history"].every(c => done.includes(c));
    },
    gradient: "from-pink-400 to-rose-600",
  },
];

function getStreak(): number {
  const raw = localStorage.getItem("login-dates");
  const dates: string[] = raw ? JSON.parse(raw) : [];
  let streak = 0;
  const sorted = [...dates].sort().reverse();
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (sorted[i] === expected.toISOString().slice(0, 10)) streak++;
    else break;
  }
  return streak;
}

function getStat(key: string): number {
  return parseInt(localStorage.getItem(key) || "0", 10);
}

const Achievements = () => {
  const { lang } = useLanguage();
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const set = new Set<string>();
    BADGES.forEach(b => { if (b.check()) set.add(b.id); });
    setUnlocked(set);
    // Persist
    localStorage.setItem("achievements-unlocked", JSON.stringify([...set]));
  }, []);

  const unlockedCount = unlocked.size;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold text-foreground">{lang === "ar" ? "الإنجازات" : "Achievements"}</h2>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          {unlockedCount}/{BADGES.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {BADGES.map((badge) => {
          const isUnlocked = unlocked.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                isUnlocked ? "bg-card" : "bg-muted/50 opacity-60"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isUnlocked
                    ? `bg-gradient-to-br ${badge.gradient} shadow-md`
                    : "bg-muted"
                }`}
              >
                {isUnlocked ? (
                  <badge.icon className="w-5 h-5 text-white" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-[10px] font-bold text-foreground text-center leading-tight">
                {lang === "ar" ? badge.nameAr : badge.nameEn}
              </p>
              <p className="text-[8px] text-muted-foreground text-center leading-tight">
                {lang === "ar" ? badge.descAr : badge.descEn}
              </p>
              {isUnlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
