"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Dumbbell, 
  BookOpen, 
  TrendingUp, 
  User, 
  Flame,
  LogOut,
  BarChart3,
  History,
  Utensils,
  Sparkles,
  Calculator 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Workout", href: "/workouts", icon: Dumbbell },
  { label: "Coach", href: "/coach", icon: Sparkles },
  { label: "Programs", href: "/programs", icon: BookOpen },
  { label: "Exercises", href: "/exercises", icon: Flame },
  { label: "Nutrition", href: "/nutrition", icon: Utensils },
  { label: "History", href: "/workouts/history", icon: History },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 bg-card border-r">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 space-x-2">
          <Dumbbell className="h-8 w-8 text-emerald-600" />
          <span className="text-xl font-black tracking-wider uppercase">GymOS</span>
        </div>
        <div className="mt-8 flex-grow flex flex-col justify-between">
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border mt-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}
