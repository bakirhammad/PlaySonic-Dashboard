import { ClubAdminWrapper } from "@presentation/pages/clubAdmin/ClubAdminWrapper";
import { Route } from "./Routes";
import { lazy } from "react";

const MyCourtsWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myCourts")
);

const MyReservationsWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myReservations")
);

const ViewCourtWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myCourts/components/ViewCourt")
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
      component: MyReservationsWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "viewcourt/:id",
      title: "SIDEBAR-Court",
      component: ViewCourtWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { ClubAdminRoutes };
