/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourtSlotsQueryInstance } from "@app/useCases/courtSlot";
import { ICourtSlotsBody } from "@domain/entities/CourtSlot/CourtSlot";
import { CourtSlotsUrlEnum } from "@domain/enums/URL/courtSlots/courtSlotsUrls/CourtSlots";
import { useCallback, useEffect, useState } from "react";


function useGetSlotTypeByCourtIdDDL(courtId: number) {
  const [CourtSlotTypesList, setCourtSlotTypes] = useState<ICourtSlotsBody>();
  const [CourtSlotTypesOption, setCourtSlotTypesOption] = useState<number[]>([]);
  const [isLoading, setIsLoadingCourtSlotTypes] = useState<boolean>(false);

  const fetchCourtSlotTypes = useCallback(async () => {
    try {
      setIsLoadingCourtSlotTypes(true);
      const CourtSlotTypesListRes = await CourtSlotsQueryInstance.getCourtSlotsList(
        `${CourtSlotsUrlEnum.GetCourtSlotsList}courtId=${courtId}`
      );
      const _CourtSlotTypesOption = CourtSlotTypesListRes?.data?.map((court) => {
        return court.slotTypeId
      });
      setCourtSlotTypesOption(_CourtSlotTypesOption?.length ? _CourtSlotTypesOption : []);
      setCourtSlotTypes(CourtSlotTypesListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCourtSlotTypes(false);
    }
  }, [courtId]);

  useEffect(() => {
    fetchCourtSlotTypes();
  }, [fetchCourtSlotTypes]);
  return { CourtSlotTypesList, isCourtSlotTypesLoading: isLoading, CourtSlotTypesOption };
}

export { useGetSlotTypeByCourtIdDDL };
