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
import { CityQueryInstance } from "@app/useCases/general/city/query/CityQuery";
import { CityUrlEnum } from "@domain/enums/URL/General/GeneralEnum/CityEnum";
import { CityCommandInstance } from "@app/useCases/general/city/commands/CityCommand";
import { CreateCity } from "./components/CreateCity";
import { CityListColumns } from "./components/CityListColumns";

const CityList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => CityListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: CityData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.CityList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return CityQueryInstance.getCityList(
        `${CityUrlEnum.GetCityList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(CityData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [CityData, isFetching, isLoading, error]);

  const tableData = useMemo(() => CityData?.data, [CityData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await CityCommandInstance.multipleDeleteCity(
          CityUrlEnum.MultipleDeleteCity,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.CityList]);
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
          // FilterComponent={<CityFilter></CityFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-City"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateCity />
        </CustomModal>
      )}
    </>
  );
};

function CityListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <CityList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default CityListWrapper;
