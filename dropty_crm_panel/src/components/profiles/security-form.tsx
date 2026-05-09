
import { Section, Grid, FloatingInput } from "./profile-common";
import { ProfileData } from "./types";

interface SecurityFormProps {
  data: ProfileData;
  onChange: (key: keyof ProfileData, value: any) => void;
  editMode: boolean;
}

export function SecurityForm({ data, onChange, editMode }: SecurityFormProps) {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Section title="Change Password">
        <Grid>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
             <p className="mb-4 text-sm text-zinc-500">
               If you want to change your password, please enter a new password below. Leave blank to keep current password.
             </p>
          </div>

          <FloatingInput
            label="New Password"
            type="password"
            value={data.newPassword || ""}
            disabled={!editMode}
            onChange={(v) => onChange("newPassword", v)}
          />

          <FloatingInput
            label="Confirm Password"
            type="password"
            value={data.confirmPassword || ""}
            disabled={!editMode}
            onChange={(v) => onChange("confirmPassword", v)}
          />
        </Grid>
      </Section>
    </div>
  );
}
