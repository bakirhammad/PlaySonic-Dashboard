import { FC } from "react";
import { PageLink } from "@presentation/layout/core";
import { DashboardRoute } from "./DashboardRoute";
import { SightseeingRoute } from "./SightSeeingRoute";
import { DirectClientsRouter } from "./DirectClients";


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
  SightseeingRoute,
];

export { routes };
