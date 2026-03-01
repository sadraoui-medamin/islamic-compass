import { useState } from "react";
import { HandHeart, BookOpen, Star, Heart, Shield, RotateCcw, Compass, Plane, Users, ChevronRight, ArrowRight, Copy, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DUA_DATA, type DuaCategory, type Dua } from "@/lib/duaData";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/languageContext";

const ICON_MAP: Record<string, React.ElementType> = {
  book: BookOpen, star: Star, heart: Heart, shield: Shield,
  refresh: RotateCcw, compass: Compass, plane: Plane, users: Users,
};

const DuaPage = () => {
  const { t } = useLanguage();
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
      <div className="animate-fade-in">
        <div className="islamic-gradient text-primary-foreground p-4 pb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedCategory(null)} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{selectedCategory.title}</h1>
              <p className="text-sm opacity-80 font-arabic">{selectedCategory.titleAr} · {selectedCategory.duas.length} {t("dua.duas")}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {selectedCategory.duas.map((dua, i) => (
            <div
              key={dua.id}
              className="p-5 rounded-2xl bg-card animate-slide-up space-y-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <p className="font-arabic text-right text-xl leading-loose text-foreground" dir="rtl" style={{ lineHeight: "2.2" }}>
                {dua.arabic}
              </p>
              <p className="text-sm text-primary italic leading-relaxed">
                {dua.transliteration}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {dua.translation}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  📖 {dua.source}{dua.reference ? ` — ${dua.reference}` : ""}
                </span>
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
              </div>
            </div>
          ))}
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
                <p className="text-xs text-muted-foreground">{cat.duas.length} {t("dua.duas")}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DuaPage;
