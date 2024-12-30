/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkupApplayConditions } from "@domain/enums/sellRulesEnums";
import { FC } from "react";

type Props = {
  markupType: any;
};

const MarkupTypeCell: FC<Props> = ({ markupType }) => {
  const _channels = Object.keys(MarkupApplayConditions)
    .filter((v) => isNaN(Number(v)))
    .filter((key) => {
      return (
        MarkupApplayConditions[key as keyof typeof MarkupApplayConditions] & markupType
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

export { MarkupTypeCell };
