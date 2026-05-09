"use client";

interface RevenueChartProps {
  data?: Array<{ day: string; revenue: number }>;
}

// Consistent number formatter to avoid hydration issues
function formatCurrency(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Mock data for 7 days
  const chartData = data || [
    { day: "Mon", revenue: 42000 },
    { day: "Tue", revenue: 38000 },
    { day: "Wed", revenue: 51000 },
    { day: "Thu", revenue: 45000 },
    { day: "Fri", revenue: 48000 },
    { day: "Sat", revenue: 35000 },
    { day: "Sun", revenue: 45680 },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Revenue Trend
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Last 7 days performance
        </p>
      </div>

      <div className="space-y-4">
        {chartData.map((item, index) => {
          const percentage = (item.revenue / maxRevenue) * 100;
          const isToday = index === chartData.length - 1;

          return (
            <div key={item.day} className="group">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className={`font-semibold ${isToday ? "text-primary" : "text-zinc-600 dark:text-zinc-400"}`}>
                  {item.day}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">
                  ₹{formatCurrency(item.revenue)}
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isToday
                      ? "bg-gradient-to-r from-primary to-blue-600"
                      : "bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600"
                  } group-hover:shadow-lg`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-950/20 dark:to-emerald-950/20">
        <div>
          <p className="text-xs font-semibold text-green-600 dark:text-green-400">
            TOTAL THIS WEEK
          </p>
          <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">
            ₹{formatCurrency(chartData.reduce((sum, d) => sum + d.revenue, 0))}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <span className="text-2xl">📈</span>
        </div>
      </div>
    </div>
  );
}
