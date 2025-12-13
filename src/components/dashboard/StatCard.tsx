import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className, iconClassName }: StatCardProps) {
  return (
    <div className={cn("glass-card p-4 lg:p-5 animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs lg:text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl lg:text-3xl font-display font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-primary mt-1 font-medium">{trend}</p>
          )}
        </div>
        <div className={cn("p-2 lg:p-3 rounded-xl", iconClassName || "bg-primary/10")}>
          <Icon className={cn("h-4 w-4 lg:h-5 lg:w-5", iconClassName ? "text-inherit" : "text-primary")} />
        </div>
      </div>
    </div>
  );
}
