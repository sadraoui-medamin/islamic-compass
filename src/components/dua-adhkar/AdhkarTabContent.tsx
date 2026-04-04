import { useCallback, useRef, useState, type ElementType } from "react";
import { CheckCircle2, ChevronLeft, Moon, RotateCcw, Star, Sun } from "lucide-react";
import { adhkarCategories, type AdhkarCategory, type Dhikr } from "@/lib/adhkarData";
import { useLanguage } from "@/lib/languageContext";
import { revealItem } from "./scrollHelpers";

const ICON_MAP: Record<string, ElementType> = {
  sun: Sun,
  moon: Moon,
  star: Star,
};

const AdhkarTabContent = () => {
  const { t, lang } = useLanguage();
  const isArabic = lang === "ar";
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategory | null>(null);
  const [counters, setCounters] = useState<Record<number, number>>({});
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const scrollToItem = useCallback((id: number) => {
    window.setTimeout(() => revealItem(itemRefs.current[id]), 180);
  }, []);

  const onDhikrComplete = useCallback(
    (dhikr: Dhikr, latestCounters: Record<number, number>) => {
      const previousDone = parseInt(localStorage.getItem("adhkar-done") || "0", 10);
      localStorage.setItem("adhkar-done", String(previousDone + 1));
      localStorage.setItem("last-activity", selectedCategory?.title || "Adhkar");

      if (!selectedCategory) return;

      const currentIndex = selectedCategory.adhkar.findIndex((item) => item.id === dhikr.id);

      for (let index = currentIndex + 1; index < selectedCategory.adhkar.length; index += 1) {
        const nextDhikr = selectedCategory.adhkar[index];

        if ((latestCounters[nextDhikr.id] || 0) < nextDhikr.repeat) {
          scrollToItem(nextDhikr.id);
          break;
        }
      }
    },
    [scrollToItem, selectedCategory],
  );

  const handleCount = (dhikr: Dhikr) => {
    setCounters((previous) => {
      const currentCount = previous[dhikr.id] || 0;

      if (currentCount >= dhikr.repeat) return previous;

      const nextCount = currentCount + 1;
      const updatedCounters = { ...previous, [dhikr.id]: nextCount };

      if (nextCount >= dhikr.repeat) {
        onDhikrComplete(dhikr, updatedCounters);
      }

      return updatedCounters;
    });
  };

  const completeDhikr = (dhikr: Dhikr) => {
    setCounters((previous) => {
      const currentCount = previous[dhikr.id] || 0;

      if (currentCount >= dhikr.repeat) return previous;

      const updatedCounters = { ...previous, [dhikr.id]: dhikr.repeat };
      onDhikrComplete(dhikr, updatedCounters);

      return updatedCounters;
    });
  };

  const resetCounter = (id: number) => {
    setCounters((previous) => ({ ...previous, [id]: 0 }));
  };

  const resetAll = () => setCounters({});

  if (selectedCategory) {
    const totalDone = selectedCategory.adhkar.reduce((sum, dhikr) => {
      const count = counters[dhikr.id] || 0;
      return sum + (count >= dhikr.repeat ? 1 : 0);
    }, 0);

    return (
      <div>
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className="rounded-xl bg-muted p-2 transition hover:bg-muted/80"
            aria-label={lang === "ar" ? "العودة" : "Go back"}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{selectedCategory.title}</p>
            <p className="font-arabic text-xs text-muted-foreground">{selectedCategory.arabic}</p>
          </div>

          <button
            onClick={resetAll}
            className="rounded-xl bg-muted p-2 transition hover:bg-muted/80"
            aria-label={lang === "ar" ? "إعادة تعيين الكل" : "Reset all"}
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="mb-3 px-4">
          <div className="text-xs text-muted-foreground">
            {totalDone}/{selectedCategory.adhkar.length} {t("adhkar.completed")}
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(totalDone / selectedCategory.adhkar.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 px-4 py-2">
          {selectedCategory.adhkar.map((dhikr, index) => {
            const currentCount = counters[dhikr.id] || 0;
            const isDone = currentCount >= dhikr.repeat;

            return (
              <div
                key={dhikr.id}
                ref={(element) => {
                  itemRefs.current[dhikr.id] = element;
                }}
                className={`rounded-2xl transition-all duration-300 animate-slide-up ${
                  isDone ? "border border-primary/20 bg-primary/5" : "bg-card"
                }`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <button
                  onClick={() => handleCount(dhikr)}
                  className="w-full p-4 text-left"
                  disabled={isDone}
                >
                  <p className="font-arabic text-right text-lg leading-loose text-foreground" dir="rtl">
                    {dhikr.arabic}
                  </p>

                  {!isArabic && <p className="mt-2 text-sm italic text-muted-foreground">{dhikr.transliteration}</p>}
                  {!isArabic && <p className="mt-1 text-sm text-foreground/80">{dhikr.translation}</p>}
                </button>

                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {dhikr.source}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => resetCounter(dhikr.id)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                      aria-label={lang === "ar" ? "إعادة التعيين" : "Reset counter"}
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    <span className={`min-w-[40px] text-center text-sm font-bold ${isDone ? "text-primary" : "text-foreground"}`}>
                      {currentCount}/{dhikr.repeat}
                    </span>

                    <button
                      onClick={() => completeDhikr(dhikr)}
                      disabled={isDone}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        isDone
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <CheckCircle2 className={`h-4 w-4 ${isDone ? "fill-primary/20" : ""}`} />
                      <span>{isDone ? (lang === "ar" ? "تم" : "Done") : "✓"}</span>
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
    <div className="grid grid-cols-2 gap-3 px-4 py-4">
      {adhkarCategories.map((category, index) => {
        const Icon = ICON_MAP[category.icon] || Star;

        return (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="group flex flex-col items-center gap-3 rounded-2xl bg-card p-5 transition-all duration-300 hover:shadow-lg animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-transform group-hover:scale-110 ${
                index % 2 === 0 ? "gold-gradient" : "islamic-gradient"
              }`}
            >
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>

            <div className="text-center">
              <p className="font-arabic text-base text-primary">{category.arabic}</p>
              <p className="mt-0.5 text-xs font-medium text-foreground">{category.title}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {category.adhkar.length} {t("adhkar.count")}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AdhkarTabContent;