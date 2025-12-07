import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XPBar } from "@/components/XPBar";
import { StatsCard } from "@/components/StatsCard";
import { AIMentor } from "@/components/AIMentor";
import { AchievementBadge } from "@/components/AchievementBadge";
import { AdaptiveTaskList } from "@/components/AdaptiveTaskList";
import { Navigation } from "@/components/Navigation";
import { EnergyData, EnergyLevel } from "@/components/EnergyCheckIn";
import { Flame, Target, Trophy, Plus, Battery, Zap, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

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

  const [newTask, setNewTask] = useState("");
  const location = useLocation();

  // Energy data from navigation state or default
  const [energyData, setEnergyData] = useState<EnergyData>({
    energyLevel: 4 as EnergyLevel,
    sleepQuality: "good",
    mood: "motivated",
  });

  // Update energy data if coming from Energy page
  useEffect(() => {
    if (location.state?.energyData) {
      setEnergyData(location.state.energyData);
    }
  }, [location.state]);

  const getEnergyMode = () => {
    const avg = (Number(energyData.energyLevel) + 
      (energyData.sleepQuality === "excellent" ? 5 : energyData.sleepQuality === "good" ? 4 : energyData.sleepQuality === "fair" ? 3 : 2) + 
      (energyData.mood === "energized" ? 5 : energyData.mood === "motivated" ? 4 : energyData.mood === "neutral" ? 3 : 2)) / 3;
    
    if (avg >= 4) return { mode: "sprint", label: "Modo Sprint", icon: Zap, color: "text-success", bg: "bg-success/10", bonus: "+50% XP" };
    if (avg >= 2.5) return { mode: "normal", label: "Modo Normal", icon: Sun, color: "text-primary", bg: "bg-primary/10", bonus: "XP Normal" };
    return { mode: "rest", label: "Modo Descanso", icon: Moon, color: "text-accent", bg: "bg-accent/10", bonus: "Tareas ligeras" };
  };

  const currentMode = getEnergyMode();

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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Navigation */}
      <Navigation />

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

            {/* Energy Mode Banner */}
            <Card className={`p-4 ${currentMode.bg} border-border animate-fade-in`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-primary`}>
                    <currentMode.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${currentMode.color}`}>
                      {currentMode.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentMode.bonus} • Tareas optimizadas según tu energía
                    </p>
                  </div>
                </div>
                <Link to="/energy">
                  <Button variant="ghost" size="sm" className={currentMode.color}>
                    Cambiar
                  </Button>
                </Link>
              </div>
            </Card>

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
            <AdaptiveTaskList 
              tasks={tasks} 
              energyData={energyData} 
              onComplete={handleCompleteTask}
            />
          </div>

          {/* Right Column - Energy & AI */}
          <div className="space-y-6">
            {/* Energy Quick Status */}
            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Battery className="w-5 h-5 text-success" />
                  Tu Energía
                </h3>
                <Link to="/energy">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Actualizar
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-3 flex-1 rounded-full transition-all ${
                          level <= energyData.energyLevel
                            ? "bg-success"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Modo Sprint activo • +50% XP
                  </p>
                </div>
                <div className="text-3xl">⚡</div>
              </div>
            </Card>

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
