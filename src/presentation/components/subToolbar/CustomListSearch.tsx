/* eslint-disable react-hooks/exhaustive-deps */

import { FC, useEffect, useState } from "react";
import { useQueryRequest } from "../../context/queryRequestContext/QueryRequestProvider";
import { useIntl } from "react-intl";
import { initialQueryState, useDebounce } from "../../helpers";
import { CustomKTIcon } from "..";
import clsx from "clsx";
import { useIsEnLang } from "@presentation/hooks/index";

type Props = {
  placeholder?: string;
};

const CustomListSearch: FC<Props> = ({ placeholder }) => {
  const intl = useIntl();

  const { updateState } = useQueryRequest();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
        updateState({
          search: debouncedSearchTerm.trim(),
          ...initialQueryState,
        });
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
    // More details about useDebounce: https://usehooks.com/useDebounce/
  );

  return (
    <div className=" w-100 w-md-auto">
      {/* begin::Search */}
      <div className="d-flex align-items-center position-relative my-1">
        <CustomKTIcon
          iconName="magnifier"
          className={clsx(
            "fs-1 position-absolute ms-6",
            !useIsEnLang() && "start-0"
          )}
        />
        <input
          type="text"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid ps-14"
          placeholder={intl.formatMessage({ id: placeholder })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  );
};

export { CustomListSearch };
