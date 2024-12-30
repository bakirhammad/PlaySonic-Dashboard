import clsx from "clsx";
import { Fragment, useMemo } from "react";
import { PAGINATION_PAGES_COUNT, PaginationState } from "../../helpers";
import { useIntl } from "react-intl";
import { useQueryRequest } from "../../context/queryRequestContext/QueryRequestProvider";
import {
  useQueryResponseLoading,
  useQueryResponsePagination,
} from "../../context/queryRequestContext/QueryRequestProvider";
import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";
import { ActionItem, CustomActionsCell } from "../tables";

const CustomTablePagination = () => {
  const intl = useIntl();

  const pagination = useQueryResponsePagination();
  const isLoading = useQueryResponseLoading();
  const { updateState } = useQueryRequest();

  const filterData = (pageSize: number) => {
    updateState({
      pageSize: pageSize,
    });
  };

  const mappedLabel = (label: string): string => {
    if (label === "&laquo; Previous") {
      return intl.formatMessage({ id: "PREVIOUS" });
    }

    if (label === "Next &raquo;") {
      return intl.formatMessage({ id: "NEXT" });
    }

    return label;
  };

  const updatePage = (page: number | undefined | null) => {
    if (!page || isLoading || pagination.pageNumber === page) {
      return;
    }
    updateState({
      pageNumber: page,
    });
  };

  const sliceLinks = (pagination?: PaginationState) => {
    if (!pagination?.links?.length) {
      return [];
    }

    const scopedLinks = [...pagination.links];

    let pageLinks: Array<{
      label: string;
      active: boolean;
      url: string | null;
      page: number | null;
    }> = [];
    const previousLink: {
      label: string;
      active: boolean;
      url: string | null;
      page: number | null;
    } = scopedLinks.shift()!;
    const nextLink: {
      label: string;
      active: boolean;
      url: string | null;
      page: number | null;
    } = scopedLinks.pop()!;
    const CheckLastIndex =
      scopedLinks[scopedLinks.length - 1]?.page > PAGINATION_PAGES_COUNT + 1;
    const halfOfPagesCount = Math.floor(PAGINATION_PAGES_COUNT / 2);

    pageLinks.push(previousLink);

    if (
      pagination.pageNumber <= Math.round(PAGINATION_PAGES_COUNT / 2) ||
      scopedLinks.length <= PAGINATION_PAGES_COUNT
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(0, PAGINATION_PAGES_COUNT),
        CheckLastIndex && { dots: "...." },
        // { dots: PAGINATION_PAGES_COUNT + 2,pageLinks "....." },
      ];
    }

    if (
      pagination.pageNumber > scopedLinks.length - halfOfPagesCount &&
      scopedLinks.length > PAGINATION_PAGES_COUNT
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(
          scopedLinks.length - PAGINATION_PAGES_COUNT,
          scopedLinks.length
        ),
      ];
    }

    if (
      !(
        pagination.pageNumber <= Math.round(PAGINATION_PAGES_COUNT / 2) ||
        scopedLinks.length <= PAGINATION_PAGES_COUNT
      ) &&
      !(pagination.pageNumber > scopedLinks.length - halfOfPagesCount)
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(
          pagination.pageNumber - 1 - halfOfPagesCount,
          pagination.pageNumber + halfOfPagesCount
        ),
      ];
    }

    pageLinks.push(nextLink);

    return pageLinks;
  };

  const paginationLinks = useMemo(() => sliceLinks(pagination), [pagination]);

  return (
    <div className="row">
      <div className="col-12 d-flex align-items-center justify-content-between">
        <CustomActionsCell
          deleteBtn={false}
          editBtn={false}
          id={0}
          title="PAGE_SIZE"
        >
          <ActionItem icon="text-number" title="PAGE_SIZE" />
          <ActionItem
            icon="text-number"
            title="10"
            onClick={() => filterData(10)}
          />
          <ActionItem
            icon="text-number"
            title="50"
            onClick={() => filterData(50)}
          />
          <ActionItem
            icon="text-number"
            title="100"
            onClick={() => filterData(100)}
          />
        </CustomActionsCell>

        <div id="kt_table_users_paginate">
          <ul
            className="pagination"
            key={`ulpagination${pagination.pageNumber}`}
          >
            <li
              key={`lipagination${pagination.pageNumber}`}
              className={clsx("page-item", {
                disabled: isLoading || pagination.pageNumber === 1,
              })}
            >
              <a
                onClick={() => updatePage(1)}
                style={{ cursor: "pointer" }}
                className="page-link"
              >
                {useLocaleFormate("FIRST")}
              </a>
            </li>
            {paginationLinks
              ?.map((link) => {
                if (link) {
                  return { ...link, label: mappedLabel(link?.label) };
                }
              })
              .map((link, index) => (
                <Fragment key={index + "perent"}>
                  {link && (
                    <li
                      key={index}
                      className={clsx("page-item", {
                        active: pagination.pageNumber === link.page,
                        disabled: isLoading,
                        previous: link.label === "Previous",
                        next: link.label === "Next",
                      })}
                    >
                      <a
                        className={clsx("page-link", {
                          "page-text":
                            link.label === "Previous" || link.label === "Next",
                          "me-5": link.label === "Previous",
                        })}
                        onClick={() => updatePage(link.page)}
                        style={{ cursor: "pointer" }}
                      >
                        {mappedLabel(link.label)}
                        {link?.dots && <div>{link.dots}</div>}
                      </a>
                    </li>
                  )}
                </Fragment>
              ))}
            <li
              key={"length"}
              className={clsx("page-item", {
                disabled:
                  isLoading ||
                  pagination.pageNumber === pagination.links?.length,
              })}
            >
              <a
                onClick={() => updatePage(pagination.links?.length || 1)}
                style={{ cursor: "pointer" }}
                className="page-link"
              >
                {useLocaleFormate("LAST")}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { CustomTablePagination };
