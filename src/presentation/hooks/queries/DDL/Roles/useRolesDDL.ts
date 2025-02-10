/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { IRolesBody } from "@domain/entities/general/Roles/Roles";
import { RoleUrlEnum } from "@domain/enums/URL/General/GeneralEnum/RolesEnum";
import { RolesQueryInstance } from "@app/useCases/general/roles";
import { IDDlOption } from "@domain/entities";

function useRolesDDL() {
  const [RolesList, setRoles] = useState<IRolesBody>();
  const [RolesOption, setRolesOption] = useState<IDDlOption[]>([]);
  const [isLoading, setIsLoadingRoles] = useState<boolean>(false);

  const fetchRoles = useCallback(async () => {
    try {
      setIsLoadingRoles(true);
      const RolesListRes = await RolesQueryInstance.getRolesList(
        RoleUrlEnum.GetRoleList
      );
      const _RolesOption = RolesListRes?.data?.map((Role) => {
        return {
          value: Role.id,
          label: Role.name || "NA",
        };
      });
      setRolesOption(_RolesOption?.length ? _RolesOption : []);
      setRoles(RolesListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);
  return { RolesList, isRoleLoading: isLoading, RolesOption };
}

export { useRolesDDL };
