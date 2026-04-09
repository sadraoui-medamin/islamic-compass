import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

const PageHeader = ({ title, subtitle, icon, children }: PageHeaderProps) => {
  // 8-pointed star path
  const starPoints = (cx: number, cy: number, r: number) => {
    const ri = r * 0.38;
    const pts: string[] = [];
    for (let i = 0; i < 8; i++) {
      const oa = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      const ia = oa + Math.PI / 8;
      pts.push(`${cx + r * Math.cos(oa)},${cy + r * Math.sin(oa)}`);
      pts.push(`${cx + ri * Math.cos(ia)},${cy + ri * Math.sin(ia)}`);
    }
    return pts.join(" ");
  };

  return (
    <div className="relative overflow-hidden px-5 pt-12 pb-6 rounded-b-3xl" style={{
      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(250 70% 40%) 40%, hsl(var(--emerald-dark)) 80%, hsl(var(--gold) / 0.5) 100%)",
      boxShadow: "0 8px 32px hsl(var(--primary) / 0.2), 0 4px 12px hsl(0 0% 0% / 0.1)"
    }}>
      {/* 8-pointed star decorations */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 400 120">
        <polygon points={starPoints(350, 25, 22)} fill="currentColor" className="text-primary-foreground" />
        <polygon points={starPoints(30, 90, 16)} fill="currentColor" className="text-primary-foreground" />
        <polygon points={starPoints(300, 95, 10)} fill="currentColor" className="text-primary-foreground" />
        <polygon points={starPoints(180, 15, 8)} fill="currentColor" className="text-primary-foreground" />
      </svg>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15" style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent)" }} />

      <div className="relative z-10 flex items-center gap-3 mb-1">
        {icon && <div className="text-primary-foreground/80">{icon}</div>}
        <h1 className="text-2xl font-bold text-primary-foreground">{title}</h1>
      </div>
      {subtitle && (
        <p className="relative z-10 text-primary-foreground/60 text-sm ml-0.5">{subtitle}</p>
      )}
      {children && <div className="relative z-10 mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;
