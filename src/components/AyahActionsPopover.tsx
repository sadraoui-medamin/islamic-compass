import { useState } from "react";
import { Play, Repeat1, BookmarkCheck, Bookmark, Copy, Share2, BookOpen, ListMusic, ArrowLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

type PlayRange = "ayah" | "from-to" | "page" | "surah";

interface AyahAction {
  icon: React.ReactNode;
  label: string;
  labelAr: string;
  onClick: () => void;
  active?: boolean;
}

interface AyahActionsPopoverProps {
  ayahText: string;
  ayahNumber: number;
  surahName?: string;
  totalAyahs?: number;
  isBookmarked?: boolean;
  children: React.ReactNode;
  onPlay?: () => void;
  onPlayRange?: (type: PlayRange, from?: number, to?: number) => void;
  onRepeat?: () => void;
  onBookmark?: () => void;
  onTafsir?: () => void;
}

const AyahActionsPopover = ({
  ayahText,
  ayahNumber,
  surahName,
  totalAyahs,
  isBookmarked: bookmarked = false,
  children,
  onPlay,
  onPlayRange,
  onRepeat,
  onBookmark,
  onTafsir,
}: AyahActionsPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [showPlayOptions, setShowPlayOptions] = useState(false);
  const [rangeFrom, setRangeFrom] = useState(ayahNumber);
  const [rangeTo, setRangeTo] = useState(Math.min(ayahNumber + 5, totalAyahs || ayahNumber + 5));
  const { toast } = useToast();

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(ayahText);
      toast({ title: "تم النسخ ✓", description: "Ayah copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
    setOpen(false);
  };

  const shareText = async () => {
    const text = `${ayahText}\n\n— ${surahName || ""} : ${ayahNumber}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied for sharing ✓" });
    }
    setOpen(false);
  };

  const handlePlayOption = (type: PlayRange) => {
    if (onPlayRange) {
      if (type === "from-to") {
        onPlayRange(type, rangeFrom, rangeTo);
      } else {
        onPlayRange(type, ayahNumber);
      }
    }
    setShowPlayOptions(false);
    setOpen(false);
  };

  const actions: AyahAction[] = [
    ...(onPlay || onPlayRange ? [{
      icon: <Play className="w-5 h-5" />,
      label: "Play",
      labelAr: "إستماع",
      onClick: () => {
        if (onPlayRange) {
          setShowPlayOptions(true);
        } else if (onPlay) {
          onPlay();
          setOpen(false);
        }
      },
    }] : []),
    ...(onRepeat ? [{
      icon: <Repeat1 className="w-5 h-5" />,
      label: "Repeat",
      labelAr: "إستماع إلى...",
      onClick: () => { onRepeat(); setOpen(false); },
    }] : []),
    ...(onTafsir ? [{
      icon: <BookOpen className="w-5 h-5" />,
      label: "Tafsir",
      labelAr: "تفسير نصي",
      onClick: () => { onTafsir(); setOpen(false); },
    }] : []),
    ...(onBookmark ? [{
      icon: bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />,
      label: bookmarked ? "Bookmarked" : "Bookmark",
      labelAr: "تفضيل",
      onClick: () => { onBookmark(); setOpen(false); },
      active: bookmarked,
    }] : []),
    {
      icon: <Copy className="w-5 h-5" />,
      label: "Copy",
      labelAr: "مشاركة النص",
      onClick: copyText,
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: "Share",
      labelAr: "والصوت",
      onClick: shareText,
    },
  ];

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setShowPlayOptions(false); }}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto p-3 rounded-2xl border border-border bg-popover shadow-xl"
        side="top"
        sideOffset={8}
      >
        {showPlayOptions ? (
          <div className="min-w-[240px] space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setShowPlayOptions(false)} className="p-1.5 rounded-lg hover:bg-muted transition">
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <ListMusic className="w-4 h-4 text-primary" />
                خيارات الاستماع
              </p>
            </div>

            {/* Single ayah */}
            <button
              onClick={() => handlePlayOption("ayah")}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition text-left"
            >
              <Play className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">هذه الآية فقط</p>
                <p className="text-[10px] text-muted-foreground">Play this ayah only</p>
              </div>
            </button>

            {/* From-to range */}
            <div className="p-3 rounded-xl bg-muted/50 space-y-2">
              <p className="text-xs font-medium text-foreground">من آية إلى آية</p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground">من</label>
                  <input
                    type="number"
                    min={1}
                    max={totalAyahs || 999}
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(Number(e.target.value))}
                    className="w-full h-8 text-center text-sm bg-background border border-border rounded-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-muted-foreground text-xs mt-3">→</span>
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground">إلى</label>
                  <input
                    type="number"
                    min={1}
                    max={totalAyahs || 999}
                    value={rangeTo}
                    onChange={(e) => setRangeTo(Number(e.target.value))}
                    className="w-full h-8 text-center text-sm bg-background border border-border rounded-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <button
                onClick={() => handlePlayOption("from-to")}
                className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition"
              >
                ▶ تشغيل
              </button>
            </div>

            {/* Whole page */}
            <button
              onClick={() => handlePlayOption("page")}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition text-left"
            >
              <Play className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">الصفحة كاملة</p>
                <p className="text-[10px] text-muted-foreground">Play entire page</p>
              </div>
            </button>

            {/* Whole surah */}
            <button
              onClick={() => handlePlayOption("surah")}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition text-left"
            >
              <Play className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">السورة كاملة</p>
                <p className="text-[10px] text-muted-foreground">Play entire surah</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors min-w-[72px] ${
                  action.active
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                {action.icon}
                <span className="text-[10px] leading-tight text-center text-muted-foreground">
                  {action.labelAr}
                </span>
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AyahActionsPopover;
