import { PageLink } from "@presentation/layout/core";
import { Route } from "./Routes";
import { lazy } from "react";

const DashboardWrapper = lazy(
  () => import("@presentation/pages/dashboard/DashboardWrapper")
);

const DashboardBreadcrumbs: Array<PageLink> = [];

const DashboardRoute: Route = {
  path: "dashboard",
  title: "MENU.DASHBOARD",
  component: DashboardWrapper,
  role: [],
  breadcrumbs: DashboardBreadcrumbs,
  children: [],
};

export { DashboardRoute };
