import { useState } from "react";
import { HandHeart, Sun } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DuaPage from "./DuaPage";
import AdhkarPage from "./AdhkarPage";
import { useLanguage } from "@/lib/languageContext";

const DuaAdhkarPage = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"dua" | "adhkar">("dua");

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={tab === "dua" ? t("dua.title") : t("adhkar.title")}
        subtitle={tab === "dua" ? t("dua.subtitle") : t("adhkar.subtitle")}
        icon={tab === "dua" ? <HandHeart className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      >
        <div className="flex gap-1 bg-primary-foreground/10 rounded-xl p-1">
          <button
            onClick={() => setTab("dua")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
              tab === "dua"
                ? "bg-primary-foreground/20 text-primary-foreground shadow-sm"
                : "text-primary-foreground/60 hover:text-primary-foreground"
            }`}
          >
            <HandHeart className="w-3.5 h-3.5" />
            {t("dua.title")}
          </button>
          <button
            onClick={() => setTab("adhkar")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
              tab === "adhkar"
                ? "bg-primary-foreground/20 text-primary-foreground shadow-sm"
                : "text-primary-foreground/60 hover:text-primary-foreground"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            {t("adhkar.title")}
          </button>
        </div>
      </PageHeader>

      {/* Render content without their own headers */}
      {tab === "dua" ? <DuaContentOnly /> : <AdhkarContentOnly />}
    </div>
  );
};

// Extract just the content portions
import { BookOpen, Star, Heart, Shield, RotateCcw, Compass, Plane, Users, ChevronRight, ArrowRight, Copy, Check } from "lucide-react";
import { DUA_DATA, type DuaCategory, type Dua } from "@/lib/duaData";
import { useToast } from "@/hooks/use-toast";

const ICON_MAP: Record<string, React.ElementType> = {
  book: BookOpen, star: Star, heart: Heart, shield: Shield,
  refresh: RotateCcw, compass: Compass, plane: Plane, users: Users,
};

const DuaContentOnly = () => {
  const { t, lang } = useLanguage();
  const isArabic = lang === "ar";
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();

  const copyDua = (dua: Dua) => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— ${dua.source}${dua.reference ? ` (${dua.reference})` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    toast({ title: t("dua.copied") });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (selectedCategory) {
    return (
      <div>
        <div className="px-4 pt-3 pb-2">
          <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-sm text-primary font-medium">
            <ArrowRight className="w-4 h-4 rotate-180" />
            {selectedCategory.title} <span className="font-arabic text-xs opacity-70">({selectedCategory.titleAr})</span>
          </button>
        </div>
        <div className="px-4 py-2 space-y-4">
          {selectedCategory.duas.map((dua, i) => (
            <div key={dua.id} className="p-5 rounded-2xl bg-card animate-slide-up space-y-4" style={{ animationDelay: `${i * 40}ms` }}>
              <p className="font-arabic text-right text-xl leading-loose text-foreground" dir="rtl" style={{ lineHeight: "2.2" }}>{dua.arabic}</p>
              {!isArabic && <p className="text-sm text-primary italic leading-relaxed">{dua.transliteration}</p>}
              {!isArabic && <p className="text-sm text-muted-foreground leading-relaxed">{dua.translation}</p>}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">📖 {dua.source}{dua.reference ? ` — ${dua.reference}` : ""}</span>
                <button onClick={() => copyDua(dua)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  {copiedId === dua.id ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-2">
      {DUA_DATA.map((cat, i) => {
        const Icon = ICON_MAP[cat.icon] || Star;
        return (
          <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-200 animate-slide-up group" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="w-12 h-12 rounded-2xl islamic-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground text-sm">{cat.title}</p>
              <p className="font-arabic text-sm text-primary">{cat.titleAr}</p>
              <p className="text-xs text-muted-foreground">{cat.duas.length} {t("dua.duas")}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        );
      })}
    </div>
  );
};

import { Moon, ChevronLeft } from "lucide-react";
import { adhkarCategories, type AdhkarCategory, type Dhikr } from "@/lib/adhkarData";

const iconMap2: Record<string, React.ElementType> = { sun: Sun, moon: Moon, star: Star };

const AdhkarContentOnly = () => {
  const { t, lang } = useLanguage();
  const isArabic = lang === "ar";
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategory | null>(null);
  const [counters, setCounters] = useState<Record<number, number>>({});

  const handleCount = (dhikr: Dhikr) => {
    const current = counters[dhikr.id] || 0;
    if (current < dhikr.repeat) {
      const newCount = current + 1;
      setCounters((prev) => ({ ...prev, [dhikr.id]: newCount }));
      if (newCount >= dhikr.repeat) {
        const prev = parseInt(localStorage.getItem("adhkar-done") || "0", 10);
        localStorage.setItem("adhkar-done", String(prev + 1));
        localStorage.setItem("last-activity", selectedCategory?.title || "Adhkar");
      }
    }
  };

  const resetCounter = (id: number) => setCounters((prev) => ({ ...prev, [id]: 0 }));
  const resetAll = () => setCounters({});

  if (selectedCategory) {
    const totalDone = selectedCategory.adhkar.reduce((sum, d) => sum + ((counters[d.id] || 0) >= d.repeat ? 1 : 0), 0);

    return (
      <div>
        <div className="px-4 pt-3 pb-2 flex items-center gap-3">
          <button onClick={() => setSelectedCategory(null)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{selectedCategory.title}</p>
            <p className="text-xs text-muted-foreground font-arabic">{selectedCategory.arabic}</p>
          </div>
          <button onClick={resetAll} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition">
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
        <div className="px-4 mb-3">
          <div className="text-xs text-muted-foreground">{totalDone}/{selectedCategory.adhkar.length} {t("adhkar.completed")}</div>
          <div className="w-full h-1.5 rounded-full bg-muted mt-1">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${(totalDone / selectedCategory.adhkar.length) * 100}%` }} />
          </div>
        </div>
        <div className="px-4 py-2 space-y-3">
          {selectedCategory.adhkar.map((dhikr, i) => {
            const current = counters[dhikr.id] || 0;
            const done = current >= dhikr.repeat;
            return (
              <div key={dhikr.id} className={`rounded-2xl transition-all animate-slide-up ${done ? "bg-primary/5 border border-primary/20" : "bg-card"}`} style={{ animationDelay: `${i * 40}ms` }}>
                <button onClick={() => handleCount(dhikr)} className="w-full p-4 text-left" disabled={done}>
                  <p className="font-arabic text-right text-lg leading-loose text-foreground" dir="rtl">{dhikr.arabic}</p>
                  {!isArabic && <p className="text-sm text-muted-foreground mt-2 italic">{dhikr.transliteration}</p>}
                  {!isArabic && <p className="text-sm text-foreground/80 mt-1">{dhikr.translation}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{dhikr.source}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); resetCounter(dhikr.id); }} className="p-1 rounded-md hover:bg-muted transition-colors">
                        <RotateCcw className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <span className={`text-sm font-bold ${done ? "text-primary" : "text-foreground"}`}>{current}/{dhikr.repeat}</span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 grid grid-cols-2 gap-3">
      {adhkarCategories.map((cat, i) => {
        const Icon = iconMap2[cat.icon] || Star;
        return (
          <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card hover:shadow-lg transition-all duration-300 animate-slide-up group" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`w-12 h-12 rounded-2xl ${i % 2 === 0 ? "gold-gradient" : "islamic-gradient"} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-center">
              <p className="font-arabic text-base text-primary">{cat.arabic}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{cat.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{cat.adhkar.length} {t("adhkar.count")}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DuaAdhkarPage;
