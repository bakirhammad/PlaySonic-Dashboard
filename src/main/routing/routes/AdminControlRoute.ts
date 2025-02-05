import { Route } from "./Routes";
import { lazy } from "react";
import { GeneralWrapper } from "@presentation/pages/general/GeneralWrapper";


const AdminUsersListWrapper = lazy(
  () => import("@presentation/pages/general/adminUsers")
);

const RolesListWrapper = lazy(
  () => import("@presentation/pages/general/roles")
);

const PlaysonicUsersListWrapper = lazy(
  () => import("@presentation/pages/general/playsonicUsers")
);

const UserTransectionsListWrapper = lazy(
  () => import("@presentation/pages/general/playsonicUsers/components/Transections")
);

const AdminControlRoute: Route = {
  path: "/apps/admin",
  title: "",
  component: GeneralWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "adminusers",
      title: "SIDEBAR-USERS",
      component: AdminUsersListWrapper,
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
      path: "playsonicusers",
      title: "SIDEBAR-PLAYSONIC-USERS",
      component: PlaysonicUsersListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "usertransection/:userId",
      title: "SIDEBAR-USER-TRANSECTOINS",
      component: UserTransectionsListWrapper,
      role: [],
      breadcrumbs: [],
    }
  ],
};

export { AdminControlRoute };
