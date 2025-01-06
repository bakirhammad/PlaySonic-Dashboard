/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlotTypeQueryInstance } from "@app/useCases/slotType";
import { IDDlOptionSlotType } from "@domain/entities";
import { ISlotTypeBody } from "@domain/entities/SlotType/SlotType";
import { SlotTypeUrlEnum } from "@domain/enums/URL/SlotType/SlotTyeUrls/SlotType";
import { useCallback, useEffect, useState } from "react";


function useSlotTypesDDL() {
  const [SlotTypesList, setSlotTypes] = useState<ISlotTypeBody>();
  const [SlotTypesOption, setSlotTypesOption] = useState<IDDlOptionSlotType[]>([]);
  const [isLoading, setIsLoadingSlotTypes] = useState<boolean>(false);

  const fetchSlotTypes = useCallback(async () => {
    try {
      setIsLoadingSlotTypes(true);
      const SlotTypesListRes = await SlotTypeQueryInstance.getSlotTypeList(
        SlotTypeUrlEnum.GetSlotTypeList
      );
      const _SlotTypesOption = SlotTypesListRes?.data?.map((Court) => {
        return {
          value: Court.id,
          label: Court.duration,
        };
      });
      setSlotTypesOption(_SlotTypesOption?.length ? _SlotTypesOption : []);
      setSlotTypes(SlotTypesListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSlotTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchSlotTypes();
  }, [fetchSlotTypes]);
  return { SlotTypesList, isSlotTypesLoading: isLoading, SlotTypesOption };
}

export { useSlotTypesDDL };
