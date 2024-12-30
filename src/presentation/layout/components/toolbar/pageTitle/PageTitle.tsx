import { useLayout, usePageData } from "@presentation/layout/core";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { Link, useNavigate, useParams } from "react-router-dom";

const PageTitle = () => {
  const intl = useIntl();
  const { pageTitle, pageDescription, pageBreadcrumbs } = usePageData();
  const { config, classes } = useLayout();
  const { hotelSupplierId } = useParams();
  const navigate = useNavigate();
  const appPageTitleDirection = config.app?.pageTitle?.direction;
  // const _pageTitle = useLocaleFormate(pageTitle);
  // const _pageDescription = useLocaleFormate(pageDescription);
  // const Title = (x: string) => useLocaleFormate(x);
  return (
    <div
      id="kt_page_title"
      data-kt-swapper="true"
      data-kt-swapper-mode="prepend"
      data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
      className={clsx(
        "page-title d-flex flex-wrap me-3",
        classes.pageTitle.join(" "),
        config.app?.pageTitle?.class,
        {
          "flex-column justify-content-center":
            appPageTitleDirection === "column",
          "align-items-center": appPageTitleDirection !== "column",
        }
      )}
    >
      {config.app?.pageTitle?.display && pageTitle && (
        <h1
          className={clsx(
            "page-heading d-flex text-gray-900 fw-bold fs-3 my-0",
            {
              "flex-column justify-content-center": appPageTitleDirection,
              "align-items-center": !appPageTitleDirection,
            }
          )}
        >
          {intl.formatMessage({ id: pageTitle })}
          {pageDescription &&
            config.app?.pageTitle &&
            config.app?.pageTitle?.description && (
              <span
                className={clsx("page-desc text-muted fs-7 fw-semibold", {
                  "pt-2": appPageTitleDirection === "column",
                })}
              >
                {config.app?.pageTitle?.direction === "row" && (
                  <span className="h-20px border-1 border-gray-300 border-start ms-3 mx-2"></span>
                )}
                {pageDescription}
              </span>
            )}
        </h1>
      )}

      {pageBreadcrumbs &&
        pageBreadcrumbs.length > 0 &&
        config.app?.pageTitle &&
        config.app?.pageTitle?.breadCrumb && (
          <>
            {config.app?.pageTitle?.direction === "row" && (
              <span className="h-20px border-gray-300 border-start mx-4"></span>
            )}
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              {Array.from(pageBreadcrumbs).map((item, index) => (
                <li
                  className={clsx("breadcrumb-item", {
                    "text-gray-900": !item.isSeparator && item.isActive,
                    "text-muted": !item.isSeparator && !item.isActive,
                  })}
                  key={`${item.path}${index}`}
                >
                  {!item.isSeparator ? (
                    <>
                      {(() => {
                        let newItem = item.path;
                        if (hotelSupplierId) {
                          newItem = `${item.path}/${hotelSupplierId}`;
                        }
                        return (
                          <>
                            {item?.path ? (
                              <Link
                                className="text-muted text-hover-primary"
                                to={newItem}
                              >
                                {intl.formatMessage({ id: item.title })}
                              </Link>
                            ) : (
                              <span
                                onClick={() => navigate(-1)}
                                className="text-muted text-hover-primary cursor-pointer"
                              >
                                {intl.formatMessage({ id: item.title })}
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <span className="bullet bg-gray-500 w-5px h-2px"></span>
                  )}
                </li>
              ))}
              {/* <li className="breadcrumb-item text-gray-900">{_pageTitle}</li> */}
              <li className="breadcrumb-item text-gray-900">
                {intl.formatMessage({ id: pageTitle })}
              </li>
            </ul>
          </>
        )}
    </div>
  );
};

export { PageTitle };
