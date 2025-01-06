import { FC } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarCourtMenuItems: FC = () => {
  return (
    <>
      <SidebarMenuItem
        to="/apps/court/courtlist"
        title={"SIDEBAR-COURT"}
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/court/schedule"
        title={"SIDEBAR-COURT-SCHEDULE"}
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/court/courtslots"
        title="SIDEBAR-COURT-SLOTS"
        hasBullet={true}
      />
    </>
  );
};
export { SidebarCourtMenuItems };
