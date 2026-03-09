import { useState, useEffect } from "react";
import { X, Download, Loader2, Check, BookOpen } from "lucide-react";
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
  const { toast } = useToast();

  useEffect(() => {
    const map: Record<string, boolean> = {};
    TAFSIR_EDITIONS.forEach(ed => {
      map[ed.slug] = isTafsirDownloaded(ed.slug, surahNumber);
    });
    setDownloadedMap(map);
  }, [surahNumber]);

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
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div
        className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-bold text-foreground text-sm">تفسير الآية {ayahNumber}</h2>
              <p className="text-xs text-muted-foreground">{surahName || `سورة ${surahNumber}`}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!selectedEdition ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">اختر التفسير — يتم تحميله مرة واحدة فقط</p>
              {TAFSIR_EDITIONS.map(ed => {
                const isDownloaded = downloadedMap[ed.slug];
                const isDownloading = downloading === ed.slug;
                return (
                  <button
                    key={ed.slug}
                    onClick={() => handleSelectEdition(ed.slug)}
                    disabled={isDownloading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted transition group"
                  >
                    <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center">
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
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <button
                  onClick={() => { setSelectedEdition(null); setTafsirText(null); }}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  تفاسير أخرى
                </button>
                <span className="text-xs font-bold text-foreground font-arabic">
                  {TAFSIR_EDITIONS.find(e => e.slug === selectedEdition)?.nameAr}
                </span>
              </div>
              <div
                className="font-arabic text-right text-foreground text-base rounded-xl bg-muted/40 p-4"
                dir="rtl"
                style={{ lineHeight: "2.4", fontSize: "17px", textAlign: "justify" }}
              >
                {tafsirText?.split('\n').map((paragraph, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TafsirModal;
