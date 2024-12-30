import { FC, useEffect } from "react";
import { useIntl } from "react-intl";
import { MenuComponent } from "../../../../assets/ts/components";
import { CustomKTIcon } from "../..";
import { WithChildren } from "@presentation/helpers/react18MigrationHelpers";
import { useLocaleFormate } from "@presentation/hooks";
import { Link, useNavigate } from "react-router-dom";

interface IPages {
  title: string;
  path: string;
}

type Props = {
  label: string;
  pages: IPages[];
};

const CustomPagesActionsCell: FC<Props & WithChildren> = ({
  pages,
  label,
  children,
}) => {
  const intl = useIntl();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="dropdown">
      <a
        href="#"
        className="btn btn-light-primary btn-active-primary btn-sm dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {intl.formatMessage({ id: label })}
        <CustomKTIcon iconName="down" className="fs-5 m-0" />
      </a>
      <ul className="dropdown-menu">
        {pages?.map((page, index) => (
          <li
            key={index}
            className="menu-link px-3 d-flex flex-row column-gap-2 text-break cursor-pointer"
          >
            <span
              className="dropdown-item"
              onClick={() => {
                navigate(page.path);
              }}
            >
              <span className="text-break">{useLocaleFormate(page.title)}</span>
            </span>
          </li>
        ))}
        {children && <li>{children}</li>}
      </ul>
    </div>
  );
};

export { CustomPagesActionsCell };
