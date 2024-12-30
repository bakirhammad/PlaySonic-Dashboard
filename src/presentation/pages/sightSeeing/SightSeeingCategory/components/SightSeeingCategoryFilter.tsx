import { FC, useEffect, useState } from "react";
import { WithChildren, initialQueryState } from "../../../../helpers";
import { CustomKTIcon } from "../../../..";
import { useQueryRequest } from "@presentation/context";

import { MenuComponent } from "@assets/ts/components";
import { useLocaleFormate } from "@presentation/hooks/index";

interface FilterProps {
  title?: string;
  asc_des_label?: string;
  status?: boolean;
  asc_des?: boolean;
}

const SightSeeingCategoryFilter: FC<FilterProps & WithChildren> = ({
  status = true,

  children,
}) => {
  const { updateState, isLoading } = useQueryRequest();

  const [Status, setStatus] = useState<string | undefined>();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const resetData = () => {
    updateState({ filter: undefined, ...initialQueryState });
  };

  const filterData = () => {
    updateState({
      filter: {
        Status:
          Status != "both"
            ? Status == "active"
              ? true
              : Status == "inactive"
              ? false
              : null
            : null,
      },
      ...initialQueryState,
    });
  };

  const _status = useLocaleFormate("STATUS");
  const _active = useLocaleFormate("ACTIVE");
  const _inActive = useLocaleFormate("IN_ACTIVE");
  const _both = useLocaleFormate("BOTH");
  return (
    <>
      <button
        disabled={isLoading}
        type="button"
        className="btn btn-light-primary flex-grow-1"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <CustomKTIcon iconName="filter" className="fs-2" />
        {useLocaleFormate("FILTER")}
      </button>
      <div
        className="menu menu-sub menu-sub-dropdown p-2 w-300px w-md-325px"
        data-kt-menu="true"
      >
        {children}

        {status && (
          <div className="mb-10">
            <label className="form-label fs-6 fw-bold">{_status}</label>
            <select
              className="form-select form-select-solid fw-bolder"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-allow-clear="true"
              data-kt-user-table-filter="two-step"
              data-hide-search="true"
              onChange={(e) => setStatus(e.target.value)}
              value={Status}
            >
              <option value="">-----</option>
              <option value="active">{_active}</option>
              <option value="inactive">{_inActive}</option>
              <option value="both">{_both}</option>
            </select>
          </div>
        )}

        <div className="d-flex justify-content-end">
          <button
            type="button"
            disabled={isLoading}
            onClick={resetData}
            className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
            data-kt-menu-dismiss="true"
            data-kt-user-table-filter="reset"
          >
            {useLocaleFormate("RESET_FILTER")}
          </button>
          <button
            disabled={isLoading}
            type="button"
            onClick={filterData}
            className="btn btn-primary fw-bold px-6"
            data-kt-menu-dismiss="true"
            data-kt-user-table-filter="filter"
          >
            {useLocaleFormate("APPLY_FILTER")}
          </button>
        </div>
      </div>
    </>
  );
};

export { SightSeeingCategoryFilter };
