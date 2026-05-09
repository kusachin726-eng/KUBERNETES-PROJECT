

//  code with the arilines table with the drawer

"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowUp, ArrowDown } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table";
import {
  Pencil,
  Trash2,
  PlusCircle,
  Eye,
} from "lucide-react";

import { DataTable } from "@/components/data-table";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";
import ConfirmModal from "@/components/ui/confirmationmodal";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AirlineApi } from "@/lib/api/airlines";
import { deleteAirlineAction, deleteExtraBagFareAction } from "./actions";

import AddEditAirlineModal from "./AddEditAirlinesModal";
import AddAirlineFareModal from "./addAirlinesFares";
import EditExtraFareModal from "./editFareModal";
import ViewRateCardDrawer from "./ViewDrawer";


/* =====================
   TYPES
===================== */
type Props = {
  airlines: AirlineApi[];
  currentPage: number;
  totalPages: number;
  total: number;
  permissions: PermissionMap;
};

/* =====================
   BADGE STYLES
===================== */
const baggageTypeStyles: Record<string, string> = {
  Weight: "bg-primary/10 border border-primary/30 text-primary",
  Piece: "bg-primary/10 border border-primary/30 text-primary",
  "N/A": "bg-zinc-100 border border-zinc-300 text-zinc-500",
};

export function AirlinesTable({
  airlines,
  currentPage,
  totalPages,
  total,   
  permissions,
}: Props) {
  const router = useRouter();

  /* =====================
     PERMISSIONS
  ===================== */
  const canEdit = can(permissions, "airline", "edit");
  const canDelete = can(permissions, "airline", "delete");
  const searchParams = useSearchParams();
const isActiveParam = searchParams.get("isActive");
const isActive =
  isActiveParam === "false" ? false : true; 

  /* =====================
     STATE
  ===================== */
  const [editOpen, setEditOpen] = useState(false);
  const [editAirlineId, setEditAirlineId] = useState<number | undefined>();

  const [fareModalOpen, setFareModalOpen] = useState(false);
  const [fareAirline, setFareAirline] = useState<AirlineApi | null>(null);

  const [editFareModalOpen, setEditFareModalOpen] = useState(false);
  const [editFare, setEditFare] = useState<any>(null);

  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [viewAirline, setViewAirline] = useState<AirlineApi | null>(null);

  /* =====================
     MAP API → TABLE DATA
  ===================== */
  const data = useMemo(() => {
    return airlines.map((a) => {
      // 🔥 Normalize API response (object → array)
      const extraBagFares = Array.isArray(a.extraBagFares)
        ? a.extraBagFares
        : [
            ...(Array.isArray((a.extraBagFares as any)?.weight)
              ? (a.extraBagFares as any).weight
              : []),
            ...(Array.isArray((a.extraBagFares as any)?.bag)
              ? (a.extraBagFares as any).bag
              : []),
          ];

      const flightTypes = Array.from(
        new Set(extraBagFares.map((f) => f.flightType)),
      );

      const baggageTypes = Array.from(
        new Set(extraBagFares.map((f) => f.baggageType)),
      );

      const faresByFlightType = extraBagFares.reduce(
        (acc, f) => {
          if (!acc[f.flightType]) acc[f.flightType] = [];
          acc[f.flightType].push(
            `${f.additionalKg}kg - ₹${f.additionalKgFare}`,
          );
          return acc;
        },
        {} as Record<"domestic" | "international", string[]>,
      );

      return {
        id: a.id,
          name: a.airlineName,
    
        profile: {
          name: a.airlineName,
          image: a.airlineLogo || "/avatar.png",
        },
        flightTypes:
          flightTypes.length > 0
            ? flightTypes.map(
                (t) => t.charAt(0).toUpperCase() + t.slice(1),
              )
            : ["N/A"],
        baggageTypes:
          baggageTypes.length > 0
            ? baggageTypes.map(
                (t) => t.charAt(0).toUpperCase() + t.slice(1),
              )
            : ["N/A"],
        faresByFlightType,
        status: a.isActive ? "active" : "inactive",
        raw: {
          ...a,
          extraBagFares,
        },
      };
    });
  }, [airlines]);

  const [localAirlines, setLocalAirlines] = useState(data);

  useEffect(() => {
    setLocalAirlines(data);
  }, [data]);

  /* =====================
     COLUMNS
  ===================== */
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "profile",
      header: "AIRLINES",
      meta: { width: "160px" },
      cell: ({ row }) => {
        const { name, image } = row.original.profile;
        return (
          <div className="flex items-center gap-2">
            <img
              src={image}
              alt={name}
              className="h-8 w-8 rounded-full object-cover border-2 border-primary/20"
            />
            <span className="truncate text-xs font-bold text-zinc-900">
              {name}
            </span>
          </div>
        );
      },
    },

    // FLIGHT TYPES COLUMN
    {
      header: "FLIGHT TYPES",
      meta: { width: "140px", align: "center" },
      cell: ({ row }) => (
        <div className="flex justify-center gap-1 flex-wrap">
          {row.original.flightTypes.map((type: string, idx: number) => (
            <span
              key={idx}
              className="rounded-md px-2 py-1 text-[10px] font-semibold bg-primary/10 border border-primary/30 text-primary"
            >
              {type}
            </span>
          ))}
        </div>
      ),
    },





