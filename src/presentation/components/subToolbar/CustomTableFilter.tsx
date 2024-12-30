import { FC, useEffect, useState } from "react";
import { WithChildren, initialQueryState } from "../../helpers";
import { CustomKTIcon } from "..";
import { useQueryRequest } from "@presentation/context";

import { MenuComponent } from "@assets/ts/components";
import { useLocaleFormate } from "@presentation/hooks/index";
// import Select from "react-select";

interface FilterProps {
  title?: string;
  asc_des_label?: string;
  status?: boolean;
  asc_des?: boolean;
}

const CustomTableFilter: FC<FilterProps & WithChildren> = ({
  title = "Filter hi",
  status = true,
  asc_des = true,
  children,
}) => {
  const { updateState, isLoading } = useQueryRequest();
  const [orderDirection, setorderDirection] = useState<string | undefined>();
  const [Status, setStatus] = useState<string | undefined>();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const resetData = () => {
    updateState({ filter: undefined, ...initialQueryState });
  };

  // const filterData = () => {
  //   updateState({
  //     filter: { role, last_login: lastLogin },
  //     ...initialQueryState,
  //   });
  // };
  const filterData = () => {
    updateState({
      filter: {
        orderDirection,
        IsActive: Status != "both" ? (Status == "active" ? true : false) : null,
      },
      ...initialQueryState,
    });
  };

  const _status = useLocaleFormate("STATUS");
  const _active = useLocaleFormate("ACTIVE");
  const _inActive = useLocaleFormate("IN_ACTIVE");
  const _both = useLocaleFormate("BOTH");
  const _asc_des_label = useLocaleFormate("SORT_BY");
  const _descending = useLocaleFormate("Descending");
  const _ascending = useLocaleFormate("Ascending");
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
        <div className="px-7 py-5">
          <div className="fs-5 text-gray-900 fw-bolder">
            {useLocaleFormate(title)}
          </div>
        </div>

        <div className="separator border-gray-200"></div>

        {children}
        {asc_des && (
          <>
            <div className="px-7 py-5" data-kt-user-table-filter="form">
              <div className="mb-10">
                <label className="form-label fs-6 fw-bold">
                  {_asc_des_label}
                </label>
                <select
                  className="form-select form-select-solid fw-bolder"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  data-kt-user-table-filter="order"
                  data-hide-search="true"
                  onChange={(e) => setorderDirection(e.target.value)}
                  value={orderDirection}
                >
                  {/* <option value=""></option> */}
                  <option value="asc">{_ascending}</option>
                  <option value="desc">{_descending}</option>
                </select>
              </div>
            </div>
          </>
        )}

        {status && (
          // <Select
          //   onChange={(e) => setLastLogin(e.value)}
          //   options={[
          //     { value: "active", label: "active" },
          //     { value: "inactive", label: "inactive" },
          //     { value: "both", label: "both" },
          //   ]}
          //   // value={Status}
          // />
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
              {/* <option value=""></option> */}
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

export { CustomTableFilter };
