import {
  ActionItem,
  CustomActionsCell,
  CustomModal,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";

import { FC, useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { QUERIES } from "@presentation/helpers";

import { useListView } from "@presentation/context/index";
import { ISightSeeingSupplierData } from "@domain/entities";
import { SightSeeingSupplierCommandInstance } from "@app/index";
import { SightSeeingSupplierQueryByIdInstance } from "@app/index";
import { UpdateSightSeeingSupplierModalForm } from "./UpdateSightSeeingSupplierModalForm";
import { SightSeeingSupplierUrlEnum } from "@domain/enums";
import { Link } from "react-router-dom";

interface Props {
  id: number;
  name: string;
}

const SightSeeingSupplierActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const [data, setData] = useState<ISightSeeingSupplierData>();
  const [isLoading, setIsLoading] = useState(true);

  const openUpdateSightSeeingSupplierModal = async (id: number) => {
    try {
      setIsLoading(true);
      setItemIdForUpdate(id);
      const data =
        await SightSeeingSupplierQueryByIdInstance.getSightSeeingSupplierById(
          SightSeeingSupplierUrlEnum.GetSightSeeingSupplierById,
          id
        );
      setData(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Sightseeing Supplier data`, "error");
      setItemIdForUpdate(undefined);
    } finally {
      setIsLoading(false);
    }
  };
  const { mutate: deleteSightSeeingSupplier } = useMutation(
    async (id: number) => {
      const data =
        await SightSeeingSupplierCommandInstance.deleteSightSeeingSupplier(
          SightSeeingSupplierUrlEnum.DeleteSightSeeingSupplier,
          id
        );
      return data;
    },
    {
      onSuccess: async (res: ISightSeeingSupplierData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await SightSeeingSupplierCommandInstance.deleteSightSeeingSupplier(
              SightSeeingSupplierUrlEnum.DeleteSightSeeingSupplier +
                `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.SightSeeingSupplierList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.SightSeeingSupplierList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Sightseeing Supplier ", error);
        CustomToast(`Failed to delete Sightseeing Supplier `, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteSightSeeingSupplier(id);
    }
  };

  return (
    <>
      <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          openUpdateSightSeeingSupplierModal(id);
        }}
        deletBtnOnClick={() => handleDelete()}
      >
        <Link to={`/apps/sightseeing/sightseeingttourrate/${id}`}>
          <ActionItem icon="discount" title="RATE" />
        </Link>
      </CustomActionsCell>
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="lg"
          modalTitle="HOTEL-HOTEL-SIGHT-SEEING-SUPPLIER-UPDATE-MODAL-TITLE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateSightSeeingSupplierModalForm
              SightSeeingSupplierData={data}
              isLoading={isLoading}
              openUpdateSightSeeingSupplierModal={
                openUpdateSightSeeingSupplierModal
              }
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { SightSeeingSupplierActionCell };
