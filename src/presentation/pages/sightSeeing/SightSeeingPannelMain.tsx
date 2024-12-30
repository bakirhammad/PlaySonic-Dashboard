import { CustomScalableCard } from "@presentation/components/cards/CustomScalableCard";

const SightSeeingPannelMain = () => {
  return (
    <>
      <div className="row row-cols-lg-3 row-cols-md-3 row-col-sm-2 row-cols-3 row-gap-4">
        <div id="market">
          <CustomScalableCard
            card_title="MARKET-PAGE_TITLE"
            link_to="market"
            dataId="market"
          />
        </div>    
      </div>
    </>
  );
};

export default SightSeeingPannelMain;
