// Whether the signed-in user may do an action on a page (PermissionProvider
// is plain JS, so its shape is described here).
import { usePermissions } from "../../services/PermissionProvider";

interface PermissionsLike {
  isSuperadmin?: boolean;
  can?: (page: string, action?: string) => boolean;
}

export const usePageAccess = (page: string, action = "view"): boolean => {
  const perms = usePermissions() as PermissionsLike | null;
  return Boolean(perms?.isSuperadmin || perms?.can?.(page, action));
};
