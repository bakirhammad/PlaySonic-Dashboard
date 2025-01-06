import { ClubFeaturesEnum } from "@domain/enums/clubFeature/ClubFeaturesEnum";
import { FC } from "react";

type Props = {
  features: number;
};

const FeaturesCell: FC<Props> = ({ features }) => {
  const _features = Object.keys(ClubFeaturesEnum)
    .filter((v) => isNaN(Number(v)))
    .filter((key) => {
      return ClubFeaturesEnum[key as keyof typeof ClubFeaturesEnum] & features;
    });

  return (
    <div className="d-flex align-items-center w-150px">
      <div className="d-flex flex-wrap gap-2">
        {_features.map((feature, index) => (
          <span className="badge text-bg-secondary fw-bolder" key={index}>
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};

export { FeaturesCell };
