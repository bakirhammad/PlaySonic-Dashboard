import { FC } from "react";
import { useIntl } from "react-intl";

interface CustomStatusCellViewProps {
  status: boolean;
}

const CustomStatusCellView: FC<CustomStatusCellViewProps> = ({ status }) => {
  const intl = useIntl();
  return (
    <div className="mb-3 mx-10">
      {status ? (
        <span className="badge rounded-pill bg-success text-light">
          {intl.formatMessage({ id: "ACTIVE" })}
        </span>
      ) : (
        <span className="badge rounded-pill bg-danger text-light">
          {intl.formatMessage({ id: "INACTIVE" })}
        </span>
      )}
    </div>
  );
};

export default CustomStatusCellView;
