/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { IDDlOptionClub } from "@domain/entities";
import { IClubBody } from "@domain/entities/Clubs/Clubs";
import { ClubQueryInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";


function useClubsDDL() {
  const [clubsList, setClubs] = useState<IClubBody>();
  const [clubsOption, setClubsOption] = useState<IDDlOptionClub[]>([]);
  const [isLoading, setIsLoadingClubs] = useState<boolean>(false);

  const fetchClubs = useCallback(async () => {
    try {
      setIsLoadingClubs(true);
      const clubsListRes = await ClubQueryInstance.getClubList(
        ClubUrlEnum.GetClubList
      );
      const _clubsOption = clubsListRes?.data?.map((club) => {
        return {
          value: club.id,
          label: club.payload,
        };
      });
      setClubsOption(_clubsOption?.length ? _clubsOption : []);
      setClubs(clubsListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingClubs(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);
  return { clubsList, isClubLoading: isLoading, clubsOption };
}

export { useClubsDDL };
