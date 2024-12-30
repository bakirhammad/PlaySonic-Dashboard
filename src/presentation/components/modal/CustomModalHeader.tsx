import { useListView } from "../../context/manageListConext/ListViewProvider";
import { FC } from "react";
import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";
import { CustomKTIcon } from "..";

type Title = {
  modalHeader: string;
};

const CustomModalHeader: FC<Title> = ({ modalHeader }) => {
  const { setItemIdForUpdate } = useListView();

  return (
    <div className="modal-header ">
      <h2 className="fw-bolder m-0">{useLocaleFormate(modalHeader)}</h2>
      <div
        className="btn btn-icon btn-sm btn-active-icon-primary"
        data-kt-users-modal-action="close"
        onClick={() => setItemIdForUpdate(undefined)}
        style={{ cursor: "pointer" }}
      >
        <CustomKTIcon iconName="cross" className="fs-1" />
      </div>
    </div>
  );
};

export { CustomModalHeader };
