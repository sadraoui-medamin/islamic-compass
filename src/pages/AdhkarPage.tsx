import { useState } from "react";
import { Sun, Moon, Star, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const categories = [
  {
    title: "Morning Adhkar",
    arabic: "أذكار الصباح",
    icon: Sun,
    count: 15,
    color: "gold-gradient",
  },
  {
    title: "Evening Adhkar",
    arabic: "أذكار المساء",
    icon: Moon,
    count: 15,
    color: "islamic-gradient",
  },
  {
    title: "After Prayer",
    arabic: "أذكار بعد الصلاة",
    icon: Star,
    count: 10,
    color: "gold-gradient",
  },
  { title: "Before Sleep", arabic: "أذكار النوم", icon: Moon, count: 8, color: "islamic-gradient" },
  { title: "Upon Waking", arabic: "أذكار الاستيقاظ", icon: Sun, count: 6, color: "gold-gradient" },
  { title: "Entering Mosque", arabic: "دخول المسجد", icon: Star, count: 4, color: "islamic-gradient" },
  { title: "After Eating", arabic: "بعد الطعام", icon: Star, count: 5, color: "gold-gradient" },
  { title: "Traveling", arabic: "أذكار السفر", icon: Star, count: 7, color: "islamic-gradient" },
];

const AdhkarPage = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Adhkar" subtitle="الأذكار" icon={<Sun className="w-6 h-6" />} />

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {categories.map((cat, i) => (
          <button
            key={cat.title}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card hover:shadow-lg transition-all duration-300 animate-slide-up group"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
              <cat.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-center">
              <p className="font-arabic text-base text-primary">{cat.arabic}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{cat.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{cat.count} adhkar</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdhkarPage;
