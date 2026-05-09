"use client";
import { PageHeader } from "@/components/page-header";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RateCardTable } from "./ratecard-table";
import AddEditRateCardModal from "./addRatecardmodals";

export interface RateCardUI {
  id: string;
  distanceFrom: number;
  distanceTo: number;
  standardPrice: number;
  expressPrice: number;
}

const MOCK_RATE_CARDS: RateCardUI[] = [
       { id: "1", distanceFrom: 0, distanceTo: 5, standardPrice: 799, expressPrice: 999 },
       { id: "2", distanceFrom: 5, distanceTo: 10, standardPrice: 1099, expressPrice: 1399 },
       { id: "3", distanceFrom: 10, distanceTo: 15, standardPrice: 1399, expressPrice: 1799 },
       { id: "4", distanceFrom: 15, distanceTo: 20, standardPrice: 1699, expressPrice: 2199 },
       { id: "5", distanceFrom: 20, distanceTo: 25, standardPrice: 1999, expressPrice: 2599 },
];

// export default function RateCardClient() {
//   const [data, setData] = useState<RateCardUI[]>(MOCK_RATE_CARDS);
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between rounded p-2">
//         <h1 className="page-title">Rate Card</h1>
//           <Button onClick={() => setOpen(true)}>
//           <Plus className="mr-1 h-4 w-4" />
//           Add Rate Card
//         </Button>
//       </div>

//       <Card>
//         <CardContent>
//           <RateCardTable
//             rateCards={data}
//             onEdit={(id) => {
//               console.log("Edit rate card with ID:", id);
//             }}
//             onDelete={(id) => {
//               setData((prev) => prev.filter((card) => card.id !== id));
//             }}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

export default function RateCardClient() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [data, setData] = useState<RateCardUI[]>(MOCK_RATE_CARDS);


  return (
    <div className="page-container">
      <PageHeader
        title="Rate Card"
        action={
          <Button variant="add" onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Rate Card
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="p-0">
            <RateCardTable
              rateCards={data}
              onEdit={(id) => {
                setSelected({}); 
                setOpen(true);
              }}
              onDelete={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      <AddEditRateCardModal
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelected(null);
        }}
        mode={selected ? "edit" : "add"}
        initialValues={selected ?? undefined}
        onSubmit={(data) => {
          console.log("Rate Card Form Data:", data);
        }}
      />
    </div>
  );
}