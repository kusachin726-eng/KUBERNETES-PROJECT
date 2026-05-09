import { StatCard } from "@/components/dashboard/stat-card";
import { RecentBookings } from "@/components/dashboard/recent-bookings";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { BookingStatusChart } from "@/components/dashboard/booking-status-chart";
import { TopAirlinesChart } from "@/components/dashboard/top-airlines-chart";
import { getDashboardStats, getRecentBookings } from "@/lib/api/dashboard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const params = await searchParams;

  // Fetch dashboard data
  const stats = await getDashboardStats();
  const recentBookings = await getRecentBookings(5);

  return (
    <div className="page-container space-y-8">
      {params.forbidden && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          You don&apos;t have permission to access that page.
        </div>
      )}

      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-indigo-600 p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-lg text-blue-100">
            Welcome back! Here&apos;s your CRM overview and key metrics.
          </p>
        </div>
      </div>

      {/* Primary Metrics */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Key Performance Metrics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            iconName="ShoppingCart"
            trend={{ value: 12.5, isPositive: true }}
            subtitle="All time bookings"
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${stats.todayRevenue.toLocaleString()}`}
            iconName="DollarSign"
            trend={{ value: 8.2, isPositive: true }}
            subtitle="Revenue generated today"
          />
          <StatCard
            title="Active Customers"
            value={stats.activeCustomers.toLocaleString()}
            iconName="Users"
            trend={{ value: 5.1, isPositive: true }}
            subtitle="Currently active"
          />
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            iconName="Clock"
            subtitle="Requires attention"
          />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Operations Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Airlines"
            value={stats.totalAirlines}
            iconName="Plane"
            subtitle="Active airlines"
          />
          <StatCard
            title="Available Crew"
            value={stats.availableCrew}
            iconName="UserCheck"
            subtitle="Ready for assignment"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            iconName="CheckCircle"
            subtitle="Bookings completed"
          />
          <StatCard
            title="Avg Booking Value"
            value={`₹${stats.averageBookingValue.toLocaleString()}`}
            iconName="TrendingUp"
            subtitle="Average per booking"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Analytics & Insights
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <BookingStatusChart />
        </div>
      </div>

      {/* Recent Activity & Top Airlines */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentBookings bookings={recentBookings} />
        </div>
        <div>
          <TopAirlinesChart />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-lg dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-950 dark:to-zinc-900">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Quick Actions
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Navigate to key sections
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Link
            href="/dashboard/booking"
            className="group flex items-center justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-blue-500/10 px-5 py-4 font-semibold text-primary transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <span>View All Bookings</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard/customers"
            className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 font-semibold text-zinc-700 transition-all hover:shadow-lg hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <span>Manage Customers</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard/Airlines"
            className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 font-semibold text-zinc-700 transition-all hover:shadow-lg hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <span>Manage Airlines</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
