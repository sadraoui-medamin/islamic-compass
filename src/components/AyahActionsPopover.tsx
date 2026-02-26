import { useState } from "react";
import { Play, Repeat1, BookmarkCheck, Bookmark, Copy, Share2, BookOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

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
  isBookmarked?: boolean;
  children: React.ReactNode;
  onPlay?: () => void;
  onRepeat?: () => void;
  onBookmark?: () => void;
  onTafsir?: () => void;
}

const AyahActionsPopover = ({
  ayahText,
  ayahNumber,
  surahName,
  isBookmarked: bookmarked = false,
  children,
  onPlay,
  onRepeat,
  onBookmark,
  onTafsir,
}: AyahActionsPopoverProps) => {
  const [open, setOpen] = useState(false);
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

  const actions: AyahAction[] = [
    ...(onPlay ? [{
      icon: <Play className="w-5 h-5" />,
      label: "Play Ayah",
      labelAr: "إستماع الآية",
      onClick: () => { onPlay(); setOpen(false); },
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

  // Display as 3-column grid like the reference image
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto p-3 rounded-2xl border border-border bg-popover shadow-xl"
        side="top"
        sideOffset={8}
      >
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
      </PopoverContent>
    </Popover>
  );
};

export default AyahActionsPopover;
