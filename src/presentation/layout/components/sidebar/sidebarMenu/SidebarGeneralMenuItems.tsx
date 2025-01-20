import { FC } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarGeneralMenuItems: FC = () => {
  return (
    <>
      <SidebarMenuItem
        to="/apps/general/countrylist"
        title={"SIDEBAR-COUNTRY"}
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/general/citylist"
        title={"SIDEBAR-Cities"}
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/general/arealist"
        title="SIDEBAR-Area"
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/general/register"
        title="SIDEBAR-REGISTER"
        hasBullet={true}
      />
    </>
  );
};
export { SidebarGeneralMenuItems };
