const DecorativeBackground = () => {
  const starPath = (cx: number, cy: number, r: number) => {
    const ri = r * 0.38;
    const points: string[] = [];
    for (let i = 0; i < 8; i++) {
      const oa = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      const ia = oa + Math.PI / 8;
      points.push(`${cx + r * Math.cos(oa)},${cy + r * Math.sin(oa)}`);
      points.push(`${cx + ri * Math.cos(ia)},${cy + ri * Math.sin(ia)}`);
    }
    return points.join(" ");
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 8-pointed stars scattered */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800">
        {/* Medium stars */}
        <polygon points={starPath(340, 120, 14)} fill="currentColor" className="text-primary opacity-[0.04] dark:opacity-[0.12] dark:text-gold" />
        <polygon points={starPath(60, 300, 12)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(320, 500, 11)} fill="currentColor" className="text-accent opacity-[0.04] dark:opacity-[0.08] dark:text-gold" />
        <polygon points={starPath(80, 650, 13)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(250, 350, 10)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.09] dark:text-gold" />
        <polygon points={starPath(180, 550, 12)} fill="currentColor" className="text-accent opacity-[0.04] dark:opacity-[0.11] dark:text-gold" />

        {/* Small stars */}
        <polygon points={starPath(200, 80, 6)} fill="currentColor" className="text-gold opacity-[0.06] dark:opacity-[0.15]" />
        <polygon points={starPath(150, 400, 7)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(280, 280, 5)} fill="currentColor" className="text-gold opacity-[0.05] dark:opacity-[0.12]" />
        <polygon points={starPath(100, 180, 6)} fill="currentColor" className="text-accent opacity-[0.04] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(350, 700, 7)} fill="currentColor" className="text-gold opacity-[0.05] dark:opacity-[0.14]" />
        <polygon points={starPath(30, 500, 5)} fill="currentColor" className="text-primary opacity-[0.04] dark:opacity-[0.12] dark:text-gold" />
        <polygon points={starPath(370, 50, 5)} fill="currentColor" className="text-gold opacity-[0.05] dark:opacity-[0.13]" />
        <polygon points={starPath(120, 730, 6)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(300, 620, 4)} fill="currentColor" className="text-gold opacity-[0.04] dark:opacity-[0.11]" />
        <polygon points={starPath(50, 450, 5)} fill="currentColor" className="text-accent opacity-[0.03] dark:opacity-[0.09] dark:text-gold" />
        <polygon points={starPath(220, 200, 4)} fill="currentColor" className="text-primary opacity-[0.04] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(380, 380, 5)} fill="currentColor" className="text-gold opacity-[0.05] dark:opacity-[0.12]" />

        {/* Meteor definitions */}
        <defs>
          <linearGradient id="meteor-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(210 90% 70%)" stopOpacity="0.7" />
            <stop offset="40%" stopColor="hsl(210 80% 60%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(210 80% 60%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="meteor-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(200 85% 75%)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(220 80% 65%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(220 80% 65%)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Blue light meteors */}
      <div className="meteor meteor-1" />
      <div className="meteor meteor-2" />
      <div className="meteor meteor-3" />
      <div className="meteor meteor-4" />
      <div className="meteor meteor-5" />
      <div className="meteor meteor-6" />
      <div className="meteor meteor-7" />
      <div className="meteor meteor-8" />
      <div className="meteor meteor-9" />
      <div className="meteor meteor-10" />
      <div className="meteor meteor-11" />
      <div className="meteor meteor-12" />

      {/* Floating gradient orbs */}
      <div
        className="absolute top-1/4 -right-12 w-48 h-48 rounded-full blur-3xl opacity-[0.06] dark:opacity-[0.10]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent)" }}
      />
      <div
        className="absolute top-2/3 -left-16 w-56 h-56 rounded-full blur-3xl opacity-[0.05] dark:opacity-[0.08]"
        style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent)" }}
      />
    </div>
  );
};

export default DecorativeBackground;
