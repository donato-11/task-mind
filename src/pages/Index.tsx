import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XPBar } from "@/components/XPBar";
import { StatsCard } from "@/components/StatsCard";
import { AIMentor } from "@/components/AIMentor";
import { AchievementBadge } from "@/components/AchievementBadge";
import { EnergyCheckIn, EnergyData } from "@/components/EnergyCheckIn";
import { AdaptiveTaskList } from "@/components/AdaptiveTaskList";
import { Flame, Target, Trophy, Plus, Sparkles } from "lucide-react";

interface Task {
  id: string;
  title: string;
  xp: number;
  category: string;
  completed: boolean;
  difficulty?: "easy" | "medium" | "hard";
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Completar workout matutino", xp: 50, category: "Salud", completed: false, difficulty: "medium" },
    { id: "2", title: "Revisar propuesta de proyecto", xp: 100, category: "Trabajo", completed: false, difficulty: "hard" },
    { id: "3", title: "Leer 30 minutos", xp: 75, category: "Aprendizaje", completed: true, difficulty: "easy" },
    { id: "4", title: "Planificar tareas de mañana", xp: 50, category: "Planificación", completed: false, difficulty: "easy" },
    { id: "5", title: "Responder emails importantes", xp: 60, category: "Trabajo", completed: false, difficulty: "medium" },
    { id: "6", title: "Meditar 10 minutos", xp: 40, category: "Bienestar", completed: false, difficulty: "easy" },
  ]);

  const [energyData, setEnergyData] = useState<EnergyData | undefined>(undefined);

  const [newTask, setNewTask] = useState("");

  const achievements = [
    { id: "1", name: "First Win", icon: "trophy" as const, unlocked: true },
    { id: "2", name: "Week Warrior", icon: "target" as const, unlocked: true },
    { id: "3", name: "Speed Demon", icon: "zap" as const, unlocked: false },
    { id: "4", name: "Champion", icon: "award" as const, unlocked: false },
  ];

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        xp: 50,
        category: "General",
        completed: false
      }]);
      setNewTask("");
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalXP = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  TaskMind
                </h1>
                <p className="text-sm text-muted-foreground">Potencia tu productividad</p>
              </div>
            </div>
            
            <Button className="bg-gradient-accent text-accent-foreground hover:shadow-glow-accent transition-all duration-300">
              <Trophy className="w-4 h-4 mr-2" />
              Ver Recompensas
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP Progress */}
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <XPBar currentXP={totalXP} maxXP={500} level={5} />
            </Card>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <StatsCard
                icon={Flame}
                title="Racha Actual"
                value="5 días"
                subtitle="¡Sigue así!"
                gradient="accent"
              />
              <StatsCard
                icon={Target}
                title="Tareas Completadas"
                value={completedTasks}
                subtitle={`${tasks.length - completedTasks} restantes`}
                gradient="success"
              />
              <StatsCard
                icon={Trophy}
                title="XP Total"
                value={totalXP}
                subtitle="Esta semana"
                gradient="primary"
              />
            </div>

            {/* Add Task */}
            <Card className="p-6 bg-gradient-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Nueva Misión</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="¿Qué quieres lograr hoy?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddTask}
                  className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Task List */}
            {energyData ? (
              <AdaptiveTaskList 
                tasks={tasks} 
                energyData={energyData} 
                onComplete={handleCompleteTask}
              />
            ) : (
              <Card className="p-8 bg-gradient-card border-border text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Configura tu energía del día
                </h3>
                <p className="text-muted-foreground text-sm">
                  Completa el check-in de energía para que la IA adapte tus tareas
                </p>
              </Card>
            )}
          </div>

          {/* Right Column - Energy & AI */}
          <div className="space-y-6">
            {/* Energy Check-In */}
            <EnergyCheckIn 
              onSubmit={setEnergyData} 
              currentEnergy={energyData}
            />

            {/* AI Mentor */}
            <AIMentor />

            {/* Achievements */}
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Logros
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(achievement => (
                  <AchievementBadge 
                    key={achievement.id} 
                    achievement={achievement}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
