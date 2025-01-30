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
        to="/apps/general/banner"
        title="SIDEBAR-Banner-Image"
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/general/adduser"
        title="SIDEBAR-ADD-USER"
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/general/roles"
        title="SIDEBAR-ROLES"
        hasBullet={true}
      />
    </>
  );
};
export { SidebarGeneralMenuItems };
