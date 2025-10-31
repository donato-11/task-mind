import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles, Trophy } from "lucide-react";

interface Task {
  id: string;
  title: string;
  xp: number;
  category: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
}

export const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`p-4 transition-all duration-300 hover:shadow-card hover:scale-[1.02] cursor-pointer ${
        task.completed ? 'bg-gradient-success/10 border-success' : 'bg-gradient-card border-border'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={() => onComplete(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
            <Badge variant="outline" className="bg-gradient-accent text-accent-foreground border-accent/30">
              <Sparkles className="w-3 h-3 mr-1" />
              +{task.xp} XP
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          </div>
        </div>

        {isHovered && !task.completed && (
          <div className="animate-float">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>
    </Card>
  );
};
