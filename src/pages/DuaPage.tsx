import { HandHeart, BookOpen, Star, Heart, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const duaCategories = [
  { title: "Duas from Quran", arabic: "أدعية من القرآن", icon: BookOpen, count: 25 },
  { title: "Duas from Sunnah", arabic: "أدعية من السنة", icon: Star, count: 40 },
  { title: "Daily Life", arabic: "أدعية الحياة اليومية", icon: Heart, count: 20 },
  { title: "Special Occasions", arabic: "أدعية المناسبات", icon: Star, count: 15 },
  { title: "Protection", arabic: "أدعية الحماية", icon: Star, count: 12 },
  { title: "Forgiveness", arabic: "أدعية الاستغفار", icon: Heart, count: 10 },
  { title: "Gratitude", arabic: "أدعية الشكر", icon: Heart, count: 8 },
  { title: "Guidance", arabic: "أدعية الهداية", icon: BookOpen, count: 14 },
];

const DuaPage = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Duas" subtitle="الدعاء" icon={<HandHeart className="w-6 h-6" />} />

      <div className="px-4 py-4 space-y-2">
        {duaCategories.map((cat, i) => (
          <button
            key={cat.title}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-200 animate-slide-up group"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="w-12 h-12 rounded-2xl islamic-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <cat.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground text-sm">{cat.title}</p>
              <p className="font-arabic text-sm text-primary">{cat.arabic}</p>
              <p className="text-xs text-muted-foreground">{cat.count} duas</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DuaPage;
