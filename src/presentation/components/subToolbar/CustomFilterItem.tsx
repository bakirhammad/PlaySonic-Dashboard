import { WithChildren } from "@presentation/helpers/react18MigrationHelpers";
import { FC } from "react";

interface Props {
  title?: string;
}

const CustomFilterItem: FC<Props & WithChildren> = ({ children, title }) => {
  return (
    <>
      <div className="px-7 py-5">
        <div className="fs-6 fw-bold mb-1">{!!title && title}</div>
        {children}
      </div>
    </>
  );
};

export { CustomFilterItem };
