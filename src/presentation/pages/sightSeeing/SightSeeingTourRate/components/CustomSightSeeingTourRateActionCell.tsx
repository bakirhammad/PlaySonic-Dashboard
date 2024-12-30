import {
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
import { ISightSeeingTourRateData } from "@domain/entities";
import { SightSeeingTourRateCommandInstance } from "@app/index";
import { SightSeeingTourRateQueryByIdInstance } from "@app/index";
import { UpdateSightSeeingTourRateModalForm } from "./UpdateSightSeeingTourRateModalForm";
import { SightSeeingTourRateUrlEnum } from "@domain/enums";

interface Props {
  id: number;
  name: string;
}

const SightSeeingTourRateActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const [data, setData] = useState<ISightSeeingTourRateData>();
  const [isLoading, setIsLoading] = useState(true);

  const openUpdateSightSeeingTourRateModal = async (id: number) => {
    try {
      setIsLoading(true);
      setItemIdForUpdate(id);
      const data =
        await SightSeeingTourRateQueryByIdInstance.getSightSeeingTourRateById(
          SightSeeingTourRateUrlEnum.GetSightSeeingTourRateById,
          id
        );
      setData(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get SightSeeing Tour Rate data`, "error");
      setItemIdForUpdate(undefined);
    } finally {
      setIsLoading(false);
    }
  };
  const { mutate: deleteSightSeeingTourRate } = useMutation(
    async (id: number) => {
      const data =
        await SightSeeingTourRateCommandInstance.deleteSightSeeingTourRate(
          SightSeeingTourRateUrlEnum.DeleteSightSeeingTourRate,
          id
        );
      return data;
    },
    {
      onSuccess: async (res: ISightSeeingTourRateData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await SightSeeingTourRateCommandInstance.deleteSightSeeingTourRate(
              SightSeeingTourRateUrlEnum.DeleteSightSeeingTourRate +
                `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.SightSeeingTourRateList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.SightSeeingTourRateList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Sightseeing Tour Rate ", error);
        CustomToast(`Failed to delete Sightseeing Tour Rate `, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteSightSeeingTourRate(id);
    }
  };

  return (
    <>
      <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          openUpdateSightSeeingTourRateModal(id);
        }}
        deletBtnOnClick={() => handleDelete()}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="HOTEL-HOTEL-SIGHT-SEEING-TOUR-RATE-UPDATE-MODAL-TITLE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateSightSeeingTourRateModalForm
              SightSeeingTourRateData={data}
              isLoading={isLoading}
              openUpdateSightSeeingTourRateModal={
                openUpdateSightSeeingTourRateModal
              }
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { SightSeeingTourRateActionCell };
