import { useLocaleFormate } from "@presentation/hooks/index";
import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  path: string;
}
export const ActionNestedPageItem: FC<Props> = ({ title = "", path }) => {
  return (
    <Link
      to={path}
      className="btn btn-light-primary btn-active-primary btn-sm"
      data-kt-menu-trigger="click"
      data-kt-menu-placement="bottom-end"
    >
      {useLocaleFormate(title)}
    </Link>
  );
};
{
  /* <Link
to={`/apps/general/createcity/${props.data[props.row.index]?.id}`}
className="btn btn-light-primary btn-active-primary btn-sm fw-semibold fs-6 me-2"
>
manage cities
<button
  type="button"
  className="btn btn-icon btn-sm h-auto btn-color-gray-500 btn-active-color-primary justify-content-end"
>
  <CustomKTIcon iconName="exit-right-corner" className="fs-2" />
</button>
</Link> */
}