// {
//   header: "Rate Card",
//   meta: { width: "220px", align: "center" },
//   cell: ({ row }) => {
//     const fares = row.original.faresByFlightType;

//     const domesticCount = fares?.domestic?.length ?? 0;
//     const internationalCount = fares?.international?.length ?? 0;

//     const total = domesticCount + internationalCount;

//     // ✅ NO RATE CARD CASE
//     if (total === 0) {
//       return (
//         <div className="flex flex-col items-center gap-1">
//           <span className="rounded-full px-3 py-1 text-xs text-gray-700 bg-gray-100">
//             No Rate Card
//           </span>
        
//         </div>
//       );
//     }

//     // ✅ ALWAYS SHOW BOTH (FIXED ALIGNMENT)
//     return (
//       <div className="flex flex-col gap-1 text-[11px]">
//         <div className="flex items-center gap-2">
//           <span className="min-w-[120px] rounded-full px-2 py-1 text-blue-800 bg-blue-50">
//             🌍 International · {internationalCount > 0 ? internationalCount : "N/A"}
//           </span>

//           <span className="min-w-[110px] rounded-full px-2 py-1 text-green-800 bg-green-50">
//             🏠 Domestic · {domesticCount > 0 ? domesticCount : "N/A"}
//           </span>
//         </div>
//       </div>
//     );
//   },
// },



