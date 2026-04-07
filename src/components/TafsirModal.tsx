import { useState, useEffect } from "react";
import { X, Download, Loader2, Check, BookOpen, ChevronRight, ArrowRight } from "lucide-react";
import { TAFSIR_EDITIONS, downloadTafsir, isTafsirDownloaded, getTafsirForAyah } from "@/lib/tafsirApi";
import { useToast } from "@/hooks/use-toast";
import TafsirDownloadManager from "./TafsirDownloadManager";

interface TafsirModalProps {
  surahNumber: number;
  ayahNumber: number;
  surahName?: string;
  onClose: () => void;
}

const TafsirModal = ({ surahNumber, ayahNumber, surahName, onClose }: TafsirModalProps) => {
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [tafsirText, setTafsirText] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedMap, setDownloadedMap] = useState<Record<string, boolean>>({});
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const map: Record<string, boolean> = {};
    TAFSIR_EDITIONS.forEach(ed => {
      map[ed.slug] = isTafsirDownloaded(ed.slug, surahNumber);
    });
    setDownloadedMap(map);
  }, [surahNumber]);

  // Auto-select last used tafsir
  useEffect(() => {
    const lastUsed = localStorage.getItem("last-tafsir-edition");
    if (lastUsed && isTafsirDownloaded(lastUsed, surahNumber)) {
      const text = getTafsirForAyah(lastUsed, surahNumber, ayahNumber);
      if (text) {
        setSelectedEdition(lastUsed);
        setTafsirText(text);
      }
    }
  }, [surahNumber, ayahNumber]);

  const handleDownload = async (slug: string) => {
    setDownloading(slug);
    try {
      await downloadTafsir(slug, surahNumber);
      setDownloadedMap(prev => ({ ...prev, [slug]: true }));
      toast({ title: "تم التحميل ✓" });
    } catch {
      toast({ title: "فشل التحميل", variant: "destructive" });
    } finally {
      setDownloading(null);
    }
  };

  const handleSelectEdition = async (slug: string) => {
    if (!downloadedMap[slug]) {
      await handleDownload(slug);
    }
    const text = getTafsirForAyah(slug, surahNumber, ayahNumber);
    if (text) {
      setSelectedEdition(slug);
      setTafsirText(text);
      localStorage.setItem("last-tafsir-edition", slug);
      const prev = parseInt(localStorage.getItem("tafsir-read") || "0", 10);
      localStorage.setItem("tafsir-read", String(prev + 1));
      localStorage.setItem("last-activity", `Tafsir ${TAFSIR_EDITIONS.find(e => e.slug === slug)?.name || slug}`);
    }
  };

  const navigateAyah = (direction: number) => {
    if (!selectedEdition) return;
    const newAyah = ayahNumber + direction;
    if (newAyah < 1) return;
    const text = getTafsirForAyah(selectedEdition, surahNumber, newAyah);
    if (text) {
      setTafsirText(text);
      // We can't change ayahNumber prop, so just update text
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div
        className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] flex flex-col animate-slide-up shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">تفسير الآية {ayahNumber}</h2>
              <p className="text-xs text-muted-foreground">{surahName || `سورة ${surahNumber}`}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedEdition ? (
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">اختر التفسير — يتم تحميله مرة واحدة فقط</p>
                <button
                  onClick={() => setShowBulkDownload(true)}
                  className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  تحميل الكل
                </button>
              </div>
              {TAFSIR_EDITIONS.map((ed, index) => {
                const isDownloaded = downloadedMap[ed.slug];
                const isDownloading = downloading === ed.slug;
                return (
                  <button
                    key={ed.slug}
                    onClick={() => handleSelectEdition(ed.slug)}
                    disabled={isDownloading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted transition group animate-slide-up"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center shadow-sm">
                      <BookOpen className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 text-right" dir="rtl">
                      <p className="font-arabic font-bold text-foreground">{ed.nameAr}</p>
                      <p className="text-xs text-muted-foreground">{ed.name}</p>
                    </div>
                    {isDownloading ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : isDownloaded ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Edition selector bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <button
                  onClick={() => { setSelectedEdition(null); setTafsirText(null); }}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition font-medium"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  تفاسير أخرى
                </button>

                {/* Edition tabs */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  {TAFSIR_EDITIONS.filter(e => downloadedMap[e.slug]).map(ed => (
                    <button
                      key={ed.slug}
                      onClick={() => handleSelectEdition(ed.slug)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-arabic font-bold whitespace-nowrap transition ${
                        selectedEdition === ed.slug
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {ed.nameAr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tafsir content */}
              <div className="p-4">
                <div
                  className="font-arabic text-right text-foreground rounded-2xl bg-card p-5 shadow-sm"
                  dir="rtl"
                  style={{ lineHeight: "2.6", fontSize: "17px", textAlign: "justify" }}
                >
                  {tafsirText?.split('\n').map((paragraph, i) => (
                    <p key={i} className={i > 0 ? "mt-4 pt-4 border-t border-border/50" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showBulkDownload && (
        <TafsirDownloadManager onClose={() => { setShowBulkDownload(false); const map: Record<string, boolean> = {}; TAFSIR_EDITIONS.forEach(ed => { map[ed.slug] = isTafsirDownloaded(ed.slug, surahNumber); }); setDownloadedMap(map); }} />
      )}
    </div>
  );
};

export default TafsirModal;
