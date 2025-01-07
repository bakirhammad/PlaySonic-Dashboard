/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreaQueryInstance } from "@app/useCases/general/area/query/AreaQuery";
import { IDDlOption } from "@domain/entities";
import { IAreaBody } from "@domain/entities/general/area/Area";
import { AreaUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AreaEnum";
import { useCallback, useEffect, useState } from "react";


function useAreasDDL() {
  const [AreaList, setArea] = useState<IAreaBody>();
  const [AreaOption, setAreaOption] = useState<IDDlOption[]>([]);
  const [isLoading, setIsLoadingArea] = useState<boolean>(false);

  const fetchArea = useCallback(async () => {
    try {
      setIsLoadingArea(true);
      const AreaListRes = await AreaQueryInstance.getAreaList(
        AreaUrlEnum.GetAreaList
      );

      const _AreaOption = AreaListRes?.data?.map((Area) => {
        return {
          value: Area.id,
          label: Area.translations[0]?.name,
        };
      });

      setAreaOption(_AreaOption?.length ? _AreaOption : []);
      setArea(AreaListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingArea(false);
    }
  }, []);

  useEffect(() => {
    fetchArea();
  }, [fetchArea]);
  return { AreaList, isAreaLoading: isLoading, AreaOption };
}

export { useAreasDDL };
