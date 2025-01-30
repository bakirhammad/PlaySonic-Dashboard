import { PermissionsEnum } from "@domain/enums/PermissionsEnum/PermissionsEnum";

const userPermissionEnum = 511; // Just for test ..

const CheckPermission = (action: string) => {
  const userPermissionsArray = Object.entries(PermissionsEnum)
    .filter(([_, value]) => userPermissionEnum & Number(value))
    .map(([key, _]) => key);

  const isAllowed = userPermissionsArray.includes(action);
  console.log(userPermissionsArray, "ccccccccccccccccccc", isAllowed);

  return isAllowed;
};

export default CheckPermission;
