import { useState, useEffect, useRef } from "react";
import { X, Download, Loader2, Check, BookOpen, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { TAFSIR_EDITIONS, downloadTafsir, isTafsirDownloaded, getTafsirForAyah } from "@/lib/tafsirApi";
import { useToast } from "@/hooks/use-toast";
import TafsirDownloadManager from "./TafsirDownloadManager";

interface TafsirModalProps {
  surahNumber: number;
  ayahNumber: number;
  ayahText?: string;
  totalAyahs?: number;
  surahName?: string;
  onClose: () => void;
  onAyahChange?: (ayahNumber: number) => void;
}

const TafsirModal = ({ surahNumber, ayahNumber: initialAyah, ayahText, totalAyahs, surahName, onClose, onAyahChange }: TafsirModalProps) => {
  const [currentAyah, setCurrentAyah] = useState(initialAyah);
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [tafsirText, setTafsirText] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedMap, setDownloadedMap] = useState<Record<string, boolean>>({});
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const { toast } = useToast();

  // Swipe support
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const refreshDownloadMap = () => {
    const map: Record<string, boolean> = {};
    TAFSIR_EDITIONS.forEach(ed => {
      map[ed.slug] = isTafsirDownloaded(ed.slug, surahNumber);
    });
    setDownloadedMap(map);
  };

  useEffect(() => {
    refreshDownloadMap();
  }, [surahNumber]);

  // Auto-select last used tafsir
  useEffect(() => {
    const lastUsed = localStorage.getItem("last-tafsir-edition");
    if (lastUsed && isTafsirDownloaded(lastUsed, surahNumber)) {
      const text = getTafsirForAyah(lastUsed, surahNumber, currentAyah);
      if (text) {
        setSelectedEdition(lastUsed);
        setTafsirText(text);
      }
    }
  }, [surahNumber]);

  // Update tafsir text when ayah changes
  useEffect(() => {
    if (selectedEdition) {
      const text = getTafsirForAyah(selectedEdition, surahNumber, currentAyah);
      setTafsirText(text);
    }
  }, [currentAyah, selectedEdition, surahNumber]);

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
    const text = getTafsirForAyah(slug, surahNumber, currentAyah);
    if (text) {
      setSelectedEdition(slug);
      setTafsirText(text);
      localStorage.setItem("last-tafsir-edition", slug);
      const prev = parseInt(localStorage.getItem("tafsir-read") || "0", 10);
      localStorage.setItem("tafsir-read", String(prev + 1));
    }
  };

  const handleDeleteTafsir = (slug: string) => {
    try {
      const cache = JSON.parse(localStorage.getItem("tafsir-cache") || "{}");
      // Remove all keys for this slug
      Object.keys(cache).forEach(key => {
        if (key.startsWith(slug)) {
          delete cache[key];
        }
      });
      localStorage.setItem("tafsir-cache", JSON.stringify(cache));
      setDownloadedMap(prev => ({ ...prev, [slug]: false }));
      if (selectedEdition === slug) {
        setSelectedEdition(null);
        setTafsirText(null);
      }
      toast({ title: "تم حذف التفسير" });
    } catch {
      toast({ title: "فشل الحذف", variant: "destructive" });
    }
  };

  const goToAyah = (direction: number) => {
    const newAyah = currentAyah + direction;
    if (newAyah < 1) return;
    if (totalAyahs && newAyah > totalAyahs) return;
    setCurrentAyah(newAyah);
    onAyahChange?.(newAyah);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) goToAyah(-1); // swipe right = previous
      else goToAyah(1); // swipe left = next
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div
        className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col animate-slide-up shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">تفسير الآية {currentAyah}</h2>
              <p className="text-xs text-muted-foreground">{surahName || `سورة ${surahNumber}`}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Ayah Navigation Bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
          <button
            onClick={() => goToAyah(-1)}
            disabled={currentAyah <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            السابقة
          </button>
          <div className="flex-1 text-center">
            <span className="text-xs font-bold text-primary">آية {currentAyah}</span>
            {totalAyahs && <span className="text-xs text-muted-foreground"> / {totalAyahs}</span>}
          </div>
          <button
            onClick={() => goToAyah(1)}
            disabled={totalAyahs ? currentAyah >= totalAyahs : false}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            التالية
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto"
          ref={contentRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ayah Text Display */}
          {ayahText && (
            <div className="px-4 pt-4">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10" dir="rtl">
                <p className="font-arabic text-right text-foreground leading-loose text-lg">
                  {ayahText}
                </p>
                <p className="text-[10px] text-muted-foreground mt-2 text-left" dir="ltr">
                  {surahName} — آية {currentAyah}
                </p>
              </div>
            </div>
          )}

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
                  <div
                    key={ed.slug}
                    className="flex items-center gap-2 animate-slide-up"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <button
                      onClick={() => handleSelectEdition(ed.slug)}
                      disabled={isDownloading}
                      className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted transition group"
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
                    {isDownloaded && (
                      <button
                        onClick={() => handleDeleteTafsir(ed.slug)}
                        className="p-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition text-destructive"
                        title="حذف التفسير"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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
                {tafsirText ? (
                  <div
                    className="font-arabic text-right text-foreground rounded-2xl bg-card p-5 shadow-sm"
                    dir="rtl"
                    style={{ lineHeight: "2.6", fontSize: "17px", textAlign: "justify" }}
                  >
                    {tafsirText.split('\n').map((paragraph, i) => (
                      <p key={i} className={i > 0 ? "mt-4 pt-4 border-t border-border/50" : ""}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    <p>لا يوجد تفسير لهذه الآية</p>
                  </div>
                )}

                {/* Bottom navigation */}
                <div className="flex items-center justify-between mt-4 gap-3">
                  <button
                    onClick={() => goToAyah(-1)}
                    disabled={currentAyah <= 1}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-card hover:bg-muted transition text-sm font-medium text-foreground disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                    السابقة
                  </button>
                  <button
                    onClick={() => goToAyah(1)}
                    disabled={totalAyahs ? currentAyah >= totalAyahs : false}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm font-medium disabled:opacity-30"
                  >
                    التالية
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showBulkDownload && (
        <TafsirDownloadManager onClose={() => { setShowBulkDownload(false); refreshDownloadMap(); }} />
      )}
    </div>
  );
};

export default TafsirModal;
