import { useState } from "react";
import { Sun, Moon, Star, ChevronLeft, RotateCcw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { adhkarCategories, type AdhkarCategory, type Dhikr } from "@/lib/adhkarData";

const iconMap: Record<string, React.ElementType> = { sun: Sun, moon: Moon, star: Star };

const AdhkarPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategory | null>(null);
  const [counters, setCounters] = useState<Record<number, number>>({});

  const handleCount = (dhikr: Dhikr) => {
    const current = counters[dhikr.id] || 0;
    if (current < dhikr.repeat) {
      setCounters((prev) => ({ ...prev, [dhikr.id]: current + 1 }));
    }
  };

  const resetCounter = (id: number) => {
    setCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  const resetAll = () => setCounters({});

  if (selectedCategory) {
    const totalDone = selectedCategory.adhkar.reduce((sum, d) => {
      const c = counters[d.id] || 0;
      return sum + (c >= d.repeat ? 1 : 0);
    }, 0);

    return (
      <div className="animate-fade-in">
        <div className="islamic-gradient text-primary-foreground p-4 pb-5">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setSelectedCategory(null)} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{selectedCategory.title}</h1>
              <p className="text-sm opacity-80 font-arabic">{selectedCategory.arabic}</p>
            </div>
            <button onClick={resetAll} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs opacity-70">
            {totalDone}/{selectedCategory.adhkar.length} completed
          </div>
          <div className="w-full h-1.5 rounded-full bg-primary-foreground/20 mt-2">
            <div
              className="h-full rounded-full bg-primary-foreground/60 transition-all duration-300"
              style={{ width: `${(totalDone / selectedCategory.adhkar.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-3">
          {selectedCategory.adhkar.map((dhikr, i) => {
            const current = counters[dhikr.id] || 0;
            const done = current >= dhikr.repeat;

            return (
              <div
                key={dhikr.id}
                className={`rounded-2xl transition-all animate-slide-up ${done ? "bg-primary/5 border border-primary/20" : "bg-card"}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <button
                  onClick={() => handleCount(dhikr)}
                  className="w-full p-4 text-left"
                  disabled={done}
                >
                  <p className="font-arabic text-right text-lg leading-loose text-foreground" dir="rtl">
                    {dhikr.arabic}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    {dhikr.transliteration}
                  </p>
                  <p className="text-sm text-foreground/80 mt-1">
                    {dhikr.translation}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {dhikr.source}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); resetCounter(dhikr.id); }}
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <span className={`text-sm font-bold ${done ? "text-primary" : "text-foreground"}`}>
                        {current}/{dhikr.repeat}
                      </span>
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
    <div className="animate-fade-in">
      <PageHeader title="Adhkar" subtitle="الأذكار" icon={<Sun className="w-6 h-6" />} />

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {adhkarCategories.map((cat, i) => {
          const Icon = iconMap[cat.icon] || Star;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card hover:shadow-lg transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${i % 2 === 0 ? "gold-gradient" : "islamic-gradient"} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-center">
                <p className="font-arabic text-base text-primary">{cat.arabic}</p>
                <p className="text-xs font-medium text-foreground mt-0.5">{cat.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{cat.adhkar.length} adhkar</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdhkarPage;
