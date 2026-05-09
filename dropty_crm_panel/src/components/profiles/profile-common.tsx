
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ================= HELPERS ================= */

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 rounded-md bg-muted px-4 py-2 text-sm font-semibold">
        {title}
      </div>
      {children}
    </div>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

/* ================= FLOATING INPUT ================= */

export function FloatingInput({
  label,
  value,
  disabled,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="relative">
      <Input
        type={type}
        value={value ?? ""}
        disabled={disabled}
        placeholder=" "
        className="peer h-12"
        onChange={(e) => onChange?.(e.target.value)}
      />

      <label
        className={cn(
          "absolute left-3 top-3 bg-white px-1 text-sm font-semibold text-zinc-800 transition-all pointer-events-none",
          "peer-focus:-top-2 peer-focus:text-xs",
          "peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs"
        )}
      >
        {label}
      </label>
    </div>
  );
}

/* ================= FLOATING SELECT ================= */

export function FloatingSelect({
  label,
  value,
  disabled,
  onChange,
  options,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const hasValue = Boolean(value);

  return (
    <div className="relative w-full">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="peer h-12 w-full px-3">
          <SelectValue placeholder="" />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label
        className={cn(
          "absolute left-3 bg-white px-1 text-sm font-semibold text-zinc-800 transition-all pointer-events-none",
           hasValue ? "-top-2 text-xs" : "top-3",
          "peer-focus:-top-2 peer-focus:text-xs"
        )}
      >
        {label}
      </label>
    </div>
  );
}
