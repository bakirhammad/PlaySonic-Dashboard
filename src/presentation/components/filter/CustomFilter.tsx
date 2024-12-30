import { useQueryRequest } from "@presentation/context";
import { CustomKTIcon, WithChildren } from "@presentation/helpers/index";
import { useLocaleFormate } from "@presentation/hooks/index";
import { FC } from "react";
import clsx from "clsx";

interface Props {
  menuPlacement?: string;
  iconName?: string;
  icon?: boolean;
  btnClassName?: string;
}

const CustomFilter: FC<Props & WithChildren> = ({
  menuPlacement = "bottom-end",
  iconName = "filter",
  icon = true,
  children,
  btnClassName,
}) => {
  const { isLoading } = useQueryRequest();

  return (
    <>
      <button
        disabled={isLoading}
        type="button"
        className={clsx(
          btnClassName ? btnClassName : "btn btn-light-primary flex-grow-1"
        )}
        data-kt-menu-trigger="click"
        data-kt-menu-placement={menuPlacement}
      >
        {icon && <CustomKTIcon iconName={iconName} className="fs-2" />}
        {useLocaleFormate("FILTER")}
      </button>
      <div
        className="menu menu-sub menu-sub-dropdown w-sm-50 w-50 w-md-50 w-md-25"
        data-kt-menu="true"
      >
        {children}
      </div>
    </>
  );
};

export { CustomFilter };
