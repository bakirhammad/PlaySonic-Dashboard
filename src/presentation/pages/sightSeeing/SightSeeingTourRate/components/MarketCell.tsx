import { ISightSeeingTourRateMarket } from "@domain/entities";

interface IProps {
  Markets: ISightSeeingTourRateMarket[];
}

export const MarketsCell = ({ Markets }: IProps) => {
  return (
    <div className="d-flex align-items-center w-150px">
      <div className="d-flex flex-wrap gap-2">
        {Markets.map((market) => (
          <span
            className="badge text-bg-secondary fw-bolder"
            key={market.marketId}
          >
            {market.marketName}
          </span>
        ))}
      </div>
    </div>
  );
};
