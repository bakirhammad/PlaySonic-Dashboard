import { SightSeeingWrapper } from "@presentation/pages/sightSeeing";
import { Route } from "./Routes";
import { lazy } from "react";

const ClubListWrapper = lazy(
  () => import("@presentation/pages/club")
);


const ClubRoute: Route = {
  path: "/apps/club",
  title: "",
  component: SightSeeingWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    // {
    //   path: "",
    //   title: "SIGHT-SEEING-PAGE-TITLE",
    //   component: SightSeeingPannelMain,
    //   role: [],
    //   breadcrumbs: SightSeeingBreadcrumbs,
    // },
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
