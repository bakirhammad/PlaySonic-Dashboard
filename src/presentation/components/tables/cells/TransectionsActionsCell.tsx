import { FC, useEffect } from "react";
// import { useMutation, useQueryClient } from "react-query";
// import { RemoveBalaceUser } from "../../../../services/core/_requests";
import { useIntl } from "react-intl";
// import { QUERIES, WithChildren } from "../../../../helpers";
import { MenuComponent } from "../../../../assets/ts/components";
// import { useListView } from "../core/ListViewProvider";
// import { useQueryResponse } from "../core/QueryResponseProvider";
import { ActionItem, CustomKTIcon } from "../..";
import { WithChildren } from "@presentation/helpers/react18MigrationHelpers";
// import { ICountryBody } from "@domain/entities/general/country/Country";

type Props = {
  id?: number;
  RemoveBalaceBtn?: boolean;
  addBalanceBtn?: boolean;
  addBalanceBtnOnClick?: () => void;
  removeBalanceBtnOnClick?: () => void;
  title?: string;
};

const TransectionsActionsCell: FC<Props & WithChildren> = ({
  id,
  RemoveBalaceBtn = true,
  addBalanceBtn = true,
  children,
  addBalanceBtnOnClick,
  removeBalanceBtnOnClick,
  title,
}) => {
  const intl = useIntl();

  // const { setItemIdForUpdate } = useListView();
  // const { query } = useQueryResponse();
  // const queryClient = useQueryClient();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  // const openEditModal = () => {
  //   setItemIdForUpdate(id);
  // };

  // const RemoveBalaceItem = useMutation(() => RemoveBalaceUser(id), {
  //   // 💡 response of the mutation is passed to onSuccess
  //   onSuccess: () => {
  //     // ✅ update detail view directly
  //     queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
  //   },
  // });

  return (
    <>
      <a
        href="#"
        className="btn btn-light-primary btn-active-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        {title
          ? intl.formatMessage({ id: title })
          : intl.formatMessage({ id: "ACTION" })}

        <CustomKTIcon iconName="down" className="fs-5 m-0" />
      </a>
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-auto mw-25 py-4 menu-item px-3 mh-300px overflow-y-auto"
        data-kt-menu="true"
      >
        {addBalanceBtn && (
          <ActionItem onClick={addBalanceBtnOnClick} title="Add Balance" />
        )}
        {RemoveBalaceBtn && (
          <ActionItem
            onClick={removeBalanceBtnOnClick}
            title="Remove Balance"
          />
        )}
        {children}
      </div>
    </>
  );
};

export { TransectionsActionsCell };
