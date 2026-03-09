import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sun, HandHeart, CircleDot, Compass, Clock, Trophy, Brain, Flame, ChevronRight, Download } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { Progress } from "@/components/ui/progress";

// Track activity in localStorage
function getLoginStreak(): number {
  const raw = localStorage.getItem("login-dates");
  const dates: string[] = raw ? JSON.parse(raw) : [];
  const today = new Date().toISOString().slice(0, 10);
  if (!dates.includes(today)) {
    dates.push(today);
    localStorage.setItem("login-dates", JSON.stringify(dates.slice(-60)));
  }
  // Calculate streak
  let streak = 0;
  const sorted = [...dates].sort().reverse();
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (sorted[i] === expected.toISOString().slice(0, 10)) {
      streak++;
    } else break;
  }
  return streak;
}

function getStats() {
  const tasbihTotal = parseInt(localStorage.getItem("tasbih-total") || "0", 10);
  const adhkarDone = parseInt(localStorage.getItem("adhkar-done") || "0", 10);
  const quranPages = parseInt(localStorage.getItem("quran-pages-read") || "0", 10);
  return { tasbihTotal, adhkarDone, quranPages };
}

function getLastActivity(): string | null {
  return localStorage.getItem("last-activity");
}

function setLastActivity(activity: string) {
  localStorage.setItem("last-activity", activity);
}

const QUIZ_QUESTIONS = [
  { q: "كم عدد سور القرآن الكريم؟", options: ["112", "114", "116", "120"], correct: 1 },
  { q: "ما أطول سورة في القرآن؟", options: ["آل عمران", "النساء", "البقرة", "المائدة"], correct: 2 },
  { q: "ما أقصر سورة في القرآن؟", options: ["الإخلاص", "الكوثر", "النصر", "الفلق"], correct: 1 },
  { q: "كم عدد أجزاء القرآن؟", options: ["28", "30", "32", "25"], correct: 1 },
  { q: "في أي سورة وردت آية الكرسي؟", options: ["آل عمران", "البقرة", "النساء", "المائدة"], correct: 1 },
  { q: "كم مرة ذُكر اسم النبي محمد ﷺ في القرآن؟", options: ["3", "4", "5", "6"], correct: 1 },
];

