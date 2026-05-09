"use client";

interface RecentBooking {
  id: number;
  bookingNumber: string;
  customerName: string;
  flightNumber: string;
  route: string;
  status: string;
  amount: number;
  createdAt: string;
}

interface RecentBookingsProps {
  bookings: RecentBooking[];
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-green-100 border-green-300 text-green-700",
  pending: "bg-amber-100 border-amber-300 text-amber-700",
  completed: "bg-blue-100 border-blue-300 text-blue-700",
  cancelled: "bg-red-100 border-red-300 text-red-700",
};

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

// Helper for stable currency formatting
function formatCurrency(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-gradient-to-r from-primary/5 to-transparent px-6 py-5 dark:border-zinc-800">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Recent Bookings
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Latest booking activity
        </p>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="group px-6 py-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {booking.bookingNumber}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                      statusStyles[booking.status] ||
                      "bg-zinc-100 border-zinc-300 text-zinc-700"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {booking.customerName} • {booking.flightNumber}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                  {booking.route}
                </p>
              </div>
              <div className="ml-4 flex flex-col items-end gap-1">
                <p className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  ₹{formatCurrency(booking.amount)}
                </p>
                <p
                  suppressHydrationWarning
                  className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {formatRelativeTime(booking.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
