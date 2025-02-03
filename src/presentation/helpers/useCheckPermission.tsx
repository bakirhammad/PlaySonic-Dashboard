import { PermissionsEnum } from "@domain/enums/PermissionsEnum/PermissionsEnum";
import { useAuthStore } from "@infrastructure/storage/AuthStore";

const useCheckPermission = (action: string) => {
  const { auth } = useAuthStore();
  const userPermissions = auth?.permissions || 0;

  const userPermissionsArray = Object.entries(PermissionsEnum)
    .filter(([_, value]) => userPermissions & Number(value))
    .map(([key, _]) => key);

  const isAllowed = userPermissionsArray.includes(action);
  return isAllowed;
};

export default useCheckPermission;
