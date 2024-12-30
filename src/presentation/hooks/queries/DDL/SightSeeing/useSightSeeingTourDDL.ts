import { SightSeeingTourQueryInstance } from "@app/index";
import { IDDlOption, ISightSeeingTourData } from "@domain/entities";
import { SightSeeingTourUrlEnum } from "@domain/enums";
import { useEffect, useState } from "react";

interface IProps {
  onError: (error: any) => void;
}

const useSightSeeingTourDDL = ({ onError }: IProps) => {
  const [SightSeeingTourList, setSightSeeingTourList] = useState<
    ISightSeeingTourData[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [SightSeeingTourOptions, setSightSeeingTourOptions] = useState<
    IDDlOption[]
  >([]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        setIsLoading(true);
        const SightSeeingTour =
          await SightSeeingTourQueryInstance.getSightSeeingTourList(
            SightSeeingTourUrlEnum.GetSightSeeingTourList
          );

        setSightSeeingTourList(SightSeeingTour?.data);
        setSightSeeingTourOptions(
          SightSeeingTour.data.map((SightSeeingTour: ISightSeeingTourData) => ({
            value: SightSeeingTour?.id as number,
            label: String(
              SightSeeingTour?.translationResponses[0]
                ? SightSeeingTour?.translationResponses[0].name
                : "no name"
            ),
          }))
        );
      } catch (error) {
        onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryList();
  }, []);
  return {
    SightSeeingTourOptions,
    isSightSeeingTourListLoading: isLoading,
    SightSeeingTourList,
  };
};

export { useSightSeeingTourDDL };
