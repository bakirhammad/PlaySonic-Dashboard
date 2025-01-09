import { Route } from "./Routes";
import { lazy } from "react";
import { ReservationWrapper } from "@presentation/pages/reservation/ReservationWrapper";

const ReservationListWrapper = lazy(
  () => import("@presentation/pages/reservation")
);

const ReservationRoute: Route = {
  path: "/apps/reservation",
  title: "",
  component: ReservationWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "reservationlist",
      title: "SIDEBAR-RESERVATIONS",
      component: ReservationListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { ReservationRoute };
