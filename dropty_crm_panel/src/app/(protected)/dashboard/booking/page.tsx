"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { getBookingsAction } from "./actions";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import BookingFilters from "./booking-filters";


/* ================= TYPES ================= */

type Booking = {
  id: number;
  bookingNumber: string;
  customer: string;
  airline: string;

  amount?: number;
  status: string;
  date?: string;

  flightType?: string;
  airportName?: string;
  terminal?: string;
  flightTime?: string;

  flight?: string;
  route?: string;
  flightDate?: string;
  pickupDate?: string;

  airlineTotalAmount?: string;
  droptytotalAmount?: string;

  totalAllowedBaggageWeightKg?: string;
  totalExcessBaggageWeightKg?: string;
  extraBags?: number;
  totalBags?: number;

  passengerNames?: string[];
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mobile?: string;
  totalDistanceKm?: string;
  execessKm?: string;
  execessKmFare?: string;
};

/* ================= PAGE ================= */

// export default function BookingPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const pageFromUrl = Number(searchParams.get("page") ?? 1);
//   const statusFromUrl = searchParams.get("status") ?? "all";

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
//   const [statusFilter, setStatusFilter] = useState("all");

//   /* ================= UPDATE FILTER ================= */

//   const updateStatusFilter = (value: string) => {
//     const params = new URLSearchParams(searchParams.toString());

//     params.set("page", "1"); // reset page

//     if (value === "all") {
//       params.delete("status");
//     } else {
//       params.set("status", value);
//     }

//     router.replace(`?${params.toString()}`);
//   };

//   /* ================= FETCH ================= */

//  const fetchBookings = useCallback(
//   async (pageNumber = 1) => {
//     try {
//       const res = await getBookingsAction({
//         page: pageNumber,
//         limit: 10,
//         status: statusFilter !== "all" ? statusFilter : "",
//       });

//       if (!res.success) {
//         setBookings([]);
//         return;
//       }

//       const rows = Array.isArray(res.rows) ? res.rows : [];

//       const formatted: Booking[] = rows.map((item: any) => ({
//         id: item.id,
//         bookingNumber: item.bookingNumber,
//         customer: item.address?.lead_passenger_name || "-",
//         airline: item.airline?.airlineName || "-",
//         flightType: item.flightDetails?.flightType,
//         airportName: item.flightDetails?.airportName,
//         terminal: item.flightDetails?.terminal,
//         flightTime: item.flightDetails?.time,
//         amount: Number(item.totalAmount || 0),
//         airlineTotalAmount: item.airlineTotalAmount,
//         droptytotalAmount: item.totalAmount,
//         status: item.bookingStatus,
//         flight: item.flightDetails?.flightNumber || "-",
//         route: item.flightDetails
//           ? `${item.flightDetails.city || "-"} (${item.flightDetails.airportCode || "-"})`
//           : "-",
//         flightDate: item.flightDetails?.date
//           ? new Date(item.flightDetails.date).toLocaleDateString()
//           : "-",
//         pickupDate: item.logistics?.pickupDate
//           ? new Date(item.logistics.pickupDate).toLocaleDateString()
//           : "-",
//         totalAllowedBaggageWeightKg: item.totalAllowedBaggageWeightKg,
//         totalExcessBaggageWeightKg: item.totalExcessBaggageWeightKg,
//         extraBags: item.extraBags,
//         totalBags: item.totalBags,
//         passengerNames:
//           item.passengerList?.map((p: any) => p.passengerName) || [],
//         address: item.address?.address,
//         city: item.address?.city,
//         state: item.address?.state,
//         pincode: item.address?.pincode,
//         mobile: item.address?.mobile,
//         totalDistanceKm: item.address?.totalDistanceKm,
//         execessKm: item.address?.execessKm,
//         execessKmFare: item.address?.execessKmFare,
//       }));

//       setBookings(formatted);
//       setTotalPages(res.totalPages ?? 1);
//     } catch (err) {
//       console.error(err);
//       setBookings([]);
//     }
//   },
//   [statusFilter]   // ✅ IMPORTANT
// );

//   useEffect(() => {
//     fetchBookings(page);
//   }, [page,statusFilter,fetchBookings]);

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
const [total, setTotal] = useState(0);

  const pageFromUrl = Number(searchParams.get("page") ?? 1);
  const statusFromUrl = searchParams.get("status") ?? "all";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  /* ================= UPDATE FILTER ================= */

  const updateStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    router.replace(`?${params.toString()}`);
  };

  /* ================= FETCH ================= */

