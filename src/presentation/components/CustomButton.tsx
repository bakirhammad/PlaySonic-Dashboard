import clsx from "clsx";
import React, { FC } from "react";
import { CustomKTIcon, WithChildren } from "../helpers";
import { useLocaleFormate } from "../hooks/localization/useLocaleFormate";

interface Props extends React.HTMLAttributes<HTMLButtonElement>, WithChildren {
  className?: string;
  text: string;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  icon?: boolean;
  iconName?: string;
  extraText?: string | number;
}

export const CustomButton: FC<Props> = ({
  className,
  text,
  disabled = false,
  children,
  type = "button",
  icon = false,
  iconName = "",
  extraText = "",
  ...buttonProps
}) => {
  return (
    <button
      type={type}
      className={clsx(className ? className : "btn btn-light-primary")}
      disabled={disabled}
      {...buttonProps}
    >
      {icon && <CustomKTIcon iconName={iconName} className="fs-2" />}

      {useLocaleFormate(text) + " "}
      {extraText}
      {children}
    </button>
  );
};
