import { DaysEnum } from "@domain/enums/days/DaysEnum";
import { FC } from "react";

type Props = {
  days: number;
};

const DaysCell: FC<Props> = ({ days }) => {
  const _days = Object.keys(DaysEnum)
    .filter((v) => isNaN(Number(v)))
    .filter((key) => {
      return DaysEnum[key as keyof typeof DaysEnum] & days;
    });

  return (
    <div className="d-flex align-items-center w-150px">
      <div className="d-flex flex-wrap gap-2">
        {_days.map((day, index) => (
          <span className="badge text-bg-secondary fw-bolder" key={index}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

export { DaysCell };
