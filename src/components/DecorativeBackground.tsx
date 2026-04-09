const DecorativeBackground = () => {
  // 8-pointed star path generator
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
      {/* Scattered 8-pointed stars */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800">
        {/* Large stars */}
        <polygon points={starPath(340, 120, 28)} fill="currentColor" className="text-primary opacity-[0.04] dark:opacity-[0.12] dark:text-gold" />
        <polygon points={starPath(60, 300, 22)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(320, 500, 20)} fill="currentColor" className="text-accent opacity-[0.04] dark:opacity-[0.08] dark:text-gold" />
        <polygon points={starPath(80, 650, 25)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.10] dark:text-gold" />
        
        {/* Small stars */}
        <polygon points={starPath(200, 80, 10)} fill="currentColor" className="text-gold opacity-[0.06] dark:opacity-[0.15]" />
        <polygon points={starPath(150, 400, 12)} fill="currentColor" className="text-primary opacity-[0.03] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(280, 280, 8)} fill="currentColor" className="text-gold opacity-[0.05] dark:opacity-[0.12]" />
        <polygon points={starPath(100, 180, 9)} fill="currentColor" className="text-accent opacity-[0.04] dark:opacity-[0.10] dark:text-gold" />
        <polygon points={starPath(350, 700, 14)} fill="currentColor" className="text-gold opacity-[0.05] dark:opacity-[0.14]" />
        <polygon points={starPath(30, 500, 7)} fill="currentColor" className="text-primary opacity-[0.04] dark:opacity-[0.12] dark:text-gold" />
      </svg>

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
