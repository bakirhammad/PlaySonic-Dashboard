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
import { useParams } from "react-router-dom";
import { CommerceQueryInstance } from "@app/useCases/commerce";
import { CommerceUrlEnum } from "@domain/enums/URL/Commerce/CommerceUrls/Commerce";
import { TransectionsActionsCell } from "@presentation/components/tables/cells/TransectionsActionsCell";
import { CustomModal } from "@presentation/components";
import { ClubUserTransectionsListColumns } from "./ClubUserTransectionsListColumns";
import { CashPayment } from "./CashPayment";

const ClubUserTransections = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();
  const columns = useMemo(() => ClubUserTransectionsListColumns, []);
  const [addOrRemove, setAddOrRemove] = useState("");
  const { userId } = useParams();

  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const {
    data: ClubUserTransectionsData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.ClubUserTransectionsList, [query]],
    queryFn: () => {
      return CommerceQueryInstance.getCommerceList(
        `${CommerceUrlEnum.GetCommerceList}userId=${userId}`
      );
    },
  });

  useEffect(() => {
    updateData(ClubUserTransectionsData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [ClubUserTransectionsData, isFetching, isLoading, error]);

  const tableData = useMemo(
    () => ClubUserTransectionsData?.data,
    [ClubUserTransectionsData]
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
              addBalanceBtn={false}
              RemoveBalaceBtn={false}
              cashPaymentBtnOnClick={() => {
                setItemIdForUpdate(userId);
                setAddOrRemove("cash");
              }}
            />
          }
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>

      {itemIdForUpdate === userId && addOrRemove === "cash" && (
        <CustomModal
          modalSize="xl"
          modalTitle="Cash-Payment"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          <CashPayment userId={userId || ""} />
        </CustomModal>
      )}
    </>
  );
};

function ClubUserTransectionsListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <ClubUserTransections />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default ClubUserTransectionsListWrapper;
