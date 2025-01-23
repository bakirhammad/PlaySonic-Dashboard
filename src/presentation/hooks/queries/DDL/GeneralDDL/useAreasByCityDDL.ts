/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreaQueryInstance } from "@app/useCases/general/area/query/AreaQuery";
import { IAreaBody, IDDlOption } from "@domain/entities";
import { AreaUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AreaEnum";
import { useCallback, useEffect, useState } from "react";


const useAreasByCityDDL = (id: number) => {
    console.log(id)
    const [AreasOfCityList, setAreasOfCity] = useState<IAreaBody>();
    const [AreasOfCityOption, setAreasOfCityOption] = useState<IDDlOption[]>([]);
    const [isLoading, setIsLoadingAreasOfCity] = useState<boolean>(false);

    const fetchAreasOfCity = useCallback(async () => {
        try {
            setIsLoadingAreasOfCity(true);
            const AreasOfCityListRes = await AreaQueryInstance.getAreaList(
                AreaUrlEnum.GetAreaList + `cityId=${id}`
            );
            const _AreasOfCityOption = AreasOfCityListRes?.data?.map((Area) => {
                return {
                    value: Area.id,
                    label: Area.translations[0].name,
                };
            });
            setAreasOfCityOption(_AreasOfCityOption?.length ? _AreasOfCityOption : []);
            setAreasOfCity(AreasOfCityListRes);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingAreasOfCity(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAreasOfCity();
    }, [fetchAreasOfCity]);
    return { AreasOfCityList, isAreasOfCityLoading: isLoading, AreasOfCityOption };
}

export { useAreasByCityDDL };
