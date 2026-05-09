
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Phone, X, ArrowRight, Check } from "lucide-react";
import { getCrewListAction } from "@/app/(protected)/dashboard/booking/actions";

interface CrewMember {
  id: number;
  mobile_number: string;
  email: string | null;
  userProfile: {
    firstName: string;
    lastName: string;
  };
}

interface AssignCrewModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (crewId: number) => void;
  bookingId: string;
  assignedCrewId?: number | null; // ✅ ADD THIS
}


export function AssignCrewModal({
  open,
  onClose,
  onAssign,
  assignedCrewId
}: AssignCrewModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrewId, setSelectedCrewId] = useState<number | null>(null);
  const [crewList, setCrewList] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounced,setDebouncedSearch]=useState("")
  // useeffect for debounce search query
  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 500); // 500ms debounce

  return () => clearTimeout(timer);
}, [searchQuery]);


  // ✅ Fetch Crew List from API
useEffect(() => {
  if (!open) return;

  const fetchCrew = async () => {
    setLoading(true);
    const res = await getCrewListAction(debounced);

    if (res?.success) {
      setCrewList(res.data || []);
    }

    setLoading(false);
  };

  fetchCrew();
}, [open, debounced]);


  // ✅ Filtering (same logic, now using API data)
  // const filteredCrew = useMemo(() => {
  //   if (!searchQuery.trim()) return crewList;

  //   const query = searchQuery.toLowerCase();
  //   return crewList.filter(
  //     (crew) =>
  //       `${crew.userProfile.firstName} ${crew.userProfile.lastName}`
  //         .toLowerCase()
  //         .includes(query) ||
  //       crew.id.toString().includes(query) ||
  //       crew.mobile_number.includes(query)
  //   );
  // }, [searchQuery, crewList]);


  const handleConfirm = () => {
    if (selectedCrewId) {
      onAssign(selectedCrewId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedCrewId(null);
    onClose();
  };

  const getStatusBadge = () => {
    return null; // API does not provide status
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b-[3px] border-b-primary">
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
            <div className="bg-white/20 p-1.5 rounded-full">
              <User className="h-4 w-4 text-white" />
            </div>
            Assign Crew Member
          </DialogTitle>
        </DialogHeader>

        {/* Search Section */}
        <div className="p-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search crew by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Crew List */}
        <div className="px-4 pb-4 max-h-[350px] overflow-y-auto space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Loading crew members...</p>
            </div>
          ) : crewList.length=== 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No crew members found</p>
            </div>
          ) : (
           crewList
  .filter((crew) => crew.id !== assignedCrewId) // ✅ REMOVE CURRENT CREW
  .map((crew) => {
              const isSelected = selectedCrewId === crew.id;
              return (
                <div
                  key={crew.id}
                  className={`bg-gray-50 rounded-lg p-3 border-2 transition-all cursor-pointer hover:shadow-md ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/20"
                  }`}
                  onClick={() => setSelectedCrewId(crew.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">
                            {crew.userProfile.firstName}{" "}
                            {crew.userProfile.lastName}
                          </h4>
                          <p className="text-xs text-gray-500 uppercase">
                           <span className="text-black font-medium"> Id</span> #{crew.id}
                          </p>
                              <p className="text-xs text-gray-500">
                           <span className="text-black font-medium"> Email</span> #{crew.email}
                          </p>
                        </div>
                        {getStatusBadge()}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{crew.mobile_number}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="bg-primary text-white p-1.5 rounded-md">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white text-xs h-7 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCrewId(crew.id);
                          }}
                        >
                          Select
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedCrewId}
            className="bg-primary hover:bg-primary/90 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Confirm Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
