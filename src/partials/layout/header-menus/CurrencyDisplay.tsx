import clsx from "clsx";
import { FC } from "react";
import { useQueryClient } from "react-query";
import { currenciesStore } from "@infrastructure/storage/currenciesStore";

const CurrencyDisplay: FC = () => {
  const queryClient = useQueryClient();
  const { currenciesDDL, systemCurrency, setSystemCurrency } =
    currenciesStore();
  return (
    <div
      className="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="bottom"
    >
      <a href="#" className="menu-link px-5">
        <span className="menu-title position-relative">
          Currency
          <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
            {systemCurrency?.label}{" "}
            {/* <img
              className="w-15px h-15px rounded-1 ms-2"
              src={currentLanguage?.flag}
              alt="metronic"
            /> */}
          </span>
        </span>
      </a>

      <div className="menu-sub menu-sub-dropdown w-175px mh-300px overflow-y-auto  py-4">
        {currenciesDDL.map((l) => (
          <div
            className="menu-item px-3"
            key={l.value as number}
            onClick={() => {
              setSystemCurrency(l);
              queryClient.invalidateQueries();
            }}
          >
            <a
              href="#"
              className={clsx("menu-link d-flex px-5", {
                active: l.value === systemCurrency?.value,
              })}
            >
              <span className="symbol symbol-20px me-4">
                {/* <img className="rounded-1" src={l.flag} alt="metronic" /> */}
              </span>
              {l.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CurrencyDisplay };
