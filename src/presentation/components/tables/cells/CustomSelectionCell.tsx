import { FC, useMemo } from "react";
import { useListView } from "../../../context/manageListConext/ListViewProvider";
import { ID } from "../../../helpers";

type Props = {
  id: ID;
  rowNumber?: number | null;
};

const CustomSelectionCell: FC<Props> = ({ id, rowNumber }) => {
  const { selected, onSelect } = useListView();
  const isSelected = useMemo(
    () => (id ? selected.includes(id) : undefined),
    [id, selected]
  );
  return (
    // <div className="form-check form-check-custom form-check-solid">
    //   <div>{rowNumber}</div>
    //   <input
    //     className="form-check-input"
    //     type="checkbox"
    //     data-kt-check={isSelected}
    //     data-kt-check-target="#kt_table_users .form-check-input"
    //     checked={isSelected}
    //     onChange={() => onSelect(id)}
    //   />
    // </div>
    <></>
  );
};

export { CustomSelectionCell };
