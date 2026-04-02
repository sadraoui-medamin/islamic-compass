import { useState, useCallback, useRef } from "react";
import { CircleDot, Plus, Trash2, ChevronLeft, ChevronRight, Minus, ArrowLeft, GripVertical } from "lucide-react";
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

const encourageMessagesAr = [
  "ما شاء الله، استمر! 🌟",
  "بارك الله فيك 💚",
  "أحسنت، لا تتوقف! 🤲",
  "ذكر الله حياة القلوب 🕌",
  "اللهم تقبل منا 🌙",
  "أنت على الطريق الصحيح ✨",
];

const encourageMessagesEn = [
  "MashaAllah, keep going! 🌟",
  "May Allah bless you 💚",
  "Well done, don't stop! 🤲",
  "Dhikr brings life to hearts 🕌",
  "May Allah accept from us 🌙",
  "You're on the right path ✨",
];

type View = "list" | "counter";

const TasbihPage = () => {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<TasbihItem[]>(defaultItems);
  const [activeIdx, setActiveIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [view, setView] = useState<View>("list");
  const [showAdd, setShowAdd] = useState(false);
  const [newArabic, setNewArabic] = useState("");
  const [newEnglish, setNewEnglish] = useState("");
  const [newTarget, setNewTarget] = useState("33");
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const [encourageMsg, setEncourageMsg] = useState<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Drag reorder state
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragTouchStartY = useRef<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

  const active = items[activeIdx];
  const progress = active ? Math.min((count / active.target) * 100, 100) : 0;

  const showEncouragement = useCallback(() => {
    const msgs = lang === "ar" ? encourageMessagesAr : encourageMessagesEn;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    setEncourageMsg(msg);
    setTimeout(() => setEncourageMsg(null), 2000);
  }, [lang]);

  const handleTap = useCallback(() => {
    setCount((c) => {
      const next = c + 1;
      const prev = parseInt(localStorage.getItem("tasbih-total") || "0", 10);
      localStorage.setItem("tasbih-total", String(prev + 1));
      localStorage.setItem("last-activity", active?.english || "Tasbih");
      if (next === Math.floor(active.target / 2) || next === active.target) {
        showEncouragement();
      }
      if (active && next >= active.target && activeIdx < items.length - 1) {
        setTimeout(() => {
          setSwipeAnim("left");
          setTimeout(() => {
            setActiveIdx((i) => i + 1);
            setCount(0);
            setSwipeAnim(null);
          }, 300);
        }, 600);
      }
      return next;
    });
  }, [active, activeIdx, items.length, showEncouragement]);

  const handleUndo = () => setCount((c) => Math.max(0, c - 1));

  const goNext = () => {
    if (activeIdx >= items.length - 1) return;
    setSwipeAnim("left");
    setTimeout(() => { setActiveIdx((i) => i + 1); setCount(0); setSwipeAnim(null); }, 300);
  };

  const goPrev = () => {
    if (activeIdx <= 0) return;
    setSwipeAnim("right");
    setTimeout(() => { setActiveIdx((i) => i - 1); setCount(0); setSwipeAnim(null); }, 300);
  };

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

  // Drag reorder handlers
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
    dragItemRef.current = idx;
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDragEnd = () => {
    if (dragIdx !== null && dragOverIdx !== null && dragIdx !== dragOverIdx) {
      setItems((prev) => {
        const newItems = [...prev];
        const [removed] = newItems.splice(dragIdx, 1);
        newItems.splice(dragOverIdx, 0, removed);
        return newItems;
      });
    }
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // Touch-based drag reorder
  const handleGripTouchStart = (e: React.TouchEvent, idx: number) => {
    e.stopPropagation();
    setDragIdx(idx);
    dragItemRef.current = idx;
    dragTouchStartY.current = e.touches[0].clientY;
  };

  const handleGripTouchMove = (e: React.TouchEvent) => {
    if (dragIdx === null || !listRef.current) return;
    const touchY = e.touches[0].clientY;
    const children = listRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom) {
        setDragOverIdx(i);
        break;
      }
    }
  };

  const handleGripTouchEnd = () => {
    handleDragEnd();
  };

  // LIST VIEW
  if (view === "list") {
    return (
      <div className="animate-fade-in">
        <PageHeader title={t("tasbih.title")} subtitle={t("tasbih.subtitle")} icon={<CircleDot className="w-6 h-6" />} />
        <div className="px-4 py-4">
          <div className="space-y-2" ref={listRef} onTouchMove={handleGripTouchMove}>
            {items.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`w-full flex items-center gap-2 rounded-2xl bg-card transition-all duration-200 ${
                  dragIdx === idx ? "opacity-50 scale-95" : ""
                } ${dragOverIdx === idx && dragIdx !== idx ? "border-2 border-primary/40" : "border-2 border-transparent"}`}
              >
                {/* Drag handle */}
                <div
                  className="pl-2 py-4 cursor-grab active:cursor-grabbing touch-none"
                  onTouchStart={(e) => handleGripTouchStart(e, idx)}
                  onTouchEnd={handleGripTouchEnd}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                </div>

                <button
                  onClick={() => enterCounter(idx)}
                  className="flex-1 flex items-center gap-3 p-4 pl-1 text-left group active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 rounded-full islamic-gradient flex items-center justify-center shrink-0 shadow-md">
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
              </div>
            ))}
          </div>

          {showAdd ? (
            <div className="mt-4 p-4 rounded-2xl bg-card border border-border space-y-3 animate-scale-in">
              <input value={newArabic} onChange={(e) => setNewArabic(e.target.value)}
                placeholder={t("tasbih.arabicText")}
                className="w-full px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none font-arabic" dir="rtl" />
              <input value={newEnglish} onChange={(e) => setNewEnglish(e.target.value)}
                placeholder={t("tasbih.englishName")}
                className="w-full px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none" />
              <input type="number" value={newTarget} onChange={(e) => setNewTarget(e.target.value)}
                placeholder={t("tasbih.targetCount")}
                className="w-full px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl bg-muted text-foreground text-sm">{t("tasbih.cancel")}</button>
                <button onClick={addItem} className="flex-1 py-2 rounded-xl islamic-gradient text-primary-foreground text-sm shadow-md">{t("tasbih.add")}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-sm">
              <Plus className="w-4 h-4" /> {t("tasbih.addCustom")}
            </button>
          )}
        </div>
      </div>
    );
  }

  // COUNTER VIEW
  const isComplete = count >= (active?.target || 0);

  return (
    <div className="animate-fade-in min-h-screen" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="islamic-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-sm opacity-80">{activeIdx + 1} / {items.length}</p>
            <p className="text-xs opacity-60">{active?.english}</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="h-8 flex items-center justify-center">
        {encourageMsg && (
          <p className="text-sm font-medium text-primary animate-fade-in">{encourageMsg}</p>
        )}
      </div>

      <div className={`flex flex-col items-center mt-4 px-4 transition-all duration-300 ease-out ${
        swipeAnim === "left" ? "-translate-x-10 opacity-0" :
        swipeAnim === "right" ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
      }`}>
        <button
          onClick={handleTap}
          className={`relative w-56 h-56 rounded-full flex flex-col items-center justify-center bg-card shadow-xl transition-all duration-150 ${
            isComplete ? "shadow-primary/30 shadow-2xl" : "hover:shadow-2xl active:scale-95"
          }`}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
            <circle cx="112" cy="112" r="104" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="112" cy="112" r="104" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 104}`}
              strokeDashoffset={`${2 * Math.PI * 104 * (1 - progress / 100)}`}
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {isComplete ? (
            <>
              <span className="text-3xl mb-1">✅</span>
              <span className="text-sm font-bold text-primary">
                {lang === "ar" ? "أحسنت!" : "Completed!"}
              </span>
              <span className="text-4xl font-bold text-foreground mt-1">{count}</span>
            </>
          ) : (
            <>
              <span className="font-arabic text-2xl text-primary mb-1">{active?.label}</span>
              <span className="text-5xl font-bold text-foreground">{count}</span>
              <span className="text-sm text-muted-foreground mt-1">/ {active?.target}</span>
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground mt-4">{t("tasbih.tapToCount")}</p>

        <div className="flex items-center gap-3 mt-6">
          <button onClick={goPrev} disabled={activeIdx <= 0}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all active:scale-90 disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleUndo} disabled={count <= 0}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all active:scale-90 disabled:opacity-30">
            <Minus className="w-5 h-5" />
          </button>
          <button onClick={goNext} disabled={activeIdx >= items.length - 1}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all active:scale-90 disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1.5 mt-6">
          {items.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIdx ? "bg-primary w-5" : i < activeIdx ? "bg-primary/40 w-2" : "bg-border w-2"
            }`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasbihPage;
