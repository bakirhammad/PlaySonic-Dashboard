import { FC } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarAdminControlMenuItems: FC = () => {
  return (
    <>
      <SidebarMenuItem
        to="/apps/admin/adminusers"
        title="SIDEBAR-USERS"
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/admin/roles"
        title="SIDEBAR-ROLES"
        hasBullet={true}
      />
      
      {/* ----- Until api done ---- */}

         <SidebarMenuItem
        to="/apps/admin/playsonicusers"
        title="SIDEBAR-PLAYSONIC-USERS"
        hasBullet={true}
      /> 
    </>
  );
};
export { SidebarAdminControlMenuItems };
