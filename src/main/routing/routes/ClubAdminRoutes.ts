import { ClubAdminWrapper } from "@presentation/pages/clubAdmin/ClubAdminWrapper";
import { Route } from "./Routes";
import { lazy } from "react";

const MyCourtsWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myCourts")
);

const CityListWrapper = lazy(
  () => import("@presentation/pages/general/city")
);


const ClubAdminRoutes: Route = {
  path: "/apps",
  title: "",
  component: ClubAdminWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "mycourts",
      title: "SIDEBAR-My-Courts",
      component: MyCourtsWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "myreservations",
      title: "SIDEBAR-My-Reservations",
      component: CityListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { ClubAdminRoutes };
