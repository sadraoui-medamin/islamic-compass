import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Sun, HandHeart, Clock, Trophy, Brain, Flame,
  ChevronRight, Download, CircleDot, BookOpenCheck, Compass
} from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { Progress } from "@/components/ui/progress";

// --- Helpers ---
function getLoginStreak(): number {
  const raw = localStorage.getItem("login-dates");
  const dates: string[] = raw ? JSON.parse(raw) : [];
  const today = new Date().toISOString().slice(0, 10);
  if (!dates.includes(today)) {
    dates.push(today);
    localStorage.setItem("login-dates", JSON.stringify(dates.slice(-60)));
  }
  let streak = 0;
  const sorted = [...dates].sort().reverse();
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (sorted[i] === expected.toISOString().slice(0, 10)) streak++;
    else break;
  }
  return streak;
}

function getStats() {
  return {
    tasbihTotal: parseInt(localStorage.getItem("tasbih-total") || "0", 10),
    adhkarDone: parseInt(localStorage.getItem("adhkar-done") || "0", 10),
    quranPages: parseInt(localStorage.getItem("quran-pages-read") || "0", 10),
    tafsirRead: parseInt(localStorage.getItem("tafsir-read") || "0", 10),
  };
}

// --- Quiz Data ---
type QuizCategory = { id: string; nameAr: string; nameEn: string; icon: typeof Brain; questions: QuizQ[] };
type QuizQ = { q: string; options: string[]; correct: number };

const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: "quran", nameAr: "القرآن الكريم", nameEn: "Quran", icon: BookOpen,
    questions: [
      { q: "كم عدد سور القرآن الكريم؟", options: ["112", "114", "116", "120"], correct: 1 },
      { q: "ما أطول سورة في القرآن؟", options: ["آل عمران", "النساء", "البقرة", "المائدة"], correct: 2 },
      { q: "ما أقصر سورة في القرآن؟", options: ["الإخلاص", "الكوثر", "النصر", "الفلق"], correct: 1 },
      { q: "كم عدد أجزاء القرآن؟", options: ["28", "30", "32", "25"], correct: 1 },
      { q: "في أي سورة وردت آية الكرسي؟", options: ["آل عمران", "البقرة", "النساء", "المائدة"], correct: 1 },
      { q: "كم مرة ذُكر اسم النبي محمد ﷺ في القرآن؟", options: ["3", "4", "5", "6"], correct: 1 },
    ],
  },
  {
    id: "sunnah", nameAr: "السنة النبوية", nameEn: "Sunnah", icon: Sun,
    questions: [
      { q: "ما هو أصح كتب الحديث؟", options: ["صحيح مسلم", "صحيح البخاري", "سنن أبي داود", "سنن الترمذي"], correct: 1 },
      { q: "كم عدد الصلوات المفروضة في اليوم؟", options: ["3", "4", "5", "6"], correct: 2 },
      { q: "ما هي أول صلاة فرضت على المسلمين؟", options: ["الفجر", "الظهر", "العصر", "المغرب"], correct: 1 },
      { q: "ما دعاء دخول المسجد؟", options: ["اللهم افتح لي أبواب رحمتك", "بسم الله", "الحمد لله", "سبحان الله"], correct: 0 },
      { q: "كم ركعة صلاة التراويح؟", options: ["8", "11", "20", "8 أو 20"], correct: 3 },
    ],
  },
  {
    id: "prophets", nameAr: "الأنبياء والرسل", nameEn: "Prophets", icon: Trophy,
    questions: [
      { q: "كم عدد الأنبياء المذكورين في القرآن؟", options: ["20", "25", "28", "30"], correct: 1 },
      { q: "من هو خليل الله؟", options: ["موسى", "عيسى", "إبراهيم", "نوح"], correct: 2 },
      { q: "من هو النبي الذي ابتلعه الحوت؟", options: ["يونس", "إلياس", "إدريس", "أيوب"], correct: 0 },
      { q: "من هو كليم الله؟", options: ["إبراهيم", "محمد ﷺ", "موسى", "عيسى"], correct: 2 },
      { q: "من هو أبو الأنبياء؟", options: ["آدم", "نوح", "إبراهيم", "إسماعيل"], correct: 2 },
      { q: "من هو النبي الملقب بالصديق؟", options: ["يوسف", "إبراهيم", "إسحاق", "يعقوب"], correct: 0 },
    ],
  },
  {
    id: "history", nameAr: "التاريخ الإسلامي", nameEn: "Islamic History", icon: Brain,
    questions: [
      { q: "في أي عام كانت هجرة النبي ﷺ إلى المدينة؟", options: ["610م", "622م", "630م", "632م"], correct: 1 },
      { q: "ما هي أول غزوة في الإسلام؟", options: ["أحد", "بدر", "الخندق", "تبوك"], correct: 1 },
      { q: "من هو أول خليفة بعد النبي ﷺ؟", options: ["عمر", "عثمان", "أبو بكر", "علي"], correct: 2 },
      { q: "في أي سنة فُتحت مكة؟", options: ["6 هـ", "8 هـ", "10 هـ", "12 هـ"], correct: 1 },
      { q: "من هو فاتح القسطنطينية؟", options: ["صلاح الدين", "محمد الفاتح", "طارق بن زياد", "خالد بن الوليد"], correct: 1 },
    ],
  },
];

