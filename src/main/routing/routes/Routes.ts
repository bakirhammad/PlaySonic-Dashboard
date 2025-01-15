import { FC } from "react";
import { PageLink } from "@presentation/layout/core";
import { DashboardRoute } from "./DashboardRoute";
import { DirectClientsRouter } from "./DirectClients";
import { ClubRoute } from "./ClubRoute";
import { CourtRoute } from "./CourtRoute";
import { GeneralRoute } from "./GeneralRoute";
import { ReservationRoute } from "./ReservationRoute";
import { ClubAdminRoutes } from "./ClubAdminRoutes";

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
  DirectClientsRouter,
  ClubRoute,
  CourtRoute,
  GeneralRoute,
  ReservationRoute,
  ClubAdminRoutes
];

export { routes };
