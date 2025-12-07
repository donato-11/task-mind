import { Link, useLocation } from "react-router-dom";
import { Home, Battery, Users, Sparkles, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/energy", label: "Energía", icon: Battery },
  { path: "/social", label: "Social", icon: Users },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:relative md:border-t-0 md:border-b md:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start md:gap-2 py-2 md:py-0">
          {/* Logo - only on desktop */}
          <Link to="/" className="hidden md:flex items-center gap-3 mr-8">
            <div className="p-2 rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TaskMind
              </h1>
              <p className="text-xs text-muted-foreground">Potencia tu productividad</p>
            </div>
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                  isActive
                    ? "text-primary bg-primary/10 md:bg-gradient-primary md:text-primary-foreground md:shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Login button - desktop */}
          <div className="hidden md:flex md:ml-auto">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          {/* Login button - mobile */}
          <Link
            to="/auth"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted md:hidden"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-xs font-medium">Entrar</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
