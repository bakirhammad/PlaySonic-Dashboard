import { TransectionTypeEnum } from "@domain/enums/TransectionsEnum/TransectionsEnum";
import { FC } from "react";

type Props = {
  type: number;
};

const TransectionTypeCell: FC<Props> = ({ type }) => {
  const _type = Object.keys(TransectionTypeEnum)
    .filter((v) => isNaN(Number(v)))
    .filter((key) => {
      return (
        TransectionTypeEnum[key as keyof typeof TransectionTypeEnum] & type
      );
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

export { TransectionTypeCell };
