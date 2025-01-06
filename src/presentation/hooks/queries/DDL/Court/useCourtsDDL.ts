/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourtQueryInstance } from "@app/useCases/court";
import { IDDlOption } from "@domain/entities";
import { ICourtBody } from "@domain/entities/Court/Court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { useCallback, useEffect, useState } from "react";


function useCourtsDDL() {
  const [CourtsList, setCourts] = useState<ICourtBody>();
  const [CourtsOption, setCourtsOption] = useState<IDDlOption[]>([]);
  const [isLoading, setIsLoadingCourts] = useState<boolean>(false);

  const fetchCourts = useCallback(async () => {
    try {
      setIsLoadingCourts(true);
      const CourtsListRes = await CourtQueryInstance.getCourtList(
        CourtUrlEnum.GetCourtList
      );
      const _CourtsOption = CourtsListRes?.data?.map((Court) => {
        return {
          value: Court.id,
          label: Court.name,
        };
      });
      setCourtsOption(_CourtsOption?.length ? _CourtsOption : []);
      setCourts(CourtsListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCourts(false);
    }
  }, []);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);
  return { CourtsList, isCourtLoading: isLoading, CourtsOption };
}

export { useCourtsDDL };
