import { Route } from "./Routes";
import { lazy } from "react";
import { GeneralWrapper } from "@presentation/pages/general/GeneralWrapper";

const CountryListWrapper = lazy(
  () => import("@presentation/pages/general/country")
);

const CityListWrapper = lazy(
  () => import("@presentation/pages/general/city")
);
const AreaListWrapper = lazy(
  () => import("@presentation/pages/general/area")
);

const GeneralRoute: Route = {
  path: "/apps/general",
  title: "",
  component: GeneralWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "countrylist",
      title: "SIDEBAR-COUNTRY",
      component: CountryListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "citylist",
      title: "SIDEBAR-Cities",
      component: CityListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "arealist",
      title: "SIDEBAR-Area",
      component: AreaListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { GeneralRoute };
