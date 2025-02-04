import { Route } from "./Routes";
import { lazy } from "react";
import { CourtWrapper } from "@presentation/pages/court/CourtWrapper";

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
  component: CourtWrapper,
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
    {
      path: "slottype",
      title: "SIDEBAR-SLOT-TYPE",
      component: SlotTypeListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "courtslots/:courtId",
      title: "SIDEBAR-COURT-SLOTS",
      component: CourtSlotsListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "courtschedule/:courtId",
      title: "SIDEBAR-COURT-SCHEDULE",
      component: CourtScheduleListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { CourtRoute };
