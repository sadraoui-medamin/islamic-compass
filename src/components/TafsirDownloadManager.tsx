import { useState, useEffect } from "react";
import { Download, Check, Loader2, BookOpen, X } from "lucide-react";
import { TAFSIR_EDITIONS, downloadTafsir, isTafsirDownloaded } from "@/lib/tafsirApi";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface TafsirDownloadManagerProps {
  onClose: () => void;
}

const TOTAL_SURAHS = 114;

const TafsirDownloadManager = ({ onClose }: TafsirDownloadManagerProps) => {
  const { toast } = useToast();
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [downloadedCounts, setDownloadedCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    refreshCounts();
  }, []);

  const refreshCounts = () => {
    const counts: Record<string, number> = {};
    TAFSIR_EDITIONS.forEach(ed => {
      let count = 0;
      for (let i = 1; i <= TOTAL_SURAHS; i++) {
        if (isTafsirDownloaded(ed.slug, i)) count++;
      }
      counts[ed.slug] = count;
    });
    setDownloadedCounts(counts);
  };

  const handleDownloadAll = async (slug: string) => {
    setDownloadingSlug(slug);
    setProgress(0);
    let done = 0;
    const errors: number[] = [];

    for (let i = 1; i <= TOTAL_SURAHS; i++) {
      if (isTafsirDownloaded(slug, i)) {
        done++;
        setProgress(Math.round((done / TOTAL_SURAHS) * 100));
        continue;
      }
      try {
        await downloadTafsir(slug, i);
      } catch {
        errors.push(i);
      }
      done++;
      setProgress(Math.round((done / TOTAL_SURAHS) * 100));
    }

    setDownloadingSlug(null);
    refreshCounts();

    if (errors.length === 0) {
      toast({ title: "تم تحميل التفسير كاملاً ✓" });
    } else {
      toast({ title: `تم التحميل مع ${errors.length} أخطاء`, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-bold text-foreground text-sm">تحميل التفاسير</h2>
              <p className="text-xs text-muted-foreground">حمّل جميع السور دفعة واحدة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {TAFSIR_EDITIONS.map(ed => {
            const count = downloadedCounts[ed.slug] || 0;
            const isComplete = count >= TOTAL_SURAHS;
            const isDownloading = downloadingSlug === ed.slug;

            return (
              <div key={ed.slug} className="p-4 rounded-xl bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0" dir="rtl">
                    <p className="font-arabic font-bold text-foreground">{ed.nameAr}</p>
                    <p className="text-xs text-muted-foreground">{ed.name} · {count}/{TOTAL_SURAHS}</p>
                  </div>
                  {isDownloading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                  ) : isComplete ? (
                    <Check className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <button
                      onClick={() => handleDownloadAll(ed.slug)}
                      disabled={downloadingSlug !== null}
                      className="p-2 rounded-lg hover:bg-muted transition disabled:opacity-50"
                    >
                      <Download className="w-5 h-5 text-muted-foreground hover:text-primary transition" />
                    </button>
                  )}
                </div>
                {isDownloading && (
                  <div className="mt-3">
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1 text-center">{progress}%</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TafsirDownloadManager;
