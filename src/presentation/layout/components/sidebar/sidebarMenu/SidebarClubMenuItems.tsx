import { FC } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarClubMenuItems: FC = () => {
  return (
    <>
      <SidebarMenuItem
        to="/apps/club/clublist"
        title={"SIDEBAR-CLUB"}
        hasBullet={true}
      />
    </>
  );
};
export { SidebarClubMenuItems };
