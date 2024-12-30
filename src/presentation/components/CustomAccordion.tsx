import React, { ReactElement, FC } from "react";
import { CustomKTIcon } from "./cards";
import { useLocaleFormate } from "@presentation/hooks";
import clsx from "clsx";

interface ICustomAccordionProps {
  name: string;
  className?: string;
  components: ReactElement;
  defaultOpen?: boolean;
}
interface IProps {
  components: ICustomAccordionProps[];
}

export const CustomAccordion: FC<IProps> = ({ components }) => {
  return (
    <>
      {components.map((component, index) => (
        <div
          className={clsx(" mb-5 mb-xl-5 ", component.className ?? "card")}
          key={index}
        >
          <div
            className="card-header border-0 cursor-pointer"
            role="button"
            data-bs-toggle="collapse"
            data-bs-target={`#kt_account_${component.name.trim()}`}
            aria-expanded="true"
            aria-controls={`kt_account_${component.name.trim()}`}
          >
            <div className="card-title m-0 d-flex tw-items-center w-100 mb-2 ">
              <h3 className="fw-bolder m-0  ">
                {useLocaleFormate(component.name)}
              </h3>
              <CustomKTIcon
                iconName="arrow"
                iconType="duotone"
                className="ki ki-arrow-down icon-nm tw-text-3xl "
              />
            </div>
          </div>

          <div
            id={`kt_account_${component.name.trim()}`}
            className={`collapse  ${component?.defaultOpen && "show"} `}
          >
            <div className="card-body border-top ">
              <React.Fragment>{component.components}</React.Fragment>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
