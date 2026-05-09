"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Plane,
  User,
  MapPin,
  Clock,
  CreditCard,
  Luggage,
  Info as InfoIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AssignCrewModal } from "@/components/booking/AssignCrewModal";
import { assignCrewAction } from "../actions";
import { toast } from "sonner";

interface ViewBookingDetailsProps {
  booking: any;
}

export default function ViewBookingDetails({
  booking,
}: ViewBookingDetailsProps) {
  const [showAllPassengers, setShowAllPassengers] = useState(false);
  const [isAssignCrewModalOpen, setIsAssignCrewModalOpen] = useState(false);

  // Static crew data mapping
  const getCrewName = (crewId: number | null): string => {
    if (!crewId) return "Not Assigned";

    const crewMap: Record<number, string> = {
      88: "Priya Sharma",
      232: "Amit Patel",
      45: "Sneha Reddy",
      67: "Vikram Singh",
      123: "Rajesh Kumar",
      156: "Anita Desai",
      189: "Suresh Yadav",
      201: "Kavita Joshi",
    };

    return crewMap[crewId] || `Crew #${crewId}`;
  };
const router = useRouter();
  // const handleAssignCrew = (crewId: number) => {
  //   console.log("Assigning crew:", crewId);
  //   // TODO: Implement API call to assign crew
  //   setIsAssignCrewModalOpen(false);
  // };
const handleAssignCrew = async (crewId: number) => {
  console.log("→ Assign called — booking.id =", booking.id, "crewId =", crewId);

  try {
    const res = await assignCrewAction(Number(booking.id), crewId);
    
    console.log("← Server action response:", res);           // ← most important log

    if (res?.success) {
      toast.success("Crew assigned successfully ✅");
      setIsAssignCrewModalOpen(false);
      router.refresh();
    } else {
      toast.error(res?.message || "Failed to assign crew (no message)");
    }
  } catch (err) {
    console.error("Assign crew failed with exception:", err);
    toast.error("Server error while assigning crew");
  }
};


const displayedPassengers = showAllPassengers
  ? booking?.passengerList ?? []
  : booking?.passengerList?.slice(0, 1) ?? [];


  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER WITH KEY METRICS */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                #{booking.bookingNumber}
              </h1>
              <StatusBadge status={booking.bookingStatus} size="lg" />
            </div>
            <p className="text-xs text-gray-600">
              Created on{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              at{" "}
              {new Date(booking.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Passengers
              </p>
              <p className="text-lg font-bold text-gray-900">
                {booking?.passengerList?.length ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                Total Amount
              </p>
              <p className="text-lg font-bold text-primary">
                ₹{booking.totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - MAIN DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          {/* LOGISTICS & ADDRESS CARD - IMPROVED */}
          <Card className="shadow-sm border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3 bg-emerald-50/30">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-900">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                </div>
                Pickup & Logistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-3">
                {/* Schedule */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-2 border border-emerald-100">
                  <h3 className="text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    Pickup Schedule
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Date</span>
                      <span className="text-xs font-bold text-gray-900">
                        {booking?.logistics?.pickupDate
                          ? new Date(
                              booking.logistics.pickupDate,
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Time Window</span>
                      <span className="text-xs font-bold text-emerald-700">
 {booking?.logistics
  ? `${new Date(`1970-01-01T${booking.logistics.pickupTimeSlotStart}`)
      .toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()} - ${new Date(`1970-01-01T${booking.logistics.pickupTimeSlotEnd}`)
      .toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()}`
  : "N/A"}

                      </span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
  
                  <h3 className="text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-600" />
                    Pickup Address
                  </h3>
                                   
      <p className="text-[10px] text-gray-500 uppercase font-semibold">
        Lead Passenger : <span className="text-xs font-bold text-gray-900">  {booking?.address?.lead_passenger_name || "N/A"}</span>
      </p>
    
      <p className="text-[10px] text-gray-600">
        📞 {booking?.address?.mobile || "N/A"}
      </p>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-900 leading-relaxed">
                      {booking?.address?.address || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {booking?.address
                        ? `${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`
                        : "N/A"}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold">
                        <MapPin className="h-3 w-3" />
                        {booking?.address?.totalDistanceKm || "N/A"} km from
                        airport
                      </span>
                      {Number(booking?.address?.execessKm || 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-semibold">
                          ⚠️ +{booking?.address?.execessKm || "N/A"} km excess
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FLIGHT DETAILS CARD - IMPROVED */}
          <Card className="shadow-sm border-l-4 border-l-sky-500">
            <CardHeader className="pb-3 bg-sky-50/30">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-sky-900">
                <div className="bg-sky-100 p-1.5 rounded-lg">
                  <Plane className="h-4 w-4 text-sky-600" />
                </div>
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {/* Primary Flight Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">
                    AIRLINE
                  </p>
                  <p className="text-xs font-bold text-gray-900">
                {booking?.airline?.airlineName}

                  </p>
                </div>
                <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">
                    FLIGHT NO
                  </p>
                  <p className="text-xs font-bold text-indigo-900">
                   {booking?.flightDetails?.flightNumber}
                  </p>
                </div>
                <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">
                    PNR
                  </p>
                  <p className="text-xs font-bold text-indigo-900">
                    {booking.pnr}
                  </p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  <p className="text-[10px] text-gray-600 font-semibold mb-0.5">
                    TYPE
                  </p>
                  <p className="text-xs font-bold text-gray-900 capitalize">
                    {booking.flightDetails.flightType}
                  </p>
                </div>
              </div>

              {/* Departure Details */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-2 border border-sky-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sky-600" />
                  Departure Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <p className="text-[10px] text-gray-600 mb-0.5">City</p>
                    <p className="text-xs font-semibold text-gray-900">
                     {booking?.flightDetails?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 mb-0.5">Airport</p>
                    <p className="text-xs font-semibold text-gray-900">
                      {booking.flightDetails.airportName}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      ({booking.flightDetails.airportCode})
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 mb-0.5">Terminal</p>
                    <p className="text-xs font-semibold text-gray-900">
                      {booking.flightDetails.terminal}
                    </p>
                  </div>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-sky-200">
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold">
                      {new Date(booking.flightDetails.date).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}{" "}
                      at {booking.flightDetails.time}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PASSENGER DETAILS CARD - SIMPLIFIED */}
          <Card className="shadow-sm border-l-4 border-l-indigo-500">
            <CardHeader className="pb-3 bg-indigo-50/30">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-900">
                <div className="bg-indigo-100 p-1.5 rounded-lg">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                Passengers ({booking.passengerList.length})
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-2.5 pt-3">
              {displayedPassengers.map((passenger, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border-2 border-gray-100 hover:border-indigo-200 transition-all shadow-sm">
                 
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-100 p-1.5 rounded-full">
                                <User className="h-3.5 w-3.5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{passenger.passengerName}</p>
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-wide">
                                    {passenger.passengerType}
                                </span>
                            </div>
                        </div>
                        {Number(passenger.excessBaggageWeightKg) > 0 && (
                             <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border-2 border-red-200 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Excess Baggage
                             </span>
                        )}
                    </div>
                    
                
                    <div className="bg-gray-50 rounded-lg p-2">
                      <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <Luggage className="h-3 w-3"/>
                        Baggage Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                     
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                             <p className="text-[10px] text-gray-600 mb-0.5 font-semibold">Allowed</p>
                             <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-green-600">{passenger.allowedBaggageWeightKg}</span>
                                <span className="text-[10px] text-gray-500">Kg</span>
                             </div>
                             <p className="text-[10px] text-gray-500 mt-0.5">{passenger.allowedBagCount} Bag(s)</p>
                        </div>
           
                        <div className={`p-2 rounded-lg border ${Number(passenger.excessBaggageWeightKg) > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                             <p className="text-[10px] text-gray-600 mb-0.5 font-semibold">Excess</p>
                             <div className="flex items-baseline gap-1">
                                <span className={`text-lg font-bold ${Number(passenger.excessBaggageWeightKg) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                  {passenger.excessBaggageWeightKg}
                                </span>
                                <span className="text-[10px] text-gray-500">Kg</span>
                             </div>
                             <p className="text-[10px] text-gray-500 mt-0.5">{passenger.excessBagCount} Bag(s)</p>
                        </div>
                      </div>

                    
                      {passenger.extraWeightFares.length > 0 && (
                        <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                            <p className="text-[10px] font-bold text-gray-700 mb-1">Additional Charges</p>
                            <div className="space-y-1">
                                {passenger.extraWeightFares.map((fare, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[10px] bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                                        <span className="text-gray-700">+{fare.extraWeightKg} Kg ({fare.airlineExtraBagFare.baggageType})</span>
                                        <span className="font-bold text-gray-900">₹{fare.extraWeightFare}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}
                    </div>
                </div>
              ))}
              
      
              {booking.passengerList.length > 1 && (
                <button
                  onClick={() => setShowAllPassengers(!showAllPassengers)}
                  className="w-full mt-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-indigo-200"
                >
                  {showAllPassengers ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show All Passengers ({booking.passengerList.length})
                    </>
                  )}
                </button>
              )}
            </CardContent> */}
            <CardContent className="space-y-2.5 pt-3">
              {(displayedPassengers ?? []).map(
                (passenger: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border-2 border-gray-100 hover:border-indigo-200 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-100 p-1.5 rounded-full">
                          <User className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {passenger?.passengerName}
                          </p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-wide">
                            {passenger?.passengerType}
                          </span>
                        </div>
                      </div>

                      {Number(passenger?.excessBaggageWeightKg || 0) > 0 && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border-2 border-red-200 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Excess Baggage
                        </span>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <Luggage className="h-3 w-3" />
                        Baggage Details
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Allowed */}
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                          <p className="text-[10px] text-gray-600 mb-0.5 font-semibold">
                            Allowed
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-green-600">
                              {passenger?.allowedBaggageWeightKg || "0.00"}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Kg
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {passenger?.allowedBagCount || 0} Bag(s)
                          </p>
                        </div>

                        {/* Excess */}
                        <div
                          className={`p-2 rounded-lg border ${
                            Number(passenger?.excessBaggageWeightKg || 0) > 0
                              ? "bg-red-50 border-red-200"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <p className="text-[10px] text-gray-600 mb-0.5 font-semibold">
                            Excess
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`text-lg font-bold ${
                                Number(passenger?.excessBaggageWeightKg || 0) >
                                0
                                  ? "text-red-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {passenger?.excessBaggageWeightKg || "0.00"}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Kg
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {passenger?.excessBagCount || 0} Bag(s)
                          </p>
                        </div>
                      </div>

                      {passenger?.extraWeightFares?.length > 0 && (
                        <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                          <p className="text-[10px] font-bold text-gray-700 mb-1">
                            Additional Charges
                          </p>
                          <div className="space-y-1">
                            {passenger.extraWeightFares.map(
                              (fare: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center text-[10px] bg-yellow-50 px-2 py-1 rounded border border-yellow-200"
                                >
                                  <span className="text-gray-700">
                                    +{fare?.extraWeightKg} Kg (
                                    {fare?.airlineExtraBagFare?.baggageType})
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    ₹{fare?.extraWeightFare}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}

              {booking?.passengerList?.length > 1 && (
                <button
                  onClick={() => setShowAllPassengers(!showAllPassengers)}
                  className="w-full mt-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-indigo-200"
                >
                  {showAllPassengers ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show All Passengers ({booking?.passengerList?.length})
                    </>
                  )}
                </button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - FINANCIALS & LOGS */}
        <div className="space-y-6">
          {/* CREW ASSIGNMENT */}
       <Card className="shadow-sm border-l-4 border-l-primary">
  <CardHeader className="pb-3 bg-primary/5">
    <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
      <div className="bg-primary/10 p-1.5 rounded-lg">
        <User className="h-4 w-4 text-primary" />
      </div>
      Crew Assignment
    </CardTitle>
  </CardHeader>

  <CardContent className="pt-3">

    {booking?.logistics?.assignedCrewId ? (

      <div className="bg-primary/10 p-3 rounded-lg border-2 border-primary/20 flex justify-between items-center">

        <div>
          <p className="text-[10px] text-primary uppercase font-bold tracking-wide mb-0.5">
            Assigned To
          </p>

          <p className="font-bold text-gray-900 text-sm">
            {booking?.logistics?.assignedCrew?.userProfile
              ? `${booking.logistics.assignedCrew.userProfile.firstName} ${booking.logistics.assignedCrew.userProfile.lastName}`
              : "Not Assigned"}
          </p>

          <p className="text-[10px] text-gray-500 mt-0.5">
            Crew #{booking?.logistics?.assignedCrewId}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          {/* ✅ Small Reassign Button */}
          <button
            onClick={() => setIsAssignCrewModalOpen(true)}
            className="text-[11px] px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-semibold transition-all"
          >
            Reassign
          </button>

          <div className="bg-white p-1.5 rounded-full shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>

        </div>

      </div>

    ) : booking?.bookingStatus !== "CANCELLED" ? (

      <div className="space-y-2.5">
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <p className="text-xs font-medium text-gray-500">
            No crew assigned yet
          </p>
        </div>

        <button
          onClick={() => setIsAssignCrewModalOpen(true)}
          className="w-full bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg py-2.5 text-xs font-bold hover:from-primary/90 hover:to-primary/80 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
        >
          Assign Crew
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    ) : null}

  </CardContent>
</Card>


          {/* FARE SUMMARY - IMPROVED */}
          <Card className="shadow-sm border-l-4 border-l-primary">
            <CardHeader className="pb-3 bg-blue-50/30">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-blue-900">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                Fare Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 px-4 pb-4 space-y-2.5">
              <div className="space-y-2">
                <FareRow label="Base Fare" value={booking.airlineTotalAmount} />
                <FareRow
                  label="Excess Baggage"
                  value={booking.totalExcessBaggageFare}
                  subtext={`${booking.totalExcessBaggageWeightKg} Kg`}
                />
                <FareRow
                  label="Extra Bag Charges"
                  value={booking.totalExtraBagFare}
                />
                <FareRow
                  label="Distance Charges"
                  value={booking.excessKmFare}
                />
                <FareRow label="GST (18%)" value={booking.totalGST} />
                <FareRow
                  label="Convenience Fee"
                  value={booking.convenienceFee}
                />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border-2 border-primary/20 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">
                    Total Amount
                  </span>
                  <span className="font-bold text-2xl text-primary">
                    ₹{booking.totalAmount}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 text-right mt-0.5">
                  All taxes included
                </p>
              </div>
            </CardContent>
          </Card>

          {/* STATUS HISTORY - IMPROVED */}
          <Card className="shadow-sm border-l-4 border-l-blue-500">
            <CardHeader className="pb-3 bg-blue-50/30">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-blue-900">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <InfoIcon className="h-4 w-4 text-blue-600" />
                </div>
                Status Timeline
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="pt-3 relative pl-5 space-y-3 before:absolute before:left-[21px] before:top-4 before:h-[calc(100%-1.5rem)] before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-200">
                {booking.statusLogs.map((log, i) => (
                    <div key={i} className="relative z-10 pl-2.5">
                        <div className={`absolute -left-[26px] top-1 h-3.5 w-3.5 rounded-full border-[3px] border-white shadow-md ${i === 0 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-300'}`}></div>
                        <div className={`${i === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} p-2.5 rounded-lg border`}>
                             <p className="text-xs font-bold text-gray-900">{log.newStatus}</p>
                             {log.remarks ? (
                                <p className="text-[10px] text-gray-600 mt-0.5">{log.remarks}</p>
                             ) : log.previousStatus ? (
                                <p className="text-[10px] text-gray-500 mt-0.5">From: {log.previousStatus}</p>
                             ) : null}
                        </div>
                    </div>
                ))}
            </CardContent> */}
            <CardContent className="pt-3 relative pl-5 space-y-3 before:absolute before:left-[21px] before:top-4 before:h-[calc(100%-1.5rem)] before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-200">
              {(booking?.statusLogs ?? []).map((log: any, i: number) => (
                <div key={i} className="relative z-10 pl-2.5">
                  <div
                    className={`absolute -left-[26px] top-1 h-3.5 w-3.5 rounded-full border-[3px] border-white shadow-md ${
                      i === 0
                        ? "bg-blue-600 ring-4 ring-blue-100"
                        : "bg-gray-300"
                    }`}
                  ></div>

                  <div
                    className={`${
                      i === 0
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    } p-2.5 rounded-lg border`}
                  >
                    <p className="text-xs font-bold text-gray-900">
                      {log?.newStatus || "Unknown"}
                    </p>

                    {log?.remarks ? (
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {log.remarks}
                      </p>
                    ) : log?.previousStatus ? (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        From: {log.previousStatus}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Crew Assignment Modal */}
    <AssignCrewModal
  open={isAssignCrewModalOpen}
  onClose={() => setIsAssignCrewModalOpen(false)}
  onAssign={handleAssignCrew}
  bookingId={booking.id.toString()}
  assignedCrewId={booking?.logistics?.assignedCrewId}
/>
    </div>
  );
}

/* -------------------------------------------------------
   HELPER COMPONENTS
-------------------------------------------------------- */

function FareRow({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  if (Number(value) === 0 && !subtext) return null; // Hide zero rows if no subtext
  return (
    <div className="flex justify-between items-start text-xs">
      <span className="text-gray-600">
        {label}{" "}
        {subtext && (
          <span className="text-[10px] text-gray-400">{subtext}</span>
        )}
      </span>
      <span className="font-medium text-gray-900">₹{value}</span>
    </div>
  );
}

function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "lg";
}) {
  const styles: Record<string, string> = {
    REQUESTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    ACCEPTED: "bg-green-100 text-green-800 border-green-200",
    INITIATED: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };

  const defaultStyle = "bg-gray-100 text-gray-800 border-gray-200";
  const selectedStyle = styles[status] || defaultStyle;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium border ${selectedStyle} ${
        size === "lg" ? "px-4 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      {status}
    </span>
  );
}
