import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { EnergyCheckIn, EnergyData } from "@/components/EnergyCheckIn";
import { Battery, Moon, Sun, Zap, TrendingUp, Calendar } from "lucide-react";

const Energy = () => {
  const [energyData, setEnergyData] = useState<EnergyData | undefined>(undefined);
  const [history] = useState([
    { date: "Lun", energy: 3, sleep: 4, mood: 4 },
    { date: "Mar", energy: 4, sleep: 5, mood: 4 },
    { date: "Mié", energy: 2, sleep: 2, mood: 3 },
    { date: "Jue", energy: 5, sleep: 5, mood: 5 },
    { date: "Vie", energy: 4, sleep: 4, mood: 4 },
    { date: "Sáb", energy: 3, sleep: 3, mood: 4 },
    { date: "Hoy", energy: energyData?.energyLevel || 0, sleep: energyData?.sleepQuality || 0, mood: energyData?.mood || 0 },
  ]);

  const getEnergyMode = () => {
    if (!energyData) return null;
    const avg = (Number(energyData.energyLevel) + Number(energyData.sleepQuality) + Number(energyData.mood)) / 3;
    if (avg >= 4) return { mode: "sprint", label: "Modo Sprint", icon: Zap, color: "text-success" };
    if (avg >= 2.5) return { mode: "normal", label: "Modo Normal", icon: Sun, color: "text-primary" };
    return { mode: "rest", label: "Modo Descanso", icon: Moon, color: "text-accent" };
  };

  const currentMode = getEnergyMode();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Battery className="w-5 h-5" />
              <span className="font-medium">Centro de Energía</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ¿Cómo te sientes hoy?
            </h1>
            <p className="text-muted-foreground">
              Tu energía determina cómo organizamos tu día
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Energy Check-In */}
            <div className="space-y-6">
              <EnergyCheckIn onSubmit={setEnergyData} currentEnergy={energyData} navigateOnSubmit={true} />

              {/* Current Mode */}
              {currentMode && (
                <Card className="p-6 bg-gradient-card border-border animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-primary`}>
                      <currentMode.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tu modo actual</p>
                      <h3 className={`text-2xl font-bold ${currentMode.color}`}>
                        {currentMode.label}
                      </h3>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Weekly Trend */}
            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Tendencia Semanal</h3>
              </div>

              <div className="space-y-4">
                {history.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-10 text-sm text-muted-foreground font-medium">
                      {day.date}
                    </span>
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-6 flex-1 rounded transition-all ${
                            level <= day.energy
                              ? day.energy >= 4
                                ? "bg-success"
                                : day.energy >= 2
                                ? "bg-primary"
                                : "bg-accent"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="w-8 text-sm font-medium text-foreground">
                      {day.energy || "-"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Promedio semanal</span>
                  <span className="font-semibold text-primary">
                    {(history.reduce((acc, d) => acc + d.energy, 0) / history.filter(d => d.energy > 0).length).toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Tips based on energy */}
          {energyData && (
            <Card className="p-6 bg-gradient-card border-border animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">Recomendaciones del día</h3>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {currentMode?.mode === "sprint" && (
                  <>
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-sm font-medium text-success">🚀 Tareas de alto impacto</p>
                      <p className="text-xs text-muted-foreground mt-1">Aprovecha tu energía máxima</p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-sm font-medium text-success">💪 Retos difíciles</p>
                      <p className="text-xs text-muted-foreground mt-1">Es el momento perfecto</p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-sm font-medium text-success">🎯 XP Extra +50%</p>
                      <p className="text-xs text-muted-foreground mt-1">Bonus por modo sprint</p>
                    </div>
                  </>
                )}
                {currentMode?.mode === "normal" && (
                  <>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium text-primary">⚖️ Balance perfecto</p>
                      <p className="text-xs text-muted-foreground mt-1">Mezcla tareas fáciles y difíciles</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium text-primary">📝 Tareas pendientes</p>
                      <p className="text-xs text-muted-foreground mt-1">Buen momento para avanzar</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium text-primary">☕ Toma pausas</p>
                      <p className="text-xs text-muted-foreground mt-1">Mantén tu energía estable</p>
                    </div>
                  </>
                )}
                {currentMode?.mode === "rest" && (
                  <>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-medium text-accent">🌙 Micro-tareas</p>
                      <p className="text-xs text-muted-foreground mt-1">Pequeños pasos, grandes logros</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-medium text-accent">🧘 Autocuidado</p>
                      <p className="text-xs text-muted-foreground mt-1">Tu bienestar es prioridad</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-medium text-accent">🎁 XP Protegido</p>
                      <p className="text-xs text-muted-foreground mt-1">Sin penalización por descansar</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Energy;
