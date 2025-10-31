import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export const XPBar = ({ currentXP, maxXP, level }: XPBarProps) => {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-glow-pulse">
              <span className="text-white font-bold text-lg">{level}</span>
            </div>
            <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-float" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Level {level}</p>
            <p className="text-sm text-muted-foreground">Productivity Master</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{currentXP} / {maxXP} XP</p>
          <p className="text-xs text-muted-foreground">{Math.round(percentage)}% to next level</p>
        </div>
      </div>
      
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-3 bg-secondary"
        />
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-primary rounded-full transition-all duration-500 shadow-glow"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
