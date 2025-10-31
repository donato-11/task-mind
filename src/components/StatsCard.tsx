import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  gradient?: 'primary' | 'accent' | 'success';
}

export const StatsCard = ({ icon: Icon, title, value, subtitle, gradient = 'primary' }: StatsCardProps) => {
  const gradientClass = {
    primary: 'bg-gradient-primary',
    accent: 'bg-gradient-accent',
    success: 'bg-gradient-success',
  }[gradient];

  return (
    <Card className="p-6 bg-gradient-card border-border hover:shadow-card transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${gradientClass} shadow-glow`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};
