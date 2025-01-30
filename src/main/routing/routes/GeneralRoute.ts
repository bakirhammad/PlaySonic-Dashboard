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

const RegisterWrapper = lazy(
  () => import("@presentation/pages/addUser")
);

const RolesListWrapper = lazy(
  () => import("@presentation/pages/general/roles")
);

const ImageBannerListWrapper = lazy(
  () => import("@presentation/pages/general/imageBanner")
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
    {
      path: "adduser",
      title: "SIDEBAR-ADD-USER",
      component: RegisterWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "roles",
      title: "SIDEBAR-ADD-ROLE",
      component: RolesListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "banner",
      title: "SIDEBAR-Banner-Image",
      component: ImageBannerListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { GeneralRoute };
