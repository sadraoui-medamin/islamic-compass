import { useState, useCallback } from "react";
import { CircleDot, RotateCcw, Save } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const tasbihOptions = [
  { label: "سبحان الله", english: "SubhanAllah", target: 33 },
  { label: "الحمد لله", english: "Alhamdulillah", target: 33 },
  { label: "الله أكبر", english: "Allahu Akbar", target: 34 },
  { label: "لا إله إلا الله", english: "La ilaha illallah", target: 100 },
  { label: "أستغفر الله", english: "Astaghfirullah", target: 100 },
];

const TasbihPage = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState<{ label: string; count: number }[]>([]);

  const selected = tasbihOptions[selectedIdx];
  const progress = Math.min((count / selected.target) * 100, 100);

  const handleTap = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const handleReset = () => setCount(0);

  const handleSave = () => {
    if (count > 0) {
      setSaved((prev) => [...prev, { label: selected.english, count }]);
      setCount(0);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Tasbih" subtitle="التسبيح" icon={<CircleDot className="w-6 h-6" />} />

      <div className="px-4 py-4">
        {/* Tasbih options */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {tasbihOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setSelectedIdx(i); setCount(0); }}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                i === selectedIdx
                  ? "islamic-gradient text-primary-foreground shadow-md"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {opt.english}
            </button>
          ))}
        </div>

        {/* Counter circle */}
        <div className="flex flex-col items-center mt-8">
          <button
            onClick={handleTap}
            className="relative w-52 h-52 rounded-full flex flex-col items-center justify-center bg-card shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-150 group"
          >
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 208 208">
              <circle
                cx="104" cy="104" r="96"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="6"
              />
              <circle
                cx="104" cy="104" r="96"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 96}`}
                strokeDashoffset={`${2 * Math.PI * 96 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>

            <span className="font-arabic text-2xl text-primary mb-1">{selected.label}</span>
            <span className="text-5xl font-bold text-foreground">{count}</span>
            <span className="text-sm text-muted-foreground mt-1">/ {selected.target}</span>
          </button>

          <p className="text-xs text-muted-foreground mt-4">Tap to count</p>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl islamic-gradient text-primary-foreground text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        {/* Saved records */}
        {saved.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-foreground mb-2">Saved Records</h3>
            <div className="space-y-2">
              {saved.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-card text-sm">
                  <span className="text-foreground">{s.label}</span>
                  <span className="font-bold text-primary">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasbihPage;
