import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XPBar } from "@/components/XPBar";
import { TaskCard } from "@/components/TaskCard";
import { StatsCard } from "@/components/StatsCard";
import { AIMentor } from "@/components/AIMentor";
import { AchievementBadge } from "@/components/AchievementBadge";
import { Flame, Target, Trophy, Plus, Sparkles } from "lucide-react";

const Index = () => {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Complete morning workout", xp: 50, category: "Health", completed: false },
    { id: "2", title: "Review project proposal", xp: 100, category: "Work", completed: false },
    { id: "3", title: "Read for 30 minutes", xp: 75, category: "Learning", completed: true },
    { id: "4", title: "Plan tomorrow's tasks", xp: 50, category: "Planning", completed: false },
  ]);

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
                <p className="text-sm text-muted-foreground">Level up your productivity</p>
              </div>
            </div>
            
            <Button className="bg-gradient-accent text-accent-foreground hover:shadow-glow-accent transition-all duration-300">
              <Trophy className="w-4 h-4 mr-2" />
              View Rewards
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
                title="Current Streak"
                value="5 days"
                subtitle="Keep it going!"
                gradient="accent"
              />
              <StatsCard
                icon={Target}
                title="Tasks Completed"
                value={completedTasks}
                subtitle={`${tasks.length - completedTasks} remaining`}
                gradient="success"
              />
              <StatsCard
                icon={Trophy}
                title="Total XP"
                value={totalXP}
                subtitle="This week"
                gradient="primary"
              />
            </div>

            {/* Add Task */}
            <Card className="p-6 bg-gradient-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Add New Quest</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="What do you want to accomplish?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddTask}
                  className="bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Task List */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Today's Quests</h2>
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onComplete={handleCompleteTask}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Stats & AI */}
          <div className="space-y-6">
            {/* AI Mentor */}
            <AIMentor />

            {/* Achievements */}
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Achievements
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
