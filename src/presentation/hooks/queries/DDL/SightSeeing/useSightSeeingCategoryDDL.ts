import { SightSeeingCategoryQueryInstance } from "@app/index";
import { IDDlOption, ISightSeeingCategoryData } from "@domain/entities";
import { SightSeeingCategoryUrlEnum } from "@domain/enums";
import { useEffect, useState } from "react";

interface IProps {
  onError: (error: any) => void;
}

const useSightSeeingCategoryDDL = ({ onError }: IProps) => {
  const [SightSeeingCategoryList, setSightSeeingCategoryList] = useState<
    ISightSeeingCategoryData[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [SightSeeingCategoryOptions, setSightSeeingCategoryOptions] = useState<
    IDDlOption[]
  >([]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        setIsLoading(true);
        const SightSeeingCategories =
          await SightSeeingCategoryQueryInstance.getSightSeeingCategoryList(
            SightSeeingCategoryUrlEnum.GetSightSeeingCategoryList
          );

        setSightSeeingCategoryList(SightSeeingCategories?.data);
        setSightSeeingCategoryOptions(
          SightSeeingCategories.data.map(
            (SightSeeingCategory: ISightSeeingCategoryData) => ({
              value: SightSeeingCategory?.id as number,
              label: String(SightSeeingCategory?.translations[0].name),
            })
          )
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
    SightSeeingCategoryOptions,
    isSightSeeingCategoryListLoading: isLoading,
    SightSeeingCategoryList,
  };
};

export { useSightSeeingCategoryDDL };
