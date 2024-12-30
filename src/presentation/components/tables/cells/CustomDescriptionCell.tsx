import CustomTestExpander from "@presentation/components/CustomTestExpander";
import { FC } from "react";

type Props = {
  data: string;
};

const CustomDescriptionCell: FC<Props> = ({ data }) => (
  <div className="d-flex align-items-center text-break  mw-450px">
    <div className="d-flex flex-column">
      {data && data.length > 40 ? (
        <CustomTestExpander
          className="text-gray-800 text-hover-primary mb-1"
          collapsedNumWords={40}
        >
          {data}
        </CustomTestExpander>
      ) : (
        <div
          className="text-gray-800 text-hover-primary mb-1"
          dangerouslySetInnerHTML={{ __html: data }}
        />
      )}
    </div>
  </div>
);

export { CustomDescriptionCell };
