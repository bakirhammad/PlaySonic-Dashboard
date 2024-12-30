import { FC } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarSightSeeingMenuItems: FC = () => {
  return (
    <>
      <SidebarMenuItem
        to="/apps/sightseeing/category"
        title={"SIDEBAR-SIGHTSEEING-CATEGORY"}
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/sightseeing/list"
        title={"SIDEBAR-SIGHT-SEEING"}
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/sightseeing/sightseeingtsupplier"
        title={"SIDEBAR-SIGHT-SEEING-SUPPLIER"}
        hasBullet={true}
      />
    </>
  );
};
export { SidebarSightSeeingMenuItems };
