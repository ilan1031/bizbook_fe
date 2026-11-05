// Shapes of GET /api/v1/user/me as the permission code reads them.

export interface CatalogPage {
  key: string;
  label?: string;
  routes: string[];
  [key: string]: any;
}

export interface Me {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  is_superadmin?: boolean;
  catalog?: CatalogPage[];
  permissions?: Record<string, string[]>;
  planned_routes?: string[];
  always_allowed_routes?: string[];
  shared_routes?: string[];
  [key: string]: any;
}

export type PermissionAction = "view" | "create" | "edit" | "delete" | string;

export interface PermissionHelpers {
  isSuperadmin: boolean;
  hasAnyPage: boolean;
  can: (pageKey: string, action?: PermissionAction) => boolean;
  pageForPath: (path: string) => CatalogPage | null;
  canAccessPath: (path: string) => boolean;
  firstAllowedRoute: () => string | null;
}

export interface PermissionState {
  me: Me | null;
  loading: boolean;
  error: any;
  token: string | null;
}

export interface PermissionContextValue extends PermissionState, PermissionHelpers {
  reload: (opts?: { silent?: boolean }) => Promise<Me | null>;
  adoptToken: (token: string | null | undefined) => void;
}
