import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { 
  Users, Trophy, Target, Flame, Crown, Medal, 
  Swords, Gift, Plus, UserPlus, ChevronRight 
} from "lucide-react";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  xpWeekly: number;
  streak: number;
  isOnline: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "competition" | "collaborative";
  xpReward: number;
  participants: { name: string; avatar: string; contribution: number }[];
  progress: number;
  target: number;
  endsIn: string;
  prize?: string;
}

const Social = () => {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "challenges" | "friends">("leaderboard");

  const [friends] = useState<Friend[]>([
    { id: "1", name: "María G.", avatar: "🦊", xpWeekly: 1250, streak: 12, isOnline: true },
    { id: "2", name: "Carlos R.", avatar: "🐺", xpWeekly: 980, streak: 8, isOnline: true },
    { id: "3", name: "Ana P.", avatar: "🦋", xpWeekly: 875, streak: 15, isOnline: false },
    { id: "4", name: "Luis M.", avatar: "🦁", xpWeekly: 720, streak: 5, isOnline: false },
    { id: "5", name: "Tú", avatar: "⭐", xpWeekly: 650, streak: 5, isOnline: true },
  ]);

  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Maratón de Productividad",
      description: "Completa 50 tareas entre todos antes del domingo",
      type: "collaborative",
      xpReward: 500,
      participants: [
        { name: "María", avatar: "🦊", contribution: 12 },
        { name: "Tú", avatar: "⭐", contribution: 8 },
        { name: "Carlos", avatar: "🐺", contribution: 6 },
      ],
      progress: 26,
      target: 50,
      endsIn: "2 días",
      prize: "Badge Exclusivo",
    },
    {
      id: "2",
      title: "Duelo Semanal",
      description: "Gana más XP que tu rival esta semana",
      type: "competition",
      xpReward: 300,
      participants: [
        { name: "Tú", avatar: "⭐", contribution: 650 },
        { name: "Ana", avatar: "🦋", contribution: 875 },
      ],
      progress: 650,
      target: 875,
      endsIn: "4 días",
    },
    {
      id: "3",
      title: "Racha Grupal",
      description: "Mantén una racha de 7 días como equipo",
      type: "collaborative",
      xpReward: 750,
      participants: [
        { name: "María", avatar: "🦊", contribution: 5 },
        { name: "Carlos", avatar: "🐺", contribution: 5 },
        { name: "Tú", avatar: "⭐", contribution: 5 },
        { name: "Luis", avatar: "🦁", contribution: 3 },
      ],
      progress: 5,
      target: 7,
      endsIn: "2 días",
      prize: "100 XP Bonus",
    },
  ]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-accent" />;
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Users className="w-5 h-5" />
              <span className="font-medium">TaskMind Social</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Retos & Competiciones
            </h1>
            <p className="text-muted-foreground">
              Compite con amigos, completa misiones colaborativas y gana recompensas
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {[
              { id: "leaderboard", label: "Ranking", icon: Trophy },
              { id: "challenges", label: "Retos", icon: Swords },
              { id: "friends", label: "Amigos", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <Card className="p-6 bg-gradient-card border-border animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Ranking Semanal
                </h3>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  Esta semana
                </Badge>
              </div>

              <div className="space-y-3">
                {friends
                  .sort((a, b) => b.xpWeekly - a.xpWeekly)
                  .map((friend, index) => (
                    <div
                      key={friend.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        friend.name === "Tú"
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <span className="text-2xl">{friend.avatar}</span>
                          {friend.isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${friend.name === "Tú" ? "text-primary" : "text-foreground"}`}>
                            {friend.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Flame className="w-3 h-3 text-accent" />
                            {friend.streak} días de racha
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{friend.xpWeekly.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Retos Activos</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Reto
                </Button>
              </div>

              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-6 bg-gradient-card border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${
                        challenge.type === "collaborative" 
                          ? "bg-success/10" 
                          : "bg-destructive/10"
                      }`}>
                        {challenge.type === "collaborative" ? (
                          <Target className="w-6 h-6 text-success" />
                        ) : (
                          <Swords className="w-6 h-6 text-destructive" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    <Badge variant={challenge.type === "collaborative" ? "default" : "destructive"} className="shrink-0">
                      {challenge.type === "collaborative" ? "Colaborativo" : "Competición"}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium text-foreground">
                        {challenge.progress} / {challenge.target}
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.progress / challenge.target) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Participants */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {challenge.participants.slice(0, 4).map((p, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm border-2 border-card"
                          >
                            {p.avatar}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {challenge.participants.length} participantes
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      {challenge.prize && (
                        <span className="flex items-center gap-1 text-accent">
                          <Gift className="w-4 h-4" />
                          {challenge.prize}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-primary font-medium">
                        +{challenge.xpReward} XP
                      </span>
                      <span className="text-muted-foreground">
                        Termina en {challenge.endsIn}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === "friends" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Tus Amigos</h3>
                <Button className="gap-2 bg-gradient-primary text-primary-foreground hover:shadow-glow">
                  <UserPlus className="w-4 h-4" />
                  Añadir Amigo
                </Button>
              </div>

              <Card className="divide-y divide-border bg-gradient-card border-border">
                {friends.filter(f => f.name !== "Tú").map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <span className="text-3xl">{friend.avatar}</span>
                      {friend.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{friend.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {friend.xpWeekly} XP
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-accent" />
                          {friend.streak} días
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Retar
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </Card>

              {/* Quick Challenge */}
              <Card className="p-6 bg-gradient-primary text-primary-foreground">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary-foreground/20">
                    <Swords className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">¿Listo para un duelo?</h4>
                    <p className="text-primary-foreground/80 text-sm">
                      Reta a un amigo y compite por XP esta semana
                    </p>
                  </div>
                  <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Iniciar Duelo
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Social;
