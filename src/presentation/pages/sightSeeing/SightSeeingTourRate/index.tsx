import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import {
  SightSeeingTourRateCommandInstance,
  SightSeeingTourRateQueryInstance,
} from "@app/index";
import { useQuery, useQueryClient } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import { SightSeeingTourRateListColumns } from "./components/CreateSightSeeingTourRateColumns";
import { CreateSightSeeingTourRateModalForm } from "./components/CreateSightSeeingTourRateModalForm";
import {
  CustomKTIcon,
  CustomTable,
  CustomToast,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { SightSeeingTourRateUrlEnum } from "@domain/enums";
import SightSeeingTourRateFilter from "./components/SightSeeingTourRateFilter";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";

const SightSeeingTourRateList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();
  const intl = useIntl();
  const columns = useMemo(() => SightSeeingTourRateListColumns, []);
  const { sightSeeingSupplierId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: SightSeeingTourRateData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.SightSeeingTourRateList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      const id = `SightSeeingSupplierId=${sightSeeingSupplierId}`;
      return SightSeeingTourRateQueryInstance.getSightSeeingTourRateList(
        `${
          SightSeeingTourRateUrlEnum.GetSightSeeingTourRateList +
          id +
          searchQuery
        }`
      );
    },
  });

  useEffect(() => {
    updateData(SightSeeingTourRateData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [SightSeeingTourRateData, isFetching, isLoading, error]);

  const tableData = useMemo(
    () => SightSeeingTourRateData?.data,
    [SightSeeingTourRateData]
  );

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data =
          await SightSeeingTourRateCommandInstance.multipleDeleteSightSeeingTourRate(
            SightSeeingTourRateUrlEnum.MultipleDeleteSightSeeingTourRate,
            selected
          );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.SightSeeingTourRateList]);
          clearSelected();
          CustomToast(`Deleted successfully`, "success");
        }
      } catch (error) {
        console.error("Error when delete sightSeeing Tour Rate", error);
        CustomToast(`Failed to Delete sightSeeing  Tour Rate `, "error");
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
          searchPlaceholder="SEARCH-SIGHT-SEEING-TOUR-RATE"
          filterBtn={true}
          FilterComponent={
            <SightSeeingTourRateFilter></SightSeeingTourRateFilter>
          }
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD-SIGHT-SEEING-TOUR-RATE-BUTTON"
        >
          <button
            onClick={() => {
              navigate("history");
            }}
            type="button"
            className="btn btn-light-primary flex-grow-1 "
          >
            <CustomKTIcon iconName="document" className="fs-2" />
            {intl.formatMessage({ id: "HISTORY" })}
          </button>
        </CustomTableToolbar>
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xxl"
          modalTitle="SIGHT-SEEING-TOUR-RATE-CREATE-MODAL-TITLE"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateSightSeeingTourRateModalForm
            sightSeeingSupplierId={sightSeeingSupplierId}
          />
        </CustomModal>
      )}
    </>
  );
};

function SightSeeingTourRateListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <SightSeeingTourRateList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default SightSeeingTourRateListWrapper;
