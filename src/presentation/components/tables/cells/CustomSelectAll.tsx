/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, PropsWithChildren } from "react";
import { HeaderProps } from "react-table";
import { useListView } from "../../../context/manageListConext/ListViewProvider";

type Props = {
  tableProps: PropsWithChildren<HeaderProps<any>> | any;
};

const CustomSelectAll: FC<Props> = ({ tableProps }) => {
  const { isAllSelected, onSelectAll } = useListView();
  const { key, ...restProps } = tableProps.column.getHeaderProps();
  return (
    // <div {...restProps} key={key} className="w-10px pe-2">
    //   <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
    //     <input
    //       className="form-check-input"
    //       type="checkbox"
    //       data-kt-check={isAllSelected}
    //       data-kt-check-target="#kt_table_users .form-check-input"
    //       checked={isAllSelected}
    //       onChange={onSelectAll}
    //     />
    //   </div>
    // </div>
    <></>
  );
};

export { CustomSelectAll };
