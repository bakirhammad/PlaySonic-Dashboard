/* eslint-disable @typescript-eslint/no-explicit-any */
import { aircaftClassName } from "@domain/enums";
import { FC } from "react";

type Props = {
  cabinClass: any;
};

const ClassCell: FC<Props> = ({ cabinClass }) => {
  const _channels = Object.keys(aircaftClassName)
    .filter((v) => isNaN(Number(v)))
    .filter((key) => {
      return (
        aircaftClassName[key as keyof typeof aircaftClassName] & cabinClass
      );
    });

  return (
    <div className="d-flex align-items-center w-150px">
      <div className="d-flex flex-wrap gap-2">
        {_channels.map((channel, index) => (
          <span className="badge text-bg-secondary fw-bolder" key={index}>
            {channel}
          </span>
        ))}
      </div>
    </div>
  );
};

export { ClassCell };
