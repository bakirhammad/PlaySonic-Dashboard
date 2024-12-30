import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import {
  SightSeeingSupplierCommandInstance,
  SightSeeingSupplierQueryInstance,
} from "@app/index";

import { useQuery, useQueryClient } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";

import { SightSeeingSupplierListColumns } from "./components/CreateSightSeeingSupplierColumns";

import { CreateSightSeeingSupplierModalForm } from "./components/CreateSightSeeingSupplierModalForm";
import {
  CustomToast,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { SightSeeingSupplierUrlEnum } from "@domain/enums";

import { SightSeeingSupplierFilter } from "./components/SightSeeingSupplierFilter";

const SightSeeingSupplierList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => SightSeeingSupplierListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: SightSeeingSupplierData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.SightSeeingSupplierList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return SightSeeingSupplierQueryInstance.getSightSeeingSupplierList(
        `${SightSeeingSupplierUrlEnum.GetSightSeeingSupplierList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(SightSeeingSupplierData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [SightSeeingSupplierData, isFetching, isLoading, error]);

  // const tableData = useMemo(
  //   () => SightSeeingSupplierData?.data,
  //   [SightSeeingSupplierData]
  // );

  const tableData = useMemo(() => {
    const uniqueSupplierMap = new Map();

    SightSeeingSupplierData?.data.forEach((item) => {
      if (!uniqueSupplierMap.has(item.supplierId)) {
        uniqueSupplierMap.set(item.supplierId, {
          id: item.id,
          supplierId: item.supplierId,
          supplierName: item.supplierName,
          tours: [],
        });
      }
      uniqueSupplierMap.get(item.supplierId).tours.push({
        id: item.id,
        tourName: item.tourName,
        tourId: item.tourId,
      });
    });
    return Array.from(uniqueSupplierMap.values());
  }, [SightSeeingSupplierData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data =
          await SightSeeingSupplierCommandInstance.multipleDeleteSightSeeingSupplier(
            SightSeeingSupplierUrlEnum.MultipleDeleteSightSeeingSupplier,
            selected
          );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.SightSeeingSupplierList]);
          clearSelected();
          CustomToast(`Deleted successfully`, "success");
        }
      } catch (error) {
        console.error("Error when delete Sightseeing Supplier", error);
        CustomToast(`Failed to Delete Sightseeing  Supplier `, "error");
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
          searchPlaceholder="SEARCH-SIGHT-SEEING-SUPPLIER"
          filterBtn={true}
          FilterComponent={
            <SightSeeingSupplierFilter></SightSeeingSupplierFilter>
          }
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD-SIGHT-SEEING-SUPPLIER-BUTTON"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="lg"
          modalTitle="SIGHT-SEEING-SUPPLIER-CREATE-MODAL-TITLE"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateSightSeeingSupplierModalForm />
        </CustomModal>
      )}
    </>
  );
};

function SightSeeingSupplierListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <SightSeeingSupplierList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default SightSeeingSupplierListWrapper ;
