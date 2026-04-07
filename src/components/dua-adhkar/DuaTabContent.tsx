import { useCallback, useRef, useState, type ElementType } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  Copy,
  Heart,
  Plane,
  RotateCcw,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DUA_DATA, type Dua, type DuaCategory } from "@/lib/duaData";
import { useLanguage } from "@/lib/languageContext";
import { revealItem } from "./scrollHelpers";

const ICON_MAP: Record<string, ElementType> = {
  book: BookOpen,
  star: Star,
  heart: Heart,
  shield: Shield,
  refresh: RotateCcw,
  compass: Compass,
  plane: Plane,
  users: Users,
};

const COMPLETED_DUAS_KEY = "completed-duas";

function loadCompletedDuas(): Set<number> {
  try {
    const arr = JSON.parse(localStorage.getItem(COMPLETED_DUAS_KEY) || "[]");
    return new Set(arr);
  } catch {
    return new Set();
  }
}

const DuaTabContent = () => {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const isArabic = lang === "ar";
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [completedDuas, setCompletedDuas] = useState<Set<number>>(loadCompletedDuas);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    localStorage.setItem(COMPLETED_DUAS_KEY, JSON.stringify([...completedDuas]));
  }, [completedDuas]);

  const scrollToItem = useCallback((id: number) => {
    window.setTimeout(() => revealItem(itemRefs.current[id]), 180);
  }, []);

  const copyDua = async (dua: Dua) => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— ${dua.source}${dua.reference ? ` (${dua.reference})` : ""}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(dua.id);
      toast({ title: t("dua.copied") });
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: lang === "ar" ? "تعذر النسخ" : "Copy failed",
        description: lang === "ar" ? "حاول مرة أخرى" : "Please try again.",
      });
    }
  };

  const completeDua = useCallback(
    (dua: Dua) => {
      setCompletedDuas((previous) => {
        if (previous.has(dua.id)) return previous;

        const updated = new Set(previous);
        updated.add(dua.id);

        if (!selectedCategory) return updated;

        const currentIndex = selectedCategory.duas.findIndex((item) => item.id === dua.id);

        for (let index = currentIndex + 1; index < selectedCategory.duas.length; index += 1) {
          const nextDua = selectedCategory.duas[index];

          if (!updated.has(nextDua.id)) {
            scrollToItem(nextDua.id);
            return updated;
          }
        }

        const finishedCategory = selectedCategory.duas.every((item) => updated.has(item.id));

        if (!finishedCategory) return updated;

        const categoryIndex = DUA_DATA.findIndex((category) => category.id === selectedCategory.id);

        if (categoryIndex < DUA_DATA.length - 1) {
          toast({
            title: lang === "ar" ? "أحسنت! ✅" : "Completed! ✅",
            description: lang === "ar" ? "فتح القسم التالي..." : "Opening the next category...",
          });

          window.setTimeout(() => setSelectedCategory(DUA_DATA[categoryIndex + 1]), 900);
        } else {
          toast({
            title: lang === "ar" ? "ما شاء الله! 🤲" : "MashaAllah! 🤲",
            description: lang === "ar" ? "أتممت جميع الأدعية" : "You've completed all duas.",
          });
        }

        return updated;
      });
    },
    [lang, selectedCategory, scrollToItem, toast],
  );

  if (selectedCategory) {
    const completedCount = selectedCategory.duas.filter((dua) => completedDuas.has(dua.id)).length;

    return (
      <div>
        <div className="px-4 pt-3 pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span>{selectedCategory.title}</span>
            <span className="font-arabic text-xs text-muted-foreground">({selectedCategory.titleAr})</span>
          </button>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {completedCount}/{selectedCategory.duas.length} {t("dua.duas")}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(completedCount / selectedCategory.duas.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 py-2">
          {selectedCategory.duas.map((dua, index) => {
            const isDone = completedDuas.has(dua.id);

            return (
              <div
                key={dua.id}
                ref={(element) => {
                  itemRefs.current[dua.id] = element;
                }}
                className={`space-y-4 rounded-2xl p-5 transition-all duration-300 animate-slide-up ${
                  isDone ? "border border-primary/20 bg-primary/5" : "bg-card"
                }`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <p className="font-arabic text-right text-xl leading-loose text-foreground" dir="rtl" style={{ lineHeight: "2.2" }}>
                  {dua.arabic}
                </p>

                {!isArabic && <p className="text-sm italic leading-relaxed text-primary">{dua.transliteration}</p>}
                {!isArabic && <p className="text-sm leading-relaxed text-muted-foreground">{dua.translation}</p>}

                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-xs text-muted-foreground">
                    📖 {dua.source}
                    {dua.reference ? ` — ${dua.reference}` : ""}
                  </span>

                  <button
                    onClick={() => copyDua(dua)}
                    className="rounded-lg p-2 transition-colors hover:bg-muted"
                    aria-label={lang === "ar" ? "نسخ الدعاء" : "Copy dua"}
                  >
                    {copiedId === dua.id ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => completeDua(dua)}
                  disabled={isDone}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                    isDone
                      ? "bg-primary/10 text-primary"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${isDone ? "fill-primary/20" : ""}`} />
                  {isDone ? (lang === "ar" ? "تم ✓" : "Done ✓") : lang === "ar" ? "تمت القراءة" : "Mark as Read"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4 py-4">
      {DUA_DATA.map((category, index) => {
        const Icon = ICON_MAP[category.icon] || Star;
        const completedCount = category.duas.filter((dua) => completedDuas.has(dua.id)).length;

        return (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="group flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left transition-all duration-200 hover:bg-muted animate-slide-up"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="islamic-gradient flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-transform group-hover:scale-105">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{category.title}</p>
              <p className="font-arabic text-sm text-primary">{category.titleAr}</p>
              <p className="text-xs text-muted-foreground">
                {completedCount > 0 ? `${completedCount}/` : ""}
                {category.duas.length} {t("dua.duas")}
              </p>
            </div>

            {completedCount === category.duas.length && category.duas.length > 0 && (
              <CheckCircle2 className="h-5 w-5 shrink-0 fill-primary/20 text-primary" />
            )}

            <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          </button>
        );
      })}
    </div>
  );
};

export default DuaTabContent;