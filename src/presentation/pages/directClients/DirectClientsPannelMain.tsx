import { CustomScalableCard } from "@presentation/components/cards/CustomScalableCard";

const DirectClientsPannelMain = () => {
  return (
    <>
      <div className="row row-cols-lg-3 row-cols-md-3 row-col-sm-2 row-cols-3 row-gap-4">
        <div id="manageclients">
          <CustomScalableCard
            card_title="SIDEBAR-MANAGE-CLIENTS"
            link_to="manageclients"
            dataId="manageclients"
          />
        </div>
      </div>
    </>
  );
};

export default DirectClientsPannelMain;
