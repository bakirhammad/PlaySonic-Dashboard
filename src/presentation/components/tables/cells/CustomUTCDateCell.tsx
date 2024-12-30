import { formatFromUtcToLocale } from "@presentation/helpers/DateFormater/formatDate";
import { FC } from "react";

type Props = {
  utcDate: Date | string;
  fullDate?: boolean;
};

const CustomUTCDateCell: FC<Props> = ({ utcDate, fullDate = false }) => (
  <div className="d-flex align-items-center  rounded-pill text-light">
    <div className="d-flex flex-row">
      <span className="text-gray-800 text-hover-primary mb-1  badge badge-light  text-center ">
        {fullDate
          ? formatFromUtcToLocale(utcDate, "YYYY-MM-DD HH:mm")
          : formatFromUtcToLocale(utcDate, "YYYY-MM-DD")}
      </span>
    </div>
  </div>
);

export { CustomUTCDateCell };
