export type Crud = "view" | "create" | "edit" | "delete";

export type PermissionMap = Record<
  string,
  {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  }
>;
