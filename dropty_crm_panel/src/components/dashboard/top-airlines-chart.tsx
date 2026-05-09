"use client";

interface TopAirlinesChartProps {
  data?: Array<{ name: string; bookings: number; logo?: string }>;
}

export function TopAirlinesChart({ data }: TopAirlinesChartProps) {
  // Mock data
  const chartData = data || [
    { name: "Air India", bookings: 342, logo: "🛫" },
    { name: "SpiceJet", bookings: 298, logo: "✈️" },
    { name: "IndiGo", bookings: 276, logo: "🛩️" },
    { name: "Vistara", bookings: 198, logo: "🛬" },
    { name: "Go First", bookings: 133, logo: "✈️" },
  ];

  const maxBookings = Math.max(...chartData.map((d) => d.bookings));

  const gradients = [
    "from-blue-500 to-blue-600",
    "from-red-500 to-red-600",
    "from-indigo-500 to-indigo-600",
    "from-purple-500 to-purple-600",
    "from-orange-500 to-orange-600",
  ];

  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Top Airlines
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          By booking volume
        </p>
      </div>

      <div className="space-y-4">
        {chartData.map((airline, index) => {
          const percentage = (airline.bookings / maxBookings) * 100;
          const isTop = index === 0;

          return (
            <div key={airline.name} className="group">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xl dark:bg-zinc-800">
                    {airline.logo}
                  </div>
                  <div>
                    <p className={`font-bold ${isTop ? "text-primary" : "text-zinc-900 dark:text-zinc-50"}`}>
                      {airline.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {airline.bookings} bookings
                    </p>
                  </div>
                </div>
                {isTop && (
                  <span className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    👑 #1
                  </span>
                )}
              </div>
              <div className="relative h-4 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${gradients[index]} shadow-md transition-all duration-500 group-hover:shadow-lg`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">
              TOTAL BOOKINGS
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {chartData.reduce((sum, d) => sum + d.bookings, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>
    </div>
  );
}
