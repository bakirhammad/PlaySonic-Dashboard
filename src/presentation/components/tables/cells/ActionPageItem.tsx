import { useLocaleFormate } from "@presentation/hooks/index";
import { FC } from "react";

interface Props {
  title: string;
  onClick: () => void;
}
export const ActionPageItem: FC<Props> = ({ title = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className="btn btn-light-primary btn-active-primary btn-sm"
      data-kt-menu-trigger="click"
      data-kt-menu-placement="bottom-end"
    >
      {useLocaleFormate(title)}
    </div>
  );
};
