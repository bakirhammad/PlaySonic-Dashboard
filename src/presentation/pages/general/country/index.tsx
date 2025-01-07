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
import { CreateCountry } from "./components/CreateCountry";
import { CountryListColumns } from "./components/CountryListColumns";
import { CountryQueryInstance } from "@app/useCases/general/country/query/CountryQuery";
import { CountryUrlEnum } from "@domain/enums";
import { CountryCommandInstance } from "@app/useCases/general/country/commands/CountryCommand";

const CountryList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => CountryListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: CountryData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.CountryList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return CountryQueryInstance.getCountryList(
        `${CountryUrlEnum.GetCountryList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(CountryData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [CountryData, isFetching, isLoading, error]);

  const tableData = useMemo(() => CountryData?.data, [CountryData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await CountryCommandInstance.multipleDeleteCountry(
          CountryUrlEnum.MultipleDeleteCountry,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.CountryList]);
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
          // FilterComponent={<CountryFilter></CountryFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Country"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateCountry />
        </CustomModal>
      )}
    </>
  );
};

function CountryListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <CountryList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default CountryListWrapper;
