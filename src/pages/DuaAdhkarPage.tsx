import { useState } from "react";
import { HandHeart, Sun } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AdhkarTabContent from "@/components/dua-adhkar/AdhkarTabContent";
import DuaTabContent from "@/components/dua-adhkar/DuaTabContent";
import { useLanguage } from "@/lib/languageContext";

const DuaAdhkarPage = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"dua" | "adhkar">("dua");

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={tab === "dua" ? t("dua.title") : t("adhkar.title")}
        subtitle={tab === "dua" ? t("dua.subtitle") : t("adhkar.subtitle")}
        icon={tab === "dua" ? <HandHeart className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      >
        <div className="flex gap-1 rounded-xl bg-primary-foreground/10 p-1">
          <button
            onClick={() => setTab("dua")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${
              tab === "dua"
                ? "bg-primary-foreground/20 text-primary-foreground shadow-sm"
                : "text-primary-foreground/60 hover:text-primary-foreground"
            }`}
          >
            <HandHeart className="h-3.5 w-3.5" />
            {t("dua.title")}
          </button>

          <button
            onClick={() => setTab("adhkar")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${
              tab === "adhkar"
                ? "bg-primary-foreground/20 text-primary-foreground shadow-sm"
                : "text-primary-foreground/60 hover:text-primary-foreground"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            {t("adhkar.title")}
          </button>
        </div>
      </PageHeader>

      {tab === "dua" ? <DuaTabContent /> : <AdhkarTabContent />}
    </div>
  );
};

export default DuaAdhkarPage;