import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileData } from "./types";

interface ProfileFormProps {
  data: ProfileData;
  onChange: (key: keyof ProfileData, value: any) => void;
  editMode: boolean;
  showSecurity?: boolean;
}

// export function ProfileForm({
//   data,
//   onChange,
//   editMode,
//   showSecurity = false,
// }: ProfileFormProps) {
//   return (
//     <div className="rounded-xl border bg-white p-6 space-y-8">
//       {/* ================= BASIC INFORMATION ================= */}
//       <Section title="Basic Information">
//         <Grid>
//           <FloatingInput
//             label="First Name"
//             value={data.firstName}
//             disabled={!editMode}
//             onChange={(v) => onChange("firstName", v)}
//           />

//           <FloatingInput
//             label="Last Name"
//             value={data.lastName}
//             disabled={!editMode}
//             onChange={(v) => onChange("lastName", v)}
//           />

//           <FloatingInput label="Email" value={data.email} disabled />

//           <FloatingInput
//             label="Date of Birth"
//             type="date"
//             value={data.dateOfBirth || ""}
//             disabled={!editMode}
//             onChange={(v) => onChange("dateOfBirth", v)}
//           />
//         </Grid>
//       </Section>

//       {/* ================= CONTACT DETAILS ================= */}
//       <Section title="Contact Details">
//         <Grid>
//           <FloatingInput
//             label="Mobile Number"
//             value={data.mobile || ""}
//             disabled
//             onChange={(v) => onChange("mobile", v)}
//           />

//           <FloatingInput
//             label="Country"
//             value={data.country || ""}
//             disabled={!editMode}
//             onChange={(v) => onChange("country", v)}
//           />

//           <FloatingInput
//             label="City"
//             value={data.city || ""}
//             disabled={!editMode}
//             onChange={(v) => onChange("city", v)}
//           />
//         </Grid>
//       </Section>

//       {/* ================= PERSONAL INFO ================= */}
//       <Section title="Personal Info">
//         <Grid>
//           {editMode ? (
//             <FloatingSelect
//               label="Gender"
//               value={data.gender || ""}
//               onChange={(v) => onChange("gender", v)}
//               options={[
//                 { label: "Male", value: "male" },
//                 { label: "Female", value: "female" },
//                 { label: "Other", value: "other" },
//               ]}
//             />
//           ) : (
//             <FloatingInput
//               label="Gender"
//               value={
//                 data.gender
//                   ? data.gender.charAt(0).toUpperCase() +
//                     data.gender.slice(1)
//                   : ""
//               }
//               disabled
//             />
//           )}
//         </Grid>
//       </Section>

//       {/* ================= PASSWORD SETTINGS ================= */}
//       {showSecurity && editMode && (
//         <Section title="Password Settings">
//           <Grid>
//             <FloatingInput
//               label="New Password"
//               type="password"
//               value={data.newPassword || ""}
//               disabled={!editMode}
//               onChange={(v) => onChange("newPassword", v)}
//             />

//             <FloatingInput
//               label="Confirm Password"
//               type="password"
//               value={data.confirmPassword || ""}
//               disabled={!editMode}
//               onChange={(v) => onChange("confirmPassword", v)}
//             />
//           </Grid>
//         </Section>
//       )}
//     </div>
//   );
// }
export function ProfileForm({
  data,
  onChange,
  editMode,
  showSecurity = false,
}: ProfileFormProps) {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-8">
      {/* ================= BASIC INFORMATION ================= */}
      <Section title="Basic Information">
        <Grid>
          <FloatingInput
            key="firstName"
            label="First Name"
            value={data.firstName}
            disabled={!editMode}
            onChange={(v) => onChange("firstName", v)}
          />

          <FloatingInput
            key="lastName"
            label="Last Name"
            value={data.lastName}
            disabled={!editMode}
            onChange={(v) => onChange("lastName", v)}
          />

          <FloatingInput
            key="email"
            label="Email"
            value={data.email}
            disabled
          />

          <FloatingInput
            key="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={data.dateOfBirth || ""}
            disabled={!editMode}
            onChange={(v) => onChange("dateOfBirth", v)}
          />
        </Grid>
      </Section>

      {/* ================= CONTACT DETAILS ================= */}
      <Section title="Contact Details">
        <Grid>
          <FloatingInput
            key="mobile"
            label="Mobile Number"
            value={data.mobile || ""}
            disabled
            onChange={(v) => onChange("mobile", v)}
          />

          <FloatingInput
            key="country"
            label="Country"
            value={data.country || ""}
            disabled={!editMode}
            onChange={(v) => onChange("country", v)}
          />

          <FloatingInput
            key="city"
            label="City"
            value={data.city || ""}
            disabled={!editMode}
            onChange={(v) => onChange("city", v)}
          />
        </Grid>
      </Section>

      {/* ================= PERSONAL INFO ================= */}
      <Section title="Personal Info">
        <Grid>
          {editMode ? (
            <FloatingSelect
              key="gender-select"
              label="Gender"
              value={data.gender || ""}
              onChange={(v) => onChange("gender", v)}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />
          ) : (
            <FloatingInput
              key="gender-view"
              label="Gender"
              value={
                data.gender
                  ? data.gender.charAt(0).toUpperCase() +
                    data.gender.slice(1)
                  : ""
              }
              disabled
            />
          )}
        </Grid>
      </Section>

      {/* ================= PASSWORD SETTINGS ================= */}
      {showSecurity && editMode && (
        <Section title="Password Settings">
          <Grid>
            <FloatingInput
              key="newPassword"
              label="New Password"
              type="password"
              value={data.newPassword || ""}
              disabled={!editMode}
              onChange={(v) => onChange("newPassword", v)}
            />

            <FloatingInput
              key="confirmPassword"
              label="Confirm Password"
              type="password"
              value={data.confirmPassword || ""}
              disabled={!editMode}
              onChange={(v) => onChange("confirmPassword", v)}
            />
          </Grid>
        </Section>
      )}
    </div>
  );
}


/* ================= HELPERS ================= */

function Section({
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

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
  );
}

/* ================= FLOATING INPUT ================= */

function FloatingInput({
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
        className="
          absolute left-3 top-3
          bg-white px-1
          text-sm font-semibold text-zinc-800
          transition-all
          peer-focus:-top-2 peer-focus:text-xs
          peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs
        "
      >
        {label}
      </label>
    </div>
  );
}

/* ================= FLOATING SELECT ================= */

function FloatingSelect({
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
        className={`
          absolute left-3
          bg-white px-1
          text-sm font-semibold text-zinc-800
          transition-all
          ${hasValue ? "-top-2 text-xs" : "top-3"}
          peer-focus:-top-2 peer-focus:text-xs
        `}
      >
        {label}
      </label>
    </div>
  );
}
