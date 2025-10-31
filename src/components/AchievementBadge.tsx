import { Trophy, Target, Zap, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Achievement {
  id: string;
  name: string;
  icon: 'trophy' | 'target' | 'zap' | 'award';
  unlocked: boolean;
}

const iconMap = {
  trophy: Trophy,
  target: Target,
  zap: Zap,
  award: Award,
};

export const AchievementBadge = ({ achievement }: { achievement: Achievement }) => {
  const Icon = iconMap[achievement.icon];
  
  return (
    <Card 
      className={`p-4 text-center transition-all duration-300 ${
        achievement.unlocked 
          ? 'bg-gradient-accent border-accent/50 shadow-glow-accent hover:scale-110 cursor-pointer' 
          : 'bg-muted border-border opacity-50'
      }`}
    >
      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
        achievement.unlocked ? 'bg-white/20' : 'bg-background'
      }`}>
        <Icon className={`w-6 h-6 ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
      </div>
      <p className={`text-xs font-medium ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`}>
        {achievement.name}
      </p>
    </Card>
  );
};
