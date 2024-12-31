import { SightSeeingWrapper } from "@presentation/pages/sightSeeing";
import { Route } from "./Routes";
import { lazy } from "react";

const ClubListWrapper = lazy(
  () => import("@presentation/pages/club")
);

const CourtListWrapper = lazy(
  () => import("@presentation/pages/court")
);

const ClubRoute: Route = {
  path: "/apps",
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
      path: "club",
      title: "SIDEBAR-CLUB",
      component: ClubListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "court",
      title: "SIDEBAR-COURT",
      component: CourtListWrapper,
      role: [],
      breadcrumbs: [],
    },

  ],
};

export { ClubRoute };
