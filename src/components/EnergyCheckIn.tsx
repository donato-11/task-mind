import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery, Moon, Smile, Zap, BatteryLow, BatteryMedium, BatteryFull } from "lucide-react";

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type SleepQuality = "poor" | "fair" | "good" | "excellent";
export type Mood = "stressed" | "neutral" | "motivated" | "energized";

export interface EnergyData {
  energyLevel: EnergyLevel;
  sleepQuality: SleepQuality;
  mood: Mood;
}

interface EnergyCheckInProps {
  onSubmit: (data: EnergyData) => void;
  currentEnergy?: EnergyData;
  navigateOnSubmit?: boolean;
}

const energyOptions = [
  { value: 1 as EnergyLevel, label: "Muy bajo", icon: BatteryLow, color: "bg-destructive" },
  { value: 2 as EnergyLevel, label: "Bajo", icon: BatteryLow, color: "bg-destructive/70" },
  { value: 3 as EnergyLevel, label: "Normal", icon: BatteryMedium, color: "bg-accent" },
  { value: 4 as EnergyLevel, label: "Alto", icon: BatteryFull, color: "bg-success/80" },
  { value: 5 as EnergyLevel, label: "Máximo", icon: Zap, color: "bg-success" },
];

const sleepOptions: { value: SleepQuality; label: string; emoji: string }[] = [
  { value: "poor", label: "Mal", emoji: "😴" },
  { value: "fair", label: "Regular", emoji: "😐" },
  { value: "good", label: "Bien", emoji: "😊" },
  { value: "excellent", label: "Excelente", emoji: "🌟" },
];

const moodOptions: { value: Mood; label: string; emoji: string }[] = [
  { value: "stressed", label: "Estresado", emoji: "😰" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "motivated", label: "Motivado", emoji: "💪" },
  { value: "energized", label: "Energizado", emoji: "⚡" },
];

export const EnergyCheckIn = ({ onSubmit, currentEnergy, navigateOnSubmit = false }: EnergyCheckInProps) => {
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(currentEnergy?.energyLevel || 3);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(currentEnergy?.sleepQuality || "good");
  const [mood, setMood] = useState<Mood>(currentEnergy?.mood || "neutral");
  const [isExpanded, setIsExpanded] = useState(!currentEnergy);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const data = { energyLevel, sleepQuality, mood };
    onSubmit(data);
    setIsExpanded(false);
    
    if (navigateOnSubmit) {
      // Navigate to home with energy data in state
      navigate("/", { state: { energyData: data } });
    }
  };

  const getEnergyStatus = () => {
    if (energyLevel <= 2) return { text: "Modo Descanso", color: "text-destructive", bg: "bg-destructive/10" };
    if (energyLevel === 3) return { text: "Modo Normal", color: "text-accent", bg: "bg-accent/10" };
    return { text: "Modo Sprint 🚀", color: "text-success", bg: "bg-success/10" };
  };

  const status = getEnergyStatus();

  if (!isExpanded && currentEnergy) {
    return (
      <Card 
        className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-card border-border ${status.bg}`}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${energyOptions[energyLevel - 1].color}`}>
              <Battery className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Tu energía hoy</p>
              <p className={`text-sm font-medium ${status.color}`}>{status.text}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-6 rounded-full transition-all ${
                  level <= energyLevel ? energyOptions[energyLevel - 1].color : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-card animate-scale-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Battery className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">¿Cómo te sientes hoy?</h3>
          <p className="text-sm text-muted-foreground">Tu IA ajustará las tareas según tu energía</p>
        </div>
      </div>

      {/* Energy Level */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-3 block flex items-center gap-2">
          <Zap className="w-4 h-4" /> Nivel de Energía
        </label>
        <div className="flex gap-2">
          {energyOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setEnergyLevel(option.value)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                  energyLevel === option.value
                    ? `${option.color} border-transparent text-primary-foreground shadow-glow`
                    : "border-border bg-card hover:border-primary/50 text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs block">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sleep Quality */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-3 block flex items-center gap-2">
          <Moon className="w-4 h-4" /> ¿Cómo dormiste?
        </label>
        <div className="flex gap-2">
          {sleepOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSleepQuality(option.value)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                sleepQuality === option.value
                  ? "bg-primary border-primary text-primary-foreground shadow-glow"
                  : "border-border bg-card hover:border-primary/50 text-foreground"
              }`}
            >
              <span className="text-xl block mb-1">{option.emoji}</span>
              <span className="text-xs block">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-3 block flex items-center gap-2">
          <Smile className="w-4 h-4" /> Estado de ánimo
        </label>
        <div className="flex gap-2">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setMood(option.value)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                mood === option.value
                  ? "bg-accent border-accent text-accent-foreground shadow-glow-accent"
                  : "border-border bg-card hover:border-accent/50 text-foreground"
              }`}
            >
              <span className="text-xl block mb-1">{option.emoji}</span>
              <span className="text-xs block">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
      >
        <Zap className="w-4 h-4 mr-2" />
        Optimizar mi día
      </Button>
    </Card>
  );
};
