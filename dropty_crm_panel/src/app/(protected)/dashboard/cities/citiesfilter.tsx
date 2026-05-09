"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CitiesFiltersProps {
  city?: string;
  setCity: (value: string) => void;

   state?: string;
  setState: (value: string) => void;

   pincode?: string;
  setPincode: (value: string) => void;

   countryCode?: string;
  setCountryCode: (value: string) => void;

  status?: string;
  setStatus: (value: string) => void;


}
export default function CitiesFilters({
  city,
  setCity,
  state,
  setState,
  status,
  setStatus,
  pincode,
  setPincode,
  countryCode,
  setCountryCode,

}: CitiesFiltersProps) {
  return (
    <>
      {/* City Filter */}
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Cities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Cities</SelectItem>
          <SelectItem value="Delhi">Delhi</SelectItem>
          <SelectItem value="Mumbai">Mumbai</SelectItem>
          <SelectItem value="Bangalore">Bangalore</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
     
      <Select value={status} onValueChange={setState}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">States</SelectItem>
          <SelectItem value="bihar">Bihar</SelectItem>
          <SelectItem value="punjab">Punjab</SelectItem>
          <SelectItem value="maharashtra">Maharashtra</SelectItem>
          <SelectItem value="karnataka">Karnataka</SelectItem>
          <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
        </SelectContent>
      </Select>
<Select value={pincode} onValueChange={setPincode}>
  <SelectTrigger className="w-[160px]">
    <SelectValue placeholder="Pincode" />
  </SelectTrigger>
  <SelectContent>
              <SelectItem value="all">Pincode</SelectItem>

    <SelectItem value="854301">854301</SelectItem>
    <SelectItem value="110001">110001</SelectItem>
    <SelectItem value="400001">400001</SelectItem>
  </SelectContent>
</Select>

 <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
