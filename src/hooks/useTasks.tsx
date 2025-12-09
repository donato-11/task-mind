import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Task {
  id: string;
  title: string;
  description?: string;
  xp: number;
  priority: "high" | "medium" | "low";
  completed: boolean;
  due_date?: string;
  due_time?: string;
  label?: string;
  difficulty: "easy" | "medium" | "hard";
  created_at?: string;
}

export interface CreateTaskData {
  title: string;
  priority?: "high" | "medium" | "low";
  xp?: number;
  label?: string;
  difficulty?: "easy" | "medium" | "hard";
  due_date?: string;
  due_time?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTasks(
        (data || []).map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description || undefined,
          xp: t.xp,
          priority: t.priority as "high" | "medium" | "low",
          completed: t.completed,
          due_date: t.due_date || undefined,
          due_time: t.due_time || undefined,
          label: t.label || undefined,
          difficulty: t.difficulty as "easy" | "medium" | "hard",
          created_at: t.created_at,
        }))
      );
    } catch (error: any) {
      toast({
        title: "Error al cargar tareas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: CreateTaskData) => {
    if (!user) return;

    const xpByDifficulty = {
      easy: 25,
      medium: 50,
      hard: 100,
    };

    const difficulty = taskData.difficulty || "medium";
    const xp = xpByDifficulty[difficulty];

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: taskData.title,
          priority: taskData.priority || "medium",
          xp,
          label: taskData.label || null,
          difficulty,
          due_date: taskData.due_date || null,
          due_time: taskData.due_time || null,
        })
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) => [
        {
          id: data.id,
          title: data.title,
          xp: data.xp,
          priority: data.priority as "high" | "medium" | "low",
          completed: data.completed,
          due_date: data.due_date || undefined,
          due_time: data.due_time || undefined,
          label: data.label || undefined,
          difficulty: data.difficulty as "easy" | "medium" | "hard",
          created_at: data.created_at,
        },
        ...prev,
      ]);

      toast({
        title: "Tarea creada",
        description: `"${taskData.title}" añadida con éxito`,
      });
    } catch (error: any) {
      toast({
        title: "Error al crear tarea",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", id);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );

      toast({
        title: task.completed ? "Tarea pendiente" : "¡Tarea completada!",
        description: task.completed ? "" : `+${task.xp} XP ganados`,
      });
    } catch (error: any) {
      toast({
        title: "Error al actualizar tarea",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;

      setTasks((prev) => prev.filter((t) => t.id !== id));

      toast({
        title: "Tarea eliminada",
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar tarea",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    addTask,
    toggleComplete,
    deleteTask,
    refetch: fetchTasks,
  };
};
