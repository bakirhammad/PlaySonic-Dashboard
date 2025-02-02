import { FC } from "react";
import { PageLink } from "@presentation/layout/core";
import { DashboardRoute } from "./DashboardRoute";
import { ClubRoute } from "./ClubRoute";
import { CourtRoute } from "./CourtRoute";
import { GeneralRoute } from "./GeneralRoute";
import { ReservationRoute } from "./ReservationRoute";
import { ClubAdminRoutes } from "./ClubAdminRoutes";
import { AdminControlRoute } from "./AdminControlRoute";

export interface Route {
  path: string;
  title: string;
  component: FC;
  role: string[];
  breadcrumbs: PageLink[];
  children?: {
    path: string;
    title: string;
    component: FC;
    role: string[];
    breadcrumbs: PageLink[];
  }[];
}
const routes: Route[] = [
  DashboardRoute,
  ClubRoute,
  CourtRoute,
  GeneralRoute,
  ReservationRoute,
  ClubAdminRoutes,
  AdminControlRoute
];

export { routes };
