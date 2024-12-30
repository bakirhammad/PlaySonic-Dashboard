import clsx from "clsx";
import { FC } from "react";
import { toAbsoluteUrlForLocalImage } from "../../../presentation/helpers";
import {
  useLang,
  setLanguage,
} from "../../../presentation/localization/Metronici18n";
import { LayoutSetup, getLayoutFromLocalStorage } from "@presentation/layout";
import { useQueryRequest } from "@presentation/context";

const languages = [
  {
    lang: "en",
    name: "ENGLISH",
    flag: toAbsoluteUrlForLocalImage("media/flags/united-states.svg"),
  },
  {
    lang: "ar",
    name: "العربية",
    flag: toAbsoluteUrlForLocalImage("media/flags/jordan.svg"),
  },
];

const Languages: FC = () => {
  const { updateState } = useQueryRequest();

  const lang = useLang();
  const currentLanguage = languages.find((x) => x.lang === lang);
  updateState({
    culture: currentLanguage?.lang,
  });

  return (
    <div
      className="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="bottom"
    >
      <a href="#" className="menu-link px-5">
        <span className="menu-title position-relative">
          Language
          <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
            {currentLanguage?.name}{" "}
            <img
              className="w-15px h-15px rounded-1 ms-2"
              src={currentLanguage?.flag}
              alt="metronic"
            />
          </span>
        </span>
      </a>

      <div className="menu-sub menu-sub-dropdown w-175px py-4">
        {languages.map((l) => (
          <div
            className="menu-item px-3"
            key={l.lang}
            onClick={() => {
              setLanguage(l.lang);
              const config = getLayoutFromLocalStorage();
              if (l.lang === "ar") {
                if (config?.app?.general) {
                  config.app.general.rtl = true;
                  LayoutSetup.setConfig(config);
                }
              } else {
                if (config?.app?.general) {
                  config.app.general.rtl = false;
                  LayoutSetup.setConfig(config);
                }
              }
            }}
          >
            <a
              href="#"
              className={clsx("menu-link d-flex px-5", {
                active: l.lang === currentLanguage?.lang,
              })}
            >
              <span className="symbol symbol-20px me-4">
                <img className="rounded-1" src={l.flag} alt="metronic" />
              </span>
              {l.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Languages };
