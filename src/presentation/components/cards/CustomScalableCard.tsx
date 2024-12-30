import { Link } from "react-router-dom";
import { CustomKTIcon } from ".";
import { FC } from "react";
import { useLocaleFormate } from "@presentation/hooks/index";
import clsx from "clsx";
import { WithChildren } from "@presentation/helpers";

interface Props {
  link_to: string;
  description?: string;
  dataId: string;
  card_title: string;
  withSub?: boolean;
}

const CustomScalableCard: FC<Props & WithChildren> = ({
  card_title,
  link_to,
  dataId,
  description,
  children,
  withSub = false,
}) => {
  return (
    <>
      <div className="card card-custom " id="kt_card">
        <div className="card-header ">
          <div className="card-title  " style={{ width: "65%" }}>
            <h3 className="card-label fs-5">{useLocaleFormate(card_title)}</h3>
          </div>
          <div className="d-flex gap-2 card-toolbar">
            {withSub && (
              <div
                className="accordion-header "
                data-bs-toggle="collapse"
                data-bs-target={`#kt_accordion_2_${dataId}`}
              >
                <div className="btn btn-icon btn-sm btn-light-info ">
                  <CustomKTIcon
                    iconName="arrow"
                    className="ki ki-arrow-down icon-nm "
                  ></CustomKTIcon>
                </div>
              </div>
            )}
            {link_to && (
              <div className="btn btn-icon btn-sm w-auto px-2 btn-info ">
                <Link className=" text-white p-6" to={link_to}>
                  <i className="bi bi-box-arrow-up-right"></i>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="accordion accordion-icon-toggle" id="kt_accordion_2">
          <div
            className={clsx("collapse", false && "show")}
            id={`kt_accordion_2_${dataId}`}
            data-bs-parent="#kt_accordion_2"
          >
            {description && <div className="card-body">{description} </div>}
            <div className="card-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export { CustomScalableCard };
