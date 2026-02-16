import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

const PageHeader = ({ title, subtitle, icon, children }: PageHeaderProps) => {
  return (
    <div className="islamic-gradient px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
      <div className="flex items-center gap-3 mb-1">
        {icon && <div className="text-primary-foreground/80">{icon}</div>}
        <h1 className="text-2xl font-bold text-primary-foreground">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-primary-foreground/60 text-sm ml-0.5">{subtitle}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;
