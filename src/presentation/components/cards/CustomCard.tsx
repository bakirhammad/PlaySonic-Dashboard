import { FC } from "react";
import { Link } from "react-router-dom";
import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";

type Props = {
  card_title: string;
  // brief_description?: string;
  link_to: string;
  className?: string;
};

const CustomCard: FC<Props> = ({ card_title, link_to, className }) => {
  return (
    <>
      <div className="card card-custom shadow" style={{ width: "350px" }}>
        <div className="card-header">
          <h3 className={`card-title overflow-hidden mw-200px ${className}`}>
            {useLocaleFormate(card_title)}
          </h3>
          <div className="card-toolbar">
            <Link to={link_to}>{useLocaleFormate("DETAILS")}</Link>
          </div>
        </div>
        {/* <div className="card-body p-0">
          <div className="card-p">
          {intl.formatMessage({ id: brief_description })}
          </div>
          <img
            className="w-100 card-rounded-bottom"
            alt=""
            src="assetsmedia/svg/illustrations/bg-4.svg"
          />
        </div> */}
      </div>
    </>
  );
};

export { CustomCard };
