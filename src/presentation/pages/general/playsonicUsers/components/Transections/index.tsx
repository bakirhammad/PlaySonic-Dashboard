import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo, useState } from "react";
import { QUERIES } from "@presentation/helpers";
import { useQuery } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import { UserTransectionsListColumns } from "./UserTransectionsListColumns";
import { useParams } from "react-router-dom";
import { CommerceQueryInstance } from "@app/useCases/commerce";
import { CommerceUrlEnum } from "@domain/enums/URL/Commerce/CommerceUrls/Commerce";
import { TransectionsActionsCell } from "@presentation/components/tables/cells/TransectionsActionsCell";
import { CustomModal } from "@presentation/components";
import { AddTransectionBalance } from "./AddTransectionBalance";
import { RemoveTransectionBalance } from "./RemoveTransectionBalance";

const UserTransections = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();
  const columns = useMemo(() => UserTransectionsListColumns, []);
  const [addOrRemove, setAddOrRemove] = useState("");
  const { userId } = useParams();

  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const {
    data: UserTransectionsData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.UserTransectionsList, [query]],
    queryFn: () => {
      return CommerceQueryInstance.getCommerceList(
        `${CommerceUrlEnum.GetCommerceList}userId=${userId}`
      );
    },
  });

  useEffect(() => {
    updateData(UserTransectionsData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [UserTransectionsData, isFetching, isLoading, error]);

  const tableData = useMemo(
    () => UserTransectionsData?.data,
    [UserTransectionsData]
  );

  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<UserTransectionsFilter></UserTransectionsFilter>}
          addBtn={false}
          addName="ADD"
          children={
            <TransectionsActionsCell
              id={userId}
              cashPaymentBtn={false}
              addBalanceBtnOnClick={() => {
                setItemIdForUpdate(userId);
                setAddOrRemove("add");
              }}
              removeBalanceBtnOnClick={() => {
                setItemIdForUpdate(userId);
                setAddOrRemove("remove");
              }}
            />
          }
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>

      {itemIdForUpdate === userId && addOrRemove === "add" && (
        <CustomModal
          modalSize="xl"
          modalTitle="ADD-BALANCE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          <AddTransectionBalance userId={userId || ""} />
        </CustomModal>
      )}

      {itemIdForUpdate === userId && addOrRemove === "remove" && (
        <CustomModal
          modalSize="xl"
          modalTitle="REMOVE-BALANCE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          <RemoveTransectionBalance userId={userId || ""} />
        </CustomModal>
      )}
    </>
  );
};

function UserTransectionsListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <UserTransections />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default UserTransectionsListWrapper;
