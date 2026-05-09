import ViewBookingDetails from "./ViewBookingDetails";
import { getBookingByIdAction } from "./actions";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // ✅ MUST await
  const bookingId = Number(resolvedParams.id);

  const result = await getBookingByIdAction(bookingId);

  console.log("🔵 SERVER BOOKING RESULT:", result);

  if (!result.success || !result.data) {
    return <div>Failed to load booking details</div>;
  }

  return <ViewBookingDetails booking={result.data} />;
}
