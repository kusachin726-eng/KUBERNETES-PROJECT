/* ================= PERMISSION ================= */

export type RoleFeaturePermission = {
  permissionId: number;
  featureId: number;
  featureTitle: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

/* ================= ROLE ================= */

export type RolePermission = {
  roleId: number;
  roleTitle: string;
  isActive: boolean;
  createdAt: string;
  permissions: RoleFeaturePermission[];
};

/* ================= API RESPONSE ================= */


export type GetRolePermissionApiResponse = {
  success: boolean;
  data: {
    count: number;
    rows: RolePermission[];
  };
};

/* ================= UPDATE PAYLOAD ================= */

export type UpdateRolePermissionFeature = {
  featureId: number;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export type UpdateRolePermissionPayload = {
  roleId: number;
  permissionData: UpdateRolePermissionFeature[];
};

export type UpdateRolePermissionResponse = {
  success: boolean;
  message: string;
};

// For Delete Payload
export type DeleteRolePayload = {
  roleId: number;
  title: string;
  isActive: boolean;
};

