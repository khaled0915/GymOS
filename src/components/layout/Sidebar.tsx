"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  Home,
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
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 bg-card/80 backdrop-blur-xl border-r border-border/60">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <Link href="/" className="flex items-center gap-3 px-6 py-2 hover:opacity-80 transition-opacity" title="GymOS Home">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Dumbbell className="size-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight">GymOS</span>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Performance OS</p>
          </div>
        </Link>
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

          <div className="p-4 border-t border-border mt-auto flex flex-col gap-1.5">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <Home className="mr-3 h-4 w-4 text-emerald-500" />
                Home
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