{
  header: "RATE CARD",
  meta: { width: "220px", align: "center" },
  cell: ({ row }) => {
    const fares = row.original.faresByFlightType;
    const airline = row.original.raw;

    const domestic = fares?.domestic ?? [];
    const international = fares?.international ?? [];

    const hasAny = domestic.length || international.length;

    // No rate card at all
    if (!hasAny) {
      return (
        <div className="flex justify-center">
          <span className="rounded-md bg-zinc-100 border border-zinc-300 px-2 py-1 text-[10px] font-medium text-zinc-500">
            No Rate Card
          </span>
        </div>
      );
    }

    const renderFareType = (label: string, icon: string, fares: string[]) => {
      if (fares.length === 0) return null;
      
      return (
        <div className="flex items-center gap-1">
          <span className="text-xs">{icon}</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-zinc-700">{label}</span>
            <span className="text-[9px] text-zinc-600">
              {fares.length} rate{fares.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center justify-center gap-3">
          {renderFareType("Domestic", "🏠", domestic)}
          {renderFareType("Intl", "🌍", international)}
        </div>
        
        <button
          onClick={() => {
            setViewAirline(airline);
            setViewDrawerOpen(true);
          }}
          className="text-[10px] cursor-pointer font-semibold text-primary hover:underline"
        >
          View Details
        </button>
      </div>
    );
  },
},



    {
      header: "BAGGAGE TYPE",
      meta: { width: "130px", align: "center" },
      cell: ({ row }) => (
        <div className="flex justify-center gap-1 flex-wrap">
          {row.original.baggageTypes.map((type: string, idx: number) => (
            <span
              key={idx}
              className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
                baggageTypeStyles[type] ??
                "bg-zinc-100 border border-zinc-300 text-zinc-500"
              }`}
            >
              {type}
            </span>
          ))}
        </div>
      ),
    },

    // {
    //   header: "Status",
    //   meta: { width: "80px", align: "center" },
    //   cell: ({ row }) => (
    //     <span
    //       className={`rounded px-2 py-1 text-[10px] font-medium ${
    //         row.original.status === "active"
    //           ? "bg-green-100 text-green-700"
    //           : "bg-red-100 text-red-700"
    //       }`}
    //     >
    //       {row.original.status}
    //     </span>
    //   ),
    // },
    
{
  id: "status",
  header: () => {
    const nextIsActive = !isActive;

    return (
      <div className="flex items-center justify-center gap-1">
        <span>STATUS</span>

        <button
          onClick={() => {
            router.push(`?page=1&isActive=${nextIsActive}`);
          }}
          className="cursor-pointer text-primary hover:text-primary/70 transition-colors"
        >
          {isActive ? (
            <ArrowUp size={12} />
          ) : (
            <ArrowDown size={12} />
          )}
        </button>
      </div>
    );
  },
  meta: { width: "100px", align: "center" },
  cell: ({ row }) => (
    <div className="flex justify-center">
      <span
        className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
          row.original.status === "active"
            ? "bg-green-100 border border-green-300 text-green-700"
            : "bg-zinc-100 border border-zinc-300 text-zinc-500"
        }`}
      >
        {row.original.status}
      </span>
    </div>
  ),
},

    {
      header: "ACTIONS",
      meta: { width: "160px", align: "center" },
      cell: ({ row }) => {
        const airline = row.original.raw;
        const [open, setOpen] = useState(false);

        return (
          <div className="flex justify-center gap-2">
            {/* VIEW */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setViewAirline(airline);
                    setViewDrawerOpen(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  <Eye size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>View Rate Card</TooltipContent>
            </Tooltip>

            {/* EDIT AIRLINE */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setEditAirlineId(airline.id);
                    setEditOpen(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  <Pencil size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit Airline</TooltipContent>
            </Tooltip>

            {/* DELETE */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpen(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete Airline</TooltipContent>
            </Tooltip>

            <ConfirmModal
              open={open}
              onOpenChange={setOpen}
              title="Delete Airline"
              description="Are you sure you want to delete this airline?"
              confirmText="Delete"
              onConfirm={async () => {
                setOpen(false);
                const res = await deleteAirlineAction(
                  String(airline.id),
                );
                if (res.success) {
                  toast.success("Airline deleted");
                  router.refresh();
                } else {
                  toast.error(res.message || "Delete failed");
                }
              }}
            />
          </div>
        );
      },
    },
  ];

  /* =====================
     RENDER
  ===================== */
  return (
    <>
      <div className="table-card">

        <DataTable
          columns={columns}
          data={localAirlines}
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}  
          onPageChange={(page) => router.push(`?page=${page}`)}
          showName
          showId={false}
        />
      </div>

      {/* MODALS */}
      <AddEditAirlineModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        airlineId={editAirlineId}
      />

      <AddAirlineFareModal
        open={fareModalOpen}
        onOpenChange={(open) => {
          setFareModalOpen(open);
          if (!open) {
            setFareAirline(null);
            router.refresh();
          }
        }}
        airlineId={fareAirline?.id ?? null}
        airlineName={fareAirline?.airlineName}
      />

      <EditExtraFareModal
        open={editFareModalOpen}
        onOpenChange={(open) => {
          setEditFareModalOpen(open);
          if (!open) router.refresh();
        }}
        fare={editFare}
      />

      {/* VIEW RATE CARD DRAWER */}
      <ViewRateCardDrawer
        open={viewDrawerOpen}
        onClose={() => {
          setViewDrawerOpen(false);
          setViewAirline(null);
        }}
        airline={viewAirline}
      />
    </>
  );
}
