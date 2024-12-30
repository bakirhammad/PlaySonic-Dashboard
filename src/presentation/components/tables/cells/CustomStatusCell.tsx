import { useLocaleFormate } from "@presentation/hooks";
import clsx from "clsx";
import { FC } from "react";

type Props = {
  status:
    | "warning"
    | "primary"
    | "danger"
    | "success"
    | "light"
    | "secondary"
    | "info"
    | "dark";
  title: string;
  withTranslate?: boolean;
};

const CustomStatusCell: FC<Props> = ({
  status,
  title,
  withTranslate = false,
}) => {
  const translateTitle = withTranslate ? useLocaleFormate(title) : title;
  return (
    <>
      <span
        className={clsx(`badge badge-${status} rounded-pill text-light px-3`)}
      >
        {translateTitle}
      </span>
    </>
  );
};

export { CustomStatusCell };
