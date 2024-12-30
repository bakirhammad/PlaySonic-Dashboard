import { CustomKTIcon } from "@presentation/helpers/index";
import { useLocaleFormate } from "@presentation/hooks/index";
import clsx from "clsx";
import { FC } from "react";

interface Props {
  icon?: string;
  title: string;
  onClick?: () => void;
  className?: string;
  iconSize?: "fs-1" | "fs-2" | "fs-3" | "fs-4" | "fs-5" | "fs-6";
}

export const ActionItem: FC<Props> = ({
  icon = "switch",
  title,
  onClick,
  className,
  iconSize,
}) => {
  return (
    <div className={clsx("menu-item px-3 ", className)}>
      <span
        className="menu-link px-3 d-flex flex-row column-gap-2 text-break"
        onClick={onClick}
      >
        <CustomKTIcon
          iconName={icon}
          className={iconSize ? iconSize : "fs-3"}
        />
        <span className={`text-break ${iconSize} `}>
          {useLocaleFormate(title)}
        </span>
      </span>
    </div>
  );
};
