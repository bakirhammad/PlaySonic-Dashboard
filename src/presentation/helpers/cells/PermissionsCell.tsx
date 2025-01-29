import { PermissionsEnum } from "@domain/enums/PermissionsEnum/PermissionsEnum";
import { FC } from "react";

type Props = {
  permission: number;
};

const PermissionsCell: FC<Props> = ({ permission }) => {
  const _permission = Object.keys(PermissionsEnum)
    .filter((v) => isNaN(Number(v)))
    .filter((key) => {
      return (
        PermissionsEnum[key as keyof typeof PermissionsEnum] & permission
      );
    });

  return (
    <div className="d-flex align-items-center w-150px">
      <div className="d-flex flex-wrap gap-2">
        {_permission.map((permission, index) => (
          <span className="badge text-bg-secondary fw-bolder" key={index}>
            {permission}
          </span>
        ))}
      </div>
    </div>
  );
};

export { PermissionsCell };
