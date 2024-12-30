import { PageLink } from "@presentation/layout";
import { Route } from "./Routes";
import { lazy } from "react";
import DirectClietnsWrapper from "@presentation/pages/directClients/DirectClientsWrapper";

const DirectClientsPannelMain = lazy(
  () => import("@presentation/pages/directClients/DirectClientsPannelMain")
);
const ManageClients = lazy(
  () => import("@presentation/pages/directClients/manageClients")
);


export type FixPackagesBreadcrumbsType = {
  breadcrumbs?: Array<PageLink>;
};

const DirectClientsBreadcrumbs: Array<PageLink> = [
  {
    title: "DirectClients-PANNEL",
    path: "/apps/directclients",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];
const DirectClientsRouter: Route = {
  path: "/apps/directclients",
  title: "",
  component: DirectClietnsWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "",
      title: "DIRECT-CLIENTS-PAGE_TITLE",
      component: DirectClientsPannelMain,
      role: [],
      breadcrumbs: DirectClientsBreadcrumbs,
    },
    {
      path: "manageclients",
      title: "SIDEBAR-MANAGE-CLIENTS",
      component: ManageClients,
      role: [],
      breadcrumbs: DirectClientsBreadcrumbs,
    }
  ],
};

export { DirectClientsRouter };