export type DetailField = {
  label: string;
  value: string | null | undefined;
  status?: "active" | "inactive";
  onToggleStatus?: (next: boolean) => Promise<void> | void;
};