const HomePage = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ tasbihTotal: 0, adhkarDone: 0, quranPages: 0, tafsirRead: 0 });
  const [lastActivity, setLastAct] = useState<string | null>(null);

  // Quiz state
  const [quizCat, setQuizCat] = useState<QuizCategory | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    setStreak(getLoginStreak());
    setStats(getStats());
    setLastAct(localStorage.getItem("last-activity"));
  }, []);

  const quickActions = [
    { icon: BookOpen, label: lang === "ar" ? "القرآن" : "Quran", path: "/quran" },
    { icon: Sun, label: lang === "ar" ? "الأذكار والدعاء" : "Dua & Adhkar", path: "/dua" },
    { icon: Clock, label: lang === "ar" ? "الصلاة" : "Prayer", path: "/prayer" },
    { icon: Compass, label: lang === "ar" ? "القبلة" : "Qibla", path: "/qibla" },
  ];

  const challenges = [
    { label: lang === "ar" ? "اقرأ صفحة يومياً" : "Read 1 page daily", progress: Math.min(stats.quranPages, 30), goal: 30, icon: BookOpen },
    { label: lang === "ar" ? "أكمل أذكار الصباح" : "Complete morning adhkar", progress: Math.min(stats.adhkarDone, 7), goal: 7, icon: Sun },
    { label: lang === "ar" ? "سبّح 1000 مرة" : "Tasbih 1000 times", progress: Math.min(stats.tasbihTotal, 1000), goal: 1000, icon: CircleDot },
    { label: lang === "ar" ? "اقرأ 10 تفاسير" : "Read 10 tafsirs", progress: Math.min(stats.tafsirRead, 10), goal: 10, icon: BookOpenCheck },
  ];

  const handleQuizAnswer = (idx: number) => {
    if (!quizCat) return;
    setQuizAnswer(idx);
    if (idx === quizCat.questions[quizIdx].correct) setQuizScore(s => s + 1);
    setTimeout(() => {
      if (quizIdx + 1 < quizCat.questions.length) {
        setQuizIdx(i => i + 1);
        setQuizAnswer(null);
      } else {
        setQuizDone(true);
        const done = JSON.parse(localStorage.getItem("quiz-completed") || "[]");
        if (!done.includes(quizCat.id)) {
          done.push(quizCat.id);
          localStorage.setItem("quiz-completed", JSON.stringify(done));
        }
      }
    }, 800);
  };

  const resetQuiz = () => {
    setQuizCat(null);
    setQuizIdx(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setQuizDone(false);
  };

  return (
    <div className="animate-fade-in pb-4">
      {/* Hero */}
      <div className="relative overflow-hidden text-primary-foreground p-5 pb-6" style={{
        background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(250 70% 40%) 40%, hsl(var(--emerald-dark)) 80%, hsl(var(--gold) / 0.6) 100%)"
      }}>
        {/* Hero decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-15" style={{ background: "radial-gradient(circle, hsl(var(--primary-foreground)), transparent)" }} />
        <svg className="absolute top-2 right-2 w-24 h-24 opacity-[0.07]" viewBox="0 0 100 100">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" />
        </svg>

        <div className="relative z-10 flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">{lang === "ar" ? "السلام عليكم" : "Assalamu Alaikum"} 👋</h1>
            <p className="text-sm opacity-80 mt-0.5">{lang === "ar" ? "بارك الله في يومك" : "May Allah bless your day"}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-primary-foreground/20" style={{
            background: "linear-gradient(135deg, hsl(var(--gold) / 0.25), hsl(var(--primary-foreground) / 0.1))",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px hsl(0 0% 0% / 0.15)"
          }}>
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-bold">{streak}</span>
            <span className="text-xs opacity-70">{lang === "ar" ? "يوم" : "days"}</span>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-4 gap-2">
          {quickActions.map((a) => (
            <button key={a.path} onClick={() => { localStorage.setItem("last-activity", a.label); navigate(a.path); }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-primary-foreground/10 hover:border-primary-foreground/25 transition-all hover:scale-105" style={{
                background: "linear-gradient(180deg, hsl(var(--primary-foreground) / 0.12), hsl(var(--primary-foreground) / 0.05))",
                backdropFilter: "blur(6px)",
                boxShadow: "0 2px 8px hsl(0 0% 0% / 0.1)"
              }}>
              <a.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{a.label}</span>
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
              {lang === "ar" ? "آخر نشاط:" : "Last:"}{" "}
              <span className="text-foreground font-medium">{lastActivity}</span>
            </p>
          </div>
        )}

        {/* Stats */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-2">{lang === "ar" ? "إحصائياتك" : "Your Stats"}</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: lang === "ar" ? "صفحات" : "Pages", value: stats.quranPages, icon: BookOpen, gradient: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.03))" },
              { label: lang === "ar" ? "أذكار" : "Adhkar", value: stats.adhkarDone, icon: Sun, gradient: "linear-gradient(135deg, hsl(var(--gold) / 0.12), hsl(var(--gold) / 0.03))" },
              { label: lang === "ar" ? "تسبيح" : "Tasbih", value: stats.tasbihTotal, icon: CircleDot, gradient: "linear-gradient(135deg, hsl(var(--accent) / 0.1), hsl(var(--accent) / 0.03))" },
              { label: lang === "ar" ? "تفسير" : "Tafsir", value: stats.tafsirRead, icon: BookOpenCheck, gradient: "linear-gradient(135deg, hsl(var(--emerald-dark) / 0.15), hsl(var(--emerald-dark) / 0.03))" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border/50" style={{
                background: s.gradient,
                boxShadow: "0 2px 12px hsl(var(--primary) / 0.06)"
              }}>
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
              <div key={i} className="p-3 rounded-xl border border-border/40" style={{
                background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--card) / 0.7))",
                boxShadow: "0 2px 12px hsl(var(--primary) / 0.05), 0 1px 3px hsl(0 0% 0% / 0.04)"
              }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{
                      background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))"
                    }}>
                      <ch.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
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

          {!quizCat ? (
            <div className="grid grid-cols-2 gap-2">
              {QUIZ_CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setQuizCat(cat)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card hover:bg-muted transition">
                  <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-xs font-bold text-foreground">{lang === "ar" ? cat.nameAr : cat.nameEn}</p>
                  <p className="text-[10px] text-muted-foreground">{cat.questions.length} {lang === "ar" ? "أسئلة" : "Q"}</p>
                </button>
              ))}
            </div>
          ) : quizDone ? (
            <div className="p-5 rounded-xl bg-card text-center space-y-3">
              <div className="w-14 h-14 rounded-full islamic-gradient mx-auto flex items-center justify-center">
                <Trophy className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">{quizScore}/{quizCat.questions.length}</p>
              <p className="text-xs text-muted-foreground">
                {quizScore === quizCat.questions.length
                  ? (lang === "ar" ? "ممتاز! أحسنت 🎉" : "Perfect! 🎉")
                  : (lang === "ar" ? "أحسنت، حاول مرة أخرى" : "Good try!")}
              </p>
              <button onClick={resetQuiz} className="text-xs text-primary font-medium">{lang === "ar" ? "رجوع" : "Back"}</button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-card space-y-3">
              <div className="flex items-center justify-between">
                <button onClick={resetQuiz} className="text-[10px] text-primary font-medium">✕</button>
                <span className="text-[10px] text-muted-foreground">{quizIdx + 1}/{quizCat.questions.length}</span>
                <span className="text-[10px] text-primary font-medium">{quizScore}</span>
              </div>
              <p className="font-arabic text-base text-foreground text-right" dir="rtl">{quizCat.questions[quizIdx].q}</p>
              <div className="grid grid-cols-2 gap-2">
                {quizCat.questions[quizIdx].options.map((opt, i) => {
                  let cls = "bg-muted hover:bg-muted/80 border border-transparent";
                  if (quizAnswer !== null) {
                    if (i === quizCat.questions[quizIdx].correct) cls = "bg-primary/20 border-primary/40";
                    else if (i === quizAnswer) cls = "bg-destructive/20 border-destructive/40";
                  }
                  return (
                    <button key={i} onClick={() => quizAnswer === null && handleQuizAnswer(i)} disabled={quizAnswer !== null}
                      className={`p-2.5 rounded-xl text-sm font-medium text-foreground transition ${cls}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tafsir download shortcut */}
        <button onClick={() => navigate("/quran")}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-card hover:bg-muted transition">
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
