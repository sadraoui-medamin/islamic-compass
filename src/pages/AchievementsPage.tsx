import { Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Achievements from "@/components/Achievements";
import { useLanguage } from "@/lib/languageContext";

const AchievementsPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={lang === "ar" ? "إنجازاتي" : "My Achievements"}
        subtitle={lang === "ar" ? "الإنجازات" : "Achievements"}
        icon={<Trophy className="w-6 h-6" />}
      />
      <div className="px-4 py-4">
        <Achievements />
      </div>
    </div>
  );
};

export default AchievementsPage;
