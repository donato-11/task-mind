import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Zap, Coffee, Timer, TrendingUp, Star } from "lucide-react";
import { EnergyData } from "./EnergyCheckIn";

interface Task {
  id: string;
  title: string;
  xp: number;
  category: string;
  completed: boolean;
  difficulty?: "easy" | "medium" | "hard";
}

interface AdaptiveTask extends Task {
  aiSuggestion?: string;
  priorityScore: number;
  adjustedXP: number;
  isRecommended: boolean;
  timeSlot?: string;
}

interface AdaptiveTaskListProps {
  tasks: Task[];
  energyData: EnergyData;
  onComplete: (id: string) => void;
}

const getDifficultyWeight = (difficulty: Task["difficulty"]) => {
  switch (difficulty) {
    case "easy": return 1;
    case "medium": return 2;
    case "hard": return 3;
    default: return 2;
  }
};

const getEnergyMode = (energyData: EnergyData) => {
  const score = energyData.energyLevel + 
    (energyData.sleepQuality === "excellent" ? 2 : energyData.sleepQuality === "good" ? 1 : energyData.sleepQuality === "fair" ? 0 : -1) +
    (energyData.mood === "energized" ? 2 : energyData.mood === "motivated" ? 1 : energyData.mood === "neutral" ? 0 : -1);

  if (score >= 6) return "sprint";
  if (score >= 3) return "normal";
  return "rest";
};

export const AdaptiveTaskList = ({ tasks, energyData, onComplete }: AdaptiveTaskListProps) => {
  const mode = getEnergyMode(energyData);

  const adaptedTasks = useMemo((): AdaptiveTask[] => {
    return tasks.map((task) => {
      const difficulty = task.difficulty || "medium";
      const difficultyWeight = getDifficultyWeight(difficulty);
      
      let priorityScore = task.xp;
      let adjustedXP = task.xp;
      let aiSuggestion = "";
      let isRecommended = false;
      let timeSlot = "";

      if (mode === "rest") {
        // Low energy: prioritize easy tasks, reduce XP expectations
        if (difficulty === "easy") {
          priorityScore *= 3;
          adjustedXP = Math.round(task.xp * 1.5); // Bonus for easy tasks
          isRecommended = true;
          aiSuggestion = "Tarea ideal para tu nivel de energía actual";
          timeSlot = "Cuando puedas";
        } else if (difficulty === "hard") {
          priorityScore *= 0.3;
          aiSuggestion = "Considera posponerla para cuando tengas más energía";
          timeSlot = "Mañana";
        } else {
          priorityScore *= 0.7;
          aiSuggestion = "Divídela en pasos más pequeños si es necesario";
          timeSlot = "Más tarde";
        }
      } else if (mode === "sprint") {
        // High energy: prioritize hard/high-impact tasks with bonus XP
        if (difficulty === "hard") {
          priorityScore *= 3;
          adjustedXP = Math.round(task.xp * 2); // Double XP in sprint mode
          isRecommended = true;
          aiSuggestion = "¡Momento perfecto para esta tarea de alto impacto!";
          timeSlot = "Ahora";
        } else if (difficulty === "medium") {
          priorityScore *= 1.5;
          adjustedXP = Math.round(task.xp * 1.3);
          isRecommended = true;
          timeSlot = "Próxima hora";
        } else {
          priorityScore *= 0.8;
          timeSlot = "Más tarde";
        }
      } else {
        // Normal mode: balanced approach
        if (difficulty === "medium") {
          isRecommended = true;
          aiSuggestion = "Buen balance entre esfuerzo y recompensa";
          timeSlot = "Durante el día";
        }
      }

      return {
        ...task,
        difficulty,
        priorityScore,
        adjustedXP,
        aiSuggestion,
        isRecommended,
        timeSlot,
      };
    }).sort((a, b) => {
      // Completed tasks go to the bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Then sort by priority score
      return b.priorityScore - a.priorityScore;
    });
  }, [tasks, mode]);

  const getModeInfo = () => {
    switch (mode) {
      case "sprint":
        return {
          title: "Modo Sprint Activado 🚀",
          subtitle: "¡Tu energía está al máximo! XP x2 en tareas difíciles",
          gradient: "bg-gradient-success",
          icon: Zap,
          bgClass: "bg-success/5 border-success/20",
        };
      case "rest":
        return {
          title: "Modo Descanso 🌙",
          subtitle: "Tareas ligeras recomendadas. XP bonus en tareas fáciles",
          gradient: "bg-gradient-accent",
          icon: Coffee,
          bgClass: "bg-accent/5 border-accent/20",
        };
      default:
        return {
          title: "Modo Normal ⚡",
          subtitle: "Balance entre productividad y descanso",
          gradient: "bg-gradient-primary",
          icon: TrendingUp,
          bgClass: "bg-primary/5 border-primary/20",
        };
    }
  };

  const modeInfo = getModeInfo();
  const ModeIcon = modeInfo.icon;

  return (
    <div className="space-y-4">
      {/* Mode Banner */}
      <Card className={`p-4 border ${modeInfo.bgClass} animate-fade-in`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${modeInfo.gradient}`}>
            <ModeIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{modeInfo.title}</h3>
            <p className="text-sm text-muted-foreground">{modeInfo.subtitle}</p>
          </div>
        </div>
      </Card>

      {/* Tasks */}
      <div className="space-y-3">
        {adaptedTasks.map((task, index) => (
          <Card
            key={task.id}
            className={`p-4 transition-all duration-300 hover:shadow-card ${
              task.completed
                ? "bg-muted/50 border-border opacity-60"
                : task.isRecommended
                ? `${modeInfo.bgClass} shadow-card`
                : "bg-gradient-card border-border"
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onComplete(task.id)}
                className="mt-1"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </h4>
                  {task.isRecommended && !task.completed && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Recomendada
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {task.category}
                  </Badge>
                  {task.timeSlot && !task.completed && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      <Timer className="w-3 h-3 mr-1" />
                      {task.timeSlot}
                    </Badge>
                  )}
                </div>

                {task.aiSuggestion && !task.completed && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    {task.aiSuggestion}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <Badge
                  variant="outline"
                  className={`${
                    task.adjustedXP > task.xp
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-accent/10 text-accent-foreground border-accent/30"
                  }`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  +{task.adjustedXP} XP
                </Badge>
                {task.adjustedXP > task.xp && (
                  <p className="text-xs text-success mt-1">+{task.adjustedXP - task.xp} bonus</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
