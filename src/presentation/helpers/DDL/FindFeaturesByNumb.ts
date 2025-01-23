import { ClubFeaturesEnum } from "@domain/enums/clubFeature/ClubFeaturesEnum";
import { useEffect, useState } from "react";

interface IOption {
    value: number,
    label: string
}

const useFindFeaturesByNumb = (features: number) => {
    const [featuresList, setFeaturesList] = useState<IOption[]>()
    useEffect(() => {
        const featurePairs = Object.keys(ClubFeaturesEnum)
            .filter((v) => isNaN(Number(v)))
            .filter((key) => {
                return ClubFeaturesEnum[key as keyof typeof ClubFeaturesEnum] & features;
            })
            .map((key) => ({
                value: ClubFeaturesEnum[key as keyof typeof ClubFeaturesEnum],
                label: key,
            }));

        setFeaturesList(featurePairs || [])
    }, [features])


    return { featuresList }
};

export { useFindFeaturesByNumb };
