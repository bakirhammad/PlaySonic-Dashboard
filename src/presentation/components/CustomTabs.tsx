import clsx from "clsx";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";

const CustomTabs: FC<{
  tabsToRender: { tabName: string; componentName: FC | ReactNode }[];
  backgroundColor?: string;
  tabsNameID?: string;
}> = ({ tabsToRender, tabsNameID = "dallas", backgroundColor }) => {
  const intl = useIntl();

  return (
    <>
      <div
        className={clsx(
          "card card-custom",
          backgroundColor && `tw-bg-[${backgroundColor}]`
        )}
      >
        {" "}
        <div className="card-header card-header-stretch">
          <div className="card-toolbar">
            <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
              {tabsToRender.map(({ tabName }, index) => (
                <li className="nav-item" key={index}>
                  <a
                    className={`nav-link ${index === 0 ? "active" : ""} `}
                    data-bs-toggle="tab"
                    href={`#tab_${index}_link_${tabsNameID}`}
                  >
                    {intl.formatMessage({ id: tabName })}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card-body">
          <div className="tab-content" id="myTabContent">
            {tabsToRender.map(
              ({ componentName: ComponentName, tabName }, index) => (
                <div
                  className={`tab-pane fade  ${
                    index === 0 ? "show active" : ""
                  } `}
                  id={`tab_${index}_link_${tabsNameID}`}
                  role="tabpanel"
                  key={tabName}
                >
                  {typeof ComponentName == "function" ? (
                    <ComponentName />
                  ) : (
                    ComponentName
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomTabs;
