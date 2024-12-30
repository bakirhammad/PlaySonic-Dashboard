import CustomTestExpander from "@presentation/components/CustomTestExpander";
import { FC } from "react";

type Props = {
  data: string | number | boolean | string[];
};

const CustomCell: FC<Props> = ({ data }) => (
  <>
    <div className="d-flex align-items-center">
      <div className="d-flex flex-column">
        <span className="text-gray-800 text-hover-primary mb-1">
          {data && typeof data === "string" && data.length > 40 ? (
            <CustomTestExpander
              className="text-gray-800 text-hover-primary mb-1 max-w-200px"
              collapsedNumWords={40}
            >
              {data}
            </CustomTestExpander>
          ) : (
            <span className="text-gray-800 text-hover-primary mb-1">
              {data}
            </span>
          )}
        </span>
      </div>
    </div>
  </>
);

export { CustomCell };
