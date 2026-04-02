import { useState, useRef, useCallback } from "react";
import { HandHeart, BookOpen, Star, Heart, Shield, RotateCcw, Compass, Plane, Users, ChevronRight, ArrowRight, Copy, Check, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DUA_DATA, type DuaCategory, type Dua } from "@/lib/duaData";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/languageContext";

const ICON_MAP: Record<string, React.ElementType> = {
  book: BookOpen, star: Star, heart: Heart, shield: Shield,
  refresh: RotateCcw, compass: Compass, plane: Plane, users: Users,
};

const DuaPage = () => {
  const { t, lang } = useLanguage();
  const isArabic = lang === "ar";
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [completedDuas, setCompletedDuas] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const copyDua = (dua: Dua) => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— ${dua.source}${dua.reference ? ` (${dua.reference})` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    toast({ title: t("dua.copied") });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const completeDua = useCallback((dua: Dua) => {
    if (completedDuas.has(dua.id)) return;
    
    const newCompleted = new Set(completedDuas);
    newCompleted.add(dua.id);
    setCompletedDuas(newCompleted);

    if (!selectedCategory) return;

    // Find next incomplete dua in current category
    const currentIdx = selectedCategory.duas.findIndex((d) => d.id === dua.id);
    let foundNext = false;

    for (let i = currentIdx + 1; i < selectedCategory.duas.length; i++) {
      if (!newCompleted.has(selectedCategory.duas[i].id)) {
        // Scroll to next dua
        setTimeout(() => {
          const el = itemRefs.current[selectedCategory.duas[i].id];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("ring-2", "ring-primary/40");
            setTimeout(() => el.classList.remove("ring-2", "ring-primary/40"), 1000);
          }
        }, 300);
        foundNext = true;
        break;
      }
    }

    // All duas in category completed → auto-open next category
    if (!foundNext) {
      const allDone = selectedCategory.duas.every((d) => newCompleted.has(d.id));
      if (allDone) {
        const catIdx = DUA_DATA.findIndex((c) => c.id === selectedCategory.id);
        if (catIdx < DUA_DATA.length - 1) {
          toast({
            title: lang === "ar" ? "أحسنت! ✅" : "Completed! ✅",
            description: lang === "ar" ? "الانتقال إلى القسم التالي..." : "Moving to next category...",
          });
          setTimeout(() => {
            setSelectedCategory(DUA_DATA[catIdx + 1]);
            // Don't clear completed set — keep tracking across categories
          }, 1200);
        } else {
          toast({
            title: lang === "ar" ? "ما شاء الله! 🤲" : "MashaAllah! 🤲",
            description: lang === "ar" ? "أتممت جميع الأدعية" : "You've completed all duas",
          });
        }
      }
    }
  }, [completedDuas, selectedCategory, lang, toast]);

  if (selectedCategory) {
    const completedCount = selectedCategory.duas.filter((d) => completedDuas.has(d.id)).length;

    return (
      <div className="animate-fade-in">
        <div className="islamic-gradient text-primary-foreground p-4 pb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedCategory(null)} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{selectedCategory.title}</h1>
              <p className="text-sm opacity-80 font-arabic">{selectedCategory.titleAr} · {completedCount}/{selectedCategory.duas.length} {t("dua.duas")}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-primary-foreground/20 mt-3">
            <div
              className="h-full rounded-full bg-primary-foreground/60 transition-all duration-300"
              style={{ width: `${(completedCount / selectedCategory.duas.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {selectedCategory.duas.map((dua, i) => {
            const isDone = completedDuas.has(dua.id);
            return (
              <div
                key={dua.id}
                ref={(el) => { itemRefs.current[dua.id] = el; }}
                className={`p-5 rounded-2xl animate-slide-up space-y-4 transition-all duration-300 ${
                  isDone ? "bg-primary/5 border border-primary/20" : "bg-card"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <p className="font-arabic text-right text-xl leading-loose text-foreground" dir="rtl" style={{ lineHeight: "2.2" }}>
                  {dua.arabic}
                </p>
                {!isArabic && (
                  <p className="text-sm text-primary italic leading-relaxed">
                    {dua.transliteration}
                  </p>
                )}
                {!isArabic && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dua.translation}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    📖 {dua.source}{dua.reference ? ` — ${dua.reference}` : ""}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyDua(dua)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {copiedId === dua.id ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => completeDua(dua)}
                      disabled={isDone}
                      className={`p-2 rounded-lg transition-colors ${
                        isDone
                          ? "text-primary"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isDone ? "fill-primary/20" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("dua.title")} subtitle={t("dua.subtitle")} icon={<HandHeart className="w-6 h-6" />} />

      <div className="px-4 py-4 space-y-2">
        {DUA_DATA.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon] || Star;
          const catCompleted = cat.duas.filter((d) => completedDuas.has(d.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-200 animate-slide-up group"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl islamic-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">{cat.title}</p>
                <p className="font-arabic text-sm text-primary">{cat.titleAr}</p>
                <p className="text-xs text-muted-foreground">
                  {catCompleted > 0 ? `${catCompleted}/` : ""}{cat.duas.length} {t("dua.duas")}
                </p>
              </div>
              {catCompleted === cat.duas.length && cat.duas.length > 0 && (
                <CheckCircle2 className="w-5 h-5 text-primary fill-primary/20 shrink-0" />
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DuaPage;