const fetchBookings = useCallback(
  async (pageNumber: number, statusValue: string) => {
    try {
      const res = await getBookingsAction({
        page: pageNumber,
        limit: 10,
        status: statusValue !== "all" ? statusValue : "",
      });
      console.log("API RESPONSE:", res);


      if (!res.success) {
        setBookings([]);
        setTotalPages(1);
        setTotal(0);
        return;
      }

      const rows = Array.isArray(res.rows) ? res.rows : [];

      const formatted: Booking[] = rows.map((item: any) => ({
        id: item.id,
        bookingNumber: item.bookingNumber,
        customer: item.address?.lead_passenger_name || "-",
        airline: item.airline?.airlineName || "-",
        status: item.bookingStatus,
        flight: item.flightDetails?.flightNumber || "-",
        route: item.flightDetails
          ? `${item.flightDetails.city || "-"} (${item.flightDetails.airportCode || "-"})`
          : "-",
        flightDate: item.flightDetails?.date
          ? new Date(item.flightDetails.date).toLocaleDateString()
          : "-",
        pickupDate: item.logistics?.pickupDate
          ? new Date(item.logistics.pickupDate).toLocaleDateString()
          : "-",
        passengerNames:
          item.passengerList?.map((p: any) => p.passengerName) || [],
        city: item.address?.city,
        state: item.address?.state,
        pincode: item.address?.pincode,
        totalBags: item.totalBags,
        totalAllowedBaggageWeightKg: item.totalAllowedBaggageWeightKg,
        totalExcessBaggageWeightKg: item.totalExcessBaggageWeightKg,
        extraBags: item.extraBags,
        droptytotalAmount: item.totalAmount,
        airlineTotalAmount: item.airlineTotalAmount,
        flightTime: item.flightDetails?.time,
        terminal: item.flightDetails?.terminal,
      }));

      setBookings(formatted);
      setTotalPages(res.totalPages ?? 1);
      setTotal(res.total ?? 0);

    } catch (err) {
      console.error(err);
      setBookings([]);
      setTotalPages(1);
      setTotal(0);
    }
  },
  [],
);


  useEffect(() => {
    fetchBookings(pageFromUrl, statusFromUrl);
  }, [pageFromUrl, statusFromUrl]);

  /* ================= STATUS STYLE ================= */

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border border-red-200";
      case "INITIATED":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  /* ================= COLUMNS ================= */

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "bookingNumber",
      header: "BOOKING",
      size: 180,
      cell: ({ row }) => (
        <div
          onClick={() => router.push(`/dashboard/booking/${row.original.id}`)}
          className="flex flex-col gap-2 cursor-pointer"
        >
          <div className="text-sm font-bold text-primary hover:text-primary/70 transition-colors">
            {row.original.bookingNumber}
            <span className="text-xs text-zinc-400 ml-1 font-medium">
              ({row.original.id})
            </span>
          </div>

          <div
            className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md w-fit ${getStatusStyle(
              row.original.status,
            )}`}
          >
            {row.original.status}
          </div>
        </div>
      ),
    },

    // {
    //   id: "customerFlight",
    //   header: "CUSTOMER & FLIGHT",
    //   size: 420,
    //   cell: ({ row }) => (
    //     <div className="flex flex-col gap-3">
    //       {/* Customer Section */}
    //       <div className="flex flex-col gap-1">
    //         <div className="flex items-center gap-2">
    //           <span className="text-xs text-primary/60">👤</span>
    //           <span className="font-semibold text-sm text-zinc-900">
    //             {row.original.passengerNames?.[0] || row.original.customer}
    //           </span>
    //           {row.original.passengerNames && row.original.passengerNames.length > 1 && (
    //             <span className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full font-medium">
    //               +{row.original.passengerNames.length - 1} more
    //             </span>
    //           )}
    //         </div>
    //         <div className="flex items-start gap-2 text-xs text-zinc-600">
    //           <span>📍</span>
    //           <span className="line-clamp-1">
    //             {row.original.city}, {row.original.state} - {row.original.pincode}
    //           </span>
    //         </div>
    //       </div>

    //       {/* Flight Section */}
    //       <div className="flex flex-col gap-1 pt-2 border-t border-zinc-100">
    //         <div className="flex items-center gap-2">
    //           <span className="text-xs">✈️</span>
    //           <span className="font-medium text-sm text-zinc-900">
    //             {row.original.airline}
    //           </span>
    //           <span className="text-xs text-zinc-600">
    //             {row.original.flight}
    //           </span>
    //         </div>
    //         <div className="text-xs text-zinc-600 ml-5">
    //           {row.original.route} • {row.original.terminal}
    //         </div>
    //       </div>
    //     </div>
    //   ),
    // },

    {
      id: "customerFlight",
      header: "CUSTOMER & FLIGHT",
      size: 420,
      cell: ({ row }) => {
        const bookingId = row.original.id;
        const passengers = row.original.passengerNames || [];
        const isExpanded = expandedRows[bookingId];

        return (
          <div className="flex flex-col gap-3">
            {/* Customer Section */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <span className="text-xs text-primary/60">👤</span>

                <div className="flex flex-col">
                  {/* First passenger always visible */}
                  <span className="font-semibold text-sm text-zinc-900">
                    {passengers[0] || row.original.customer}
                  </span>

                  {/* Show rest if expanded */}
                  {isExpanded &&
                    passengers.slice(1).map((name, index) => (
                      <span key={index} className="text-sm text-zinc-700">
                        {name}
                      </span>
                    ))}

                  {/* +X more clickable */}
                  {!isExpanded && passengers.length > 1 && (
                    <button
                      onClick={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [bookingId]: true,
                        }))
                      }
                      className="text-xs text-primary font-medium mt-1 hover:underline text-left"
                    >
                      +{passengers.length - 1} more
                    </button>
                  )}

                  {/* Show less button */}
                  {isExpanded && passengers.length > 1 && (
                    <button
                      onClick={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [bookingId]: false,
                        }))
                      }
                      className="text-xs text-zinc-500 font-medium mt-1 hover:underline text-left"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-zinc-600">
                <span>📍</span>
                <span className="line-clamp-1">
                  {row.original.city}, {row.original.state} -{" "}
                  {row.original.pincode}
                </span>
              </div>
            </div>

            {/* Flight Section */}
            <div className="flex flex-col gap-1 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="text-xs">✈️</span>
                <span className="font-medium text-sm text-zinc-900">
                  {row.original.airline}
                </span>
                <span className="text-xs text-zinc-600">
                  {row.original.flight}
                </span>
              </div>
              <div className="text-xs text-zinc-600 ml-5">
                {row.original.route} • {row.original.terminal}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      id: "schedule",
      header: "SCHEDULE",
      size: 200,
      cell: ({ row }) => (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>📅</span>
              <span className="font-medium">Pickup</span>
            </div>
            <div className="text-sm font-semibold text-zinc-900 ml-5">
              {row.original.pickupDate}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>🛫</span>
              <span className="font-medium">Flight</span>
            </div>
            <div className="text-sm font-semibold text-zinc-900 ml-5">
              {row.original.flightDate}
            </div>
            <div className="text-xs text-zinc-600 ml-5">
              {row.original.flightTime}
            </div>
          </div>
        </div>
      ),
    },

    {
      id: "baggage",
      header: "BAGGAGE",
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg text-primary">🎒</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900">
                {row.original.totalBags ?? 0} bags
              </span>
              <span className="text-xs text-zinc-500">
                {row.original.totalAllowedBaggageWeightKg ?? 0} kg allowed
              </span>
            </div>
          </div>

          {(row.original.extraBags ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              <span className="text-xs font-medium text-amber-700">
                +{row.original.extraBags} extra
              </span>
            </div>
          )}

          {(Number(row.original.totalExcessBaggageWeightKg) ?? 0) > 0 && (
            <div className="text-xs text-red-600 font-medium">
              +{row.original.totalExcessBaggageWeightKg} kg excess
            </div>
          )}
        </div>
      ),
    },

    {
      id: "amount",
      header: "AMOUNT",
      size: 140,
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-1">Dropty</span>
            <span className="text-lg font-bold text-primary">
              ₹{row.original.droptytotalAmount ?? "-"}
            </span>
          </div>

          <div className="flex flex-col pt-2 border-t border-zinc-100">
            <span className="text-xs text-zinc-500">Airline</span>
            <span className="text-sm font-medium text-zinc-700">
              ₹{row.original.airlineTotalAmount ?? "-"}
            </span>
          </div>
        </div>
      ),
    },
  ];

  /* ================= UI ================= */
  /* ================= RENDER ================= */

  return (
    <div className="page-container">
      <PageHeader title="Bookings" />
      {/* Stats Cards */}{" "}
      <div
        className="
    table-card
    w-full
    overflow-x-auto
    [&_table]:w-full
    [&_table]:border-collapse

    [&_th]:px-4
    [&_th]:py-3
    [&_th]:text-left
    [&_th]:text-xs
    [&_th]:font-semibold
    [&_th]:text-primary/70
    [&_th]:uppercase
    [&_th]:tracking-wider
    [&_th]:bg-primary/5
    [&_th]:border-b-2
    [&_th]:border-primary/20

    [&_tbody_tr]:bg-white
    [&_tbody_tr]:border
    [&_tbody_tr]:border-zinc-200
    [&_tbody_tr]:rounded-lg
    [&_tbody_tr]:shadow-sm
    [&_tbody_tr]:transition-all
    [&_tbody_tr]:duration-200

    [&_tbody_tr:hover]:shadow-md
    [&_tbody_tr:hover]:border-primary/40
    [&_tbody_tr:hover]:bg-primary/5

    [&_tbody_td]:px-4
    [&_tbody_td]:py-3
    [&_tbody_td]:text-left
    [&_tbody_td]:align-top

    [&_tbody_tr_td:first-child]:rounded-l-lg
    [&_tbody_tr_td:last-child]:rounded-r-lg
  "
      >
        {/* <DataTable
  columns={columns}
  data={bookings}
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  searchPlaceholder="Search booking number..."
  filters={
    <BookingFilters
      status={statusFilter}
      setStatus={setStatusFilter}
    />
  }
/> */}
       <DataTable
  columns={columns}
  data={bookings}
  currentPage={pageFromUrl}
  totalPages={totalPages}
  total={total}   // ✅ ADD THIS
  onPageChange={(newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`?${params.toString()}`);
  }}
  searchPlaceholder="Search booking number..."
  filters={
    <BookingFilters
      status={statusFromUrl}
      setStatus={updateStatusFilter}
    />
  }
/>

      </div>
    </div>
  );
}
