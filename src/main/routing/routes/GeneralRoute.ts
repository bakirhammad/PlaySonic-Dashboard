import { SightSeeingWrapper } from "@presentation/pages/sightSeeing";
import { Route } from "./Routes";
import { lazy } from "react";

const SlotTypeListWrapper = lazy(
  () => import("@presentation/pages/slotType")
);


const GeneralRoute: Route = {
  path: "/apps",
  title: "",
  component: SightSeeingWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "slottype",
      title: "SIDEBAR-SLOT-TYPE",
      component: SlotTypeListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { GeneralRoute };
