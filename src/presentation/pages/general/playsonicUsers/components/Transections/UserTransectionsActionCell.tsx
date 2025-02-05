import { CustomModal } from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";
import { FC, useState } from "react";
import { useQueryClient, useQuery } from "react-query";
import { QUERIES } from "@presentation/helpers";
import { useListView } from "@presentation/context/index";
import { AddUsersUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AddUsers";
import { AddUsersQueryByIdInstance } from "@app/useCases/general/addUsers";
import { TransectionsActionsCell } from "@presentation/components/tables/cells/TransectionsActionsCell";
import { RemoveTransectionBalance } from "./RemoveTransectionBalance";
import { AddTransectionBalance } from "./AddTransectionBalance";

interface Props {
  id: number;
  name?: string;
}

const UserTransectionsActionCell: FC<Props> = ({ id }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const [addOrRemove, setAddOrRemove] = useState("");
  const queryClient = useQueryClient();

  // wait for new api users for club

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.AdminUsersList, id],
    queryFn: () => {
      return AddUsersQueryByIdInstance.getAddUsersById(
        AddUsersUrlEnum.GetUserById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get AddUsers data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  return (
    <>
      <TransectionsActionsCell
        id={id}
        addBalanceBtnOnClick={() => {
          setItemIdForUpdate(id);
          setAddOrRemove("add");
        }}
        removeBalanceBtnOnClick={() => {
          setItemIdForUpdate(id);
          setAddOrRemove("remove");
        }}
      />

      {itemIdForUpdate === id && addOrRemove === "add" && (
        <CustomModal
          modalSize="xl"
          modalTitle="ADD-BALANCE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <AddTransectionBalance isLoading={isLoading} CourtData={data} />
          )}
        </CustomModal>
      )}

      {itemIdForUpdate === id && addOrRemove === "remove" && (
        <CustomModal
          modalSize="xl"
          modalTitle="REMOVE-BALANCE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <RemoveTransectionBalance CourtData={data} isLoading={isLoading} />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { UserTransectionsActionCell };
