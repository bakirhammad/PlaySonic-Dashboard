import { RoleTypesEnum } from "@domain/enums/roleTypesEnum/RoleTypesEnum";
import { FC } from "react";

type Props = {
  type: number;
};

const RoleTypeCell: FC<Props> = ({ type }) => {
  const _type = Object.keys(RoleTypesEnum)
    .filter((v) => isNaN(Number(v)))
    .filter((key) => {
      return RoleTypesEnum[key as keyof typeof RoleTypesEnum] & type;
    });

  return (
    <div className="d-flex align-items-center w-150px">
      <div className="d-flex flex-wrap gap-2">
        {_type.map((type, index) => (
          <span className="badge text-bg-secondary fw-bolder" key={index}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export { RoleTypeCell };
