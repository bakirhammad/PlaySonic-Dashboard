import { ClubAdmin, PermissionsEnum, SuberAdmin } from "@domain/enums/PermissionsEnum/PermissionsEnum";

export interface IRolesOptionsDDL {
  value: number;
  label: string;
}
export const PermissionsEnumOptions: IRolesOptionsDDL[] = Object.keys(PermissionsEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: PermissionsEnum[key as keyof typeof PermissionsEnum],
    label: key,
  }));

export const SuberAdminEnumOptions: IRolesOptionsDDL[] = Object.keys(SuberAdmin)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: SuberAdmin[key as keyof typeof SuberAdmin],
    label: key,
  }));
  
export const ClubAdminEnumOptions: IRolesOptionsDDL[] = Object.keys(ClubAdmin)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: ClubAdmin[key as keyof typeof ClubAdmin],
    label: key,
  }));