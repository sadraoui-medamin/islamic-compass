import { useState, useCallback, useRef } from "react";
import { CircleDot, RotateCcw, Plus, Trash2, ChevronLeft, ChevronRight, Minus, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/lib/languageContext";

interface TasbihItem {
  id: string;
  label: string;
  english: string;
  target: number;
}

const defaultItems: TasbihItem[] = [
  { id: "1", label: "سبحان الله", english: "SubhanAllah", target: 33 },
  { id: "2", label: "الحمد لله", english: "Alhamdulillah", target: 33 },
  { id: "3", label: "الله أكبر", english: "Allahu Akbar", target: 34 },
  { id: "4", label: "لا إله إلا الله", english: "La ilaha illallah", target: 100 },
  { id: "5", label: "أستغفر الله", english: "Astaghfirullah", target: 100 },
];

type View = "list" | "counter";

const TasbihPage = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<TasbihItem[]>(defaultItems);
  const [activeIdx, setActiveIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [view, setView] = useState<View>("list");
  const [showAdd, setShowAdd] = useState(false);
  const [newArabic, setNewArabic] = useState("");
  const [newEnglish, setNewEnglish] = useState("");
  const [newTarget, setNewTarget] = useState("33");
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const active = items[activeIdx];
  const progress = active ? Math.min((count / active.target) * 100, 100) : 0;

  // Auto-advance to next item when target reached
  const handleTap = useCallback(() => {
    setCount((c) => {
      const next = c + 1;
      if (active && next >= active.target && activeIdx < items.length - 1) {
        setTimeout(() => {
          setSwipeAnim("left");
          setTimeout(() => {
            setActiveIdx((i) => i + 1);
            setCount(0);
            setSwipeAnim(null);
          }, 200);
        }, 400);
      }
      return next;
    });
  }, [active, activeIdx, items.length]);

  const handleReset = () => setCount(0);
  const handleUndo = () => setCount((c) => Math.max(0, c - 1));

  const goNext = () => {
    if (activeIdx >= items.length - 1) return;
    setSwipeAnim("left");
    setTimeout(() => { setActiveIdx((i) => i + 1); setCount(0); setSwipeAnim(null); }, 200);
  };

  const goPrev = () => {
    if (activeIdx <= 0) return;
    setSwipeAnim("right");
    setTimeout(() => { setActiveIdx((i) => i - 1); setCount(0); setSwipeAnim(null); }, 200);
  };

  // Swipe between tasbih items
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) goPrev();
      else goNext();
    }
  }, [activeIdx, items.length]);

  const addItem = () => {
    if (!newArabic.trim() || !newEnglish.trim()) return;
    const item: TasbihItem = {
      id: Date.now().toString(),
      label: newArabic.trim(),
      english: newEnglish.trim(),
      target: parseInt(newTarget) || 33,
    };
    setItems((prev) => [...prev, item]);
    setNewArabic("");
    setNewEnglish("");
    setNewTarget("33");
    setShowAdd(false);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const enterCounter = (idx: number) => {
    setActiveIdx(idx);
    setCount(0);
    setView("counter");
  };

  // LIST VIEW
  if (view === "list") {
    return (
      <div className="animate-fade-in">
        <PageHeader title={t("tasbih.title")} subtitle={t("tasbih.subtitle")} icon={<CircleDot className="w-6 h-6" />} />

        <div className="px-4 py-4">
          {/* Item list */}
          <div className="space-y-2">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => enterCounter(idx)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-muted transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full islamic-gradient flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground text-sm font-bold">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-arabic text-lg text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.english} · {item.target}×</p>
                </div>
                {!defaultItems.find((d) => d.id === item.id) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>

          {/* Add new form */}
          {showAdd ? (
            <div className="mt-4 p-4 rounded-2xl bg-card border border-border space-y-3">
              <input
                value={newArabic}
                onChange={(e) => setNewArabic(e.target.value)}
                placeholder={t("tasbih.arabicText")}
                className="w-full px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none font-arabic"
                dir="rtl"
              />
              <input
                value={newEnglish}
                onChange={(e) => setNewEnglish(e.target.value)}
                placeholder={t("tasbih.englishName")}
                className="w-full px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none"
              />
              <input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder={t("tasbih.targetCount")}
                className="w-full px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl bg-muted text-foreground text-sm">{t("tasbih.cancel")}</button>
                <button onClick={addItem} className="flex-1 py-2 rounded-xl islamic-gradient text-primary-foreground text-sm shadow-md">{t("tasbih.add")}</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> {t("tasbih.addCustom")}
            </button>
          )}
        </div>
      </div>
    );
  }

  // COUNTER VIEW
  return (
    <div
      className="animate-fade-in min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="islamic-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-sm opacity-80">{activeIdx + 1} / {items.length}</p>
            <p className="text-xs opacity-60">{active?.english}</p>
          </div>
          <div className="w-9" /> {/* spacer */}
        </div>
      </div>

      {/* Counter */}
      <div className={`flex flex-col items-center mt-10 px-4 transition-all duration-200 ${
        swipeAnim === "left" ? "translate-x-[-30px] opacity-0" :
        swipeAnim === "right" ? "translate-x-[30px] opacity-0" : "translate-x-0 opacity-100"
      }`}>
        <button
          onClick={handleTap}
          className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center bg-card shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-150"
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
            <circle cx="112" cy="112" r="104" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="112" cy="112" r="104" fill="none"
              stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 104}`}
              strokeDashoffset={`${2 * Math.PI * 104 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
          </svg>

          <span className="font-arabic text-2xl text-primary mb-1">{active?.label}</span>
          <span className="text-5xl font-bold text-foreground">{count}</span>
          <span className="text-sm text-muted-foreground mt-1">/ {active?.target}</span>
        </button>

        <p className="text-xs text-muted-foreground mt-4">{t("tasbih.tapToCount")}</p>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={goPrev}
            disabled={activeIdx <= 0}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleUndo}
            disabled={count <= 0}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition disabled:opacity-30"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            disabled={activeIdx >= items.length - 1}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-6">
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIdx ? "bg-primary w-5" : i < activeIdx ? "bg-primary/40" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasbihPage;
