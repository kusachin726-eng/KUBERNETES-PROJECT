import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock data for now - replace with actual database queries
    const recentBookings = [
      {
        id: 1,
        bookingNumber: 'BK-2024-001',
        customerName: 'John Doe',
        flightNumber: 'AI-101',
        route: 'Mumbai → Delhi',
        status: 'confirmed',
        amount: 3500,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        bookingNumber: 'BK-2024-002',
        customerName: 'Jane Smith',
        flightNumber: 'SG-205',
        route: 'Delhi → Bangalore',
        status: 'pending',
        amount: 4200,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        bookingNumber: 'BK-2024-003',
        customerName: 'Mike Johnson',
        flightNumber: 'UK-789',
        route: 'Bangalore → Mumbai',
        status: 'confirmed',
        amount: 2800,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 4,
        bookingNumber: 'BK-2024-004',
        customerName: 'Sarah Williams',
        flightNumber: 'AI-456',
        route: 'Chennai → Kolkata',
        status: 'completed',
        amount: 3100,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: 5,
        bookingNumber: 'BK-2024-005',
        customerName: 'David Brown',
        flightNumber: 'SG-321',
        route: 'Hyderabad → Pune',
        status: 'confirmed',
        amount: 2500,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ].slice(0, limit);

    return NextResponse.json(recentBookings);
  } catch (error) {
    console.error('Recent bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent bookings' },
      { status: 500 }
    );
  }
}
