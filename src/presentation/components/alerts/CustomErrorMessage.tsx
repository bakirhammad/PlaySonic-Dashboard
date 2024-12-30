import clsx from "clsx";
import { FC } from "react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  additionalClassName?: string;
}

const CustomErrorMessage: FC<Props> = ({ error, additionalClassName }) => {
  return (
    <>
      <div
        className={clsx(
          "mb-lg-15 alert alert-danger",
          additionalClassName && additionalClassName
        )}
      >
        <div className="alert-text font-weight-bold"> {error}</div>
      </div>
    </>
  );
};

export { CustomErrorMessage };
