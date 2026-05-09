"use client";

import {
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  Plane,
  UserCheck,
  CheckCircle,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  gradient?: string;
}

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  Plane,
  UserCheck,
  CheckCircle,
  TrendingUp,
};

const gradientMap: Record<string, string> = {
  ShoppingCart: "from-blue-500 to-blue-600",
  DollarSign: "from-green-500 to-emerald-600",
  Users: "from-purple-500 to-purple-600",
  Clock: "from-amber-500 to-orange-600",
  Plane: "from-sky-500 to-blue-600",
  UserCheck: "from-indigo-500 to-indigo-600",
  CheckCircle: "from-teal-500 to-cyan-600",
  TrendingUp: "from-pink-500 to-rose-600",
};

export function StatCard({ title, value, iconName, trend, subtitle }: StatCardProps) {
  const Icon = iconMap[iconName] || ShoppingCart;
  const gradient = gradientMap[iconName] || "from-primary to-primary";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white p-5 shadow-lg hover:shadow-xl transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <div className="space-y-1.5">
            <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Icon with gradient background */}
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
