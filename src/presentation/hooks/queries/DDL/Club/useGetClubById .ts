/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { ClubQueryByIdInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import { IClubData } from "@domain/entities/Clubs/Clubs";
import { useAuthStore } from "@infrastructure/storage/AuthStore";


function useGetClubById() {
  const [clubByIdList, setClubById] = useState<IClubData>();
  const [isLoading, setIsLoadingClubById] = useState<boolean>(false);

  const { auth } = useAuthStore();
  const clubId = auth?.clubID || 0;

  const fetchClubById = useCallback(async () => {
    try {
      setIsLoadingClubById(true);
      const clubByIdListRes = await ClubQueryByIdInstance.getClubById(
        ClubUrlEnum.GetClubById, clubId
      );
      setClubById(clubByIdListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingClubById(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchClubById();
  }, [fetchClubById]);
  return { clubByIdList, isLoading };
}

export { useGetClubById };
