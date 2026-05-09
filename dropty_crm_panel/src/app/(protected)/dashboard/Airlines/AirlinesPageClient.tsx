"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddEditAirlineModal from "./AddEditAirlinesModal";

export default function AirlinesPageClient() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="add" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add Airlines
      </Button>

      <AddEditAirlineModal open={open} onOpenChange={setOpen}  mode="add"/>
    </>
  );
}
