import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, X, Tag, Calendar, Clock, Gauge } from "lucide-react";
import { CreateTaskData } from "@/hooks/useTasks";

interface CreateTaskFormProps {
  onSubmit: (data: CreateTaskData) => void;
}

export const CreateTaskForm = ({ onSubmit }: CreateTaskFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      label: label.trim() || undefined,
      difficulty,
      priority,
      due_date: dueDate || undefined,
      due_time: dueTime || undefined,
    });

    // Reset form
    setTitle("");
    setLabel("");
    setDifficulty("medium");
    setPriority("medium");
    setDueDate("");
    setDueTime("");
    setIsExpanded(false);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "text-success";
      case "hard":
        return "text-destructive";
      default:
        return "text-warning";
    }
  };

  const getDifficultyXP = (diff: string) => {
    switch (diff) {
      case "easy":
        return 25;
      case "hard":
        return 100;
      default:
        return 50;
    }
  };

  if (!isExpanded) {
    return (
      <Card className="p-4 bg-gradient-card border-border">
        <div className="flex gap-2">
          <Input
            placeholder="¿Qué quieres lograr hoy?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && title.trim()) {
                handleSubmit();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={() => title.trim() && handleSubmit()}
            className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Nueva Misión</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título de la tarea</Label>
        <Input
          id="title"
          placeholder="¿Qué quieres lograr?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>

      {/* Label/Tag */}
      <div className="space-y-2">
        <Label htmlFor="label" className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Etiqueta
        </Label>
        <Input
          id="label"
          placeholder="Ej: Trabajo, Personal, Estudio..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Difficulty */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Dificultad
          </Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as "easy" | "medium" | "hard")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Fácil (+25 XP)
                </span>
              </SelectItem>
              <SelectItem value="medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  Media (+50 XP)
                </span>
              </SelectItem>
              <SelectItem value="hard">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Difícil (+100 XP)
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>Prioridad</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as "high" | "medium" | "low")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">🔴 Alta</SelectItem>
              <SelectItem value="medium">🟡 Media</SelectItem>
              <SelectItem value="low">🟢 Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Due Time */}
        <div className="space-y-2">
          <Label htmlFor="dueTime" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hora
          </Label>
          <Input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>
      </div>

      {/* XP Preview */}
      <div className={`text-sm font-medium ${getDifficultyColor(difficulty)}`}>
        Esta tarea otorgará +{getDifficultyXP(difficulty)} XP al completarla
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
      >
        <Plus className="w-4 h-4 mr-2" />
        Crear Misión
      </Button>
    </Card>
  );
};
