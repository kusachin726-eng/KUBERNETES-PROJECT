"use client";

interface BookingStatusChartProps {
  data?: Array<{ status: string; count: number; color: string }>;
}

export function BookingStatusChart({ data }: BookingStatusChartProps) {
  // Mock data
  const chartData = data || [
    { status: "Confirmed", count: 856, color: "from-green-500 to-emerald-600" },
    { status: "Pending", count: 234, color: "from-amber-500 to-orange-600" },
    { status: "Completed", count: 134, color: "from-blue-500 to-blue-600" },
    { status: "Cancelled", count: 23, color: "from-red-500 to-red-600" },
  ];

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Booking Status
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Distribution overview
        </p>
      </div>

      {/* Donut Chart */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative h-48 w-48">
          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-inner dark:from-zinc-900 dark:to-zinc-800">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {total}
              </p>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                TOTAL
              </p>
            </div>
          </div>

          {/* Donut segments */}
          <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 100 100">
            {chartData.reduce((acc, item, index) => {
              const percentage = (item.count / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = acc.currentAngle;
              const endAngle = startAngle + angle;

              // Calculate arc path
              const radius = 40;
              const centerX = 50;
              const centerY = 50;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              // Use toFixed to ensure consistent values between server/client
              const x1 = (centerX + radius * Math.cos(startRad)).toFixed(4);
              const y1 = (centerY + radius * Math.sin(startRad)).toFixed(4);
              const x2 = (centerX + radius * Math.cos(endRad)).toFixed(4);
              const y2 = (centerY + radius * Math.sin(endRad)).toFixed(4);

              const largeArc = angle > 180 ? 1 : 0;

              acc.segments.push(
                <path
                  key={item.status}
                  d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  className={`fill-current bg-gradient-to-br ${item.color} transition-opacity hover:opacity-80`}
                  style={{
                    fill: `url(#gradient-${index})`,
                  }}
                />
              );

              acc.currentAngle = endAngle;
              return acc;
            }, { segments: [] as React.ReactNode[], currentAngle: 0 }).segments}

            {/* Define gradients */}
            <defs>
              <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {chartData.map((item, index) => {
          const percentage = ((item.count / total) * 100).toFixed(1);
          return (
            <div
              key={item.status}
              className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 transition-colors hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${item.color}`} />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {item.count}
                </span>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
