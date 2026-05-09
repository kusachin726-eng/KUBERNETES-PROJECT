export type PermissionAction = "view" | "add" | "modify" | "delete";

export type UIPermissionRow = {
  module: string;
  permissions: Record<PermissionAction, boolean>;
};

export type UIRole = {
  title: string;
  permissions: UIPermissionRow[];
};
