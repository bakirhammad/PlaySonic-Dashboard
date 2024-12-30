import { useListView } from "../../context/manageListConext/ListViewProvider";
import { CustomListSearch } from "./CustomListSearch";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { CustomSelectedData } from "./CustomSelectedData";
import { ActionItem, CustomKTIcon } from "..";
import { WithChildren } from "@presentation/helpers/react18MigrationHelpers";
import { Link } from "react-router-dom";

interface Toolbar {
  addBtn?: boolean;
  exportBtn?: boolean;
  addBtnAction?: () => void;
  onDeleteSelectedAll?: () => void;
  filterBtn?: boolean;
  searchInput?: boolean;
  addName?: string;
  exportName?: string;
  summaryPath?: string;
  searchPlaceholder?: string;
  FilterComponent?: ReactNode;
  addIcon?: string;
}

const CustomTableToolbar: FC<Toolbar & WithChildren> = ({
  addBtn = true,
  addName = "add",
  addBtnAction,
  onDeleteSelectedAll,
  exportBtn = false,
  searchInput = true,
  exportName = "export",
  filterBtn = true,
  addIcon = "plus",
  FilterComponent,
  searchPlaceholder,
  children,
  summaryPath,
}) => {
  const { selected } = useListView();
  const intl = useIntl();

  return (
    <div className="card-header justify-content-right gap-2 border-0 pt-6">
      {searchInput ? (
        <CustomListSearch placeholder={searchPlaceholder ?? "SEARCH"} />
      ) : (
        <div className=" w-100 w-md-auto"></div>
      )}
      <div className=" w-100 w-md-auto">
        {selected.length > 0 ? (
          <CustomSelectedData
            onDeleteSelectedAll={
              onDeleteSelectedAll ? onDeleteSelectedAll : () => {}
            }
          />
        ) : (
          <>
            <div
              className="d-flex flex-wrap justify-content-md-end   gap-3"
              data-kt-user-table-toolbar="base"
            >
              {/* when adding additional button, include flex grow 1 in classame */}
              {!!children && children}
              {/* when add filter button please include flex grow 1 in classame */}
              {!!summaryPath && (
                <div className="d-flex">
                  <Link to={`${summaryPath}`} className="btn-light-primary ">
                    <ActionItem icon="document" title="SUMMARY" />
                  </Link>
                </div>
              )}

              {filterBtn && !!FilterComponent ? FilterComponent : filterBtn}

              {exportBtn && (
                <button
                  type="button"
                  className="btn btn-light-primary flex-grow-1 "
                >
                  <CustomKTIcon iconName="exit-up" className="fs-2" />
                  {intl.formatMessage({ id: exportName })}
                </button>
              )}

              {addBtn && (
                <button
                  type="button"
                  className="btn btn-primary flex-grow-1"
                  onClick={addBtnAction}
                >
                  <CustomKTIcon iconName={addIcon} className="fs-2" />
                  {intl.formatMessage({ id: addName })}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { CustomTableToolbar };
