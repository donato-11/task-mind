import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, TrendingUp } from "lucide-react";

export const AIMentor = () => {
  return (
    <Card className="p-6 bg-gradient-card border-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-primary shadow-glow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              AI Productivity Mentor
              <Sparkles className="w-4 h-4 text-accent animate-float" />
            </h3>
            <p className="text-xs text-muted-foreground">Your personal guide to success</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="p-3 rounded-lg bg-background/50 border border-border">
            <p className="text-sm text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="font-medium">Today's Insight</span>
            </p>
            <p className="text-sm text-muted-foreground">
              You're on a 5-day streak! Your productivity peaks between 9-11 AM. Try scheduling important tasks during this window.
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-gradient-accent/10 border border-accent/30">
            <p className="text-sm font-medium text-foreground mb-1">💡 Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              Break down large tasks into smaller 25-minute sprints to maintain focus and earn XP faster!
            </p>
          </div>
        </div>

        <Button className="w-full bg-gradient-primary text-white hover:shadow-glow transition-all duration-300">
          <Sparkles className="w-4 h-4 mr-2" />
          Get AI Suggestions
        </Button>
      </div>
    </Card>
  );
};
