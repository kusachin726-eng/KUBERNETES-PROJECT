"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export type DropdownOption = {
  label: string;
  value: string;
};

type TableDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  width?: string;
};

export function TableDropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  width = "w-[180px]",
}: TableDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={width}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
