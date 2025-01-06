import { SightSeeingWrapper } from "@presentation/pages/sightSeeing";
import { Route } from "./Routes";
import { lazy } from "react";

const CourtListWrapper = lazy(
  () => import("@presentation/pages/court")
);
const CourtScheduleListWrapper = lazy(
  () => import("@presentation/pages/courtSchedule")
);
const SlotTypeListWrapper = lazy(
  () => import("@presentation/pages/slotType")
);
const CourtSlotsListWrapper = lazy(
  () => import("@presentation/pages/courtSlots")
);

const CourtRoute: Route = {
  path: "/apps/court",
  title: "",
  component: SightSeeingWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "courtlist",
      title: "SIDEBAR-COURT",
      component: CourtListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "schedule",
      title: "SIDEBAR-COURT-SCHEDULE",
      component: CourtScheduleListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "slottype",
      title: "SIDEBAR-SLOT-TYPE",
      component: SlotTypeListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "courtslots",
      title: "SIDEBAR-COURT-SLOTS",
      component: CourtSlotsListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { CourtRoute };
