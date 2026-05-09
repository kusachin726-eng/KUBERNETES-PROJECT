
import { Section, Grid, FloatingInput, FloatingSelect } from "./profile-common";
import { ProfileData } from "./types";

interface GeneralFormProps {
  data: ProfileData;
  onChange: (key: keyof ProfileData, value: any) => void;
  editMode: boolean;
}

export function GeneralForm({ data, onChange, editMode }: GeneralFormProps) {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* ================= BASIC INFORMATION ================= */}
      <Section title="Basic Information">
        <Grid>
          <FloatingInput
            label="First Name"
            value={data.firstName}
            disabled={!editMode}
            onChange={(v) => onChange("firstName", v)}
          />

          <FloatingInput
            label="Last Name"
            value={data.lastName}
            disabled={!editMode}
            onChange={(v) => onChange("lastName", v)}
          />

          <FloatingInput
            label="Email"
            value={data.email}
            disabled
          />

          <FloatingInput
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
            label="Mobile Number"
            value={data.mobile || ""}
            disabled
            onChange={(v) => onChange("mobile", v)}
          />

          <FloatingInput
            label="Country"
            value={data.country || ""}
            disabled={!editMode}
            onChange={(v) => onChange("country", v)}
          />

          <FloatingInput
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
    </div>
  );
}
