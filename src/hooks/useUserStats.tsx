import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface UserStats {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  last_activity_date: string | null;
}

// XP required for each level (level 0 -> 1 needs 100 XP, etc.)
const XP_PER_LEVEL = 100;
const XP_MULTIPLIER = 1.5; // Each level requires more XP

export const calculateXPForLevel = (level: number): number => {
  return Math.floor(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level));
};

export const calculateTotalXPForLevel = (level: number): number => {
  let total = 0;
  for (let i = 0; i < level; i++) {
    total += calculateXPForLevel(i);
  }
  return total;
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setStats(data);
      } else {
        // Create stats if they don't exist (for existing users)
        const { data: newStats, error: insertError } = await supabase
          .from("user_stats")
          .insert({ user_id: user.id, xp: 0, level: 0, streak: 0 })
          .select()
          .single();

        if (insertError) throw insertError;
        setStats(newStats);
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addXP = async (amount: number) => {
    if (!user || !stats) return;

    const newXP = stats.xp + amount;
    let newLevel = stats.level;
    let remainingXP = newXP;

    // Calculate level ups
    while (remainingXP >= calculateXPForLevel(newLevel)) {
      remainingXP -= calculateXPForLevel(newLevel);
      newLevel++;
    }

    const leveledUp = newLevel > stats.level;

    try {
      const today = new Date().toISOString().split("T")[0];
      const lastActivity = stats.last_activity_date;
      let newStreak = stats.streak;

      // Update streak logic
      if (lastActivity) {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffDays = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          newStreak++;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const { error } = await supabase
        .from("user_stats")
        .update({
          xp: remainingXP,
          level: newLevel,
          streak: newStreak,
          last_activity_date: today,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setStats((prev) =>
        prev
          ? {
              ...prev,
              xp: remainingXP,
              level: newLevel,
              streak: newStreak,
              last_activity_date: today,
            }
          : null
      );

      if (leveledUp) {
        toast({
          title: "🎉 ¡Subiste de nivel!",
          description: `¡Ahora eres nivel ${newLevel}!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al actualizar XP",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    addXP,
    refetch: fetchStats,
    xpForNextLevel: stats ? calculateXPForLevel(stats.level) : XP_PER_LEVEL,
  };
};