const HomePage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ tasbihTotal: 0, adhkarDone: 0, quranPages: 0 });
  const [lastActivity, setLastAct] = useState<string | null>(null);

  // Quiz
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    setStreak(getLoginStreak());
    setStats(getStats());
    setLastAct(getLastActivity());
  }, []);

  const quickActions = [
    { icon: BookOpen, label: lang === "ar" ? "القرآن" : "Quran", color: "islamic-gradient", path: "/" },
    { icon: Sun, label: lang === "ar" ? "أذكار الصباح" : "Morning", color: "gold-gradient", path: "/adhkar" },
    { icon: HandHeart, label: lang === "ar" ? "الدعاء" : "Dua", color: "islamic-gradient", path: "/dua" },
    { icon: Clock, label: lang === "ar" ? "الصلاة" : "Prayer", color: "gold-gradient", path: "/prayer" },
  ];

  const challenges = [
    { label: lang === "ar" ? "اقرأ صفحة يومياً" : "Read 1 page daily", progress: Math.min(stats.quranPages, 30), goal: 30, icon: BookOpen },
    { label: lang === "ar" ? "أكمل أذكار الصباح" : "Complete morning adhkar", progress: Math.min(stats.adhkarDone, 7), goal: 7, icon: Sun },
    { label: lang === "ar" ? "سبّح 1000 مرة" : "Tasbih 1000 times", progress: Math.min(stats.tasbihTotal, 1000), goal: 1000, icon: CircleDot },
  ];

  const handleQuizAnswer = (idx: number) => {
    setQuizAnswer(idx);
    if (idx === QUIZ_QUESTIONS[quizIdx].correct) {
      setQuizScore(s => s + 1);
    }
    setTimeout(() => {
      if (quizIdx + 1 < QUIZ_QUESTIONS.length) {
        setQuizIdx(i => i + 1);
        setQuizAnswer(null);
      } else {
        setQuizDone(true);
      }
    }, 800);
  };

  const resetQuiz = () => {
    setQuizActive(false);
    setQuizIdx(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setQuizDone(false);
  };

  return (
    <div className="animate-fade-in pb-4">
      {/* Hero */}
      <div className="islamic-gradient text-primary-foreground p-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">{lang === "ar" ? "السلام عليكم" : "Assalamu Alaikum"} 👋</h1>
            <p className="text-sm opacity-80 mt-0.5">{lang === "ar" ? "بارك الله في يومك" : "May Allah bless your day"}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-foreground/15 rounded-xl px-3 py-1.5">
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-bold">{streak}</span>
            <span className="text-xs opacity-70">{lang === "ar" ? "يوم" : "days"}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.path + action.label}
              onClick={() => {
                setLastActivity(action.label);
                navigate(action.path === "/" ? "/quran" : action.path);
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition"
            >
              <action.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* Last Activity */}
        {lastActivity && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs text-muted-foreground">
              {lang === "ar" ? "آخر نشاط:" : "Last activity:"}{" "}
              <span className="text-foreground font-medium">{lastActivity}</span>
            </p>
          </div>
        )}

        {/* Stats */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-2">{lang === "ar" ? "إحصائياتك" : "Your Stats"}</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: lang === "ar" ? "صفحات" : "Pages", value: stats.quranPages, icon: BookOpen },
              { label: lang === "ar" ? "أذكار" : "Adhkar", value: stats.adhkarDone, icon: Sun },
              { label: lang === "ar" ? "تسبيح" : "Tasbih", value: stats.tasbihTotal, icon: CircleDot },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card">
                <s.icon className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-foreground">{s.value}</span>
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-foreground">{lang === "ar" ? "التحديات" : "Challenges"}</h2>
          </div>
          <div className="space-y-2">
            {challenges.map((ch, i) => (
              <div key={i} className="p-3 rounded-xl bg-card">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <ch.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">{ch.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{ch.progress}/{ch.goal}</span>
                </div>
                <Progress value={(ch.progress / ch.goal) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Quiz */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">{lang === "ar" ? "اختبر معلوماتك" : "Test Your Knowledge"}</h2>
          </div>
          {!quizActive ? (
            <button
              onClick={() => setQuizActive(true)}
              className="w-full p-4 rounded-xl bg-card hover:bg-muted transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{lang === "ar" ? "مسابقة قرآنية" : "Quran Quiz"}</p>
                  <p className="text-xs text-muted-foreground">{QUIZ_QUESTIONS.length} {lang === "ar" ? "أسئلة" : "questions"}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ) : quizDone ? (
            <div className="p-5 rounded-xl bg-card text-center space-y-3">
              <div className="w-14 h-14 rounded-full islamic-gradient mx-auto flex items-center justify-center">
                <Trophy className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">{quizScore}/{QUIZ_QUESTIONS.length}</p>
              <p className="text-xs text-muted-foreground">
                {quizScore === QUIZ_QUESTIONS.length
                  ? (lang === "ar" ? "ممتاز! أحسنت 🎉" : "Perfect! Great job 🎉")
                  : (lang === "ar" ? "أحسنت، حاول مرة أخرى" : "Good try, try again!")}
              </p>
              <button onClick={resetQuiz} className="text-xs text-primary font-medium">
                {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{quizIdx + 1}/{QUIZ_QUESTIONS.length}</span>
                <span className="text-[10px] text-primary font-medium">{lang === "ar" ? "النتيجة:" : "Score:"} {quizScore}</span>
              </div>
              <p className="font-arabic text-base text-foreground text-right" dir="rtl">{QUIZ_QUESTIONS[quizIdx].q}</p>
              <div className="grid grid-cols-2 gap-2">
                {QUIZ_QUESTIONS[quizIdx].options.map((opt, i) => {
                  let cls = "bg-muted hover:bg-muted/80 border border-transparent";
                  if (quizAnswer !== null) {
                    if (i === QUIZ_QUESTIONS[quizIdx].correct) cls = "bg-primary/20 border-primary/40";
                    else if (i === quizAnswer) cls = "bg-destructive/20 border-destructive/40";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => quizAnswer === null && handleQuizAnswer(i)}
                      disabled={quizAnswer !== null}
                      className={`p-2.5 rounded-xl text-sm font-medium text-foreground border border-transparent transition ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tafsir download shortcut */}
        <button
          onClick={() => navigate("/quran")}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-card hover:bg-muted transition"
        >
          <div className="w-10 h-10 rounded-xl islamic-gradient flex items-center justify-center">
            <Download className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">{lang === "ar" ? "تحميل التفاسير" : "Download Tafsir"}</p>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "للقراءة بدون إنترنت" : "For offline reading"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
