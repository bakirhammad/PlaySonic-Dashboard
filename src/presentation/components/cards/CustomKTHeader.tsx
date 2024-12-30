import { FC } from "react";
import { WithChildren } from "../../helpers/react18MigrationHelpers";
import { useLocaleFormate } from "@presentation/hooks";
import { Children } from "react";
type Props = {
  className?: string;
  scroll?: boolean;
  height?: number;
  cardTitle: string;
  withTranslation?: boolean;
};

const CustomKTHeader: FC<Props & WithChildren> = (props, { children }) => {
  const { className, cardTitle, withTranslation = true } = props;
  const localizedCardTitle = withTranslation
    ? useLocaleFormate(cardTitle)
    : cardTitle;
  return (
    <div className="card-header">
      <h3 className={`card-title  overflow-hidden  ${className}`}>
        {localizedCardTitle} {children}
      </h3>
      <div className="card-toolbar">
        {/* <Link to={link_to}>{useLocaleFormate("DETAILS")}</Link> */}
      </div>
    </div>
  );
};

export { CustomKTHeader };
