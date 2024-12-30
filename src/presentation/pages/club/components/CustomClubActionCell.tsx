import {
  CustomActionsCell,
  CustomModal,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";

import { FC, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { QUERIES } from "@presentation/helpers";

import { useListView } from "@presentation/context/index";
import { ISightSeeingTourData } from "@domain/entities";
import { SightSeeingTourCommandInstance } from "@app/index";
import { SightSeeingTourQueryByIdInstance } from "@app/index";
import { UpdateSightSeeingTourModalForm } from "./UpdateClubModalForm";
import { SightSeeingTourUrlEnum } from "@domain/enums";

interface Props {
  id: number;
  name: string;
}

const SightSeeingTourActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: [QUERIES.SightSeeingTourList, id],

    queryFn: () => {
      return SightSeeingTourQueryByIdInstance.getSightSeeingTourById(
        SightSeeingTourUrlEnum.GetSightSeeingTourById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get SightSeeing Tour data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteSightSeeingTour } = useMutation(
    async (id: number) => {
      const data = await SightSeeingTourCommandInstance.deleteSightSeeingTour(
        SightSeeingTourUrlEnum.DeleteSightSeeingTour,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: ISightSeeingTourData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await SightSeeingTourCommandInstance.deleteSightSeeingTour(
              SightSeeingTourUrlEnum.DeleteSightSeeingTour +
                `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.SightSeeingTourList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.SightSeeingTourList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete SightSeeing Tour", error);
        CustomToast(`Failed to delete SightSeeing Tour`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteSightSeeingTour(id);
    }
  };

  return (
    <>
      <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deletBtnOnClick={() => handleDelete()}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="HOTEL-HOTEL-SIGHT-SEEING-TOUR-UPDATE-MODAL-TITLE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateSightSeeingTourModalForm
              SightSeeingTourData={data}
              isLoading={isLoading}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { SightSeeingTourActionCell };
