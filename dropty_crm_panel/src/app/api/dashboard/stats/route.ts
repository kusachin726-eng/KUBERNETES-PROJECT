import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for now - replace with actual database queries
    const stats = {
      totalBookings: 1247,
      todayRevenue: 45680,
      activeCustomers: 892,
      pendingBookings: 23,
      totalAirlines: 12,
      availableCrew: 45,
      completedToday: 18,
      averageBookingValue: 2540,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
