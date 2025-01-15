import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import { useQuery, useQueryClient } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import {
  CustomToast,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import {
  CourtCommandInstance,
  CourtQueryByIdInstance,
} from "@app/useCases/court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { CourtListColumns } from "./CourtListColumns";
import { useParams } from "react-router-dom";
import { CreateMyReservationForm } from "./CreateMyReservationForm";

const ViewCourt = () => {
  const { updateData, setIsLoading, setError } = useQueryRequest();
  const { id } = useParams();
  const courtId = Number(id);
  const columns = useMemo(() => CourtListColumns, []);

  const queryClient = useQueryClient();
  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: CourtData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.CourtList, id],
    queryFn: () => {
      return CourtQueryByIdInstance.getCourtById(
        CourtUrlEnum.GetCourtById,
        courtId
      );
    },
  });
  console.log(courtId, CourtData);
  useEffect(() => {
    updateData(CourtData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [CourtData, isFetching, isLoading, error]);

  const tableData = useMemo(() => (CourtData ? [CourtData] : []), [CourtData]);
  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await CourtCommandInstance.multipleDeleteCourt(
          CourtUrlEnum.MultipleDeleteCourt,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.CourtList]);
          clearSelected();
          CustomToast(`Deleted successfully`, "success");
        }
      } catch (error) {
        console.error("Error when delete Sightseeing Tour", error);
        CustomToast(`Failed to Delete Sightseeing  Tour `, "error");
      }
    }
  };

  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<ClubFilter></ClubFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD-Reservation"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Club"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateMyReservationForm courtId={CourtData?.id || 0} />
        </CustomModal>
      )}
    </>
  );
};

function ViewCourtWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <ViewCourt />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default ViewCourtWrapper;
