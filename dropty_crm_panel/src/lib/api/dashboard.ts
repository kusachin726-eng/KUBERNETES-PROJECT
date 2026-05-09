export type DashboardStats = {
  totalBookings: number;
  todayRevenue: number;
  activeCustomers: number;
  pendingBookings: number;
  totalAirlines: number;
  availableCrew: number;
  completedToday: number;
  averageBookingValue: number;
};

export type RecentBooking = {
  id: number;
  bookingNumber: string;
  customerName: string;
  flightNumber: string;
  route: string;
  status: string;
  amount: number;
  createdAt: string;
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR on Vercel
  return `http://localhost:${process.env.PORT ?? 3000}`; // SSR locally
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${getBaseUrl()}/api/dashboard/stats`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return res.json();
}

export async function getRecentBookings(limit: number = 10): Promise<RecentBooking[]> {
  const res = await fetch(`${getBaseUrl()}/api/dashboard/recent?limit=${limit}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch recent bookings');
  }

  return res.json();
}
