/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourtQueryInstance } from "@app/useCases/court";
import { IDDlOption } from "@domain/entities";
import { ICourtBody } from "@domain/entities/Court/Court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { useCallback, useEffect, useState } from "react";


const useCourtBuClubDDL = (id: number) => {
  const [ClubCourtsList, setCourts] = useState<ICourtBody>();
  const [ClubCourtsOption, setCourtsOption] = useState<IDDlOption[]>([]);
  const [isLoading, setIsLoadingCourts] = useState<boolean>(false);

  const fetchCourts = useCallback(async () => {
    try {
      setIsLoadingCourts(true);
      const CourtsListRes = await CourtQueryInstance.getCourtList(
        CourtUrlEnum.GetCourtList + `clubId=${id}`
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
    try {
      setIsLoadingCourts(true);
      const CourtsListRes = await CourtQueryInstance.getCourtList(
        CourtUrlEnum.GetCourtList + `clubId=${id}`
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
  }, [id]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);
  return { ClubCourtsList, isClubCourtLoading: isLoading, ClubCourtsOption };
}

export { useCourtBuClubDDL };
