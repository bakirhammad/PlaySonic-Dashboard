import { FC, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { MenuComponent } from "../../../assets/ts/components";
import { CustomKTIcon } from "..";

type Props = {
  menu_item?: string;
  menu_item_label?: string;
  className?: string;
  dropDownMenuClassName?: string;
  menuDataMain?: string[];
  showImage?: boolean;
};

const CustomDropDown: FC<Props> = ({
  menu_item_label,
  menuDataMain,
  className,
  dropDownMenuClassName,
  showImage = false,
}) => {
  const intl = useIntl();
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);
  const menuData = useMemo(() => menuDataMain, [menuDataMain]);

  return (
    <>
      <div
        className={`mb-7 btn btn-light btn-active-light-primary btn-sm fw-bold fs-6 ${className}`}
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-start"
      >
        {intl.formatMessage({ id: menu_item_label })}
        <CustomKTIcon iconName="down" className="fs-5 m-0" />
      </div>{" "}
      <div
        className={`menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fs-7 fw-bold w-200px py-3 ${dropDownMenuClassName}`}
        data-kt-menu="true"
      >
        {menuData?.map((menu_item) => (
          <li className="menu-item px-3 d-flex flex-row gap-4" key={menu_item}>
            {showImage && (
              <img
                src={menu_item}
                alt=""
                className="rounded-circle"
                width="25px"
                height="25px"
              />
            )}
            <span>{intl.formatMessage({ id: menu_item })}</span>
          </li>
        ))}
      </div>
    </>
  );
};

export { CustomDropDown };
