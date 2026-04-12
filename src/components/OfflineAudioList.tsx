import { useState, useEffect } from "react";
import { ArrowRight, Download, Trash2, Play, Pause, Loader2, Wifi, WifiOff } from "lucide-react";
import { getAllOfflineSurahs, deleteOfflineSurah, downloadSurahForOffline, type OfflineSurah } from "@/lib/offlineAudio";
import { fetchAllSurahs, RECITERS, type Surah } from "@/lib/quranApi";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface OfflineAudioListProps {
  onBack: () => void;
}

const OfflineAudioList = ({ onBack }: OfflineAudioListProps) => {
  const [offlineSurahs, setOfflineSurahs] = useState<OfflineSurah[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [showDownloadPicker, setShowDownloadPicker] = useState(false);
  const { toast } = useToast();

  const { data: surahs = [] } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchAllSurahs,
  });

  const loadOffline = async () => {
    const all = await getAllOfflineSurahs();
    setOfflineSurahs(all);
  };

  useEffect(() => { loadOffline(); }, []);

  const handleDownload = async (surah: Surah) => {
    setDownloading(surah.number);
    setProgress({ current: 0, total: 0 });
    try {
      await downloadSurahForOffline(
        surah.number, surah.englishName, surah.name, selectedReciter,
        (current, total) => setProgress({ current, total })
      );
      toast({ title: `✅ ${surah.englishName} downloaded` });
      await loadOffline();
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (surahNumber: number, reciterId: string) => {
    await deleteOfflineSurah(surahNumber, reciterId);
    toast({ title: "Removed from offline" });
    await loadOffline();
  };

  const playOffline = async (surah: OfflineSurah) => {
    const key = `${surah.surahNumber}-${surah.reciterId}`;
    if (playingKey === key) {
      audioRef?.pause();
      setPlayingKey(null);
      return;
    }

    if (audioRef) audioRef.pause();

    let idx = 0;
    const playNext = () => {
      if (idx >= surah.audioBlobs.length) { setPlayingKey(null); return; }
      const url = URL.createObjectURL(surah.audioBlobs[idx].blob);
      const audio = new Audio(url);
      setAudioRef(audio);
      setPlayingKey(key);
      audio.play();
      audio.onended = () => { URL.revokeObjectURL(url); idx++; playNext(); };
    };
    playNext();
  };

  return (
    <div className="animate-fade-in">
      <div className="islamic-gradient text-primary-foreground p-4 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <WifiOff className="w-5 h-5" /> الاستماع بدون إنترنت
            </h1>
            <p className="text-xs opacity-70">Offline Audio Library</p>
          </div>
          <button
            onClick={() => setShowDownloadPicker(!showDownloadPicker)}
            className="px-3 py-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            تحميل سورة
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Download picker */}
        {showDownloadPicker && (
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3 animate-slide-up">
            <p className="text-sm font-semibold text-foreground">تحميل سورة جديدة</p>
            <Select value={selectedReciter} onValueChange={setSelectedReciter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="اختر القارئ" />
              </SelectTrigger>
              <SelectContent>
                {RECITERS.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name} - {r.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {surahs.map(surah => {
                const alreadyDownloaded = offlineSurahs.some(
                  o => o.surahNumber === surah.number && o.reciterId === selectedReciter
                );
                const isDownloading = downloading === surah.number;
                return (
                  <div
                    key={surah.number}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition"
                  >
                    <div className="w-7 h-7 rounded-lg islamic-gradient flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                      {surah.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{surah.englishName}</p>
                      <p className="text-[10px] text-muted-foreground">{surah.numberOfAyahs} آية</p>
                    </div>
                    {isDownloading ? (
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        <Progress value={(progress.current / Math.max(progress.total, 1)) * 100} className="h-1.5 flex-1" />
                        <span className="text-[10px] text-muted-foreground">{progress.current}/{progress.total}</span>
                      </div>
                    ) : alreadyDownloaded ? (
                      <span className="text-[10px] text-green-500 font-medium">✓ محمّل</span>
                    ) : (
                      <button
                        onClick={() => handleDownload(surah)}
                        disabled={downloading !== null}
                        className="p-1.5 rounded-lg hover:bg-primary/10 transition disabled:opacity-30"
                      >
                        <Download className="w-4 h-4 text-primary" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Downloaded surahs */}
        {offlineSurahs.length === 0 && !showDownloadPicker && (
          <div className="text-center py-16 text-muted-foreground">
            <WifiOff className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">لا توجد سور محمّلة</p>
            <p className="text-xs mt-1">No downloaded surahs yet</p>
            <button
              onClick={() => setShowDownloadPicker(true)}
              className="mt-4 px-4 py-2 rounded-xl islamic-gradient text-primary-foreground text-sm font-medium"
            >
              <Download className="w-4 h-4 inline mr-1.5" /> تحميل سورة
            </button>
          </div>
        )}

        {offlineSurahs.map(surah => {
          const key = `${surah.surahNumber}-${surah.reciterId}`;
          const isCurrentlyPlaying = playingKey === key;
          return (
            <div key={key} className="flex items-center gap-3 p-4 rounded-2xl bg-card animate-slide-up">
              <button
                onClick={() => playOffline(surah)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                  isCurrentlyPlaying ? "islamic-gradient text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {isCurrentlyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{surah.surahName}</p>
                <p className="text-xs text-muted-foreground">
                  {surah.reciterName} · {surah.totalAyahs} آية
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(surah.downloadedAt).toLocaleDateString()}
                </p>
              </div>
              <p className="font-arabic text-lg text-primary">{surah.surahNameAr}</p>
              <button
                onClick={() => handleDelete(surah.surahNumber, surah.reciterId)}
                className="p-2 rounded-lg hover:bg-destructive/10 transition"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfflineAudioList;
