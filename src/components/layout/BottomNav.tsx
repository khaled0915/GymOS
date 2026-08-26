"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Dumbbell, 
  TrendingUp, 
  Flame, 
  User,
  BarChart3,
  Utensils,
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Workout", href: "/workouts", icon: Dumbbell },
  { label: "Coach", href: "/coach", icon: Sparkles },
  { label: "Exercises", href: "/exercises", icon: Flame },
  { label: "Nutrition", href: "/nutrition", icon: Utensils },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background/95 backdrop-blur border-t border-border flex items-center justify-around px-2">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium transition-colors",
              isActive
                ? "text-emerald-600 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5 mb-1", isActive ? "stroke-[2.5]" : "stroke-2")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
