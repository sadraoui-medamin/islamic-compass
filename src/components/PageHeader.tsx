import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

const PageHeader = ({ title, subtitle, icon, children }: PageHeaderProps) => {
  return (
    <div className="relative overflow-hidden px-5 pt-12 pb-6 rounded-b-3xl" style={{
      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(250 70% 40%) 40%, hsl(var(--emerald-dark)) 80%, hsl(var(--gold) / 0.5) 100%)",
      boxShadow: "0 8px 32px hsl(var(--primary) / 0.2), 0 4px 12px hsl(0 0% 0% / 0.1)"
    }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15" style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent)" }} />
      <div className="absolute bottom-0 left-1/4 w-24 h-24 rounded-full blur-2xl opacity-10" style={{ background: "radial-gradient(circle, hsl(var(--primary-foreground)), transparent)" }} />
      <svg className="absolute bottom-1 right-4 w-16 h-16 opacity-[0.06]" viewBox="0 0 100 100">
        <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" className="text-primary-foreground" />
      </svg>

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
