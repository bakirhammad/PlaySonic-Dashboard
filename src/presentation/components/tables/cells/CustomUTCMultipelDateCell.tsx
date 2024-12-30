import { formatFromUtcToLocale } from "@presentation/helpers/DateFormater/formatDate";
import { FC } from "react";

type Props = {
  fromDate: Date | string;
  toDate: Date | string;
  fullDate?: boolean;
};

const CustomUTCMultipelDateCell: FC<Props> = ({
  fromDate,
  toDate,
  fullDate = false,
}) => (
  <div className="custom-date-cell d-flex justify-content-center align-items-center mb-5">
    <div className="badge badge-light d-flex align-items-center rounded-pill px-4 py-2">
      <span className="date-text text-gray-800">
        {fullDate
          ? `${formatFromUtcToLocale(
              fromDate,
              "YYYY-MM-DD HH:mm"
            )}   —    ${formatFromUtcToLocale(toDate, "YYYY-MM-DD HH:mm")}`
          : `${formatFromUtcToLocale(
              fromDate,
              "YYYY-MM-DD"
            )}  —   ${formatFromUtcToLocale(toDate, "YYYY-MM-DD")}`}
      </span>
    </div>
  </div>
);

export { CustomUTCMultipelDateCell };
