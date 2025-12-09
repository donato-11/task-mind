import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XPBar } from "@/components/XPBar";
import { StatsCard } from "@/components/StatsCard";
import { AIMentor } from "@/components/AIMentor";
import { AchievementBadge } from "@/components/AchievementBadge";
import { AdaptiveTaskList } from "@/components/AdaptiveTaskList";
import { Navigation } from "@/components/Navigation";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { EnergyData, EnergyLevel } from "@/components/EnergyCheckIn";
import { Flame, Target, Trophy, Zap, Moon, Sun, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTasks, CreateTaskData } from "@/hooks/useTasks";
import { useUserStats, calculateXPForLevel } from "@/hooks/useUserStats";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, addTask, toggleComplete } = useTasks();
  const { stats, loading: statsLoading, addXP, xpForNextLevel } = useUserStats();
  const navigate = useNavigate();
  
  const location = useLocation();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

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

  const handleCompleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      await toggleComplete(id);
      addXP(task.xp);
    } else {
      toggleComplete(id);
    }
  };

  const handleAddTask = (data: CreateTaskData) => {
    addTask(data);
  };

  // Transform tasks for AdaptiveTaskList
  const adaptedTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    xp: t.xp,
    category: t.label || (t.priority === "high" ? "Importante" : t.priority === "medium" ? "Normal" : "Ligera"),
    completed: t.completed,
    difficulty: t.difficulty,
    dueDate: t.due_date,
    dueTime: t.due_time,
  }));

  const completedTasks = tasks.filter((t) => t.completed).length;

  // User stats from database
  const currentXP = stats?.xp ?? 0;
  const currentLevel = stats?.level ?? 0;
  const currentStreak = stats?.streak ?? 0;

  // Show loading while checking auth or loading stats
  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
              <XPBar currentXP={currentXP} maxXP={xpForNextLevel} level={currentLevel} />
            </Card>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <StatsCard
                icon={Flame}
                title="Racha Actual"
                value={`${currentStreak} días`}
                subtitle={currentStreak > 0 ? "¡Sigue así!" : "¡Empieza hoy!"}
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
                value={currentXP}
                subtitle={`Nivel ${currentLevel}`}
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
            <CreateTaskForm onSubmit={handleAddTask} />

            {/* Task List */}
            {tasksLoading ? (
              <Card className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </Card>
            ) : adaptedTasks.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No tienes tareas aún. ¡Crea tu primera misión!
              </Card>
            ) : (
              <AdaptiveTaskList 
                tasks={adaptedTasks} 
                energyData={energyData} 
                onComplete={handleCompleteTask}
              />
            )}
          </div>

          {/* Right Column - Energy & AI */}
          <div className="space-y-6">
            {/* Energy Quick Status */}
            <Card className={`p-6 ${currentMode.bg} border-border`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${currentMode.color}`}>
                  <currentMode.icon className="w-5 h-5" />
                  Tu Energía
                </h3>
                <Link to="/energy">
                  <Button variant="ghost" size="sm" className={currentMode.color}>
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
                            ? currentMode.mode === "sprint" ? "bg-success" 
                              : currentMode.mode === "normal" ? "bg-primary" 
                              : "bg-accent"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentMode.label} • {currentMode.bonus}
                  </p>
                </div>
                <div className={`p-2 rounded-xl ${currentMode.bg}`}>
                  <currentMode.icon className={`w-6 h-6 ${currentMode.color}`} />
                </div>
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
