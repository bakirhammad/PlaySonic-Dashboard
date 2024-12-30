import { SightSeeingWrapper } from "@presentation/pages/sightSeeing";
import { Route } from "./Routes";
import { PageLink } from "@presentation/layout/core";
import { lazy } from "react";

const SightSeeingPannelMain = lazy(
  () => import("@presentation/pages/sightSeeing/SightSeeingPannelMain")
);

const SightSeeingTourListWrapper = lazy(
  () => import("@presentation/pages/sightSeeing/SightSeeingTour")
);

const SightSeeingCategoryListWrapper = lazy(
  () => import("@presentation/pages/sightSeeing/SightSeeingCategory")
);

const SightSeeingSupplierListWrapper = lazy(
  () => import("@presentation/pages/sightSeeing/SightSeeingSupplier")
);

const SightSeeingTourRateHistory = lazy(
  () => import("@presentation/pages/sightSeeing/SightSeeingTourRateHistory")
);
const SightSeeingTourRateListWrapper = lazy(
  () => import("@presentation/pages/sightSeeing/SightSeeingTourRate")
);
// >>>>>>>>>>

const ClubListWrapper = lazy(
  () => import("@presentation/pages/club")
);

const SightSeeingBreadcrumbs: Array<PageLink> = [
  {
    title: "SIGHT-SEEING-PANNEL",
    path: "/apps/sightseeing",
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
const SightSeeingTourRateHistoryBreadcrumbs: Array<PageLink> = [
  ...SightSeeingBreadcrumbs,
  {
    title: "SIGHT-SEEING-TOUR-RATE-PAGE_TITLE",
    path: "sightseeingttourrate/:sightSeeingSupplierId",
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

const SightseeingRoute: Route = {
  path: "/apps/sightseeing",
  title: "",
  component: SightSeeingWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "",
      title: "SIGHT-SEEING-PAGE-TITLE",
      component: SightSeeingPannelMain,
      role: [],
      breadcrumbs: SightSeeingBreadcrumbs,
    },
    {
      path: "list",
      title: "SIDEBAR-SIGHT-SEEING",
      component: SightSeeingTourListWrapper,
      role: [],
      breadcrumbs: SightSeeingBreadcrumbs,
    },
    {
      path: "category",
      title: "SIGHT-SEEING-CATEGORY-PAGE_TITLE",
      component: SightSeeingCategoryListWrapper,
      role: [],
      breadcrumbs: SightSeeingBreadcrumbs,
    },
    {
      path: "sightseeingtsupplier",
      title: "SIGHT-SEEING-SUPPLIER-PAGE_TITLE",
      component: SightSeeingSupplierListWrapper,
      role: [],
      breadcrumbs: SightSeeingBreadcrumbs,
    },
    {
      path: "sightseeingttourrate/:sightSeeingSupplierId",
      title: "SIGHT-SEEING-TOUR-RATE-PAGE_TITLE",
      component: SightSeeingTourRateListWrapper,
      role: [],
      breadcrumbs: SightSeeingBreadcrumbs,
    },
    {
      path: "sightseeingttourrate/:sightSeeingSupplierId/history",
      title: "HISTORY",
      component: SightSeeingTourRateHistory,
      role: [],
      breadcrumbs: SightSeeingTourRateHistoryBreadcrumbs,
    },

    // >>>>>>>
    {
      path: "clubs",
      title: "SIDEBAR-CLUB",
      component: ClubListWrapper,
      role: [],
      breadcrumbs: SightSeeingBreadcrumbs,
    },

  ],
};

export { SightseeingRoute };
