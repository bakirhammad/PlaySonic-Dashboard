import { Route } from "./Routes";
import { lazy } from "react";
import { ClubWrapper } from "@presentation/pages/club/ClubWrapper";

const ClubListWrapper = lazy(
  () => import("@presentation/pages/club")
);


const ClubRoute: Route = {
  path: "/apps/club",
  title: "",
  component: ClubWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "clublist",
      title: "SIDEBAR-CLUB",
      component: ClubListWrapper,
      role: [],
      breadcrumbs: [],
    }
  ],
};

export { ClubRoute };
