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
import { ClubCommandInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import { ReservationQueryInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import { ReservationListColumns } from "./components/ReservationListColumns";
import { CreateReservationForm } from "./components/CreateMyReservationForm";
import ReservaionFilter from "./components/ReservaionFilter";

const MyReservations = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => ReservationListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: ReservationData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.ReservationList, [query]],
    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return ReservationQueryInstance.getReservationList(
        `${ReservationUrlEnum.GetReservationList + searchQuery}`
      );
    },
  });

  console.log(ReservationData)
  useEffect(() => {
    updateData(ReservationData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [ReservationData, isFetching, isLoading, error]);

  const tableData = useMemo(() => ReservationData?.data, [ReservationData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await ClubCommandInstance.multipleDeleteClub(
          ClubUrlEnum.MultipleDeleteClub,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.ClubList]);
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
           FilterComponent={<ReservaionFilter/>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={false}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Club"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateReservationForm />
        </CustomModal>
      )}
    </>
  );
};

function MyReservationsWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <MyReservations />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default MyReservationsWrapper;